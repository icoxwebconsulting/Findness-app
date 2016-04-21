app.controller('MapCtrl', function ($scope, $state, $ionicPlatform) {

    console.log("corriendo MapCtrl");

    $ionicPlatform.ready(function () {
        console.log("plataforma lista");
        var div = document.getElementById("map_canvas");
        if (div) {
            const SPAIN = new plugin.google.maps.LatLng(39.9997938,-3.1926017);

            // Initialize the map view
            map = plugin.google.maps.Map.getMap(div, {
                'camera': {
                    'latLng': SPAIN,
                    'zoom': 6
                }
            });

            // Wait until the map is ready status.
            // map.addEventListener(plugin.google.maps.event.MAP_READY, function(){
            //     var button = document.getElementById("button");
            //     button.addEventListener("click", function () {
            //         map.showDialog();
            //     }, false);
            // });
        } else {
            console.log("el div no se trajo nada");
        }
    })


});
