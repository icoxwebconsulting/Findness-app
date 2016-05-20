app.controller('ProfileCtrl', function ($scope, $state, user) {

    $scope.logout = function () {
        user.logout().then(function () {
            $state.go('login');
        });
    }
});
