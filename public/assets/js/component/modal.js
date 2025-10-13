var Modal = function () {
    "use strict";

    var getResponsiveWidth = function (width) {
        var parseWidth =  parseFloat(width);

         if (parseWidth>= 90 && screen.width >= 992 && screen.width < 1100)
            return '95%';

        else if (parseWidth>= 90 && screen.width >= 1100 && screen.width < 1300)
            return '90%';

        else if (screen.width >= 1300 && screen.width < 1600)
            return '75%';

        else if ( screen.width >= 1600)
            return '60%';
        return width;
    }

    var getResponsiveHeight = function (height) {
        var parseHeight =  parseFloat(height);

        if (parseHeight >= 90 && screen.height < 750)
            return '98%';

        else if (screen.height >= 750 && screen.height < 1000)
            return '85%';

        else if (screen.width >= 1000)
            return '60%';

        else
            return height;
    }

    var iframe = function (url, title, width, height) {
        height = getResponsiveHeight(height);
        width = getResponsiveWidth(width);

        var data = {
            position: ['middle', 'center'],
            width: width,
            height: height,
            async: true,
            overlayClose: false,
            iframe: {
                url: url,
                loadingHtml: `<div class="card-disabled"><div class="card-portlets-loader"></div></div>`
            }
        }
        return $.eModal.iframe(data, title)
    }

    var confirm = function (message, title, size, subtitle) {
        var data = {
            message: message,
            size: size,
            subtitle: subtitle,
            label: "True",
        }

        return $.eModal.confirm(data, title);
    }

    return {
        //main function to initiate template pages

        init: function () {

        },

        iframe: function (url, title = null, width = '50%', height = '50%') {
            return iframe(url, title, width, height);
        },

        confirm: function (message, title, size = $.eModal.size.lg, subtitle = '') {
            return confirm(message, title, size, subtitle);
        },

    };
}();

jQuery(document).ready(function () {
    Modal.init();
});