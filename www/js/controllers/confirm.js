app.controller('ConfirmCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, user, userDatastore, $ionicHistory) {

    $scope.username;
    $scope.confirm = {};

    $scope.$on('$ionicView.enter', function (e) {
        $scope.$emit('menu:drag', true);
        $scope.username = userDatastore.getUsername();
    });

    $scope.confirmation = function () {
        if (!$scope.confirm.token) {
            $ionicPopup.alert({
                title: "Debe ingresar el número de confirmación."
            });
        } else {
            $ionicLoading.show({
                template: '<p>Confirmando cuenta, por favor espere...</p><p><p><ion-spinner icon="android"></ion-spinner></p></p>'
            });
            user.confirm(
                $scope.confirm.token
            ).then(function (result) {
                console.log(result);
                $ionicLoading.show({
                    template: '<p>Iniciando sesión, por favor espere...</p><p><p><ion-spinner icon="android"></ion-spinner></p></p>'
                });
                user.login({
                    username: $scope.username,
                    password: userDatastore.getPassword()
                }).then(function () {
                    $ionicLoading.hide();
                    $ionicHistory.nextViewOptions({
                        disableAnimate: false,
                        disableBack: true,
                        historyRoot: true
                    });
                    window.localStorage.setItem('firstTime', 1);
                    $state.go('app.map');
                }, function (error) {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: "Ocurrió un error al intentar iniciar sesión."
                    });
                    console.log(error);
                });
            }, function (error) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: "Código erróneo, verifique e intente nuevamente."
                });
                console.log(error);
            });
        }
    };

    $scope.resend = function () {
        user.resendConfirm().then(function (result) {
            console.log(result);
            $ionicPopup.alert({
                title: "Se ha enviado un correo a la dirección " + $scope.username + " con su nuevo código de confirmación."
            });
        }, function (error) {
            $ionicPopup.alert({
                title: "Intente de nuevo más tarde."
            });
        });
    };

    $scope.goToPage = function (page) {
        $state.go(page);
    }
});