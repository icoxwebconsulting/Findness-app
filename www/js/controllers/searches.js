app.controller('SearchesCtrl', function ($scope, searchesService) {

    $scope.items;

    $scope.$on('$ionicView.enter', function (e) {
        searchesService.getSearches().then(function (result) {
            console.log("los result", result);
            $scope.items = result.searches;
        })
    });

    $scope.callSearch = function (search) {
        //TODO: armado del query y ejecución de la búsqueda para visualizar en el mapa
        console.log(search);
    }

});
