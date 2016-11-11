app.controller('AccountCtrl', function ($scope, $state, paymentSrv, subscriptionSrv, $ionicPopup) {

    $scope.balance;
    $scope.subscription;

    $scope.$on('$ionicView.enter', function (e) {
        paymentSrv.requestBalance().then(function (balance) {
            $scope.balance = balance;
        });

        subscriptionSrv.requestSubscription().then(function (subscription) {
            $scope.subscription = subscription;
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
