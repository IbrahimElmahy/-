var CalenderServices = function () {
    "use strict";

    const $currentDate = new Date(DateTime.currentTimeToString());
    const $lang = DateTime.getLanguageCode();

    const $startDate = $('#check_in_date');
    const $endDate = $('#check_out_date');
    const $rentalType = $('#rental_type');
    const $period = $('#period');
    const $apartment = $('#apartment');

    const messages = {
        SELECT_APARTMENT_DATA: gettext('Select apartment data'),
        EDIT_APARTMENT_DATA: gettext('Edit apartment data'),
    }

    var getStartDate = function () {
        return new Date(DateTime.convertDateToDatetimeString($startDate.val()));
    }

    var getEndDate = function () {
        return new Date(DateTime.convertDateToDatetimeString($endDate.val()));
    }

    var getDiffInHours = function (startDate = getStartDate(), endDate = getEndDate()) {
        return Math.round((endDate - startDate) / (1000 * 60 * 60));
    }

    var getDiffInDays = function (startDate = getStartDate(), endDate = getEndDate()) {
        return Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
    }

    var getDiffInMonths = function (startDate = getStartDate(), endDate = getEndDate()) {
        return getDiffInDays(startDate, endDate) / 30;
    }

    var getFlatpickrData = function () {
        return {
            defaultDate: $currentDate,
            dateFormat: "Y-m-d",
            locale: DateTime.getLanguageCode(),
            onChange: renderInitPeriod,
            onClose: handleFlatpickrCallback,
        }
    }

    var renderInitStartDate = function () {
        var data = $.extend(getFlatpickrData(), {
            defaultDate: $startDate.val() ? $startDate.val() : $currentDate,
        })
        return $startDate.flatpickr(data)
    }

    var renderInitEndDate = function () {
        var data = $.extend(getFlatpickrData(), {
            defaultDate: $endDate.val() ? $endDate.val() : $currentDate.fp_incr(1)
        })
        return $endDate.flatpickr(data)
    }

    var renderInitTime = function () {
        var $time = $('#time');
        var defaultDate = $time.val() || $currentDate.getTime();

        var data = {
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
            defaultDate: defaultDate,
            locale: $lang,

        }

        return $time.flatpickr(data)
    }

    var getStartDateFlatpickr = function () {
        return $startDate[0]._flatpickr;
    }

    var getEndDateFlatpickr = function () {
        return $endDate[0]._flatpickr;
    }

    var handleFlatpickrCallback = function () {
        var startDate = getStartDate();
        var endDate = getEndDate();

        switch ($rentalType.val()) {
            case "hourly": {
                getEndDateFlatpickr().set("disable", []);
                var diffInHours = getDiffInHours()
                if (diffInHours < 0) {
                    if (startDate >= endDate) {
                        getEndDateFlatpickr().setDate(startDate.fp_incr(1));

                    } else {
                        getStartDateFlatpickr().setDate(endDate.fp_incr(-1));
                    }
                }
                break;
            }
            case "daily": {
                getEndDateFlatpickr().set("disable", []);
                var diffInDays = getDiffInDays()
                if (diffInDays <= 0) {
                    if (startDate >= endDate) {
                        getEndDateFlatpickr().setDate(startDate.fp_incr(1));

                    } else {
                        getStartDateFlatpickr().setDate(endDate.fp_incr(-1));
                    }
                }
                break;
            }
            case "monthly": {
                getEndDateFlatpickr().set("disable", [function (date) {
                    var diffInDays = getDiffInDays(startDate.fp_incr(0), date)
                    return diffInDays === 0 || diffInDays % 30 !== 0
                }]);

                var diffInDays = getDiffInDays()

                if (!diffInDays || diffInDays % 30 !== 0) {
                    getEndDateFlatpickr().setDate(startDate.fp_incr(30));
                }

                break;
            }
        }

    }

    var renderInitRentalType = function () {
        $rentalType.on("change", function () {
            handleFlatpickrCallback();
            renderInitPeriod();
        });
    }

    var renderInitPeriod = function () {
        switch ($rentalType.val()) {
            case "hourly": {
                var diff = getDiffInHours() || $period.val() || 1
                break;
            }

            case "daily": {
                var diff = getDiffInDays()
                break;
            }

            case "monthly": {
                var diff = getDiffInMonths()
                break;
            }
        }

        diff = Math.floor(diff);
        $period.val(diff);
        $period.trigger('change');
    }

    var renderOnChangePeriod = function () {
        $period.on("keyup", function () {
            var period = parseInt($(this).val());
            if (period || period > 0) {
                switch ($rentalType.val()) {
                    case "hourly": {
                        getEndDateFlatpickr().setDate(new Date(getStartDate().getTime() + period * 60 * 60 * 1000));
                        break;
                    }
                    case "daily": {
                        getEndDateFlatpickr().setDate(new Date(getStartDate().getTime() + period * 24 * 60 * 60 * 1000));
                        break;
                    }
                    case "monthly": {
                        getEndDateFlatpickr().setDate(new Date(getStartDate().getTime() + period * 24 * 60 * 60 * 30 * 1000));
                        break;
                    }
                }
            }
        });

    }

    var renderInitApartment = function () {
        $('#btn-apartment-view').click(function () {
            var checkInDate = $startDate.val();
            var checkOutDate = $endDate.val();
            if(!checkInDate || !checkOutDate)
                return

            var url = `/${$lang}/hpanel/apartments/select/?check_in_date=${checkInDate}&check_out_date=${checkOutDate}`;
            Modal.iframe(url, messages.SELECT_APARTMENT_DATA, '100%', '100%');
        })

        $('#btn-apartment-update').click(function () {
            var apartment = $apartment.val();

            if (!apartment)
                return 0;

            var url = `/${$lang}/hpanel/apartments/setup/update/${apartment}/`;
            Modal.iframe(url, messages.EDIT_APARTMENT_DATA, '100%', '100%');
        })
    }

    return {
        //main function to initiate template pages
        init: function () {
            renderInitRentalType();
            renderInitStartDate();
            renderInitEndDate();
            renderInitTime();
            renderInitPeriod();
            renderOnChangePeriod();
            renderInitApartment();
        },
    };

}();

jQuery(document).ready(function () {
    CalenderServices.init();
});