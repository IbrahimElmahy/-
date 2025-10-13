var AuthServices = function () {
    "use strict";

    const validate_data = {
        rules: {
            'username': {
                required: true,
            },
            'password': {
                required: true,
            },
        },
    }

    var actionLoginService = function () {
        $("#btn-login").click(function (e) {
            e.preventDefault();
            Form.renderFormSubmit($(this), validate_data, null, "POST", function () {
                window.location.reload()
            })
        })
    };

    return {
        //main function to initiate template pages
        init: function () {
            actionLoginService();
        }
    };
}();

jQuery(document).ready(function () {
    AuthServices.init();
});
