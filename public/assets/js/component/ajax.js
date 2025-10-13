var Ajax = function () {
    "use strict";

    var ajax = function (url, method, data, async, success, error) {
        return $.ajax({
            url: url,
            method: method,
            data: data,
            async: async,
            beforeSend: function () {
                $("body").append('<div id="preloader"><div class="card-disabled"><div class="card-portlets-loader"></div></div></div>')
            },
            success: success,
            error: error,
            complete: function () {
                $("#preloader").remove()
            },
        })
    }

    return {
        //main function to initiate template pages

        init: function () {

        },

        ajax: function (url, method = 'get', data = {}, async = false, success = null, error = null) {
            return ajax(url, method, data, async, success, error);
        },

        get: function (url, data = {}, async = false, success = null, error = null) {
            return ajax(url, 'get', data, async, success, error);
        },

    };


}();

jQuery(document).ready(function () {
    Modal.init();
});