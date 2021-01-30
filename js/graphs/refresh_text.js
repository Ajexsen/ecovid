function set_text_statistic(param) {
    let select_date0 = data_rows.get(param.date[0])
    let select_date2 = data_rows.get(param.date[2])
    let date0 = d3.timeParse(rki_dateFormat)(select_date0.date)
    let date2 = d3.timeParse(rki_dateFormat)(select_date2.date)
    let month = month_format_abbr(date2)
    let day = day_fomat(date2)
    let death_rate = Math.round(100 * 100 * select_date2.total_deaths / select_date2.total_cases) / 100
    $("#month").html(month);
    $("#day").html(day);
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