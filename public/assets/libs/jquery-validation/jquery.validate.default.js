$.validator.setDefaults({
    //onfocusout: true,

    errorPlacement: function (error, element) {

        var group = element.closest('.bootstrap-select');

        if (group.length) {
            group.find(".dropdown-toggle").addClass("error");
            group.after(error.addClass('invalid-feedback'));
            return !0;
        }

        group = element.closest('[data-toggle="select2"]');

        if (group.length) {
            element = group.parent().find(".select2-selection")
            element.addClass("error");
            element.after(error.addClass('invalid-feedback'));
            return !0;
        }

        if (element.hasClass('select2-hidden-accessible')) {
            var parent = element.parent();
            parent.find('.select2-selection.select2-selection--single').addClass("error")
            parent.append(error.addClass('invalid-feedback'));
            return !0;
        } else {
            element.after(error.addClass('invalid-feedback'));
        }
    },
})

