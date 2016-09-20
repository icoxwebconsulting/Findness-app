app.controller('PaypalCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, paymentSrv) {

    $scope.viewExecute = false;

    $scope.$on('$ionicView.enter', function (e) {
        if (localStorage.getItem("external_load") != null) {
            $scope.viewExecute = true;
            $scope.execute_url = JSON.parse(localStorage.getItem("execute_url"));
            $scope.external_load = localStorage.getItem("external_load");
            $scope.access_token = localStorage.getItem("paypal_access_token");

            $scope.paymentId = getParameterByName('paymentId', $scope.external_load);
            $scope.data = {
                payer_id: getParameterByName('PayerID', $scope.external_load)
            };
        } else {
            $scope.viewExecute = false;
        }
    });

    function showLoading() {
        $ionicLoading.show({
            template: '<p>Procesando pago...</p><p><ion-spinner icon="android"></ion-spinner></p>'
        });
    }

    function showConfirmation() {
        $ionicLoading.show({
            template: '<p>Registrando pago...</p><p><ion-spinner icon="android"></ion-spinner></p>'
        });
    }

    $scope.executePaypal = function () {
        showLoading();
        paymentSrv.executePayPalPayment($scope.data, $scope.access_token, paymentId).then(function (response) {
            console.log(response);
            localStorage.removeItem("execute_url");
            localStorage.removeItem("external_load");
            //registrando el pago
            showConfirmation();
            var amount  = localStorage.getItem("paypal_amount");
            var data = {
                balance: amount,
                operator: 2,
                transactionId: response.id,
                cardId: response.payer.payer_info.payer_id
            };

            paymentSrv.registerSuccessPayment(data).then(function (response) {
                console.log("respuesta servicio de registro", response);
                localStorage.removeItem("paypal_amount");
                $ionicPopup.alert({
                    title: 'Findness - Pago',
                    template: 'Su pago se ha registrado satisfactoriamente.'
                }).then(function () {
                    $state.go("app.account");
                });
            }).catch(function () {
                //TODO: handle error
            });
        });
    };

    $scope.cancelPayment = function () {
        localStorage.removeItem("execute_url");
        localStorage.removeItem("external_load");
        localStorage.removeItem("paypal_amount");
        $state.go("app.account");
    };

    $scope.goToAccount = function () {
        $state.go("app.account");
    };

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

});
