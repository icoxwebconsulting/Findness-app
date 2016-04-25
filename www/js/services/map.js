app.service('map', function () {

    var map;

    function init(div, location, zoom) {
        map = plugin.google.maps.Map.getMap(div, {
            'camera': {
                'latLng': location,
                'zoom': zoom
            }
        });
    }

    return {
        init: init
    };
});
