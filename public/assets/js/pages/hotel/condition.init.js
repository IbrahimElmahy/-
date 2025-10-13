var WebServices = function () {
    "use strict";

    var renderEventListener = function () {
        window.addEventListener('message', function () {
            $.eModal.close();
        });
    }

    var actionUpdateObject = function () {
        $("#update-iframe-modal").click(function () {
            Iframe.update($(this), null);
        });
    }

    return {
        //main function to initiate template pages
        init: function () {
            renderEventListener();
            actionUpdateObject();
        },
    };

}();

jQuery(document).ready(function () {
    WebServices.init();
});