app.controller('FiltersCtrl', function ($scope, $state, $filter, filters) {

    $scope.data = {};
    $scope.data.pickupAfter = 5;

    $scope.choice;

    $scope.$on('$ionicView.enter', function (e) {

    });

    $scope.model = "";

    $scope.clickedValueModel = "";
    $scope.removedValueModel = "";


    $scope.getTestItems = function (query) {
        if (query) {
            return {
                items: [
                    {id: "1", name: query + "1", view: "view: " + query + "1"},
                    {id: "2", name: query + "2", view: "view: " + query + "2"},
                    {id: "3", name: query + "3", view: "view: " + query + "3"}]
            };
        }
        return {items: []};
    };

    $scope.getItems = function (query) {
        if (query) {
            filters.getCnaes().then(function (cnaes) {
                console.log("antes de retornar cnaes", cnaes);
                return {items: cnaes};
            });
            //$filter('filter')(cnaes, expression, comparator)
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
