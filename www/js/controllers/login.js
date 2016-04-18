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
                
                $state.go('app.map');
            }, function (error) {
                $ionicLoading.hide();

                $ionicPopup.alert({
                    title: error.message
                });
            });
        }
    };
});