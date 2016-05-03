app.controller('PaymentCtrl', function ($scope, $state, paymentSrv) {

    $scope.cardType = {};
    $scope.card = {};

    function getToken(info, handler) {
        Stripe.card.createToken({
            number: info.number,
            cvc: info.cvc,
            exp_month: info.exp_month,
            exp_year: info.exp_year
        }, handler);
    }

    $scope.makeStripePayment = function (_cardInformation) {

        //console.log(_cardInformation);
        getToken(_cardInformation, function (status, response) {

            if (status == 200) {
                var data = {
                    "amount": parseFloat(_cardInformation.amount),
                    "currency": "usd",
                    "source": response.id,
                    "description": "Charge for test@example.com"
                };

                paymentSrv.processStripePayment(data, function (response) {
                    console.log(response);
                })
            } else {
                console.log(response);
            }

        });
    }
});
