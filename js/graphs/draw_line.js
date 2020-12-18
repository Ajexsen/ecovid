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
        .domain([0, d3.max(param.src, function (d) {
            return +d[param.data2.y];
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
        .datum(param.src)
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
        .datum(data_all)
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
        .datum(param.src)
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
        .datum(param.src)
        .attr("class", "line line_new")
        .attr("d", d3.line()
            .x(function (d) {
                return x(d[param.x])
            })
            .y(function (d) {
                return y_left(d[param.data1.y])
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
}