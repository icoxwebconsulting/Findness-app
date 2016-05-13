app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('slides', {
            url: '/slides',
            templateUrl: 'templates/slides.html',
            controller: 'SlidesCtrl'
        })

        .state('register', {
            url: '/register',
            templateUrl: 'templates/register.html',
            controller: 'RegisterCtrl'
        })

        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
        })

        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'MainCtrl'
        })

        .state('app.map', {
            url: '/map',
            views: {
                'menuContent': {
                    templateUrl: 'templates/map.html',
                    controller: 'MapCtrl'
                }
            }
        })

        .state('app.filter', {
            url: '/filter',
            views: {
                'menuContent': {
                    templateUrl: 'templates/cnae.html',
                    controller: 'FiltersCtrl'
                }
            }
        })

        .state('app.payment', {
            url: '/payment',
            views: {
                'menuContent': {
                    templateUrl: 'templates/payment.html',
                    controller: 'PaymentCtrl'
                }
            }
        })

        .state('app.paypal', {
            url: '/paypal',
            views: {
                'menuContent': {
                    templateUrl: 'templates/paypal.html',
                    controller: 'PaypalCtrl'
                }
            }
        })

    // if none of the above states are matched, use this as the fallback
    if (window.localStorage.getItem('isLogged') == 1) {
        $urlRouterProvider.otherwise('/app/map');
    } else {
        $urlRouterProvider.otherwise('/slides');
    }
});
