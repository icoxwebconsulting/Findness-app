app.controller('FiltersCtrl', function ($scope, $state, $filter, filterSrv) {

    $scope.data = {};
    $scope.data.pickupAfter = 5;
    $scope.model = "";
    $scope.clickedValueModel = "";
    $scope.removedValueModel = "";


    $scope.$on('$ionicView.enter', function (e) {

    });
    
    $scope.getTestItems = function (query) {
        if (query) {
            var data = {
                items: [
                    {id: "1", name: query + "1", view: "view: " + query + "1"},
                    {id: "2", name: query + "2", view: "view: " + query + "2"},
                    {id: "3", name: query + "3", view: "view: " + query + "3"}
                ]
            };
            console.log("antes de retornar", data);
            return data;
        }
        return {items: []};
    };

    $scope.getItems = function (query) {
        if (query) {
            filterSrv.getCnaes(query).then(function (cnaes) {
                console.log("antes de retornar cnaes");
                console.log(typeof  cnaes)
                console.log(cnaes)
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
