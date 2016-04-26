app.controller('MapCtrl', function ($scope, $state, $ionicPlatform, $ionicModal, map) {

    $scope.selectedFilter = 'Toque para seleccionar';

    $scope.data = {};
    $scope.data.pickupAfter = 5;

    $scope.$on('$ionicView.enter', function (e) {
        $ionicModal.fromTemplateUrl('filters-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
    });

    $ionicPlatform.ready(function () {
        console.log("plataforma lista");
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
            var marker;

            map.addEventListener(map, 'click', function(e) {
                console.log("click en el mapa")
                if ( !marker ) {
                    marker = new google.maps.Marker({ map: map });
                }

                marker.setPosition(e.latLng);
            });
        }
    })

    $scope.chooseFilter = function () {
        $scope.modal.show();
    }
    
    $scope.closeModal = function () {
        $scope.modal.hide()
    }
});
