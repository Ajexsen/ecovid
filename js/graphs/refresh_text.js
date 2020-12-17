function set_text_statistic(param) {
    let select_date = data_rows.get(param.date)
    let date = d3.timeParse(rki_dateFormat)(select_date.date)
    let month_format = d3.timeFormat("%b")
    let month = month_format(date)
    let day_fomat = d3.timeFormat("%d")
    let day = day_fomat(date)
    let death_rate = Math.round(100 * 100 * select_date.total_deaths / select_date.total_cases) / 100
    $("#month").html(month);
    $("#day").html(day);
    $("#total_cases").html(select_date.total_cases);
    $("#new_cases").html(select_date.new_cases);
    $("#total_deaths").html(select_date.total_deaths);
    $("#new_deaths").html(select_date.new_deaths);
    $("#death_rate").html(death_rate + "%");
}