app.controller('CompaniesCtrl', function ($rootScope, $scope, list, $state, $stateParams, $ionicModal, $ionicPopup) {


    if ($state.current.name == 'app.companies-detail') {
        list(localStorage.getItem('accessToken')).getById({'list':$stateParams.id}).$promise.then(function (response) {
            console.info('companies', response);
            $scope.companies = response;
            $scope.listId = $stateParams.id;
            $scope.listName = $stateParams.name;
        });
    }

    $scope.openShare = function(id){
        var modalScope = $rootScope.$new();

        modalScope.validateEmail = function(email) {
            var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
            return pattern.test(email);
        };

        modalScope.share = function(obj){
            if (!obj.username || !modalScope.validateEmail(obj.username)) {
                $ionicPopup.alert({
                    title: "Ingrese un correo electrónico valido"
                });
            }else{
                list(localStorage.getItem('accessToken')).share({'list':modalScope.listId, 'username':obj.username}).$promise.then(function (response) {
                    modalScope.modal.hide();
                });
            }
        };

        modalScope.listId = $scope.listId;
        modalScope.listName = $scope.listName;
        modalScope.id = id;
        modalScope.username ='nestor';
        $ionicModal.fromTemplateUrl('templates/companies-share.html', {
            scope: modalScope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            modalScope.modal = modal;
            modalScope.modal.show();
        });
    };

    $scope.showDetail = function(id, name){
        $state.go('app.companies-detail', {'id': id, 'name':name});
    };

    $scope.init = function(){
        $scope.$emit('menu:drag', true);
        list(localStorage.getItem('accessToken')).getList().$promise.then(function (response) {
            console.log('response lists', response);
            $scope.lists = response;
        });
    };

    $scope.init();


});
