var WebServices = function () {
    "use strict";

    const dataTableElement = $('#datatable');
    const dataTableFilter = $('#filter');

    const messages = {
        ACTIVATED: gettext("Activated"),
        DISABLED: gettext("Disabled"),
        EDIT_HOTEL_INFO: gettext("Edit hotel info"),
        USER_MANAGEMENT: gettext("User management"),
    };

    const validate_data = {
        rules: {
            'name_en': {
                required: true,
            },
            'name_ar': {
                required: true,
            },
            'vatn': {
                required: true,
            },
            'crn': {
                required: true,
            },
            'phone_number': {
                required: true,
            },
            'user.name': {
                required: true,
            },
            'user.username': {
                required: true,
            },
            'user.email': {
                required: true,
                email: true,
            },
            'user.phone_number': {
                required: true,
            },
            'user.password': {
                required: true,
            },
            'user.confirm': {
                required: true,
                equalTo: "#password"
            },
        }
    }

    var renderInitCountry = function () {
        $('#country').on("select2:close", function () {
            renderInitCity($(this).val())
            renderInitNeighborhood($(this).val())
            renderInitStreet($(this).val())
        });
    }

    var renderInitCity = function () {
        var city = $('#city');

        var data = function (params) {
            return {
                'country': $('#country').val(),
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

        if (!city.length)
            return

        Select.ajax(city, data, processResults);

        city.on("select2:close", function () {
            renderInitNeighborhood()
            renderInitStreet()
        });
    }

    var renderInitNeighborhood = function () {
        var neighborhood = $('#neighborhood');

        var data = function (params) {
            return {
                'city': $('#city').val(),
                'city__country': $('#country').val(),
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

        if (!neighborhood.length)
            return

        Select.ajax(neighborhood, data, processResults);

        neighborhood.on("select2:close", function () {
            renderInitStreet()
        });
    }

    var renderInitStreet = function () {
        var street = $('#street');

        var data = function (params) {
            return {
                'neighborhood__city__country': $('#country').val(),
                'neighborhood__city': $('#city').val(),
                'neighborhood': $('#neighborhood').val(),
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

        if (!street.length)
            return

        return Select.ajax(street, data, processResults);
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
                data: 'vatn',

            },
             {
                data: 'crn',

            },
            {
                data: 'email',

            },
            {
                data: 'phone_number',

            },

            {
                data: 'country',
            },
            {
                data: 'city',
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
                        return `<a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="update/${source['id']}/" data-title="${messages.EDIT_HOTEL_INFO}" data-width="80%" data-height="75%"> <i class="mdi mdi-24px mdi-file-edit-outline"></i></a><a href="${source['id']}/users/" class="action-icon"> <i class="mdi mdi-24px mdi-file-account-outline"></i> </a><a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="update/${source['id']}/" data-title="${messages.EDIT_HOTEL_INFO}" data-width="80%" data-height="75%"> <i class="mdi mdi-24px mdi-file-edit-outline"></i></a><a href="${source['id']}/subscriptions/" class="action-icon"> <i class="mdi mdi-24px mdi-barcode-scan"></i> </a><a href="javascript:void(0)" id="deactivate-object-modal" class="action-icon" data-url="${data}disable/"> <i class="mdi mdi-24px mdi-shield-off-outline"></i></a>`
                    } else {
                        return `<a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="update/${source['id']}/" data-title="${messages.EDIT_HOTEL_INFO}" data-width="80%" data-height="75%"> <i class="mdi mdi-24px mdi-file-edit-outline"></i></a><a href="${source['id']}/users/" class="action-icon"> <i class="mdi mdi-24px mdi-file-account-outline"></i> </a><a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="update/${source['id']}/" data-title="${messages.EDIT_HOTEL_INFO}" data-width="80%" data-height="75%"> <i class="mdi mdi-24px mdi-file-edit-outline"></i></a><a href="${source['id']}/subscriptions/" class="action-icon"> <i class="mdi mdi-24px mdi-barcode-scan"></i> </a><a href="javascript:void(0)" id="activate-object-modal" class="action-icon" data-url="${data}active/"> <i class="mdi mdi-24px mdi-shield-check-outline"></i></a>`
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
            renderInitCountry();
            renderInitCity();
            renderInitNeighborhood();
            renderInitStreet();
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