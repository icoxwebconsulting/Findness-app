app.controller('CompaniesCtrl', function ($rootScope, $scope, $state, $stateParams, $ionicModal, $ionicPopup, list, map, searchService, company) {

    $scope.$on('$ionicView.enter', function (e) {
        $scope.init();
    });

    if ($state.current.name == 'app.companies-detail') {
        list(localStorage.getItem('accessToken')).getById({'list': $stateParams.id}).$promise.then(function (response) {
            $scope.companies = response;
            $scope.listId = $stateParams.id;
            $scope.listName = $stateParams.name;
        });
    }

    $scope.openShare = function (id) {
        var modalScope = $rootScope.$new();

        modalScope.validateEmail = function (email) {
            var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
            return pattern.test(email);
        };

        modalScope.share = function (obj) {
            if (!obj.username || !modalScope.validateEmail(obj.username)) {
                $ionicPopup.alert({
                    title: "Ingrese un correo electrónico valido"
                });
            } else {
                list(localStorage.getItem('accessToken')).share({
                    'list': modalScope.listId,
                    'username': obj.username
                }).$promise.then(function (response) {
                    $ionicPopup.alert({
                        title: "Se ha compartido la lista"
                    });
                    modalScope.modal.hide();
                }).catch(function (error) {
                    $ionicPopup.alert({
                        title: "No se pudo compartir la lista con el usuario"
                    });
                });
            }
        };

        modalScope.closeDetail = function () {
            modalScope.modal.hide();
        };

        modalScope.listId = $scope.listId;
        modalScope.listName = $scope.listName;
        modalScope.id = id;
        $ionicModal.fromTemplateUrl('templates/companies-share.html', {
            scope: modalScope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            modalScope.modal = modal;
            modalScope.modal.show();
        });
    };

    $scope.showDetail = function (id, name) {
        $state.go('app.companies-detail', {'id': id, 'name': name});
    };

    $scope.init = function () {
        $scope.$emit('menu:drag', true);
        list(localStorage.getItem('accessToken')).getList().$promise.then(function (response) {
            $scope.lists = response;
        });
    };

    $scope.reverseOrder = false;

    $scope.changeOrderDirection = function () {
        $scope.reverseOrder = !$scope.reverseOrder;
    };

    $scope.openInMap = function () {
        var lat = $scope.companies[0].latitude;
        var lng = $scope.companies[0].longitude;

        var items = {};
        for (var i = 0; i < $scope.companies.length; i++) {
            items[$scope.companies[i].id] = {
                address: $scope.companies[i].address,
                cif: $scope.companies[i].cif,
                id: $scope.companies[i].id,
                externalId: "",
                latitude: $scope.companies[i].latitude,
                longitude: $scope.companies[i].longitude,
                phoneNumber: $scope.companies[i].phone_number,
                socialObject: $scope.companies[i].social_object,
                socialReason: $scope.companies[i].social_reason
            };
        }

        searchService.setResultSearch({
            ElementosDevueltos: $scope.companies.length, //contiene el número de elementos que retorna la consulta para dicha pagina
            Pagina: 1,
            TotalElementosNoConsultados: 0,		//es la cantidad de elementos que no has pagado
            TotalElementos: $scope.companies.length,	//nro de todos los elementos pagados y sin pagar
            ElementosDevueltosNoConsultados: 0,	//son los elementos devueltos en dicha pagina que no habias pagado antes
            items: items
        });

        $state.go('app.map');
        setTimeout(function () {
            map.moveCamera(lat, lng, 9);
        }, 1500);
    };

    $scope.showCompanyDetail = function (id) {
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
