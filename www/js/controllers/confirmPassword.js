app.controller('ConfirmPasswordCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, user, userDatastore, $ionicHistory) {
    $scope.confirm = {};

    $scope.$on('$ionicView.enter', function (e) {
        $scope.$emit('menu:drag', true);
        $scope.username = userDatastore.getUsernameRecover();
    });

    $scope.goBack = function () {
        $state.go($ionicHistory.backView().stateName)
    };

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
                $ionicPopup.alert({
                    title: "Findness",
                    template: "Se ha cambiado su contraseña satisfactoriamente, por favor inicie sesión con la nueva contraseña."
                });
                $state.go('login');
            }, function (error) {
                $ionicPopup.alert({
                    title: "Findness",
                    template: "Código erróneo, verifique e intente nuevamente."
                });
            });
        }
    };
});