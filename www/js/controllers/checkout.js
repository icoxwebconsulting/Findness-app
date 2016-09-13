app.controller('CheckoutCtrl', function ($scope, $state, paymentSrv, cart, $ionicLoading, $ionicPopup, $ionicHistory, userDatastore) {

    $scope.init = function () {
        $scope.$emit('menu:drag', true);
        $scope.card = {};
        $scope.card.amount = cart.getPayable();
        $scope.paymentType = 0;
        $scope.buttonDisabled = false;
    };

    $scope.init();
    $scope.messageMinimal = false;

    $scope.setPaymentType = function (value) {
        $scope.paymentType = value;
        if (value == 1 && $scope.card.amount < 0.47) {
            $scope.card.amount = 0.47;
            $scope.messageMinimal = true;
        } else {
            $scope.messageMinimal = false;
        }
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
        var amount = _cardInformation.amount * 100;
        paymentSrv.requestStripeToken(_cardInformation).then(function (response) {
            var data = {
                "amount": amount.toFixed(),
                "currency": "eur",
                "source": response.id,
                "description": "Cargo Findness"
            };

            return paymentSrv.processStripePayment(data).then(function (response) {
                showConfirmation();
                return registerPayment({
                    balance: parseFloat(_cardInformation.amount),
                    operator: 3,
                    transactionId: response.id,
                    cardId: response.source.id
                });
            });

        }).catch(function (error) {
            //TODO: handle error
            console.log(error);
            showAlert(error.statusText);
        }).finally(function () {
            $scope.buttonDisabled = false;
            $ionicLoading.hide();
        });
    }

    function registerPayment(data) {
        return paymentSrv.registerSuccessPayment(data).then(function (response) {
            $ionicHistory.nextViewOptions({
                historyRoot: true,
                disableBack: true
            });

            console.log("respuesta servicio de registro", response);
            //cambiar de pagina para la pantalla que muestra el resultado del pago
            userDatastore.setResultPayment(JSON.stringify({
                idPayment: response.id
            }));
            $state.go("app.resultPayment");
        });
    }

    $scope.makePayPalPayment = function (_cardInformation, paypal) {
        $scope.buttonDisabled = true;
        console.log(_cardInformation);
        if (!paypal && ($scope.card.firstName == "" || $scope.card.lastName == "")) {
            $ionicPopup.alert({
                title: 'Findness - Pago',
                template: 'Debe colocar su nombre y apellido.'
            });
            return;
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
                        "total": _cardInformation.amount.toFixed(2),
                        "currency": "EUR"
                    },
                    "description": "Findness payment."
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
                    localStorage.setItem("paypal_amount", _cardInformation.amount);
                    $ionicLoading.hide();
                    var ref = cordova.InAppBrowser.open(response.links[1].href, '_system', '');
                } else {
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

    $scope.makeCreditCardPayment = function (_cardInformation, paymentForm) {
        //validar formulario
        if (!_cardInformation.amount) {
            $ionicPopup.alert({
                title: 'Findness - Pago',
                template: 'Debe escribir un saldo para la recarga.'
            });
            return;
        }

        if (paymentForm.$invalid) {
            if (paymentForm.ccNumber.$invalid) {
                $ionicPopup.alert({
                    title: 'Findness - Pago',
                    template: 'El número de tarjeta no es válido.'
                });
                return;
            }
            if (paymentForm.ccCvc.$invalid) {
                $ionicPopup.alert({
                    title: 'Findness - Pago',
                    template: 'El código de confirmación no es válido.'
                });
                return;
            }
        }

        _cardInformation.cardType = paymentForm.ccNumber.$ccType;

        var fecha = new Date(_cardInformation.exp_date);
        _cardInformation.exp_month = fecha.getMonth();
        _cardInformation.exp_year = fecha.getFullYear();

        if (_cardInformation.exp_year < (new Date()).getFullYear()
            || (_cardInformation.exp_year == (new Date()).getFullYear() && _cardInformation.exp_month < (new Date()).getMonth())) {
            $ionicPopup.alert({
                title: 'Findness - Pago',
                template: 'La fecha de expiración no es válida.'
            });
            return;
        }

        _cardInformation.exp_month += 1;

        if ($scope.paymentType == 1) {
            //pago con stripe
            makeStripePayment(_cardInformation);
        } else {
            //pago con tarjeta en paypal
            $scope.makePayPalPayment(_cardInformation, false);
        }
    }
});
