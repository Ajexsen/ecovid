function draw_histogram(param) {
    const container = $(param.target)
    const margin = {top: 0, right: 50, bottom: 30, left: 40}
    let width = container.innerWidth() - margin.left - margin.right,
        height = container.innerHeight() - margin.top - margin.bottom

    let barPadding = 10;
    let svg = d3.selectAll(param.target)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    d3.csv(param.src, function(data){
        return {
            month: d3.timeParse("%m")(data.month),
            // month_text: d3.timeParse("%b")(data.month),
            value: data.new_case,
        }
    }).then(function(d){
        const d_length = 11
        const month_tag = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        let x = d3.scaleBand()
            .domain(month_tag)
            .range([0, width])

        let y = d3.scaleLinear()
            .domain([0, d3.max(d, function(d) { return +d.value; })])
            .range([height, 0])

        svg.selectAll("rect")
            .data(d)
            .enter()
            .append("rect")
            .attr("x", function(d, i){return x(month_tag[i]) + (barPadding/2)})
            .attr("y", function(d){return y(d.value)})
            .attr("width", width / d_length - barPadding)
            .attr("height", function(d){return height - y(d.value);})
            
        svg.selectAll("text")
            .data(d)
            .enter()
            .append("text")
            .attr("class", "hist_label")
            .attr("x", function(d, i){return x(month_tag[i]) + (barPadding/2)})
            .attr("y", function(d){return y(d.value)})
            .attr("transform", "translate(3, -3)")
            .text(function(d) { return d.value; });
            

        svg.append("g")
            .attr("transform", "translate(0, " + height + ")")
            .attr("class", "tick")
            .call(d3.axisBottom(x)
                .tickSizeInner(0)
                .tickSizeOuter(2)
                .tickPadding(10)
            )
        
        svg.append('text')
            .attr('class', 'chart_title')
            .attr('x', -height / 2)
            .attr('y', 0)
            .attr("transform", "translate(-15, 0) rotate(-90)")
            .attr('text-anchor', 'middle')
            .text(param.title)

        // add event timeline
        if("event_lines" in param){
            events = param.event_lines
            for (var key in events) {
                let date = d3.timeParse("%m-%d")(key)
                let x_pos = x(month_tag[date.getMonth()]) + x(month_tag[1])*(date.getDate()/30)
                svg.append("line")
                    .attr("x1", x_pos)
                    .attr("x2", x_pos)
                    .attr("y1", 20)
                    .attr("y2", height)
                    .attr("stroke-width", 2)
                    .attr("stroke", "grey")
                    .attr("stroke-dasharray", "3");
                svg.append("text")
                    .attr("class", "event_txt_label")
                    //.attr("transform", "translate("+ (x_pos-10) +",100) rotate(-90)")
                    .attr("transform", "translate("+ x_pos +",10)")
                    .text(events[key])
            }     
        }        

    })
}