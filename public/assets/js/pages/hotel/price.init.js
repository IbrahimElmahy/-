var WebServices = function () {
    "use strict";

    const dataTableElement = $('#datatable');
    const dataTableFilter = $('#filter');

    const messages = {
        EDIT_APARTMENT_PRICE: gettext("Edit Apartment Price"),
    };

    const validate_data = {
        rules: {
            'hourly_price': {
                required: true,
            },
            'hourly_minimum_price': {
                required: true,
            },
            'regular_price': {
                required: true,
            },
            'regular_minimum_price': {
                required: true,
            },
            'monthly_price': {
                required: true,
            },
            'monthly_minimum_price': {
                required: true,
            },
            'peak_price': {
                required: true,
            },
        }
    }

    var renderInitApartmentType = function () {
        var apartmentType = $('#apartment_type');

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

        if (!apartmentType.length)
            return

        return Select.ajax(apartmentType, data, processResults);
    }

    var renderViewWebServices = function () {
        Table.renderServerTableView(dataTableElement, dataTableFilter, [
            {
                data: null,
                render: function (data, type, full, meta) {
                    return meta.row + 1;
                },
            },
            {
                data: 'apartment',

            },
            {
                data: 'apartment_type',

            },
            {
                data: 'floor',

            },
            {
                data: 'rooms',

            },
            {
                data: 'hourly_price',

            },
            {
                data: 'hourly_minimum_price',

            },
            {
                data: 'regular_price',

            },
            {
                data: 'regular_minimum_price',

            },
            {
                data: 'monthly_price',

            },
            {
                data: 'monthly_minimum_price',

            },
            {
                data: 'peak_price',

            },
            {
                data: 'absolute_url',
                render: function (data, type, source) {
                    return `<a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="update/${source['apartment_id']}/" data-title="${messages.EDIT_APARTMENT_PRICE}" data-width="100%" data-height="83%"> <i class="mdi mdi-24px mdi-file-edit-outline"></i></a>`

                },
            }
        ]);
    };

    var renderReloadTable = function () {
        dataTableElement.DataTable().destroy();
        renderViewWebServices();
    }

    var renderEventListener = function () {
        window.addEventListener('message', function () {
            $.eModal.close();
            renderReloadTable();
        });
    }

    var actionFilterObject = function () {
        dataTableFilter.click(function (e) {
            e.preventDefault();
            renderReloadTable();
        })
    }


    var actionUpdateObject = function () {
        $("#update-iframe-modal").click(function () {
            Iframe.update($(this), validate_data);
        });
    }


    return {
        //main function to initiate template pages
        init: function () {
            renderInitApartmentType();
            renderViewWebServices();
            renderEventListener();
            actionFilterObject();
            actionUpdateObject();
        },
    };

}();

jQuery(document).ready(function () {
    WebServices.init();
});