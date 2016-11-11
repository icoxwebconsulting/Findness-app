app.factory('subscriptionSrv', function ($q, $rootScope, $http, transaction, userDatastore, $state, $ionicPopup, $ionicLoading){

    function requestSubscription() {
        return transaction(localStorage.getItem('accessToken')).getSubscription().$promise.then(function (response) {
            userDatastore.setSubscription(response.subscription);
            console.log("seteado el saldo en ", response);

//            validateSubscription();
            return response.subscription;
        });
    }

    function validateSubscription(){
        var objectSubscription = userDatastore.getSubscription();
        var dateSubscription = moment((objectSubscription.endDate).toString()).format('YYYY-MM-DD');
//        var dateNow = moment('2017-01-01').format('YYYY-MM-DD');
        var dateNow = moment().format('YYYY-MM-DD');
        var daysRemaining = moment(moment(dateSubscription).diff(moment(dateNow), 'days'));
        $ionicLoading.hide();


        if (dateNow > dateSubscription){
            $ionicPopup.alert({
                title: 'Suscripción',
                template: 'Su suscripción a expirado.'
            });

        }else {
            
            if(objectSubscription.lapse == 1 ){
                var lapse = 'Período de Prueba';
            }else {
                var lapse = objectSubscription.lapse + ' Meses';
            }

            var start = moment(objectSubscription.startDate).format('YYYY-MM-DD');
            var end = moment(objectSubscription.endDate).format('YYYY-MM-DD');

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

    return {
        requestSubscription: requestSubscription,
        validateSubscription: validateSubscription
    }

})
