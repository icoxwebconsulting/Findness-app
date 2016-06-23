app.controller('MapCtrl', function ($scope, $rootScope, $state, $ionicPlatform, $ionicModal, $ionicPopup, map, searchService) {

    $scope.showPopUp = false;

    $scope.$on('$ionicView.enter', function (e) {
        if ($scope.showPopUp) {
            $scope.showPopUp = false;
            showPopUp();
        }
    });

    $rootScope.$on('showResults', function (e, data) {
        $scope.data = data;
        if (data.showPopUp) {
            $scope.showPopUp = true;
        }
    });

    function showPopUp() {
        var myPopup = $ionicPopup.show({
            template: '<div>Usted tiene resultados por comprar</div>',
            title: 'Findness',
            subTitle: 'Resultados',
            scope: $scope,
            buttons: [
                {
                    text: 'Comprar',
                    type: 'button-positive',
                    onTap: function (e) {
                        //ir al carrito
                        return true;
                    }
                },
                {
                    text: 'Ver anteriores',
                    type: 'button-positive',
                    onTap: function (e) {
                        return true;
                    }
                }
            ]
        });
    }

    $ionicPlatform.ready(function () {
        var div = document.getElementById("map_canvas");
        if (div) {
            const SPAIN = new plugin.google.maps.LatLng(39.9997938, -3.1926017);

            map.init(div, SPAIN, 6);

            // Wait until the map is ready status.
            // map.addEventListener(plugin.google.maps.event.MAP_READY, function(){
            //     var button = document.getElementById("button");
            //     button.addEventListener("click", function () {
            //         map.showDialog();
            //     }, false);
            // });
            //var marker;

            // map.addEventListener(map, 'click', function (e) {
            //     console.log("click en el mapa")
            //     if (!marker) {
            //         marker = new google.maps.Marker({map: map});
            //     }
            //
            //     marker.setPosition(e.latLng);
            // });
        }
    });

    $scope.chooseFilter = function () {
        $state.go("app.filter");
    };

    $scope.closeModal = function () {
        $scope.modal.hide()
    }
});
