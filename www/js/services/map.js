app.service('map', function ($ionicModal, $rootScope, company, routeService, searchService, COMPANY_STYLE, $ionicPopup) {

    //var map;
    var markers = [];
    var markerCluster;
    /* cada elemento en paths posee:
     {
         startId: response.startId,
         endId: response.endId,
         nextId: null,
         polyline: routePath
     }
     * */
    var paths = {};//la clave del objeto es el punto de llegada, el único que no debe estar aqui es el primero

    function init(div, location, zoom) {
        directionsDisplay = new google.maps.DirectionsRenderer();
        map = new google.maps.Map(div, {
            center: location,
            zoom: zoom,
            disableDefaultUI: true
        });
        directionsDisplay.setMap(map);
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

    function infoWindowOpen(marker, title, socialObject, companyId, address, phoneNumber, style, position) {

        var modalScope = $rootScope.$new();
        modalScope.marker = marker;
        modalScope.title = title;
        modalScope.socialObject = socialObject;
        modalScope.companyId = companyId;
        modalScope.style = style;
        var modes = routeService.getModes();
        if (modes.routeMode || modes.viewRoute) {
            modalScope.routeMode = true
        } else {
            modalScope.routeMode = false;
        }
        modalScope.routeName = routeService.getRouteName();
        modalScope.isAddedd = routeService.existPoint(companyId);
        modalScope.address = address;
        modalScope.phoneNumber = phoneNumber;

        modalScope.addToRoute = function () {
            if (routeService.addPoint({
                    id: companyId,
                    position: position
                })) {
                modalScope.isAddedd = true;
            }
        };

        modalScope.removePoint = function (id) {
            if (routeService.removePoint(id)) {
                modalScope.isAddedd = false;
            }
        };

        modalScope.closeDetail = function () {
            modalScope.modal.hide();
        };



        modalScope.initializeMap = function() {
            console.info('initializeMap...');

            setTimeout(function(){
                console.info('2 segundos despues...');

                var div = document.getElementById("map_canvas_detail");
                modalScope.mapDetail = new google.maps.Map(div, {
                    center: position,
                    zoom: 13,
                    disableDefaultUI: true
                });

                new google.maps.Marker({
                    position: position,
                    map: modalScope.mapDetail,
                    title: title,
                    icon: COMPANY_STYLE.COLOR[modalScope.style]
                });
            }, 2000);
        };

        modalScope.showMyLocation = function() {

            navigator.geolocation.getCurrentPosition(function (position) {
                var myPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                new google.maps.Marker({
                    position: myPosition,
                    map: modalScope.mapDetail,
                    icon: 'img/map/my-location-icon.png',
                    optimized: false,
                    zIndex: 5
                });
                modalScope.mapDetail.setZoom(16);
                modalScope.mapDetail.setCenter(myPosition);
            }, function (e) {
                $ionicPopup.show({
                    template: '<p style="color:#000;">Para poder usar tu ubicación debes tener datos o activado tu gps.</p>',
                    title: 'Active su GPS',
                    buttons: [
                        {
                            text: '<b>Aceptar</b>',
                            type: 'button-positive'
                        }
                    ]
                });
            });


        };


        modalScope.openDetail = function () {
            $ionicModal.fromTemplateUrl('templates/company-detail.html', {
                scope: modalScope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                modalScope.modal = modal;
                modalScope.modal.show();
            });
        };



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

    function addMaker(position, title, socialObject, companyId, address, phoneNumber, style) {

        var marker = new google.maps.Marker({
            position: position,
            map: map,
            title: title,
            icon: COMPANY_STYLE.COLOR[style]
        });

        marker.addListener('click', function () {
            infoWindowOpen(marker, title, socialObject, companyId, address, phoneNumber, style, position);
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
            var position;
            if (typeof items[item].position != "undefined") {
                position = new google.maps.LatLng(items[item].position.lat, items[item].position.lng);
            } else {
                position = new google.maps.LatLng(items[item].latitude, items[item].longitude);
            }
            addMaker(
                position,
                items[item].socialReason,
                items[item].socialObject,
                items[item].id,
                items[item].address,
                items[item].phoneNumber,
                style
            )
        }
        markerCluster = new MarkerClusterer(map, markers, {
            maxZoom: 10,
            imagePath: 'lib/js-marker-clusterer/images/m'
        });
    }

    function moveCamera(lat, long, zoom) {
        console.log("moviendo la camara", lat, long, zoom, typeof lat, typeof long, typeof zoom);
        map.setCenter(new google.maps.LatLng(lat, long));
        map.setZoom(zoom);
    }

    function clear() {
        deleteMarkers();
    }

    function resize() {
        console.log("ejecutando resize");
        google.maps.event.trigger(map, 'resize');
    }

    function getMap() {
        return map;
    }

    $rootScope.$on('drawDirections', function (e, response) {
        drawDirections(response)
    });

    $rootScope.$on('deletePath', function (e, response) {
        var data = paths[response.deleteId];
        var anterior = paths[data.startId];
        anterior.endId = data.endId;
        paths[data.startId] = anterior;
        if (data.nextId) {
            paths[data.nextId].startId = data.startId;
            var siguiente = paths[data.nextId];
            siguiente.polyline.setMap(null);
            var startId = paths[data.nextId].startId;
            var endId = paths[data.nextId].endId;
            var results = searchService.getResultSearch();//nota: se está seteando resultSearch así no se haya hecho búsqueda (caso visualizar ruta)
            var pathStart = results.items[startId];
            var pathEnd = results.items[endId];
            if (pathStart && pathEnd) {
                pathStart = new google.maps.LatLng(pathStart.latitude, pathStart.longitude);
                pathEnd = new google.maps.LatLng(pathEnd.latitude, pathEnd.longitude);
                routeService.requestRoute(pathStart, pathEnd).then(function (theRoute) {
                    drawDirections({
                        startId: startId,
                        endId: endId,
                        path: theRoute
                    })
                })
            }
        }
        data.polyline.setMap(null);
        delete paths[response.deleteId];

    });

    function drawDirections(response) {
        //directionsDisplay.setDirections(result);
        var routePath = new google.maps.Polyline({
            path: response.path,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 3
        });
        paths[response.endId] = {
            startId: response.startId,
            endId: response.endId,
            nextId: null,
            polyline: routePath
        };
        var element = paths[response.startId];
        if (element) {
            element.nextId = response.endId;
            paths[response.startId] = element;
        }
        routePath.setMap(map);
    }

    return {
        init: init,
        processMakers: processMakers,
        moveCamera: moveCamera,
        clear: clear,
        resize: resize,
        getMap: getMap,
        drawDirections: drawDirections
    };
});