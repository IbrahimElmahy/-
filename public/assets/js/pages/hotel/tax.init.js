var WebServices = function () {
    "use strict";

    const dataTableElement = $('#datatable');
    const dataTableFilter = $('#filter');

    var $name = $('#name');
    var $vatIncluded = $('#is_vat_included');
    var $vatIncludedSwitchery = null;

    const messages = {
        ACTIVATED: gettext("Activated"),
        DISABLED: gettext("Disabled"),
        EDIT_TAX_INFO: gettext("Edit tax info"),
    };

    const validate_data = {
        rules: {
            'name': {
                required: true,
            },
            'tax_type': {
                required: true,
            },
            'tax_value': {
                required: true,
            },
            'applies_to': {
                required: true,
            },
            'start_date': {
                required: true,
            },
            'end_date': {
                required: true,
            },
        }
    }

    var handleVatIncludedSwitchery = function () {
        if ($name.val() === 'vat') {

            if (!$vatIncluded[0].checked) {
                $vatIncluded.click();
            }

            $vatIncludedSwitchery.disable();
        } else {
            $vatIncludedSwitchery.enable();
        }
    }

    var renderInitVatIncluded = function () {
        if (!$vatIncluded.length) {
            return !0;
        }

        var defaults = {
            color: $vatIncluded.data('color')
        };

        $vatIncludedSwitchery = new Switchery($vatIncluded[0], defaults);
        handleVatIncludedSwitchery()
    }

    var renderInitName = function () {
        $name.on("change", function () {
            handleVatIncludedSwitchery()
        });
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
                data: 'name_display',

            },
            {
                data: 'tax_display',
                render: function (data, type) {
                    if (type === "display") {
                        return '<span class="badge badge-pill badge-info">' + data + '</span>';
                    }
                }
            },
            {
                data: 'applies_to',
                render: function (data, type, source) {
                    if (type === "display") {
                        if (data === 'reservation')
                            return `<span class="badge badge-pill badge-danger">${source['applies_to_display']}</span>`;
                        else
                            return `<span class="badge badge-pill badge-success">${source['applies_to_display']}</span>`;

                    }
                }
            },
            {
                data: 'start_date',
                render: function (data) {
                    return data ? Table.renderDate(data) : '-'
                },
            },
            {
                data: 'end_date',
                render: function (data) {
                    return data ? Table.renderDate(data) : '-'
                },
            },
            {
                data: 'is_added_to_price',
                render: function (data) {
                    return `<div class="checkbox checkbox-primary checkbox-single"> <input type="checkbox" id="sat" value="sat" ${data ? "checked" : ""} disabled=""><label></label></div>`
                },

            },
            {
                data: 'is_vat_included',
                render: function (data) {
                    return `<div class="checkbox checkbox-primary checkbox-single"> <input type="checkbox" id="sun" value="sun" ${data ? "checked" : ""} disabled=""><label></label></div>`
                },

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
                        return `<a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="update/${source['id']}/" data-title="${messages.EDIT_TAX_INFO}" data-width="100%" data-height="100%"> <i class="mdi mdi-24px mdi-file-edit-outline"></i></a><a href="javascript:void(0)" id="deactivate-object-modal" class="action-icon" data-url="${data}disable/"> <i class="mdi mdi-24px mdi-shield-off-outline"></i></a><a href="javascript:void(0);" id="delete-object-modal" class="action-icon" data-url="${data}"> <i class="mdi mdi-24px mdi-delete"></i> </a>`
                    } else {
                        return `<a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="update/${source['id']}/" data-title="${messages.EDIT_TAX_INFO}" data-width="100%" data-height="100%"> <i class="mdi mdi-24px mdi-file-edit-outline"></i></a><a href="javascript:void(0)" id="activate-object-modal" class="action-icon" data-url="${data}active/"> <i class="mdi mdi-24px mdi-shield-check-outline"></i></a><a href="javascript:void(0);" id="delete-object-modal" class="action-icon" data-url="${data}"> <i class="mdi mdi-24px mdi-delete"></i> </a>`
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
            renderInitVatIncluded();
            renderInitName();
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