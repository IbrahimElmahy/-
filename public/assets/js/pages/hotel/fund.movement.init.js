var WebServices = function () {
    "use strict";

    const dataTableElement = $('#datatable');
    const dataTablePrintElement = $('#table-print');
    const dataTableFilter = $('#filter');


    const $currentDate = new Date(DateTime.currentTimeToString());
    const $lang = DateTime.getLanguageCode();
    const $accountType = $('#account_type');
    const $account = $("#account");
    const $currency = $("#currency");
    const $paymentMethod = $('#payment_method');
    const $paymentType = $('#payment_type');
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
            'payment_method': {
                required: false,
            },
           
        }
    }

    var renderInitAccountType = function () {
        $accountType.on("change", function () {
            renderInitAccount()
        });
    }

    var renderInitAccount = function () {
        var defaultSelected;

        var data = function (params) {
            return {
                'search': params.term,
                'category': $accountType.val(),
                'is_active': true,
                'length': 10,
            };
        }

        var processResults = function (response) {
            defaultSelected = response.data[0].account;
            return {
                results: $.map(response.data, function (item) {
                    return {
                        text: `${item.name}`,
                        id: item.account,
                    }
                })
            };
        }

        if (!$account.length)
            return

        var base = $accountType.val();
        var name = base === 'bank' ? 'banks' : base;
        $account.data('url', `/${$lang}/${base}/api/${name}/`);
        return Select.ajax($account, data, processResults);
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
    var selectedPaymentMethod = {}; // Object to hold the selected payment method details

    var renderInitPaymentMethod = function () {
        var $this = $paymentMethod;
        var $url = $this.data('url');
        var $placeholder = $this.data('placeholder');
        var $value = $this.data('value');
        var $options = []

  

        Ajax.get($url, {}, false, function (response) {
            $.each(response.data, function (key, item) {
                $options.push({
                    id: item['id'],
                    text: item['name'],
                    payment_type: item['payment_type'],
                    requiresTransactionNumber: item['requires_transaction_number'],
                })
            })
        })

        $this.select2({allowClear: true, placeholder: $placeholder, data: $options,});
        $this.val($value).trigger('change');

        $this.on("select2:select, change", function (e) {
        
            renderInitPaymentType();
        });
    }


    var renderInitPaymentType = function () {
        var $this = $paymentType;
        var $placeholder = $this.data('placeholder');
        var $value = $this.data('value');
        var formGroup = $this.closest('.form-group')
        var $options = []

        if (!$paymentMethod.val()) {
            formGroup.parent().removeClass('d-none').addClass('d-none');
            return 0;
        }

        var $paymentMethodData = $paymentMethod.select2('data')[0];

        if ($paymentMethodData && $paymentMethodData.hasOwnProperty('payment_type')) {
            $.each($paymentMethodData.payment_type, function (key, item) {
                $options.push({id: item['id'], text: item['name']})
            })
        }

        $this.select2({allowClear: true, placeholder: $placeholder, data: $options});
        $this.val($value).trigger('change');

        if ($options.length) {
            formGroup.parent().removeClass('d-none');
        } else {
            formGroup.parent().removeClass('d-none').addClass('d-none');
        }
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
        // console.log(`selectedPaymentMethod : : ${selectedPaymentMethod.text}`)

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
                data: 'balance',

            },
            {
                data: 'payment_method'
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
        // retrieveSelectedPaymentMethod();
      


        var $document = $(parent.document)
        var $form = $document.find('form');
        var $url = $form.data('url') + '?is_export=true&' + $form.serialize();
        console.log(`dd${$url}`)
        var table = Table.renderLocalTableView(dataTablePrintElement);

        $form.validate(validate_data);
        if (!$form.valid()) {
            return 0;
        }

        Ajax.get($url, {}, false, function (response) {
            renderInfoRowValue(response, $document);
            $.each(response['legs'], function (key, item) {
                table.row.add([
                    key + 1, 
                    item['date'],
                    item['type'],
                    item['number'],
                    item['description'],
                    item['debit'],
                    item['credit'],
                    item['balance'],
                    item['payment_method']
                ]).draw(false);
            });
            table.destroy();
        })
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
            renderInitAccountType();
            renderInitAccount();
            renderInitCurrency();
            renderInitPaymentMethod();
            renderInitPaymentType();
            renderInitStartDate();
            renderInitEndDate();
            renderInitAccountant();
            renderLocalTableViewServices();
            actionFilterObject();
            renderReportTableViewServices();
            renderExportTableCSV()
        },
    };
}();

jQuery(document).ready(function () {
    WebServices.init();
});