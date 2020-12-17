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

    let svg = d3.select(param.target).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let select_date = data_rows.get(param.date)
    let array = []
    Object.entries(select_date[param.gender + param.type]).forEach(ele => {
        array.push({
            age: ele[0],
            value: ele[1]
        });
    });
    // Scale the range of the data in the domains
    let x = bar_chart_config[param.gender + param.type].x;
    let y = bar_chart_config[param.gender + param.type].y;
    x.range([start, end]);
    y.range([height, 0])
        .padding(0.07);

    // append the rectangles for the bar chart
    let bar = svg.selectAll(".bar")
        .data(array)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("height", y.bandwidth())
        .attr("y", function (d) {
            return y(d.age);
        })
        .attr("width", function (d) {
            return (start - x(d.value)) * direction;
        })
    bar.append('text')
        .attr('class', 'axis_label')
        .attr("x", (width / 2))
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        // .attr('x', 20)
        // .attr('y', 20)
        // .attr("transform", "translate(-12, -20)")
        .text("Male");

    if (param.direction === "left") {
        bar.attr("x", function (d) {
            return x(d.value);
        })
    } else {
        bar.attr("x", function () {
            return start;
        })
    }
}