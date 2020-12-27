const de_data_source = "data/rki/rki_DE-all.csv";
const state_data_prefix = "data/rki/bundesland/rki_DE-"
const rki_dateFormat = "%Y-%m-%d";
const genders = ["M", "W"]
const types = ["c", "d"]
const line_colors = ["#5E0922", "#FD4A1E", "#4BBDAD", "#F7B732", "#515D93", "#707070"]
//const line_colors = ["#5E0922", "#FD4A1E", "#4BBDAD", "#F7B732", "#515D93", "#707070", "#5E0922", "#FD4A1E", "#4BBDAD", "#F7B732", "#515D93", "#707070", "#5E0922", "#FD4A1E", "#4BBDAD", "#F7B732", "#515D93", "#707070"]

const month_format_abbr = d3.timeFormat("%b");
const month_format = d3.timeFormat("%B");
const day_fomat = d3.timeFormat("%d");

// still needs to be checked, and updated.
event_timeline = {
    "03-23": "First lockdown",
    //"11-02": "Partial lockdown",
    "12-13": "Second lockdown",
}

let data_all = {}
let data_rows = {};
let bar_chart_config = {};
let data_source = de_data_source;

const text_stat_para = {};

const bar_param_case_m = {
    target: "#case_hist_left",
    gender: "M",
    type: "c",
    direction: "left"
};
const bar_param_case_w = {
    target: "#case_hist_right",
    gender: "W",
    type: "c",
    direction: "right"
};
const bar_param_death_m = {
    target: "#death_hist_left",
    gender: "M",
    type: "d",
    direction: "left"
};
const bar_param_death_w = {
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
    event_lines: event_timeline,
    data1: {
        y: "new_deaths",
        y_scale: 1
    },
    data2: {
        y: "total_deaths",
        y_scale: 1
    }
};
const line_param_case = {
    target: "#line_chart_slider_bottom",
    title: "Cases",
    legend: false,
    x: "date_parse",
    data1: {
        y: "new_cases",
        y_scale: 1000
    },
    data2: {
        y: "total_cases",
        y_scale: 1000
    }

};



// use bike as dummy
const line_param_flight = {
    target: "#line_chart_transport",
    title: "flight",
    src: "data/transport/bicycle/",
    data_files: ["b_2017.csv", "b_2018.csv", "b_2019.csv", "b_2020.csv"],
    line_legends: ["2017", "2018", "2019", "2020"],
    line_colors: line_colors,
    x: "month",
    y: "count",
    datasets: []
};

// use bike as dummy
const line_param_rail = {
    target: "#line_chart_transport",
    title: "rail",
    src: "data/transport/bicycle/",
    data_files: ["b_2018.csv", "b_2020.csv", "b_2017.csv", "b_2019.csv"],
    line_legends: ["2018", "2020", "2017", "2019"],
    line_colors: line_colors,
    x: "month",
    y: "count",
    datasets: []
};

const line_param_bike = {
    target: "#line_chart_transport",
    title: "bike",
    src: "data/transport/bicycle/",
    data_files: ["b_2020.csv", "b_2019.csv", "b_2018.csv", "b_2017.csv"],
    line_legends: ["2020", "2019", "2018", "2017"],
    line_colors: line_colors,
    x: "month",
    y: "count",
    datasets: []
};

const line_param_import = {
    target: "#line_chart_econ",
    title: "import",
    src: "data/econ/import/",
    data_files: ["im_2020.csv", "im_2019.csv", "im_2018.csv", "im_2017.csv"],
    //data_files: ["im_2020.csv", "im_2019.csv", "im_2018.csv", "im_2017.csv", "im_2016.csv", "im_2015.csv", "im_2014.csv", "im_2013.csv", "im_2012.csv", "im_2011.csv", "im_2010.csv", "im_2009.csv", "im_2008.csv"],
    line_legends: ["2020", "2019", "2018", "2017"],
    //line_legends: ["2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010", "2009", "2008"],
    line_colors: line_colors,
    x: "Monat",
    y: "Import",
    datasets: []
};

const line_param_export = {
    target: "#line_chart_econ",
    title: "export",
    src: "data/econ/export/",
    data_files: ["ex_2020.csv", "ex_2019.csv", "ex_2018.csv", "ex_2017.csv"],
    //data_files: ["ex_2020.csv", "ex_2019.csv", "ex_2018.csv", "ex_2017.csv", "ex_2016.csv", "ex_2015.csv", "ex_2014.csv", "ex_2013.csv", "ex_2012.csv", "ex_2011.csv", "ex_2010.csv", "ex_2009.csv", "ex_2008.csv"],
    line_legends: ["2020", "2019", "2018", "2017"],
    //line_legends: ["2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010", "2009", "2008"],
    line_colors: line_colors,
    x: "Monat",
    y: "Export",
    datasets: []
};

const histogram_param_DE = {
    target: ".de_hist",
    event_lines: event_timeline,
    src: "data/rki/rki_DE-newcase.csv"
}

// remember which data is currently used
let transport_param = line_param_flight
let econ_param = line_param_import