app.controller('FiltersCtrl', function ($scope, $state, $filter, filterSrv) {

    $scope.data = {};
    $scope.data.pickupAfter = 5;
    $scope.model = "";
    $scope.clickedValueModel = "";
    $scope.removedValueModel = "";


    $scope.$on('$ionicView.enter', function (e) {

    });

    $scope.getItems = function (query) {
        if (query && (query.length > 2 || (query[0] == '0' && query.length == 2) )) {
            query = query.toLowerCase();
            return filterSrv.getCnaes(query).then(function (cnaes) {
                return cnaes;
            });
        }
        return {items: []};
    };

    $scope.itemsClicked = function (callback) {
        $scope.clickedValueModel = callback;
    };
    $scope.itemsRemoved = function (callback) {
        $scope.removedValueModel = callback;
    };

});
