var WebServices = function () {
    "use strict";

    const dataTableElement = $('#datatable');
    const dataTableFilter = $('#filter');
    const lang = DateTime.getLanguageCode();

    const $apartment = $("#apartment");
    const $guest = $('#guest');
    const $company = $('#company');

    const messages = {
        EDIT_GUEST_INFO: gettext("Edit guest info"),
        EDIT_COMPANY_INFO: gettext("Edit company info"),
        VIEW_RESERVATION_INFO: gettext("View reservation info"),
    };

    var renderInitHotel = function () {
        var hotel = $("#hotel");

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
                        text: item.name,
                        id: item.id
                    }
                })
            };
        }

        if (!hotel.length)
            return

        Select.ajax(hotel, data, processResults);

    }

    var renderInitApartment = function () {

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
                        text: item.name,
                        id: item.id,
                    }
                })
            };
        }


        if (!$apartment.length)
            return

        return Select.ajax($apartment, data, processResults);
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
                        text: item.name,
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
                        text: item.name,
                        id: item.id
                    }
                })
            };
        }

        if (!source.length)
            return

        return Select.ajax(source, data, processResults);
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
                        text: item.name,
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
                        text: item.name,
                        id: item.id
                    }
                })
            };
        }

        if (!$guest.length)
            return

        Select.ajax($guest, data, processResults);

        $('#btn-guest-update').click(function () {
            var guest = $guest.val();
            var url = '/' + lang + '/hpanel/guests/update/' + guest + '/'

            if (!guest)
                return 0;

            Modal.iframe(url, messages.EDIT_GUEST_INFO, '100%', '100%');
        })
    }

    var renderInitCompany = function () {
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
                        text: item.name,
                        id: item.id,
                        discount_value: item['discount_value'],
                        discount_type: item['discount_type']
                    }
                })
            };
        }

        if (!$company.length)
            return

        Select.ajax($company, data, processResults);

        $('#btn-company-update').click(function () {
            var company = $company.val();
            var url = '/' + lang + '/hpanel/companies/setup/update/' + company + '/'

            if (!company)
                return 0;

            Modal.iframe(url, messages.EDIT_COMPANY_INFO, '100%', '100%');
        })

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
                data: 'hotel',

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
                        return `<span class="badge badge-pill badge-${Colors.getReservationStatusColor(data)}">` + source['status_display'] + '</span>';
                    }
                }
            },
            {
                data: 'rental_type_display',

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
                        return '<span class="badge badge-pill badge-info">' + data + '</span>';
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
                        return `<a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="detail/${source['id']}/" data-title="${messages.VIEW_RESERVATION_INFO}" data-width="80%" data-height="75%"> <i class="mdi mdi-24px mdi-eye"></i></a>`
                    }
                },
            }
        ]);
    };

    var renderReloadTable = function () {
        dataTableElement.DataTable().destroy();
        renderViewWebServices();
    }

    var actionFilterObject = function () {
        dataTableFilter.click(function (e) {
            e.preventDefault();
            renderReloadTable();
        })
    }


    return {
        //main function to initiate template pages
        init: function () {
            renderInitHotel();
            renderInitApartment();
            renderInitApartmentType();
            renderInitSource();
            renderInitReason();
            renderInitGuest();
            renderInitCompany();
            renderViewWebServices();
            actionFilterObject();
        },
    };


}();

jQuery(document).ready(function () {
    WebServices.init();
});