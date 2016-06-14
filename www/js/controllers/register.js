app.controller('RegisterCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, user) {

    $scope.data = {};
    $scope.error = false;
    $scope.confirm = {};
    var errorMsg = "¡Ups! Ocurrió un error durante el registro, por favor intente más tarde.";

    $scope.register = function () {

        $scope.error = false;

        if (!$scope.data.name) {
            $ionicPopup.alert({
                title: "Ingrese su nombre"
            });
        }
        if (!$scope.data.lastName) {
            $ionicPopup.alert({
                title: "Ingrese su Apellido"
            });
        }
        else if (!$scope.data.email) {
            $ionicPopup.alert({
                title: "Ingrese su email"
            });
        }
        else if (!$scope.data.password) {
            $ionicPopup.alert({
                title: "Ingrese su Contraseña"
            });
        }
        else if (!$scope.data.confirmPassword) {
            $ionicPopup.alert({
                title: "Confirme su Contraseña"
            });
        }
        else if ($scope.data.password !== $scope.data.confirmPassword) {
            $ionicPopup.alert({
                title: "Las contraseñas no coinciden"
            });
        }
        else if (!$scope.data.isChecked) {
            $ionicPopup.alert({
                title: "Para poder registrarse debe aceptar los términos y condiciones"
            });
        }
        else {
            $ionicLoading.show({
                template: 'Creando Cuenta...'
            });

            user.register({
                username: $scope.data.email,
                firstName: $scope.data.name,
                lastName: $scope.data.lastName,
                password: $scope.data.password
            }).then(function (result) {
                console.log("este es el result", result);
                $ionicLoading.hide();
                if (result) {
                    $state.go('confirm');
                } else {
                    $ionicPopup.alert({
                        title: errorMsg
                    });
                }
            }, function (error) {
                $ionicLoading.hide();
                var msg = errorMsg;
                if (error.data.code == 409) {
                    msg = "El correo que intenta usar ya se encuentra registrado.";
                }
                $ionicPopup.alert({
                    title: msg
                });
            });
        }
    };

    $scope.confirmation = function () {
        if (!$scope.confirm.token) {
            $ionicPopup.alert({
                title: "Debe ingresar el número de confirmación."
            });
        } else {
            user.confirm(
                $scope.confirm.token
            ).then(function (result) {
                console.log(result);
                //$state.go('app.map');
            }, function (error) {
                $ionicPopup.alert({
                    title: "Código erróneo, verifique e intente nuevamente."
                });
            });
        }
    }
});