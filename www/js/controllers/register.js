app.controller('RegisterCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, user, $timeout, userDatastore) {

    $scope.data = {};
    $scope.error = false;
    var errorMsg = "¡Ups! Ocurrió un error durante el registro, por favor intente más tarde.";

    $scope.registerone = function () {

        $scope.error = false;
        if (!$scope.data.name) {
            $ionicPopup.alert({
                title: "Ingrese su nombre"
            });
        }else if (!$scope.data.lastName) {
            $ionicPopup.alert({
                title: "Ingrese su apellido"
            });
        }
        else if (!$scope.data.email) {
            $ionicPopup.alert({
                title: "Ingrese su email"
            });
        }
        else if (!$scope.data.password) {
            $ionicPopup.alert({
                title: "Ingrese su contraseña"
            });
        }
        else if (!$scope.data.confirmPassword) {
            $ionicPopup.alert({
                title: "confirme su Contraseña"
            });
        }
        else if ($scope.data.password !== $scope.data.confirmPassword) {
            $ionicPopup.alert({
                title: "Las contraseñas no coinciden"
            });
        }
        else {
//            $ionicLoading.show({
//                template: 'Creando Cuenta...'
//            });

                userDatastore.setProfile($scope.data.name, $scope.data.lastName);
                userDatastore.setUsername($scope.data.email);
                userDatastore.setPassword($scope.data.password);
                
                $state.go('confirm');

            /*user.register({
                username: $scope.data.email,
                firstName: $scope.data.name,
                lastName: $scope.data.lastName,
                password: $scope.data.password
            }).then(function (result) {
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
                $ionicPopup.alert({
                    title: msg
                });
            });*/
        }
    };

    $scope.goToPage = function (page) {
        console.log(page);
        $state.go(page);
    }
});