app.factory('subscriptionSrv', function ($q, $rootScope, $http, transaction, userDatastore, $state, $ionicPopup, $ionicLoading){

    var objectSubscription;
    var dateSubscription;
    var dateNow;
    $rootScope.daysRemaining;


    function requestSubscription(detail, site) {
        return true;
        /*return transaction(localStorage.getItem('accessToken')).getSubscription().$promise
            .then(function (response) {
                userDatastore.setSubscription(response.subscription);
                console.log("seteado la suscripcion en ", response);
            })
            .then(function(){
                init();
                console.log("ejecutando init");
            })
            .then(function(){
                if (detail == true)
                    detailSubscription();
            })
            .then(function(){
                validateSubscription(site);
            })
            .catch(function(){
                throw 'Error subscription localStorage';
            });
        return response.subscription; */

    }

    function init(){
        return true;
       /* objectSubscription = userDatastore.getSubscription();
        dateSubscription = moment(objectSubscription.endDate).format('YYYY-MM-DD');
        dateNow = moment().format('YYYY-MM-DD');
        //dateNow = moment().add(10,'months').format('YYYY-MM-DD');
        if(dateNow < dateSubscription){
            $rootScope.daysRemaining = moment(moment(dateSubscription).diff(moment(dateNow), 'days'));
            userDatastore.setDaysRemaining($rootScope.daysRemaining._i);
        }else{
            userDatastore.setDaysRemaining(0);
        }*/
    }

    function detailSubscription(){
        return true;
     /*   if (dateNow < dateSubscription){

            var startDate = moment(objectSubscription.startDate).format('YYYY-MM-DD');
            var endDate = moment(objectSubscription.endDate).format('YYYY-MM-DD');
            var daySubscription = moment(moment(endDate).diff(moment(startDate), 'days'))._i;

            if ((objectSubscription.lapse == 1 ) && (daySubscription == 7)){
                var lapse = 'Período de Prueba';
            }else if(objectSubscription.lapse == 0 ){
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
                title: 'HAZTE PRO',
                template: html
            });
        } */
    }

    function validateSubscription(site){
        return true;
      /*  if (dateNow > dateSubscription){
            if (site != ''){
                $ionicPopup.alert({
                    title: 'Hazte Pro',
                    template: 'Hazte Pro para poder acceder a tus '+site+' .',
                    okText:'HAZTE PRO'
                }).then(function (res) {
                    if (res) {
                        $state.go('app.pricing');
                    }
                });
            }
            return true;
        } */
    }

    return {
        requestSubscription: requestSubscription,
        init: init,
        detailSubscription: detailSubscription,
        validateSubscription: validateSubscription
    }

})
