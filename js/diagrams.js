function draw_line(param) {
    const container = $(param.target)
    const margin = {top: 40, right: 55, bottom: 18, left: 60}
    let width = container.innerWidth() - margin.left - margin.right,
        height = container.innerHeight() - margin.top - margin.bottom;

    let svg = d3.select(param.target)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    d3.dsv(param.data1.delimiter, param.data1.src, function (d) {
        return {
            date1: d3.timeParse(param.data1.x_date_format)(d[param.data1.x]),
            value1: d[param.data1.y] / param.data1.y_scale,
            date2: d3.timeParse(param.data2.x_date_format)(d[param.data2.x]),
            value2: d[param.data2.y] / param.data2.y_scale,
        }
    }).then(data => {
        let x = d3.scaleTime()
            .domain(d3.extent(data, function (d) {
                return d.date1;
            }))
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0, " + height + ")")
            .attr("class", "tick")
            .call(d3.axisBottom(x)
                .tickSizeInner(0)
                .tickSizeOuter(2)
                .tickPadding(10)
                .tickFormat(d3.timeFormat("%b"))
            );

        let y_left = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) {
                return +d.value1;
            })])
            .range([height, 0]);
        svg.append("g")
            .attr("class", "tick")
            .call(d3.axisLeft(y_left)
                .ticks(6)
                .tickSizeInner(0)
                .tickSizeOuter(0)
                .tickPadding(10)
            );

        let y_right = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) {
                return +d.value2;
            })])
            .range([height, 0]);
        svg.append("g")
            .attr("transform", "translate(" + width + ", 0)")
            .attr("class", "tick")
            .call(d3.axisRight(y_right)
                .ticks(6)
                .tickSizeInner(0)
                .tickSizeOuter(0)
                .tickPadding(10)
            );

        svg.append("path")
            .datum(data)
            .attr("class", "line line1")
            .attr("fill", "none")
            .attr("d", d3.line()
                .x(function (d) {
                    return x(d.date1)
                })
                .y(function (d) {
                    return y_left(d.value1)
                })
            )

        svg.append("path")
            .datum(data)
            .attr("class", "line line2")
            .attr("fill", "none")
            .attr("d", d3.line()
                .x(function (d) {
                    return x(d.date2)
                })
                .y(function (d) {
                    return y_right(d.value2)
                })
            )

        svg.append('text')
            .attr('class', 'chart_title')
            .attr('x', -height / 2)
            .attr('y', 0)
            .attr("transform", "translate(-45, 0) rotate(-90)")
            .attr('text-anchor', 'middle')
            .text(param.title);
    });
}

function draw_bar() {
    // set the dimensions and margins of the graph
    const container = $("#case_hist")
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = container.innerWidth() - margin.left - margin.right,
        height = container.innerHeight() - margin.top - margin.bottom;

// set the ranges
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
    var y = d3.scaleLinear()
        .range([height, 0]);

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
    var svg = d3.select("#case_hist").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

// get the data
    d3.csv("data/rki/rki_DE-all.csv", function (data) {
        return {
            date: data.Meldedatum,
            "0-4": +data["M_A00-A04_c"],
            "5-14": +data["M_A05-A14_c"],
            "15-34": +data["M_A15-A34_c"],
            "35-59": +data["M_A35-A59_c"],
            "60-79": +data["M_A60-A79_c"],
            "80+": +data["M_A80+_c"]
        }
    }).then(function (data) {
        let row = d3.index(data, d => d.date)
        // console.log(row)
        // console.log(slice)
        let select_date = row.get("2020-12-12")
        delete select_date.date
        // console.log(select_date)
        let array = []
        Object.entries(select_date).forEach(ele => {
            array.push({
                age: ele[0],
                value: ele[1]
            });
        })
        return array
    }).then(function (data) {
        console.log(data)
            // Scale the range of the data in the domains
            x.domain(data.map(function (d) {
                return d.age;
            }));
            y.domain([0, d3.max(data, function (d) {
                return d.value;
            })]);

            // append the rectangles for the bar chart
            svg.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function (d) {
                    return x(d.age);
                })
                .attr("width", x.bandwidth())
                .attr("y", function (d) {
                    return y(d.value);
                })
                .attr("height", function (d) {
                    return height - y(d.value);
                });

            // add the x Axis
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));
        });
}

function refresh() {
    d3.selectAll('#oneright svg').remove();
    const param1 = {
        target: "#line_chart_slider_top",
        title: "Deaths",
        data1: {
            src: "data/rki/rki_DE-all.csv",
            delimiter: ",",
            x: "Meldedatum",
            x_date_format: "%Y-%m-%d",
            y: "NeuerTodesfall",
            y_scale: 1
        },
        data2: {
            src: "data/rki/rki_DE-all.csv",
            delimiter: ",",
            x: "Meldedatum",
            x_date_format: "%Y-%m-%d",
            y: "AnzahlTodesfall",
            y_scale: 1
        }
    };
    draw_line(param1)
    const param2 = {
        target: "#line_chart_slider_bottom",
        title: "Cases",
        data1: {
            src: "data/rki/rki_DE-all.csv",
            delimiter: ",",
            x: "Meldedatum",
            x_date_format: "%Y-%m-%d",
            y: "NeuerFall",
            y_scale: 1000
        },
        data2: {
            src: "data/rki/rki_DE-all.csv",
            delimiter: ",",
            x: "Meldedatum",
            x_date_format: "%Y-%m-%d",
            y: "AnzahlFall",
            y_scale: 1000
        }

    };
    draw_line(param2)
    draw_bar()
}

refresh()
d3.select(window).on('resize', refresh);
