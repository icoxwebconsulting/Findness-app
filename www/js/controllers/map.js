app.controller('MapCtrl', function ($scope, $state, $ionicPlatform, map) {

    $ionicPlatform.ready(function () {
        console.log("plataforma lista");
        var div = document.getElementById("map_canvas");
        if (div) {
            const SPAIN = new plugin.google.maps.LatLng(39.9997938,-3.1926017);

            map.init(div, SPAIN, 6);
            

            // Wait until the map is ready status.
            // map.addEventListener(plugin.google.maps.event.MAP_READY, function(){
            //     var button = document.getElementById("button");
            //     button.addEventListener("click", function () {
            //         map.showDialog();
            //     }, false);
            // });
        }
    })


});
