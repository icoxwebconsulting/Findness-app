app.controller('AccountCtrl', function ($scope, $state, paymentSrv, $ionicPopup) {

    $scope.balance;

    $scope.$on('$ionicView.enter', function (e) {
        paymentSrv.requestBalance().then(function (balance) {
            $scope.balance = balance;
        });
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

    $scope.init = function () {
        $scope.view = {};
        self.getTransactions();
    };

    $scope.init();

});
