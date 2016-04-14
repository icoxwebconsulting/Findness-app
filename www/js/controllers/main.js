app.controller('MainCtrl', function ($scope, $ionicPlatform, $ionicSideMenuDelegate) {

    //$scope.isMenuOpen = $ionicSideMenuDelegate.isOpen.bind($ionicSideMenuDelegate);
    
    $scope.menuVisible = false;

    $ionicPlatform.onHardwareBackButton(function () {
        if ($ionicSideMenuDelegate.isOpen) {
            $scope.menuVisible = false;
        }
    });

    $scope.toggleMenu = function () {
        $scope.menuVisible = ! $scope.menuVisible;
    };
});
