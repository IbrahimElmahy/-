var WebServices = function () {
    "use strict";

    const dataTableElement = $('#datatable');
    const dataTableFilter = $('#filter');

    const messages = {
        EDIT_PEAK_TIME_INFO: gettext("Edit peak time info"),
    };

    const validate_data = {
        rules: {
            'start_date': {
                required: true,
            },
            'end_date': {
                required: true,
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
                data: 'category',

            },
            {
                data: 'start_date',

            },
            {
                data: 'end_date',

            },
            {
                data: 'sat',
                render: function (data) {
                    return `<div class="checkbox checkbox-primary checkbox-single"> <input type="checkbox" id="sat" value="sat" ${data ? "checked" : ""} disabled=""><label></label></div>`
                },

            },
            {
                data: 'sun',
                render: function (data) {
                    return `<div class="checkbox checkbox-primary checkbox-single"> <input type="checkbox" id="sun" value="sun" ${data ? "checked" : ""} disabled=""><label></label></div>`
                },

            },
            {
                data: 'mon',
                render: function (data) {
                    return `<div class="checkbox checkbox-primary checkbox-single"> <input type="checkbox" id="mon" value="mon" ${data ? "checked" : ""} disabled=""><label></label></div>`
                },

            },
            {
                data: 'tue',
                render: function (data) {
                    return `<div class="checkbox checkbox-primary checkbox-single"> <input type="checkbox" id="tu" value="tu" ${data ? "checked" : ""} disabled=""><label></label></div>`
                },

            },
            {
                data: 'wed',
                render: function (data) {
                    return `<div class="checkbox checkbox-primary checkbox-single"> <input type="checkbox" id="wed" value="wed" ${data ? "checked" : ""} disabled=""><label></label></div>`
                },
            },
            {
                data: 'thu',
                render: function (data) {
                    return `<div class="checkbox checkbox-primary checkbox-single"> <input type="checkbox" id="th" value="th" ${data ? "checked" : ""} disabled=""><label></label></div>`
                },

            },
            {
                data: 'fri',
                render: function (data) {
                    return `<div class="checkbox checkbox-primary checkbox-single"> <input type="checkbox" id="fri" value="fri" ${data ? "checked" : ""} disabled=""><label></label></div>`
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
                    return `<a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="update/${source['id']}/" data-title="${messages.EDIT_PEAK_TIME_INFO}" data-width="100%" data-height="90%"> <i class="mdi mdi-24px mdi-file-edit-outline"></i></a><a href="javascript:void(0);" id="delete-object-modal" class="action-icon" data-url="${data}"> <i class="mdi mdi-24px mdi-delete"></i> </a>`
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