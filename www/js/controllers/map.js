app.controller('MapCtrl', function ($scope, $rootScope, $state, $ionicPlatform, $ionicPopup, $ionicLoading, map, searchService, routeService) {

    $scope.showPopUp = false;
    $scope.showRoute = false;
    $scope.routeMode = false;
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

    $scope.$on('$ionicView.enter', function (e) {
        // if (window.localStorage.getItem('firstTime')) {
        //     window.localStorage.removeItem('firstTime');
        //     $state.go('app.filter');
        //     return;
        // }
        if (map.getMap()) {
            map.resize();
        }
        if ($scope.showPopUp) {
            $scope.showPopUp = false;
            showPopUp();
        }
    });

    $rootScope.$on('showResults', function (e, data) {
        $scope.data = data;
        if (data.showPopUp) {
            $scope.showPopUp = true;
        } else {
            proccessMarkers(data.lastQuery);
        }
    });

    $rootScope.$on('processMarkers', function (e, query) {
        proccessMarkers(query.lastQuery);
    });

    $rootScope.$on('viewRouteMode', function (e, query) {
        $scope.showRoute = true;
        $scope.viewRoute = true;
    });

    function proccessMarkers(query) {
        map.resize();
        var result = searchService.getResultSearch();
        map.processMakers(result.items);
        if (query) {
            if (query.geoLocations == null) {
                for (var first in result.items) break;
                lat = result.items[first].latitude;
                lon = result.items[first].longitude;
            } else {
                var lat = query.geoLocations.latitude;
                var lon = query.geoLocations.longitude;
            }
            map.moveCamera(lat, lon, 7);
        }
        $scope.showRoute = true;
    }

    function showPopUp() {
        var query = searchService.getLastQuery();
        if (query) {
            query = JSON.parse(query);
        }
        map.clear();
        proccessMarkers(query);
        var myPopup = $ionicPopup.show({
            template: '<div>Existen {{data.toBuy}} resultados que puede adquirir.</div>',
            title: 'Findness',
            subTitle: 'Resultados',
            scope: $scope,
            buttons: [
                {
                    text: 'Comprar',
                    type: 'button-positive',
                    onTap: function (e) {
                        //ir al carrito
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
        delete $scope.formRoute.name;
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
                            routeService.initRoute($scope.formRoute.name.trim(), $scope.formRoute.selectedOption.id);
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
            $ionicLoading.hide();
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
            $ionicLoading.hide();
        }).catch(function (e) {
            $ionicLoading.hide();
            var title = "Ocurrió un error al guardar la ruta, intente nuevamente.";
            if (e == "noEdit") {
                title = "No hay cambios en la ruta para guardar."
            }
            $ionicPopup.alert({
                title: title
            });
        });
    }

});
