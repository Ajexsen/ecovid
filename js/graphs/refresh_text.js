function set_text_statistic(param) {
    let select_date0 = data_rows.get(param.date[0])
    let select_date1 = data_rows.get(param.date[1])
    let select_date2 = data_rows.get(param.date[2])
    let date1 = d3.timeParse(rki_dateFormat)(select_date1.date)
    let date2 = d3.timeParse(rki_dateFormat)(select_date2.date)
    let month1 = month_format_abbr(date1)
    let day1 = day_format(date1)
    let month2 = month_format_abbr(date2)
    let day2 = day_format(date2)
    let death_rate = Math.round(100 * 100 * select_date2.total_deaths / select_date2.total_cases) / 100
    $("#month1").html(month2);
    $("#day1").html(day2);
    $("#month2").html(month1);
    $("#day2").html(day1);
    $("#total_cases").html(select_date2.total_cases - select_date0.total_cases);
    $("#new_cases").html(select_date2.new_cases);
    $("#total_deaths").html(select_date2.total_deaths - select_date0.total_deaths);
    $("#new_deaths").html(select_date2.new_deaths);
    $("#7_day").html(select_date2._7d_incidence);
    if(isNaN(death_rate)){
        $("#death_rate").html("N/A");
    } else {
        $("#death_rate").html(death_rate + "%");
    }
}