var WebServices = function () {
    "use strict";

    const dataTableElement = $('#datatable');
    const dataTableFilter = $('#filter');
    const dataTableForm = dataTableFilter.closest('form');

    const messages = {
        ACCOUNT_NAME: gettext('Account Name'),
        ACCOUNT_TYPE: gettext('Account Type'),
        ACCOUNT_NATURE: gettext('Account Nature'),
        REPORT: gettext('Account Report'),
        CREATED_AT: gettext('Created at'),
        UPDATED_AT: gettext('Updated at'),
        ACTION: gettext('Action'),
        EDIT_ACCOUNT_INFO: gettext("Edit account info"),
        ADD_ACCOUNT_INFO: gettext("Add a new account"),
    };

    const validate_data = {
        rules: {
            'name_en': {
                required: true,
            },
            'name_ar': {
                required: true,
            },
            'type': {
                required: true,
            },
            'nature': {
                required: true,
            },
            'report': {
                required: true,
            }

        }
    }

    var renderInitAccountParent = function () {
        var parent = $('#parent');

        var data = function (params) {
            return {
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

        if (!parent.length)
            return

        return Select.ajax(parent, data, processResults);
    }

    var renderViewWebServices = function () {
        var data = {
            url: dataTableForm.data('url'),
            method: "GET",
            idField: "id",
            treeField: "name",
            columns: [[
                {
                    title: messages.ACCOUNT_NAME,
                    field: 'name',
                    width: '30%'
                },
                {
                    title: messages.ACCOUNT_TYPE,
                    field: 'type_display',
                    width: '20%',
                    formatter: function (value) {
                        return value ? '<span class="badge badge-pill badge-danger">' + value + '</span>' : '';
                    }
                },
                {
                    title: messages.ACCOUNT_NATURE,
                    field: 'nature_display',
                    width: '20%',
                    formatter: function (value, row) {
                        if (row['nature'] === 'debit')
                            return value ? '<span class="badge badge-pill badge-danger">' + value + '</span>' : '';
                        else
                            return value ? '<span class="badge badge-pill badge-success">' + value + '</span>' : '';
                    }
                },
                {
                    title: messages.REPORT,
                    field: 'report_display',
                    width: '20%',
                    formatter: function (value) {
                        return value ? '<span class="badge badge-pill badge-info">' + value + '</span>' : '';
                    }
                },
                {
                    title: messages.CREATED_AT,
                    field: 'created_at',
                    width: '20%',
                    formatter: function (value) {
                        return Table.renderDate(value);
                    }
                },
                {
                    title: messages.UPDATED_AT,
                    field: 'updated_at',
                    width: '20%',
                    formatter: function (value) {
                        return Table.renderDate(value);
                    }
                },
                {
                    title: messages.ACTION,
                    field: 'absolute_url',
                    width: '20%',
                    formatter: function (value, row) {
                        return `<a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="create/?parent=${row['id']}&name=${row['name']}" data-title="${messages.ADD_ACCOUNT_INFO}" data-width="80%" data-height="72%"> <i class="mdi mdi-24px mdi-file-plus-outline"></i></a><a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="update/${row['id']}/" data-title="${messages.EDIT_ACCOUNT_INFO}" data-width="80%" data-height="72%"> <i class="mdi mdi-24px mdi-file-edit-outline"></i></a><a href="javascript:void(0);" id="delete-object-modal" class="action-icon" data-url="${value}"> <i class="mdi mdi-24px mdi-delete"></i> </a>`
                    }
                },
            ]],
            lines: true
        }

        if (!dataTableElement.treegrid) {
            return 0;
        }

        return dataTableElement.treegrid(data);
    };

    var renderReloadTable = function () {
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
            var data = {}
            $.each(dataTableForm.serializeArray(), (index, item) => {
                item.value ? data[item.name] = item.value : data
            });
            dataTableElement.treegrid('load', data);
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
            renderInitAccountParent();
            renderViewWebServices();
            renderEventListener();
            actionFilterObject();
            actionCreteObject();
            actionUpdateObject();
            actionDeleteObject();
        },
    };
}();
jQuery(document).ready(function () {
    WebServices.init();
});