app.controller('RoutesCtrl', function ($rootScope, $scope, $state, $ionicLoading, $ionicPopup, routeService, searchService, map) {

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
            var kyz = Object.keys(detail.points);
            var lat = detail.points[kyz[0]].latitude;
            var lng = detail.points[kyz[0]].longitude;

            //borro las rutas
            map.deleteRouteLines();
            var length = Object.keys(detail).length;
            searchService.setResultSearch({
                ElementosDevueltos: length, //contiene el número de elementos que retorna la consulta para dicha pagina
                Pagina: 1,
                TotalElementosNoConsultados: 0,		//es la cantidad de elementos que no has pagado
                TotalElementos: length,	//nro de todos los elementos pagados y sin pagar
                ElementosDevueltosNoConsultados: 0,	//son los elementos devueltos en dicha pagina que no habias pagado antes
                items: detail.points
            });

            $ionicLoading.hide();
            $rootScope.$on('processMarkers');
            setTimeout(function () {
                map.moveCamera(lat, lng, 9);
            }, 1500);
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
