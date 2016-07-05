app.service('map', function () {

    //var map;
    var markers = [];

    function init(div, location, zoom) {
        map = new google.maps.Map(div, {
            center: location,
            zoom: zoom
        });
    }

    function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }

    function clearMarkers() {
        setMapOnAll(null);
    }

    function deleteMarkers() {
        clearMarkers();
        markers = [];
    }

    function addMaker(position, title, socialObject) {

        var marker = new google.maps.Marker({
            position: position,
            map: map,
            title: title
        });

        markers.push(marker);
    }

    function processMakers(items) {
        for (var item in items) {
            addMaker(
                new google.maps.LatLng(items[item].latitude, items[item].longitude),
                items[item].socialReason,
                items[item].socialObject
            )
        }
        //var markerCluster = new MarkerClusterer(map, markers, {imagePath: 'images/m'});
    }

    function moveCamera(lat, long, zoom) {
        map.setCenter(new google.maps.LatLng(lat, long));
        map.setZoom(zoom);
    }

    function clear() {
        deleteMarkers();
    }

    function resize() {
        google.maps.event.trigger(map,'resize')
    }

    return {
        init: init,
        processMakers: processMakers,
        moveCamera: moveCamera,
        clear: clear,
        resize: resize
    };
});
