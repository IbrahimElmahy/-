var WebServices = function () {
    "use strict";

    const validate_data = {
        rules: {
            'name_en': {
                required: true,
            },
            'name_ar': {
                required: true,
            },
            'phone_number': {
                required: true,
            },
        }
    }


    var renderInitCountry = function () {
        $('#country').on("select2:close", function () {
            renderInitCity()
            renderInitNeighborhood()
            renderInitStreet()
        });
    }

    var renderInitCity = function () {
        var city = $('#city');

        var data = function (params) {
            return {
                'country': $('#country').val(),
                'name__contains': params.term,
                'length': 10,
            };
        }

        var processResults = function (response) {
            return {
                results: $.map(response.data, function (item) {
                    return {
                        text: `${item.name}`,
                        id: item.id
                    }
                })
            };
        }

        if (!city.length)
            return

        Select.ajax(city, data, processResults);

        city.on("select2:close", function () {
            renderInitNeighborhood()
            renderInitStreet()
        });
    }

    var renderInitNeighborhood = function () {
        var neighborhood = $('#neighborhood');

        var data = function (params) {
            return {
                'city': $('#city').val(),
                'city__country': $('#country').val(),
                'name__contains': params.term,
                'length': 10,
            };
        }

        var processResults = function (response) {
            return {
                results: $.map(response.data, function (item) {
                    return {
                        text: `${item.name}`,
                        id: item.id
                    }
                })
            };
        }

        if (!neighborhood.length)
            return

        Select.ajax(neighborhood, data, processResults);

        neighborhood.on("select2:close", function () {
            renderInitStreet()
        });
    }

    var renderInitStreet = function () {
        var street = $('#street');

        var data = function (params) {
            return {
                'neighborhood__city__country': $('#country').val(),
                'neighborhood__city': $('#city').val(),
                'neighborhood': $('#neighborhood').val(),
                'name__contains': params.term,
                'length': 10,
            };
        }

        var processResults = function (response) {
            return {
                results: $.map(response.data, function (item) {
                    return {
                        text: `${item.name}`,
                        id: item.id
                    }
                })
            };
        }

        if (!street.length)
            return

        return Select.ajax(street, data, processResults);
    }

    var renderEventListener = function () {
        window.addEventListener('message', function () {
            $.eModal.close();
        });
    }

    var actionCreteObject = function () {
        $("#create-iframe-modal").click(function () {
            Iframe.create($(this), validate_data);
        });
    }

    var actionUpdateObject = function () {
        $("#update-iframe-modal").click(function () {
            Iframe.update($(this), validate_data);
        });
    }

    return {
        //main function to initiate template pages
        init: function () {
            renderInitCountry();
            renderInitCity();
            renderInitNeighborhood();
            renderInitStreet();
            renderEventListener();
            actionCreteObject();
            actionUpdateObject();
        },
    };

}();

jQuery(document).ready(function () {
    WebServices.init();
});