app.controller('RegisterCtrl', function ($scope, $state, $ionicLoading, $ionicHistory, $ionicPopup, user, $timeout, userDatastore) {

    $scope.data = {};
    $scope.error = false;

    $scope.register = function () {

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
                title: "Ingrese un email valido"
            });
        }
        else if (!$scope.data.password) {
            $ionicPopup.alert({
                title: "Ingrese su contraseña"
            });
        }
        else {
            $ionicLoading.show({
                template: 'Creando Cuenta...'
            });

          /*  $timeout(function () {
                userDatastore.setProfile($scope.data.name, $scope.data.lastName);
                userDatastore.setUsername($scope.data.email);
                userDatastore.setPassword($scope.data.password);
                $state.go('app.map');

            }, 2000); */


            user.register({
                username: $scope.data.email,
                firstName: $scope.data.name,
                lastName: $scope.data.lastName,
                password: $scope.data.password
            }).then(function (result) {
                $ionicLoading.hide();
                if (result) {
                    user.login({
                        username: $scope.data.email,
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
                } else {
                    $ionicPopup.alert({
                        title: "¡Ups! Ocurrió un error durante el registro, por favor intente más tarde."
                    });
                }
            }, function (error) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Findness - error en registro',
                    template: error.data.message
                });
            });
        }
    };

    $scope.goToPage = function (page) {
        console.log(page);
        $state.go(page);
    }
});