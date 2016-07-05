app.controller('MainCtrl', function ($scope, $state, $ionicPlatform, $ionicSideMenuDelegate, userDatastore, user) {

    userDatastore.setRefreshingAccessToken(0);

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

});
