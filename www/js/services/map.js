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

    function addMaker(position, title, socialObject) {
        map.addMarker({
            'position': position,
            'title': title,
            'snippet': socialObject,
            'markerClick': function (marker) {
                //console.log("hice clic en la marca", position);
                //TODO: agregar función para armar ruta
                marker.showInfoWindow();
            },
            'infoClick': function (marker) {
                console.log("click en infoWindow")
            }
        });
    }

    function processMakers(items) {
        for (var item in items) {
            addMaker(
                new plugin.google.maps.LatLng(items[item].latitude, items[item].longitude),
                items[item].social_reason,
                items[item].social_object
            )
        }
    }

    function moveCamera(lat, long, zoom) {
        map.moveCamera({
            'target': new plugin.google.maps.LatLng(lat, long),
            'zoom': zoom,
            'tilt': 0
        }, function () {
            //
            console.log("CAMARA SE HA DESPLAZADO");
        });
    }

    function setClickable(bool) {
        map.setClickable(bool);
    }

    return {
        init: init,
        processMakers: processMakers,
        moveCamera: moveCamera,
        setClickable: setClickable
    };
});
