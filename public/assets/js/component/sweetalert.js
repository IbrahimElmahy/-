var Sweetalert = function () {
    "use strict";

    var csrf = function () {
        return $('input[name="csrfmiddlewaretoken"]').val();
    }

    var alert = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success waves-effect waves-light m-1",
            cancelButton: "btn btn-danger waves-effect waves-light m-1"
        },
        confirmButtonText: `<span class="btn-label"><i class="fe-check-circle mr-1"></i></span>${gettext('Confirm')}`,
        cancelButtonText: `<span class="btn-label"><i class="fe-x mr-1"></i></span>${gettext('Cancel')}`,
        buttonsStyling: !1
    });

    var success = function (title, text, callback) {
        alert.fire({
            icon: "success",
            title: title,
            text: text,
            confirmButtonColor: '#3085d6',
        }).then(() => {
            callback()
        })
    };

    var error = function (state) {
        alert.fire({
            icon: "error",
            title: `${state}`,
            text: gettext('The operation failed. An error occurred during execution. Refresh the page and try again'),
        })
    };

    var confirm = function (callback) {
        alert.fire({
            title: gettext('Are you sure?'),
            text: gettext('The event will be executed and you may not be able to cancel the modifications'),
            icon: "warning",
            showCancelButton: true,
            showLoaderOnConfirm: true,
            preConfirm: () => {
                callback();
            },
            allowOutsideClick: () => !Swal.isLoading()
        })
    };

    var callApi = function (url, method, callback) {
        alert.fire({
            title: gettext('Are you sure?'),
            text: gettext('The event will be executed and you may not be able to cancel the modifications'),
            icon: "warning",
            showCancelButton: true,
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return fetch(url, {method: method, headers: {'X-CSRFToken': csrf()}}
                ).then(response => {
                    if (response.ok) {
                        callback ? callback() : window.location.reload();
                    } else if (response.status === 403) {
                        throw new Error(gettext('You do not have permissions to perform this operation.'));
                    } else {
                        throw new Error(response.statusText)
                    }
                }).catch(error => {
                    Swal.showValidationMessage(`${error}`)
                })
            },
            allowOutsideClick: () => !Swal.isLoading()
        })
    }

    return {
        //main function to initiate template pages

        init: function () {
        },

        success: function (title = gettext('Done'), text = '', callback = null) {
            return success(title, text, callback)
        },

        error: function (state) {
            return error(state)
        },

        confirm : function (callback) {
           return confirm(callback);
        },

        callApi: function (url, method, callback = null) {
            return callApi(url, method, callback)
        }

    };

}();

jQuery(document).ready(function () {
    Sweetalert.init();
});