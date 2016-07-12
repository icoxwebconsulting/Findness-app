app.controller('CartCtrl', function ($scope, $rootScope, $state, $filter, cart, paymentSrv, searchService, $ionicPopup) {

    $scope.closeCart = function () {
    };

    $scope.changeTotal = function () {

        if($scope.view.totalCompanies > 0)
        {

            if($scope.view.totalCompanies > $scope.maxCompanies )
            {
                $scope.view.totalCompanies = $scope.maxCompanies;
                $ionicPopup.alert({
                    title: 'Límite de empresas',
                    template: 'La cantidad supera el máximo de empresas encontradas.'
                });
            }else
                $scope.view.total = ($scope.view.totalCompanies * $scope.view.unitPrice) + 5;

        }
        else
            $scope.view.total = 0;


        if ($scope.view.balance >= $scope.view.total) {
            $scope.view.payable = 0;
        } else {
            $scope.view.payable = $scope.view.total - $scope.view.balance;
        }
    };

    $scope.init = function () {
        $scope.view = {};
        $scope.view.contCompanies = [];
        $scope.maxCompanies = cart.getTotalCompanies();

        var min = 1;
        for (var totalCompany = cart.getTotalCompanies(); min <= totalCompany; totalCompany--) {
            $scope.view.contCompanies.push(totalCompany);
        }

        $scope.view.balance = cart.getBalance();
        $scope.view.totalCompanies = cart.getTotalCompanies();
        $scope.view.unitPrice = cart.getUnitPrice();
        $scope.changeTotal();

    };

    $scope.checkout = function () {
        console.info('$scope.view.payable', $scope.view.payable);
        cart.setPayable($scope.view.payable);
        $state.go('app.checkout');
    };

    $scope.confirmCheckout = function () {
        //llamar al servicio de búsqueda con el último query
        searchService.executeLastQuery($scope.view.totalCompanies).then(function (lastQuery) {
            paymentSrv.requestBalance();
            $rootScope.$emit('processMarkers', {
                lastQuery: lastQuery
            });
            $state.go("app.map");
        });
    };

    $scope.init();


});