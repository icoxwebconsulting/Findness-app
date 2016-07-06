app.controller('ConfirmPasswordCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, user, userDatastore) {
    $scope.confirm = {};

    $scope.$on('$ionicView.enter', function (e) {
        $scope.username = userDatastore.getUsername();
    });

    $scope.confirmPassword = function () {
        if (!$scope.confirm.token) {
            $ionicPopup.alert({
                title: "Debe ingresar el número de confirmación."
            });
        } else if (!$scope.confirm.password) {
            $ionicPopup.alert({
                title: "Debe ingresar la contraseña."
            });
        } else if (!$scope.confirm.password2) {
            $ionicPopup.alert({
                title: "Debe confirmar la contraseña."
            });
        } else if ($scope.confirm.password != $scope.confirm.password2) {
            $ionicPopup.alert({
                title: "Las contraseñas deben ser iguales."
            });
        } else {
            user.confirmPassword(
                $scope.username,
                $scope.confirm.token,
                $scope.confirm.password
            ).then(function (result) {
                $state.go('login');
            }, function (error) {
                $ionicPopup.alert({
                    title: "Código erróneo, verifique e intente nuevamente."
                });
            });
        }
    };
});