var WebServices = function () {
    "use strict";

    const dataTableElement = $('#datatable');
    const dataTableFilter = $('#filter');

    const messages = {
        ACTIVATED: gettext("Activated"),
        DISABLED: gettext("Disabled"),
        EDIT_SERVICE_INFO: gettext("Edit service info"),
    };

    const validate_data = {
        rules: {
            'name_en': {
                required: true,
            },
            'name_ar': {
                required: true,
            },
            'price': {
                required: true,
                number: true,
            }
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
                data: 'name_en',

            },
            {
                data: 'name_ar',

            },
            {
                data: 'price',
                render: function (data, type) {
                    if (type === "display") {
                        return '<span class="badge badge-pill badge-info">' + data + '</span>';
                    }
                }
            },
            {
                data: 'category',
            },
            {
                data: 'is_active',
                render: function (data, type) {
                    if (type === "display" && data) {
                        return `<span class="badge badge-pill badge-success">${messages.ACTIVATED}</span>`;
                    } else
                        return `<span class="badge badge-pill badge-danger">${messages.DISABLED}</span>`
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
                    if (source['is_active'] === true) {
                        return `<a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="update/${source['id']}/" data-title="${messages.EDIT_SERVICE_INFO}" data-width="100%" data-height="100%"> <i class="mdi mdi-24px mdi-file-edit-outline"></i></a><a href="javascript:void(0)" id="deactivate-object-modal" class="action-icon" data-url="${data}disable/"> <i class="mdi mdi-24px mdi-shield-off-outline"></i></a><a href="javascript:void(0);" id="delete-object-modal" class="action-icon" data-url="${data}"> <i class="mdi mdi-24px mdi-delete"></i> </a>`
                    } else {
                        return `<a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="update/${source['id']}/" data-title="${messages.EDIT_SERVICE_INFO}" data-width="100%" data-height="100%"> <i class="mdi mdi-24px mdi-file-edit-outline"></i></a><a href="javascript:void(0)" id="activate-object-modal" class="action-icon" data-url="${data}active/"> <i class="mdi mdi-24px mdi-shield-check-outline"></i></a><a href="javascript:void(0);" id="delete-object-modal" class="action-icon" data-url="${data}"> <i class="mdi mdi-24px mdi-delete"></i> </a>`
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
            Iframe.patch($(this), validate_data);
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
            renderEventListener();
            actionFilterObject();
            actionCreteObject();
            actionUpdateObject();
            actionActivateObject();
            actionDisabledObject();
            actionDeleteObject();
        },
    };

}();

jQuery(document).ready(function () {
    WebServices.init();
});