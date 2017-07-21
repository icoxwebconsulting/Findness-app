app.service('routeService', function ($q, $rootScope, routes, userDatastore, COMPANY_STYLE, $state) {

    var directionsService = new google.maps.DirectionsService();
    var polylines = [];
    var arrayPointCurrent = [];
    var newPoints = [];
    var routeMode = false; //modo de crear ruta
    var viewRoute = false; //modo de visualizar ruta
    var route = {
        id: null, //mostrado al guardar la ruta
        isEdit: false,
        name: null,
        transport: null,
        lastPoint: null,
        points: {}
    };

    function reDrawMarkers() {
        try {
            var nro = 1;
            for (var p in route.points) {
                route.points[p]['marker'].setIcon(COMPANY_STYLE.NUM + nro + '.png');
                nro += 1;
            }
        } catch (e) {

        }
    }

    function requestRoute(start, end) {

        var request = {
            origin: start,
            destination: end,
            travelMode: route.transport
        };

        var deferred = $q.defer();

        var directionsDisplay = new google.maps.DirectionsRenderer;
        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById('right-panel'));
        directionsDisplay.setOptions( { suppressMarkers: true } );

        directionsService.route(request, function (response, status) {

            if (status == google.maps.DirectionsStatus.OK) {
                var theRoute = new Array();
                var gRoute = response.routes[0]['overview_path'];
                for (var s = 0; s < gRoute.length; s++) {
                    theRoute.push(new google.maps.LatLng(gRoute[s].lat(), gRoute[s].lng()));
                }

                console.info('CARGANDO texto', response);

                directionsDisplay.setDirections(response);

                deferred.resolve({
                    route: theRoute,
                    distance: response.routes[0]['legs'][0]['distance']['text'],
                    duration: response.routes[0]['legs'][0]['duration']['text']
                });
            } else {
                deferred.reject(status);
            }

        });

        return deferred.promise;
    }

    function drawRoute(route, color, width, geo) {

        var deferred = $q.defer();

        map.addPolyline({
            'points': route,
            'color': color,
            'width': width,
            'geodesic': geo
        }, function (polyline) {
            polylines.push(polyline);
            deferred.resolve(polyline);
        });

        return deferred.promise;
    }

    function getRouteMode() {
        return routeMode;
    }

    function getRouteName() {
        return route.name;
    }

    function getRouteTransport() {
        return route.transport;
    }

    // function setRouteMode(status) {
    //     routeMode = status;
    // }

    function initRoute(name, transport) {
        routeMode = true;
        route = {
            id: null,
            isEdit: false,
            name: name,
            transport: transport,
            lastPoint: null,
            points: {}
        };
        //reset de variables
        polylines = [];
    }

    function existPoint(id) {
        return (typeof route.points[id] != "undefined");
    }

    function addPoint(point) {
        var deferred = $q.defer();
        if (routeMode || viewRoute) {
            if (typeof route.points[point.id] == "undefined") { //compruebo que no exista previamente
                route.points[point.id] = (point);
                if (Object.keys(route.points).length > 1) { //si hay otro elemento puedo solicitar la ruta
                    requestRoute(route.lastPoint.position, point.position).then(function (data) {
                        $rootScope.$emit('addToRoutePath', {
                            node: point.id,
                            next: null,
                            previous: route.lastPoint.id,
                            path: data.route,
                            data: {
                                start: route.lastPoint.position,
                                end: point.position,
                                distance: data.distance,
                                duration: data.duration
                            }
                        });
                        route.lastPoint = point;
                        route.isEdit = true;
                        deferred.resolve(Object.keys(route.points).length);
                    }).catch(function (e) {
                        delete route.points[point.id];
                        deferred.reject();
                    });
                } else {
                    //si no hay otro igual debo agregarlo al arreglo
                    $rootScope.$emit('addToRoutePath', {
                        node: point.id,
                        next: null,
                        previous: null,
                        path: null,
                        data: {
                            start: null,
                            end: null,
                            distance: null,
                            duration: null
                        }
                    });
                    route.lastPoint = point;
                    route.isEdit = true;
                    deferred.resolve(Object.keys(route.points).length);
                }
            } else {
                deferred.reject();
            }
        } else {
            deferred.reject();
        }
        return deferred.promise;
    }

    function removePoint(id) {
        if (typeof route.points[id] != "undefined") {
            delete route.points[id];
            route.isEdit = true;
            return true;
        } else {
            return false;
        }
    }

    function finishRoute() {
        var token = userDatastore.getTokens();
        var arr = [];
        for (var p in route.points) {
            arr.push(p);
        }

        for (var i = 0; i < arr.length; i++){
            arrayPointCurrent.push([arr[i], route.points[arr[i]].position.lat(), route.points[arr[i]].position.lng()]);
        }
        orderPoint();

        var newPointsRoute = [];

        for (var j = 0; j < newPoints.length; j++){
            newPointsRoute.push(newPoints[j][0]);
        }

        resetArrays();

        reDrawMarkers();

        return routes(token.accessToken).saveRoute({
            name: route.name,
            transport: route.transport,
            points: JSON.stringify(newPointsRoute)
        }).$promise
            .then(function (response) {
                routeMode = false;
                viewRoute = true; //como estoy mostrando la ruta, paso al modo de edición
                route.id = response.id;
                userDatastore.setNewRoute(JSON.stringify(response));
                return response;
            }, function (e) { //error
                throw e;
            });
    }

    function finishEditRoute() {

        if (route.isEdit) {
            var token = userDatastore.getTokens();
            var arr = [];
            for (var p in route.points) {
                arr.push(p);
            }

            for (var i = 0; i < arr.length; i++){
                arrayPointCurrent.push([arr[i], route.points[arr[i]].position.lat(), route.points[arr[i]].position.lng()]);
            }
            orderPoint();

            var newPointsRoute = [];

            for (var j = 0; j < newPoints.length; j++){
                newPointsRoute.push(newPoints[j][0]);
            }
            resetArrays();
            reDrawMarkers();

            return routes(token.accessToken).editRoute({
                mapRoute: route.id
            }, {
                name: route.name,
                transport: route.transport,
                points: JSON.stringify(newPointsRoute)
            }).$promise.then(function (response) {
                routeMode = false;
                viewRoute = true; //como estoy mostrando la ruta, paso al modo de edición
                route.isEdit = false;
                userDatastore.setNewRoute(JSON.stringify(response));
                userDatastore.setEditRoute(true);
                return response;
            }, function (e) { //error
                throw e;
            });
        } else {
            var deferred = $q.defer();
            deferred.reject("noEdit");
            return deferred.promise;
        }
    }

    function updateName(id, name) {

        return routes(userDatastore.getTokens().accessToken).getRouteDetail(null, {
            mapRoute: id
        }).$promise.then(function (detail) {

            var points = [];
            for (var i in detail.points) {
                points.push(i);
            }

            return routes(userDatastore.getTokens().accessToken).editRoute({
                mapRoute: id
            }, {
                name: name,
                transport: detail.transport,
                points: JSON.stringify(points)
            }).$promise.then(function (response) {
                return response;
            }, function (e) { //error
                throw e;
            });
        }, function (e) { //error
            throw e;
        });

    }

    function getRoutes() {
        var token = userDatastore.getTokens();

        return routes(token.accessToken).getRoutes().$promise
            .then(function (response) {
                return response;
            })
            .catch(function (response) {

            });
    }

    function setRoutes(item) {

         console.info('item -->', item);

        var deferred = $q.defer();
        try {
            viewRoute = true; //establezco que estoy en modo de visualización de una ruta
            routeMode = false;
            route = {
                id: item.id,
                isEdit: false,
                name: item.name,
                transport: item.transport,
                lastPoint: null,
                points: {}
            };

            var last = {};
            last.latitude = 00;
            last.longitude = 00;
            var count = 0;
            var keys = Object.keys(item.points);
            var id = keys[count];

            function addElement(element) {

                if(element.latitude == last.latitude && element.longitude == last.longitude)
                {
                    if (count < keys.length) {
                        count += 1;
                        var id = keys[count];
                        addElement(item.points[id]);
                    } else {
                        route.isEdit = false; //esto porque addPoint coloca la ruta como editada
                        deferred.resolve();
                    }

                }else{
                    last.latitude = element.latitude;
                    last.longitude = element.longitude;
                }

                addPoint({
                    id: element.id,
                    position: new google.maps.LatLng(element.latitude, element.longitude),
                    marker: null //para ser agregado cuando se pinten las empresas en el mapa (controlador mapa)
                }).then(function () {
                    count += 1;
                    if (count < keys.length) {
                        var id = keys[count];
                        addElement(item.points[id]);
                    } else {
                        route.isEdit = false; //esto porque addPoint coloca la ruta como editada
                        deferred.resolve();
                    }
                }).catch(function (e) {
                    deferred.resolve();
                });
            }

            addElement(item.points[id]);

        } catch (e) {
            deferred.reject();
        }

        return deferred.promise;
    }

    function deleteRoute(id) {
        var token = userDatastore.getTokens();

        return routes(token.accessToken).deleteRoute(null, {
            mapRoute: id
        }).$promise.then(function (response) {
            return response;
        }, function (e) { //error
            throw e;
        });
    }

    function getModes() {
        return {
            routeMode: routeMode,
            viewRoute: viewRoute
        }
    }

    function setModes(rMode, vRoute) {
        routeMode = rMode;
        viewRoute = vRoute;
    }

    function getRouteDetail(item) {
        var token = userDatastore.getTokens();

        console.info('route detail 1');
        return routes(token.accessToken).getRouteDetail(null, {
            mapRoute: item.id
        }).$promise.then(function (detail) {
            console.info('route detail 2');

            routeMode = false;
            viewRoute = true; //modo de visualizar ruta

            return setRoutes(detail).then(function () {
                console.info('route detail 3');

                return detail;
            })
        }, function (e) { //error
            console.info('route detail 4');

            throw e;
        });
    }

    /**
     * Usado cuando se abre una ruta desde Mis rutas
     */
    function addMarkerToPoint(companyId, marker) {
        try {
            route.points[companyId].marker = marker;
        } catch (e) {

        }
    }

    /*
     * Reinicio de todas las variables relacionadas con la ruta
     */
    function resetRoutes() {
        routeMode = false; //modo de crear ruta
        viewRoute = false; //modo de visualizar ruta
        route = {
            id: null, //mostrado al guardar la ruta
            isEdit: false,
            name: null,
            transport: null,
            lastPoint: null,
            points: {}
        };
    }

    function addPointCurrent(points) {
        for(var i = 0;i < points.length; i++){
            arrayPointCurrent.push([points[i]['id'],points[i]['latitude'], points[i]['longitude']]);
        }
    }

    function orderPoint() {
        if (arrayPointCurrent.length > 0) {
            var currentElement = arrayPointCurrent.shift();
            newPoints.push(currentElement);
            if (arrayPointCurrent.length > 0) {
                arrayPointCurrent = orderByPoint(currentElement, arrayPointCurrent);
                orderPoint();
            }else{
                return newPoints;
            }
        }else
            return newPoints;
    }

    function orderByPoint(point, dataArray) {
        var lastDistance = null;
        var distanceShort = null;
        for (var i = 0; i < dataArray.length; i++) {

            var currentDistance = Math.round(calcDistance(point, dataArray[i]));
            if(lastDistance == null)
            {
                lastDistance = currentDistance;
                distanceShort = dataArray[i];
            }else{
                if (currentDistance < lastDistance ) {
                    lastDistance = currentDistance;
                    distanceShort = dataArray[i];
                }
            }
        }

        var result = [];

        result.push(distanceShort);
        for (var k = 0; k < dataArray.length; k++) {
            if (distanceShort[1] != dataArray[k][1] && distanceShort[2] != dataArray[k][2]) {
                result.push(dataArray[k])
            }
        }

        return result;
    }

    //calculates distance between two points in meters
    function calcDistance(point, nextPoint) {
        var dataOne = new google.maps.LatLng(point[1],point[2]);
        var dataTwo = new google.maps.LatLng(nextPoint[1], nextPoint[2]);

        var result = (google.maps.geometry.spherical.computeDistanceBetween(dataOne, dataTwo)).toFixed(2);
        return result;
    }

    function resetArrays(){
        arrayPointCurrent = [];
        newPoints = [];
    }

    function getRouteDetailOrder(item){
        var token = userDatastore.getTokens();

        return routes(token.accessToken).getRouteDetail(null, {
            mapRoute: item.id
        }).$promise.then(function (detail) {
//            updateRoutes(detail);
//            return detail;
            return updateRoutes(detail).then(function () {
                return detail;
            })

        }, function (e) { //error
            throw e;
        });
    }

    function updateRoutes(item) {
        var deferred = $q.defer();
        addPointCurrent(item.points);

        orderPoint();
        var newPointsRoute = [];

        for (var i = 0; i < newPoints.length; i++) {
            newPointsRoute.push(newPoints[i][0]);
        }

        resetArrays();

        return routes(userDatastore.getTokens().accessToken).editRoute({
            mapRoute: item.id
        }, {
            name: item.name,
            transport: item.transport,
            points: JSON.stringify(newPointsRoute)
        }).$promise.then(function (response) {
            return response
        }, function (e) {
            throw e;
        });

        deferred.promise;
    }

    return {
        requestRoute: requestRoute,
        drawRoute: drawRoute,
        getRouteMode: getRouteMode,
        getRouteName: getRouteName,
        getRouteTransport: getRouteTransport,
        initRoute: initRoute,
        addPoint: addPoint,
        removePoint: removePoint,
        finishRoute: finishRoute,
        finishEditRoute: finishEditRoute,
        updateName: updateName,
        existPoint: existPoint,
        getRoutes: getRoutes,
        setRoutes: setRoutes,
        deleteRoute: deleteRoute,
        getModes: getModes,
        setModes: setModes,
        getRouteDetail: getRouteDetail,
        reDrawMarkers: reDrawMarkers,
        addMarkerToPoint: addMarkerToPoint,
        resetRoutes: resetRoutes,
        addPointCurrent: addPointCurrent,
        orderPoint: orderPoint,
        orderByPoint: orderByPoint,
        calcDistance: calcDistance,
        getRouteDetailOrder: getRouteDetailOrder
    };
});
