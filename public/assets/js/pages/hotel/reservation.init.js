var WebServices = function () {
    "use strict";

    const dataTableElement = $('#datatable');
    const dataTableFilter = $('#filter');
    const lang = DateTime.getLanguageCode();
    const btnExportCSV = $('#exportCSV')

    const $status = '<input type="hidden" name="status" value="checkin"/>';

    const $guestType = $('#guest_type');
    const $guest = $('#guest');
    const $companions = $("#companions");
    const $receipt = $('#receipt');
    const $refund = $('#refund');
    const $invoice = $('#invoice');
    const $order = $('#order');
    const $rent = $('#rent')

    const $UpdateBtn = $('#update-iframe-modal')
    const $checkinBtn = $('#update-checkin-iframe-modal')
    const $checkoutBtn = $('#update-checkout-iframe-modal')
    const messages = {
        VIEW_GUEST: gettext("View guest data"),
        CREATE_GUEST: gettext("Create a guest"),
        EDIT_GUEST_INFO: gettext("Edit guest data"),
        CREATE_COMPANIONS: gettext("Create a companion"),
        EDIT_RECEIPT_INFO: gettext("Edit receipt voucher data"),
        PRINT_RECEIPT_VOUCHER: gettext("Print receipt voucher"),
        EDIT_REFUND_INFO: gettext("Edit refund voucher data"),
        PRINT_REFUND_VOUCHER: gettext("Print refund voucher"),
        PRINT_INVOICE_DETAIL: gettext("Print invoice detail"),
        PRINT_ORDER_DETAIL: gettext("Print order detail"),
        EDIT_RESERVATION_INFO: gettext("Edit reservation info"),
        PRINT_RESERVATION_INFO: gettext("Print reservation info"),
        LOADING: gettext("Please wait while we are saving the reservation"),
        SUCCESS_STATUS: gettext("Success"),
        CREATE_RESERVATION_FAILED_MESSAGE : gettext("Error : please check your inputs and try again."),
        FAILED_STATUS: gettext("Error"),
        CREATE_RESERVATION_SUCCESS_MESSAGE: gettext('Reservation has been created successfully.You can make another reservation'),
        SWEETALERT_CREATED_TEXT: gettext('Reservation has been created successfully.'),
        SWEETALERT_UPDATED_TEXT: gettext('Your reservation information has been modified successfully.'),
        CHECKIN_RESERVATION_SUCCESS_MESSAGE: gettext('You have successfully checked in to the reservation ,You can create new check in.'),
        SWEETALERT_CHECKEDIN_TEXT: gettext('You have successfully checked in to the reservation.'),
        SWEETALERT_CHECKED_OUT_TEXT: gettext('You have successfully checked out of the apartment.')
    }

    const validate_data = {
        rules: {
            'source': {
                required: true,
            },
            'rental_type': {
                required: true,
            },
            'check_in_date': {
                required: true,
            },
            'check_out_date': {
                required: true,
            },
            'period': {
                required: true,
                min: 1,
            },
            'apartment': {
                required: true,
            },
            'guest': {
                required: true,
            },
            'reason': {
                required: true,
            },
        }
    }

    var renderInitApartmentType = function () {
        var apartment_type = $("#apartment__apartment_type");

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

        if (!apartment_type.length)
            return

        Select.ajax(apartment_type, data, processResults);
    }

    var renderInitSource = function () {
        var source = $("#source");

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

        if (!source.length)
            return

        return Select.ajax(source, data, processResults);
    }

    var renderExportTableCSV = function () {
        btnExportCSV.click(function (e) {
            e.preventDefault();
            var $form = $('form');
            var $url = btnExportCSV.data('url') + '?' + $form.serialize();
            window.open($url, "_blank");
        });
    }
    var renderInitReason = function () {
        var reason = $("#reason");

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

        if (!reason.length)
            return

        return Select.ajax(reason, data, processResults);
    }

    var renderInitGuest = function () {
        var base = () => $guestType.val() === 'customer' ? 'guest' : 'agent'

        var name = () => `${base()}s`

        $('#btn-guest-view').click(function () {
            var url = `/${lang}/hpanel/${name()}/select/`;

            if (!$guestType.val())
                return 0;

            Modal.iframe(url, messages.VIEW_GUEST, '100%', '100%');
        })

        $('#btn-guest-create').click(function () {
            var url = `/${lang}/hpanel/${name()}/create/`;

            if (!$guestType.val())
                return 0;

            Modal.iframe(url, messages.CREATE_GUEST, '100%', '100%');
        })

        $('#btn-guest-update').click(function () {
            var url = `/${lang}/hpanel/${name()}/update/${$guest.val()}/`;

            if (!$guestType.val() || !$guest.val())
                return 0;

            Modal.iframe(url, messages.EDIT_GUEST_INFO, '100%', '100%');
        })
    }

    var renderInitCompanions = function (companions = null) {
        if (companions) {
            $companions.select2('destroy');
            $companions.find('option').remove();

            $.each(companions, function (key, item) {
                $companions.append(`<option value="${item['id']}" data-url="${item['absolute_url']}">${item['guest']}</option>`)
            })
        }

        $companions.select2({placeholder: $companions.data('placeholder')});

        $('#btn-companions-create').click(function () {
            var url = `/${lang}/hpanel/companions/create/`;
            Modal.iframe(url, messages.CREATE_COMPANIONS, '100%', '89%');
        })

        $('#btn-companions-delete').click(function () {
            var selectedOption = $companions.val();
            var optionToRemove = $companions.find(`option[value="${selectedOption}"]`);

            if (!optionToRemove)
                return 0;

            var endpoint = optionToRemove.data('url');

            if (typeof endpoint === 'string') {
                return Sweetalert.callApi(endpoint, 'DELETE', function () {
                    optionToRemove.remove();
                });
            }

            return Sweetalert.confirm(function () {
                optionToRemove.remove();
            });
        })
    }

    var renderInitReceipt = function () {
        var data = function (params) {
            return {
                'search': params.term,
                'type': 'receipt',
                'reservation': $receipt.data('reservation'),
                'length': 10,
            };
        }

        var processResults = function (response) {
            return {
                results: $.map(response.data, function (item) {
                    return {
                        text: `${item.description}`,
                        id: item.id,
                    }
                })
            };
        }

        if (!$receipt.length)
            return

        Select.ajax($receipt, data, processResults);

        $('#btn-receipt-update').click(function () {
            var url = `/${lang}/hpanel/receipts/update/${$receipt.val()}/`;

            if (!$receipt.val())
                return 0;

            Modal.iframe(url, messages.EDIT_RECEIPT_INFO, '100%', '100%');
        });

        $('#btn-receipt-print').click(function () {
            var url = `/${lang}/hpanel/receipts/print/${$receipt.val()}/`;

            if (!$receipt.val())
                return 0;

            Modal.iframe(url, messages.PRINT_RECEIPT_VOUCHER, '100%', '100%');
        });
    }

    var renderInitRefund = function () {
        var data = function (params) {
            return {
                'search': params.term,
                'type': 'payment',
                'reservation': $refund.data('reservation'),
                'length': 10,
            };
        }

        var processResults = function (response) {
            return {
                results: $.map(response.data, function (item) {
                    return {
                        text: `${item.description}`,
                        id: item.id,
                    }
                })
            };
        }

        if (!$refund.length)
            return

        Select.ajax($refund, data, processResults);

        $('#btn-refund-update').click(function () {
            var url = `/${lang}/hpanel/payments/update/${$refund.val()}/`;

            if (!$refund.val())
                return 0;

            Modal.iframe(url, messages.EDIT_REFUND_INFO, '100%', '100%');
        });

        $('#btn-refund-print').click(function () {
            var url = `/${lang}/hpanel/payments/print/${$refund.val()}/`;

            if (!$refund.val())
                return 0;

            Modal.iframe(url, messages.PRINT_RECEIPT_VOUCHER, '100%', '100%');
        });
    }

    var renderInitInvoice = function () {
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
                        text: `${item.number}`,
                        id: item.id,
                    }
                })
            };
        }

        if (!$invoice.length)
            return

        Select.ajax($invoice, data, processResults);

        $('#btn-invoice-create').click(function () {
            var $btn = $(this);
            var $url = `/${lang}/invoice/api/invoices/`;
            Iframe.create($btn, {}, $url, function () {
            });
        });

        $('#btn-invoice-print').click(function () {
            var url = `/${lang}/hpanel/invoices/print/${$invoice.val()}/`;

            if (!$invoice.val())
                return 0;

            Modal.iframe(url, messages.PRINT_INVOICE_DETAIL, '100%', '100%');
        });
    }

    var renderInitOrder = function () {
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
                        text: `${item.number} (${item.total})`,
                        id: item.id,
                    }
                })
            };
        }

        if (!$order.length)
            return

        Select.ajax($order, data, processResults);

        $('#btn-order-print').click(function () {
            var url = `/${lang}/hpanel/orders/print/${$order.val()}/`;

            if (!$order.val())
                return 0;

            Modal.iframe(url, messages.PRINT_ORDER_DETAIL, '100%', '100%');
        });
    }

    var renderViewWebServices = function () {
    
      var tableInstance = Table.renderServerTableView(dataTableElement, dataTableFilter, [
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
                data: 'guest',

            },
            {
                data: 'apartment',

            },
            {
                data: 'check_in_date',
                render: function (data) {
                    return data ? Table.renderDate(data) : '-'
                },
            },
            {
                data: 'check_out_date',
                render: function (data) {
                    return data ? Table.renderDate(data) : '-'
                },
            },
            {
                data: 'time',

            },
            {
                data: 'status',
                render: function (data, type, source) {
                    if (type === "display") {
                        return `<span class="badge badge-pill badge-${Colors.getReservationStatusColor(data)}">${source['status_display']}</span>`;
                    }
                }
            },
            {
                data: 'rental_display',

            },
            {
                data: 'period',

            },
            {
                data: 'rent',

            },
            {
                data: 'amount',

            },
            {
                data: 'discount_display',
                render: function (data, type) {
                    if (type === "display") {
                        return `<span class="badge badge-pill badge-info">${data}</span>`;
                    }
                }
            },
            {
                data: 'subtotal',
            },
            {
                data: 'tax',
            },
            {
                data: 'total',
            },
            {
                data: 'paid',
            },
            {
                data: 'balance',
                render: function (data, type) {
                    if (type === "display") {
                        console.log('balance: ')
                        console.log(data)
                        if (data < 0)
                            return '<span class="badge badge-pill badge-danger">' + data + '</span>';
                        else
                            return '<span class="badge badge-pill badge-success">' + data + '</span>';

                    }
                }
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
                    if (type === "display") {
                        return `<a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="update/${source['id']}/" data-title="${messages.EDIT_RESERVATION_INFO}" data-width="94%" data-height="85%"> <i class="mdi mdi-24px mdi-file-edit-outline"></i></a><a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="print/${source['id']}/" data-title="${messages.PRINT_RESERVATION_INFO}" data-width="93%" data-height="75%"> <i class="mdi mdi-24px mdi-printer"></i></a><a href="javascript:void(0);" id="delete-object-modal" class="action-icon" data-url="${data}"> <i class="mdi mdi-24px mdi-delete"></i> </a>`
                    }
                },
            }
        ]);
       
    };
    var handleFormSubmission = function ($btn, checkin = false) {
        var form = $btn.closest('form');
        var formData = new FormData(form[0]);
        form.find('input[name="status"]').remove();

        if (checkin) {
            formData.append('status', 'checkin');
        }

        $.ajax({
            url: form.attr('data-url'),
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            beforeSend: function() {
                $.toast({
                    heading: 'Processing',
                    text: messages.LOADING,
                    icon: 'info',
                    loader: true,
                    loaderBg: '#00C61A',
                    position: 'top-center'
                });
            },
            success: function(response) {
                $.toast({
                    heading: messages.SUCCESS_STATUS,
                    text: checkin ? messages.CHECKIN_RESERVATION_SUCCESS_MESSAGE : messages.CREATE_RESERVATION_SUCCESS_MESSAGE,
                    icon: "success",
                    position: 'top-right',
                    stack: false,
                    loaderBg: '#5ba035'
                });
                $('#apartment').val('').trigger('change');
            },
            error: function(xhr, status, error) {
                $.toast({
                    heading: messages.FAILED_STATUS,
                    text: messages.CREATE_RESERVATION_FAILED_MESSAGE,
                    icon: 'error',
                    position: 'top-right',
                    stack: false,
                    loaderBg: '#ff2a2a'
                });
            }
        });
    };
    var actionCreateManyObject = function () {
        $(document).on('click', '#create-group-iframe-modal', function (e) {
            e.preventDefault();
            handleFormSubmission($(this), false);
        });

        $(document).on('click', '#create-group-checkin-iframe-modal', function (e) {
            e.preventDefault();
            handleFormSubmission($(this), true);
        });
    };


    var renderReloadTable = function () {
        dataTableElement.DataTable().destroy();
        renderViewWebServices();
    }

    var renderEventListener = function () {
        window.addEventListener('message', function () {
            $rent.trigger('change');
            renderReloadTable();
            $.eModal.close();
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
            var $btn = $(this);
            $btn.closest('form').find('#status').remove();
            Iframe.create($btn, validate_data);
        });

        $("#create-checkin-iframe-modal").click(function () {
            var $btn = $(this);
            $btn.closest('form').append($status);
            Iframe.create($btn, validate_data);
        });
    }

    var actionUpdateObject = function () {
        $("#update-iframe-modal").click(function () {
            var $btn = $(this);
            $btn.closest('form').find('[name="status"]').remove();
            Iframe.update($btn, validate_data, null, function (response) {
                Sweetalert.success(messages.SWEETALERT_TITLE, messages.SWEETALERT_UPDATED_TEXT, function () {
                    parent['WebServices'].reload();
                    renderInitCompanions(response['companions']);
                });
            });
        });

        $checkinBtn.click(function () {
            var $btn = $(this);
            $btn.closest('form').append($status);
            Iframe.update($btn, validate_data, null, function (response) {
                Sweetalert.success(messages.SWEETALERT_TITLE, messages.SWEETALERT_CHECKEDIN_TEXT, function () {
                    $btn.addClass('d-none');
                    $checkoutBtn.removeClass('d-none');
                    parent['WebServices'].reload();
                    renderInitCompanions(response['companions']);
                });
            });
        });

        $checkoutBtn.click(function () {
            var $btn = $(this);
            Iframe.create($btn, {}, `/${lang}/reservation/api/reservations/checkout/`, function (response) {
                Sweetalert.success(messages.SWEETALERT_TITLE, messages.SWEETALERT_CHECKED_OUT_TEXT, function () {
                    $UpdateBtn.addClass('d-none');
                    $checkoutBtn.addClass('d-none');
                    parent['WebServices'].reload();
                    renderInitCompanions(response['companions']);
                });
            });
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
            renderInitApartmentType();
            renderInitSource();
            renderInitReason();
            renderInitGuest();
            renderInitCompanions();
            renderInitReceipt();
            renderInitRefund();
            renderInitInvoice();
            renderInitOrder();
            renderViewWebServices();
            renderEventListener();
            actionFilterObject();
            actionCreteObject();
            actionUpdateObject();
            actionCreateManyObject();
            actionDeleteObject();
            renderExportTableCSV();
        },
        reload: function () {
            renderReloadTable();
        },
    };

}();

jQuery(document).ready(function () {
    WebServices.init();
});