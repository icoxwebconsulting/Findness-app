app.service('map', function ($ionicModal, $rootScope) {

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


    function infoWindowOpen(marker,title, socialObject){

        var modalScope = $rootScope.$new();
        modalScope.marker = marker;
        modalScope.title = title;
        modalScope.socialObject = socialObject;

        modalScope.changeStyle = function(marker,colorUrl){
            console.info('change style: ', marker);
            marker.setIcon(colorUrl);
        };

        $ionicModal.fromTemplateUrl('templates/company-info.html', {
            scope: modalScope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            modal.show();
        });

    }

    function addMaker(position, title, socialObject, style) {

        var marker = new google.maps.Marker({
            position: position,
            map: map,
            title: title,
            icon: style
        });

        marker.addListener('click', function() {
            infoWindowOpen(marker,title, socialObject);
        });

        markers.push(marker);
    }

    function processMakers(items) {
        for (var item in items) {

            if (typeof items[item].style != 'undefined')
                var style = items[item].style;
            else
                var style = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';

            addMaker(
                new google.maps.LatLng(items[item].latitude, items[item].longitude),
                items[item].socialReason,
                items[item].socialObject,
                style
            )
        }
        var markerCluster = new MarkerClusterer(map, markers, {imagePath: 'lib/js-marker-clusterer/images/m'});
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