app.controller('ListCtrl', function ($scope, $rootScope, $state, searchService) {

    $scope.$emit('menu:drag', false);
 
    $scope.list;

    $scope.$on('$ionicView.enter', function (e) {
        var list = searchService.getResultSearch();
        if (typeof  list == "object" && list.hasOwnProperty("items")) {
            $scope.list = list.items;
        }
    });

    $scope.showDetail = function (id) {
        console.log(id);
    }
});
