app.controller('ListCtrl', function ($scope, $rootScope, $state, searchService, company, $ionicModal, COMPANY_STYLE) {

    $scope.list;

    $scope.$on('$ionicView.enter', function (e) {
        $scope.$emit('menu:drag', false);
        var list = searchService.getResultSearch();
        if (typeof  list == "object" && list.hasOwnProperty("items")) {
            $scope.list = list.items;
        }
    });

    $scope.showDetail = function (id) {
        company(localStorage.getItem('accessToken')).getCompany({'company': id}).$promise.then(function (response) {

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
                modalScope.modal.hide();
            };

            $ionicModal.fromTemplateUrl('templates/company-detail.html', {
                scope: modalScope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                modalScope.modal = modal;
                modalScope.modal.show();
            });
        });


    }
});
