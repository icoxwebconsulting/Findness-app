app.controller('RecoverPasswordCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, user) {

    $scope.data = {};
    $scope.error = false;
    var errorMsg = "¡Ups! Ocurrió un error durante el recuperar contraseña, por favor intente más tarde.";

    $scope.requestPassword = function () {

        $scope.error = false;

        if (!$scope.data.email) {
            $ionicPopup.alert({
                title: "Ingrese su email"
            });
        }
        else {
            $ionicLoading.show({
                template: 'Solicitando Contraseña...'
            });

            user.requestPassword($scope.data.email)
                .then(function (result) {
                    console.log("este es el result", result);
                    $ionicLoading.hide();
                    if (result) {
                        $state.go('confirmPassword');
                    } else {
                        $ionicPopup.alert({
                            title: errorMsg
                        });
                    }
                }, function () {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: errorMsg
                    });
                });
        }
    };
});