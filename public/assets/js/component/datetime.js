var DateTime = function () {
    "use strict";

    var $html = $("html");
    var $body = $("body");

    var getLanguageCode = function () {
        return $html.attr("lang") || "en";
    }

    var timezoneCode = function () {
        return $body.data("time-zone");
    }

    var currentTime = function () {
        return moment().tz(timezoneCode());
    }

    var convertDateToDatetime = function (date) {
        var now = currentTime();
        var date = moment(date);
        date.set({
            'hour': now.hour(),
            'minute': now.minute(),
            'second': now.second(),
            'millisecond': now.millisecond()
        });
        return date;
    }

    var renderToDateLocaleString = function (date) {
        moment.locale(getLanguageCode())
        return moment(date).tz(timezoneCode()).format('YYYY-MM-DD');
    }

    var renderToDatetimeLocaleString = function (date, format='YYYY-MM-DD HH:mm:ss') {
        moment.locale(getLanguageCode())
        return moment(date).tz(timezoneCode()).format(format);
    }

    var renderClockComponent = function () {
        var $clock = $("#clock");

        if(!$clock.length)
            return

        return $clock.html(currentTime().format('lll'));
    }


    return {
        //main function to initiate template pages
        init: function () {
            renderClockComponent();
            setInterval(renderClockComponent, 1000);
        },

        getLanguageCode: function () {
            return getLanguageCode();
        },

        convertDateToDatetime: function (date) {
            return convertDateToDatetime(date)
        },

        renderToDateLocaleString: function (date) {
            return renderToDateLocaleString(date)
        },

        renderToDatetimeLocaleString: function (date, format='YYYY-MM-DD HH:mm:ss') {
            return renderToDatetimeLocaleString(date, format)
        },

        currentTime: function () {
            return currentTime();
        },

        currentTimeToString: function () {
            return renderToDatetimeLocaleString(currentTime());
        },

        convertDateToDatetimeString: function (date) {
            return renderToDatetimeLocaleString(convertDateToDatetime(date));
        },

    };

}();

jQuery(document).ready(function () {
    DateTime.init();
});