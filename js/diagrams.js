function draw() {
    d3.selectAll('#line_chart_slider > *').remove();

    const container = $("#line_chart_slider")
    const margin = {top: 18, right: 15, bottom: 18, left: 15}
    let width = container.innerWidth() - margin.left - margin.right,
        height = container.innerHeight() - margin.top - margin.bottom;

    const n = 100;

    let xScale = d3.scaleLinear()
        .domain([0, n-1]) // input
        .range([0, width]); // output

    let yScale = d3.scaleLinear()
        .domain([0, 1]) // input
        .range([height, 0]); // output

    let line = d3.line()
        .x(function(d, i) { return xScale(i); }) // set the x values for the line generator
        .y(function(d) { return yScale(d.y); }) // set the y values for the line generator
        .curve(d3.curveMonotoneX) // apply smoothing to the line

    let dataset = d3.range(n).map(function(d) { return {"y": d3.randomUniform(1)() } })

// 1. Add the SVG to the page and employ #2
    let svg = d3.select("#line_chart_slider").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// 3. Call the x axis in a group tag
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

// 4. Call the y axis in a group tag
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

// 9. Append the path, bind the data, and call the line generator
    svg.append("path")
        .datum(dataset) // 10. Binds data to the line
        .attr("class", "line") // Assign a class for styling
        .attr("d", line) // 11. Calls the line generator
        .attr("fill", "none");
}

//
// function resize() {
//     width = container.innerWidth() - margin.left - margin.right;
//     height = container.innerHeight() - margin.top - margin.bottom;
//     svg.attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g");
//     console.log(svg.attr('width'))
// }

// d3.select('#line_chart_slider')
//     .on("resize", function() {
//         width = container.innerWidth() - margin.left - margin.right;
//         height = container.innerHeight() - margin.top - margin.bottom;
//         svg.attr("width", width + margin.left + margin.right);
//         svg.attr("height", height + margin.top + margin.bottom);
//     });
draw()
d3.select(window).on('resize', draw);

// 12. Appends a circle for each datapoint
// svg.selectAll(".dot")
//     .data(dataset)
//     .enter().append("circle") // Uses the enter().append() method
//     .attr("class", "dot") // Assign a class for styling
//     .attr("cx", function(d, i) { return xScale(i) })
//     .attr("cy", function(d) { return yScale(d.y) })
//     .attr("r", 5)
    // .on("mouseover", function(a, b, c) {
    //     console.log(a)
    //     this.attr('class', 'focus')
    // })
    // .on("mouseout", function() {  })
      // .on("mousemove", mousemove);

// let focus = svg.append("g")
//       .attr("class", "focus")
//       .style("display", "none");

  // focus.append("circle")
  //     .attr("r", 4.5);
  //
  // focus.append("text")
  //     .attr("x", 9)
  //     .attr("dy", ".35em");

  // svg.append("rect")
  //     .attr("class", "overlay")
  //     .attr("width", width)
  //     .attr("height", height)
  //     .on("mouseover", function() { focus.style("display", null); })
  //     .on("mouseout", function() { focus.style("display", "none"); })
  //     // .on("mousemove", mousemove);

  // function mousemove() {
  //   var x0 = x.invert(d3.mouse(this)[0]),
  //       i = bisectDate(data, x0, 1),
  //       d0 = data[i - 1],
  //       d1 = data[i],
  //       d = x0 - d0.date > d1.date - x0 ? d1 : d0;
  //   focus.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
  //   focus.select("text").text(d);
  // }