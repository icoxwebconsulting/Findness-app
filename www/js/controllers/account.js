app.controller('AccountCtrl', function ($scope, $state, paymentSrv, subscriptionSrv, $ionicPopup, userDatastore) {

    $scope.balance;
    $scope.subscription;
    $scope.typeSubscription;
    $scope.daysRemaining;

    $scope.$on('$ionicView.enter', function (e) {
        paymentSrv.requestBalance().then(function (balance) {
            $scope.balance = balance;
        });

        subscriptionSrv.requestSubscription(false, '').then(function () {
            $scope.subscription = userDatastore.getSubscription();
            var startDate = moment($scope.subscription.startDate).format('YYYY-MM-DD');
            var endDate = moment($scope.subscription.endDate).format('YYYY-MM-DD');
            var daySubscription = moment(moment(endDate).diff(moment(startDate), 'days'))._i;

            if (($scope.subscription.lapse == 1 ) && (daySubscription == 7)){
                $scope.typeSubscription = 'Período de Prueba';
                $scope.daysRemaining = 0;
            } else if($scope.subscription.lapse == 0 ){
                $scope.typeSubscription = 'Período de Prueba';
                $scope.daysRemaining = userDatastore.getDaysRemaining();
            }else {
                $scope.typeSubscription = $scope.subscription.lapse + ' Meses';
                $scope.daysRemaining = userDatastore.getDaysRemaining();
            }

        });
        $scope.view = {};
        self.getTransactions();
        $scope.$emit('menu:drag', true);
    });

    $scope.showDetail = function (transaction) {
        console.log(transaction);

        $ionicPopup.alert({
            title: 'Findness - Detalle de transacción',
            template: '<p></p><p>Identificador: ' + transaction.transaction_id + '</p>'
        });
    };

    self.getTransactions = function () {
        paymentSrv.getTransactions().then(function (response) {
            console.log("response -> ", response);
            $scope.view.transactions = response.transactions;
        });
    };

});
