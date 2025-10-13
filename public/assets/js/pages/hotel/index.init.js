var WebServices = function () {
    "use strict";

    var reduce = function (array) {
        return array.reduce(function (x, y) {
            return x + y;
        }, 0);
    }

    var renderNumericStats = function () {
        var $numericStats = $("#numeric-stats");

        Stats.callEndpoint($numericStats, function (data) {
            $.each(data, function (item, value) {
                $numericStats.find(`[data-variable="${item}"]`).html(Humanize.compactInteger(value, 1))
            })
        });
    }

    var renderApartmentAvailabilitiesDonutChart = function () {

        var $apartment = $('#apartment-availabilities-donut-chart');
        var $parent = $apartment.parent();
        var $counters = $parent.find('[data-plugin="counterup"]')
        var $paragraphs = $parent.find('p')

        var response;

        Stats.callEndpoint($apartment, function (data) {
            response = data;

            $.each(response, function (key, item) {
                $($counters[key]).html(Humanize.intComma(item['value']));
                $($paragraphs[key]).html(item['label']);
            })

        });

        var renderApartmentAvailabilitiesChart = function () {
            var chart = Stats.renderDonutChart($apartment, response);
            return chart;
        }

        var chartInstance = renderApartmentAvailabilitiesChart();
        if (chartInstance && chartInstance.el && chartInstance.el.parentNode) {
            var charts = chartInstance.el.parentNode.querySelectorAll('svg[id= + chartInstance.options.element + ]');
            charts.forEach(function(svg, index) {
                if (index > 0 && svg.getAttribute('id') === chartInstance.options.element) {
                    svg.parentNode.removeChild(svg);
                }
            });
        }
    }

    var renderApartmentBarChart = function () {

        var $apartment = $('#apartment-bar-chart');
        var $parent = $apartment.parent();
        var $counters = $parent.find('[data-plugin="counterup"]')

        var response;

        Stats.callEndpoint($apartment, function (data) {
            response = data;
            $($counters[0]).html(Humanize.intComma(reduce(response['apartment_this_week'])));
            $($counters[1]).html(Humanize.intComma(reduce(response['apartment_this_month'])));
            $($counters[2]).html(Humanize.intComma(reduce(response['apartment_this_year'])));
        });

        var renderApartmentStatisticsChart = function () {
            var data = Stats.weeklyLabels().map(
                function (element, index) {
                    return {"label": element, "value": response['apartment_this_week'][index]}
                });

            Stats.renderBarChart($apartment, data, 'label', ['value']);
        }

        renderApartmentStatisticsChart();
    }

    var renderReservationBarChart = function () {

        var $reservation = $('#reservation-bar-chart');
        var $parent = $reservation.parent();
        var $counters = $parent.find('[data-plugin="counterup"]')

        var response;

        Stats.callEndpoint($reservation, function (data) {
            response = data;
            $($counters[0]).html(Humanize.intComma(reduce(response['reservation_this_week'])));
            $($counters[1]).html(Humanize.intComma(reduce(response['reservation_this_month'])));
            $($counters[2]).html(Humanize.intComma(reduce(response['reservation_this_year'])));
        });

        var renderReservationStatisticsChart = function () {
            var data = Stats.yearlyLabels().map(
                function (element, index) {
                    return {"label": element, "value": response['reservation_this_year'][index]}
                });

            Stats.renderBarChart($reservation, data, 'label', ['value']);
        }

        renderReservationStatisticsChart();
    }

    var renderApartmentCleanlinessDonutChart = function () {

        var $apartment = $('#apartment-cleanliness-donut-chart');
        var $parent = $apartment.parent();
        var $counters = $parent.find('[data-plugin="counterup"]')
        var $paragraphs = $parent.find('p')

        var response;

        Stats.callEndpoint($apartment, function (data) {
            response = data;

            $.each(response, function (key, item) {
                $($counters[key]).html(Humanize.intComma(item['value']));
                $($paragraphs[key]).html(item['label']);
            })

        });

        var renderApartmentChart = function () {
            Stats.renderDonutChart($apartment, response);
        }

        renderApartmentChart();
    }

    var renderReservationDonutChart = function () {

        var $reservation = $('#reservation-donut-chart');
        var $parent = $reservation.parent();
        var $counters = $parent.find('[data-plugin="counterup"]')
        var $paragraphs = $parent.find('p')

        var response;

        Stats.callEndpoint($reservation, function (data) {
            response = data;

            $.each(response, function (key, item) {
                $($counters[key]).html(Humanize.intComma(item['value']));
                $($paragraphs[key]).html(item['label']);
            })

        });

        var renderReservationChart = function () {
            Stats.renderDonutChart($reservation, response);
        }

        renderReservationChart();
    }


    return {
        //main function to initiate template pages
        init: function () {
            renderNumericStats();
            renderApartmentAvailabilitiesDonutChart();
            renderApartmentBarChart();
            renderReservationBarChart();
            renderApartmentCleanlinessDonutChart();
            renderReservationDonutChart();

        },
    };

}();

jQuery(document).ready(function () {
    WebServices.init();
});