var Colors = function () {
    "use strict";

    var colors = {
        SUCCESS: 'success',
        WARING: 'warning',
        DANGER: 'danger',
        INFO: 'info',
        PRIMARY: 'primary',
        SECONDRY: 'secondary'
    }

    var getApartmentAvailabilityColor = function (availability) {
        switch (availability) {
            case 'available': {
                return colors.SUCCESS;
            }
            case 'reserved': {
                return colors.DANGER;
            }

        }
    }

    var getApartmentCleanlinessColor = function (cleanliness) {
        switch (cleanliness) {
            case 'clean': {
                return colors.SUCCESS;
            }
            case 'dirty': {
                return colors.WARING;
            }
            case 'maintenance': {
                return colors.SECONDRY;
            }
        }
    }

    var getReservationStatusColor = function (status) {
        switch (status) {
            case 'pending': {
                return colors.INFO;
            }
            case 'checkin': {
                return colors.DANGER;
            }
            case 'checkout_today': {
                return colors.PRIMARY;
            }
            case 'checkout': {
                return colors.SUCCESS;
            }
        }
    }

    return {
        //main function to initiate template pages
        init: function () {

        },

        getApartmentAvailabilityColor: function (availability) {
            return getApartmentAvailabilityColor(availability);
        },

        getApartmentCleanlinessColor: function (cleanliness) {
            return getApartmentCleanlinessColor(cleanliness);
        },

        getReservationStatusColor: function (cleanliness) {
            return getReservationStatusColor(cleanliness);
        },

    };

}();

jQuery(document).ready(function () {
    Colors.init();
});