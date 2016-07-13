app.service('map', function ($ionicModal, $rootScope, company, COMPANY_STYLE) {

    //var map;
    var markers = [];
    var markerCluster;

    function init(div, location, zoom) {
        map = new google.maps.Map(div, {
            center: location,
            zoom: zoom,
            disableDefaultUI: true
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


    function infoWindowOpen(marker, title, socialObject, companyId, style) {

        var modalScope = $rootScope.$new();
        modalScope.marker = marker;
        modalScope.title = title;
        modalScope.socialObject = socialObject;
        modalScope.companyId = companyId;
        modalScope.style = style;

        modalScope.changeStyle = function (marker, color, companyId) {
            modalScope.style = color;
            marker.setIcon(COMPANY_STYLE.COLOR[color]);
            company(localStorage.getItem('accessToken')).companyStyle({'company': companyId}, {'style': color}).$promise.then(function (response) {
                console.log(response);
            });
        };

        $ionicModal.fromTemplateUrl('templates/company-info.html', {
            scope: modalScope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            modal.show();
        });

    }

    function addMaker(position, title, socialObject, companyId, style) {

        var marker = new google.maps.Marker({
            position: position,
            map: map,
            title: title,
            icon: COMPANY_STYLE.COLOR[style]
        });

        marker.addListener('click', function () {
            infoWindowOpen(marker, title, socialObject, companyId, style);
        });

        markers.push(marker);
    }

    function processMakers(items) {
        //borro las anteriores
        deleteMarkers();
        if (markerCluster) {
            markerCluster.clearMarkers();
        }

        for (var item in items) {

            if (typeof items[item].style != 'undefined')
                var style = items[item].style;
            else
                var style = 'RED';

            addMaker(
                new google.maps.LatLng(items[item].latitude, items[item].longitude),
                items[item].socialReason,
                items[item].socialObject,
                items[item].id,
                style
            )
        }
        markerCluster = new MarkerClusterer(map, markers, {
            maxZoom: 10,
            imagePath: 'lib/js-marker-clusterer/images/m'});
    }

    function moveCamera(lat, long, zoom) {
        map.setCenter(new google.maps.LatLng(lat, long));
        map.setZoom(zoom);
    }

    function clear() {
        deleteMarkers();
    }

    function resize() {
        console.log("ejecutando resize");
        google.maps.event.trigger(map, 'resize')
    }

    function getMap() {
        return map;
    }

    return {
        init: init,
        processMakers: processMakers,
        moveCamera: moveCamera,
        clear: clear,
        resize: resize,
        getMap: getMap
    };
});