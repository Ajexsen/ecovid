function update_transport_chart(type){
    d3.selectAll('#line_chart_transport svg').remove();
    if ( type === "flight" ){
        $("#flight_button").attr("src","images/flight_active.png")
        $("#rail_button").attr("src","images/rail_inactive.png")
        $("#bike_button").attr("src","images/bike_inactive.png")     
        transport_param = line_param_flight
    } else if (type === "rail"){
        $("#flight_button").attr("src","images/flight_inactive.png")
        $("#rail_button").attr("src","images/rail_active.png")
        $("#bike_button").attr("src","images/bike_inactive.png")       
        transport_param = line_param_rail
    } else if (type === "bike"){
        $("#flight_button").attr("src","images/flight_inactive.png")
        $("#rail_button").attr("src","images/rail_inactive.png")
        $("#bike_button").attr("src","images/bike_active.png")                 
        transport_param = line_param_bike
    }
    draw_lines(transport_param)
}

function update_econ_chart(type){
    d3.selectAll('#line_chart_econ svg').remove();
    if ( type === "import" ){
        $("#import_button").attr("src","images/import_active.png")
        $("#export_button").attr("src","images/export_inactive.png")      
        econ_param = line_param_import
    } else if (type === "export"){
        $("#import_button").attr("src","images/import_inactive.png")
        $("#export_button").attr("src","images/export_active.png")       
        econ_param = line_param_export
    }
    draw_lines(econ_param)
}

function draw_lines(param) {
    const container = $(param.target)
    const margin = {top: 40, right: 55, bottom: 60, left: 20}
    let width = container.innerWidth() - margin.left - margin.right,
        height = container.innerHeight() - margin.top - margin.bottom;
    let svg = d3.select(param.target)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")
            
    const n_data = param.data_files.length
    const div_width = width / n_data
    let datasets = []
    
    
    for(let i = 0; i < n_data; i++){
        path = param.src + param.data_files[i]
        datasets[i] = d3.csv(path, function (d) {
            return {
                date: d3.timeParse("%m")(d[param.x]),
                value: d[param.y]
            }
        })
    }
    
    Promise.all(datasets).then(function(data) {
        // data[0] will contain file1.csv
        // data[1] will contain file2.csv
        data_min = Array.from({length: n_data}, 
            (_, n) => d3.min(data[n], function (d) {
                return +d.value;
        }))
        
        data_max = Array.from({length: n_data}, 
            (_, n) => d3.max(data[n], function (d) {
                return +d.value;
        }))
        const max = Math.max(...data_max)
        const min = Math.min(...data_min)
        const buf = (max - min) * 0.1
        
        const x = d3.scaleTime()
                    .domain(d3.extent(data[0], function (d) {
                        return d.date;
                    }))
                    .range([0, width]);
        const y = d3.scaleLinear()
                    .domain([min-buf, max+buf])
                    .range([height, 0]);

        //svg.transition(); 
        
        svg.append("g")
            .attr("transform", "translate(0, " + height + ")")
            .attr("class", "tick")
            .call(d3.axisBottom(x)
                    .tickSizeInner(0)
                    .tickSizeOuter(2)
                    .tickPadding(10)
                    .tickFormat(d3.timeFormat("%b"))
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
                .tickSizeInner(0)
                .tickSizeOuter(0)                        
            ); 

        for(let i = n_data-1, k = 0 ; i >= 0 ; i--, k++){
            if(i === 0){
                svg.append("path")
                    .datum(data[i])
                    .attr("fill", "none")
                    .attr("stroke", param.line_colors[i])
                    .attr("stroke-width", 3)
                    .attr("d", d3.line()
                        .x(function(d) { return x(d.date) })
                        .y(function(d) { return y(d.value) }))
            } else {
                //console.log(i + ":")
                //console.log(data[i])
                svg.append("path")
                    .datum(data[i])
                    .attr("fill", "none")
                    .attr("stroke", param.line_colors[i])
                    .attr("stroke-width", 1.5)
                    .attr("d", d3.line()
                        .x(function(d) { return x(d.date) })
                        .y(function(d) { return y(d.value) })
                    )
            }
            
            svg.append("rect")
                .attr('class', 'legend_line')
                .attr("width", 20)
                .attr("height", 2)
                .style("fill", param.line_colors[i])
                .attr('class', 'axis_label')
                .attr('x', div_width*k + 60)
                .attr('y', height + 45)
                .attr("r", 6)

            svg.append("text")
                .attr('class', 'legend_text')
                .text(param.line_legends[i])
                .style("font-size", "15px")
                .attr('x', div_width*k + 60 + 30)
                .attr('y', height + 51)
        }        
    }) 
}