app.controller('MapCtrl', function ($scope, $rootScope, $state, $ionicPlatform, $ionicPopup, $ionicLoading, $ionicHistory, map, cart, searchService, routeService, subscriptionSrv) {

    subscriptionSrv.requestSubscription();
    subscriptionSrv.detailSubscription('búsquedas');

    $scope.showRoute = false; //controla la visualización de todos los botones
    $scope.routeMode = false; //modo de crear ruta
    $scope.viewRoute = false; //modo de visualizar ruta
    $scope.formRoute = {
        error: false,
        availableOptions: [
            {id: 'WALKING', name: 'A pie'},
            {id: 'DRIVING', name: 'En automóvil'},
            {id: 'TRANSIT', name: 'Transporte público'}
        ],
        selectedOption: {id: 'DRIVING', name: 'En automóvil'}
    };

    var doCustomBack = function (event) {
        event.preventDefault();
        event.stopPropagation();
        $ionicPopup.confirm({
            title: 'Findness',
            template: '¿Desea salir de la aplicación?',
            cancelText: 'Cancelar',
            okText: 'Aceptar'
        }).then(function (res) {
            if (res) {
                navigator.app.exitApp();
            }
        })
    };

    $scope.$on('$ionicView.enter', function (e) {
        if ($rootScope.previousState != 'app.list') {
            $scope.deregisterHardBack = $ionicPlatform.registerBackButtonAction(
                doCustomBack, 101
            );
            $scope.$emit('menu:drag', false);
            $ionicHistory.clearHistory();
            if (map.getMap()) {
                map.resize();
            }
            if (map.getShowPopup()) {
                showPopUp();
            }
            var modes = routeService.getModes();
            $scope.routeMode = modes.routeMode;
            $scope.viewRoute = modes.viewRoute;
            $scope.showRoute = searchService.withResults();
            //El controlador se encarga de mostrar los resultados si existen cada vez que se entra
            if ($scope.showRoute) {
                var query = searchService.getLastQuery();
                if (query) {
                    query = JSON.parse(query);
                }
                proccessMarkers(query);
            } else {
                //centra el mapa en españa
                if (map.getMap()) {
                    map.moveCamera(39.9997938, -3.1926017, 6);
                }
            }
            console.log(modes, searchService.withResults());
        }
    });

    $scope.$on('$ionicView.beforeLeave', function (e) {
        //resetear los estados, sólo cuando no va a ver el listado.
        if ($state.current.name != 'app.list') {
            map.deleteRouteLines().then(function () {
                routeService.resetRoutes();
                $scope.showRoute = false; //controla la visualización de todos los botones
                $scope.routeMode = false; //modo de crear ruta
                $scope.viewRoute = false; //modo de visualizar ruta
            });
            $scope.deregisterHardBack();
        }
    });

    $rootScope.$on('processMarkers', function (e, query) {
        proccessMarkers(query.lastQuery);
    });

    function proccessMarkers(query) {
        var showMyLocation = false;
        console.log("pasada por processMarkers");
        map.resize();
        var result = searchService.getResultSearch();
        map.processMakers(result.items, $scope.viewRoute);//2d parameter to use numeric icons
        if (!query || query.geoLocations == null) {
            for (var first in result.items) break;
            lat = result.items[first].latitude;
            lon = result.items[first].longitude;
        } else {
            showMyLocation = true;
            var lat = query.geoLocations.latitude;
            var lon = query.geoLocations.longitude;
        }
        setTimeout(function () {

            if (showMyLocation) {
                var position = new google.maps.LatLng(lat, lon);
                map.showMyLocation(position);
            }
            map.moveCamera(lat, lon, 9);
        }, 1500);
        $scope.showRoute = true;
        $scope.routeMode = false;
    }

    function showPopUp() {
        var query = searchService.getLastQuery();
        if (query) {
            query = JSON.parse(query);
        }
        map.clear();
        map.setShowPopup(false);
        //proccessMarkers(query);
        var myPopup = $ionicPopup.show({
            template: '<div>Existen ' + searchService.getNonConsultedElements() + ' resultados que puede adquirir.</div>',
            title: 'Findness',
            subTitle: 'Resultados',
            scope: $scope,
            buttons: [
                {
                    text: 'Comprar',
                    type: 'button-positive',
                    onTap: function (e) {
                        //ir al carrito
                        cart.setTotalCompanies(searchService.getNonConsultedElements());
                        $state.go("app.cart");
                        return true;
                    }
                },
                {
                    text: 'Ver anteriores',
                    type: 'button-positive',
                    onTap: function (e) {
                        myPopup.close();
                        return true;
                    }
                }
            ]
        });
    }

    $ionicPlatform.ready(function () {
        var div = document.getElementById("map_canvas");
        if (div) {
            const SPAIN = new google.maps.LatLng(39.9997938, -3.1926017);
            map.init(div, SPAIN, 6);
        }
    });

    $scope.chooseFilter = function () {
        $state.go("app.filter");
    };

    $scope.closeModal = function () {
        $scope.modal.hide()
    };

    $scope.createRoute = function () {
        $scope.formRoute.name = '';
        var routePopup = $ionicPopup.show({
            templateUrl: 'templates/createRoute-popup.html',
            title: 'Findness',
            subTitle: 'Crear ruta',
            scope: $scope,
            buttons: [
                {
                    text: 'Aceptar',
                    type: 'button-positive',
                    onTap: function (e) {
                        if ($scope.formRoute.hasOwnProperty("name") && $scope.formRoute.name.trim() != "") {
                            $scope.routeMode = true;
                            $scope.formRoute.error = false;
                            map.deleteRouteLines().then(function () {
                                routeService.initRoute($scope.formRoute.name.trim(), $scope.formRoute.selectedOption.id);
                            });
                        } else {
                            $scope.formRoute.error = true;
                            e.preventDefault();
                        }
                    }
                },
                {
                    text: 'Cancelar',
                    type: 'button-positive',
                    onTap: function (e) {
                        routePopup.close();
                        return true;
                    }
                }
            ]
        });
    };

    $scope.finishRoute = function () {
        $ionicLoading.show({
            template: '<p>Guardando la ruta...</p><p><ion-spinner icon="android"></ion-spinner></p>'
        });
        routeService.finishRoute().then(function () {
            $scope.routeMode = false;
            $scope.viewRoute = true;
            $ionicLoading.hide();
            $scope.showRouteInfo();
        }).catch(function () {
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: "Ocurrió un error al guardar la ruta, intente nuevamente."
            });
        });
    };

    $scope.finishEditRoute = function () {
        $ionicLoading.show({
            template: '<p>Guardando la ruta...</p><p><ion-spinner icon="android"></ion-spinner></p>'
        });
        routeService.finishEditRoute().then(function () {
            $scope.routeMode = false;
            $ionicPopup.alert({
                title: "Findness",
                template: "Se han guardado los cambios en la ruta correctamente."
            });
            $ionicLoading.hide();
        }).catch(function (e) {
            $ionicLoading.hide();
            var text = "Ocurrió un error al guardar la ruta, intente nuevamente.";
            if (e == "noEdit") {
                text = "No hay cambios en la ruta para guardar."
            }
            $ionicPopup.alert({
                title: "Findness",
                template: text
            });
        });
    };

    $scope.showRouteInfo = function () {
        map.infoRoute();
    }

}).filter('capitalize', function () {
    return function (input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});
