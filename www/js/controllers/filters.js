app.controller('FiltersCtrl', function ($scope, $state, $filter, filterSrv) {
//TODO: renombrar a search?
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
    $scope.choice;
    $scope.options = {
        useLocation: true
    };


    $scope.$on('$ionicView.leave', function (e) {
        var filter = {
            type: 2,
            name: "Radio de 5km",
            options: {
                km: 5
            }
        };
        if ($scope.choice == 'A') {
            filter = {
                type: 1,
                name: "",
                options: {}
            };
        } else if ($scope.choice == 'B') {
            filter = {
                type: 2,
                name: "",
                options: {}
            };
        } else if ($scope.choice == 'C') {
            filter = {
                type: 3,
                name: "",
                options: {}
            };
        } else if ($scope.choice == 'D') {
            filter = {
                type: 4,
                name: "",
                options: {}
            };
        }
        filterSrv.setSelectedFilter(filter);
    });

    $scope.getItems = function (query, type) {
        if (query && (query.length > 2 || (query[0] == '0' && query.length == 2) )) {
            query = filterSrv.omitirAcentos(query);
            query = query.toLowerCase();

            if (tpye == 'CNAE') {
                return filterSrv.getCnaes(query).then(function (cnaes) {
                    return cnaes;
                });
            } else if (type == 'states') {
                return filterSrv.getStates(query).then(function (states) {
                    return states;
                });
            } else if (type == 'cities') {
                return filterSrv.getCities(query).then(function (cities) {
                    return cities;
                });
            } else if (type == 'zipcodes') {
                return filterSrv.getZipcodes(query).then(function (zipcodes) {
                    return zipcodes;
                });
            }

        }
        return {items: []};
    };

    $scope.itemsClicked = function (callback, type) {
        $scope.clickedValueModel = callback;
        if (tpye == 'CNAE') {
            filterSrv.setSelectedCnaes = $scope.model;
        } else if (type == 'states') {
            //filterSrv.setSelectedStates = $scope.stateModel;
        } else if (type == 'cities') {
            //filterSrv.setSelectedCnaes = $scope.stateModel;
        } else if (type == 'zipcodes') {
            //filterSrv.setSelectedCnaes = $scope.stateModel;
        }
    };
    
    $scope.itemsRemoved = function (callback) {
        $scope.removedValueModel = callback;
        if (tpye == 'CNAE') {
            filterSrv.setSelectedCnaes = $scope.model;
        } else if (type == 'states') {
            //filterSrv.setSelectedStates = $scope.stateModel;
        } else if (type == 'cities') {
            //filterSrv.setSelectedCnaes = $scope.stateModel;
        } else if (type == 'zipcodes') {
            //filterSrv.setSelectedCnaes = $scope.stateModel;
        }
    };

    $scope.search = function () {

    }

});
