function draw_histogram(param) {
    const container = $(param.target)
    const margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = container.innerWidth() - margin.left - margin.right,
        height = container.innerHeight() - margin.top - margin.bottom;
    console.log(height)

    let dataset = [5, 10, 13, 19, 21];
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
        .attr("transform", "translate(0, " + margin.top + ")")
        .call(xAxis);

    svg.append("g")
        .attr("transform", "translate( 0, 0)")
        .call(yAxis)
}