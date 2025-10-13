var WebServices = function () {
    "use strict";

    const dataTableElement = $('#datatable');
    const dataTableFilter = $('#filter');

    const $plan = $('#plan');

    const messages = {
        ACTIVATED: gettext("Activated"),
        DISABLED: gettext("Disabled"),
        EDIT_PLAN_INFO: gettext("Edit Subscription info"),
        UNLIMITED: gettext("Unlimited"),
    };

    const validate_data = {
        rules: {
            'hotel': {
                required: true,
            },
            'plan': {
                required: true,
            },
        }
    }

    var renderPlanInit = function () {
        var data = function (params) {
            return {
                'search[value]': params.term,
                'is_active': true,
                'length': 10,
            };
        }

        var processResults = function (response) {
            return {
                results: $.map(response.data, function (item) {
                    return {
                        text: `${item.name}`,
                        id: item.id,
                    }
                })
            };
        }


        if (!$plan.length)
            return

        return Select.ajax($plan, data, processResults);
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
                data: 'plan.name',

            },
            {
                data: 'start_date',
                render: function (data, type) {
                    if (type === "display") {
                        return `<span class="badge badge-pill badge-warning">${data ? Table.renderDate(data) : messages.UNLIMITED}</span>`;
                    }
                },
            },
            {
                data: 'end_date',
                render: function (data, type) {
                    if (type === "display") {
                        return `<span class="badge badge-pill badge-danger">${data ? Table.renderDate(data) : messages.UNLIMITED}</span>`;
                    }
                },
            },
            {
                data: 'plan.users_limit',
                render: function (data, type) {
                    if (type === "display" && data) {
                        return `<span class="badge badge-pill badge-success">${data}</span>`;
                    } else {
                        return `<span class="badge badge-pill badge-danger">${messages.UNLIMITED}</span>`
                    }
                },
            },
            {
                data: 'plan.apartments_limit',
                render: function (data, type) {
                    if (type === "display" && data) {
                        return `<span class="badge badge-pill badge-success">${data}</span>`;
                    } else {
                        return `<span class="badge badge-pill badge-danger">${messages.UNLIMITED}</span>`
                    }
                },
            },
            {
                data: 'plan.sms_limit',
                render: function (data, type) {
                    if (type === "display" && data) {
                        return `<span class="badge badge-pill badge-success">${data}</span>`;
                    } else {
                        return `<span class="badge badge-pill badge-danger">${messages.UNLIMITED}</span>`
                    }

                },
            },
            {
                data: 'is_verified',
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
                        return `<a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="update/${source['id']}/" data-title="${messages.EDIT_PLAN_INFO}" data-width="80%" data-height="59%"> <i class="mdi mdi-24px mdi-file-edit-outline"></i></a><a href="javascript:void(0)" id="deactivate-object-modal" class="action-icon" data-url="${data}disable/"> <i class="mdi mdi-24px mdi-shield-off-outline"></i></a><a href="javascript:void(0);" id="delete-object-modal" class="action-icon" data-url="${data}"> <i class="mdi mdi-24px mdi-delete"></i> </a>`
                    } else {
                        return `<a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="update/${source['id']}/" data-title="${messages.EDIT_PLAN_INFO}" data-width="80%" data-height="59%"> <i class="mdi mdi-24px mdi-file-edit-outline"></i></a><a href="javascript:void(0)" id="activate-object-modal" class="action-icon" data-url="${data}active/"> <i class="mdi mdi-24px mdi-shield-check-outline"></i></a><a href="javascript:void(0);" id="delete-object-modal" class="action-icon" data-url="${data}"> <i class="mdi mdi-24px mdi-delete"></i> </a>`
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
            Iframe.update($(this), validate_data);
        });
    }

    var actionAddSMSObject = function () {
        $("#add-sms").click(function () {
            Form.renderFormPostAction($(this), {rules: {'hotel': {required: true,}, 'sms_limit': {required: true,},}}, function () {
                 window.location.reload();
            });
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
            renderPlanInit();
            renderViewWebServices();
            renderEventListener();
            actionFilterObject();
            actionCreteObject();
            actionUpdateObject();
            actionAddSMSObject();
            actionActivateObject();
            actionDisabledObject();
            actionDeleteObject();
        },
    };

}();

jQuery(document).ready(function () {
    WebServices.init();
});