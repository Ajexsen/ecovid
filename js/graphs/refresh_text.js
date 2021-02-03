function set_text_statistic(param) {
    let select_date0 = data_rows.get(param.date[0]) // 1d before starting
    let select_date1 = data_rows.get(param.date[1]) // start
    let select_date2 = data_rows.get(param.date[2]) // end
    
    let date1 = d3.timeParse(rki_dateFormat)(select_date1.date)
    let date2 = d3.timeParse(rki_dateFormat)(select_date2.date)
    let month1 = month_format_abbr(date1)
    let day1 = day_format(date1)
    let month2 = month_format_abbr(date2)
    let day2 = day_format(date2)
    let death_rate = Math.round(100 * 100 * select_date2.total_deaths / select_date2.total_cases) / 100

/*     let dr_80_m = 3.5
    let dr_6079_m = 1.3
    let dr_3059_m = 0.11
    let dr_1534_m = 0.43
    let dr_514_m = 0.51
    let dr_04_m = 0.38
    
    let dr_80_f = 3.7
    let dr_6079_f = 2.11
    let dr_3059_f = 0.30
    let dr_1534_f = 0.29
    let dr_514_f = 0.42
    let dr_04_f = 0.12 */
    
    $("#month1").html(month2);
    $("#day1").html(day2);
    $("#month2").html(month1);
    $("#day2").html(day1);
    $("#total_cases").html(select_date2.total_cases - select_date0.total_cases);
    $("#new_cases").html(select_date2.new_cases);
    $("#total_deaths").html(select_date2.total_deaths - select_date0.total_deaths);
    $("#new_deaths").html(select_date2.new_deaths);
    $("#7_day").html(select_date2._7d_incidence);

    setDeathRate("#death_rate", death_rate)
    
/*     setDeathRate("#dr_80_m", dr_80_m);
    setDeathRate("#dr_6079_m", dr_6079_m);
    setDeathRate("#dr_3059_m", dr_3059_m);
    setDeathRate("#dr_1534_m", dr_1534_m);
    setDeathRate("#dr_514_m", dr_514_m);
    setDeathRate("#dr_04_m", dr_04_m);
    
    setDeathRate("#dr_80_f", dr_80_f);
    setDeathRate("#dr_6079_f", dr_6079_f);
    setDeathRate("#dr_3059_f", dr_3059_f);
    setDeathRate("#dr_1534_f", dr_1534_f);
    setDeathRate("#dr_514_f", dr_514_f);
    setDeathRate("#dr_04_f", dr_04_f); */
    
}

function setDeathRate(id, value){
    if(isNaN(value)){
        $(id).html("N/A");
    } else {
        $(id).html(value + "%");
    }
}