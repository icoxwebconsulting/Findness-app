app.controller('MainCtrl', function ($scope, $state, $ionicPlatform, $ionicSideMenuDelegate, userDatastore, user, cart) {

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
        $scope.dragStatus = args;
    });

    $scope.init = function () {
        $scope.customer = user.getProfile();
        $scope.view.balance = cart.getBalance();
    };

    $scope.$on('$ionicView.enter', function (e) {
        $scope.view = {};
        $scope.init();
    });

});
