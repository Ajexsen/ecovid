function update_transport_chart(type){
    d3.selectAll('#line_chart_transport svg').remove();
    if ( type === "flight" ){
        transport_param = line_param_flight
    } else if (type === "rail"){
        transport_param = line_param_rail
    } else if (type === "bike"){
        transport_param = line_param_bike
    }
    draw_lines(transport_param)
}

let transport_param = line_param_flight

function draw_lines(param) {
    const container = $(param.target)
    const margin = {top: 40, right: 55, bottom: 60, left: 20}
    let width = container.innerWidth() - margin.left - margin.right,
        height = container.innerHeight() - margin.top - margin.bottom;
    //console.log(container.innerHeight())
    let svg = d3.select(param.target)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    const n_data = param.data_files.length
    const div_width = width / n_data

    let x = d3.scaleLinear()
    let y = d3.scaleLinear()
    for(let i = 0; i < n_data ; i++){
        path = param.src + param.data_files[i]
        d3.dsv(param.delimiter, path, function (d) {
            return {
                date: d.month, //d3.timeParse("%m")(d.month),
                value: d.count
            }
        }).then(data =>{

            if(i === 0){
                x = d3.scaleLinear()
                    .domain(d3.extent(data, function (d) {
                        return d.date;
                    }))
                    .range([0, width]);

                y = d3.scaleLinear()
                    .domain([0, d3.max(data, function (d) {
                        return +d.value;
                    })])
                    .range([height, 0]);

                svg.append("path")
                    .datum(data)
                    .attr("fill", "none")
                    .attr("stroke", param.line_colors[i])
                    .attr("stroke-width", 3)
                    .attr("d", d3.line()
                        .x(function(d) { return x(d.date) })
                        .y(function(d) { return y(d.value) }))
            } else {
                svg.append("path")
                    .datum(data)
                    .attr("fill", "none")
                    .attr("stroke", param.line_colors[i])
                    .attr("stroke-width", 1.5)
                    .attr("d", d3.line()
                        .x(function(d) { return x(d.date) })
                        .y(function(d) { return y(d.value) }))
            }
            if(i == n_data-1){
                // let x = d3.scaleTime()

                let x = d3.scaleLinear()
                    .domain(d3.extent(data, function (d) {
                        return d.date;
                    }))
                    .range([0, width]);

                let y = d3.scaleLinear()
                    .domain([0, d3.max(data, function (d) {
                        return +d.value;
                    })])
                    .range([height, 0]);

                svg.append("path")
                    .datum(data)
                    .attr("fill", "none")
                    .attr("stroke", param.line_colors[i])
                    .attr("stroke-width", 1.5)
                    .attr("d", d3.line()
                        .x(function(d) { return x(d.date) })
                        .y(function(d) { return y(d.value) })
                    )
            }
            //console.log("i=" + i)
            //console.log("n_data=" + n_data)
            if(i === 0){
                svg.append("g")
                    .attr("transform", "translate(0, " + height + ")")
                    .attr("class", "tick")
                    .call(d3.axisBottom(x)
                            .tickSizeInner(0)
                            .tickSizeOuter(2)
                            .tickPadding(10)
                        //.tickFormat(d3.timeFormat("%b"))
                    );
                svg.append("g")
                    .attr("transform", "translate(" + width + ", 0)")
                    .attr("class", "tick")
                    .call(d3.axisRight(y)
                        .ticks(5)
                        .tickSizeInner(0)
                        .tickSizeOuter(0)
                        .tickPadding(10)
                    );
                svg.append("g")
                    .attr("class", "tick")
                    .call(d3.axisLeft(y)
                        .ticks(0)
                    );
            }

            svg.append("rect")
                .attr('class', 'legend_line')
                .attr("width", 20)
                .attr("height", 2)
                .style("fill", param.line_colors[i])
                .attr('class', 'axis_label')
                .attr('x', div_width*i + 70)
                .attr('y', height + 45)
                .attr("r", 6)

            svg.append("text")
                .attr('class', 'legend_text')
                .text(param.line_legends[i])
                .style("font-size", "15px")
                .attr('x', div_width*i + 70 + 30)
                .attr('y', height + 51)

        })
    }
}