var app = angular.module('findness', ['ionic', 'ngResource', 'ion-autocomplete', 'credit-cards'])

    .run(function ($ionicPlatform, PAYMENT_CONF) {
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

        function init() {
            //sqliteDatastore.initDb();
            <!-- Fill in your publishable key -->
            Stripe.setPublishableKey(PAYMENT_CONF.STRIPE_KEY);
        }
    });
