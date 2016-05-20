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
                    templateUrl: 'templates/filters.html',
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
    
        .state('app.profile',{
            url: '/profile',
            views: {
                'menuContent': {
                    templateUrl: 'templates/profile.html',
                    controller: 'ProfileCtrl'
                }
            }
        })

        .state('app.routes',{
            url: '/routes',
            views: {
                'menuContent': {
                    templateUrl: 'templates/routes.html',
                    controller: 'RoutesCtrl'
                }
            }
        })

        .state('app.companies',{
            url: '/companies',
            views: {
                'menuContent': {
                    templateUrl: 'templates/companies.html',
                    controller: 'CompaniesCtrl'
                }
            }
        })

        .state('app.account',{
            url: '/account',
            views: {
                'menuContent': {
                    templateUrl: 'templates/account.html',
                    controller: 'AccountCtrl'
                }
            }
        })

        .state('app.faq',{
            url: '/faq',
            views: {
                'menuContent': {
                    templateUrl: 'templates/faq.html',
                    controller: 'FaqCtrl'
                }
            }
        })

        .state('app.advice',{
            url: '/faq',
            views: {
                'menuContent': {
                    templateUrl: 'templates/advice.html'//,
                    //controller: 'FaqCtrl'
                }
            }
        });

    // if none of the above states are matched, use this as the fallback
    if (window.localStorage.getItem('isLogged') == 1) {
        $urlRouterProvider.otherwise('/app/map');
    } else {
        $urlRouterProvider.otherwise('/slides');
    }
});
