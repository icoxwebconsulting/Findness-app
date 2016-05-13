app.controller('FiltersCtrl', function ($scope, $state, $filter, filterSrv) {

    $scope.model = "";
    $scope.clickedValueModel = "";
    $scope.removedValueModel = "";


    $scope.$on('$ionicView.enter', function (e) {

    });

    function omitirAcentos(text) {
        var acentos = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÇç";
        var original = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuucc";
        for (var i=0; i<acentos.length; i++) {
            text = text.replace(acentos.charAt(i), original.charAt(i));
        }
        return text;
    }

    $scope.getItems = function (query) {
        if (query && (query.length > 2 || (query[0] == '0' && query.length == 2) )) {
            query = omitirAcentos(query);
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
