var app = angular.module('findness', ['ionic', 'ngResource', 'ion-autocomplete', 'credit-cards'])

    .run(function ($ionicPlatform, $rootScope, $state, device, sqliteDatastore, userDatastore, user, pushNotification, notificationMessage, PAYMENT_CONF) {
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
            if(typeof analytics !== undefined) {
                analytics.startTrackerWithId(KEY_ANALYTICS.TRACK_ID);
            } else {
                console.log("Google Analytics Unavailable");
            }

	    if ( $ionicPlatform.is('ios') ) {
	      GappTrack.track("854062907", "Bee2CM2ep3IQu-6flwM", "0.99", false);
	    }

            init();
        });

        $ionicPlatform.on('resume', function () {
            //$rootScope.$broadcast('onResume');
            if (localStorage.getItem("external_load") != null) {
                $state.go("app.paypal");
            }
        });

        $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
            $rootScope.previousState = from.name;
            $rootScope.currentState = to.name;
        });

        function init() {
            sqliteDatastore.initDb();
            <!-- Fill in your publishable key -->
            Stripe.setPublishableKey(PAYMENT_CONF.STRIPE_KEY);
            pushNotification.init();
            pushNotification.listenNotification(notificationMessage.processNotification);
            if (userDatastore.getIsLogged()) {
                userDatastore.setRefreshingAccessToken(0);
                user.refreshAccessToken();
                //redirección para pago por paypal
                if (localStorage.getItem("external_load") != null) {
                    $state.go("app.paypal");
                }
            }
        }
    });
