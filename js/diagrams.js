function draw() {
    d3.selectAll('#line_chart_slider > *').remove();

    const container = $("#line_chart_slider")
    const margin = {top: 5, right: 5, bottom: 20, left: 40}
    let width = container.innerWidth() - margin.left - margin.right,
        height = container.innerHeight() - margin.top - margin.bottom;

    // const parseDate = d3.timeFormat("%d-%b-%y");
    // const n = 100;
    // let data = null
    let svg = d3.select("#line_chart_slider")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("data/data.csv", function (d) {
        return {date: d3.timeParse("%Y-%m-%d")(d.date), value: d.value}
    }).then(data => {
        let x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d.date; }))
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        let y = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return +d.value; })])
            .range([ height, 0 ]);
        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("d", d3.line()
                .x(function(d) { return x(d.date) })
                .y(function(d) { return y(d.value) })
            )
    });
}

draw()
d3.select(window).on('resize', draw);
