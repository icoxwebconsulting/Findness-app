app.controller('PaymentCtrl', function ($scope, $state, paymentSrv, $ionicLoading, $ionicPopup, transactionStorage) {

    $scope.cardType = {};
    $scope.card = {};
    $scope.paymentType = 0;
    $scope.firstName;
    $scope.lastName;
    $scope.products = [
        {amount: 1.0, title: " 1$ combo"},
        {amount: 5.0, title: " 5$ combo"},
        {amount: 10.0, title: " 10$ combo"}
    ];
    $scope.buttonDisabled = false;

    $scope.setPaymentType = function (value) {
        $scope.paymentType = value;
    };

    function showAlert(error) {
        $ionicPopup.alert({
            title: 'Estado del pago',
            template: '<p style="text-align: center">No se pudo procesar su pago, intente nuevamente.<br />Error: ' + error + '</p>'
        });
    }

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

    function makeStripePayment(_cardInformation) {
        $scope.buttonDisabled = true;
        showLoading();

        paymentSrv.requestStripeToken(_cardInformation).then(function (response) {
            var data = {
                "amount": parseFloat(_cardInformation.amount) * 100,
                "currency": "usd",
                "source": response.id,
                "description": "Cargo Findness"
            };

            return paymentSrv.processStripePayment(data).then(function (response) {
                showConfirmation();
                transactionStorage.saveTransaction({
                    id_registered: response.id,
                    operator: 3,
                    reference: response.source.id,
                    status: (response.status == "succeeded") ? 1 : 2,
                    amount: response.amount / 100
                });
                return registerPayment({
                    balance: parseFloat(_cardInformation.amount),
                    operator: 3,
                    transactionId: response.id,
                    cardId: response.source.id
                });
                //TODO: una vez registrado el pago se debe actualizar el balance del usuario
            });

        }).catch(function (error) {
            //TODO: handle error
            console.log(error);
        }).finally(function () {
            $scope.buttonDisabled = false;
            $ionicLoading.hide();
        });
    }

    function registerPayment(data) {
        return paymentSrv.registerSuccessPayment(data).then(function (response) {
            console.log("respuesta servicio de registro", response)
        });
    }

    $scope.makePayPalPayment = function (_cardInformation, paypal) {
        $scope.buttonDisabled = true;
        console.log(_cardInformation);
        if (!paypal && ($scope.firstName == "" || $scope.lastName == "")) {
            return;
            // $scope.firstName == "test";
            // $scope.lastName == " test";
        }

        showLoading();

        var payer = {};
        if (paypal) {
            //pago con saldo paypal
            payer.payment_method = "paypal";
        } else {
            //pago con tarjeta de crédito mediante paypal
            payer.payment_method = "credit_card";
            payer.funding_instruments = [
                {
                    "credit_card": {
                        "number": _cardInformation.number,
                        "type": _cardInformation.cardType.toLowerCase(),
                        "expire_month": _cardInformation.exp_month,
                        "expire_year": _cardInformation.exp_year,
                        "cvv2": _cardInformation.cvc,
                        "first_name": $scope.firstName,
                        "last_name": $scope.lastName
                    }
                }
            ];
        }

        var data = {
            "intent": "sale",
            "redirect_urls": {
                "return_url": "findness://localhost/ok",
                "cancel_url": "findness://localhost/fail"
            },
            "payer": payer,
            "transactions": [
                {
                    "amount": {
                        "total": _cardInformation.amount + ".00",
                        "currency": "USD"
                    },
                    "description": "This is the payment transaction description."
                }
            ]
        };

        paymentSrv.requestPayPalAccessToken().then(function (tokenData) {
            localStorage.setItem("paypal_access_token", tokenData.access_token);

            return paymentSrv.processPayPalPayment(data, tokenData.access_token).then(function (response) {
                console.log("dentro del then que procesa el response");
                if ($scope.paymentType == 2) {
                    //pago con saldo paypal, el usuario debe confirmar
                    localStorage.setItem("execute_url", JSON.stringify(response.links[1]));
                    //localStorage.setItem("pay_id", response.id);
                    $ionicLoading.hide();
                    var ref = cordova.InAppBrowser.open(response.links[1].href, '_system', '');
                } else {
                    transactionStorage.saveTransaction({
                        id_registered: response.id,
                        operator: 2,
                        reference: response.payer.payer_info.payer_id,
                        status: (response.state == "approved") ? 1 : 2,
                        amount: response.transactions.amount.total
                    });
                    return registerPayment({
                        balance: parseFloat(_cardInformation.amount),
                        operator: 2,
                        transactionId: response.id,
                        cardId: response.payer.payer_info.payer_id
                    });
                }
            })
        }).then(function () {
            console.log("en el then")
        }).catch(function (error) {
            showAlert(error.statusText);
        }).finally(function (error) {
            console.log("en el finally");
            $ionicLoading.hide();
            $scope.buttonDisabled = false;
        });
    };

    $scope.makeCreditCardPayment = function (_cardInformation) {
        console.log($scope.paymentType);
        if ($scope.paymentType == 1) {
            //pago con stripe
            makeStripePayment(_cardInformation);
        } else {
            //pago con tarjeta en paypal
            $scope.makePayPalPayment(_cardInformation, false);
        }
    }
});
