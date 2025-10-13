var Form = function () {
    "use strict";


    var functionErrorAction = function (key, val) {

        if (val instanceof Object && !(val instanceof Array)) {
            return $.each(val, functionErrorAction);
        }

        if (val instanceof Array) {
            val = val[0]
            if (val instanceof Object) {
                key = Object.keys(val)[0];
                val = val[key][0]
            }
        }

        var input = $('form').find(`input[id="${key}"], select[id="${key}"]`)

        if (!input.length)
            return Toast.error(`${val}`)

        var group = input.closest('.select2-hidden-accessible');

         if (group.length) {
            input = group.parent().find(".select2-selection")
        }

        input.removeClass('error').addClass("error")
        input.after(`<label id="${key}-error" class="error invalid-feedback" for="${key}" style="display: inline-block;">${val}</label>`)
    }

    var renderFormBase = function (btn, validateData = null, formUrl = null, formMethod = null, successCallback = null, errorCallback = null) {
        var form = btn.closest("form");
        var btnHtml = btn.html();
        var span = btn.find('span');
        var spinner = `<i class="fa fa-spinner fa-spin"></i>`;

        if (validateData !== null) {
            form.validate(validateData);

            if (!form.valid()) {
                return 0;
            }
        }

        btn.attr('disabled', 'disabled')
        span.is(':visible') ? span.html(spinner) : btn.html(spinner)

        form.ajaxSubmit({
            url: formUrl ? formUrl : form.attr("data-url"),
            type: formMethod ? formMethod : form.attr("method"),
            success: function (response) {
                setTimeout(function () {
                    successCallback ? successCallback(response) : null;
                    btn.attr('disabled', false).html(btnHtml);
                }, 3000)

            },
            error: function (response) {
                console.log(response)
                setTimeout(function () {
                    errorCallback ? errorCallback(response) : null;
                    btn.attr('disabled', false).html(btnHtml);
                }, 3000)

            }
        });

    }

    var renderErrorFunction = function (response) {
        if (response.status === 400) {
            $.each(response['responseJSON'], functionErrorAction);
        } else {
            Sweetalert.error(response.status)
        }
    }

    var renderFormSubmit = function (btn, validateData = null, formUrl = null, formMethod = null, successCallback = null) {
        return renderFormBase(btn, validateData, formUrl, formMethod, successCallback,
            function (response) {
                renderErrorFunction(response)
            }
        )
    }

    var renderToRedirectPageView = function (element, timeout) {
        var elementText = element.find('span').html();
        element.attr('disabled', 'disabled').find('span').html('<i class="fa fa-spinner fa-spin"></i>');
        setTimeout(function () {
            element.attr('disabled', false).find('span').html(elementText);
            window.location.pathname = element.attr("data-url")
        }, timeout);
    }

    return {
        //main function to initiate template pages

        init: function () {
        },

        renderFormSubmit: function (btn, validateData = null, formUrl = null, formMethod = null, successCallback = null) {
            return renderFormSubmit(btn, validateData, formUrl, formMethod, successCallback)
        },

        renderErrorFunction: function (response) {
            return renderErrorFunction(response)
        },

        renderFormPostAction: function (btn, validateData = null, redirectUrl = null) {
            return renderFormSubmit(btn, validateData, null, 'POST', function () {
                Sweetalert.success('تمت العملية بنجاح', 'تمت عملية إضافة البينات بنجاح', redirectUrl)
            })
        },

        renderFormPutAction: function (btn, validateData = null, redirectUrl = null) {
            return renderFormSubmit(btn, validateData, null, 'PUT', function () {
                Sweetalert.success('تمت العملية بنجاح', 'تمت عملية تعديل البينات بنجاح', redirectUrl)
            })
        },

        renderToRedirectPageView: function (element, timeout = 500) {
            renderToRedirectPageView(element, timeout)
        },


    };


}();

jQuery(document).ready(function () {
    Form.init();
});