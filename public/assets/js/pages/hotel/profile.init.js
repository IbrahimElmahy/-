var WebServices = function () {
    "use strict";

    const validate_data = {
        rules: {
            'name': {
                required: true,
            },
            'username': {
                required: true,
            },
            'email': {
                email: true,
                required: true,
            },
            'phone_number': {
                required: true,
            }
        }
    }

    var renderInitGender = function () {
        var gender = $("#gender");
        var processResults = function (response) {
            return {
                results: $.map(response, function (item) {
                    return {
                        text: item[1],
                        id: item[0]
                    }
                })
            };
        }

        if (!gender.length)
            return

        return Select.ajax(gender, null, processResults);
    }

    var actionUpdateObject = function () {
        $("#update-iframe-modal").click(function () {
            Iframe.update($(this), validate_data);
        });
    }

    return {
        //main function to initiate template pages
        init: function () {
            renderInitGender();
            actionUpdateObject();
        },
    };

}();

jQuery(document).ready(function () {
    WebServices.init();
});