var WebServices = function () {
    "use strict";

    const dataTableElement = $('#datatable');
    const dataTableFilter = $('#filter');

    const permission = $("#permission");

    const messages = {
        EDIT_USER_INFO: gettext("Edit user info"),
        MANAGER: gettext("Manager"),
        EMPLOYEE: gettext("Employee"),
        ACTIVATED: gettext("Activated"),
        DISABLED: gettext("Disabled"),
    };

    const validate_data = {
        rules: {
            'user.name': {
                required: true,
            },
            'user.username': {
                required: true,
            },
            'user.email': {
                email: true,
                required: true,
            },
            'user.phone_number': {
                required: true,
            },
            'user.password': {
                required: true,
                alphanumeric: true,
                minlength: 4,

            },
            'user.confirm': {
                required: true,
                equalTo: "#password"
            },
        }
    }

    var InitPermissionSelect = function () {
        if (!permission.length) {
            return 0;
        }

        permission.multiSelect();
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
                data: 'user.username',
                render: function (data, type, source) {
                    if (type === "display") {
                        return `<a href="javascript:void(0)" class="text-body font-weight-semibold" data-toggle="iframe-modal" data-url="update/${source['user']['id']}/" data-title="${messages.EDIT_USER_INFO}" data-width="80%" data-height="75%">${data}</a>`
                    }
                },
            },
            {
                class: "table-user",
                data: 'user.name',
                render: function (data, type, source) {
                    if (type === "display") {
                        return `<img src="${source['user']['image_url']}" alt="table-user" class="mr-2 rounded-circle"><a href="javascript:void(0)" class="text-body font-weight-semibold" data-toggle="iframe-modal" data-url="update/${source['user']['id']}/" data-title="${messages.EDIT_USER_INFO}" data-width="80%" data-height="75%">${data}</a>`
                    }
                },
            },
            {
                data: 'user.phone_number',
                render: function (data, type) {
                    if (type === "display") {
                        return '<div style="direction: ltr">' + data + '</div>'
                    }
                },
            },
            {
                data: 'user.email',
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
                data: 'user.login_allowed',
                render: function (data, type) {
                    if (type === "display" && data) {
                        return `<span class="badge badge-pill badge-success">${messages.ACTIVATED}</span>`;
                    } else
                        return `<span class="badge badge-pill badge-danger">${messages.DISABLED}</span>`
                },
            },

            {
                data: 'user.profile.gender_display',
            },
            {
                data: 'user.last_login',
                render: function (data) {
                    return data ? Table.renderDate(data) : '-'
                },
            },
            {
                data: 'user.created_at',
                render: function (data) {
                    return data ? Table.renderDate(data) : '-'
                },
            },
            {
                data: 'user.updated_at',
                render: function (data) {
                    return data ? Table.renderDate(data) : '-'
                },
            },
            {
                data: 'absolute_url',
                render: function (data, type, source) {
                    if (source['user']['login_allowed'] === true) {
                        return `<a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="update/${source['user']['id']}/" data-title="${messages.EDIT_USER_INFO}" data-width="80%" data-height="75%"> <i class="mdi mdi-24px mdi-file-edit-outline"></i></a><a href="javascript:void(0)" id="deactivate-object-modal" class="action-icon" data-url="${data}disable/"> <i class="mdi mdi-24px mdi-shield-off-outline"></i></a>`
                    } else {
                        return `<a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="update/${source['user']['id']}/" data-title="${messages.EDIT_USER_INFO}" data-width="80%" data-height="75%"> <i class="mdi mdi-24px mdi-file-edit-outline"></i></a><a href="javascript:void(0)" id="activate-object-modal" class="action-icon" data-url="${data}active/"> <i class="mdi mdi-24px mdi-shield-check-outline"></i></a>`
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
            validate_data.rules['user.password'].required = false;
            validate_data.rules['user.confirm'].required = false;
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
            InitPermissionSelect();
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