d3.select(window).on('resize', refresh_on_resize);

d3.select("#play-button").on("click", function () {
    let button = d3.select(this);
    let moving = false, timer = 0;
    if (button.text() === "Pause") {
        clearInterval(timer);
        // timer = 0;
        button.text("Play");
    } else {
        moving = true;
        timer = setInterval(step, 200);
        button.text("Pause");
    }
    // console.log("Slider moving: " + moving);
})