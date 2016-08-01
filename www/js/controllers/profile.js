app.controller('ProfileCtrl', function ($scope, $state, user, $ionicHistory) {
    $scope.$emit('menu:drag', true);
    $scope.logout = function () {
        user.logout();
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('login');
    }
});
