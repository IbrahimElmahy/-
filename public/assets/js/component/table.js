var Table = function () {
    "use strict";

    var renderColumnDefs = function () {
        return [{
            defaultContent: "-",
            targets: "_all",
            className: "dt-center",
        }];
    }

    var renderLanguage = function () {
        return {
            emptyTable: gettext("No data is available in the table"),
            lengthMenu: gettext("Show _MENU_ entries"),
            loadingRecords: gettext("Please, wait..."),
            search: gettext("Search:"),
            info: gettext("Showing _START_ to _END_ of _TOTAL_ entries"),
            infoEmpty: gettext("Showing 0 to 0 of 0 entries"),
            paginate: {
                first: gettext("First"),
                last: gettext("Last"),
                next: "<i class='mdi mdi-chevron-right'>",
                previous: "<i class='mdi mdi-chevron-left'>"
            },
            processing: `<div class="card-portlets-loader"></div>`,
        };
    }

    var renderData = function () {
        return {
            searching: false,
            processing: true,
            stateSave: false,
            scrollX: true,
            ordering: false,
            lengthChange: true,
            columnDefs: renderColumnDefs(),
            language: renderLanguage(),
            drawCallback: function () {
                $(".dataTables_paginate > .pagination").addClass("pagination-rounded");
            },
        }
    }

    var renderDate = function (date, format='YYYY-MM-DD HH:mm:ss') {
        return DateTime.renderToDatetimeLocaleString(date, format)
    }

    var renderCallEndPoint = function (btnFilter, ajaxData, ajaxDataSrc, ajaxError) {
        var form = btnFilter.closest("form");
        var btnFilterText = btnFilter.text();
        btnFilter.attr('disabled', 'disabled').html(`<i class="fa fa-spinner fa-spin"></i>`);

        var data = ajaxData ? ajaxData : function (data) {
            delete data.columns;
            delete data.search;
            delete data.order;
            $.each(form.serializeArray(), (index, item) => {
                item.value ? data[item.name] = item.value : data
            });
        };

        var dataSrc = function (json) {
            btnFilter.attr('disabled', false).html(btnFilterText);

            if (ajaxDataSrc !== null)
                return ajaxDataSrc(json)

            return json.data;
        };

        var error = function (response) {
            btnFilter.attr('disabled', false).html(btnFilterText);

            if (ajaxError !== null)
                return ajaxError(response)

            return Form.renderErrorFunction(response)
        };

        return {
            type: form.attr("method"),
            url: form.attr("data-url"),
            data: data,
            dataSrc: dataSrc,
            error: error
        };
    };

    var renderLocalTableView = function (table) {
        var data = $.extend(
            renderData(),
            {
                lengthChange: false,
                processing: false,
                info: false,
                paging: false
            }
        );

        return table.DataTable(data);
    }

    var renderServerTableView = function (table, columns, ajax) {
        var data = $.extend(
            renderData(),
            {
                columns: columns,
                serverSide: true,
                ajax: ajax,
            }
        );

        return table.DataTable(data);
    }

    var renderServerGridView = function (table, columns, ajax, rowCallback) {
        var data = $.extend(renderData(), {
            columns: columns,
            serverSide: true,
            ajax: ajax,
            pagingType: 'full_numbers',
            pageLength: 20,
            lengthChange: false,
            rowCallback: rowCallback,
            language: $.extend(renderLanguage(), {
                emptyTable: function () {
                    table.addClass('justify-content-center').html(`<div class="col-md-8 col-lg-6 col-xl-4"> <div class="text-center w-75 m-auto"> <img src="/static/nozul/assets/images/server.png" alt="" height="auto"> <h2 class="text-muted mb-2 mt-3">${gettext('There is no data added yet.')}</h2> <p class="text-black-50 mb-0 mt-2">${gettext('Please add data to the system to access the desired information.')}</p> </div> </div>`)
                },
                infoEmpty: '',
            }),
        });

        $(document).on('preInit.dt', function () {
            if (table.children().length > 1)
                return 1;

            table.addClass('justify-content-center').html(`<div class="col-md-8 col-lg-6 col-xl-4"> <div class="text-center w-75 m-auto"> <img src="/static/nozul/assets/images/server.png" alt="" height="auto"> <h2 class="text-muted mb-2 mt-3">${gettext('There is no data added yet.')}</h2> <p class="text-black-50 mb-0 mt-2">${gettext('Please add data to the system to access the desired information.')}</p> </div> </div>`)
        });

        var datatable = table.DataTable(data);

        datatable.on('xhr.dt', function () {
            table.removeClass('justify-content-center').empty();
        });

        datatable.on('init.dt', function () {
            $('thead').addClass('d-none');
        });


        return datatable;
    }

    return {
        //main function to initiate template pages

        init: function () {
        },

        renderDate: function (date,  format='YYYY-MM-DD HH:mm:ss') {
            if (!date)
                return;
            return renderDate(date, format)
        },

        renderLocalTableView: function (element) {
            if (!element.length)
                return;
            return renderLocalTableView(element)
        },

        renderServerTableView: function (element, btnFilter, columns, ajaxData = null, ajaxDataSrc = null, ajaxError = null) {
            if (!element.length)
                return;

            return renderServerTableView(element, columns, renderCallEndPoint(btnFilter, ajaxData, ajaxDataSrc, ajaxError))
        },

        renderServerGridView: function (element, btnFilter, columns, rowCallback, ajaxData = null, ajaxDataSrc = null, ajaxError = null) {
            if (!element.length)
                return;

            return renderServerGridView(element, columns, renderCallEndPoint(btnFilter, ajaxData, ajaxDataSrc, ajaxError), rowCallback)
        },
    };

}();

jQuery(document).ready(function () {
    Table.init();
});