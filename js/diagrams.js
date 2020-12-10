function draw(svg_target, data_src, title) {
    const container = $(svg_target)
    const margin = {top: 5, right: 40, bottom: 18, left: 40}
    let width = container.innerWidth() - margin.left - margin.right,
        height = container.innerHeight() - margin.top - margin.bottom;

    let svg = d3.select(svg_target)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    d3.dsv(';', data_src, function (d) {
        return {date: d3.timeParse("%Y-%m")(d['Month']), value: d['Embarking passengers']}
    }).then(data => {
        let x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d.date; }))
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0, " + height + ")")
            .attr("class", "tick")
            .call(d3.axisBottom(x)
                .ticks(6)
                .tickSizeInner(0)
            );

        let y_left = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return +d.value; })])
            .range([height, 0]);
        svg.append("g")
            .attr("class", "tick")
            .call(d3.axisLeft(y_left)
                .ticks(6)
                .tickSizeInner(0)
            );

        let y_right = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return +d.value; })])
            .range([height, 0]);
        svg.append("g")
            .attr("transform", "translate(" + width + ", 0)")
            .attr("class", "tick")
            .call(d3.axisRight(y_right).tickSizeInner(0)
                .ticks(8)
                .tickSizeInner(0)
            );

        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("d", d3.line()
                .x(function(d) { return x(d.date) })
                .y(function(d) { return y_left(d.value) })
            )

        svg.append('text')
            .attr('class', 'chart_title')
            // .attr("transform", "")
            .attr('x', -height / 2)
            .attr('y', 0)
            .attr("transform", "translate(-20, 0) rotate(-90)")
            .attr('text-anchor', 'middle')
            .text(title);
    });
}

function refresh() {
    d3.selectAll('#onerightbottom > div > *').remove();
    const target1 = "#line_chart_slider_top"
    const src1 = "data/destatis_air-passengers-german-airports_2008-2020.csv"
    const title1 = "Title1"
    draw(target1, src1, title1)
    const target2 = "#line_chart_slider_bottom"
    const src2 = "data/destatis_air-passengers-german-airports_2008-2020.csv"
    const title2 = "Title2"
    draw(target2, src2, title2)
}

refresh()
d3.select(window).on('resize', refresh);
