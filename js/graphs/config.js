const de_data_source = "data/rki/rki_DE-all.csv";
const state_data_prefix = "data/rki/bundesland/rki_DE-"
const rki_dateFormat = "%Y-%m-%d";
const genders = ["M", "W"]
const types = ["c", "d"]
const line_colors = ["#707070", "#4BBDAD", "#F7B732", "#FD4A1E", "#5E0922", "#515D93"]
//const line_colors = ["#5E0922", "#FD4A1E", "#4BBDAD", "#F7B732", "#515D93", "#707070", "#5E0922", "#FD4A1E", "#4BBDAD", "#F7B732", "#515D93", "#707070", "#5E0922", "#FD4A1E", "#4BBDAD", "#F7B732", "#515D93", "#707070"]
const states = ["sh","hh","ni","hb","nw","he","rp","bw","by","sl","be","bb","mv","sn","st","th"]

const month_format_abbr = d3.timeFormat("%b");
const month_format = d3.timeFormat("%B");
const day_fomat = d3.timeFormat("%d");

// still needs to be checked, and updated.
event_timeline = {
    "2020-03-16": "Bavaria declares state of emergency",
    // "2020-03-23": "1st Lockdown",
    "2020-04-12": "Easter",
    "2020-11-02": "Partial lockdown",
    "2020-12-13": "Hard lockdown",
    "2020-12-25": "Christmas",
    "2021-01-06": "Lockdown tightened",
    // "2021-01-18": "New Mutation",
}

let day0_pick = 0;
let day1_pick = 0;
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


const transport_range = [80, 130]
const trade_range = [70, 120]

const line_param_air = {
    target: "#line_chart_transport",
    title: "air",
    caption: "Air transport: air freight handled at selected German airports",
    caption_target: "#transport_title",
    src: "data/transport/air/",
    data_files: ["air_2017.csv", "air_2018.csv", "air_2019.csv", "air_2020.csv"],
    line_legends: ["2017", "2018", "2019", "2020"],
    line_colors: line_colors,
    x: "Monat",
    y: "Air transport",
    data_range: transport_range,
    datasets: []
};


const line_param_rail = {
    target: "#line_chart_transport",
    title: "rail",
    caption: "Rail transport: train path kilometres booked in the German rail network",
    caption_target: "#transport_title",
    src: "data/transport/rail/",
    data_files: ["rail_2017.csv", "rail_2018.csv", "rail_2019.csv", "rail_2020.csv"],
    line_legends: ["2017", "2018", "2019", "2020"],
    line_colors: line_colors,
    x: "Monat",
    y: "Rail transport",
    data_range: transport_range,
    datasets: []
};

const line_param_road = {
    target: "#line_chart_transport",
    title: "bike",
    caption: "Road transport: truck toll mileage index",
    caption_target: "#transport_title",
    src: "data/transport/road/",
    data_files: ["road_2017.csv", "road_2018.csv", "road_2019.csv", "road_2020.csv"],
    line_legends: ["2017", "2018", "2019", "2020"],
    line_colors: line_colors,
    x: "Monat",
    y: "Road transport",
    data_range: transport_range,
    datasets: []
};

const line_param_water = {
    target: "#line_chart_transport",
    title: "water",
    caption: "Inland waterways transport: number of freight vessels berthing in nine selected German inland ports",
    caption_target: "#transport_title",
    src: "data/transport/waterway/",
    data_files: ["water_2017.csv", "water_2018.csv", "water_2019.csv", "water_2020.csv"],
    line_legends: ["2017", "2018", "2019", "2020"],
    line_colors: line_colors,
    x: "Monat",
    y: "Inland waterways transport",
    data_range: transport_range,
    datasets: []
}

const line_param_import = {
    target: "#line_chart_econ",
    title: "import",
    caption: "Development of Germany's import",
    caption_target: "#economy_title",
    src: "data/econ/import/",
    // data_files: ["im_2020.csv", "im_2019.csv", "im_2018.csv", "im_2017.csv"],
    //data_files: ["im_2020.csv", "im_2019.csv", "im_2018.csv", "im_2017.csv", "im_2016.csv", "im_2015.csv", "im_2014.csv", "im_2013.csv", "im_2012.csv", "im_2011.csv", "im_2010.csv", "im_2009.csv", "im_2008.csv"],
    data_files: ["im_2017.csv", "im_2018.csv", "im_2019.csv", "im_2020.csv"],
    //line_legends: ["2020", "2019", "2018", "2017"],
    line_legends: ["2017", "2018", "2019", "2020"],
    //line_legends: ["2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010", "2009", "2008"],
    line_colors: line_colors,
    x: "Monat",
    y: "Import",
    data_range: trade_range,
    datasets: []
};

const line_param_export = {
    target: "#line_chart_econ",
    title: "export",
    caption: "Development of Germany's export",
    caption_target: "#economy_title",
    src: "data/econ/export/",
    data_files: ["ex_2017.csv", "ex_2018.csv", "ex_2019.csv", "ex_2020.csv"],
    //data_files: ["ex_2020.csv", "ex_2019.csv", "ex_2018.csv", "ex_2017.csv", "ex_2016.csv", "ex_2015.csv", "ex_2014.csv", "ex_2013.csv", "ex_2012.csv", "ex_2011.csv", "ex_2010.csv", "ex_2009.csv", "ex_2008.csv"],
    line_legends: ["2017", "2018", "2019", "2020"],
    //line_legends: ["2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010", "2009", "2008"],
    line_colors: line_colors,
    x: "Monat",
    y: "Export",
    data_range: trade_range,
    datasets: []
};

const histogram_param_DE = {
    target: ".de_hist",
    title: "New Cases",
    event_lines: event_timeline,
    src: "data/rki/rki_DE-newcase.csv"
}

const map_marker_param = {
    src: "data/rki/rki_7d_DE-all.csv"
}

// remember which data is currently used
let transport_param = line_param_road
let econ_param = line_param_import