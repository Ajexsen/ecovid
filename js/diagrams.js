const report_date = "2020-12-12";
const data_source = "data/rki/rki_DE-all.csv";
const rki_dateFormat = "%Y-%m-%d";

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
            .attr("class", "area_total")
            .attr("d", d3.area()
                .x(function (d) {
                    return x(d.date2)
                })
                .y0(height)
                .y1(function (d) {
                    return y_right(d.value2)
                })
            );

        svg.append("path")
            .datum(data)
            .attr("class", "line line_total")
            .attr("d", d3.line()
                .x(function (d) {
                    return x(d.date2)
                })
                .y(function (d) {
                    return y_right(d.value2)
                })
            );

        svg.append("path")
            .datum(data)
            .attr("class", "area_new")
            .attr("d", d3.area()
                .x(function (d) {
                    return x(d.date1)
                })
                .y0(height)
                .y1(function (d) {
                    return y_left(d.value1)
                })
            );

        svg.append("path")
            .datum(data)
            .attr("class", "line line_new")
            .attr("d", d3.line()
                .x(function (d) {
                    return x(d.date1)
                })
                .y(function (d) {
                    return y_left(d.value1)
                })
            )

        svg.append('text')
            .attr('class', 'chart_title')
            .attr('x', -height / 2)
            .attr('y', 0)
            .attr("transform", "translate(-45, 0) rotate(-90)")
            .attr('text-anchor', 'middle')
            .text(param.title);
            
        svg.append('text')
            .attr('class', 'axis_label')
            .attr('x', 0)
            .attr('y', 0)
            .attr("transform", "translate(-12, -20)")
            .text("New");
            
        svg.append('text')
            .attr('class', 'axis_label')
            .attr('x', width)
            .attr('y', 0)
            .attr("transform", "translate(-12, -20)")
            .text("Total");
    });
}

function draw_bar(param) {
    // set the dimensions and margins of the graph
    const container = $(param.target)
    const margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = container.innerWidth() - margin.left - margin.right,
        height = container.innerHeight() - margin.top - margin.bottom;

// set the ranges
    let start = 0, end = 0, direction = 1;
    if (param.direction === "left") {
        start = width;
    } else {
        end = width;
        direction = -1;
    }
    let x = d3.scaleLinear().range([start, end]);
    let y = d3.scaleBand()
        .range([height, 0])
        .padding(0.07);

    let svg = d3.select(param.target).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

    d3.csv(param.src, function (data) {
        return {
            date: data.Meldedatum,
            "0-4": +data[param.gender + "_A00-A04_" + param.type],
            "5-14": +data[param.gender + "_A05-A14_" + param.type],
            "15-34": +data[param.gender + "_A15-A34_" + param.type],
            "35-59": +data[param.gender + "_A35-A59_" + param.type],
            "60-79": +data[param.gender + "_A60-A79_" + param.type],
            "80+": +data[param.gender + "_A80+_" + param.type]
        }
    }).then(function (data) {
        let row = d3.index(data, d => d.date)
        let select_date = row.get(param.date)
        delete select_date.date
        let array = []
        Object.entries(select_date).forEach(ele => {
            array.push({
                age: ele[0],
                value: ele[1]
            });
        })
        return array
    }).then(function (data) {
        // Scale the range of the data in the domains
        x.domain([0, d3.max(data, function (d) {
            return d.value;
        })]);
        y.domain(data.map(function (d) {
            return d.age;
        }));

        // append the rectangles for the bar chart
        let bar = svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("height", y.bandwidth())
            .attr("y", function (d) {
                return y(d.age);
            })
            .attr("width", function (d) {
                return (start - x(d.value)) * direction;
            });

        if (param.direction === "left") {
            bar.attr("x", function (d) {
                return x(d.value);
            })
        } else {
            bar.attr("x", function () {
                return start;
            })
        }
        
    });
}

function draw_histogramm(param){
    const container = $(param.target)
    const margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = container.innerWidth() - margin.left - margin.right,
        height = container.innerHeight() - margin.top - margin.bottom;
    console.log(height)

    let dataset = [ 5, 10, 13, 19, 21 ];
    let barPadding = 1;
    let svg = d3.select(param.target)
        .append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    let xScale = d3.scaleBand()
        .domain(d3.range(dataset.length))
        .range([0, width]);

    let yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset)])
        .range([height, 0]);

    let xAxis = d3.axisBottom().scale(xScale)

    let yAxis = d3.axisLeft().scale(yScale)
    
    // svg.selectAll("rect")
    //     .data(dataset)
    //     .enter()
    //     .append("rect")
    //     .attr("x", function(d, i){return xScale(i)})
    //     .attr("y", function(d){return height - yScale(d)})
    //     .attr("fill", "#5D001E")
    //     .attr("width", width / dataset.length - barPadding)
    //     .attr("height", function(d){return yScale(d);});

    svg.append("g")
        .attr("transform", "translate(0, " + margin.top  +")")
        .call(xAxis);
    
    svg.append("g")
        .attr("transform", "translate( 0, 0)")
        .call(yAxis)
    }

const bar_param_case_m = {
    src: data_source,
    target: "#case_hist_left",
    gender: "M",
    type: "c",
    date: report_date,
    direction: "left"
};
const bar_param_case_w = {
    src: data_source,
    target: "#case_hist_right",
    gender: "W",
    type: "c",
    date: report_date,
    direction: "right"
};
const bar_param_death_m = {
    src: data_source,
    target: "#death_hist_left",
    gender: "M",
    type: "d",
    date: report_date,
    direction: "left"
};
const bar_param_death_w = {
    src: data_source,
    target: "#death_hist_right",
    gender: "W",
    type: "d",
    date: report_date,
    direction: "right"
};

const line_param_death = {
    target: "#line_chart_slider_top",
    title: "Deaths",
    data1: {
        src: data_source,
        delimiter: ",",
        x: "Meldedatum",
        x_date_format: rki_dateFormat,
        y: "NeuerTodesfall",
        y_scale: 1
    },
    data2: {
        src: data_source,
        delimiter: ",",
        x: "Meldedatum",
        x_date_format: rki_dateFormat,
        y: "AnzahlTodesfall",
        y_scale: 1
    }
};
const line_param_case = {
    target: "#line_chart_slider_bottom",
    title: "Cases",
    data1: {
        src: data_source,
        delimiter: ",",
        x: "Meldedatum",
        x_date_format: rki_dateFormat,
        y: "NeuerFall",
        y_scale: 1000
    },
    data2: {
        src: data_source,
        delimiter: ",",
        x: "Meldedatum",
        x_date_format: rki_dateFormat,
        y: "AnzahlFall",
        y_scale: 1000
    }

};

function step() {
    let targetValue = 300
    currentValue = document.getElementById("date_slider").value
    updateBarData(currentValue);
    document.getElementById("date_slider").value = parseInt(currentValue) + 1
    
    if (currentValue > targetValue) {
        moving = false;
        currentValue = 0;
        clearInterval(timer);
        // timer = 0;
        playButton.text("Play");
        console.log("Slider moving: " + moving);
    }
}

function updateBarData(value) {
    d3.selectAll('#onerightmiddle svg').remove();
    let start_date = d3.timeParse(rki_dateFormat)("2020-01-02")
    let date = d3.timeFormat(rki_dateFormat)(d3.timeDay.offset(start_date, value))
    // console.log(start_date)
    // console.log(date)
    bar_param_case_m.date = date
    bar_param_case_w.date = date
    bar_param_death_m.date = date
    bar_param_death_w.date = date
    draw_bar(bar_param_case_m)
    draw_bar(bar_param_case_w)
    draw_bar(bar_param_death_m)
    draw_bar(bar_param_death_w)
}

function refresh() {
    d3.selectAll('#oneright svg').remove();
    draw_line(line_param_death)
    draw_line(line_param_case)
    draw_bar(bar_param_case_m)
    draw_bar(bar_param_case_w)
    draw_bar(bar_param_death_m)
    draw_bar(bar_param_death_w)
    
    d3.select("#play-button").on("click", function() {
    var button = d3.select(this);
    if (button.text() == "Pause") {
      moving = false;
      clearInterval(timer);
      // timer = 0;
      button.text("Play");
    } else {
      moving = true;
      timer = setInterval(step, 200);
      button.text("Pause");
    }
    console.log("Slider moving: " + moving);
  })
}

refresh()
d3.select(window).on('resize', refresh);
