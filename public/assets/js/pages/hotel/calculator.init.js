var CalculatorServices = function () {
    "use strict";
    const lang = DateTime.getLanguageCode();

    const $form = $("#reservation");
    const $apartment = $("#apartment");
    const $price = $("#price");
    const $guest = $("#guest");
    const $rent = $("#rent");
    const $period = $("#period");
    const $vatBreakdown = $(".vat-breakdown");
    const $preVat = $("#pre_vat");
    const $vatAmount = $("#vat_amount");
    const $totalWithVat = $("#total_with_vat");
    const $vatOnly = $("#vat_only");
    const $lodgingTax = $("#lodging_tax");
    const $discount = $("#discount");
    const $discountType = $("#discount_type");
    const $discountValue = $("#discount_value");
    const $amount = $("#amount");
    const $subtotal = $("#subtotal");
    const $taxes = $("#taxes");
    const $total = $("#total");
    const $paid = $("#paid");
    const $totalOrders = $("#total_orders");
    const $balance = $("#balance");

    var renderInitGuest = function () {
        $guest.on("change", function (event) {
            var data = event.params

            if (!$discountValue.prop('readonly'))
                return 0;

            if (!data) {
                data = $(this).select2('data')[0];
            }

            $discountValue.val(data['discount_value']).trigger('change');
            $discountType.val(data['discount_type']).trigger('change');
        });
    }

    var renderInitRent = function () {
        $('#btn-allow-change-rent').click(function () {
            $rent.removeAttr('disabled');
        })
    }

    var renderCalculatePrice = function () {
        if ($rent.val() < 0 || $period.val() <= 0 || !$apartment.val() || $discountValue.val() < 0)
            return 0;

        $form.ajaxSubmit({
            url: `/${lang}/reservation/api/reservations/rental-calculation/`,
            method: 'post',
            async: false,
            beforeSend: function () {
                $("body").append('<div id="preloader"><div class="card-disabled"><div class="card-portlets-loader"></div></div></div>')
            },
            success: function (response) {
                // Fill in fields from server
                $price.val(response["apartment_price"]);
                $rent.val(response["rent"]);
                $amount.val(response["amount"]);
                $discount.val(response["discount"]);
                $subtotal.val(response["subtotal"]);
                $taxes.val(response["tax"]);

                // New VAT handling
                // Handle VAT breakdown display
                if (response.is_added_to_price) {
                    $('.vat-breakdown').show();
                    $preVat.val(response.pre_VAT);
                    $vatAmount.val(response.vat);
                    $vatOnly.val(response.vat_only);
                    $lodgingTax.val(response.lodging_tax);
                    $totalWithVat.val(response.total_with_vat);
                    $balance.val(response.balance);
                } else {
                    $('.vat-breakdown').hide();
                    $total.val(response['total']);
                    $balance.val(response['balance']);
                }

                $totalOrders.val(response["total_orders"]);
                $paid.val(response["paid"]);
                $balance.trigger("change");

            },
            error: function (response) {
                console.log(response)
            },
            complete: function () {
                $("#preloader").remove()
            },
        })
    }

    var renderInitDiscountType = function () {
        var processResults = function (response) {
            return {
                results: $.map(response, function (item) {
                    return {
                        text: `${item[1]}`,
                        id: item[0]
                    }
                })
            };
        }

        if (!$discountType.length)
            return

        Select.ajax($discountType, null, processResults);

        $('#btn-allow-change-discount').click(function () {
            $discountValue.removeAttr('readonly');
        })
    }

    var renderInitAmount = function () {
        $("#rent, #period, #apartment, #discount_value, #discount_type, #taxes").on("change", function () {
            renderCalculatePrice();
        });
    }

    var renderInitTax = function () {
        $('#btn-tex-refresh').click(function () {
            var $btn = $(this);
            var $url = `/${lang}/reservation/api/reservations-taxation/`;
            Iframe.create($btn, {}, $url, function () {$taxes.trigger('change');});
        });
    }

    var renderInitBalance = function () {
        $("#balance").on("change", function () {
            if ($balance.val() < 0) {
                $balance.removeClass('text-success text-danger').addClass('text-danger');
            } else {
                $balance.removeClass('text-success text-danger').addClass('text-success');
            }
        });
    }

    return {
        //main function to initiate template pages
        init: function () {
            renderInitGuest();
            renderInitRent();
            renderInitDiscountType();
            renderInitAmount();
            renderInitTax();
            renderInitBalance();
            renderCalculatePrice();
        },
    };

}();

jQuery(document).ready(function () {
    CalculatorServices.init();
});