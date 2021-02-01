function mark_map(param) {
    for (let state of states) {
        // let map_label = d3.select("#indicator_" + state);
        let map_label = d3.select("#jqvmap1_" + state + "_pin");
        map_label.html(param.data[param.date][state])
        // let incidence = param.data[param.date][state]
        // if (incidence <= 0) {
        //     map_label.attr("class", "center_box map_indicator map_indicator0");
        // } else if (incidence > 0 && incidence <= 40) {
        //     map_label.attr("class", "center_box map_indicator map_indicator1");
        // } else if (incidence > 40 && incidence <= 80) {
        //     map_label.attr("class", "center_box map_indicator map_indicator2");
        // } else if (incidence > 80 && incidence <= 120) {
        //     map_label.attr("class", "center_box map_indicator map_indicator3");
        // } else {
        //     map_label.attr("class", "center_box map_indicator map_indicator4");
        // }

        let map_title = d3.select("#map_title")
        let start_date = d3.timeParse(rki_dateFormat)("2020-01-01")
        let date = d3.timeFormat("%b. %d, %Y")(d3.timeDay.offset(start_date, param.date))
        console.log(date)
        map_title.html("7-day incidence on " + date + "</br>per 100,000 population")
    }
}