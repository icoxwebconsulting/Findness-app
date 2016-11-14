app.factory('subscriptionSrv', function ($q, $rootScope, $http, transaction, userDatastore, $state, $ionicPopup, $ionicLoading){

    var objectSubscription;
    var dateSubscription;
    var dateNow;
    var daysRemaining;

    function requestSubscription() {
        return transaction(localStorage.getItem('accessToken')).getSubscription().$promise.then(function (response) {
            userDatastore.setSubscription(response.subscription);
            console.log("seteado el saldo en ", response);

            return response.subscription;
        });
    }

    function init(){
        objectSubscription = userDatastore.getSubscription();
        dateSubscription = moment(objectSubscription.endDate).format('YYYY-MM-DD');
        dateNow = moment().add(10,'months').format('YYYY-MM-DD');
        daysRemaining = moment(moment(dateSubscription).diff(moment(dateNow), 'days'));
    }

    function detailSubscription(){
        $ionicLoading.hide();
        init();
        console.log("ejecutando init");
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
        console.log('detail subscription',userDatastore.getSubscription());
    }

    function validateSubscription(){
        init();
        if (dateNow > dateSubscription){
            $ionicPopup.alert({
                title: 'Suscripción',
                template: 'Su suscripción a expirado.'
            });
            return true;
        }
    }

    return {
        requestSubscription: requestSubscription,
        init: init,
        detailSubscription: detailSubscription,
        validateSubscription: validateSubscription
    }

})
