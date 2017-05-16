app.controller('FiltersCtrl', function ($scope, $rootScope, $q, $state, $filter, searchService, $ionicPopup,
                                        $ionicLoading, $http, cart, map, routeService, subscriptionSrv, userDatastore) {

    $scope.init = function () {
        $scope.options = {
            useLocation: false
        };
        $scope.getLastFilter();
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
    $scope.selectedSector = [];
    $scope.selectedState = {};
    $scope.selectedCity = {};
    $scope.selectedZipCode = [];
    $scope.cnaeValid = "";
    $scope.categoriesValid = true;
    $scope.selectedBilling = [];
    $scope.selectedEmployees = [];
    $scope.lastFilter = {};
    $scope.hideListCnaes = false;
    $scope.hideListState = false;
    $scope.hideListCity = true;
    $scope.hideListZipcode = false;


//    $scope.states = [];

    $scope.$on('$ionicView.enter', function (e) {
        $scope.init();
    });

    $http.get('js/sectors.json').success(function (data) {
        data.unshift({"id": '', "name": "Sectores de activad"});
        $scope.cnaesCategories = data;
    });

    $scope.group = [{name: 1, items: 1, show: false}];
    $scope.toggleGroup = function(group) {
        group.show = !group.show;
    };
    $scope.isGroupShow = function(group) {
        return group.show;
    };

    $scope.hasChanged = function (id, name, group) {
        $scope.categoriesValid = true;
        $scope.selectedSector = [];
        if (id != ''){
            objectCnae = {id: id, name: id + ' - ' + name, view: id + ' - ' + name};
            $scope.selectedSector.push(objectCnae);
        }
        $scope.toggleGroup(group);
    };


    $scope.billing = [{name: 1, items: 1, show: false}];
    $scope.toggleBilling = function(billing) {
        billing.show = !billing.show;
    };
    $scope.isBillingShow = function(billing) {
        return billing.show;
    };

    $scope.listBilling = [
        {"id": '',"name": "Facturación"},
        {"id": 1,"name": "Menor de 500.000 €", "min": "", "max": "500000"},
        {"id": 2,"name": "Entre 500.000 y 1.500.000", "min": "500000", "max": "1500000"},
        {"id": 3,"name": "Entre  1.500.000 y 5.000.000", "min": "1500000", "max": "5000000"},
        {"id": 4,"name": "Más de 5.000.000", "min": "5000000", "max": ""}
    ];

    $scope.billingChanged = function (id, group) {
        $scope.selectedBilling = [];
        item = $scope.listBilling;
        if (id != ''){
            for (i = 0; i < item.length; i++){
                if ( id == item[i].id){
                    objectBilling = {id: item[i].id, name: item[i].name, max: item[i].max, min: item[i].min};
                    $scope.selectedBilling.push(objectBilling);
                }
            }
        }
        $scope.toggleBilling(group);
    };

    $scope.listEmployees = [
        {"id": '',"name": "Empleados"},
        {"id": 1,"name": "Menos de 10", "min": "", "max": "10"},
        {"id": 2,"name": "Entre 10 y 100", "min": "10", "max": "100"},
        {"id": 3,"name": "Entre 100 y 500", "min": "100", "max": "500"},
        {"id": 4,"name": "Más de 500", "min": "500", "max": ""}
    ];

    $scope.employees = [{name: 1, items: 1, show: false}];
    $scope.toggleEmployees = function(employees) {
        employees.show = !employees.show;
    };
    $scope.isEmployeesShow = function(employees) {
        return employees.show;
    };

    $scope.employeesChanged = function (id, name, group) {
        $scope.selectedEmployees = [];
        item = $scope.listEmployees;
        if (id != ''){
            for (i = 0; i < item.length; i++){
                if ( id == item[i].id){
                    objectEmployees = {id: item[i].id, name: item[i].name, max: item[i].max, min: item[i].min};
                    $scope.selectedEmployees.push(objectEmployees);
                }
            }
        }
        $scope.toggleEmployees(group);
    };

    $scope.cancel = function () {
        $scope.clickedValueModel = "";
        $scope.removedValueModel = "";
        $scope.clickedStateModel = "";
        $scope.removedStateModel = "";
        $scope.clickedCityModel = "";
        $scope.removedCityModel = "";
        $scope.clickedZipCodeModel = "";
        $scope.removedZipCodeModel = "";
        $scope.selectedCNAE = [];
        $scope.selectedState = {};
        $scope.selectedCity = {};
        $scope.selectedZipCode = [];
        $scope.cnaeValid = "";
        $scope.categoriesValid = true;
        $scope.selectedBilling = [];
        $scope.selectedEmployees = [];
    };


    /*$http.get('js/cnaes.json').success(function (data) {
        $scope.cnaesItems = data.items;
    });*/

    $scope.listCnaes = function (query) {
        if (query && (query.length > 1 || (query[0] == '0' && query.length == 2) )) {
            query = searchService.omitirAcentos(query);
            query = query.toLowerCase();

            $scope.hideListCnaes = true;

            return searchService.getCnaes(query).then(function (cnaes) {
                return $scope.cnaesItems = cnaes.items;
            });
        }
    };

    $scope.searchState = '';
    $scope.searchCity = '';
    $scope.searchZipcodes = '';
    $scope.searchCnaes = '';

    $scope.clickCNAE = function (id, name, view) {
        var index = $scope.selectedCNAE.map(function (element) {return element.id;}).indexOf(id);

        if ($scope.selectedCNAE.length > 0 && $scope.categoriesValid == true) {
            $scope.selectedCNAE = [];
            $scope.categoriesValid = false;
            objectCnae = {id: id, name: name, view: view};
            $scope.hideListCnaes = false;
            $scope.selectedCNAE.push(objectCnae);
        }
        else {
            if ( index == -1){
                $scope.hideListCnaes = false;
                $scope.categoriesValid = false;
                objectCnae = {id: id, name: name, view: view};
                $scope.selectedCNAE.push(objectCnae);
            }
        }
    };


    $scope.clickState = function (created, id, name, updated) {
        $scope.hideListState = false;
        $scope.selectedState = {};
        objectState = {created: created, id: id, name: name.toUpperCase(), updated: updated};
        $scope.selectedState = objectState;
    };

    $scope.deleteSelect = function (arraySelected,id) {
        if(arraySelected == 'selectedCNAE'){
            var index = $scope.selectedCNAE.map(function (element) {return element.id;}).indexOf(id);
            $scope.selectedCNAE.splice(index, 1);
            if ($scope.selectedCNAE.length == 0){
                $scope.categoriesValid = true;
            }
        }else if(arraySelected == 'selectedState'){
            $scope.selectedState = {};
            $scope.selectedCity = {};
        }else if(arraySelected == 'selectedCity'){
            $scope.selectedCity = {};
        }else if (arraySelected == 'selectedZipCode'){
            $scope.selectedZipCode = [];
        }

    };

    $scope.listStates = function (query) {
        if (query && (query.length > 1 || (query[0] == '0' && query.length == 2) )) {
            query = searchService.omitirAcentos(query);
            query = query.toLowerCase();
            $scope.hideListState = true;
            return searchService.getStates(query).then(function (states) {
                return $scope.states = states.items;
            });
        }
    };


    $scope.listCities = function (query) {
        if (query && (query.length > 1 || (query[0] == '0' && query.length == 2) )) {
            query = searchService.omitirAcentos(query);
            query = query.toLowerCase();
            $scope.hideListCity = true;
            return searchService.getCities(query, $scope.selectedState).then(function (cities) {
                return $scope.cities = cities.items;
            });
        }
    };


    $scope.clickCity = function (created, id, name, updated) {
        $scope.selectedCity = {};
        if ($scope.selectedState.id){
            objectCity = {created: created, id: id, name: name.toUpperCase(), updated: updated,
                state: {
                    created: $scope.selectedState.created,
                    id: $scope.selectedState.id,
                    name: $scope.selectedState.name,
                    updated: $scope.selectedState.updated
                }};
            $scope.hideListCity = false;
            $scope.selectedCity = objectCity;
        }
    };

    $scope.listZipcodes = function (query) {
        if (query.length > 3) {
            $scope.hideListZipcode = true;
            return searchService.getZipcodes(query).then(function (zipcodes) {
                return $scope.zipcodes = zipcodes.items;
            });
        } else {
            return {items: []};
        }
    };

    $scope.clickZipcode = function (zip) {
        $scope.hideListZipcode = false;
        $scope.selectedZipCode = [];
        $scope.selectedZipCode.push(zip)
    };

    // Set LastFilter
    $scope.setLastFilter = function () {
        if ($scope.selectedCNAE.length > 0){
            objectCnaes = {'cnaes': $scope.selectedCNAE};
            $scope.lastFilter['cnaes'] = $scope.selectedCNAE;
        }

        if ($scope.selectedState.id){
            $scope.lastFilter['state'] = $scope.selectedState;
        }

        if ($scope.selectedCity.id){
            $scope.lastFilter['city'] = $scope.selectedCity;
        }

        if ($scope.selectedZipCode.length > 0){
            $scope.lastFilter['zipcode'] = $scope.selectedZipCode[0];
        }

        if ($scope.selectedBilling.length > 0){
            $scope.lastFilter['billing'] = $scope.selectedBilling[0];
        }

        if ($scope.selectedEmployees.length > 0){
            $scope.lastFilter['employees'] = $scope.selectedEmployees[0];
        }

        if ($scope.selectedSector.length > 0){
            $scope.lastFilter['sector'] = $scope.selectedSector;
        }

        userDatastore.setLastFilter($scope.lastFilter);
        console.log('$scope.lastFilterE', $scope.lastFilter);
    };

    // Get LastFilter
    $scope.getLastFilter = function () {
        var lastFilter =  userDatastore.getLastFilter();

        if (userDatastore.getLastFilter()){
            if (lastFilter.cnaes){
                if (lastFilter.cnaes.length > 0){
                    $scope.categoriesValid = false;
                    for (i = 0; i < lastFilter.cnaes.length; i++){
                        $scope.selectedCNAE.push(lastFilter.cnaes[i]);
                    }
                }
            }
            if (lastFilter.state){
                $scope.selectedState = lastFilter.state;
            }
            if (lastFilter.city){
                $scope.selectedCity = lastFilter.city;
            }
            if (lastFilter.zipcode){
                $scope.selectedZipCode.push(lastFilter.zipcode);
            }
            if (lastFilter.billing){
                $scope.selectedBilling.push(lastFilter.billing);
            }
            if (lastFilter.employees){
                $scope.selectedEmployees.push(lastFilter.employees);
            }
            if (lastFilter.sector){
                $scope.selectedSector = lastFilter.sector;
            }
        }

        console.log('lastFilter', lastFilter);

    };

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
                if (query.length > 3) {
                    return searchService.getZipcodes(query).then(function (zipcodes) {
                        return zipcodes;
                    });
                } else {
                    return {items: []};
                }
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
        var validate = subscriptionSrv.validateSubscription('');

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
                if (validate == true) {
                    $ionicPopup.alert({
                        title: 'HAZTE PRO',
                        template: '<div>Se han encontrado ' + searchService.getNonConsultedElements() + ' empresas.</div>',
                        okText: 'HAZTE PRO',
                    }).then(function (res) {
                        if (res) {
                            $state.go('app.pricing');
                        }
                    });
                    map.setShowPopup(false);
                }
                else {
                    //caso 4 mostrar mapa con popup
                    map.setShowPopup(true);
                }
            }
            routeService.setModes(false, false);
            map.deleteRouteLines().then(function () {
                $state.go("app.map");
            });
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
            nonViewedCompanies: 0,
            billing_min: null,
            billing_max: null,
            employees_min: [],
            employees_max: [],
            sector: null
        };


        if ($scope.selectedCNAE.length == 0 && $scope.selectedSector.length == 0) {
            if ($scope.selectedCNAE.length == 0 ){
                $ionicPopup.alert({
                    title: "Debe seleccionar por lo menos un CNAE o un Sector para realizar la búsqueda."
                });
            }
            return;
        }

        if ($scope.selectedBilling.length > 0){
            options.billing_min = $scope.selectedBilling[0].min;
            options.billing_max = $scope.selectedBilling[0].max;
        }

        if ($scope.selectedEmployees.length > 0){
            options.employees_min = $scope.selectedEmployees[0].min;
            options.employees_max = $scope.selectedEmployees[0].max;
        }

        if ($scope.selectedSector.length > 0){
            options.sector = $scope.selectedSector[0].id;
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
                $ionicPopup.alert({
                    title: 'Findness - Ubicación',
                    template: '<p>Ocurrió un error al obtener su localización.</p>',
                });
            });
        } else {
            //recoger datos de ubicación
            console.info('recoger datos de ubicación',$scope.selectedState)
            if (!$scope.selectedState.id) {
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
                    options.postalCodes.push($scope.selectedZipCode[0]);
                    options.postalCodes = JSON.stringify(options.postalCodes);
                }
            } else {
                // (1)consulta con sólo la provincial
                delete options.postalCodes;
                options.states = [];
                options.states.push($scope.selectedState.id);
                options.states = JSON.stringify(options.states);
                if ($scope.selectedCity.id) {
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

            // Set Last Filter
            $scope.setLastFilter();

            console.log('options', options);


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
    };

    $scope.checkLocation = function () {
        $scope.selectedState = {};
        $scope.selectedCity = {};
        $scope.selectedZipCode = [];
        if ($scope.options.useLocation) {
            map.checkLocation(function () {
            }, function () {
                $scope.options.useLocation = false;
            })
        }
    }

});
