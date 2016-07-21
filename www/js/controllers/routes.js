app.controller('RoutesCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, routeService, map) {

    $scope.items;
    $scope.type = {
        'WALKING': 'A pie',
        'DRIVING': 'En automóvil',
        'TRANSIT': 'Transporte público'
    };
    $scope.shouldShowDelete = false;

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
    };

    $scope.deleteRoute = function (index, item) {
        $ionicPopup.show({
            template: '<p>Seguro que desea borrar la ruta: ' + item.name + '</p>',
            title: 'Findness',
            subTitle: 'Confirmación',
            scope: $scope,
            buttons: [
                {
                    text: '<b>Aceptar</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        routeService.deleteRoute(item.id).then(function () {
                            $scope.items.splice(index, 1)
                        }).catch(function () {
                            $ionicPopup.alert({
                                title: 'Findness',
                                template: 'Ocurrió un problema al borrar la ruta, intente más tarde.'
                            });
                        });
                    }
                },
                { text: 'Cancelar' }
            ]
        });
    }
});
