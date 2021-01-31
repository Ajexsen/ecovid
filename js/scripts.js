function step() {
    let targetValue = 300
    currentValue = document.getElementById("date_slider").value
    updateBarData(currentValue);
    document.getElementById("date_slider").value = parseInt(currentValue) + 1

    if (currentValue > targetValue) {
        moving = false;
        currentValue = 0;
        clearInterval(timer);
        // timer = 0;
        playButton.text("Play");
        console.log("Slider moving: " + moving);
    }
}

function getArg(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function browser_check() {
    let ua = window.navigator.userAgent;
    let msie = ua.indexOf("MSIE ");
    let msg_ie_container = $("#msg_ie_container")
    msg_ie_container.css("visibility", "hidden");
    // If Internet Explorer
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        // alert(parseInt(ua.substring(msie + 5, ua.indexOf(".", msie))));
        msg_ie_container.css("visibility", "visible");
    }
    return false;
}

function init_page() {
    browser_check();

    day0_pick = +getArg('d0');
    day1_pick = +getArg('d1');

    //fullpage scrolling
    new fullpage('#fullpage', {
        navigation: true,
        navigationPosition: 'right',
        navigationTooltips: ['Overview', 'Transport', 'Trade'],
        scrollBar: true,
    });

    //opacity of background
    $(window).scroll(function () {
        let scrollTop = $(this).scrollTop();
        $('#map_bg').css({
            opacity: function () {
                let elementHeight = $(this).height();
                return (elementHeight - scrollTop) / elementHeight;
            }
        });
    });

    //map
    jQuery('#map_svg').vectorMap({
        map: 'germany_en',
        // showLabels: true,
        backgroundColor: null,
        enableZoom: false,
        showTooltip: true,
        // pins: pins,
        pinMode: 'content',
        onRegionClick: function (element, code, region) {
        },
        // onLabelShow: function(event, label, code) {
        //     label.html("Aaa");
        // },
        onRegionSelect: function (event, code, region) {
            let states = $("#map .map_svg .jqvmap-region");
            states.attr('class', 'jqvmap-region jqvmap-region-unselected');
            let selected_state = $("#jqvmap1_" + code);
            selected_state.attr('class', 'jqvmap-region jqvmap-region-selected');
            // console.log(selected_state)

            data_source = state_data_prefix + code.toUpperCase() + '.csv';
            render_graph();
        },
        onRegionDeselect: function (event, code, region) {
            let states = $("#map .map_svg .jqvmap-region");
            states.attr('class', 'jqvmap-region');
            data_source = de_data_source;
            render_graph();
        }
    });

}

init_page();