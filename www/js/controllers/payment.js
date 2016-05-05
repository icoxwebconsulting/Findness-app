app.controller('PaymentCtrl', function ($scope, $state, paymentSrv) {

    $scope.cardType = {};
    $scope.card = {};
    $scope.paymentType;
    $scope.products = [
        {amount: 1, title: " 1$ combo"},
        {amount: 5, title: " 5$ combo"},
        {amount: 10, title: " 10$ combo"}
    ];

    $scope.setPaymentType = function (value) {
        $scope.paymentType = value;
    };

    function makeStripePayment(_cardInformation) {

        paymentSrv.requestStripeToken(_cardInformation).then(function (response) {
            var data = {
                "amount": parseFloat(_cardInformation.amount),
                "currency": "usd",
                "source": response.id,
                "description": "Charge for test@example.com"
            };

            paymentSrv.processStripePayment(data).then(function () {
                //TODO: cambio a ventana de confirmación
            });

        }).catch(function () {
            //TODO: handle error
        });
    }

    $scope.makePayPalPayment = function (_cardInformation, paypal) {
        //TODO: card.amount para el monto

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
                        "type": _cardInformation.cardType,
                        "expire_month": _cardInformation.exp_month,
                        "expire_year": _cardInformation.exp_year,
                        "cvv2": _cardInformation.cvc,
                        "first_name": _cardInformation.firstName,
                        "last_name": _cardInformation.lastName
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
                        "total": "1.47",
                        "currency": "USD"
                    },
                    "description": "This is the payment transaction description."
                }
            ]
        };

        paymentSrv.requestPayPalAccessToken().then(function (tokenData) {
            localStorage.setItem("paypal_access_token", tokenData.access_token);

            paymentSrv.processPayPalPayment(data, tokenData.access_token).then(function (response) {
                if ($scope.paymentType == 2) {
                    //pago con saldo paypal, el usuario debe confirmar
                    localStorage.setItem("execute_url", JSON.stringify(response.links[1]));
                    //localStorage.setItem("pay_id", response.id);
                    var ref = cordova.InAppBrowser.open(response.links[1].href, '_system', '');
                } else {
                    //TODO: pago con tarjeta, redireccionar
                }
            })
        }).catch(function (error) {
            //TODO: handle error
        });
    };

    $scope.makeCreditCardPayment = function (_cardInformation) {
        if ($scope.paymentType == 1) {
            //pago con stripe
            makeStripePayment(_cardInformation);
        } else {
            //pago con tarjeta en paypal
            makePayPalPayment(_cardInformation, false);
        }
    }
});
