var ArchiveServices = function () {
    "use strict";

    const dataTableElement = $('#datatable');
    const dataTableFilter = $('#filter');
    const btnExportCSV = $('#exportCSV');

    const lang = DateTime.getLanguageCode();


    const messages = {
        EDIT_RESERVATION_INFO: gettext("Edit reservation info"),
        PRINT_RESERVATION_INFO: gettext("Print reservation info")
    };

    var renderViewArchiveServices = function () {
        var tableInstance = Table.renderServerTableView(dataTableElement, dataTableFilter, [
            {
                data: null,
                render: function (data, type, full, meta) {
                    return meta.row + 1;
                },
            },
            {
                data: 'content_type',
            },
            {
                data: 'action_type',
                render: function (data, type) {
                    if (type === "display") {
                        return `<span class="badge badge-pill badge-info">${data}</span>`;
                    }
                },

            },
            {
                data: 'action_time',
                render: function (data) {
                    return data ? Table.renderDate(data) : '-';
                },
            },
            {
                data: 'action_by',
            },
            {
                data: 'role',
            },
            {
                data: 'data.number',
            },
            {
                data: 'data.guest',
            },
            {
                data: 'data.apartment',
            },
            {
                data: 'data.check_in_date',
                render: function (data) {
                    return data ? Table.renderDate(data) : '-';
                },
            },
            {
                data: 'data.check_out_date',
                render: function (data) {
                    return data ? Table.renderDate(data) : '-';
                },
            },
            {
                data: 'data.time',
            },
            {
                data: 'data.status',
                render: function (data, type, source) {
                    if (type === "display") {
                        return `<span class="badge badge-pill badge-${Colors.getReservationStatusColor(data)}">${source['data']['status_display']}</span>`;
                    }
                }
            },
            {
                data: 'data.rental_type',
            },
            {
                data: 'data.period',
            },
            {
                data: 'data.rent',
            },
            {
                data: 'data.amount',
            },
            
            {
                data: 'data.subtotal',
            },
            {
                data: 'data.tax',
            },
            {
                data: 'data.total',
            },
            {
                data: 'data.paid',
            },
            {
                data: 'data.balance',
                render: function (data, type) {
                    if (type === "display") {
                        if (data < 0)
                            return '<span class="badge badge-pill badge-danger">' + data + '</span>';
                        else
                            return '<span class="badge badge-pill badge-success">' + data + '</span>';
                    }
                }
            },
            
        ]);
    };

    var renderReloadTable = function () {
        dataTableElement.DataTable().destroy();
        renderViewArchiveServices();
    };

    var renderEventListener = function () {
        window.addEventListener('message', function () {
            renderReloadTable();
            $.eModal.close();
        });
    };
    var renderExportTableCSV = function () {
        btnExportCSV.click(function (e) {
            e.preventDefault();
            var $form = $('form');
            var $url = btnExportCSV.data('url') + '?' + $form.serialize();
            window.open($url, "_blank");
        });
    }

    var actionFilterObject = function () {
        dataTableFilter.click(function (e) {
            e.preventDefault();
            renderReloadTable();
        });
    };

    return {
        init: function () {
            renderViewArchiveServices();
            renderEventListener();
            actionFilterObject();
            renderExportTableCSV();
        },
        reload: function () {
            renderReloadTable();
        },
    };
}();

jQuery(document).ready(function () {
    ArchiveServices.init();
});
