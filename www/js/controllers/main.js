app.controller('MainCtrl', function ($scope, $rootScope, $state, $ionicPlatform, $ionicSideMenuDelegate, $ionicPopup, userDatastore, user, cart) {

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
    });

    $scope.init = function () {
        $scope.customer = user.getProfile();
        $scope.view.balance = cart.getBalance();
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
