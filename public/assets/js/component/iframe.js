var Iframe = function () {
    "use strict";

    var renderCallback = function (callback) {
        return callback || function (response) {
            window.parent.postMessage(response, "*");
        }
    }

    var submit = function (btn, validateData, formUrl, formMethod, callback) {
        Form.renderFormSubmit(btn, validateData, formUrl, formMethod, renderCallback(callback))
    }

    return {
        //main function to initiate template pages

        init: function () {

        },

        submit: function (btn, validateData, formUrl, formMethod, callback = null) {
            return submit(btn, validateData, formUrl, formMethod, callback);
        },

        create: function (btn, validateData, formUrl = null, callback = null) {
            return submit(btn, validateData, formUrl, 'POST', callback);
        },

        update: function (btn, validateData, formUrl = null, callback = null) {
            return submit(btn, validateData, formUrl, 'PUT', callback);
        },

        patch: function (btn, validateData, formUrl = null, callback = null) {
            return submit(btn, validateData, formUrl, 'PATCH', callback);
        },

    };


}();

jQuery(document).ready(function () {
    Iframe.init();
});