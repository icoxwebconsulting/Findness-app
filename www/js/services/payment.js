app.factory('paymentSrv', function ($q, $rootScope, $http, PAYMENT_CONF) {

    function processStripePayment(data, callback) {
        $http({
            method: "POST",
            url: PAYMENT_CONF.STRIPE_HOST + 'charges',
            params: data,
            headers: {
                Authorization: 'Bearer ' + PAYMENT_CONF.STRIPE_SECRET,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function mySucces(response) {
            callback(response);
        }, function myError(response) {
            callback(response);
        });
    }

    return {
        processStripePayment: processStripePayment
    };
});
