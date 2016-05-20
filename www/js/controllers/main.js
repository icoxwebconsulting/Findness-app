app.controller('MainCtrl', function ($scope, $state, $ionicPlatform, $ionicSideMenuDelegate, userDatastore, user) {

    //$scope.isMenuOpen = $ionicSideMenuDelegate.isOpen.bind($ionicSideMenuDelegate);

    userDatastore.setRefreshingAccessToken(0);

    user.refreshAccessToken()
        .then(function () {

        });

    $scope.menuVisible = false;

    $ionicPlatform.onHardwareBackButton(function () {
        if ($ionicSideMenuDelegate.isOpen) {
            $scope.menuVisible = false;
        }
    });

    $scope.toggleMenu = function () {
        $scope.menuVisible = !$scope.menuVisible;
    };

    $scope.stateChange = function (to) {
        $state.go(to);
        $scope.menuVisible = false;
    };

});
