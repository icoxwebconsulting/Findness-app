app.controller('RoutesCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, routeService, searchService, map) {

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

        routeService.getRouteDetail(item).then(function (detail) {
            routeService.setRoutes(detail).then(function () {
                //seteo los resultados en el servicio de search necesarios para n
                var length = Object.keys(detail).length;
                searchService.setResultSearch({
                    ElementosDevueltos: lenght, //contiene el número de elementos que retorna la consulta para dicha pagina
                    Pagina: 1,
                    TotalElementosNoConsultados: 0,		//es la cantidad de elementos que no has pagado
                    TotalElementos: lenght,	//nro de todos los elementos pagados y sin pagar
                    ElementosDevueltosNoConsultados: 0,	//son los elementos devueltos en dicha pagina que no habias pagado antes
                    items: detail.points
                });
                map.processMakers(detail.points);
                //TODO: se debe eliminar moveCamera e integrarlo al método de processMarkers del servicio
                for (var first in detail.points) break;
                map.moveCamera(first.position.lat, first.position.lng, 7);
                $ionicLoading.hide();
                $state.go("app.map");
            })
        }).catch(function () {
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: "Findness",
                template: 'Ocurrió un error en la búsqueda, intente más tarde.'
            });
        });
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
                    onTap: function (e) {
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
                {text: 'Cancelar'}
            ]
        });
    }
});
