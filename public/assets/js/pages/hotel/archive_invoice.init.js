var ArchiveServices = function () {
    "use strict";

    const dataTableElement = $('#datatable');
    const dataTableFilter = $('#filter');

    const messages = {
        EDIT_GUEST_INFO: gettext("Edit guest data"),
        ACTIVATED: gettext("Activated"),
        DISABLED: gettext("Disabled")
    };

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

   

    return {
        init: function () {
            renderViewWebServices();
            renderEventListener();
            actionFilterObject();
        },
        reload: function () {
            renderReloadTable();
        },
    };
}();

jQuery(document).ready(function () {
    ArchiveServices.init();
});
