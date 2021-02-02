d3.select(window).on('resize', refresh_on_resize);

let moving, timer

function step() {
    let slider = $("#slider-range")
    // let currentValue1 = slider.slider('values',0)
    let currentValue2 = slider.slider('values',1)
    let targetValue = slider.slider("option", "max") - 1
    let playButton = d3.select("#play-button")
    slider.slider('values', 1, currentValue2 + 1)
    if (currentValue2 > targetValue) {
        moving = false;
        currentValue2 = 0;
        clearInterval(timer);
        // timer = 0;
        playButton.text("Play");
        // console.log("Slider moving: " + moving);
    }
}

d3.select("#play-button").on("click", function () {
    let slider = $("#slider-range")

    let button = d3.select(this);
    if (button.text() === "Pause") {
        moving = false;
        clearInterval(timer);
        // timer = 0;
        button.text("Play");
    } else {
        // slider.slider('values', [0, 0])
        moving = true;
        timer = setInterval(step, 100);
        button.text("Pause");
    }
    // console.log("Slider moving: " + moving);
})

d3.select("#map_deselect").on("click", function () {
    let states = $("#map .map_svg .jqvmap-region");
    states.attr('class', 'jqvmap-region');
    data_source = de_data_source;
    render_graph();
})