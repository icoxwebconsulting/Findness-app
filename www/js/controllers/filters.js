app.controller('FiltersCtrl', function ($scope, $q, $state, $filter, searchService, $ionicPopup) {

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
    $scope.options = {
        useLocation: true
    };
    $scope.selectedCNAE = [];
    $scope.selectedState = [];
    $scope.selectedCity = [];
    $scope.selectedZipCode = [];


    $scope.$on('$ionicView.leave', function (e) {
        //searchService.setSelectedFilter(filter);
    });

    $scope.getItems = function (query, type) {
        if (query && (query.length > 2 || (query[0] == '0' && query.length == 2) )) {
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
        } else if (type == 'cities') {
            //searchService.setSelectedCnaes = $scope.stateModel;
            $scope.clickedCityModel = callback;
        } else if (type == 'zipcodes') {
            $scope.clickedZipCodeModel = callback;
            //searchService.setSelectedCnaes = $scope.stateModel;
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
        navigator.geolocation.getCurrentPosition(function (position) {
            //position.coords.latitude, position.coords.longitude
            console.log(position);
            deferred.resolve(position);
        }, function (e) {
            console.log(e);
            deferred.reject();
        });
        return deferred.promise;
    }

    $scope.search = function () {

        var options = {
            page: 1,
            cnaes: [],
            states: null,
            cities: null,
            postalCodes: null,
            geoLocations: null,
            nonViewedCompanies: false
        };
        console.log($scope.selectedCNAE);
        if ($scope.selectedCNAE.length == 0) {
            $ionicPopup.alert({
                title: "Debe seleccionar por lo menos un CNAE para realizar la búsqueda."
            });
            return;
        }

        for (var i = 0; i < $scope.selectedCNAE.length; i++) {
            options.cnaes.push($scope.selectedCNAE[i].id);
        }

        if ($scope.options.useLocation) {
            getPosition().then(function (position) {
                options.geoLocations = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    radio: $scope.data.pickupAfter
                };
                searchService.searchQualitas(options).then(function (response) {
                    console.log("resultados con geoloc", response);
                });
            }).catch(function () {
                $ionicPopup.alert({
                    title: "No se pudo obtener su localización."
                });
            });
        } else {
            //recoger datos de ubicación
            if ($scope.selectedState.length == 0) {
                if ($scope.selectedZipCode.length == 0) {
                    $ionicPopup.alert({
                        title: "Si no usa su localización debe seleccionar una Provincia, ciudad o Código postal."
                    });
                    return;
                } else {
                    // (3)consulta con sólo el código postal
                    options.postalCodes = [];
                    for (var i = 0; i < $scope.selectedZipCode.length; i++) {
                        options.postalCodes.push($scope.selectedZipCode[i].id);
                    }
                }
            } else {
                // (1)consulta con sólo la provincial
                options.states = [];
                options.states.push($scope.selectedState[0].id);
                if ($scope.selectedCity.length != 0) {
                    // (2)consulta con la provincial y la ciudad
                    options.cities = [];
                    options.cities.push({
                        state: $scope.selectedState[0].id,
                        cities: $scope.selectedCity[0].id
                    });
                }
            }
            console.log(options);
            searchService.searchQualitas(options).then(function (response) {
                console.log("resultados sin geoloc", response);
            });
        }
    }

});
