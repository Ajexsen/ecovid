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
                    .ticks(5)
                    .tickSizeInner(0)
                    .tickSizeOuter(0)
                    .tickPadding(10)
                // .tickFormat(d3.format("s"))
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
                    .ticks(5)
                    .tickSizeInner(0)
                    .tickSizeOuter(0)
                    .tickPadding(10)
                // .tickFormat(d3.format("s"))
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

        if (param.legend) {
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

            svg.append("rect")
                .attr('class', 'legend_new')
                .attr("x", -12)
                .attr("y", -14)
                .attr("width", 20)
                .attr("height", 3);

            svg.append("rect")
                .attr('class', 'legend_total')
                .attr("x", width - 12)
                .attr("y", -14)
                .attr("width", 22)
                .attr("height", 3);
        }
    });
}