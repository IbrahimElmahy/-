var NotificationServices = function () {
    "use strict";

    var badgeElements = $(".live_notify_badge");

    var callEndPoint = function (url, method, data, callback, error) {
        $.ajax({
            url: url,
            method: method,
            data: data,
            success: callback,
            error: error,
        })
    }

    var badge = function () {
        $("#notification a").click(function () {
            var count = badgeElements.html();
            if (count !== "0") {
                badgeElements.html("0");
                callEndPoint("/en/notification/api/notifications/mark-all-as-read/", 'GET');
            }
            return !0;
        })
    }

    var renderNotification = function () {
        callEndPoint("/en/notification/api/notifications/unread/", 'GET', null, function (response) {
            var element = $("#notification .simplebar-content");
            badgeElements.html(response.recordsTotal);
            $.each(response.data, function (index, item) {
                if (element.find(`a[data-pk=${item.pk}]`).length === 0) {
                    element.prepend(`<a data-pk="${item.pk}" href="javascript:void(0);" class="dropdown-item notify-item active"> <div class="notify-icon"> <img src="${item.actor['image_url']}" class="img-fluid rounded-circle" alt=""/> </div> <p class="notify-details">${item.actor['username']}</p> <p class="text-muted mb-0 user-msg notify-details"> <small>${item.verb}</small> <small>${item.timestamp}</small> </p> </a>`)
                    $.NotificationApp.send(item.actor['username'], item.verb, "bottom-left", "#3b98b5");
                }
            })
        })
    }


    return {
        //main function to initiate template pages
        init: function () {
            badge();
            renderNotification();
        },

    };

}();

jQuery(document).ready(function () {
    NotificationServices.init();
});