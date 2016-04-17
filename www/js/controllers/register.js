app.controller('RegisterCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, user) {

    $scope.data = {};
    $scope.error = false;

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
                console.log("este es el result",result);
                $ionicLoading.hide();
                if (result) {
                    $state.go('app.map');
                } else {
                    $ionicPopup.alert({
                        title: "¡Ups! Ocurrió un error durante el registro, por favor intente más tarde."
                    });
                }
            }, function (error) {
                $ionicLoading.hide();

                $ionicPopup.alert({
                    title: error.message
                });
            });
        }
    };
});