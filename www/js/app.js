var app = angular.module('findness', ['ionic', 'ngResource', 'ion-autocomplete', 'credit-cards'])

    .run(function ($ionicPlatform, $state, sqliteDatastore, userDatastore, PAYMENT_CONF) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

            init();
        });

        $ionicPlatform.on('resume', function () {
            //$rootScope.$broadcast('onResume');
        });

        function init() {
            sqliteDatastore.initDb();
            <!-- Fill in your publishable key -->
            Stripe.setPublishableKey(PAYMENT_CONF.STRIPE_KEY);

            if (userDatastore.getIsLogged()) {
                userDatastore.setRefreshingAccessToken(0);
                user.refreshAccessToken()
                    .then(function () {
                        Contacts.loadContacts();
                        messageReceived.getAndProcess();
                    });
                //redirección para pago por paypal
                if (localStorage.getItem("external_load") != null) {
                    $state.go("app.paypal");
                }
            }
        }
    });
