app.controller('ProfileCtrl', function ($scope, $state, user, $ionicHistory) {

    $scope.logout = function () {
        user.logout();
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('login');
    }
});
