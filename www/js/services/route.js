app.service('routeService', function ($q, $rootScope, routes, userDatastore, COMPANY_STYLE) {

    var directionsService = new google.maps.DirectionsService();
    var polylines = [];
    var arrPointCurrent = [];
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
            console.log(e);
        }
    }

    function requestRoute(start, end) {

        var request = {
            origin: start,
            destination: end,
            travelMode: route.transport
        };

        var deferred = $q.defer();

        directionsService.route(request, function (response, status) {

            if (status == google.maps.DirectionsStatus.OK) {
                var theRoute = new Array();
                var gRoute = response.routes[0]['overview_path'];
                for (var s = 0; s < gRoute.length; s++) {
                    theRoute.push(new google.maps.LatLng(gRoute[s].lat(), gRoute[s].lng()));
                }
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
            console.log(route);
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

        return routes(token.accessToken).saveRoute({
            name: route.name,
            transport: route.transport,
            points: JSON.stringify(arr)
        }).$promise
            .then(function (response) {
                console.log(response);
                routeMode = false;
                viewRoute = true; //como estoy mostrando la ruta, paso al modo de edición
                route.id = response.id;
                return response;
            }, function (e) { //error
                throw e;
            });
    }

    function finishEditRoute() {
        console.log("la ruta editada", route);

        if (route.isEdit) {
            var token = userDatastore.getTokens();
            var arr = [];
            for (var p in route.points) {
                arr.push(p);
            }

            return routes(token.accessToken).editRoute({
                mapRoute: route.id
            }, {
                name: route.name,
                transport: route.transport,
                points: JSON.stringify(arr)
            }).$promise.then(function (response) {
                console.log(response);
                routeMode = false;
                viewRoute = true; //como estoy mostrando la ruta, paso al modo de edición
                route.isEdit = false;
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
                console.log(response);
            });
    }

    function setRoutes(item) {
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
//console.log('item', item);
            addPointCurrent(item.points);
            orderPoint();
            var count = 0;
            var keys = Object.keys(item.points);
            var id = keys[count];

            function addElement(element) {

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
                })
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
            console.log(response);
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

        return routes(token.accessToken).getRouteDetail(null, {
            mapRoute: item.id
        }).$promise.then(function (detail) {
            console.log(detail);
            routeMode = false;
            viewRoute = true; //modo de visualizar ruta

            return setRoutes(detail).then(function () {
                return detail;
            })
        }, function (e) { //error
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
            console.log(e);
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

    function addPointCurrent(points){
        for(var i = 0;i < points.length; i++){
            arrPointCurrent.push([points[i]['latitude'], points[i]['longitude']]);
        }
    }

    function orderByPoint(point, dataArray){

        console.log(point);
        var tempArray = [];
        var distanceShort = 0;

        for(var i = 0; i< dataArray.length; i++){
            console.log(dataArray[i]);
            var currentDistance = calcDistance(point, dataArray[i]);

            if (tempArray.length > 0) {
                for (var j = 0; j < tempArray.length; j++) {
                    if (currentDistance < tempArray[j]){
                        distanceShort = dataArray[i];
                    }
                }
            }else {
                tempArray.push(calcDistance(point, dataArray[i]));
                distanceShort = dataArray[i];
            }

            tempArray.push(calcDistance(point, dataArray[i]));
            tempArray.sort(function(a, b){return a-b})

        }

        var result = [];
        result.push(distanceShort);
        for(var i = 0; i< dataArray.length; i++){
            if (distanceShort != dataArray[i]){
                result.push(dataArray[i]);
            }
        }
        console.log('result', result)
        return result;
    }


    function orderPoint(){

        console.log('arrPointCurrent', arrPointCurrent);

//        var currentElement = arrPointCurrent.shift();
//        newPoints.push(currentElement);
//console.log('currentElement ', currentElement)
//        arrPointCurrent = orderByPoint(currentElement, arrPointCurrent);

//        if(arrPointCurrent.length > 0)
//            orderPoint();
//        else
//            return newPoints;

    }

    //calculates distance between two points in km's
    function calcDistance(point, nextPoint) {
        var dataOne = new google.maps.LatLng(point[0],point[1]);
        var dataTwo = new google.maps.LatLng(nextPoint[0], nextPoint[1]);

        console.log('point', point);
        console.log('nextpoint', nextPoint);


        var result = (google.maps.geometry.spherical.computeDistanceBetween(dataOne, dataTwo)/ 1000).toFixed(2);
        return result;
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
        calcDistance: calcDistance
    };
});
