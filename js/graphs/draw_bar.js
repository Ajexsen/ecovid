function draw_bar(param) {
    // set the dimensions and margins of the graph
    const container = $(param.target)
    const margin_side = 0
    const margin = {
            top: 0,
            right: margin_side * (param.direction === "right"),
            bottom: 0,
            left: margin_side * (param.direction === "left")
        },
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

    // console.log(param.date, param)
    let select_date1 = param.src.get(param.date[0])
    let select_date2 = param.src.get(param.date[1])
    let data1 = select_date1[param.gender + param.type]
    let data2 = select_date2[param.gender + param.type]
    let array = []
    Object.entries(data2).forEach(ele => {
        array.push({
            age: ele[0],
            value: ele[1] - data1[ele[0]]
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

    if (param.direction === "left") {
        bar.attr("x", function (d) {
            return x(d.value);
        })
    } else {
        bar.attr("x", function () {
            return start;
        })
    }

    svg.selectAll("text")
        .data(array)
        .enter()
        .append("text")
        .attr("class", function (d) {
            let indicator = (param.direction === "right") === (x(d.value) < width / 2)
            if (indicator) {
                return "bar_label bar_label_dark";
            } else {
                return "bar_label bar_label_light";
            }
        })
        .attr("x", function (d) {
            return x(d.value);
        })
        .attr("y", function (d) {
            return y(d.age);
        })
        .attr("height", y.bandwidth())
        .attr("transform", function (d) {
            let indicator = x(d.value) < width / 2
            return "translate(" + 10 * (indicator - 0.5) + "," + y.bandwidth() / 2 + ")"
        })
        .text(function (d) {
            return d.value;
        })
        .attr('text-anchor', function (d) {
            if (x(d.value) > width / 2) return "end";
            else return "start";
        })
        .attr("dominant-baseline", "middle")
}