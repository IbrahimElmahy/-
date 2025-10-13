var ArchiveServices = function () {
    "use strict";

    const dataTableElement = $('#datatable');
    const dataTableFilter = $('#filter');

    const messages = {
        EDIT_GUEST_INFO: gettext("Edit guest data"),
        ACTIVATED: gettext("Activated"),
        DISABLED: gettext("Disabled"),
     
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
                data: 'data.name',
            },
            {
                data: 'data.phone_number',
            },
            {
                data: 'data.guest_type',
            },
            {
                data: 'data.ids',
            },
            {
                data: 'data.id_number',
            },
            {
                data: 'data.is_active',
                render: function (data, type) {
                    if (type === "display" && data) {
                        return `<span class="badge badge-pill badge-success">${messages.ACTIVATED}</span>`;
                    } else {
                        return `<span class="badge badge-pill badge-danger">${messages.DISABLED}</span>`;
                    }
                },
            },
        
            // {
            //     data: 'absolute_url',
            //     render: function (data, type, source) {
            //         if (source['is_active'] === true) {
            //             return `<a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="update/${source['id']}/" data-title="${messages.EDIT_GUEST_INFO}" data-width="95%" data-height="75%"> <i class="mdi mdi-24px mdi-file-edit-outline"></i></a><a href="javascript:void(0)" id="deactivate-object-modal" class="action-icon" data-url="${data}disable/"> <i class="mdi mdi-24px mdi-shield-off-outline"></i></a><a href="javascript:void(0);" id="delete-object-modal" class="action-icon" data-url="${data}"> <i class="mdi mdi-24px mdi-delete"></i> </a>`;
            //         } else {
            //             return `<a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="update/${source['id']}/" data-title="${messages.EDIT_GUEST_INFO}" data-width="95%" data-height="75%"> <i class="mdi mdi-24px mdi-file-edit-outline"></i></a><a href="javascript:void(0)" id="activate-object-modal" class="action-icon" data-url="${data}active/"> <i class="mdi mdi-24px mdi-shield-check-outline"></i></a><a href="javascript:void(0);" id="delete-object-modal" class="action-icon" data-url="${data}"> <i class="mdi mdi-24px mdi-delete"></i> </a>`;
            //         }
            //     },
            // },
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
