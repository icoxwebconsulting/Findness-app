app.controller('FiltersCtrl', function ($scope, $rootScope, $q, $state, $filter, searchService, $ionicPopup, $ionicLoading, cart, map, routeService) {

    $scope.init = function () {
        $scope.options = {
            useLocation: false
        };
    };

    $scope.data = {};
    $scope.data.pickupAfter = 3;
    $scope.model = "";
    $scope.stateModel = "";
    $scope.cityModel = "";
    $scope.zipCodeModel = "";
    $scope.clickedValueModel = "";
    $scope.removedValueModel = "";
    $scope.clickedStateModel = "";
    $scope.removedStateModel = "";
    $scope.clickedCityModel = "";
    $scope.removedCityModel = "";
    $scope.clickedZipCodeModel = "";
    $scope.removedZipCodeModel = "";
    $scope.selectedCNAE = [];
    $scope.selectedState = [];
    $scope.selectedCity = [];
    $scope.selectedZipCode = [];


    $scope.$on('$ionicView.enter', function (e) {
        $scope.init();
    });

    $scope.getItems = function (query, type) {
        if (query && (query.length > 1 || (query[0] == '0' && query.length == 2) )) {
            query = searchService.omitirAcentos(query);
            query = query.toLowerCase();

            if (type == 'CNAE') {
                return searchService.getCnaes(query).then(function (cnaes) {
                    return cnaes;
                });
            } else if (type == 'states') {
                return searchService.getStates(query).then(function (states) {
                    return states;
                });
            } else if (type == 'cities') {
                return searchService.getCities(query, $scope.clickedStateModel.selectedItems).then(function (cities) {
                    return cities;
                });
            } else if (type == 'zipcodes') {
                return searchService.getZipcodes(query).then(function (zipcodes) {
                    return zipcodes;
                });
            }

        }
        return {items: []};
    };

    $scope.itemsClicked = function (callback, type) {
        if (type == 'CNAE') {
            //searchService.setSelectedCnaes = $scope.model;
            $scope.clickedValueModel = callback;
            $scope.selectedCNAE = $scope.clickedValueModel.selectedItems;
        } else if (type == 'states') {
            //searchService.setSelectedStates = $scope.stateModel;
            $scope.clickedStateModel = callback;
            $scope.selectedState = $scope.clickedStateModel.selectedItems;
        } else if (type == 'cities') {
            //searchService.setSelectedCnaes = $scope.stateModel;
            $scope.clickedCityModel = callback;
            $scope.selectedCity = $scope.clickedCityModel.selectedItems;
        } else if (type == 'zipcodes') {
            $scope.clickedZipCodeModel = callback;
            //searchService.setSelectedCnaes = $scope.stateModel;
            $scope.selectedZipCode = $scope.clickedZipCodeModel.selectedItems;
        }
    };

    $scope.itemsRemoved = function (callback, type) {
        if (type == 'CNAE') {
            $scope.removedValueModel = callback;
            $scope.selectedCNAE = $scope.removedValueModel.selectedItems;
        } else if (type == 'states') {
            $scope.removedStateModel = callback;
            $scope.selectedState = $scope.removedStateModel.selectedItems;
        } else if (type == 'cities') {
            $scope.removedCityModel = callback;
            $scope.selectedCity = $scope.removedCityModel.selectedItems;
        } else if (type == 'zipcodes') {
            $scope.removedZipCodeModel = callback;
            $scope.selectedZipCode = $scope.removedZipCodeModel.selectedItems;
        }
    };

    function getPosition() {
        var deferred = $q.defer();
        $ionicLoading.show({
            template: '<p>Obteniendo geolocalización...</p><p><ion-spinner icon="android"></ion-spinner></p>'
        });
        navigator.geolocation.getCurrentPosition(function (position) {
            //position.coords.latitude, position.coords.longitude
            $ionicLoading.hide();
            console.log(position);
            deferred.resolve(position);
        }, function (e) {
            console.log(e);
            deferred.reject();
        });
        return deferred.promise;
    }

    function processResults(results) {
        /*
         CASOS:
         1- Si el total de resultados es 0 y el total de empresas por comprar es 0: Mostrar no hay resultados
         2- Si el total de resultados es 0 y el total de empresas por comprar es diferente de 0: Ir al carrito
         3- Si el total de resultados es diferente de 0 y el total de empresas por comprar es 0: Mostrar el mapa sin popup
         4- Si el total de resultados es diferente de 0 y el total de empresas por comprar es diferente de 0: Mostrar el mapa con un popup al carrito
         - Cuando se visualicen las búsquedas en el mapa  en la parte superior debe salir un selector para cambiar el modo entre mapa y listado
         */
        if (!results) {
            $ionicPopup.alert({
                title: "Hubo un problema interno.",
                template: 'Si el problema se repite favor contactar al administrador.'
            });
            return;
        }


        if (results.ElementosDevueltos == 0) {
            if (results.TotalElementosNoConsultados == 0) {
                //Caso 1
                $ionicPopup.alert({
                    title: "La búsqueda no obtuvo resultados."
                });
                return;
            } else {
                //Caso 2 ir al carrito
                cart.setTotalCompanies(results.TotalElementosNoConsultados);
                $state.go("app.cart");
            }
        } else {
            if (results.TotalElementosNoConsultados == 0) {
                //caso 3 mostrar mapa sin popup
                map.setShowPopup(false);
            } else {
                //caso 4 mostrar mapa con popup
                map.setShowPopup(true);
            }
            routeService.setModes(false, false);
            $state.go("app.map");
        }
    }

    $scope.search = function () {

        var options = {
            page: 1,
            cnaes: [],
            states: null,
            cities: null,
            postalCodes: null,
            geoLocations: null,
            nonViewedCompanies: 0
        };

        if ($scope.selectedCNAE.length == 0) {
            $ionicPopup.alert({
                title: "Debe seleccionar por lo menos un CNAE para realizar la búsqueda."
            });
            return;
        }

        for (var i = 0; i < $scope.selectedCNAE.length; i++) {
            options.cnaes.push($scope.selectedCNAE[i].id);
        }
        options.cnaes = JSON.stringify(options.cnaes);
        if ($scope.options.useLocation) {
            delete options.states;
            delete options.cities;
            delete options.postalCodes;
            getPosition().then(function (position) {
                options.geoLocations = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    radio: ($scope.data.pickupAfter * 1000)
                };
                $ionicLoading.show({
                    template: '<p>Realizando búsqueda...</p><p><ion-spinner icon="android"></ion-spinner></p>'
                });
                searchService.searchQualitas(options).then(function (response) {
                    $ionicLoading.hide();
                    console.log("resultados con geoloc", response);
                    processResults(response);
                }).catch(function (e) {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Ocurrió un error en la búsqueda',
                        template: e.statusText
                    });
                });
            }).catch(function () {
                $ionicPopup.show({
                    template: '<p style="color:#000;">Para poder usar tu ubicación debes tener activado tu gps.</p>',
                    title: 'Activar GPS',
                    buttons: [
                        {
                            text: '<b>Aceptar</b>',
                            type: 'button-positive'
                        }
                    ]
                });
            });
        } else {
            //recoger datos de ubicación
            if ($scope.selectedState.length == 0) {
                delete options.states;
                if ($scope.selectedZipCode.length == 0) {
                    $ionicPopup.alert({
                        title: "Si no usa su localización debe seleccionar una Provincia, ciudad o Código postal."
                    });
                    return;
                } else {
                    // (3)consulta con sólo el código postal
                    delete options.states;
                    delete options.cities;
                    delete options.geoLocations;
                    options.postalCodes = [];
                    // for (var i = 0; i < $scope.selectedZipCode.length; i++) {
                    //     options.postalCodes.push($scope.selectedZipCode[i]);
                    // }
                    // options.postalCodes = JSON.stringify(options.postalCodes);
                    options.postalCodes.push($scope.selectedZipCode);
                    options.postalCodes = JSON.stringify(options.postalCodes);
                }
            } else {
                // (1)consulta con sólo la provincial
                delete options.postalCodes;
                options.states = [];
                options.states.push($scope.selectedState.id);
                options.states = JSON.stringify(options.states);
                if ($scope.selectedCity.length != 0) {
                    // (2)consulta con la provincial y la ciudad
                    options.cities = {
                        "state": $scope.selectedState.id,
                        "cities": [$scope.selectedCity.id]
                    };
                    options.cities = JSON.stringify(options.cities);
                } else {
                    delete options.cities;
                }
            }
            console.log(options);
            $ionicLoading.show({
                template: '<p>Realizando búsqueda...</p><p><ion-spinner icon="android"></ion-spinner></p>'
            });
            searchService.searchQualitas(options).then(function (response) {
                $ionicLoading.hide();
                console.log("resultados sin geoloc", response);
                processResults(response);
            }).catch(function (e) {
                $ionicLoading.hide();
                console.log("Catch de la busqueda", e);
                $ionicPopup.alert({
                    title: "Findness",
                    template: 'Ocurrió un error en la búsqueda, intente más tarde. ' + e.statusText
                });
            });
        }
    };

    $scope.pickupChange = function (val) {
        if (val) {
            if ($scope.data.pickupAfter < 5) {
                $scope.data.pickupAfter += 1;
            }
        } else {
            if ($scope.data.pickupAfter > 1) {
                $scope.data.pickupAfter -= 1;
            }
        }
    }

});
