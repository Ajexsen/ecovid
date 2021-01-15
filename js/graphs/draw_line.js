function draw_line(param) {
    const container = $(param.target)
    const margin = {top: 0, right: 55, bottom: 25, left: 60}
    let width = container.innerWidth() - margin.left - margin.right,
        height = container.innerHeight() - margin.top - margin.bottom;

    let range = +param.end;
    // let new_range = 0;
    // let n_data = +$("#date_slider").attr("max");
    // if (range <= 100)
    //     new_range = 100 * 1.5
    // else if (range >= n_data / 1.5) {
    //     new_range = n_data;
    // }
    // else
    //     new_range = ((range - 100) * (n_data - 100) / (n_data / 1.5 - 100 * 1.5)) + 100 * 1.5
    // let data_slice = param.src.slice(0, new_range + 1);
    let data_highlight = param.src.slice(0, range + 1);
    let data_grey = param.src.slice(range, param.src.length + 1);
    // let data_slice = param.src;

    let svg = d3.select(param.target)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    let x = d3.scaleTime()
        .domain(d3.extent(param.src, function (d) {
            return d[param.x];
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
        .domain([0, d3.max(param.src, function (d) {
            return +d[param.data1.y];
        }) + 0])
        .range([height, 0]);

    svg.append("g")
        .attr("class", "tick")
        .call(d3.axisLeft(y_left)
                .ticks(3)
                .tickSizeInner(0)
                .tickSizeOuter(0)
                .tickPadding(10)
        );

    let y_right = d3.scaleLinear()
        .domain([0, d3.max(param.src, function (d) {
            return +d[param.data2.y];
        }) + 0])
        .range([height, 0]);

    svg.append("g")
        .attr("transform", "translate(" + width + ", 0)")
        .attr("class", "tick")
        .call(d3.axisRight(y_right)
                .ticks(3)
                .tickSizeInner(0)
                .tickSizeOuter(0)
                .tickPadding(10)
            // .tickFormat(d3.format("s"))
        );

    svg.append("path")
        .datum(data_highlight)
        .attr("class", "area_total")
        .attr("d", d3.area()
            .x(function (d) {
                return x(d[param.x])
            })
            .y0(height)
            .y1(function (d) {
                return y_right(d[param.data2.y])
            })
        );

    svg.append("path")
        .datum(data_highlight)
        .attr("class", "line line_total")
        .attr("d", d3.line()
            .x(function (d) {
                return x(d[param.x])
            })
            .y(function (d) {
                return y_right(d[param.data2.y])
            })
        );

    svg.append("path")
        .datum(data_grey)
        .attr("class", "line line_grey")
        .attr("d", d3.line()
            .x(function (d) {
                return x(d[param.x])
            })
            .y(function (d) {
                return y_right(d[param.data2.y])
            })
        );

    svg.append("path")
        .datum(data_highlight)
        .attr("class", "area_new")
        .attr("d", d3.area()
            .x(function (d) {
                return x(d[param.x])
            })
            .y0(height)
            .y1(function (d) {
                return y_left(d[param.data1.y])
            })
        );

    svg.append("path")
        .datum(data_highlight)
        .attr("class", "line line_new")
        .attr("d", d3.line()
            .x(function (d) {
                return x(d[param.x])
            })
            .y(function (d) {
                return y_left(d[param.data1.y])
            })
        )

    svg.append("path")
        .datum(data_grey)
        .attr("class", "line line_grey")
        .attr("d", d3.line()
            .x(function (d) {
                return x(d[param.x])
            })
            .y(function (d) {
                return y_left(d[param.data1.y])
            })
        )

    svg.selectAll(".dots")
        .data(data_highlight.slice(data_highlight.length - 1, data_highlight.length))
        .enter()
        .append("circle")
        .attr("class", "dot_case")
        .attr("cx", function(d) { return x(d[param.x]) })
        .attr("cy", function(d) { return y_left(d[param.data1.y]) })
        .attr("r", 3)

    svg.append('text')
        .attr('class', 'chart_title')
        .attr('x', -height / 2)
        .attr('y', 0)
        .attr("transform", "translate(-45, 0) rotate(-90)")
        .attr('text-anchor', 'middle')
        .text(param.title);

    // if ("event_lines" in param) {
    //     // const parent_id = d3.select(param.target).node().parentNode.id;
    //     const event_area = $("#line_chart_area");
    //     let event_width = event_area.innerWidth(),
    //         event_height = event_area.innerHeight();
    //
    //     let event = d3.select("#line_chart_area")
    //         .append("svg")
    //         .attr("width", event_width)
    //         .attr("height", event_height)
    //         .append("g")
    //         // .attr("transform",
    //         //     "translate(" + margin.left + "," + margin.top + ")");
    //
    //     let events = param.event_lines;
    //     for (let key in events) {
    //         let x_pos = x(d3.timeParse("%Y-%m-%d")(key))
    //         // console.log(x)
    //         event.append("line")
    //             .attr("x1", x_pos)
    //             .attr("x2", x_pos)
    //             .attr("y1", 0)
    //             .attr("y2", event_height)
    //             .attr("stroke-width", 1)
    //             .attr("stroke", "black")
    //             .attr("stroke-dasharray", "4")
    //             .style("transform", "translateY(" + (-0) + "px)");
    //         let text = event.append("div")
    //         text
    //             .attr("class", "event_txt_label")
    //             .style("left", (x_pos - 5) + "px")
    //             .style("transform", (x_pos - 5) + "px")
    //             .text(events[key])
    //     }
    // }

    if (param.legend) {
        svg.append('text')
            .attr('class', 'axis_label')
            .attr('x', 0)
            .attr('y', 0)
            .attr("transform", "translate(-10, -20)")
            .text("New");

        svg.append('text')
            .attr('class', 'axis_label')
            .attr('x', width)
            .attr('y', 0)
            .attr("transform", "translate(-10, -20)")
            .text("Total");

        svg.append("rect")
            .attr('class', 'legend_new')
            .attr("x", -10)
            .attr("y", -14)
            .attr("width", 20)
            .attr("height", 3);

        svg.append("rect")
            .attr('class', 'legend_total')
            .attr("x", width - 10)
            .attr("y", -14)
            .attr("width", 22)
            .attr("height", 3);
    }
}