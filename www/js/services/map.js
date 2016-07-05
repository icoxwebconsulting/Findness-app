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
        console.info('title: ',title, ' - socialObject: ', socialObject);
        var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">'+title+'</h1>'+
            '<div id="bodyContent">'+
            '<p>'+socialObject+'</p>'+
            '</div>'+
            '</div>';
        map.addMarker({
            'position': position,
            'title': title,
            'snippet': contentString,
            'markerClick': function (marker) {
                console.log("hice clic en la marca", marker);
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
                items[item].socialReason,
                items[item].socialObject
            )
        }
        var markerCluster = new MarkerClusterer(map, markers, {imagePath: 'lib/js-marker-clusterer/images/m'});
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

    function clear() {
        map.clear();
    }

    return {
        init: init,
        processMakers: processMakers,
        moveCamera: moveCamera,
        setClickable: setClickable,
        clear: clear
    };
});
