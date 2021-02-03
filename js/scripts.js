function getArg(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function init_page() {
    day0_pick = +getArg('d0');
    day1_pick = +getArg('d1');

    //fullpage scrolling
    new fullpage('#fullpage', {
        navigation: true,
        navigationPosition: 'right',
        navigationTooltips: ['Overview', 'Transport', 'Trade', 'About Us'],
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
        showLabels: true,
        backgroundColor: null,
        enableZoom: false,
        showTooltip: true,
        pinMode: 'content',
        onRegionClick: function (element, code, region) {
        },
        onRegionSelect: function (event, code, region) {
            let states = $("#map .map_svg .jqvmap-region");
            states.attr('class', 'jqvmap-region jqvmap-region-unselected');
            let selected_state = $("#jqvmap1_" + code);
            selected_state.attr('class', 'jqvmap-region jqvmap-region-selected');

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

    for (let state of states) {
        let map_label = d3.select("#jqvmap1_" + state + "_pin");
        map_label.html("")
        let map_label_container = map_label
            .append("div")
            .attr("id", "map_pin_" + state)
            .attr("class", "map_pin center_box");
        map_label_container.html("")
    }
}

init_page();