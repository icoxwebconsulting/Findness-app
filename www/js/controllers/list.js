app.controller('ListCtrl', function ($scope, $rootScope, $state, searchService, company) {

    $scope.list;

    $scope.$on('$ionicView.enter', function (e) {
        $scope.$emit('menu:drag', false);
        var list = searchService.getResultSearch();
        if (typeof  list == "object" && list.hasOwnProperty("items")) {
            $scope.list = list.items;
        }
    });

    $scope.showDetail = function (id) {
        company(localStorage.getItem('accessToken')).getCompany({'company': companyId}).$promise.then(function (response) {
            console.log(response);
        });

        $ionicModal.fromTemplateUrl('templates/company-detail.html', {
            scope: modalScope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            modalScope.modal = modal;
            modalScope.modal.show();
        });
    }
});
