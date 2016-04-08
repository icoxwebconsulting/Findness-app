app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('main', {
            url: '/main',
            templateUrl: 'templates/main.html',
            controller: 'MainCtrl'
        })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/main');
});
