var Stats = function () {
    "use strict";

    const weeklyLabels = [gettext("MON"), gettext("TUE"), gettext("WED"), gettext("THU"), gettext("FRI"),  gettext("SAT"), gettext("SUN")];

    const monthlyLabels = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"];

    const yearlyLabels = [gettext("Jan"), gettext("Feb"), gettext("Mar"), gettext("Apr"), gettext("May"), gettext("Jun"), gettext("Jul"), gettext("Aug"), gettext("Sept"), gettext("Oct"), gettext("Nov"), gettext("Dec")];

    var callEndpoint = function (element, success, error) {
        $.ajax({
            url: element.data("url"),
            type: 'get',
            async: false,
            success: success,
            error: error
        });
    }

    var renderDonutChart = function (element, data) {
        return Morris.Donut({
            element: element,
            colors: element.data('colors').split(","),
            data: data,
            resize: true,
            barSize: "0.1",
            backgroundColor: "transparent",
            gridLineColor: "rgba(65, 80, 95, 0.07)",
        });
    }

    var renderBarChart = function (element, data, xkey, ykeys) {
        return Morris.Bar({
            element: element,
            data: data,
            xkey: xkey,
            ykeys: ykeys,
            barColors: element.data('colors').split(","),
            labels: element.data('labels').split(","),
            resize: true,
            dataLabels: !1,
            hideHover: "auto",
            gridLineColor: "rgba(65, 80, 95, 0.07)",
            barSizeRatio: 0.2,
        });
    }

    var renderAreaChart = function (element, data, xkey, ykeys) {
        return Morris.Area({
            element: element,
            data: data,
            xkey: xkey,
            ykeys: ykeys,
            lineColors: element.data('colors').split(","),
            labels: element.data('labels').split(","),
            pointSize: 3,
            lineWidth: 1,
            dataLabels: true,
            hideHover: "auto",
            pointFillColors: ["#999999"],
            pointStrokeColors: ["#ffffff"],
            resize: true,
            smooth: false,
            gridLineColor: "rgba(65, 80, 95, 0.07)",
        });
    }


    return {
        init: function () {

        },


        weeklyLabels: function () {
            return weeklyLabels;
        },

        monthlyLabels: function () {
            return monthlyLabels;
        },

        yearlyLabels: function () {
            return yearlyLabels;
        },

        callEndpoint: function (element, success) {
            return callEndpoint(element, success, function (response) {
                Form.renderErrorFunction(response)
            })
        },

        renderDonutChart: function (element, data) {
            return renderDonutChart(element, data)
        },

        renderBarChart: function (element, data, xkey, ykeys) {
            return renderBarChart(element, data, xkey, ykeys)
        },

        renderAreaChart: function (element, data, xkey, ykeys) {
            return renderAreaChart(element, data, xkey, ykeys)
        }

    };

}();