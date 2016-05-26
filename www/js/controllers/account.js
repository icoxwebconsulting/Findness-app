app.controller('AccountCtrl', function ($scope, $state, paymentSrv) {


    self.getTransactions = function(){
        paymentSrv.getTransactions().then(function (response) {
            console.log("response -> ", response);
            $scope.view.transactions = response.transactions;
        });
    };




    $scope.init = function(){
        $scope.view = {};
        self.getTransactions();
    };

    $scope.init();

});
