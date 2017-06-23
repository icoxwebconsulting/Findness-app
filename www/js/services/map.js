app.service('map', function ($q, $ionicModal, $rootScope, $ionicLoading, company, routeService, searchService, COMPANY_STYLE, $ionicPopup, subscriptionSrv, $state, $http, userDatastore) {

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
    var paths = {};
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
        if (markerCluster) {
            markerCluster.clearMarkers();
        }
        try {
            if (myLocation) {
                myLocation.setMap(null);
                myLocation = null;
            }
        } catch (e) {
            console.error(e);
        }
    }

    function infoRouteModal(){
        var type = {
            'WALKING': 'A pie',
            'DRIVING': 'En automóvil',
            'TRANSIT': 'Transporte público'
        };
        var modalScope = $rootScope.$new();
        modalScope.name = routeService.getRouteName();
        modalScope.transport = type[routeService.getRouteTransport()];
        modalScope.distance = 0;
        modalScope.duration = 0;
        modalScope.counter = 0;
        for (var p in paths) {
            var temp = paths[p]["data"]["distance"];
            modalScope.distance += parseFloat((temp) ? temp : 0);
            temp = paths[p]["data"]["duration"];
            modalScope.duration += parseFloat((temp) ? temp : 0);
            modalScope.counter += 1;
        }

        var infoRoute = {};

        infoRoute["name"] = modalScope.name;
        infoRoute["transport"] = modalScope.transport;
        infoRoute["distance"] = modalScope.distance;
        infoRoute["duration"] = modalScope.duration;
        infoRoute["counter"] = modalScope.counter;

        userDatastore.setModalInfo(JSON.stringify(infoRoute));

        //Muestra información de la ruta
        $ionicModal.fromTemplateUrl('templates/route-info.html', {
            scope: modalScope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            modal.show();
        });
    }

    function infoRoute() {
        var type = {
            'WALKING': 'A pie',
            'DRIVING': 'En automóvil',
            'TRANSIT': 'Transporte público'
        };
        var modalScope = $rootScope.$new();
        modalScope.name = routeService.getRouteName();
        modalScope.transport = type[routeService.getRouteTransport()];
        modalScope.distance = 0;
        modalScope.duration = 0;
        modalScope.counter = 0;
        for (var p in paths) {
            var temp = paths[p]["data"]["distance"];
            modalScope.distance += parseFloat((temp) ? temp : 0);
            temp = paths[p]["data"]["duration"];
            modalScope.duration += parseFloat((temp) ? temp : 0);
            modalScope.counter += 1;
        }

        var infoRoute = {};

        infoRoute["name"] = modalScope.name;
        infoRoute["transport"] = modalScope.transport;
        infoRoute["distance"] = modalScope.distance;
        infoRoute["duration"] = modalScope.duration;
        infoRoute["counter"] = modalScope.counter;

        userDatastore.setModalInfo(JSON.stringify(infoRoute));

        //Muestra información de la ruta
        $ionicModal.fromTemplateUrl('templates/route-info.html', {
            scope: modalScope,
            animation: 'slide-in-up'
        }).then(function (modal) {
//            modal.show();
        });
        $state.go('app.orderRoutes');
    }

    function infoWindowOpen(marker, title, socialObject, companyId, address, phoneNumber, style, position, cif, billing, employees, cnae, sector) {
        var nameSector = sectorSelected(sector);
        var modalScope = $rootScope.$new();
        modalScope.marker = marker;
        modalScope.title = title;
        modalScope.socialObject = socialObject;
        modalScope.companyId = companyId;
        modalScope.style = style;
        modalScope.cif = cif;
        modalScope.billing = billing;
        modalScope.employees = employees;

        if(typeof cnae !== 'undefined' && cnae.length > 1)
            modalScope.sector = nameSector +' (cnae ' + cnae + ')';
        else
        {
            if(nameSector.length > 1)
                modalScope.sector = nameSector;
            else
                modalScope.sector = '---';
        }


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
            $ionicLoading.show({
                template: '<p>Agregando punto...</p><p><ion-spinner icon="android"></ion-spinner></p>'
            });
            routeService.addPoint({
                id: companyId,
                position: position,
                marker: modalScope.marker
            }).then(function (nro) {
                $ionicLoading.hide();
                modalScope.isAddedd = true;
                modalScope.marker.setIcon(COMPANY_STYLE.NUM + nro + '.png');
                modalScope.thisModal.hide();
            }).catch(function (e) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Findness - Error',
                    template: 'No se ha podido agregar la empresa a la ruta'
                });
                console.error(e);
            });
        };

        modalScope.removePoint = function (id) {
            deletePath(id).then(function () {
                modalScope.isAddedd = false;
                modalScope.marker.setIcon(COMPANY_STYLE.COLOR['RED']);
            });
        };

        modalScope.closeDetail = function () {
            modalScope.modal.remove();
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

        modalScope.$on('modal.hidden', function () {
            modalScope.$on('$destroy', function () {
                modalScope.mapDetail = null;
            });
        });

        modalScope.showMyLocation = function () {
            checkLocation(function () {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var myPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    new google.maps.Marker({
                        position: myPosition,
                        map: modalScope.mapDetail,
                        icon: 'img/map/current_location.gif',
                        optimized: false,
                        zIndex: -1
                    });
                    modalScope.mapDetail.setZoom(16);
                    modalScope.mapDetail.setCenter(myPosition);
                }, function (e) {
                    $ionicPopup.alert({
                        title: 'Findness - Ubicación',
                        template: '<p>Ocurrió un error al obtener su localización: ' + e + '</p>',
                    });
                });
            })
        };

        modalScope.openDetail = function () {
            var res = subscriptionSrv.validateSubscription('búsquedas');
            if (res == true){
                modalScope.thisModal.remove();
            }else{
                $ionicModal.fromTemplateUrl('templates/company-detail.html', {
                    scope: modalScope,
                    animation: 'slide-in-up',
                    hardwareBackButtonClose: false
                }).then(function (modal) {
                    modalScope.modal = modal;
                    modalScope.modal.show();
                });
            }
        };

        modalScope.navigateTo = function () {
            checkLocation(function () {
                $ionicLoading.show({
                    template: '<p>Obteniendo localización...</p><p><ion-spinner icon="android"></ion-spinner></p>'
                });
                navigator.geolocation.getCurrentPosition(function (gps) {
                    $ionicLoading.hide();
                    launchnavigator.navigate(position.lat() + ',' + position.lng(), {
                        start: gps.coords.latitude + ',' + gps.coords.longitude
                    });
                }, function (e) {
                    console.log(e);
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: "Findness",
                        template: 'No se pudo obtener su localización.'
                    });
                });
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
            modalScope.thisModal = modal;
            modal.show();
        });

    }

    function addMaker(position, title, socialObject, companyId, address, phoneNumber, style, isNumeric, cif, billing, employees, cnae, sector) {

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
            infoWindowOpen(marker, title, socialObject, companyId, address, phoneNumber, style, position, cif, billing, employees, cnae, sector);
        });

        if (isNumeric) {
            routeService.addMarkerToPoint(companyId, marker);
        }
        markers.push(marker);
    }

    var myLocation;

    function showMyLocation(position) {
        myLocation = new google.maps.Marker({
            position: position,
            map: map,
            icon: 'img/map/my-location-icon.png',
            optimized: false,
            zIndex: -1
        });

        myLocation.addListener('click', function () {
            map.setZoom(17);
            map.setCenter(myLocation.getPosition());
        });
    }

    function deleteRouteLines() {
        var deferred = $q.defer();
        try {
            for (var idx in paths) {
                if (paths[idx].polyline) {
                    paths[idx].polyline.setMap(null);
                }
            }
            paths = {};
            deferred.resolve();
        } catch (e) {
            console.log("error en borrar path del mapa", e);
            deferred.reject();
        }

        return deferred.promise;
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
                var style = '';

                if (items[item].freelance == 'NO'){
                    style = 'COMPANY';
                }else if(items[item].freelance == 'SI'){
                    style = 'FREELANCE';
                }else {
                    style = 'COMPANY';
                }
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
                isNumeric,
                items[item].cif,
                items[item].billing,
                items[item].employees,
                items[item].cnae,
                items[item].sector
            );
            nro += 1;
        }
        markerCluster = new MarkerClusterer(map, markers, {
            maxZoom: 13,
            imagePath: 'lib/js-marker-clusterer/images/m'
        });
    }

    function moveCamera(lat, long, zoom) {
        console.log("moviendo la camara", lat, long, zoom);
        map.setCenter(new google.maps.LatLng(lat, long));
        if( typeof zoom !== 'undefined')
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

    function deletePath(id) {
        var deferred = $q.defer();

        if (paths[id]["previous"] == null) {
            //es el primero

            // el siguiente en previous debe tener null
            var next = paths[id]["next"];
            paths[next]["previous"] = null;
            //borro la polyline del mapa
            paths[next].polyline.setMap(null);
            paths[next].polyline = null;
            //ahora borro el nodo
            delete paths[id];
            if (routeService.removePoint(id)) {
                routeService.reDrawMarkers();
            }
            deferred.resolve();
        } else {
            //es uno intermedio
            //actualizo el enlace next del anterior hacia el nodo siguiente
            var previous = paths[id]["previous"];
            paths[previous]["next"] = paths[id]["next"];
            //actualizo el enlace de previous del anterior hacia el nodo anterior
            var next = paths[id]["next"];
            paths[id].polyline.setMap(null);
            delete paths[id];

            if (next == null) {
                //si es null es el último
                routeService.reDrawMarkers();
                routeService.removePoint(id);
                deferred.resolve();
            } else {
                paths[next]["previous"] = previous;
                //nota: se está seteando resultSearch así no se haya hecho búsqueda (caso visualizar ruta)
                var results = searchService.getResultSearch();
                var pathStart = results.items[next];
                var pathEnd = results.items[previous];
                pathStart = new google.maps.LatLng(pathStart.latitude, pathStart.longitude);
                pathEnd = new google.maps.LatLng(pathEnd.latitude, pathEnd.longitude);
                routeService.requestRoute(pathStart, pathEnd).then(function (routeData) {
                    drawDirections(
                        next,
                        previous,
                        routeData.route, {
                            start: pathStart,
                            end: pathEnd,
                            distance: routeData.distance,
                            duration: routeData.duration
                        });

                    if (routeService.removePoint(id)) {
                        routeService.reDrawMarkers();
                    }
                    deferred.resolve();
                })
            }
        }
        return deferred.promise;
    }

    function polylinePopup(data, startId, endId) {
        // google.maps.event.addListener(routePath.polyline, 'click', function (a) {
        // });
        try {
            var search = searchService.getResultSearch().items;
            var template = "<p>De <b>" + search[startId]["socialReason"] + "</b> <br>Hasta <b>" + search[endId]["socialReason"] + "</b></p>";
            template += "<p>Recorrerá <b>" + data.distance + "</b> en un tiempo de <b>" + data.duration + "</b>.</p><p>Puede visualizar la ruta en su aplicación de Mapas.</p>";
            var confirmPopup = $ionicPopup.confirm({
                title: 'Findness',
                template: template,
                buttons: [
                    {
                        text: '<b>Navegar</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            checkLocation(function () {
                                //activo
                                launchnavigator.navigate(data.end.lat() + ',' + data.end.lng(), {
                                    start: data.start.lat() + ',' + data.start.lng()
                                });
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

    $rootScope.$on('addToRoutePath', function (e, response) {
        //startId: elemento anterior, endId: elemento actual
        paths[response.node] = {
            next: response.next,
            previous: response.previous,
            polyline: null,
            data: response.data
        };

        if (response.previous) {
            paths[response.previous]["next"] = response.node;
            //si el anterior existe
            drawDirections(response.node, response.previous, response.path, response.data)
        }
        console.log("PATHS despues de agregar", paths);
    });

    function drawDirections(node, previous, path, data) {
        //directionsDisplay.setDirections(result);
        var strokeOpacity;

        if (userDatastore.getRouteValid()){
            strokeOpacity = 0.0;
        }else {
            strokeOpacity = 1.0;
        }
        var routePath = new google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeColor: '#713d70',
            strokeOpacity: strokeOpacity,
            strokeWeight: 3
        });

        //startId: elemento anterior, endId: elemento actual
        routePath.setMap(map);
        if (paths[node]['polyline']) {
            paths[node]['polyline'].setMap(null);
        }
        paths[node]['polyline'] = routePath;


        //agrego listener al elemento actual
        paths[node].polyline.addListener('click', function () {
            //console.log(this, distance, duration)
            polylinePopup(data, previous, node);
        });
    }

    function setShowPopup(opt) {
        showPopup = opt;
    }

    function getShowPopup() {
        return showPopup;
    }

    function resetMap() {
        return deleteRouteLines().then(function () {
            deleteMarkers();
            searchService.resetResultSearch();
        });
    }

    function checkLocation(successCallback, cancelCallback) {
        cordova.plugins.diagnostic.isLocationEnabled(function (enabled) {
            if (!enabled) {
                $ionicPopup.show({
                    title: 'Findness - Ubicación',
                    template: '<p>El GPS está desactivado, debe activarlo para poder usar esta función.</p>',
                    buttons: [
                        {
                            text: '<b>Activar</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                cordova.plugins.diagnostic.switchToLocationSettings();
                            }
                        },
                        {
                            text: 'Cancelar',
                            onTap: function () {
                                if (typeof cancelCallback == 'function') {
                                    cancelCallback();
                                }
                            }
                        }
                    ]
                });
            } else {
                successCallback();
            }
        }, function (error) {
            $ionicPopup.alert({
                title: 'Findness - Ubicación',
                template: '<p>Ocurrió un error al obtener su localización: ' + error + '</p>',
            });
        });
    }

    function sectorSelected(sector) {
        var nameSector = '';
        switch (sector) {
            case "A":
                nameSector = "Agricultura, caza, silvicultura y pesca.eak";
                break;
            case "B":
                nameSector = "Industrias extractivas.";
                break;
            case "C":
                nameSector = "Industrias manufactureras.";
                break;
            case "D":
                nameSector = "Suministro de energía eléctrica, gas, vapor y aire acondicionado.";
                break;
            case "E":
                nameSector = "Suministro de agua, actividades de saneamiento, gestión de residuos y descontaminación.";
                break;
            case "F":
                nameSector = "Construcción.";
                break;
            case "G":
                nameSector = "Comercio al por mayor y menor, reparación de vehículos de motor y motocicletas.";
                break;
            case "H":
                nameSector = "Transporte y almacenamiento.";
                break;
            case "I":
                nameSector = "Hostelería.";
                break;
            case "J":
                nameSector = "Información y comunicaciones.";
                break;
            case "K":
                nameSector = "Actividades financieras y de seguros.";
                break;
            case "L":
                nameSector = "Actividades inmobiliarias.";
                break;
            case "M":
                nameSector = "Actividades profesionales científicas y técnicas.";
                break;
            case "N":
                nameSector = "Actividades administrativas y servicios auxiliares.";
                break;
            case "O":
                nameSector = "Administración Pública y defensa, seguridad social obligatoria.";
                break;
            case "P":
                nameSector = "Educación.";
                break;
            case "Q":
                nameSector = "Actividades sanitarias y de servicios sociales.";
                break;
            case "R":
                nameSector = "Actividades artísticas recreativas y de entretenimiento.";
                break;
            case "S":
                nameSector = "Otros Servicios.";
                break;
            case "T":
                nameSector = "Actividades De Los Hogares Como Empleadores De Personal Domestico; Actividades De Los Hogares Como Productores De Bienes Y Servicios Para Uso Propio";
                break;
            case "U":
                nameSector = "Actividades De Organizaciones Y Organismos Extraterritoriales";
                break;
            case "V":
                nameSector = "Desconocido o No Informado.";
                break;
        }
        return nameSector;
    }

    /*function sectorSelected(sector) {
        /!*$http({
            method: 'GET',
            url: '/someUrl'
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });*!/

        var deferred = $q.defer();
        $http.get('js/sectors.json',
            {header: {'Content-Type': 'application/json; charset=UTF-8'}}
        ).then(function (sectorArray) {
            for (i = 0; i < sectorArray.data.length; i++){
                var sectorSelected = sectorArray.data[i].id;
                if(sectorSelected == sector){
                    deferred.resolve(sectorArray.data[i].name);
                }
            }
        }).catch(function () {
            deferred.reject(false);
        });

        return deferred.promise;
    }*/

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
        deleteRouteLines: deleteRouteLines,
        showMyLocation: showMyLocation,
        infoRoute: infoRoute,
        resetMap: resetMap,
        checkLocation: checkLocation,
        sectorSelected: sectorSelected,
        infoRouteModal: infoRouteModal
    };
});
