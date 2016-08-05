app.service('map', function ($q, $ionicModal, $rootScope, company, routeService, searchService, COMPANY_STYLE, $ionicPopup) {

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
    var showPopup = false; //indica si se debe mostrar el popup en el mapa al tener resultados

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
            routeService.addPoint({
                id: companyId,
                position: position,
                marker: modalScope.marker
            }).then(function (nro) {
                modalScope.isAddedd = true;
                modalScope.marker.setIcon(COMPANY_STYLE.NUM + nro + '.png');
            });
        };

        modalScope.removePoint = function (id) {
            deletePath(id).then(function () {
                modalScope.isAddedd = false;
                modalScope.marker.setIcon(COMPANY_STYLE.COLOR['RED']);
            });
        };

        modalScope.closeDetail = function () {
            modalScope.modal.hide();
        };


        modalScope.initializeMap = function () {
            console.info('initializeMap...');

            setTimeout(function () {
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

        modalScope.showMyLocation = function () {

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

    function addMaker(position, title, socialObject, companyId, address, phoneNumber, style, isNumeric) {

        if (isNumeric) {
            var icon = COMPANY_STYLE.NUM + style + '.png';
        } else {
            var icon = COMPANY_STYLE.COLOR[style];
        }

        var marker = new google.maps.Marker({
            position: position,
            map: map,
            title: title,
            icon: icon
        });

        marker.addListener('click', function () {
            infoWindowOpen(marker, title, socialObject, companyId, address, phoneNumber, style, position);
        });

        markers.push(marker);
    }

    function deleteRouteLines() {
        try {
            for (var idx in paths) {
                paths[idx].polyline.setMap(null);
            }
            paths = {};
        } catch (e) {
            console.log("error en borrar path del mapa", e);
        }
    }

    function processMakers(items, isNumeric) {
        //borro las anteriores
        deleteMarkers();
        if (markerCluster) {
            markerCluster.clearMarkers();
        }
        var nro = 1;
        for (var item in items) {

            if (typeof items[item].style != 'undefined') {
                var style = items[item].style;
            } else {
                var style = 'RED';
            }

            if (isNumeric) {
                style = nro;
            }

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
                style,
                isNumeric
            );
            nro += 1;
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
        drawDirections({
                startId: response.startId,
                endId: response.endId,
                path: response.path
            }, {
                start: response.start,
                end: response.end
            },
            response.distance,
            response.duration
        )
    });

    function deletePath(id) {
        var deferred = $q.defer();
        console.log(paths)
        console.log(markers)
        var rmPath = paths[id];
        if (rmPath) {
            paths[rmPath.startId]["endId"] = rmPath.endId;//toma el anterior y le actualiza el próximo punto
        }
        if (rmPath && rmPath.nextId) {
            paths[rmPath.nextId].startId = rmPath.startId;
            var siguiente = paths[rmPath.nextId];
            siguiente.polyline.setMap(null);
            var startId = paths[rmPath.nextId].startId;
            var endId = paths[rmPath.nextId].endId;
            var results = searchService.getResultSearch();//nota: se está seteando resultSearch así no se haya hecho búsqueda (caso visualizar ruta)
            var pathStart = results.items[startId];
            var pathEnd = results.items[endId];
            if (pathStart && pathEnd) {
                pathStart = new google.maps.LatLng(pathStart.latitude, pathStart.longitude);
                pathEnd = new google.maps.LatLng(pathEnd.latitude, pathEnd.longitude);
                routeService.requestRoute(pathStart, pathEnd).then(function (routeData) {
                    drawDirections({
                            startId: startId,
                            endId: endId,
                            path: routeData.route
                        }, {
                            start: pathStart,
                            end: pathEnd
                        },
                        routeData.distance,
                        routeData.duration
                    );
                    rmPath.polyline.setMap(null);
                    delete paths[id];
                    deferred.resolve();
                })
            } else {
                rmPath.polyline.setMap(null);
                delete paths[id];
            }
            routeService.removePoint(id);
            routeService.reDrawMarkers();
        } else {
            deferred.resolve();
            routeService.removePoint(id);
        }

        return deferred.promise;
    };

    function polylinePopup(thePath, distance, duration, startId, endId) {
        // google.maps.event.addListener(routePath.polyline, 'click', function (a) {
        // });
        try {
            var search = searchService.getResultSearch().items;
            var template = "<p>De <b>" + search[startId]["socialReason"] + "</b> <br>Hasta <b>" + search[endId]["socialReason"] + "</b></p>";
            template += "<p>Recorrerá <b>" + distance + "</b> en un tiempo de <b>" + duration + "</b>.</p><p>Puede visualizar la ruta en su aplicación de Mapas.</p>";
            var confirmPopup = $ionicPopup.confirm({
                title: 'Findness',
                template: template,
                buttons: [
                    {
                        text: '<b>Navegar</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            launchnavigator.navigate(thePath.end.lat() + ',' + thePath.end.lng(), {
                                start: thePath.start.lat() + ',' + thePath.start.lng()
                            });
                        }
                    },
                    {text: 'Cerrar'}
                ]
            });
        } catch (e) {
            console.log(e);
        }
    }

    function drawDirections(response, thePath, distance, duration) {
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

        //agrego listener
        paths[response.endId].polyline.addListener('click', function () {
            //console.log(this, distance, duration)
            polylinePopup(thePath, distance, duration, response.startId, response.endId);
        });
        console.log("PATHS despues de agregar", paths);
    }

    function setShowPopup(opt) {
        showPopup = opt;
    }

    function getShowPopup() {
        return showPopup;
    }

    return {
        init: init,
        processMakers: processMakers,
        moveCamera: moveCamera,
        clear: clear,
        resize: resize,
        getMap: getMap,
        drawDirections: drawDirections,
        setShowPopup: setShowPopup,
        getShowPopup: getShowPopup,
        deleteRouteLines: deleteRouteLines
    };
});