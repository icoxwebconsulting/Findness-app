app.controller('LoginCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, user) {

    $scope.data = {};
    $scope.error = false;

    $scope.login = function () {
        $scope.error = false;

        if (!$scope.data.email) {
            $ionicPopup.alert({
                title: "Ingrese su Email"
            });
        }
        else if (!$scope.data.password) {
            $ionicPopup.alert({
                title: "Ingrese su Contraseña"
            });
        }
        else {
            $ionicLoading.show({
                template: 'Verificando ...'
            });

            user.login({
                username: $scope.data.email,
                password: $scope.data.password
            }).then(function () {
                $ionicLoading.hide();
                $scope.data.email = '';
                $scope.data.password = '';
                $state.go('app.map');
            }, function (error) {
                $ionicLoading.hide();
                var msg = "El servidor no responde, intente más tarde.";
                if(error.type == 1 && error.data != null){
                    msg = "Usuario y/o contraseña incorrectos, intente nuevamente."
                }else if(error.type == 2 && error.data != null){
                    msg = "El correo " + $scope.data.email + " no se encuentra registrado."
                }else if(error.type == 3 && error.data != null){
                    msg = "Ocurrió un error al intentar realizar el login, intente nuevamente."
                }

                $ionicPopup.alert({
                    title: 'Error',
                    template: msg
                });
            });
        }
    };
});