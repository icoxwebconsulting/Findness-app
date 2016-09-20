app.controller('SlidesCtrl', function ($scope, $state) {

    $scope.options = {
        //autoplay: true,
        loop: true,
        effect: 'slide',
        speed: 1000
    };

    $scope.data = {};

    $scope.$watch('data.slider', function (nv, ov) {
        $scope.slider = $scope.data.slider;
    });

    $scope.goToPage = function (page) {
        console.log(page);
        $state.go(page);
    }

});
