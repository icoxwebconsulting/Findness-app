app.controller('SlidesCtrl', function ($scope, $state) {

    $scope.options = {
        loop: false,
        effect: 'slide',
        speed: 500,
    }
    $scope.data = {};

    $scope.$watch('data.slider', function (nv, ov) {
        $scope.slider = $scope.data.slider;
    });

    $scope.goToPage = function (page) {
        console.log(page);
        $state.go(page);
    }

});
