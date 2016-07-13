app.controller('ListCtrl', function ($scope, $rootScope, $state, searchService) {

    $scope.list;

    $scope.$on('$ionicView.enter', function (e) {
        $scope.list = searchService.getResultSearch().items;
    });

    $scope.showDetail = function (id) {
        console.log(id);
    }
});
