app.controller('FiltersCtrl', function ($scope, $state, $filter, searchService) {

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

    $scope.itemsRemoved = function (callback) {
        if (type == 'CNAE') {
            $scope.removedValueModel = callback;
        } else if (type == 'states') {
            $scope.removedStateModel = callback;
        } else if (type == 'cities') {
            $scope.removedCityModel = callback;
        } else if (type == 'zipcodes') {
            $scope.removedZipCodeModel = callback;
        }
    };

    $scope.search = function () {


        navigator.geolocation.getCurrentPosition(function (position) {
            //position.coords.latitude
            //position.coords.longitude
            console.log(position);
            // searchSrv.searchQualitas().then(function () {
            //
            // })

        }, function () {

        });
    }

});
