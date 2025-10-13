var WebServices = function () {
    "use strict";

    const dataTableElement = $('#datatable');
    const dataTableFilter = $('#filter');
    const messages = {
        EDIT_APARTMENT: gettext("Edit apartment data"),
        BALANCE: gettext('Balance'),
        EDIT_RESERVATION_INFO: gettext('Edit reservation info'),
        ADD_RESERVATION_INFO: gettext('Create reservation info'),
        CREATE_APARTMENT_SUCCESS_MESSAGE : gettext("Apartment added successfully! You can add another one"),
        CREATE_APARTMENT_FAILED_MESSAGE : gettext("Failed to save apartment. Please check your input and try again"),
        LOADING : gettext("Please wait while we are saving the apartment"),
        SUCCESS_STATUS : gettext("Success"),
        FAILED_STATUS : gettext("Error")

    };

    var renderViewWebServices = function () {
        Table.renderServerTableView(dataTableElement, dataTableFilter, [
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
                data: 'data.apartment_type',
            },
            {
                data: 'data.cleanliness',
                render: function (data, type, source) {
                    if (type === "display") {
                        return `<span class="badge badge-pill badge-${Colors.getApartmentCleanlinessColor(data)}">${source['data']['cleanliness_display']}</span>`;
                    }
                }
            },
            {
                data: 'data.availability',
                render: function (data, type, source) {
                    if (type === "display") {
                        return `<span class="badge badge-pill badge-${Colors.getApartmentAvailabilityColor(data)}">${source['data']['availability_display']}</span>`;
                    }
                }
            },
            {
                data: 'data.floor',
            },
            {
                data: 'data.rooms',
            },
            {
                data: 'data.beds',
            },
            {
                data: 'data.double_beds',
            },
            {
                data: 'data.bathrooms',
            },
            {
                data: 'data.wardrobes',
            },
            {
                data: 'data.tvs',
            },
            {
                data: 'data.cooling_type_display',
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
    WebServices.init();
});
