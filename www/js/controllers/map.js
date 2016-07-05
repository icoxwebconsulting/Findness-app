app.controller('MapCtrl', function ($scope, $rootScope, $state, $ionicPlatform, $ionicModal, $ionicPopup, map, searchService) {

    $scope.showPopUp = false;

    $scope.$on('$ionicView.enter', function (e) {
        // if (window.localStorage.getItem('firstTime')) {
        //     window.localStorage.removeItem('firstTime');
        //     $state.go('app.filter');
        //     return;
        // }
        if ($scope.showPopUp) {
            $scope.showPopUp = false;
            showPopUp();
        }
    });

    $rootScope.$on('showResults', function (e, data) {
        $scope.data = data;
        if (data.showPopUp) {
            $scope.showPopUp = true;
        }else{
            proccessMarkers(data.lastQuery);
        }
    });

    $rootScope.$on('processMarkers', function (e, query) {
        proccessMarkers(query.lastQuery);
    });

    function proccessMarkers(query) {
        map.resize();
        var result = searchService.getResultSearch();
        map.processMakers(result.items);
        if (query) {
            if (query.geoLocations == null) {
                for (var first in result.items) break;
                lat = result.items[first].latitude;
                lon = result.items[first].longitude;
            } else {
                var lat = query.geoLocations.latitude;
                var lon = query.geoLocations.longitude;
            }
            map.moveCamera(lat, lon, 7);
        }
    }

    function showPopUp() {
        var query = searchService.getLastQuery();
        if (query) {
            query = JSON.parse(query);
        }
        map.clear();
        proccessMarkers(query);
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
                        $state.go("app.cart");
                        return true;
                    }
                },
                {
                    text: 'Ver anteriores',
                    type: 'button-positive',
                    onTap: function (e) {
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
            const SPAIN = new google.maps.LatLng(39.9997938, -3.1926017);
            map.init(div, SPAIN, 6);
        }
    });

    $scope.chooseFilter = function () {
        $state.go("app.filter");
    };

    $scope.closeModal = function () {
        $scope.modal.hide()
    };

});
