var Pagination = function () {
    "use strict";

    var ajax = function ($elPagination, render) {
        $elPagination.twbsPagination({
            "totalPages": 26,
            "onPageClick": function (event, page) {
                $.ajax({
                    "method": "GET",
                    "url": $elPagination.data("url"),
                    "data": {
                        "start": (page - 1) * 10,
                        "length": 10
                    },
                    "async": true,
                    "success": function (response) {
                        $elPagination.twbsPagination.changeTotalPages = function (e, v) {
                            alert(v)
                        }
                        render(response);
                    }
                })
            }
        });
    }

    return {
        //main function to initiate template pages

        init: function () {

        },

        ajax: function ($elPagination, render) {
            if (!$elPagination.length)
                return

            return ajax($elPagination, render)
        }


    };


}();

jQuery(document).ready(function () {
    Toast.init();
});