app.factory('subscriptionSrv', function ($q, $rootScope, $http, transaction, userDatastore, $state, $ionicPopup, $ionicLoading){

    var objectSubscription;
    var dateSubscription;
    var dateNow;
    $rootScope.daysRemaining;

    function requestSubscription() {
        return transaction(localStorage.getItem('accessToken')).getSubscription().$promise.then(function (response) {
            userDatastore.setSubscription(response.subscription);
            console.log("seteado la suscripcion en ", response);

            return response.subscription;
        });
    }

    function init(){
        objectSubscription = userDatastore.getSubscription();
        dateSubscription = moment(objectSubscription.endDate).format('YYYY-MM-DD');
        dateNow = moment().format('YYYY-MM-DD');
        //dateNow = moment().add(10,'months').format('YYYY-MM-DD');
        if(dateSubscription > dateNow){
            $rootScope.daysRemaining = moment(moment(dateSubscription).diff(moment(dateNow), 'days'));
            userDatastore.setDaysRemaining($rootScope.daysRemaining._i);
        }else{
            userDatastore.setDaysRemaining(0);
        }
    }

    function detailSubscription(site){
        $ionicLoading.hide();
        init();
        console.log("ejecutando init");
        if (dateNow > dateSubscription){
            validateSubscription(site);
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
                '<p><b>Tiempo Restante: </b><ng-pluralize count="'+$rootScope.daysRemaining+'" when="{\'0\': \'Expiro\', \'1\': \'1 día\', \'other\': \''+$rootScope.daysRemaining+' días\'}"></ng-pluralize></p>';
            $ionicPopup.alert({
                title: 'Suscripción',
                template: html
            });
        }
        console.log('detail subscription',userDatastore.getSubscription());
    }

    function validateSubscription(site){
        init();
        console.log("ejecutando init");
        if (dateNow > dateSubscription){
            if (site != ''){
                $ionicPopup.alert({
                    title: 'Suscripción',
                    template: 'Para poder acceder a tus '+site+' debes tener tu suscripción activa.',
                    okText:'SUSCRÍBETE',
                }).then(function (res) {
                    if (res) {
                        $state.go('app.account');
                    }
                });
            }
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
