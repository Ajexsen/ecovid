function mark_map(param) {
    for (let state of states) {
        let map_label = d3.select("#jqvmap1_" + state + "_pin");
        map_label.html("")
        let map_label_container = map_label
            .append("div")
            .attr("id", "map_pin_" + state)
            .attr("class", "map_pin center_box");
        map_label_container.html(param.data[param.date][state])

        let map_title = d3.select("#map_title")
        let start_date = d3.timeParse(rki_dateFormat)("2020-01-01")
        let date = d3.timeFormat("%b. %d, %Y")(d3.timeDay.offset(start_date, param.date))
        map_title.html("7-day incidence on " + date + "</br>per 100,000 population")
    }
}