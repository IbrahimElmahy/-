var InitPlugins = function () {
    "use strict";

    var initFlatpickr = function () {
        $('[data-plugin="flatpickr"]').each(function () {
            var $this = $(this);
            var locale = $this.data('locale')
            var maxDate = $this.data('max-date')
            var minDate = $this.data('min-date')
            var dateFormate = $this.data('date-format')
            var mode = $this.data('mode')

            var change = function (selected) {
                var _this = this;
                var dateArr = selected.map(function (date) {
                    return _this.formatDate(date, dateFormate);
                });
                $this.val(dateArr.join(', '));
            }

            var ops = {
                locale: locale,
                maxDate: maxDate,
                minDate: minDate,
                dateFormat: dateFormate,
                mode: mode,
                onChange: change
            }

            $this.flatpickr(ops)
        });
    }

    var initTimeFlatpickr = function () {
        $('[data-plugin="time-flatpickr"]').each(function () {
            var $this = $(this);
            var locale = $this.data('locale')
            var dateFormate = $this.data('date-format')

            var ops = {
                enableTime: true,
                noCalendar: true,
                locale: locale,
                dateFormate: dateFormate,
            }

            $this.flatpickr(ops)
        });
    }

    var initIframe = function () {
        $(document).on("click", '[data-toggle="iframe-modal"]', function (e) {
            e.preventDefault();
            var $this = $(this);
            var url = $this.data('url');
            var title = $this.data('title');
            var width = $this.data('width');
            var height = $this.data('height');
            Modal.iframe(url, title, width, height);
        });
    }

    var initSummernote = function () {
        $('[data-plugin="summernote"]').each(function () {
            var $this = $(this);
            var placeholder = $this.data('placeholder')
            var tabsize = $this.data('tabsize')
            var height = $this.data('height')
            var lang = $this.data('lang')

            $this.summernote({
                placeholder: placeholder,
                tabsize: tabsize,
                height: height,
                lang: lang
            });

        });
    }

    var initSelect2 = function () {
        $('[data-plugin="select2"]').each(function () {
            var $this = $(this);
            var $url = $this.data('url');
            var $placeholder = $this.data('placeholder');
            var $value = $this.data('value');

            if ($this.find('option')) {
                $this.append(new Option())
            }

            Ajax.get($url, {}, false, function (data) {
                $.each(data, function (key, item) {
                    var value = key;
                    var text = item;

                    if (data instanceof Array) {
                        value = item[0];
                        text = item[1];
                    }

                    $this.append(new Option(text, value, false, false));
                })

            })

            $this.select2({
                placeholder: $placeholder,
                allowClear: true,
            });

            $this.val($value).trigger('change');
        });
    }

    var initResetForm = function () {
        $(document).on("click", '[data-toggle="reload"]', function () {
            var btn = $(this);
            var form = btn.closest('form');
            form.find('select').val(null).trigger('change');
            form.resetForm();
        });
    }

    var initDraggableModal = function () {
        $(document).on("show.bs.modal", ".modal", function () {
            $(this).find(".modal-dialog").draggable({
                handle: ".modal-header"
            });
        });
    }

    var handelLeftSideBar = function () {
        $('#side-menu li').each(function () {
            var li = $(this);
            var ul = li.find('.collapse ul');
            if (ul.length >= 1 && ul.find('li').length === 0) {
                li.remove();
            }
        });
    }

    return {
        //main function to initiate template pages
        init: function () {
            initFlatpickr();
            initTimeFlatpickr();
            initIframe();
            initSummernote();
            initSelect2();
            initResetForm();
            initDraggableModal();
            handelLeftSideBar();
        },
    };

}();

jQuery(document).ready(function () {
    InitPlugins.init();
});