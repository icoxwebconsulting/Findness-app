app.controller('RegisterCtrl', function ($scope, $state, $ionicLoading, $ionicPopup ) {//user

    $scope.data = {
        privacy_police: false
    };
    $scope.error = false;

    $scope.signup = function () {
        $scope.error = false;

        if (!$scope.data.email) {
            $ionicPopup.alert({
                title: "Ingrese su E-mail"
            });
        }
        else if (!$scope.data.password) {
            $ionicPopup.alert({
                title: "Ingrese su Contraseña"
            });
        }
        else if ($scope.data.password !== $scope.data.repassword) {
            $ionicPopup.alert({
                title: "Confirme su Contraseña"
            });
        }
        else {
            $ionicLoading.show({
                template: 'Creando Cuenta ...'
            });

            // user.signup($scope.data).then(function () {
            //     $ionicLoading.hide();
            //
            //     $state.go('base.account.login');
            // }, function (error) {
            //     $ionicLoading.hide();
            //
            //     $ionicPopup.alert({
            //         title: error.message
            //     });
            // });
        }
    };
});