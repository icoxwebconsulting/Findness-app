app.factory('pushNotification', function ($rootScope) {
        var push = null;
        var registrationId = null;

        function getRegistrationId() {
            return registrationId;
        }

        function init() {
            if (window.PushNotification) {
                var PushNotification = window.PushNotification;

                push = PushNotification.init({
                    android: {
                        senderID: "32432862482",
                        icon: "findness",
                        iconColor: "lightgrey",
                        forceShow: true
                    },
                    ios: {
                        alert: "true",
                        badge: true,
                        sound: "true"
                    }
                });

                if (push !== null) {
                    push.on('registration', function (data) {
                        registrationId = data.registrationId;

                        $rootScope.$emit('pushRegistrationId', registrationId);
                    });
                }
            }
        }

        function listenNotification(callback) {
            if (push !== null) {
                push.on('notification', callback);
            }
        }

        return {
            init: init,
            getRegistrationId: getRegistrationId,
            listenNotification: listenNotification
        };
    });
