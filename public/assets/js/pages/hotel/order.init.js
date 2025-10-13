var WebServices = function () {
    "use strict";

    var dataTableElement = $('#datatable');
    var dataTableFilter = $('#filter');

    var $orderItemsTable = $('#order-items');

    const $currentDate = DateTime.renderToDateLocaleString(new Date(DateTime.currentTimeToString()));
    const $lang = DateTime.getLanguageCode();
    const $form = $("#order-form");
    const $apartment = $('#reservation');
    const $category = $('#category');
    const $service = $('#service');
    const $quantity = $('#quantity');
    const $amount = $('#amount');
    const $subtotal = $('#subtotal');
    const $tax = $('#tax');
    const $total = $('#total');

    const messages = {
        EDIT_ORDER_INFO: gettext("Edit order info"),
        PRINT_ORDER_DETAIL: gettext("Print order detail"),
    };

    const validate_data = {
        rules: {
            'reservation': {
                required: true,
            },
            'category': {
                required: true,
            },
            'service': {
                required: true,
            },
            'quantity': {
                required: true,
                min: 1,
            },
        }
    }

    var renderInitApartment = function () {
        var data = function (params) {
            return {
                'search': params.term,
                'availability': 'reserved',
                'length': 10,
            };
        }

        var processResults = function (response) {
            return {
                results: $.map(response.data, function (item) {
                    return {
                        text: `${item.name}`,
                        id: item.reservation.id,
                        cleanliness: item['cleanliness'],
                    }
                })
            };
        }

        var templateResult = function (data) {
            if (!data.id) {
                return data.text;
            }

            return $(`<span><i class="fe-home text-${Colors.getApartmentCleanlinessColor(data['cleanliness'])}"></i> ${data.text}</span>`);
        }


        if (!$apartment.length)
            return

        return Select.ajax($apartment, data, processResults, templateResult);
    }

    var renderCategoryInit = function () {
        var data = function (params) {
            return {
                'search': params.term,
                'is_active': true,
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


        if (!$category.length)
            return

        Select.ajax($category, data, processResults);

        $category.on("select2:close", function () {
            if($service.val()){
                $service.empty();
                $service.select2('destroy');
            }
            renderServiceInit();
        });
    }

    var renderServiceInit = function () {
        var data = function (params) {
            return {
                'search': params.term,
                'category': $category.val(),
                'is_active': true,
                'length': 10,
            };
        }

        var processResults = function (response) {
            return {
                results: $.map(response.data, function (item) {
                    return {
                        text: `${item.name}`,
                        id: item.id,
                        price: item.price,
                    }
                })
            };
        }


        if (!$service.length)
            return

        return Select.ajax($service, data, processResults);
    }

    var renderCalculator = function () {
        $form.ajaxSubmit({
            url: `/${$lang}/order/api/orders/calculation/`,
            method: 'post',
            async: false,
            beforeSend: function () {
                $("body").append('<div id="preloader"><div class="card-disabled"><div class="card-portlets-loader"></div></div></div>')
            },
            success: function (response) {
                $amount.html(response['amount']);
                $subtotal.html(response['subtotal']);
                $tax.html(response['tax']);
                $total.html(response['total']);
            },
            error: function (response) {
                console.log(response)
            },
            complete: function () {
                $("#preloader").remove()
            },
        })
    }

    var renderViewWebServices = function () {
        return Table.renderServerTableView(dataTableElement, dataTableFilter, [
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
                data: 'reservation',

            },
            {
                data: 'apartment',

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
                    return `<a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="update/${source['id']}/" data-title="${messages.EDIT_ORDER_INFO}" data-width="96%" data-height="79%"> <i class="mdi mdi-24px mdi-file-edit-outline"></i></a><a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="print/${source['id']}/" data-title="${messages.PRINT_ORDER_DETAIL}" data-width="96%" data-height="79%"> <i class="mdi mdi-24px mdi-printer"></i></a><a href="javascript:void(0);" id="delete-object-modal" class="action-icon" data-url="${data}"> <i class="mdi mdi-24px mdi-delete"></i> </a>`
                },
            }
        ]);
    };

    var renderOrderItems = function () {
        $orderItemsTable = Table.renderLocalTableView($orderItemsTable);
        var counter = 0;
        var columns = null;


        $("#create-order-item").click(function () {
            var $btn = $(this);
            var $form = $btn.closest("form");
            var $modal = $btn.closest(".modal");
            var quantity = $quantity.val();
            var price = $service.select2('data')[0]['price'];
            var total = quantity * price;

            $form.validate(validate_data);

            if (!$form.valid()) {
                return 0;
            }

            columns = [
                `<input type="hidden" name="order_items[${counter}]service" value="${$service.val()}">${$service.find(`option[value="${$service.val()}"]`).text()}`,
                `<input type="hidden" name="order_items[${counter}]category" value="${$category.val()}">${$category.find(`option[value="${$category.val()}"]`).text()}`,
                `<input type="hidden" name="order_items[${counter}]quantity" value="${quantity}">${quantity}`,
                `${price}`,
                `${total}`,
                `<a href="javascript:void(0);" id="delete-order-item-modal" class="action-icon"><i class="mdi mdi-24px mdi-delete"></i></a>`,
            ]

            $orderItemsTable.row.add(columns).draw(false);
            counter++;
            renderCalculator();
            $category.val(null).trigger('change');
            $service.empty();
            $service.select2('destroy');
            $quantity.val(null);
            $modal.modal('hide');
        });
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

        $(document).on("click", '#delete-order-item-modal', function (e) {
            e.preventDefault();
            var _this = $(this);
            var endpoint = _this.data('url');

            if (endpoint) {
                return Sweetalert.callApi(endpoint, 'DELETE', function () {
                    $orderItemsTable.row(_this.parents('tr')).remove().draw();
                    renderCalculator();
                    renderReloadTable();
                })
            } else {
                return Sweetalert.confirm(function () {
                    $orderItemsTable.row(_this.parents('tr')).remove().draw();
                    renderCalculator();
                });
            }

        });
    }

    return {
        //main function to initiate template pages
        init: function () {
            renderInitApartment();
            renderCategoryInit();
            renderViewWebServices();
            renderOrderItems();
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