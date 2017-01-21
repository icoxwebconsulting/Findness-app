app.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $stateProvider

        .state('slides', {
            url: '/slides',
            templateUrl: 'templates/slides.html',
            controller: 'SlidesCtrl'
        })

        .state('register', {
            cache: false,
            url: '/register',
            templateUrl: 'templates/register.html',
            controller: 'RegisterCtrl'
        })

        .state('recover-password', {
            url: '/recover-password',
            templateUrl: 'templates/recover-password.html',
            controller: 'RecoverPasswordCtrl'
        })

        .state('confirmPassword', {
            url: '/confirmPassword',
            templateUrl: 'templates/confirm-password.html',
            controller: 'ConfirmPasswordCtrl'
        })

        .state('confirm', {
            url: '/confirm',
            templateUrl: 'templates/confirmation.html',
            controller: 'ConfirmCtrl'
        })

        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
        })

        .state('terms', {
            url: '/terms',
            templateUrl: 'templates/terms.html'
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

        .state('app.list', {
            url: '/list',
            views: {
                'menuContent': {
                    templateUrl: 'templates/list.html',
                    controller: 'ListCtrl'
                }
            }
        })

        .state('app.filter', {
            cache: false,
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

        .state('app.profile', {
            url: '/profile',
            views: {
                'menuContent': {
                    templateUrl: 'templates/profile.html',
                    controller: 'ProfileCtrl'
                }
            }
        })

        .state('app.routes', {
            url: '/routes',
            views: {
                'menuContent': {
                    templateUrl: 'templates/routes.html',
                    controller: 'RoutesCtrl'
                }
            }
        })

        .state('app.orderRoutes', {
            url: '/order-routes',
            views: {
                'menuContent': {
                    templateUrl: 'templates/map.html',
                    controller: 'OrderRoutesCtrl'
                }
            }
        })

        .state('app.companies', {
            cache: false,
            url: '/companies',
            views: {
                'menuContent': {
                    templateUrl: 'templates/companies.html',
                    controller: 'CompaniesCtrl'
                }
            }
        })
        .state('app.companies-detail', {
            cache: false,
            url: 'companies/:id/:name',
            views: {
                'menuContent': {
                    templateUrl: 'templates/companies-detail.html',
                    controller: 'CompaniesCtrl'
                }
            }
        })

        .state('app.searches', {
            url: '/searches',
            views: {
                'menuContent': {
                    templateUrl: 'templates/searches.html',
                    controller: 'SearchesCtrl'
                }
            }
        })

        .state('app.account', {
            url: '/account',
            views: {
                'menuContent': {
                    templateUrl: 'templates/account.html',
                    controller: 'AccountCtrl'
                }
            }
        })

        .state('app.faq', {
            url: '/faq',
            views: {
                'menuContent': {
                    templateUrl: 'templates/faq.html',
                    controller: 'FaqCtrl'
                }
            }
        })

        .state('app.advice', {
            url: '/advice',
            views: {
                'menuContent': {
                    templateUrl: 'templates/advice.html'//,
                    //controller: 'FaqCtrl'
                }
            }
        })

        .state('app.cart', {
            cache: false,
            url: '/cart',
            views: {
                'menuContent': {
                    templateUrl: 'templates/cart.html',
                    controller: 'CartCtrl'
                }
            }
        })

        .state('app.checkout', {
            cache: false,
            url: '/checkout',
            views: {
                'menuContent': {
                    templateUrl: 'templates/checkout.html',
                    controller: 'CheckoutCtrl'
                }
            }
        })

        .state('app.resultPayment', {
            cache: false,
            url: '/result-payment',
            views: {
                'menuContent': {
                    templateUrl: 'templates/result-payment.html',
                    controller: 'ResultPaymentCtrl'
                }
            }
        });

    // if none of the above states are matched, use this as the fallback
    if (window.localStorage.getItem('isLogged') == 1) {
        $urlRouterProvider.otherwise('/app/map');
    } else {
        if (window.localStorage.getItem('isConfirm') == 0) {
            $urlRouterProvider.otherwise('/confirm');
        } else {
            $urlRouterProvider.otherwise('/slides');
        }
    }
});
