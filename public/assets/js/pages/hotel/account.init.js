var WebServices = function () {
    "use strict";

    const selectableElement = $('#selectable');
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
                    width: '80%'
                },
                {
                    title: messages.ACTION,
                    field: 'absolute_url',
                    width: '20%',
                    formatter: function (value, row) {
                        return `<a href="javascript:void(0)" id="select-object-modal" class="action-icon" data-id="${row['id']}" data-name="${row['name']}"> <i class="mdi mdi-24px mdi-gesture-tap-hold"></i></a>`;
                    }
                },
            ]],
            lines: true
        }

        if (!selectableElement.treegrid) {
            return 0;
        }

        return selectableElement.treegrid(data);
    };

    var actionFilterObject = function () {
        dataTableFilter.click(function (e) {
            e.preventDefault();
            var data = {}
            $.each(dataTableForm.serializeArray(), (index, item) => {
                item.value ? data[item.name] = item.value : data
            });
            handleAccountSelect.treegrid('load', data);
        })
    }

    var renderReloadTable = function () {
        renderViewWebServices();
    }

    var renderEventListener = function () {
        window.addEventListener('message', function () {
            $.eModal.close();
            renderReloadTable();
        });
    }

    var handleAccountSelect = function (data) {
        const $account = $(window.parent.document).find("#account");

        if (!data && !$account)
            return 0;

        $account.empty().append(`<option value="${data.id}">${data.name}</option>`);
        window.parent.postMessage({}, "*");
    }

    var actionSelectObject = function () {
        $(document).on("click", '#select-object-modal', function (e) {
            e.preventDefault();
            var _this = $(this);
            var data = {'id': _this.data('id'), 'name':  _this.data('name')}
            handleAccountSelect(data)
        });
    }

    return {
        //main function to initiate template pages
        init: function () {
            renderViewWebServices();
            renderEventListener();
            actionFilterObject();
            actionSelectObject();
        },
    };
}();
jQuery(document).ready(function () {
    WebServices.init();
});