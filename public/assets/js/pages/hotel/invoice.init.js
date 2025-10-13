var WebServices = function () {
    "use strict";

    var dataTableElement = $('#datatable');
    var dataTableFilter = $('#filter');

    var $InvoiceItemsTable = $('#invoice-items');

    const messages = {
        VIEW_INVOICE_DETAIL: gettext("View invoice detail"),
        PRINT_INVOICE_DETAIL: gettext("Print invoice detail"),
    };

    var renderViewWebServices = function () {
        return Table.renderServerTableView(dataTableElement, dataTableFilter, [
            {
                data: null,
                render: function (data, type, full, meta) {
                    return meta.row + 1;
                },
            },
            {
                data: 'number',

            },
            {
                data: 'reservation',

            },
            {
                data: 'amount',
            },
            {
                data: 'discount_display',
                render: function (data, type) {
                    if (type === "display") {
                        return `<span class="badge badge-pill badge-info">${data}</span>`;
                    }
                }
            },
            {
                data: 'subtotal',
            },
            {
                data: 'tax',
            },
            {
                data: 'total',
            },
            {
                data: 'created_at',
                render: function (data) {
                    return data ? Table.renderDate(data) : '-'
                },
            },
            {
                data: 'updated_at',
                render: function (data) {
                    return data ? Table.renderDate(data) : '-'
                },
            },
            {
                data: 'absolute_url',
                render: function (data, type, source) {
                    return `<a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="detail/${source['id']}/" data-title="${messages.VIEW_INVOICE_DETAIL}" data-width="96%" data-height="79%"> <i class="mdi mdi-24px mdi-file-edit-outline"></i></a><a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="print/${source['id']}/" data-title="${messages.PRINT_INVOICE_DETAIL}" data-width="96%" data-height="79%"> <i class="mdi mdi-24px mdi-printer"></i></a><a href="javascript:void(0);" id="delete-object-modal" class="action-icon" data-url="${data}"> <i class="mdi mdi-24px mdi-delete"></i> </a>`
                },
            }
        ]);
    };

    var renderInvoiceItems = function () {
        return Table.renderLocalTableView($InvoiceItemsTable);
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

    var actionDeleteObject = function () {
        $(document).on("click", '#delete-object-modal', function (e) {
            e.preventDefault();
            var _this = $(this);
            Sweetalert.callApi(_this.data('url'), 'DELETE', function () {
                renderReloadTable();
            })
        });
    }

    return {
        //main function to initiate template pages
        init: function () {
            renderViewWebServices();
            renderInvoiceItems();
            renderEventListener();
            actionFilterObject();
            actionDeleteObject();
        },
    };

}();

jQuery(document).ready(function () {
    WebServices.init();
});