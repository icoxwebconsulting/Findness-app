app.factory('subscriptionSrv', function ($q, $rootScope, $http, transaction, userDatastore, $state, $ionicPopup, $ionicLoading){
    var objectSubscription = userDatastore.getSubscription();
    var dateSubscription = moment((objectSubscription.endDate).toString()).format('YYYY-MM-DD');
    var dateNow = moment().format('YYYY-MM-DD');
    var daysRemaining = moment(moment(dateSubscription).diff(moment(dateNow), 'days'));

    function requestSubscription() {
        return transaction(localStorage.getItem('accessToken')).getSubscription().$promise.then(function (response) {
            userDatastore.setSubscription(response.subscription);
            console.log("seteado el saldo en ", response);
            return response.subscription;
        });
    }

    function detailSubscription(){
        $ionicLoading.hide();

        if (dateNow > dateSubscription){
            validateSubscription();
        }else{
            if(objectSubscription.lapse == 1 ){
                var lapse = 'Período de Prueba';
            }else {
                var lapse = objectSubscription.lapse + ' Meses';
            }
            var start = moment(objectSubscription.startDate).format('DD-MM-YYYY');
            var end = moment(objectSubscription.endDate).format('DD-MM-YYYY');
            var html =  '<p><b>Tipo: </b>'+lapse+' </p>'+
                '<p><b>Período: </b>' + start +' - '+ end +' </p>'+
                '<p><b>Tiempo Restante: </b>' + daysRemaining + ' días</p>';
            $ionicPopup.alert({
                title: 'Suscripción',
                template: html
            });
        }
        $state.go('app.map');
    }

    function validateSubscription(){
        if (dateNow > dateSubscription){
            $ionicPopup.alert({
                title: 'Suscripción',
                template: 'Su suscripción a expirado.'
            });
        }
    }

    return {
        requestSubscription: requestSubscription,
        detailSubscription: detailSubscription,
        validateSubscription: validateSubscription
    }

})
