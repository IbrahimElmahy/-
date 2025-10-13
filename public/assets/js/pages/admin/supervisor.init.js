var WebServices = function () {
    "use strict";

    const dataTableElement = $('#datatable');
    const dataTableFilter = $('#filter');

    const messages = {
        EDIT_SUPERVISOR_INFO: gettext("Edit supervisor info"),
        MANAGER: gettext("Manager"),
        EMPLOYEE: gettext("Employee"),
        ACTIVATED: gettext("Activated"),
        DISABLED: gettext("Disabled"),
    };

    const validate_data = {
        rules: {
            'name': {
                required: true,
            },
            'username': {
                required: true,
            },
            'email': {
                email: true,
                required: true,
            },
            'phone_number': {
                required: true,
            },
            'password': {
                required: true,
                alphanumeric: true,
                minlength: 4,

            },
            'confirm': {
                required: true,
                equalTo: "#password"
            },
        }
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
                data: 'username',
                render: function (data, type, source) {
                    if (type === "display") {
                        return `<a href="javascript:void(0)" class="text-body font-weight-semibold" data-toggle="iframe-modal" data-url="update/${source['id']}/" data-title="${messages.EDIT_SUPERVISOR_INFO}" data-width="80%" data-height="75%">${data}</a>`
                    }
                },
            },
            {
                class: "table-user",
                data: 'name',
                render: function (data, type, source) {
                    if (type === "display") {
                        return `<img src="${source['image_url']}" alt="table-user" class="mr-2 rounded-circle"><a href="javascript:void(0)" class="text-body font-weight-semibold" data-toggle="iframe-modal" data-url="update/${source['id']}/" data-title="${messages.EDIT_SUPERVISOR_INFO}" data-width="80%" data-height="75%">${data}</a>`
                    }
                },
            },
            {
                data: 'phone_number',
                render: function (data, type) {
                    if (type === "display") {
                        return '<div style="direction: ltr">' + data + '</div>'
                    }
                },
            },
            {
                data: 'email',
            },
            {
                data: 'is_manager',
                render: function (data, type) {
                    if (type === "display" && data) {
                        return `<span class="badge badge-pill badge-success">${messages.MANAGER}</span>`;
                    } else
                        return `<span class="badge badge-pill badge-info">${messages.EMPLOYEE}</span>`
                },
            },
            {
                data: 'login_allowed',
                render: function (data, type) {
                    if (type === "display" && data) {
                        return `<span class="badge badge-pill badge-success">${messages.ACTIVATED}</span>`;
                    } else
                        return `<span class="badge badge-pill badge-danger">${messages.DISABLED}</span>`
                },
            },

            {
                data: 'profile.gender_display',
            },
            {
                data: 'last_login',
                render: function (data) {
                    return data ? Table.renderDate(data) : '-'
                },
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
                    if (source['login_allowed'] === true) {
                        return `<a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="update/${source['id']}/" data-title="${messages.EDIT_SUPERVISOR_INFO}" data-width="80%" data-height="75%"> <i class="mdi mdi-24px mdi-file-edit-outline"></i></a><a href="javascript:void(0)" id="deactivate-object-modal" class="action-icon" data-url="${data}disable/"> <i class="mdi mdi-24px mdi-shield-off-outline"></i></a>`
                    } else {
                        return `<a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="update/${source['id']}/" data-title="${messages.EDIT_SUPERVISOR_INFO}" data-width="80%" data-height="75%"> <i class="mdi mdi-24px mdi-file-edit-outline"></i></a><a href="javascript:void(0)" id="activate-object-modal" class="action-icon" data-url="${data}active/"> <i class="mdi mdi-24px mdi-shield-check-outline"></i></a>`
                    }
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

    var actionCreteObject = function () {
        $("#create-iframe-modal").click(function () {
            Iframe.create($(this), validate_data);
        });
    }

    var actionUpdateObject = function () {
        $("#update-iframe-modal").click(function () {
            validate_data.rules['password'].required = false;
            validate_data.rules['confirm'].required = false;
            Iframe.update($(this), validate_data);
        });
    }

    var actionActivateObject = function () {
        $(document).on("click", '#activate-object-modal', function (e) {
            e.preventDefault();
            var _this = $(this);
            Sweetalert.callApi(_this.data('url'), 'POST', function () {
                renderReloadTable();
            })
        });
    }

    var actionDisabledObject = function () {
        $(document).on("click", '#deactivate-object-modal', function (e) {
            e.preventDefault();
            var _this = $(this);
            Sweetalert.callApi(_this.data('url'), 'POST', function () {
                renderReloadTable();
            })
        });
    }

    return {
        //main function to initiate template pages
        init: function () {
            renderViewWebServices();
            renderEventListener();
            actionFilterObject();
            actionCreteObject();
            actionUpdateObject();
            actionActivateObject();
            actionDisabledObject();
        },
    };

}();

jQuery(document).ready(function () {
    WebServices.init();
});