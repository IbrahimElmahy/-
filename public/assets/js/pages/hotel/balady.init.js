var WebServices = function () {
    "use strict";

    const dataTableElement = $('#datatable');
    const dataTableFilter = $('#filter');
    const btnExportCSV = $('#exportCSV');

    var renderInitApartmentType = function () {
        var apartment_type = $("#apartment__apartment_type");

        var data = function (params) {
            return {
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

        if (!apartment_type.length)
            return

        Select.ajax(apartment_type, data, processResults);
    }

    var renderInitSource = function () {
        var source = $("#source");

        var data = function (params) {
            return {
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

        if (!source.length)
            return

        return Select.ajax(source, data, processResults);
    }

    var renderInitReason = function () {
        var reason = $("#reason");

        var data = function (params) {
            return {
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

        if (!reason.length)
            return

        return Select.ajax(reason, data, processResults);
    }

    var renderViewWebServices = function () {
        Table.renderServerTableView(dataTableElement, dataTableFilter, [
            {
                data: 'apartment',

            },
            {
                data: 'check_in_date',
                render: function (data) {
                    return data ? Table.renderDate(data, 'DD/MM/YYYY') : '-'
                },
            },
            {
                data: 'check_out_date',
                render: function (data) {
                    return data ? Table.renderDate(data, 'DD/MM/YYYY') : '-'
                },
            },
            {
                data: 'subtotal',
            },
            {
                data: 'guest',

            },
            {
                data: 'number',

            },
            {
                data: 'apartment_type',

            },
            {
                data: 'note',

            },
        ]);
    };

    var renderReloadTable = function () {
        dataTableElement.DataTable().destroy();
        renderViewWebServices();
    }

    var renderEventListener = function () {
        window.addEventListener('message', function () {
            renderReloadTable();
            $.eModal.close();
        });
    }

    var actionFilterObject = function () {
        dataTableFilter.click(function (e) {
            e.preventDefault();
            renderReloadTable();
        })
    }

    var renderExportTableCSV = function () {
        btnExportCSV.click(function (e) {
            e.preventDefault();
            var $form = $('form');
            var $url = btnExportCSV.data('url') + '?' + $form.serialize();
            window.open($url, "_blank");
        });
    }

    return {
        //main function to initiate template pages
        init: function () {
            renderInitApartmentType();
            renderInitSource();
            renderInitReason();
            renderViewWebServices();
            renderEventListener();
            actionFilterObject();
            renderExportTableCSV();
        }
    };

}();

jQuery(document).ready(function () {
    $('#check_out_date__lte').flatpickr({
        plugins: [
            new monthSelectPlugin({
              shorthand: true, //defaults to false
              dateFormat: "M/Y", //defaults to "F Y"
              altFormat: "F Y", //defaults to "F Y"
              theme: "dark" // defaults to "light"
            })
        ]
        
    });
    WebServices.init();
});