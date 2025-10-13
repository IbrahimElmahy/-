var ArchiveServices = function () {
    "use strict";

    const dataTableElement = $('#datatable');
    const dataTableFilter = $('#filter')

    var renderViewWebServices = function () {
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
                data: 'data.reservation',

            },
            {
                data: 'data.apartment',

            },
            {
                data: 'data.amount',
            },
            {
                data: 'data.discount_display',
                render: function (data, type) {
                    if (type === "display") {
                        return `<span class="badge badge-pill badge-info">${data}</span>`;
                    }
                }
            },
            {
                data: 'data.subtotal',
            },
            {
                data: 'data.tax',
            },
            {
                data: 'data.total',
            }
        ]);
    };

    var renderReloadTable = function () {
        dataTableElement.DataTable().destroy();
        renderViewWebServices();
    };

    var renderEventListener = function () {
        window.addEventListener('message', function () {
            $.eModal.close();
            renderReloadTable();
        });
    };

    var actionFilterObject = function () {
        dataTableFilter.click(function (e) {
            e.preventDefault();
            renderReloadTable();
        });
    };

    // var handleGuestSelect = function (data) {
    //     if (!data && !$guest) return 0;
    //     $guest.empty().append(`<option value="${data.id}">${data.name}</option>`);
    //     $discountType.val(data['discount_type']);
    //     $discountValue.val(data['discount_value']);
    //     window.parent.postMessage({}, "*");
    // };

    // var actionSelectObject = function () {
    //     $('#selectable tbody').on('click', 'tr', function () {
    //         const data = selectTable.row(this).data();
    //         handleGuestSelect(data);
    //     });
    // };

    return {
        init: function () {
            renderViewWebServices();
            renderEventListener();
            actionFilterObject();
            // actionSelectObject();
        },
        reload: function () {
            renderReloadTable();
        },
    };
}();

jQuery(document).ready(function () {
    ArchiveServices.init();
});
