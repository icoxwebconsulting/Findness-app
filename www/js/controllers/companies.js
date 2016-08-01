app.controller('CompaniesCtrl', function ($scope, list) {

    $scope.init = function(){
        $scope.$emit('menu:drag', true);
        list(localStorage.getItem('accessToken')).getList().$promise.then(function (response) {
            console.log('response company', response);
        });
    };

    $scope.init();


});
