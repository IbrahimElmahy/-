var WebServices = function () {
    "use strict";

    const currentDate = new Date(DateTime.currentTimeToString());
    const dataTableElement = $('#datatable');
    const dataApartmentGridElement = $('#apartment-items');

    var selectTable = $('#selectable');

    const dataTableFilter = $('#filter');
    const $dataTableForm = dataTableFilter.closest('form');
    const $flatPicker = $('#flatPicker');
    const $apartment = $(window.parent.document).find("#apartment");

    const messages = {
        EDIT_APARTMENT: gettext("Edit apartment data"),
        BALANCE: gettext('Balance'),
        EDIT_RESERVATION_INFO: gettext('Edit reservation info'),
        ADD_RESERVATION_INFO: gettext('Create reservation info'),
        CREATE_APARTMENT_SUCCESS_MESSAGE : gettext("Apartment added successfully! You can add another one"),
        CREATE_APARTMENT_FAILED_MESSAGE : gettext("Failed to save apartment. Please check your input and try again"),
        LOADING : gettext("Please wait while we are saving the apartment"),
        SUCCESS_STATUS : gettext("Success"),
        FAILED_STATUS : gettext("Error")
    };

    const validate_data = {
        rules: {
            'name': {
                required: true,
            },
            'apartment_type': {
                required: true,
            },
            'floor': {
                required: true,
            },
            'rooms': {
                required: true,
            },
        }
    }

    var renderInput = function (key, value) {
        return $('<input>', {type: 'text', name: key, value: value})
    }
    var clearCheckoutDateInput = function() {
        $('[name="reservation__check_out_date"]').remove();
    };

    var renderStatusElement = function () {
        return $('[name="availability"]');
    }

    var renderCleanlinessElement = function () {
        return $('[name="cleanliness"]');
    }

    var renderReservationStatusElement = function () {
        return $('[name="reservation__status"]');
    }

    var renderCheckinElement = function () {
        return $('#check_in_date');
    }

    var renderCheckoutElement = function () {
        return $('#check_out_date');
    }

    var renderFlatPicker = function () {
        var data = {
            defaultDate: currentDate,
            minDate: currentDate,
            dateFormat: "Y-m-d",
        }

        if (!$flatPicker.length)
            return 0;

        return $flatPicker.flatpickr(data)
    }

    var renderInitApartmentType = function () {
        var apartmentType = $('#apartment_type');

        var data = function (params) {
            return {
                'country': $('#country').val(),
                'name__contains': params.term,
                'length': 100,
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

        if (!apartmentType.length)
            return

        return Select.ajax(apartmentType, data, processResults);
    }

    var renderListViewWebServices = function () {
        Table.renderServerTableView(dataTableElement, dataTableFilter, [
            {
                data: null,
                render: function (data, type, full, meta) {
                    return meta.row + 1;
                },
            },
            {
                data: 'name',

            },
            {
                data: 'apartment_type',

            },
            {
                data: 'cleanliness',
                render: function (data, type, source) {
                    if (type === "display") {
                        return `<span class="badge badge-pill badge-${Colors.getApartmentCleanlinessColor(data)}">${source['cleanliness_display']}</span>`;
                    }
                }
            },
            {
                data: 'availability',
                render: function (data, type, source) {
                    if (type === "display") {
                        return `<span class="badge badge-pill badge-${Colors.getApartmentAvailabilityColor(data)}">${source['availability_display']}</span>`;
                    }
                }
            },
            {
                data: 'floor',

            },
            {
                data: 'rooms',

            },
            {
                data: 'beds',

            },
            {
                data: 'double_beds',

            },
            {
                data: 'bathrooms',

            },
            {
                data: 'wardrobes',

            },
            {
                data: 'tvs',

            },
            {
                data: 'ac_type_display',

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
                    return `<a href="javascript:void(0)" class="action-icon" data-toggle="iframe-modal" data-url="update/${source['id']}/" data-title="${messages.EDIT_APARTMENT}" data-width="100%" data-height="100%"> <i class="mdi mdi-24px mdi-file-edit-outline"></i></a><a href="javascript:void(0);" id="delete-object-modal" class="action-icon" data-url="${data}"> <i class="mdi mdi-24px mdi-delete"></i> </a>`

                },
            }
        ]);
    };

    var renderGridViewWebServices = function () {
        var renderTemplate = function (title, url, color, data) {
            if (renderStatusElement().val() === "available") {
                return `<div class="col-lg-2 col-md-3 col-sm-4 col-xs-6"> <!-- Start card-apartment--> <div id="apt-bk" class="card-box rounded-lg py-0 px-0 bg-${color}" data-toggle="iframe-modal" data-url="${url}" data-title="${title}" data-width="94%" data-height="85%"> <div class="row"> <div class="col-12"> <div class="text-left ml-2"> <h4 class="text-dark mb-0">${data['name']}</h4> <p class="text-dark mb-1 text-truncate">${data['apartment_type']}</p> </div> <div class="text-left mt-2 ml-2"> <p class="text-dark mb-1 text-truncate"><i class="mdi mdi-door"></i> <span class="text-white mr-1 mr-1">${data['rooms']}</span><i class="mdi mdi-bed-single-outline"></i> <span class="text-white mr-1">${data['beds']}</span><i class="mdi mdi-bed-king-outline"></i> <span class="text-white mr-1">${data['double_beds']}</span><i class="mdi mdi-toilet"></i> <span class="text-white mr-1">${data['bathrooms']}</span></p></div> </div></div> </div> <!-- end card-apartment--> </div>`
            } else {
                return `<div class="col-lg-2 col-md-3 col-sm-4 col-xs-6"> <!-- Start card-apartment--> <div id="apt-bk" class="card-box rounded-lg py-0 px-0 bg-${color}" data-toggle="iframe-modal" data-url="${url}" data-title="${title}" data-width="94%" data-height="85%"> <div class="row"> <div class="col-12"> <div class="text-left ml-2"> <h4 class="text-dark mb-0">${data['name']}</h4> <p class="text-dark mb-1 text-truncate">${data['reservation']['guest']}</p> </div> <div class="text-left mt-2 ml-2"> <p class="text-dark mb-1 text-truncate"><span class="font-12">${messages.BALANCE}</span>: <span class="badge font-12 bg-white text-${data['reservation']['balance'] < 0 ? "danger" : "success"}">${data['reservation']['balance']}</span></p></div> </div></div> </div> <!-- end card-apartment--> </div>`
            }
        };
        var currentDateString = new Date(DateTime.currentTimeToString()).toISOString().slice(0,10);

        return Table.renderServerGridView(dataApartmentGridElement, dataTableFilter, [{"title": ""}], function (row, data) {
            var reservation = data['reservation'];
            if (reservation !== null) {
                var Reservation_color;
                if (reservation['status'] === 'checkin' && reservation['check_out_date'] === currentDateString) {
                    Reservation_color = Colors.getReservationStatusColor('checkout_today');
                } else {
                    Reservation_color = Colors.getReservationStatusColor(reservation['status']);
                }
                row = renderTemplate(messages.EDIT_RESERVATION_INFO, `/${DateTime.getLanguageCode()}/hpanel/reservations/update/${reservation['id']}/`, Reservation_color, data);
            } else {
                row = renderTemplate(messages.ADD_RESERVATION_INFO, `/${DateTime.getLanguageCode()}/hpanel/reservations/create/${data['id']}/`, Colors.getApartmentCleanlinessColor(data['cleanliness']), data);
            }

            dataApartmentGridElement.append(row)
        })
    };

    var renderSelectViewWebServices = function () {
        selectTable = Table.renderServerTableView(selectTable, dataTableFilter, [
            {
                data: null,
                render: function (data, type, full, meta) {
                    return meta.row + 1;
                },
            },
            {
                data: 'name',

            },
            {
                data: 'apartment_type',

            },
            {
                data: 'cleanliness',
                render: function (data, type, source) {
                    if (type === "display") {
                        return `<span class="badge badge-pill badge-${Colors.getApartmentCleanlinessColor(data)}">${source['cleanliness_display']}</span>`;
                    }
                }
            },
            {
                data: 'floor',

            },
            {
                data: 'absolute_url',
                render: function () {
                    return `<a href="javascript:void(0)" class="action-icon"> <i class="mdi mdi-24px mdi-gesture-tap-hold"></i></a>`

                },
            }
        ]);
    };

    var renderFilterByStatus = function (value) {
        var $status = renderStatusElement();
        var $cleanliness = renderCleanlinessElement();
        var $reservationStatus = renderReservationStatusElement();

        if ($status.length > 0) {
            $status.val(value);
        } else {
            $dataTableForm.append(renderInput('availability', value));
        }

        if ($cleanliness.length > 0) {
            $cleanliness.val(null);
        }

        if ($reservationStatus.length > 0) {
            $reservationStatus.val(null);
        }
    }

    var renderFilterByCleanliness = function (value) {
        var $cleanliness = renderCleanlinessElement();
        var $reservationStatus = renderReservationStatusElement();

        if ($cleanliness.length > 0) {
            $cleanliness.val(value);
        } else {
            $dataTableForm.append(renderInput('cleanliness', value));
        }

        if ($reservationStatus.length > 0) {
            $reservationStatus.val(null);
        }
    }

    var renderFilterByReservationStatus = function (value) {
        var $reservationStatus = renderReservationStatusElement();

        if ($reservationStatus.length > 0) {
            $reservationStatus.val(value);
        } else {
            $dataTableForm.append(renderInput('reservation__status', value));
        }
    }

    var renderDataGirdFilter = function () {
        $('#data-grid-auto-renew').click(function () {
            dataTableFilter.trigger('click');
        })

        $('#data-grid-filter').click(function () {
            renderCheckinElement().val($flatPicker.val());
            renderCheckoutElement().val($flatPicker.val());
            dataTableFilter.trigger('click');
        })

        $('#filter-by-available').click(function () {
            clearCheckoutDateInput();  // Remove checkout date if exists
            renderFilterByStatus('available');
            dataTableFilter.trigger('click');
        });

        $('#filter-by-maintenance').click(function () {
            clearCheckoutDateInput();  // Remove checkout date if exists
            renderFilterByCleanliness('maintenance');
            renderStatusElement().val('available')
            dataTableFilter.trigger('click');
        });

        $('#filter-by-reserved').click(function () {
            clearCheckoutDateInput();  // Remove checkout date if exists
            renderFilterByStatus('reserved');
            renderFilterByReservationStatus('checkin')
            dataTableFilter.trigger('click');
        });

        $('#filter-by-waiting-checkin').click(function () {
            clearCheckoutDateInput();  // Remove checkout date if exists
            renderFilterByStatus('reserved');
            renderFilterByReservationStatus('pending')
            dataTableFilter.trigger('click');
        });

        $('#filter-by-checkout-today').click(function () {
            renderFilterByStatus('reserved');
            renderFilterByReservationStatus('checkin')
            var currentDate  = new Date().toISOString().slice(0,10)
            var $checkoutInput = $('[name="reservation__check_out_date"]')
            if($checkoutInput.length){
                $checkoutInput.val(currentDate)
            }else {
                // If it doesn't exist, append a new hidden input with the current date
                $dataTableForm.append(renderInput('reservation__check_out_date', currentDate));
            }
            
            dataTableFilter.trigger('click');
        });

        $('#filter-by-available-dirty').click(function () {
            clearCheckoutDateInput();  // Remove checkout date if exists
            renderFilterByStatus('available');
            renderFilterByCleanliness('dirty');
            dataTableFilter.trigger('click');
        });

        $('#filter-by-reserved-dirty').click(function () {
            clearCheckoutDateInput();  // Remove checkout date if exists
            renderFilterByStatus('reserved');
            renderFilterByCleanliness('dirty');
            dataTableFilter.trigger('click');
        });
    }

    var renderReloadTable = function () {
        dataTableElement.DataTable().destroy();
        dataApartmentGridElement.DataTable().destroy();
        renderListViewWebServices();
        renderGridViewWebServices();
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

    var handleApartmentSelect = function (data) {
        if (!data && !$apartment)
            return 0;

        $apartment.empty().append(`<option value="${data.id}">${data.name}</option>`);
        window.parent.postMessage({}, "*");
    }

    var actionSelectObject = function () {
        $('#selectable tbody').on('click', 'tr', function () {
            const data = selectTable.row(this).data();
            handleApartmentSelect(data)
        });
    }

    var actionCreteObject = function () {
        $("#create-iframe-modal").click(function () {
            Iframe.create($(this), validate_data, null, function (data) {
                handleApartmentSelect(data)
            });
        });
    }
    var actionCreateManyObject = function () {
        $(document).on('click', '#create-many-iframe-modal', function (e) {
            e.preventDefault(); // Prevent default form submission
    
            // Construct FormData from the form, ensuring file inputs, if any, are included correctly.
            var form = $(this).closest('form');
            var formData = new FormData(form[0]);
            // Show loading indicator (simple text change or add a class for CSS animation)
            // Show loading toast
                $.toast({
                    heading: 'Processing',
                    text: messages.LOADING,
                    icon: 'info',
                    loader: true,        // Change it to false to disable loader
                    loaderBg: '#00C61A',  // To change the background
                    position: 'top-center'
                });
            // Make the AJAX request to submit the form data.
            $.ajax({
                url: form.attr('data-url'), // Get the submission URL from the form's data attribute.
                type: 'POST',
                data: formData,
                contentType: false, // Required for FormData with jQuery.
                processData: false, // Required for FormData with jQuery.
                success: function (response) {
                
                    $.toast({
                        heading:messages.SUCCESS_STATUS,
                        text:messages.CREATE_APARTMENT_SUCCESS_MESSAGE,
                        icon:"success",
                        position: 'top-right',
                       stack: false,
                       loaderBg: '#5ba035'
                    })
                    // Clear the form fields, specifically handling selects and checkboxes if needed.
                    form.find('input[name="name"]').val('') // Reset the entire form after successful data submission
                    // $('select').val('').trigger('change'); // Reset any jQuery Select2 elements if used
                    // form.find('.checkbox-primary input[type="checkbox"]').prop('checked', false); // Uncheck checkboxes
                },
                error: function (xhr, status, error) {
                    $.toast({
                        heading: messages.FAILED_STATUS,
                        text: messages.CREATE_APARTMENT_FAILED_MESSAGE,
                        icon: 'error',
                        position: 'top-right',
                        stack: false,
                        loaderBg: '#ff2a2a'
                    });         
               }
            });
        });
    };

    var actionUpdateObject = function () {
        $("#update-iframe-modal").click(function () {
            Iframe.update($(this), validate_data, null, function (data) {
                handleApartmentSelect(data)
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
            renderFlatPicker();
            renderInitApartmentType();
            renderListViewWebServices();
            renderSelectViewWebServices();
            renderGridViewWebServices();
            renderDataGirdFilter();
            renderEventListener();
            actionFilterObject();
            actionSelectObject();
            actionCreteObject();
            actionCreateManyObject();
            actionUpdateObject();
            actionDeleteObject();
        },

        reload: function () {
            renderReloadTable();
        },
    };

}();

jQuery(document).ready(function () {
    WebServices.init();
});