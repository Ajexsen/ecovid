function update_transport_chart(type) {
    if(type === transport_type){
        return
    }
    
    d3.selectAll('#line_chart_transport svg').remove();
    d3.selectAll('#line_chart_transport_legend *').remove();
    
    if (type === "flight") {
        transport_type = "flight"
        $("#flight_button").attr("src", "images/flight_active.png")
        $("#rail_button").attr("src", "images/rail_inactive.png")
        $("#bike_button").attr("src", "images/bike_inactive.png")
        transport_param = line_param_flight
    } else if (type === "rail") {
        transport_type = "rail"
        $("#flight_button").attr("src", "images/flight_inactive.png")
        $("#rail_button").attr("src", "images/rail_active.png")
        $("#bike_button").attr("src", "images/bike_inactive.png")
        transport_param = line_param_rail
    } else if (type === "bike") {
        transport_type = "bike"
        $("#flight_button").attr("src", "images/flight_inactive.png")
        $("#rail_button").attr("src", "images/rail_inactive.png")
        $("#bike_button").attr("src", "images/bike_active.png")
        transport_param = line_param_bike
    }
    draw_multiline(transport_param)
}

function update_econ_chart(type) {
    if(type === econ_type){
        return
    }    
    
    d3.selectAll('#line_chart_econ svg').remove();
    d3.selectAll('#line_chart_econ_legend *').remove();
    
    if (type === "import") {
        econ_type = "import"
        $("#import_button").attr("src", "images/import_active.png")
        $("#export_button").attr("src", "images/export_inactive.png")
        econ_param = line_param_import
    } else if (type === "export") {
        econ_type = "export"
        $("#import_button").attr("src", "images/import_inactive.png")
        $("#export_button").attr("src", "images/export_active.png")
        econ_param = line_param_export
    }
    draw_multiline(econ_param)
}

let transport_type = "flight"
let econ_type = "import"

function draw_multiline(param) {
    t = d3.transition()
        .duration(300)
        .ease(d3.easeLinear);    
    
    const container = $(param.target)
    const margin = {top: 0, right: 50, bottom: 25, left: 10}
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
    const month_width = width / 12
    let datasets = param.datasets

    Promise.all(datasets).then(function (data) {
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
        
/*
            const x = d3.scaleTime()
            .domain(d3.extent(data[1], function (d) {
                return d.date;
            }))
            .range([0, width]);
            
            const x = d3.scaleTime()
                .domain([new Date(1900, 0, 1), new Date(1900, 11, 31)])
                .range([0, width]);            
            
*/
            
        const month_tag = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        
        const x = d3.scaleBand()
            .domain(month_tag)
            .range([0, width])
            
        const y = d3.scaleLinear()
            .domain([min - buf, max + buf])
            .range([height, 0]);

        svg.append("g")
            .attr("transform", "translate(0, " + height + ")")
            .attr("class", "tick")
            .call(d3.axisBottom(x)
                .tickSizeInner(0)
                .tickSizeOuter(2)
                .tickPadding(10)
            )
        svg.append("g")
            .attr("transform", "translate(" + width + ", 0)")
            .attr("class", "tick")
            .call(d3.axisRight(y)
                .ticks(5)
                .tickSizeInner(-width)
                .tickSizeOuter(0)
                .tickPadding(10)
            )
        svg.append("g")
            .attr("class", "tick")
            .call(d3.axisLeft(y)
                .ticks(0)
                .tickSizeInner(0)
                .tickSizeOuter(0)
            )

        let line_stroke_width = 0;
        let dot_stroke_width = 0;
        let line_class = ""
        let dot_class = ""
        for (let i = n_data - 1; i >= 0; i--) {
            if (i === 0) {
                line_stroke_width = 2.3;
                dot_stroke_width = 2.0;
                line_class = "legend_line_main";
                dot_class = "legend_dot_main";
            } else {
                line_stroke_width = 1.8;
                dot_stroke_width = 1.6;
                line_class = "legend_line";
                dot_class = "legend_dot";
            }
            svg.append("path")
                .datum(data[i])
                .transition(t)
                .attr("id", "line_" + param.title + "_" + param.line_legends[i])
                .attr("class", param.title + "_lines")
                .attr("fill", "none")
                .attr("stroke", param.line_colors[i])
                .attr("stroke-width", line_stroke_width)
                .attr("d", d3.line()
                    .x(function (d) {
                        return x(month_tag[d.date.getMonth()]) + (month_width/2)
                    })
                    .y(function (d) {
                        return y(d.value)
                    })
                )

            svg.selectAll(".dots")
                .data(data[i])
                .enter()
                .append("circle")
                .attr("class", param.title + "_dots dot_" + param.title + "_" + param.line_legends[i])
                .attr("fill", param.line_colors[i])
                .attr("stroke", param.line_colors[i])
                .attr("cx", function(d) { 
                    return x(month_tag[d.date.getMonth()]) + (month_width/2) 
                })
                .attr("cy", function(d) { return y(d.value) })
                .attr("r", dot_stroke_width)

            let legend = d3.select(param.target + "_legend");
            let legend_block = legend.append("div")
                .attr("id", "legend_" + param.title + "_" + param.line_legends[i])
                .attr("class", "legend_block flexrow flexnone");
            let legend_line_box = legend_block.append("div")
                .attr("class", "center_parent legend_line_box flexnone");
            legend_line_box.append("div")
                .attr("class", "center_box " + line_class)
                .style("background-color", param.line_colors[i]);
            legend_line_box.append("div")
                .attr("class", "center_box " + dot_class)
                .style("background-color", param.line_colors[i]);
            legend_block.append("div")
                .attr("class", "flexnone")
                .html(param.line_legends[i])                        
            
            d3.select("#legend_" + param.title + "_" + param.line_legends[i])
                .on('mousemove', (event) => {
                    d3.selectAll("."+ param.title +"_lines").style("opacity", 0.07)
                    d3.selectAll("."+ param.title +"_dots").style("opacity", 0.07)
                    d3.select("#line_" + param.title + "_" + param.line_legends[i]).style("opacity", 1)
                    d3.selectAll(".dot_" + param.title + "_" + param.line_legends[i]).style("opacity", 1)
                })
                .on('mouseout', (event) => {
                    d3.selectAll("."+ param.title +"_lines").style("opacity", 1)
                    d3.selectAll("."+ param.title +"_dots").style("opacity", 1)
                })
            
        }

        let focus = d3.select(param.target + "_focus");
        let parent = d3.select(param.target + "_container");
        let tooltip = d3.select(param.target + "_tooltip");

        parent
            .on('mousemove', (event) => {
                x0 = d3.pointer(event)[0]
                y0 = d3.pointer(event)[1]
                const p_month = Math.floor(x0 / month_width)
                if (p_month < 12 && x0 >= 0) {
                    let values = []
                    for (let n = 0; n < n_data; n++) {
                        let data_point = data[n][p_month]
                        if (data_point === undefined) {
                            values[n] = "N/A"
                        } else {
                            values[n] = Math.round(data_point.value * 100) / 100
                        }
                    }
                    let tooltip_html = (month_format(d3.timeParse("%m")(p_month + 1))) + '<br>'
                    for (let i = 0; i < n_data; i++) {
                        tooltip_html += "<b>" + param.line_legends[i] + "</b>: " + values[i] + "<br>"
                    }

                    tooltip.html(tooltip_html);
                    tooltip
                        .style("left", month_width * (p_month+0.6) + "px")
                        .style("top", y0 + 20 + "px")

                    focus
                        .style("width", month_width + "px")
                        .style("transform", "translateX(" + month_width * p_month + "px)");
                }
            })
    })
}