app.controller('LoginCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, user, userDatastore) {

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

            user.requestSalt({
                username: $scope.data.email,
                password: $scope.data.password
            }).then(function (encriptPassword) {
                user.login({
                    username: $scope.data.email,
                    password: encriptPassword
                }).then(function () {
                    $ionicLoading.hide();
                    $scope.data.email = '';
                    $scope.data.password = '';
                    $state.go('app.map');
                }).catch(function (error) {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Findness - Login',
                        template: error.data.message
                    }).then(function () {
                        if (error.data.message == 'Usuario no confirmado.') {
                            userDatastore.setUsername($scope.data.email);
                            $state.go('app.map');
                        }
                    });
                });
            }).catch(function () {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Error',
                    template: "Ha ocurrido un error al consultar por el usuario: " + $scope.data.email
                });
            });
        }
    };
});