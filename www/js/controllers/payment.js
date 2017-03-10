app.controller('PaymentCtrl', function ($scope, $state, paymentSrv, $ionicLoading, $ionicPopup, TAX_CONF, userDatastore, subscriptionSrv) {

    $scope.card = {};
    $scope.paymentType = 0;
    $scope.buttonDisabled = false;
    $scope.daysRemaining = userDatastore.getDaysRemaining();


    $scope.init = function(){
        $scope.data = { lapse: 1};
        $scope.card.amount = 3;
//        $scope.card.amount = 12;
        $scope.card.iva = parseFloat($scope.card.amount) * parseFloat(TAX_CONF.IVA);
        $scope.card.total = parseFloat($scope.card.amount) + parseFloat($scope.card.iva);
        $scope.paymentType = 1;
    };

    $scope.subscriptions = [
        {text: '1 Mes', value: 1 },
        {text: '6 Meses', value: 6 },
        {text: '12 Meses', value: 12 }
    ];

    $scope.hasChanged = function () {
        switch ($scope.card.lapse){
            case 1:
                $scope.card.amount = 3;
                break;
            case 6:
                $scope.card.amount = 15;
                break;
            case 12:
                $scope.card.amount = 24;
                break;
            default:
                $scope.card.amount = 3;
        }

        $scope.card.iva = parseFloat($scope.card.amount) * parseFloat(TAX_CONF.IVA);
        $scope.card.total = parseFloat($scope.card.amount) + parseFloat($scope.card.iva);
        $scope.paymentType = 1;
    };

    $scope.init();

    $scope.setPaymentType = function (value) {
        $scope.paymentType = value;
        $scope.card = {};
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
        if ($scope.daysRemaining != 0){
            $ionicPopup.alert({
                title: 'Findness - Pago',
                template: 'Su suscripción está activa, no puede comprar una nueva.'
            });
            return;
        }
        $scope.buttonDisabled = true;
        showLoading();
        var startDate = moment().format('YYYY/MM/DD');
        var amount = _cardInformation.total * 100;
        paymentSrv.requestStripeToken(_cardInformation).then(function (response) {
            var data = {
                "amount": amount.toFixed(),
                "currency": "eur",
                "source": response.id,
                "description": "Usuario: " + userDatastore.getUsername(),
            };
            console.log('data',data);

            return paymentSrv.processStripePayment(data).then(function (response) {
                showConfirmation();
                return registerPayment({
                    balance: parseFloat(_cardInformation.total),
                    operator: 3,
                    transactionId: response.id,
                    cardId: response.source.id,
                    lapse: $scope.card.lapse,
                    startDate : startDate
                });
            });
            subscriptionSrv.requestSubscription(false, '');

        }).catch(function (error) {
            //TODO: handle error
            console.log(error);
            showAlert(error.type);
        }).finally(function () {
            $scope.buttonDisabled = false;
            $ionicLoading.hide();
        });
    }

    function registerPayment(data) {
        return paymentSrv.registerSuccessPayment(data).then(function (response) {
            console.log("respuesta servicio de registro", response)
            $ionicPopup.alert({
                title: 'Findness - Pago',
                template: 'Su pago se ha registrado satisfactoriamente.'
            }).then(function () {
                $state.go("app.account", {}, {reload: true});
            });
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
                    "description": "Fidness add credit"
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
        if (!_cardInformation.lapse) {
            $ionicPopup.alert({
                title: 'Findness - Pago',
                template: 'Debe seleccionar una suscripción.'
            });
            return;
        } else if(_cardInformation.amount < 0.47){
            $ionicPopup.alert({
                title: 'Findness - Pago',
                template: 'El saldo mímino que acepta la plataforma para la recarga es de 0.47 €.'
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
