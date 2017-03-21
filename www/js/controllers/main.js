app.controller('MainCtrl', function ($scope, $rootScope, $state, $ionicPlatform, $ionicSideMenuDelegate, $ionicPopup, userDatastore, user, cart, subscriptionSrv) {

    $scope.dragStatus = true;
    userDatastore.setRefreshingAccessToken(0);

    $scope.username = userDatastore.getUsername();

    user.refreshAccessToken()
        .then(function () {

        });

    $ionicPlatform.onHardwareBackButton(function () {
        if ($ionicSideMenuDelegate.isOpen) {
            $scope.menuVisible = false;
        }
    });

    $scope.stateChange = function (to) {
        $state.go(to);
    };

    $scope.$on('menu:drag', function (event, args) {
        $scope.dragStatus = args;

        subscriptionSrv.requestSubscription(false, '').then(function () {
            $scope.subscription = userDatastore.getSubscription();
            var startDate = moment($scope.subscription.startDate).format('YYYY-MM-DD');
            var endDate = moment($scope.subscription.endDate).format('YYYY-MM-DD');
            var daySubscription = moment(moment(endDate).diff(moment(startDate), 'days'))._i;

            if (($scope.subscription.lapse == 1 ) && (daySubscription == 7)){
                $scope.typeSubscription = 'Período de Prueba';
                $scope.daysRemaining = 0;
            } else if($scope.subscription.lapse == 0 ){
                $scope.typeSubscription = 'Período de Prueba';
                $scope.daysRemaining = userDatastore.getDaysRemaining();
            }else {
                $scope.typeSubscription = $scope.subscription.lapse + ' Meses';
                $scope.daysRemaining = userDatastore.getDaysRemaining();
            }
        });

//        $scope.daysRemaining = userDatastore.getDaysRemaining();
    });

    $scope.init = function () {
        $scope.customer = user.getProfile();
        $scope.daysRemaining = userDatastore.getDaysRemaining();
    };

    $scope.$on('$ionicView.enter', function (e) {
        $scope.view = {};
        $scope.init();
    });

    $rootScope.$on('receivedNotification', function (e, data) {
        $ionicPopup.confirm({
            title: 'Findness - Nueva lista compartida',
            template: data.message,
            cancelText: 'Después',
            okText: 'Ver ahora'
        }).then(function (res) {
            if (res) {
                $state.go('app.companies-detail', {
                    'id': data.additionalData.staticListId,
                    'name': data.additionalData.staticListName
                });
            }
        })
    });

});
