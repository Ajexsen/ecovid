function draw_line(param) {
    const container = $(param.target)
    const margin = {top: 10, right: 55, bottom: 25, left: 55}
    let width = container.innerWidth() - margin.left - margin.right,
        height = container.innerHeight() - margin.top - margin.bottom;

    let start_date = +param.start;
    let end_date = +param.end;
    let data_grey1 = param.src.slice(0, start_date + 1);
    let data_highlight = param.src.slice(start_date, end_date + 1);
    let data_grey2 = param.src.slice(end_date, param.src.length + 1);

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
            .tickFormat(function (date) {
                if (d3.timeYear(date) < date) {
                    return d3.timeFormat('%b')(date);
                } else {
                    return d3.timeFormat('%Y')(date);
                }
            })
        );

    let y_left = d3.scaleLinear()
        .domain([0, d3.max(param.src, function (d) {
            return +d[param.data1.y];
        }) * 1.1])
        .range([height, 0]);

    svg.append("g")
        .attr("class", "tick")
        .call(d3.axisLeft(y_left)
            .ticks(3)
            .tickSizeInner(0)
            .tickSizeOuter(0)
            .tickPadding(10)
            .tickFormat(d3.format(".1s"))
        );

    let y_right = d3.scaleLinear()
        .domain([0, d3.max(param.src, function (d) {
            return +d[param.data2.y];
        }) * 1.1])
        .range([height, 0]);

    svg.append("g")
        .attr("transform", "translate(" + width + ", 0)")
        .attr("class", "tick")
        .call(d3.axisRight(y_right)
            .ticks(3)
            .tickSizeInner(0)
            .tickSizeOuter(0)
            .tickPadding(10)
            .tickFormat(d3.format(".1s"))
        );

    svg.append("path")
        .datum(data_grey1)
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
        .datum(data_grey2)
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
        .datum(data_grey1)
        .attr("class", "line line_grey")
        .attr("d", d3.line()
            .x(function (d) {
                return x(d[param.x])
            })
            .y(function (d) {
                return y_left(d[param.data1.y])
            })
        )

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
        .datum(data_grey2)
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
        .attr("cx", function (d) {
            return x(d[param.x])
        })
        .attr("cy", function (d) {
            return y_left(d[param.data1.y])
        })
        .attr("r", 3)

    svg.append('text')
        .attr('class', 'chart_title')
        .attr('x', -height / 2)
        .attr('y', 0)
        .text(param.title)

    if ("event_lines" in param) {
        const event_area = $("#line_chart_event");
        let event_width = event_area.innerWidth(),
            event_height = event_area.innerHeight();

        let event_container = d3.select("#line_chart_event")

        let events = param.event_lines;
        for (let key in events) {
            let x_pos = x(d3.timeParse("%Y-%m-%d")(key))
            let text = event_container.append("div")
            text.attr("class", "event_txt_label")
                .style("transform", "translate(calc(" + (x_pos - 1) + "px - 100%), -100%) rotate(-90deg)")
                .text(events[key])
        }

        let event = event_container
            .append("svg")
            .attr("width", event_width)
            .attr("height", event_height)
            .append("g")

        for (let key in events) {
            let x_pos = x(d3.timeParse("%Y-%m-%d")(key))
            event.append("line")
                .attr("x1", x_pos)
                .attr("x2", x_pos)
                .attr("y1", 0)
                .attr("y2", event_height)
                .attr("class", "event_line")
                .style("transform", "translateY(" + (-0) + "px)");
        }
    }

    if (param.legend) {
        const legend_container = $("#place_holder_event")
        const legend_margin = {top: 10, right: 55, bottom: 10, left: 60}
        let legend_width = legend_container.innerWidth() - legend_margin.left - legend_margin.right,
            legend_height = legend_container.innerHeight() - legend_margin.top - legend_margin.bottom;

        let legend_svg = d3.select("#place_holder_event")
            .append("svg")
            .attr("width", legend_width + legend_margin.left + legend_margin.right)
            .attr("height", legend_height + legend_margin.top + legend_margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + legend_margin.left + "," + legend_margin.top + ")");

        legend_svg.append('text')
            .attr('class', 'axis_label')
            .attr('x', 0)
            .attr('y', legend_height - 5)
            .text("New");

        legend_svg.append("rect")
            .attr('class', 'legend_new')
            .attr("x", -10)
            .attr("y", legend_height)
            .attr("width", 20)
            .attr("height", 3);

        legend_svg.append('text')
            .attr('class', 'axis_label')
            .attr('x', width)
            .attr('y', legend_height - 5)
            .text("Total");

        legend_svg.append("rect")
            .attr('class', 'legend_total')
            .attr("x", width - 10)
            .attr("y", legend_height)
            .attr("width", 22)
            .attr("height", 3);
    }
}