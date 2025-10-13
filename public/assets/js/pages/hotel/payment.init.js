var WebServices = function () {
    "use strict";

    const dataTableElement = $('#datatable');
    const dataTableFilter = $('#filter');

    const $currentDate = new Date(DateTime.currentTimeToString());
    const $lang = DateTime.getLanguageCode();
    const $creditAccount = $("#credit_account");
    const $paidFrom = $('#paid_from');
    const $debitAccount = $("#debit_account");
    const $paidTo = $('#paid_to');
    const $paymentMethod = $('#payment_method');
    const $paymentType = $('#payment_type');
    const $operationNumber = $('#operation_number');


    const messages = {
        EDIT_PAYMENT_VOUCHER_INFO: gettext("Edit payment voucher info"),
        PRINT_PAYMENT_VOUCHER: gettext("Print payment voucher"),
        EDIT_CASH_INFO: gettext("Edit cash info"),
        EDIT_GUEST_INFO: gettext("Edit guest data"),
        EDIT_CURRENCY_INFO: gettext("Edit currency info"),
    };

    const validate_data = {
        rules: {
            'date': {
                required: true,
            },
            'time': {
                required: true,
            },
            'currency': {
                required: true,
            },
            'amount': {
                required: true,
            },
            'payment_method': {
                required: true,
            },
            'credit_legs[0]account': {
                required: true,
            },
            'debit_legs[0]account': {
                required: true,
            },
            'description': {
                required: true,
            },
        }
    }

    var renderInitDate = function () {
        var $date = $('#date');
        var defaultDate = $date.val() || $currentDate;

        var data = {
            dateFormat: "Y-m-d",
            defaultDate: defaultDate,
            locale: $lang,
        }

        return $date.flatpickr(data)
    }

    var renderInitTime = function () {
        var $time = $('#time');
        var defaultDate = $time.val() || $currentDate.getTime();

        var data = {
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
            defaultDate: defaultDate,
            locale: $lang,

        }

        return $time.flatpickr(data)
    }

    var renderInitPaidFrom = function () {
        $paidFrom.on("change", function () {
            renderInitCreditAccount()
        });
    }

    var renderInitCreditAccount = function () {
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
                        id: item.account,
                    }
                })
            };
        }

        if (!$creditAccount.length)
            return

        var base = $paidFrom.val();
        var name = base === 'bank' ? 'banks' : base;

        $creditAccount.data('url', `/${$lang}/${base}/api/${name}/`);
        Select.ajax($creditAccount, data, processResults);
    }

    var renderInitPaidTo = function () {
        $paidTo.on("change", function () {
            renderInitDebitAccount()
        });

    }

    var renderInitDebitAccount = function () {
        var data = function (params) {
            return {
                'search': params.term,
                'category': $paidTo.val(),
                'is_active': true,
                'length': 10,
            };
        }

        var processResults = function (response) {
            return {
                results: $.map(response.data, function (item) {
                    return {
                        text: `${item.name}`,
                        id: item.account,
                    }
                })
            };
        }

        if (!$debitAccount.length)
            return

        var base = $paidTo.val() === 'expense' ? 'expense' : 'guest';
        var name = `${base}s`;

        $debitAccount.data('url', `/${$lang}/${base}/api/${name}/`);
        Select.ajax($debitAccount, data, processResults);
    }

    var renderInitCurrency = function () {
        var $currency = $("#currency");

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

        $this.on("select2:select, change", function () {
            renderInitPaymentType()
            renderInitOperationNumber()
        });
    }

    var renderInitPaymentType = function () {
        var $this = $paymentType;
        var $placeholder = $this.data('placeholder');
        var $value = $this.data('value');
        var $data = $paymentMethod.select2('data')[0];
        var formGroup = $this.closest('.form-group')
        var $options = []

        if ($data && $data.hasOwnProperty('payment_type')) {
            $.each($data.payment_type, function (key, item) {
                $options.push({id: item['id'], text: item['name']})
            })
        }

        $this.select2({allowClear: true, placeholder: $placeholder, data: $options});
        $this.val($value).trigger('change');

        if ($options.length) {
            formGroup.removeClass('d-none');
        } else {
            formGroup.removeClass('d-none').addClass('d-none');
        }
    }

    var renderInitOperationNumber = function () {
        var formGroup = $operationNumber.closest('.form-group')
        var data = $paymentMethod.select2('data')[0];

        if (data && data['requiresTransactionNumber']) {
            formGroup.removeClass('d-none');
        } else {
            formGroup.removeClass('d-none').addClass('d-none');
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
                data: 'number',

            },
            {
                data: 'currency',
                render: function (data, type) {
                    if (type === "display") {
                        return `<span class="badge badge-pill badge-info">${data}</span>`;
                    }
                },
            },
            {
                data: 'amount',
                render: function (data, type) {
                    if (type === "display") {
                        return `<span class="badge badge-pill badge-danger">${data}</span>`;
                    }
                },
            },
            {
                data: 'date',
                render: function (data) {
                    return data ? Table.renderDate(data) : '-'
                },
            },
            {
                data: 'time',

            },
            {
                data: 'payment_method',

            },
            {
                data: 'payment_type',

            },
            {
                data: 'operation_number',

            },
            {
                data: 'reservation',

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
                    return `<a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="update/${source['id']}/" data-title="${messages.EDIT_PAYMENT_VOUCHER_INFO}" data-width="93%" data-height="75%"> <i class="mdi mdi-24px mdi-file-edit-outline"></i></a><a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="print/${source['id']}/" data-title="${messages.PRINT_PAYMENT_VOUCHER}" data-width="93%" data-height="75%"> <i class="mdi mdi-24px mdi-printer"></i></a><a href="javascript:void(0);" id="delete-object-modal" class="action-icon" data-url="${data}"> <i class="mdi mdi-24px mdi-delete"></i> </a>`
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
            renderInitDate();
            renderInitTime();
            renderInitPaidFrom();
            renderInitCreditAccount();
            renderInitPaidTo();
            renderInitDebitAccount();
            renderInitCurrency();
            renderInitPaymentMethod();
            renderInitPaymentType();
            renderInitOperationNumber();
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