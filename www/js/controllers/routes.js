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

        //TODO: agrego data dummy para los datos de la empresa mientras el API está lista
        for (var j in item.points) {
            item.points[j].socialReason = "Dummy";
            item.points[j].socialObject = "Data Dummy";
        }
        //TODO: por eliminar

        routeService.setRoutes(item).then(function () {
            //TODO: pintar markers y tramos
        map.processMakers(item.points);
            $ionicLoading.hide();
            $state.go("app.map");
        })
    }
});
