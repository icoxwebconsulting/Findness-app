app.controller('ProfileCtrl', function ($scope, $state, user, $ionicHistory, $ionicLoading) {
    $scope.$emit('menu:drag', true);
    $scope.logout = function () {
        user.logout();
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('login');
    };

    $scope.$on('$ionicView.enter', function (e) {
        $scope.customer = user.getProfile();
        $scope.data = {
            password: null
        };
    });

    $scope.updateProfile = function () {
        $ionicLoading.show();
        user.updateProfile($scope.customer.firstName, $scope.customer.lastName)
            .then(function () {
                $ionicLoading.hide();
            });
    };

    $scope.changePassword = function () {
        $ionicLoading.show();
        user.changePassword($scope.data.password)
            .then(function () {
                $scope.data.password = null;
                $ionicLoading.hide();
            });
    };
});
