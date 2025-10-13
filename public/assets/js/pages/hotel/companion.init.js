var WebServices = function () {
    "use strict";

    const lang = DateTime.getLanguageCode();

    const $guest = $('#guest');
    const $relation = $('#relation');
    const $note = $('#note');
    const $companions = $(window.parent.document).find("#companions");

    const messages = {
        CREATE_GUEST: gettext("Create a guest"),
    };

    const validate_data = {
        rules: {
            'guest': {
                required: true,
            },
            'relation': {
                required: true,
            },
        }
    }

    var renderInitGuest = function () {
        var data = function (params) {
            return {
                'search': params.term,
                'category': 'customer',
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
                        discount_value: item['discount_value'],
                        discount_type: item['discount_type']
                    }
                })
            };
        }

        if (!$guest.length)
            return

        Select.ajax($guest, data, processResults);

        $('#btn-guest-create').click(function () {
            var url = `/${lang}/hpanel/guests/create/`;
            Modal.iframe(url, messages.CREATE_GUEST, '100%', '100%');
        })

        $('#btn-guest-update').click(function () {
            var url = `/${lang}/hpanel/guests/update/${$guest.val()}/`;

            if (!$guest.val())
                return 0;

            Modal.iframe(url, messages.EDIT_GUEST_INFO, '100%', '100%');
        })
    }

    var renderInitRelation = function () {

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
                        text: `${item.name}`,
                        id: item.id
                    }
                })
            };
        }

        if (!$relation.length)
            return

        return Select.ajax($relation, data, processResults);
    }

    var handlePageContent = function (data) {
        var $urls = ['guest']
        var $url = data['absolute_url'];
        var $option = new Option(data['name'], data['id'], true, true);

        if ($url && $url.includes($urls[0])) {
            $guest.append($option).trigger({type: 'change'});
        }
    }

    var renderEventListener = function () {
        window.addEventListener('message', function (message) {
            handlePageContent(message.data);
            $.eModal.close();
        });
    }

    var getInput = function ($name, $val) {
        var $id = $companions.find('option').length;
        return `<input id="companions[${$id}]${$name}" name="companions[${$id}]${$name}" class="d-none" value="${$val}">`
    }

    var getOption = function () {
        var id = $guest.val();
        var name = $guest.text();
        var guest = getInput('guest', $guest.val());
        var relation = getInput('relation', $relation.val());
        var note = getInput('note', $note.val());

        return `<option value='${id}' selected>${name} ${guest} ${relation} ${note}</option>`
    }

    var actionCreteObject = function () {
        $("#create-iframe-modal").click(function () {
            var $btn = $(this);
            var $form = $btn.closest('form');

            $form.validate(validate_data);

            if (!$form.valid()) {
                return 0;
            }

            $companions.append(getOption());
            window.parent.postMessage({}, "*");
        });
    }

    return {
        //main function to initiate template pages
        init: function () {
            renderInitGuest();
            renderInitRelation();
            renderEventListener();
            actionCreteObject();
        },
    };

}();

jQuery(document).ready(function () {
    WebServices.init();
});