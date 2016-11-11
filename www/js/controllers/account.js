app.controller('AccountCtrl', function ($scope, $state, paymentSrv, subscriptionSrv, $ionicPopup) {

    $scope.balance;
    $scope.subscription;
    $scope.typeSubscription;
    $scope.daysRemaining;
    var dateSubscription;
    var dateNow;

    $scope.$on('$ionicView.enter', function (e) {
        paymentSrv.requestBalance().then(function (balance) {
            $scope.balance = balance;
        });

        subscriptionSrv.requestSubscription().then(function (subscription) {
            $scope.subscription = subscription;

            if($scope.subscription.lapse == 1 ){
                $scope.typeSubscription = 'Período de Prueba';
            }else {
                $scope.typeSubscription = $scope.subscription.lapse + ' Meses';
            }

            dateSubscription = moment(($scope.subscription.endDate).toString()).format('YYYY-MM-DD');
            dateNow = moment().format('YYYY-MM-DD');
            $scope.daysRemaining = moment(moment(dateSubscription).diff(moment(dateNow), 'days'));
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
