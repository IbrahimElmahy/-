var WebServices = function () {
    "use strict";

    const dataTableFilter = $('#filter');
    const dataTableElement = $('#datatable');

    // jQuery handle for the modal table
    const $selectable = $('#selectable');
    // DataTable instance for the modal, once initialized
    let selectTableInstance = null;

    const $guest = $(window.parent.document).find("#guest");
    const $discountType = $(window.parent.document).find("#discount_type");
    const $discountValue = $(window.parent.document).find("#discount_value");

    const messages = {
        ACTIVATED: gettext("Activated"),
        DISABLED: gettext("Disabled"),
        EDIT_GUEST_INFO: gettext("Edit guest data"),
    };

    const validate_data = {
        rules: {
            'name': {
                required: true,
            },
            'country': {
                required: true,
            },
            'guest_type': {
                required: true,
            },
            'id_number': {
                required: true,
            },
            // 'issue_date': {
            //     required: true,
            // },
            // 'issue_place': {
            //     required: false,
            // },
            'ids': {
                required: true,
            },
            // 'id_serial': {
            //     required: true,
            // },
            // 'expiry_date': {
            //     required: true,
            // },
        }
    }

    var renderGuestType = function () {
        var guest_type = $("#guest_type");

        var data = function (params) {
            return {
                'name__contains': params.term,
                'category': 'customer',
                'length': 10,
            };
        }

        var processResults = function (response) {
            return {
                results: $.map(response.data, function (item) {
                    return {
                        text: `${item.name}`,
                        id: item.id
                    }
                })
            };
        }

        if (!guest_type.length)
            return

        Select.ajax(guest_type, data, processResults);

        guest_type.on("select2:close", function () {
            renderIDs()
        });
    }

    var renderIDs = function () {
        var ids = $("#ids");

        var data = function (params) {
            return {
                'guests_types': $('#guest_type').val(),
                'name__contains': params.term,
                'length': 10,
            };
        }

        var processResults = function (response) {
            return {
                results: $.map(response.data, function (item) {
                    return {
                        text: `${item.name}`,
                        id: item.id
                    }
                })
            };
        }

        if (!ids.length)
            return

        ids.val(null).trigger('change');
        Select.ajax(ids, data, processResults);
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
                data: 'name',

            },
            {
                data: 'phone_number',

            },
            {
                data: 'country_display',

            },
            {
                data: 'guest_type',

            },
            {
                data: 'ids',

            },
            {
                data: 'id_number',

            },
            {
                data: 'issue_date',

            },
            {
                data: 'expiry_date',

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
                        return `<a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="update/${source['id']}/" data-title="${messages.EDIT_GUEST_INFO}" data-width="95%" data-height="75%"> <i class="mdi mdi-24px mdi-file-edit-outline"></i></a><a href="javascript:void(0)" id="deactivate-object-modal" class="action-icon" data-url="${data}disable/"> <i class="mdi mdi-24px mdi-shield-off-outline"></i></a><a href="javascript:void(0);" id="delete-object-modal" class="action-icon" data-url="${data}"> <i class="mdi mdi-24px mdi-delete"></i> </a>`
                    } else {
                        return `<a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="update/${source['id']}/" data-title="${messages.EDIT_GUEST_INFO}" data-width="95%" data-height="75%"> <i class="mdi mdi-24px mdi-file-edit-outline"></i></a><a href="javascript:void(0)" id="activate-object-modal" class="action-icon" data-url="${data}active/"> <i class="mdi mdi-24px mdi-shield-check-outline"></i></a><a href="javascript:void(0);" id="delete-object-modal" class="action-icon" data-url="${data}"> <i class="mdi mdi-24px mdi-delete"></i> </a>`
                    }
                },
            }
        ]);
    };

    var renderSelectViewWebServices = function () {
        if (!$selectable.length) return;
        selectTableInstance = Table.renderServerTableView($selectable, dataTableFilter, [
            {
                data: null,
                render: function (data, type, full, meta) {
                    return meta.row + 1;
                },
            },
            {
                data: 'name',

            },
            {
                data: 'phone_number',

            },
            {
                data: 'country_display',

            },
            {
                data: 'guest_type',

            },
            {
                data: 'ids',

            },
            {
                data: 'id_number',

            },
            {
                data: 'issue_date',

            },
            {
                data: 'expiry_date',

            },
            {
                data: 'absolute_url',
                render: function () {
                    return `<a href="javascript:void(0)" class="action-icon"> <i class="mdi mdi-24px mdi-gesture-tap-hold"></i></a>`

                },
            }
        ]);
    };

    var renderReloadTable = function () {
        // if we're in the modal (selector present and already initialized)…
        if ($selectable.length && selectTableInstance) {
            selectTableInstance.destroy();
            renderSelectViewWebServices();
        }
        // otherwise reload the full-page table
        else {
            dataTableElement.DataTable().destroy();
            renderViewWebServices();
        }
    };

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

    var handleGuestSelect = function (data) {
        if (!data && !$guest)
            return 0;

        $guest.empty().append(`<option value="${data.id}">${data.name}</option>`);
        $discountType.val(data['discount_type'])
        $discountValue.val(data['discount_value'])
        window.parent.postMessage({}, "*");
    }

    var actionSelectObject = function () {
        $selectable.on('click', 'tbody tr', function () {
             const data = selectTableInstance.row(this).data();
             handleGuestSelect(data);
         });
    }

    var actionCreteObject = function () {
        $("#create-iframe-modal").click(function () {
            Iframe.create($(this), validate_data, null, function (data) {
                handleGuestSelect(data)
            });
        });
    }

    var actionUpdateObject = function () {
        $("#update-iframe-modal").click(function () {
            Iframe.update($(this), validate_data, null, function (data) {
                handleGuestSelect(data)
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
            renderGuestType();
            renderViewWebServices();
            renderSelectViewWebServices();
            renderEventListener();
            actionFilterObject();
            actionSelectObject();
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