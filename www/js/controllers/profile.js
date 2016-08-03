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
    });


    $scope.updateProfile = function () {
        console.log($scope.customer);
        $ionicLoading.show();
        user.updateProfile($scope.customer.firstName, $scope.customer.lastName)
            .then(function () {
                $ionicLoading.hide();
            });
    }
});
