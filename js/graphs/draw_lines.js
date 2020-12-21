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
    draw_lines(transport_param)
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
    draw_lines(econ_param)
}

let transport_type = "flight"
let econ_type = "import"

function draw_lines(param) {
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
    const div_width = width / n_data
    let datasets = param.datasets
    

/*     for (let i = 0; i < n_data; i++) {
        path = param.src + param.data_files[i]
        datasets[i] = d3.csv(path, function (d) {
            return {
                date: d3.timeParse("%m")(d[param.x]),
                value: d[param.y]
            }
        })
    } */

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

        const x = d3.scaleTime()
            .domain(d3.extent(data[1], function (d) {
                return d.date;
            }))
            .range([0, width]);
        const y = d3.scaleLinear()
            .domain([min - buf, max + buf])
            .range([height, 0]);

        function test() {
            console.log("test")
        }

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
                .tickSizeInner(-width)
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

        let line_stroke_width = 0;
        let dot_stroke_width = 0;
        let line_class = ""
        let dot_class = ""
        for (let i = n_data - 1, k = 0; i >= 0; i--, k++) {
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
                .attr("fill", "none")
                .attr("stroke", param.line_colors[i])
                .attr("stroke-width", line_stroke_width)
                .attr("d", d3.line()
                    .x(function (d) {
                        return x(d.date)
                    })
                    .y(function (d) {
                        return y(d.value)
                    })
                )

            svg.selectAll(".dots")
                .data(data[i])
                .enter()
                .append("circle")
                .attr("fill", param.line_colors[i])
                .attr("stroke", param.line_colors[i])
                .attr("cx", function(d) { return x(d.date) })
                .attr("cy", function(d) { return y(d.value) })
                .attr("r", dot_stroke_width)
                //.on('mouseover', function (d, i) {
                //    console.log("dot dot dot ...")
                //    d3.select(this).transition()
                //          .duration('100')
                //          .attr("r", 7);
                //})                

            let legend = d3.select(param.target + "_legend");
            let legend_block = legend.append("div")
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
        }
        
        if("event_lines" in param){
            events = param.event_lines
            for (var key in events) {
                let x_pos = x(d3.timeParse("%m-%d")(key))
                svg.append("line")
                    .attr("x1", x_pos)
                    .attr("x2", x_pos)
                    .attr("y1", 0)
                    .attr("y2", height)
                    .attr("stroke-width", 2)
                    .attr("stroke", "black")
                    .attr("stroke-dasharray", "3");
                svg.append("text")
                    .attr("class", "event_txt_label")
                    .attr("transform", "translate("+ (x_pos-10) +",100) rotate(-90)")
                    .text(events[key])
            }     
        }
        
       

        let month_width = width / 11
        let f_width = new Array(12).fill(month_width)
        f_width[0] = f_width[11] = 0.5 * month_width
        let f_x_pos = f_width.slice(0)
        f_x_pos.pop()
        f_x_pos.unshift(0)
        f_x_pos = d3.cumsum(f_x_pos)

        let focus = d3.select(param.target + "_focus");
        let parent = d3.select(param.target + "_container");
        let tooltip = d3.select(param.target + "_tooltip");
        // let tooltip_container = d3.select(param.target + "_tooltip_containr");

        parent
            .on('mousemove', (event) => {
                x0 = d3.pointer(event)[0]
                y0 = d3.pointer(event)[1]
                const p_month = Math.round(x0 / month_width)
                if (p_month < 12) {
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
                        .style("left", f_x_pos[p_month] + 0.6 * f_width[p_month] + "px")
                        .style("top", y0 + 20 + "px")

                    focus
                        .style("width", f_width[p_month] + "px")
                        .style("transform", "translateX(" + f_x_pos[p_month] + "px)");
                }
            })
    })
}