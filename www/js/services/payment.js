app.factory('paymentSrv', function ($q, $rootScope, $http, transaction, PAYMENT_CONF, userDatastore) {

    function processStripePayment(data) {
        var deferred = $q.defer();
        $http({
            method: "POST",
            url: PAYMENT_CONF.STRIPE_HOST + 'charges',
            params: data,
            headers: {
                Authorization: 'Bearer ' + PAYMENT_CONF.STRIPE_SECRET,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function success(response) {
            if (response.status == 200) {
                deferred.resolve(response.data);
            } else {
                deferred.reject(response);
            }
        }, function error(response) {
            deferred.reject(response);
        });

        return deferred.promise;
    }

    function requestPayPalAccessToken() {
        var deferred = $q.defer();
        $http({
            method: "POST",
            url: PAYMENT_CONF.PAYPAL_HOST + 'oauth2/token?response_type=token&grant_type=client_credentials',
            headers: {
                Authorization: 'Basic ' + btoa(PAYMENT_CONF.PAYPAL_CLIENT_ID + ':' + PAYMENT_CONF.PAYPAL_SECRET),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function success(response) {
            if (response.status == 200) {
                deferred.resolve(response.data);
            } else {
                deferred.reject(response);
            }
        }, function error(response) {
            deferred.reject(response);
        });

        return deferred.promise;
    }

    function requestStripeToken(info) {
        var deferred = $q.defer();

        Stripe.card.createToken({
            number: info.number,
            cvc: info.cvc,
            exp_month: info.exp_month,
            exp_year: info.exp_year
        }, function (status, response) {
            if (status == 200) {
                deferred.resolve(response);
            } else {
                deferred.reject(response);
            }
        });

        return deferred.promise;
    }

    function processPayPalPayment(data, token) {
        var deferred = $q.defer();
        $http({
            method: "POST",
            url: PAYMENT_CONF.PAYPAL_HOST + 'payments/payment',
            data: data,
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        }).then(function success(response) {
            if (response.status == 200) {
                deferred.resolve(response.data);
            } else {
                deferred.reject(response);
            }
        }, function error(response) {
            deferred.reject(response);
        });

        return deferred.promise;
    }

    function executePayPalPayment(data, token, paymentId) {
        var deferred = $q.defer();
        $http({
            method: "GET",
            url: PAYMENT_CONF.PAYPAL_HOST + 'payments/payment/' + paymentId + '/execute',
            data: data,
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        }).then(function success(response) {
            if (response.status == 200) {
                deferred.resolve(response.data);
            } else {
                deferred.reject(response);
            }
        }, function error(response) {
            deferred.reject(response);
        });

        return deferred.promise;
    }

    function registerSuccessPayment(data) {
        return transaction(localStorage.getItem('accessToken')).save(data).$promise.then(function (response) {
            console.log(response);
            return response;
        });
    }


    function getTransactions(){
        return transaction(localStorage.getItem('accessToken')).get().$promise.then(function (response) {
            return response;
        });
    }

    function requestBalance() {
        transaction(localStorage.getItem('accessToken')).getBalance().$promise.then(function (response) {
            userDatastore.setBalance(response.balance);
            console.log("seteado el saldo en ", response);
        });
    }

    return {
        processStripePayment: processStripePayment,
        requestPayPalAccessToken: requestPayPalAccessToken,
        requestStripeToken: requestStripeToken,
        processPayPalPayment: processPayPalPayment,
        executePayPalPayment: executePayPalPayment,
        registerSuccessPayment: registerSuccessPayment,
        getTransactions:getTransactions,
        requestBalance: requestBalance
    };
});
