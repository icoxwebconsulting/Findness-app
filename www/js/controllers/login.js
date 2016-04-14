app.controller('LoginCtrl', function ($scope, $state, $http, $ionicLoading, $ionicPopup) {//user

    $scope.data = {};
    $scope.error = false;

    $scope.login = function () {
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
        else {
            $ionicLoading.show({
                template: 'Verificando ...'
            });

            // user.login($scope.data).then(function () {
            //     $ionicLoading.hide();
            //
            //     $state.go('mainLayout.main');
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