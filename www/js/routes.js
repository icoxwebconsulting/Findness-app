app.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider,KEY_ANALYTICS) {
    $stateProvider

        .state('slides', {
            url: '/slides',
            templateUrl: 'templates/slides.html',
            controller: 'SlidesCtrl',
            resolve: {
                data: function ($ionicPlatform, KEY_ANALYTICS) {
                    $ionicPlatform.ready(function() {
                        if (typeof analytics !== 'undefined'){
                            analytics.startTrackerWithId(KEY_ANALYTICS.TRACK_ID);
                            analytics.trackView('Slide View');
                        } else {
                            console.info('Google analytics plugin not be loaded.');
                        }
                    });
                }
            }
        })

        .state('register', {
            cache: false,
            url: '/register',
            templateUrl: 'templates/register.html',
            controller: 'RegisterCtrl',
            resolve: {
                data: function ($ionicPlatform, KEY_ANALYTICS) {
                    $ionicPlatform.ready(function() {
                        if (typeof analytics !== 'undefined'){
                            analytics.startTrackerWithId(KEY_ANALYTICS.TRACK_ID);
                            analytics.trackView('register View');
                        } else {
                            console.info('Google analytics plugin not be loaded.');
                        }
                    });
                }
            }
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
            controller: 'LoginCtrl',
            resolve: {
                data: function ($ionicPlatform, KEY_ANALYTICS) {
                    $ionicPlatform.ready(function() {
                        if (typeof analytics !== 'undefined'){
                            analytics.startTrackerWithId(KEY_ANALYTICS.TRACK_ID);
                            analytics.trackView('Login View');
                        } else {
                            console.info('Google analytics plugin not be loaded.');
                        }
                    });
                }
            }
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
                    controller: 'MapCtrl',
                    resolve: {
                        data: function ($ionicPlatform, KEY_ANALYTICS) {
                            $ionicPlatform.ready(function() {
                                if (typeof analytics !== 'undefined'){
                                    analytics.startTrackerWithId(KEY_ANALYTICS.TRACK_ID);
                                    analytics.trackView('Map View');
                                } else {
                                    console.info('Google analytics plugin not be loaded.');
                                }
                            });
                        }
                    }
                }
            }
        })

        .state('app.list', {
            url: '/list',
            views: {
                'menuContent': {
                    templateUrl: 'templates/list.html',
                    controller: 'ListCtrl',
                    resolve: {
                        data: function ($ionicPlatform, KEY_ANALYTICS) {
                            $ionicPlatform.ready(function() {
                                if (typeof analytics !== 'undefined'){
                                    analytics.startTrackerWithId(KEY_ANALYTICS.TRACK_ID);
                                    analytics.trackView('List View');
                                } else {
                                    console.info('Google analytics plugin not be loaded.');
                                }
                            });
                        }
                    }
                }
            }
        })

        .state('app.filter', {
            cache: false,
            url: '/filter',
            views: {
                'menuContent': {
                    templateUrl: 'templates/filters.html',
                    controller: 'FiltersCtrl',
                    resolve: {
                        data: function ($ionicPlatform, KEY_ANALYTICS) {
                            $ionicPlatform.ready(function() {
                                if (typeof analytics !== 'undefined'){
                                    analytics.startTrackerWithId(KEY_ANALYTICS.TRACK_ID);
                                    analytics.trackView('Filters View');
                                } else {
                                    console.info('Google analytics plugin not be loaded.');
                                }
                            });
                        }
                    }
                }
            }
        })

        .state('app.payment', {
            url: '/payment/{month}',
            views: {
                'menuContent': {
                    templateUrl: 'templates/payment.html',
                    controller: 'PaymentCtrl',
                    resolve: {
                        data: function ($ionicPlatform, KEY_ANALYTICS) {
                            $ionicPlatform.ready(function() {
                                if (typeof analytics !== 'undefined'){
                                    analytics.startTrackerWithId(KEY_ANALYTICS.TRACK_ID);
                                    analytics.trackView('Payment View');
                                } else {
                                    console.info('Google analytics plugin not be loaded.');
                                }
                            });
                        }
                    }
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
                    controller: 'ProfileCtrl',
                    resolve: {
                        data: function ($ionicPlatform, KEY_ANALYTICS) {
                            $ionicPlatform.ready(function() {
                                if (typeof analytics !== 'undefined'){
                                    analytics.startTrackerWithId(KEY_ANALYTICS.TRACK_ID);
                                    analytics.trackView('Profile View');
                                } else {
                                    console.info('Google analytics plugin not be loaded.');
                                }
                            });
                        }
                    }
                }
            }
        })

        .state('app.routes', {
            url: '/routes',
            views: {
                'menuContent': {
                    templateUrl: 'templates/routes.html',
                    controller: 'RoutesCtrl',
                    resolve: {
                        data: function ($ionicPlatform, KEY_ANALYTICS) {
                            $ionicPlatform.ready(function() {
                                if (typeof analytics !== 'undefined'){
                                    analytics.startTrackerWithId(KEY_ANALYTICS.TRACK_ID);
                                    analytics.trackView('Routes View');
                                } else {
                                    console.info('Google analytics plugin not be loaded.');
                                }
                            });
                        }
                    }
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
                    controller: 'AccountCtrl',
                    resolve: {
                        data: function ($ionicPlatform, KEY_ANALYTICS) {
                            $ionicPlatform.ready(function() {
                                if (typeof analytics !== 'undefined'){
                                    analytics.startTrackerWithId(KEY_ANALYTICS.TRACK_ID);
                                    analytics.trackView('My account View');
                                } else {
                                    console.info('Google analytics plugin not be loaded.');
                                }
                            });
                        }
                    }
                }
            }
        })

        .state('app.pricing', {
            url: '/pricing',
            views: {
                'menuContent': {
                    templateUrl: 'templates/pricing.html',
                    controller: 'PricingCtrl',
                    resolve: {
                        data: function ($ionicPlatform, KEY_ANALYTICS) {
                            $ionicPlatform.ready(function() {
                                if (typeof analytics !== 'undefined'){
                                    analytics.startTrackerWithId(KEY_ANALYTICS.TRACK_ID);
                                    analytics.trackView('Pricing View');
                                } else {
                                    console.info('Google analytics plugin not be loaded.');
                                }
                            });
                        }
                    }
                }
            }
        })

        .state('app.faq', {
            url: '/faq',
            views: {
                'menuContent': {
                    templateUrl: 'templates/faq.html',
                    controller: 'FaqCtrl',
                    resolve: {
                        data: function ($ionicPlatform, KEY_ANALYTICS) {
                            $ionicPlatform.ready(function() {
                                if (typeof analytics !== 'undefined'){
                                    analytics.startTrackerWithId(KEY_ANALYTICS.TRACK_ID);
                                    analytics.trackView('Faq View');
                                } else {
                                    console.info('Google analytics plugin not be loaded.');
                                }
                            });
                        }
                    }
                }
            }
        })

        .state('app.advice', {
            url: '/advice',
            views: {
                'menuContent': {
                    templateUrl: 'templates/advice.html',//,
                    //controller: 'FaqCtrl'
                    resolve: {
                        data: function ($ionicPlatform, KEY_ANALYTICS) {
                            $ionicPlatform.ready(function() {
                                if (typeof analytics !== 'undefined'){
                                    analytics.startTrackerWithId(KEY_ANALYTICS.TRACK_ID);
                                    analytics.trackView('Advice View');
                                } else {
                                    console.info('Google analytics plugin not be loaded.');
                                }
                            });
                        }
                    }
                }
            }
        })

        .state('app.cart', {
            cache: false,
            url: '/cart',
            views: {
                'menuContent': {
                    templateUrl: 'templates/cart.html',
                    controller: 'CartCtrl',
                    resolve: {
                        data: function ($ionicPlatform, KEY_ANALYTICS) {
                            $ionicPlatform.ready(function() {
                                if (typeof analytics !== 'undefined'){
                                    analytics.startTrackerWithId(KEY_ANALYTICS.TRACK_ID);
                                    analytics.trackView('Cart View');
                                } else {
                                    console.info('Google analytics plugin not be loaded.');
                                }
                            });
                        }
                    }
                }
            }
        })

        .state('app.checkout', {
            cache: false,
            url: '/checkout',
            views: {
                'menuContent': {
                    templateUrl: 'templates/checkout.html',
                    controller: 'CheckoutCtrl',
                    resolve: {
                        data: function ($ionicPlatform, KEY_ANALYTICS) {
                            $ionicPlatform.ready(function() {
                                if (typeof analytics !== 'undefined'){
                                    analytics.startTrackerWithId(KEY_ANALYTICS.TRACK_ID);
                                    analytics.trackView('Checkout View');
                                } else {
                                    console.info('Google analytics plugin not be loaded.');
                                }
                            });
                        }
                    }
                }
            }
        })

        .state('app.resultPayment', {
            cache: false,
            url: '/result-payment',
            views: {
                'menuContent': {
                    templateUrl: 'templates/result-payment.html',
                    controller: 'ResultPaymentCtrl',
                    resolve: {
                        data: function ($ionicPlatform, KEY_ANALYTICS) {
                            $ionicPlatform.ready(function() {
                                if (typeof analytics !== 'undefined'){
                                    analytics.startTrackerWithId(KEY_ANALYTICS.TRACK_ID);
                                    analytics.trackView('checkout View');
                                } else {
                                    console.info('Google analytics plugin not be loaded.');
                                }
                            });
                        }
                    }
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
