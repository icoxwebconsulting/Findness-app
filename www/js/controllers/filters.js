app.controller('FiltersCtrl', function ($scope, $state, $filter, filterSrv) {

    $scope.data = {};
    $scope.data.pickupAfter = 3;
    $scope.model = "";
    $scope.clickedValueModel = "";
    $scope.removedValueModel = "";
    $scope.choice;


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
        console.log("dejando la pagina", filter);
        filterSrv.setSelectedFilter(filter);
    });

    $scope.getItems = function (query) {
        if (query && (query.length > 2 || (query[0] == '0' && query.length == 2) )) {
            query = filterSrv.omitirAcentos(query);
            query = query.toLowerCase();
            return filterSrv.getCnaes(query).then(function (cnaes) {
                return cnaes;
            });
        }
        return {items: []};
    };

    $scope.itemsClicked = function (callback) {
        $scope.clickedValueModel = callback;
        filterSrv.setSelectedCnaes = $scope.model;
    };
    $scope.itemsRemoved = function (callback) {
        $scope.removedValueModel = callback;
        filterSrv.setSelectedCnaes = $scope.model;
    };

});
