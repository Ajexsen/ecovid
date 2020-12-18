const de_data_source = "data/rki/rki_DE-all.csv";
const state_data_prefix = "data/rki/bundesland/rki_DE-"
const rki_dateFormat = "%Y-%m-%d";
const genders = ["M", "W"]
const types = ["c", "d"]
const line_colors = ["#5E0922", "#FD4A1E", "#4BBDAD", "#F7B732", "#515D93", "#707070"]

let data_all = {}
let data_rows = {};
let bar_chart_config = {};
let data_source = de_data_source;

const text_stat_para = {
    // src: data_source,
};

const bar_param_case_m = {
    // src: data_source,
    target: "#case_hist_left",
    gender: "M",
    type: "c",
    direction: "left"
};
const bar_param_case_w = {
    // src: data_source,
    target: "#case_hist_right",
    gender: "W",
    type: "c",
    direction: "right"
};
const bar_param_death_m = {
    // src: data_source,
    target: "#death_hist_left",
    gender: "M",
    type: "d",
    direction: "left"
};
const bar_param_death_w = {
    // src: data_source,
    target: "#death_hist_right",
    gender: "W",
    type: "d",
    direction: "right"
};

const line_param_death = {
    target: "#line_chart_slider_top",
    title: "Deaths",
    legend: true,
    x: "date_parse",
    // src: data_all,
    data1: {
        // delimiter: ",",
        // x_date_format: rki_dateFormat,
        y: "new_deaths",
        y_scale: 1
    },
    data2: {
        // src: data_source,
        // delimiter: ",",
        // x_date_format: rki_dateFormat,
        y: "total_deaths",
        y_scale: 1
    }
};
const line_param_case = {
    target: "#line_chart_slider_bottom",
    title: "Cases",
    legend: false,
    x: "date_parse",
    // src: data_all,
    data1: {
        // delimiter: ",",
        // x_date_format: rki_dateFormat,
        y: "new_cases",
        y_scale: 1000
    },
    data2: {
        // src: data_source,
        // delimiter: ",",
        // x: "Meldedatum",
        // x_date_format: rki_dateFormat,
        y: "total_cases",
        y_scale: 1000
    }

};

// use bike as dummy
const line_param_flight = {
    target: "#line_chart_transport",
    title: "test",
    src: "data/transport/bicycle/",
    data_files: ["b_2017.csv", "b_2018.csv", "b_2019.csv", "b_2020.csv"],
    line_legends: ["2017", "2018", "2019", "2020"],
    line_colors: line_colors,
    delimiter: ",",
    x: "month",
    y: "count"
};

// use bike as dummy
const line_param_rail = {
    target: "#line_chart_transport",
    title: "test",
    src: "data/transport/bicycle/",
    data_files: ["b_2018.csv", "b_2020.csv", "b_2017.csv", "b_2019.csv"],
    line_legends: ["2018", "2020", "2017", "2019"],
    line_colors: line_colors,
    delimiter: ",",
    x: "month",
    y: "count"
};

const line_param_bike = {
    target: "#line_chart_transport",
    title: "test",
    src: "data/transport/bicycle/",
    data_files: ["b_2020.csv", "b_2019.csv", "b_2018.csv", "b_2017.csv"],
    line_legends: ["2020", "2019", "2018", "2017"],
    line_colors: line_colors,
    delimiter: ",",
    x: "month",
    y: "count"
};