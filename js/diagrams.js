function draw(param) {
    const container = $(param.target)
    const margin = {top: 5, right: 35, bottom: 18, left: 40}
    let width = container.innerWidth() - margin.left - margin.right,
        height = container.innerHeight() - margin.top - margin.bottom;

    let svg = d3.select(param.target)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    d3.dsv(param.delimiter, param.src, function (d) {
        return {date: d3.timeParse(param.x_date_format)(d[param.x]), value: d[param.y] / param.y_scale}
    }).then(data => {
        let x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d.date; }))
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0, " + height + ")")
            .attr("class", "tick")
            .call(d3.axisBottom(x)
                .ticks(6)
                // .tickSize(2)
                .tickSizeInner(0)
                .tickSizeOuter(2)
                .tickPadding(10)
            );

        let y_left = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return +d.value; })])
            .range([height, 0]);
        svg.append("g")
            .attr("class", "tick")
            .call(d3.axisLeft(y_left)
                .ticks(6)
                // .tickSize(2)
                .tickSizeInner(0)
                .tickSizeOuter(0)
                .tickPadding(10)
            );

        let y_right = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return +d.value; })])
            .range([height, 0]);
        svg.append("g")
            .attr("transform", "translate(" + width + ", 0)")
            .attr("class", "tick")
            .call(d3.axisRight(y_right)
                .ticks(8)
                // .tickSize(2)
                .tickSizeInner(0)
                .tickSizeOuter(0)
                .tickPadding(10)
            );

        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("d", d3.line()
                .x(function(d) { return x(d.date) })
                .y(function(d) { return y_left(d.value) })
            )

        svg.append('text')
            .attr('class', 'chart_title')
            // .attr("transform", "")
            .attr('x', - height / 2)
            .attr('y', 0)
            .attr("transform", "translate(-30, 0) rotate(-90)")
            .attr('text-anchor', 'middle')
            .text(param.title);
    });
}

function refresh() {
    d3.selectAll('#onerightbottom > div > *').remove();
    const param1 = {
        target: "#line_chart_slider_top",
        src: "data/destatis_air-passengers-german-airports_2008-2020.csv",
        delimiter: ";",
        title: "Deaths",
        x: "Month",
        x_date_format: "%Y-%m",
        y: "Embarking passengers",
        y_scale: 1
    };
    draw(param1)
    const param2 = {
        target: "#line_chart_slider_bottom",
        src: "data/flightradar24_number-of-commercial-fli.csv",
        delimiter: ",",
        title: "Cases",
        x: "DateTime",
        x_date_format: "%Y-%m-%d",
        y: "2019 7-day moving average",
        y_scale: 1000
    };
    draw(param2)
}

refresh()
d3.select(window).on('resize', refresh);
