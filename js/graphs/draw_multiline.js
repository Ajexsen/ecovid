/**
* Switches line chart data source and redraw on button click. (For transportation chart)
* @param type {string} name of the data source
*/
function update_transport_chart(type) {
    // remove all svg before redrawing
    d3.selectAll('#line_chart_transport svg').remove();
    d3.selectAll('#line_chart_transport_legend *').remove();
    
    if (type === "air") {
        $("#air_button").prop('disabled', true);
        $("#rail_button").prop('disabled', false)
        $("#road_button").prop('disabled', false)  
        $("#water_button").prop('disabled', false) 
        transport_type = "air"
        transport_param = line_param_air
    } else if (type === "rail") {
        $("#air_button").prop('disabled', false)
        $("#rail_button").prop('disabled', true)
        $("#road_button").prop('disabled', false) 
        $("#water_button").prop('disabled', false)        
        transport_type = "rail"
        transport_param = line_param_rail
    } else if (type === "road") {
        $("#air_button").prop('disabled', false)
        $("#rail_button").prop('disabled', false)
        $("#road_button").prop('disabled', true)  
        $("#water_button").prop('disabled', false)       
        transport_type = "road"
        transport_param = line_param_road
    } else if (type === "water") {
        $("#air_button").prop('disabled', false)
        $("#rail_button").prop('disabled', false)
        $("#road_button").prop('disabled', false)  
        $("#water_button").prop('disabled', true)       
        transport_type = "water"
        transport_param = line_param_water
    }
    draw_multiline(transport_param)
}

/**
* Switches line chart data source and redraw on button click. (For economic chart)
* @param type {string} name of the data source
*/
function update_econ_chart(type) {
    // remove all svg before redrawing
    d3.selectAll('#line_chart_econ svg').remove();
    d3.selectAll('#line_chart_econ_legend *').remove();
    
    if (type === "import") {
        $("#import_button").prop('disabled', true)
        $("#export_button").prop('disabled', false)         
        econ_type = "import"
        econ_param = line_param_import
    } else if (type === "export") {
        $("#import_button").prop('disabled', false)
        $("#export_button").prop('disabled', true)          
        econ_type = "export"
        econ_param = line_param_export
    }
    draw_multiline(econ_param)
}

// define default type
let transport_type = "air"
let econ_type = "import"

/**
* Draws a chart with multiple line from different files.
* @param param {list} A list of parameter needed for drawing the corresponding svg (target, src, color, dataset, etc.)
*/
function draw_multiline(param) {
    // define transition for data switch
    t = d3.transition()
        .duration(300)
        .ease(d3.easeLinear);    
    
    // setup prep - get container and create svg
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

    // define global var
    const n_data = param.data_files.length
    const month_width = width / 12
    let datasets = param.datasets

    // load all preread data
    Promise.all(datasets).then(function (data) {
        let caption = $(param.caption_target)
        caption.html(param.caption)

        // data[0] will contain file1.csv
        // data[1] will contain file2.csv

        // find max & min for y-axis scaling
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
        
        // const min = param.data_range[0]
        // const max = param.data_range[1]

        // add 10% buffering for better visual effect
        const buf = (max - min) * 0.1

        const month_tag = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        // set x, y-axis
        const x = d3.scaleBand()
            .domain(month_tag)
            .range([0, width])

        const y = d3.scaleLinear()
            .domain([min - buf, max + buf])
            .range([height, 0]);
        

        // add x-axis ticks/labels
        svg.append("g")
            .attr("transform", "translate(0, " + height + ")")
            .attr("class", "tick")
            .call(d3.axisBottom(x)
                .tickSizeInner(0)
                .tickSizeOuter(2)
                .tickPadding(10)
            )

        // add y-axis ticks/labels on the right
        svg.append("g")
            .attr("transform", "translate(" + width + ", 0)")
            .attr("class", "tick")
            .call(d3.axisRight(y)
                .ticks(5)
                .tickSizeInner(-width)
                .tickSizeOuter(0)
                .tickPadding(10)
            )

        // add plain y-axis line on the left
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

        // iterate through all dataset and draw line
        for (let i = n_data - 1; i >= 0; i--) {
            // if first line -> make thicker (latest year: 2020)
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

            // add line with data points
            svg.append("path")
                .datum(data[i])
                .transition(t)
                .attr("id", "line_" + param.title + "_" + param.line_legends[i])
                .attr("class", param.title + "_lines")
                .attr("fill", "none")
                .attr("stroke", param.line_colors[i])
                .attr("stroke-width", line_stroke_width)
                //.transition()
                .attr("d", d3.line()
                    .x(function (d) {
                        return x(month_tag[d.date.getMonth()]) + (month_width/2)
                    })
                    .y(function (d) {
                        return y(d.value)
                    })
                )

            // add line from dots to dot labels on top
            const line_length = 50
            const text_gap = 10

            svg.selectAll(".dot_line")
                .data(data[i])
                .enter()
                .append('line')
                .attr("class", param.title + "_dot_lines dot_lines dot_line_" + param.title + "_" + param.line_legends[i])
                // .style("stroke", "grey")
                // .style("stroke-width", 1)
                .attr("x1", function(d) {
                    return x(month_tag[d.date.getMonth()]) + (month_width/2)
                })
                .attr("y1", function(d) { return Math.max(y(d.value) - line_length, 25)})
                .attr("x2", function(d) {
                    return x(month_tag[d.date.getMonth()]) + (month_width/2)
                })
                .attr("y2", function(d) { return y(d.value) })

            // add dots on data points
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

            // add dot labels on top
            svg.selectAll(".text")
                .data(data[i])
                .enter()
                .append("text")
                .attr("class", "dlabs "+ param.title + "_dlabs dlab_" + param.title + "_" + param.line_legends[i])
                .attr("x", function(d) {
                    return x(month_tag[d.date.getMonth()]) + (month_width/2)
                })
                .attr("y", function(d) { return Math.max(y(d.value) - line_length - text_gap, 25 - text_gap)})//function(d) { return y(d.value) })
                .text(function(d) { return Math.round(d.value*100)/100 })


            // add line legend
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

            // add legend hover effect

            d3.select("#legend_" + param.title + "_" + param.line_legends[i])
                .on('mousemove', (event) => {
                    // hide all lines & dots
                    d3.selectAll("."+ param.title +"_lines").style("opacity", 0.07)
                    d3.selectAll("."+ param.title +"_dots").style("opacity", 0.07)

                    // unhide selected line & dots
                    d3.select("#line_" + param.title + "_" + param.line_legends[i]).style("opacity", 1)
                    d3.selectAll(".dot_" + param.title + "_" + param.line_legends[i]).style("opacity", 1)
                    d3.selectAll(".dlab_" + param.title + "_" + param.line_legends[i]).style("opacity", 0.8)
                    d3.selectAll(".dot_line_" + param.title + "_" + param.line_legends[i]).style("opacity", 0.6)
                    
                    // always show line from 2020
                    d3.select("#line_" + param.title + "_" + "2020").style("opacity", 1)
                    d3.selectAll(".dot_" + param.title + "_" + "2020").style("opacity", 1)                    
                    
                })
                .on('mouseout', (event) => {
                    // unhide all lines & dots
                    d3.selectAll("." + param.title +"_lines").style("opacity", 1)
                    d3.selectAll("." + param.title +"_dots").style("opacity", 1)
                    d3.selectAll(".dlab_" + param.title + "_" + param.line_legends[i]).style("opacity", 0)
                    d3.selectAll("." + param.title + "_dot_lines").style("opacity", 0)
                })

        }

        // get tooltips elements
        let focus = d3.select(param.target + "_focus");
        focus.style("width", month_width + "px");
        let parent = d3.select(param.target + "_container");
        let tooltip = d3.select(param.target + "_tooltip");

        // add tooltips hover effect
        parent
            .on('mousemove', (event) => {
                x0 = d3.pointer(event)[0]
                y0 = d3.pointer(event)[1]

                // calc mouse pointed month
                const p_month = Math.floor(x0 / month_width)

                if (p_month < 12 && x0 >= 0) {
                    let values = []

                    // iter through all datasets to get value from pointed month
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

                    focus.style("transform", "translateX(" + month_width * p_month + "px)");
                }
            })

    })
}