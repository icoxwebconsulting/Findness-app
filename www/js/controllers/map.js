app.controller('MapCtrl', function ($scope, $state, $ionicPlatform, $ionicModal, map, filterSrv) {

    $scope.selectedFilter = 'Toque para seleccionar';

    $scope.$on('$ionicView.enter', function (e) {
        var selected = filterSrv.getSelectedFilter();
        if (selected != undefined) {
            if (selected == 'A') {
                $scope.selectedFilter = 'Localización actual';
            } else if (selected == 'B') {
                $scope.selectedFilter = 'Radio';
            } else if (selected == 'C') {
                $scope.selectedFilter = 'Seleccionar punto';
            } else if (selected == 'D') {
                $scope.selectedFilter = 'Códigos CNAE: ' + filterSrv.getSelectedCnaes();
            }
        }
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

            map.addEventListener(map, 'click', function (e) {
                console.log("click en el mapa")
                if (!marker) {
                    marker = new google.maps.Marker({map: map});
                }

                marker.setPosition(e.latLng);
            });
        }
    });

    $scope.search = function () {

    }

    $scope.chooseFilter = function () {
        $state.go("app.filter");
    }

    $scope.closeModal = function () {
        $scope.modal.hide()
    }
});
