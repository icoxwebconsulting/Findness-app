app.controller('CompaniesCtrl', function ($scope, list) {

    $scope.init = function(){
        list(localStorage.getItem('accessToken')).getList().$promise.then(function (response) {
            console.log('response', response);
        });
    };

    $scope.init();


});
