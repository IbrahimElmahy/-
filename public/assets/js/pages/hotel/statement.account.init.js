var WebServices = function () {
    "use strict";

    const dataTableElement = $('#datatable');
    const dataTablePrintElement = $('#table-print');
    const dataTableFilter = $('#filter');


    const $currentDate = new Date(DateTime.currentTimeToString());
    const $lang = DateTime.getLanguageCode();
    const $currency = $("#currency");
    const $credit = $('#credit');
    const $debit = $('#debit');
    const $balance = $('#balance');
    const $balanceDisplay = $('#balance_display');
    const $balance_sum = $('#sum_balance')
    const btnExportCSV = $('#exportCSV');



    const messages = {
        TOTAL_BALANCE: gettext("Total Balance")
    };

    const validate_data = {
        rules: {
            'account': {
                required: true,
            },
            'currency': {
                required: true,
            },
            'start_date': {
                required: true,
            },
            'ebd_date': {
                required: true,
            },
        }
    }

    var renderInitCurrency = function () {
        var data = function (params) {
            return {
                'search': params.term,
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

        if (!$currency.length)
            return

        Select.ajax($currency, data, processResults);
    }

    var renderInitStartDate = function () {
        var $startDate = $('#start_date');
        var defaultDate = $startDate.val() || $currentDate;

        var data = {
            dateFormat: "Y-m-d",
            defaultDate: defaultDate,
            locale: $lang,
        }

        return $startDate.flatpickr(data)
    }

    var renderInitEndDate = function () {
        var $endDate = $('#end_date');
        var defaultDate = $endDate.val() || $currentDate;

        var data = {
            dateFormat: "Y-m-d",
            defaultDate: defaultDate,
            locale: $lang,
        }

        return $endDate.flatpickr(data)
    }

    var renderInitAccountant = function () {
        var $accountant = $('#created_by');

        var data = function (params) {
            return {
                'search': params.term,
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

        if (!$accountant.length)
            return

        Select.ajax($accountant, data, processResults);
    }

    var renderLocalTableViewServices = function () {
        return Table.renderLocalTableView(dataTableElement);
    };

    var renderViewWebServices = function () {
        return Table.renderServerTableView(dataTableElement, dataTableFilter, [
            {
                data: null,
                render: function (data, type, full, meta) {
                    return meta.row + 1;
                },
            },
            {
                data: 'date',
            },
            {
                data: 'type',
            },
            {
                data: 'number',
            },
            {
                data: 'description',
            },
            {
                data: 'debit',

            },
            {
                data: 'credit',

            },
            { 
                data: 'credit_exclusive_tax', defaultContent: "N/A" 
            },  

            {
                data: 'balance',
            }
        ], null, function (response) {
            var data = response.data;
            renderInfoRowValue(data)
            return data['legs'];
        });
    };

    var renderReloadTable = function () {
        dataTableElement.DataTable().destroy();
        renderViewWebServices();
    }

    var actionFilterObject = function () {
        dataTableFilter.click(function (e) {
            e.preventDefault();
            var form = $(this).closest("form");
            form.validate(validate_data);

            if (!form.valid()) {
                return 0;
            }
            renderReloadTable();
        })
    }

    var renderInfoRowValue = function (data, $document = null) {
        var category = data['category'];
        var balanceDisplay = data['balance_display'];

        if (category) {
            balanceDisplay = `${messages.TOTAL_BALANCE} : ${category} : ${balanceDisplay}`;
        }

        $credit.html(data['credit']);
        $debit.html(data['debit']);
        $balance.html(data['balance']);
        $balanceDisplay.html(balanceDisplay);
        $balance_sum.html(data['sum_balance'])


        if (!$document) {
            return !0;
        }

        var $account = $document.find('#account');
        var $currency = $document.find('#currency');
        var $startDate = $document.find('#start_date');
        var $EndDate = $document.find('#end_date');
        var $date;

        $account = $account.find(`option[value="${$account.val()}"]`).text();
        $currency = $currency.find(`option[value="${$currency.val()}"]`).text();
        $date = `${$startDate.val()} - ${$EndDate.val()}`

        $('#account-value').html($account);
        $('#currency-value').html($currency);
        $('#date-value').html($date);
    };

    var renderReportTableViewServices = function () {
        if (!dataTablePrintElement.length) {
            return 0;
        }


        var $document = $(parent.document)
        var $form = $document.find('form');
        var $url = $form.data('url') + '?is_export=true&' + $form.serialize();
        var table = Table.renderLocalTableView(dataTablePrintElement);

        $form.validate(validate_data);
        if (!$form.valid()) {
            return 0;
        }

        Ajax.get($url, {}, false, function (response) {
            renderInfoRowValue(response, $document);
            $.each(response['legs'], function (key, item) {
                table.row.add([key + 1, item['date'], item['type'], item['number'], item['description'], item['debit'], item['credit'], item['balance']]).draw(false);
            });
            table.destroy();
        })
    }

    var renderEventListener = function () {
        window.addEventListener('message', function () {
            $.eModal.close();
        });
    }
    var renderExportTableCSV = function () {
        btnExportCSV.click(function (e) {
            e.preventDefault();
            var $form = $('form');
            var $url = btnExportCSV.data('url') + '?' + $form.serialize();
            window.open($url, "_blank");
        });
    }

    return {
        //main function to initiate template pages
        init: function () {
            renderInitCurrency();
            renderInitStartDate();
            renderInitEndDate();
            renderInitAccountant();
            renderLocalTableViewServices();
            actionFilterObject();
            renderReportTableViewServices();
            renderEventListener();
            renderExportTableCSV();
        },
    };
}();

jQuery(document).ready(function () {
    WebServices.init();
});