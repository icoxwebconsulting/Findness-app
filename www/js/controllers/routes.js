app.controller('RoutesCtrl', function ($scope, $state, $ionicLoading, routeService, map) {

    $scope.items;
    $scope.type = {
        'WALKING': 'A pie',
        'DRIVING': 'En automóvil',
        'TRANSIT': 'Transporte público'
    };

    $scope.$on('$ionicView.enter', function (e) {
        routeService.getRoutes().then(function (result) {
            $scope.items = result;
        });
    });

    $scope.callRoute = function (item) {
        $ionicLoading.show({
            template: '<p>Obteniendo ruta seleccionada...</p><p><ion-spinner icon="android"></ion-spinner></p>'
        });

        routeService.setRoutes(item).then(function () {
            //TODO: pintar markers y tramos
            $state.go("app.map");
        })
    }
});
