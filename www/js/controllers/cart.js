app.controller('CartCtrl', function ($scope, $rootScope, $state, $filter, cart, paymentSrv, searchService, $ionicPopup, $ionicLoading, TAX_CONF, userDatastore) {

    $scope.closeCart = function () {
    };

    $scope.$on('$ionicView.enter', function (e) {
        $scope.init();
    });

    $scope.init = function () {
        $scope.$emit('menu:drag', true);
        $scope.view = {};
        $scope.view.iva = 0;
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
        $scope.view.subscription = userDatastore.getSubscription();

        var startDate = moment($scope.view.subscription.startDate).format('YYYY-MM-DD');
        var endDate = moment($scope.view.subscription.endDate).format('YYYY-MM-DD');
        var daySubscription = moment(moment(endDate).diff(moment(startDate), 'days'))._i;

        if (($scope.view.subscription.lapse == 1 ) && (daySubscription < 7)){
            $scope.lapse = 'Período de Prueba';
        }else if($scope.view.subscription.lapse == 0 ){
            $scope.lapse = 'Período de Prueba';
        }else {
            $scope.lapse = 'Suscripción '+$scope.view.subscription.lapse+ ' Meses';
        }

    };

    $scope.changeTotal = function () {

        if ($scope.view.totalCompanies > 0) {
            if ($scope.view.totalCompanies > $scope.maxCompanies) {
                $scope.view.totalCompanies = $scope.maxCompanies;
                $ionicPopup.alert({
                    title: 'Límite de empresas',
                    template: 'La cantidad supera el máximo de empresas encontradas.'
                });
            } else {
                var subtotal = $scope.view.totalCompanies * $scope.view.unitPrice;
                if (subtotal < 5) {
                    subtotal += TAX_CONF.FEE;
                }
                $scope.view.total = subtotal * TAX_CONF.IVA;
                //IVA
                $scope.view.iva = subtotal * (TAX_CONF.IVA - 1);
            }
        } else {
            $scope.view.total = 0;
        }

        if ($scope.view.balance >= $scope.view.total) {
            $scope.view.payable = 0;
        } else {
            $scope.view.payable = $scope.view.total - $scope.view.balance;
            $scope.view.payable = parseFloat($scope.view.payable.toFixed(2));
        }
    };

    $scope.checkout = function () {
        console.info('$scope.view.payable', $scope.view.payable);
        cart.setPayable($scope.view.payable);
        cart.setSelectedCompanies($scope.view.totalCompanies);
        $state.go('app.checkout');
    };

    $scope.confirmCheckout = function () {
        //llamar al servicio de búsqueda con el último query
        $ionicLoading.show({
            template: '<p>Realizando compra...</p><p><ion-spinner icon="android"></ion-spinner></p>'
        });
        searchService.executeLastQuery($scope.view.totalCompanies).then(function (lastQuery) {
            $ionicLoading.hide();
            $state.go("app.map");
            paymentSrv.requestBalance();
        }, function (error) {
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'Findness - Error en búsqueda.',
                template: error
            });
        });
    };

});
