app.controller('MapCtrl', function ($scope, $rootScope, $state, $ionicPlatform, $ionicModal, map, filterSrv, searchSrv) {

    $scope.nameFilter = '';
    var selectedFilter;

    $scope.$on('$ionicView.enter', function (e) {
        var selectedFilter = filterSrv.getSelectedFilter();
        setFilter(selectedFilter);
    });

    function setFilter(selectedFilter) {
        if (selectedFilter && selectedFilter.type) {
            $scope.nameFilter = selectedFilter.name;
            //selectedFilter.type
            //1, Localización actual, 2 Radio, 3 Seleccionar punto, 4 CNAE
        }
    }

    $rootScope.$on('changeFilter', function (e, element) {
        console.log("obteniendo el nuevo filtro", element)
        setFilter(element.choice);
    });

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

    $scope.searchQualitas = function () {
        //obtengo el filtro
        //llamo a servicio de busqueda con filtro
        //proceso resultados
        navigator.geolocation.getCurrentPosition(function (position) {
            //position.coords.latitude
            //position.coords.longitude
            searchSrv.searchQualitas().then(function () {
                
            })
            
        }, function () {

        });
        
        
    };

    $scope.chooseFilter = function () {
        $state.go("app.filter");
    };

    $scope.closeModal = function () {
        $scope.modal.hide()
    }
});
