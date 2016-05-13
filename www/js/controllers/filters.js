app.controller('FiltersCtrl', function ($scope, $state, $filter, filterSrv) {

    $scope.data = {};
    $scope.data.pickupAfter = 5;
    $scope.model = "";
    $scope.clickedValueModel = "";
    $scope.removedValueModel = "";
    $scope.choice;


    $scope.$on('$ionicView.leave', function (e) {
        filterSrv.setSelectedFilter($scope.choice);
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
