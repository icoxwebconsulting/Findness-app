app.controller('ResultPaymentCtrl', function ($scope, $rootScope, $state, $ionicLoading, $ionicHistory, cart, searchService, paymentSrv, userDatastore) {

    $scope.error = false;

    $scope.$on('$ionicView.enter', function (e) {
        $scope.$emit('menu:drag', true);

        $ionicLoading.show({
            template: '<p>Realizando búsqueda...</p><p><ion-spinner icon="android"></ion-spinner></p>'
        });

        var data = JSON.parse(userDatastore.getResultPayment());
        $scope.idPayment = data.idPayment;
        //llamar al servicio de búsqueda con el último query
        searchService.executeLastQuery(cart.getSelectedCompanies()).then(function (lastQuery) {
            $ionicLoading.hide();
            $ionicHistory.nextViewOptions({
                historyRoot: true,
                disableBack: true
            });
            $state.go("app.map");
            paymentSrv.requestBalance();
        }).catch(function (e) {
            $ionicLoading.hide();
            console.log("error en consulta", e);
            $scope.error = true;
            $scope.errorName = e;
        });
    });
});