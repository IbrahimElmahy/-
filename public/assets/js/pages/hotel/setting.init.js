var WebServices = function () {
    "use strict";


    var renderEventListener = function () {
        window.addEventListener('message', function () {
            $.eModal.close();
        });
    }


    return {
        //main function to initiate template pages
        init: function () {
            renderEventListener();
        },
    };

}();

jQuery(document).ready(function () {
    WebServices.init();
});