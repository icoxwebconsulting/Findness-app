app.controller('MapCtrl', function ($scope, $state, $ionicPlatform) {

    console.log("corriendo MapCtrl");

    $ionicPlatform.ready(function () {
        console.log("plataforma lista");
        var div = document.getElementById("map_canvas");
        if (div) {
            // Initialize the map view
            map = plugin.google.maps.Map.getMap(div);

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
