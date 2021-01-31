function getDate(value) {
    let start_date = d3.timeParse(rki_dateFormat)("2020-01-01")
    return d3.timeFormat(rki_dateFormat)(d3.timeDay.offset(start_date, value))
}

function updateDate(value1, value2) {
    d3.selectAll('#onerightmiddle svg').remove();
    let date0 = getDate(Math.max(0, value1 - 1));
    let date1 = getDate(value1);
    let date2 = getDate(value2);
    line_param_death.start = value1;
    line_param_case.start = value1;
    line_param_death.end = value2;
    line_param_case.end = value2;
    bar_param_case_m.date = [date0, date2]
    bar_param_case_w.date = [date0, date2]
    bar_param_death_m.date = [date0, date2]
    bar_param_death_w.date = [date0, date2]
    text_stat_para.date = [date0, date1, date2]
}

function updateStats() {
    draw_bar(bar_param_case_m);
    draw_bar(bar_param_case_w);
    draw_bar(bar_param_death_m);
    draw_bar(bar_param_death_w);
    set_text_statistic(text_stat_para);
}

function updateLineChart() {
    d3.selectAll('#oneright svg').remove();
    $(".line_chart_event").empty();
    draw_line(line_param_death);
    draw_line(line_param_case);
}

function refresh_on_date_change(value1, value2) {
    updateDate(value1, value2);
    updateLineChart();
    updateStats();
}

function refresh_on_resize() {
    d3.selectAll('.section_content svg').remove();

    updateLineChart();
    updateStats();

    draw_histogram(histogram_param_DE);
    draw_multiline(transport_param);
    draw_multiline(econ_param);

    let thumb_height = $("#slider_containter").innerHeight()
    for (let j = 0; j < document.styleSheets[1].rules.length; j++) {
        let rule = document.styleSheets[1].rules[j];
        if (rule.cssText.match(".slider_thumb")) {
            rule.style.height = thumb_height + "px";
        }
    }

    d3.selectAll('#line_chart_transport_legend *').remove();
    d3.selectAll('#line_chart_econ_legend *').remove();
}

function refresh_on_state_change() {
    bar_param_case_m.src = data_rows;
    bar_param_case_w.src = data_rows;
    bar_param_death_m.src = data_rows;
    bar_param_death_w.src = data_rows;
    text_stat_para.src = data_rows;
    line_param_death.src = data_all;
    line_param_case.src = data_all;
}

function read_datasets(param) {
    let datasets = []
    const n_data = param.data_files.length
    for (let i = 0; i < n_data; i++) {
        let path = param.src + param.data_files[i]
        datasets[i] = d3.csv(path, function (d) {
            return {
                date: d3.timeParse("%m")(d[param.x]),
                value: d[param.y]
            }
        })
    }
    param.datasets = datasets
}

// updateDate(day0_pick, day1_pick)
// $(document).ready(function () {
//     $("#slider-range").slider({
//         range: true,
//         min: 0,
//         max: data_all.length - 1,
//         values: [day0_pick, day1_pick],
//         slide: function (event, ui) {
//             // console.log(slider.slider('values',0), slider.slider('values',1))
//             day0_pick = ui.values[0]
//             day1_pick = ui.values[1]
//             // refresh_on_date_change(day0_pick, day1_pick)
//         }
//     });
// });

function render_graph() {
    d3.csv(data_source, function (data) {
        let rki_data = {
            date: data.Meldedatum,
            date_parse: d3.timeParse(rki_dateFormat)(data.Meldedatum),
            total_cases: +data["AnzahlFall"],
            new_cases: +data["NeuerFall"],
            total_deaths: +data["AnzahlTodesfall"],
            new_deaths: +data["NeuerTodesfall"],
            death_rate: Math.round(data["Todesrate"] * 100) / 100,
            _7d_incidence: +data["7d_inzidenz"]
        }
        genders.forEach(gender => {
            types.forEach(type => {
                rki_data[gender + type] = {
                    "0-4": +data[gender + "_A00-A04_" + type],
                    "5-14": +data[gender + "_A05-A14_" + type],
                    "15-34": +data[gender + "_A15-A34_" + type],
                    "35-59": +data[gender + "_A35-A59_" + type],
                    "60-79": +data[gender + "_A60-A79_" + type],
                    "80+": +data[gender + "_A80+_" + type]
                };
            })
        });
        return rki_data
    }).then(function (data) {
        data_all = data
        data_rows = d3.index(data, d => d.date);
    }).then(function () {
        const dates = Array.from(data_rows.keys())
        const last_day = dates[dates.length - 1]
        let select_last_day = data_rows.get(last_day)
        genders.forEach(gender => {
            types.forEach(type => {
                let array = []
                Object.entries(select_last_day[gender + type]).forEach(ele => {
                    array.push({
                        age: ele[0],
                        value: ele[1]
                    });
                    bar_chart_config[gender + type] = {
                        x: d3.scaleLinear()
                            .domain([0, d3.max(array, function (d) {
                                return d.value;
                            })]),
                        y: d3.scaleBand()
                            .domain(array.map(function (d) {
                                return d.age;
                            }))
                    }
                });
            })
        });
        refresh_on_state_change();

        read_datasets(line_param_air)
        read_datasets(line_param_rail)
        read_datasets(line_param_road)
        read_datasets(line_param_water)
        read_datasets(line_param_import)
        read_datasets(line_param_export)

        updateDate(day0_pick, day1_pick)
        $(function () {
            $("#slider-range").slider({
                range: true,
                min: 0,
                max: data_all.length - 1,
                values: [day0_pick, day1_pick],
                slide: function (event, ui) {
                    // console.log(slider.slider('values',0), slider.slider('values',1))
                    day0_pick = ui.values[0]
                    day1_pick = ui.values[1]
                    refresh_on_date_change(day0_pick, day1_pick)
                }
            });
        });
    }).then(function () {
        refresh_on_resize();
    })
}

render_graph();