var Toast = function () {
    "use strict";

    var toast = function (heading, text, showHideTransition, bgColor, icon = null) {
        $.toast({
            heading: heading,
            text: text,
            showHideTransition: showHideTransition,
            hideAfter: 6000,
            bgColor: bgColor,
            textColor: '#ffffff',
            loaderBg: '#ffffff',
            position: 'top-center',
            textAlign: 'center',
            icon: icon,
        })
    }

    return {
        //main function to initiate template pages

        init: function () {

        },

        success: function (text, showHideTransition = 'slide') {
            return toast(gettext("Success"), text, showHideTransition, '#5ba035', 'success');
        },

        error: function (text, showHideTransition = 'slide') {
            return toast(gettext("Error"), text, showHideTransition, '#ff3333', 'error');
        },

        warning: function (text, showHideTransition = 'slide') {
            return toast(gettext("Error"), text, showHideTransition, '#da8609', 'warning');
        },

        info: function (text, showHideTransition = 'slide') {
            return toast(gettext("Info"), text, showHideTransition, '#1ea69a', 'info');
        },

    };


}();

jQuery(document).ready(function () {
    Toast.init();
});