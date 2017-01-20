app.controller('OrderRoutesCtrl', function ($rootScope, $scope, $state, $ionicLoading, $ionicPopup, $ionicModal, $ionicListDelegate, routeService, searchService, map, subscriptionSrv, userDatastore) {

    function getRoutes() {
        routeService.getRoutes().then(function (result) {
            $scope.items = result;
        });
    }

    $scope.$on('$ionicView.enter', function (e) {
            getRoutes();
            showCallRoute(JSON.parse(userDatastore.getNewRoute()));
            userDatastore.removeNewRoute();
    });

    function showCallRoute(item){
        var res = subscriptionSrv.validateSubscription('rutas');
        if (res == true){
        }else{
            $ionicLoading.show({
                template: '<p>Obteniendo ruta seleccionada...</p><p><ion-spinner icon="android"></ion-spinner></p>'
            });

            //borro las rutas
            map.resetMap().then(function () {
                routeService.getRouteDetail(item).then(function (detail) {
                    var items = {};
                    for (var i = 0; i < detail.points.length; i++) {
                        items[detail.points[i].id] = detail.points[i];
                    }
                    var lat = detail.points[0].latitude;
                    var lng = detail.points[0].longitude;
                    var length = detail.points.length;

                    searchService.setResultSearch({
                        ElementosDevueltos: length, //contiene el número de elementos que retorna la consulta para dicha pagina
                        Pagina: 1,
                        TotalElementosNoConsultados: 0,		//es la cantidad de elementos que no has pagado
                        TotalElementos: length,	//nro de todos los elementos pagados y sin pagar
                        ElementosDevueltosNoConsultados: 0,	//son los elementos devueltos en dicha pagina que no habias pagado antes
                        items: items
                    });

                    $ionicLoading.hide();
                    $state.go('app.map');
                    setTimeout(function () {
                        map.moveCamera(lat, lng, 9);
                    }, 1500);
                }).catch(function () {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: "Findness",
                        template: 'Ocurrió un error en la búsqueda, intente más tarde.'
                    });
                    $state.go('app.map');
                });
            });
        }
    }

});
