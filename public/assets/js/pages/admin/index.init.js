var WebServices = function () {
    "use strict";

    var reduce = function (array) {
        return array.reduce(function (x, y) {
            return x + y;
        }, 0);
    }

    var renderHotelsNumericStats = function () {
        var $hotel = $('[data-variable="hotels"]');

        Stats.callEndpoint($hotel, function (data) {
            $hotel.html(Humanize.compactInteger(data['hotels'], 1))
        });
    }

    var renderReservationsNumericStats = function () {
        var $reservation = $('[data-variable="reservations"]');

        Stats.callEndpoint($reservation, function (data) {
            $reservation.html(Humanize.compactInteger(data['reservations'], 1))
        });
    }

    var renderHotelBarChart = function () {

        var $hotel = $('#hotel-bar-chart');
        var $parent = $hotel.parent();
        var $counters = $parent.find('[data-plugin="counterup"]')

        var response;

        Stats.callEndpoint($hotel, function (data) {
            response = data;
            $($counters[0]).html(Humanize.intComma(reduce(response['hotel_this_week'])));
            $($counters[1]).html(Humanize.intComma(reduce(response['hotel_this_month'])));
            $($counters[2]).html(Humanize.intComma(reduce(response['hotel_this_year'])));
        });

        var renderHotelStatisticsChart = function () {
            var data = Stats.yearlyLabels().map(
                function (element, index) {
                    return {"label": element, "value": response['hotel_this_year'][index]}
                });

            Stats.renderBarChart($hotel, data, 'label', ['value']);
        }

        renderHotelStatisticsChart();
    }

    var renderGuestsNumericStats = function () {
        var $guest = $('[data-variable="guests"]');

        Stats.callEndpoint($guest, function (data) {
            $guest.html(Humanize.compactInteger(data['guests'], 1))
        });
    }

    var renderGuestBarChart = function () {

        var $guest = $('#guest-bar-chart');
        var $parent = $guest.parent();
        var $counters = $parent.find('[data-plugin="counterup"]')

        var response;

        Stats.callEndpoint($guest, function (data) {
            response = data;
            $($counters[0]).html(Humanize.intComma(reduce(response['guest_this_week'])));
            $($counters[1]).html(Humanize.intComma(reduce(response['guest_this_month'])));
            $($counters[2]).html(Humanize.intComma(reduce(response['guest_this_year'])));
        });

        var renderGuestStatisticsChart = function () {
            var data = Stats.yearlyLabels().map(
                function (element, index) {
                    return {"label": element, "value": response['guest_this_year'][index]}
                });

            Stats.renderBarChart($guest, data, 'label', ['value']);
        }

        renderGuestStatisticsChart();
    }

    var renderGuestTypeDonutChart = function () {

        var $guest = $('#guest-type-donut-chart');
        var $parent = $guest.parent();
        var $counters = $parent.find('[data-plugin="counterup"]')
        var $paragraphs = $parent.find('p')

        var response;

        Stats.callEndpoint($guest, function (data) {
            response = data;

            $.each(response, function (key, item) {
                $($counters[key]).html(Humanize.intComma(item['value']));
                $($paragraphs[key]).html(item['label']);
            })

        });

        var renderGuestTypeChart = function () {
            Stats.renderDonutChart($guest, response);
        }

        renderGuestTypeChart();
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


    return {
        //main function to initiate template pages
        init: function () {
            renderHotelsNumericStats();
            renderReservationsNumericStats();
            renderGuestsNumericStats();
            renderHotelBarChart();
            renderGuestBarChart();
            renderGuestTypeDonutChart();
            renderReservationBarChart();
        },
    };

}();

jQuery(document).ready(function () {
    WebServices.init();
});