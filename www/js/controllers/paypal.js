app.controller('PaypalCtrl', function ($scope, $state, paymentSrv) {

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    $scope.$on('$ionicView.enter', function (e) {
        if (localStorage.getItem("external_load") != null) {
            var execute_url = JSON.parse(localStorage.getItem("execute_url"));
            var external_load = localStorage.getItem("external_load");
            var access_token = localStorage.getItem("paypal_access_token");

            var paymentId = getParameterByName('paymentId', external_load);
            var data = {
                payer_id: getParameterByName('PayerID', external_load)
            };

            paymentSrv.executePayPalPayment(data, access_token, paymentId).then(function (response) {
                console.log(response);
                localStorage.removeItem("execute_url");
                localStorage.removeItem("external_load");
            }).catch(function () {
                //TODO: handle error
            });
        }
    });
});
