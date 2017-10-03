app.controller('RoutesCtrl', function ($rootScope, $scope, $state, $ionicLoading, $ionicPopup, $ionicModal, $ionicListDelegate, routeService, searchService, map, subscriptionSrv, userDatastore) {

    $scope.items;
    $scope.type = {
        'WALKING': 'A pie',
        'DRIVING': 'En automóvil',
        'TRANSIT': 'Transporte público'
    };

    function getRoutes() {
        routeService.getRoutes().then(function (result) {
            $scope.items = result;
        });
    }

    $scope.$on('$ionicView.enter', function (e) {
//        var newRoute = JSON.parse(userDatastore.getNewRoute());
        /*if (userDatastore.getNewRoute()){
            getRoutes();
            showCallRoute(JSON.parse(userDatastore.getNewRoute()));
            userDatastore.removeNewRoute();
        }else{
        }*/
        getRoutes();

    });

    $scope.callRoute = function (item) {
        console.info('call route');
        var res = subscriptionSrv.validateSubscription('rutas');

     /*   if (res == true){

        }else { */
            $ionicLoading.show({
                template: '<p>Obteniendo ruta seleccionada...</p><p><ion-spinner icon="android"></ion-spinner></p>'
            });

            map.resetMap().then(function () {
                routeService.getRouteDetailOrder(item).then(function (detail) {
                    console.info('detail', item);
                    showCallRoute(item);
                })
            })

      //  }

    };

    function showCallRoute(item){
        /*var res = subscriptionSrv.validateSubscription('rutas');
        if (res == true){
        }else{ */
            console.info('show call');
            $ionicLoading.show({
                template: '<p>Obteniendo ruta seleccionada...</p><p><ion-spinner icon="android"></ion-spinner></p>'
            });

            //borro las rutas
            map.resetMap().then(function () {
                console.info('reseteando');
                routeService.getRouteDetail(item).then(function (detail) {
                    console.info('getRouteDetail');

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
                        map.moveCamera(lat, lng, 14);
                    }, 1500);
                }).catch(function () {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: "Findness",
                        template: 'Ocurrió un error en la búsqueda, intente más tarde.'
                    });
                });
            });
      //  }
    }

    $scope.deleteRoute = function (item, index) {
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
    };

    $scope.changeNameRoute = null;
    $scope.showChangeName = function (item) {
        $ionicModal.fromTemplateUrl('templates/routes-change-name.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.changeNameRoute = item;
            $scope.modal = modal;
            $scope.modal.show();
        });

        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });

        // Execute action on hide modal
        $scope.$on('modal.hidden', function () {
            $scope.changeNameRoute = null;
        });

        // Execute action on remove modal
        $scope.$on('modal.removed', function () {
            $scope.changeNameRoute = null;
        });
    };

    $scope.changeName = function () {
        $ionicLoading.show();
        routeService.updateName($scope.changeNameRoute.id, $scope.changeNameRoute.name)
            .then(function (response) {
                if (!response.updated) {
                    $scope.items = null;
                    getRoutes();
                }
                $ionicLoading.hide();
                $scope.modal.hide();
                $ionicListDelegate.closeOptionButtons();
            })
            .catch(function () {
                $ionicLoading.hide();
                $scope.modal.hide();
                $ionicListDelegate.closeOptionButtons();
            });
    };

});
