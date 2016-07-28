app.controller('MainCtrl', function ($scope, $state, $ionicPlatform, $ionicSideMenuDelegate, userDatastore, user) {

    $scope.dragStatus = true;
    userDatastore.setRefreshingAccessToken(0);

    $scope.username = userDatastore.getUsername();

    user.refreshAccessToken()
        .then(function () {

        });

    $ionicPlatform.onHardwareBackButton(function () {
        if ($ionicSideMenuDelegate.isOpen) {
            $scope.menuVisible = false;
        }
    });

    $scope.stateChange = function (to) {
        $state.go(to);
    };

    $scope.$on('menu:drag', function(event, args) {
        console.info('args',args);
        $scope.dragStatus = args;
    });

});
