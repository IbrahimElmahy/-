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
    var totalRecords = 0;

    const messages = {
        EDIT_RECEIPT_VOUCHER_INFO: gettext("Edit receipt voucher info"),
        PRINT_RECEIPT_VOUCHER: gettext("Print receipt voucher"),
        EDIT_CASH_INFO: gettext("Edit cash info"),
        EDIT_GUEST_INFO: gettext("Edit guest data"),
        EDIT_CURRENCY_INFO: gettext("Edit currency info"),
    };
    var totalGuests = 0;

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
                required: false,
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
    var fetchTotalGuestRecords = function() {
        var apiBaseUrl = '/en/guest/api/guests/'; // Your API endpoint
    
        $.ajax({
            url: apiBaseUrl,
            method: 'GET',
            success: function(response) {
                // Assign the total number of records to the totalRecords variable
                totalRecords = response.recordsTotal;
    
                // Debugging line: Print the value of totalRecords to the console
                console.log('Total records fetched:', totalRecords);
    
                // Now that you have the total records, you can call renderInitCreditAccount
                renderInitCreditAccount();
            },
            error: function(error) {
                console.log('Error fetching the total number of guest records:', error);
            }
        });
    }

    var renderInitCreditAccount = function () {
       var data = function (params) {
        return {
            'name__contains': params.term,
            'category': $paidFrom.val(),
            'is_active': true,
            'length': totalRecords,
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

        var base = $paidTo.val();
        var name = base === 'bank' ? 'banks' : base;

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
        var defaultCashId;


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
        var $data = $paymentMethod.select2('data')[0];  // The currently selected payment method data
        var formGroup = $this.closest('.form-group');
        var $options = [];
    
        // Reset the payment type if the current payment method does not have any associated payment types or is not supposed to have one
        if ($data && $data.hasOwnProperty('payment_type') && $data.payment_type && $data.requiresTransactionNumber) {
            // Add available payment types to the options list if payment method requires a payment type
            $.each($data.payment_type, function (key, item) {
                $options.push({id: item['id'], text: item['name']});
            });
            $this.select2({allowClear: true, placeholder: $placeholder, data: $options});
            $this.val($value).trigger('change');  // Preserves the current value if applicable
            formGroup.removeClass('d-none');  // Show the payment type selector
        } else {
            // Clear and hide the payment type selector if not required
            $this.val(null).trigger('change');  // Set to null when not required
            $this.select2({allowClear: true, placeholder: $placeholder, data: []});  // Reset the options
            formGroup.addClass('d-none');  // Hide the field
        }
    
        // Log changes to the payment type field
        $this.on("change", function () {
            console.log('Selected Payment Type:', $(this).val());
        });
    };

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
                    return `<a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="update/${source['id']}/" data-title="${messages.EDIT_RECEIPT_VOUCHER_INFO}" data-width="93%" data-height="75%"> <i class="mdi mdi-24px mdi-file-edit-outline"></i></a><a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="print/${source['id']}/" data-title="${messages.PRINT_RECEIPT_VOUCHER}" data-width="93%" data-height="75%"> <i class="mdi mdi-24px mdi-printer"></i></a><a href="javascript:void(0);" id="delete-object-modal" class="action-icon" data-url="${data}"> <i class="mdi mdi-24px mdi-delete"></i> </a>`
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
            // Call fetchTotalGuestRecords() the function to fetch the total records and initialize the credit account dropdown
            fetchTotalGuestRecords();
            renderInitPaidTo();
            renderInitDebitAccount();
            renderInitCurrency();
            renderInitPaymentMethod();
            renderInitPaymentType()
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