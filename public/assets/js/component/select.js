var Select = function () {
    "use strict";


    var ajax = function (element, data, processResults, templateResult = null) {
        var multiple = element.data('multiple');
        var url = element.data('url');
        var type = element.data('type');
        var dataType = element.data('data-type');
        var placeholder = element.data('placeholder');

        var data = {
            allowClear: true,
            cache: true,
            multiple: multiple,
            ajax: {
                cache: true,
                data: data,
                url: url,
                type: type,
                dataType: dataType,
                placeholder: placeholder,

            },
        };

        if (processResults) {
            data['ajax']['processResults'] = processResults;
        }

        if (templateResult) {
            data['templateResult'] = templateResult;
        }

        return element.select2(data)
    }


    return {
        //main function to initiate template pages

        init: function () {
        },

        ajax: function (element, data = null, processResults = null, templateResult = null) {
            return ajax(element, data, processResults, templateResult)
        },

    };


}();

jQuery(document).ready(function () {
    Select.init();
});