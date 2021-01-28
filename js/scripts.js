function step() {
    let targetValue = 300
    let currentValue = document.getElementById("date_slider").value
    refresh_on_date_change(currentValue);
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

function init_page() {
    //fullpage scrolling
    new fullpage('#fullpage', {
        navigation: true,
        navigationPosition: 'right',
        navigationTooltips: ['Overview', 'Transport', 'Trade'],
        scrollBar: true
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
        // pins: {
        //     "by": "pin_for_by"
        // },
        // pinMode: 'id',
        onRegionClick: function (element, code, region) {
        },
        // onLabelShow: function(event, label, code) {
        //     label.html("Aaa");
        // },
        onRegionSelect: function(event, code, region) {
            let states = $("#map .map_svg .jqvmap-region");
            states.attr('class', 'jqvmap-region jqvmap-region-unselected');
            let selected_state = $("#jqvmap1_" + code);
            selected_state.attr('class', 'jqvmap-region jqvmap-region-selected');
            console.log(selected_state)

            data_source = state_data_prefix + code.toUpperCase() + '.csv';
            init_graph();
        },
        onRegionDeselect: function(event, code, region) {
            let states = $("#map .map_svg .jqvmap-region");
            states.attr('class', 'jqvmap-region');
            data_source = de_data_source;
            init_graph();
        }
    });

    let day_pick = +getArg('d');
    const slider = $("#date_slider");
    // slider.attr('max', data_all.length - 1);
    slider.val(day_pick);
}

init_page();