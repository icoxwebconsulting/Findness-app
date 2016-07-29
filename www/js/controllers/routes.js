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
            //TODO: posible código a ser borrado
            var formatted = {};
            for (var i = 0; i < detail.points.length; i++) {
                formatted[detail.points[i].id] = {
                    "id": detail.points[i].id,
                    "socialReason": detail.points[i].social_reason,
                    "socialObject": detail.points[i].social_object,
                    "latitude": detail.points[i].latitude,
                    "longitude": detail.points[i].longitude,
                    "cif": detail.points[i].cif,
                    "address": detail.points[i].address,
                    "phoneNumber": detail.points[i].phone_number
                }
            }
            var lat = detail.points[0].latitude;
            var lng = detail.points[0].longitude;
            detail.points = formatted;
            //borro las rutas
            map.deleteRouteLines();
            routeService.setRoutes(detail).then(function () {
                //seteo los resultados en el servicio de search necesarios para n
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
                map.processMakers(detail.points);
                $state.go("app.map");
                setTimeout(function () {
                    map.moveCamera(lat, lng, 9);
                },1500);
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
