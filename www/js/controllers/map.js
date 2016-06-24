app.controller('MapCtrl', function ($scope, $rootScope, $state, $ionicPlatform, $ionicModal, $ionicPopup, map, searchService) {

    $scope.showPopUp = false;

    $scope.$on('$ionicView.enter', function (e) {
        if(window.localStorage.getItem('firstTime')){
            window.localStorage.removeItem('firstTime');
            $state.go('app.filter');
            return;
        }
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

    $rootScope.$on('processMarkers', function (e, query) {
        proccessMarkers(query);
    });

    function proccessMarkers(query) {
        var result = searchService.getResultSearch();
        map.processMakers(result.items);
        if(query){
            map.moveCamera(query.geoLocations.latitude, query.geoLocations.longitude, 15);
        }
    }

    function showPopUp() {
        var query = searchService.getLastQuery();
        if(query){
            query = JSON.parse(query);
        }
        proccessMarkers(query);
        map.setClickable(false);
        var myPopup = $ionicPopup.show({
            template: '<div>Existen {{data.toBuy}} resultados que puede adquirir.</div>',
            title: 'Findness',
            subTitle: 'Resultados',
            scope: $scope,
            buttons: [
                {
                    text: 'Comprar',
                    type: 'button-positive',
                    onTap: function (e) {
                        //ir al carrito
                        map.setClickable(true);
                        $state.go("app.cart");
                        console.log("HIZO CLIC 1")
                        return true;
                    }
                },
                {
                    text: 'Ver anteriores',
                    type: 'button-positive',
                    onTap: function (e) {
                        console.log("HIZO CLIC 2")
                        map.setClickable(true);
                        myPopup.close();
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
