jQuery.extend(jQuery.validator.messages, {
    required: "الرجاء ادخال قيمة الى هذا الحقل.",
    trimRequired: "الرجاء ادخال قيمة الى هذا الحقل.",
    email: "الرجاء ادخال بريد إلكتروني صالح.",
    equalTo: "من فظلك ادخل نفس القيمة مرة أخرى.",
    maxlength: jQuery.validator.format("الرجاء إدخال ما لا يزيد عن {0} حرف."),
    minlength: jQuery.validator.format("الرجاء إدخال {0} حرف على الأقل."),
    alphanumeric: "الرجاء ادخال قيمة تحتوي على احرف او ارقام او شرطة سفلية فقط.",
    dateBefore: "يجيب أن يكون التاريخ قبل تاريخ الانتهاء المقابل",
    dateAfter: "يجب أن يكون التاريخ بعد تاريخ البدء المقابل"
});