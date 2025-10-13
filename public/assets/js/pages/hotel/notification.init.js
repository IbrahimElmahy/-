var WebServices = function () {
    "use strict";

    const dataTableElement = $('#datatable');
    const dataTableFilter = $('#filter');

    const messages = {
        READ: gettext("Read"),
        UNREAD: gettext("Unread"),
    };

    const validate_data = {
        rules: {
            'verb_en': {
                required: true,
            },
            'verb_ar': {
                required: true,
            },
        }
    }

    var renderInitUsers = function () {
        var users = $("#users");

        var data = function (params) {
            return {
                'role': $("#role").val(),
                'search[value]': params.term,
                'length': 10,
            };
        }

        var processResults = function (response) {
            return {
                results: $.map(response.data, function (item) {
                    return {
                        text: `${item.name} - ${item.phone_number}`,
                        id: item.id
                    }
                })
            };
        }

        if (!users.length)
            return

        return Select.ajax(users, data, processResults);
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
                class: "table-user dt-center",
                data: 'actor',
                render: function (data, type) {
                    if (type === "display") {
                        return `<img src="${data['image_url']}" alt="table-user" class="mr-2 rounded-circle"><a href="javascript:void(0)" class="text-body font-weight-semibold">` + data['name'] + '</a>'
                    }
                },
            },
            {
                data: 'verb',
            },
            {
                data: 'unread',
                render: function (data, type) {
                    if (type === "display" && data === false)
                        return `<span class="badge bg-soft-success text-success">${messages.READ}</span>`
                    else
                        return `<span class="badge bg-soft-success text-success">${messages.UNREAD}</span>`
                },
            },
            {
                data: 'timestamp',
                render: function (data, type) {
                    if (type === "display")
                        return Table.renderDate(data);
                },
            },
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


    return {
        //main function to initiate template pages
        init: function () {
            renderInitUsers();
            renderViewWebServices();
            renderEventListener();
            actionFilterObject();
            actionCreteObject();
        },
    };

}();

jQuery(document).ready(function () {
    WebServices.init();
});