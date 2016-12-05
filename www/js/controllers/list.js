app.controller('ListCtrl', function ($scope, $rootScope, $state, searchService, company, $ionicModal, map, routeService, COMPANY_STYLE, subscriptionSrv) {

    $scope.list;

    $scope.$on('$ionicView.enter', function (e) {
        $scope.$emit('menu:drag', false);
        var list = searchService.getResultSearch();
        if (typeof  list == "object" && list.hasOwnProperty("items")) {
            $scope.list = list.items;
        }
    });

    $scope.$on('$ionicView.beforeLeave', function (e) {
        //resetear los estados, sólo cuando no va a ver el mapa.
        if ($state.current.name != 'app.map') {
            map.deleteRouteLines().then(function () {
                routeService.resetRoutes();
                $scope.showRoute = false; //controla la visualización de todos los botones
                $scope.routeMode = false; //modo de crear ruta
                $scope.viewRoute = false; //modo de visualizar ruta
            });
        }
    });

    $scope.showDetail = function (id) {
        company(localStorage.getItem('accessToken')).getCompany({'company': id}).$promise.then(function (response) {
            var res = subscriptionSrv.validateSubscription('búsquedas');
            if (res == true){
                console.info('expired subscription');
            }else{
                console.info('response company', response);
                var modalScope = $rootScope.$new();
                modalScope.title = response.company.social_reason;
                modalScope.socialObject = response.company.social_object;
                modalScope.companyId = response.company.id;
                modalScope.address = response.company.address;
                modalScope.phoneNumber = response.company.phone_number;
                if (typeof response.company.style != 'undefined')
                    modalScope.style = response.company.style;
                else
                    modalScope.style = 'RED';
                modalScope.latitude = response.company.latitude;
                modalScope.longitude = response.company.longitude;

                modalScope.initializeMap = function () {
                    console.info('initializeMap...');
                    var position = new google.maps.LatLng(modalScope.latitude, modalScope.longitude);
                    setTimeout(function () {

                        var div = document.getElementById("map_canvas_detail");
                        modalScope.mapDetail = new google.maps.Map(div, {
                            center: position,
                            zoom: 13,
                            disableDefaultUI: true
                        });

                        new google.maps.Marker({
                            position: position,
                            map: modalScope.mapDetail,
                            title: modalScope.title,
                            icon: COMPANY_STYLE.COLOR[modalScope.style]
                        });
                    }, 2000);
                };

                modalScope.closeDetail = function () {
                    modalScope.modal.remove();
                };

                modalScope.$on('modal.hidden', function () {
                    modalScope.$on('$destroy', function () {
                        modalScope.mapDetail = null;
                    });
                });

                $ionicModal.fromTemplateUrl('templates/company-detail.html', {
                    scope: modalScope,
                    animation: 'slide-in-up',
                    hardwareBackButtonClose: false
                }).then(function (modal) {
                    modalScope.modal = modal;
                    modalScope.modal.show();
                });
            }
        });
    }
});
