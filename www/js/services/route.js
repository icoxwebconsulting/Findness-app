app.service('routeService', function ($q, $rootScope, routes, userDatastore, COMPANY_STYLE) {

    var directionsService = new google.maps.DirectionsService();
    var polylines = [];
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

    // function setRouteMode(status) {
    //     routeMode = status;
    // }

    function initRoute(name, transport) {
        console.log(name, transport);
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
                if (Object.keys(route.points).length > 1) { //si hay otro elemento puedo dibujar la ruta
                    requestRoute(route.lastPoint.position, point.position).then(function (data) {
                        $rootScope.$emit('drawDirections', {
                            startId: route.lastPoint.id,
                            endId: point.id,
                            path: data.route,
                            start: route.lastPoint.position,
                            end: point.position,
                            distance: data.distance,
                            duration: data.duration
                        });
                        route.lastPoint = point;
                    });
                } else {
                    route.lastPoint = point;
                    $rootScope.$emit('drawDirections', {
                        startId: route.lastPoint.id,
                        endId: point.id,
                        path: null,
                        start: route.lastPoint.position,
                        end: point.position,
                        distance: null,
                        duration: null
                    });
                }
                route.isEdit = true;
            }
            deferred.resolve(Object.keys(route.points).length);
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

    function getRoutes() {
        var token = userDatastore.getTokens();

        return routes(token.accessToken).getRoutes().$promise
            .then(function (response) {
                console.log(response);
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

            for (var i in item.points) {
                addPoint({
                    id: item.points[i].id,
                    position: new google.maps.LatLng(item.points[i].latitude, item.points[i].longitude)
                });
            }
            route.isEdit = false; //esto porque addPoint coloca la ruta como editada
            deferred.resolve();
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
        }).$promise.then(function (response) {
            console.log(response);
            routeMode = false;
            viewRoute = true; //modo de visualizar ruta
            return response;
        }, function (e) { //error
            throw e;
        });
    }

    return {
        requestRoute: requestRoute,
        drawRoute: drawRoute,
        getRouteMode: getRouteMode,
        getRouteName: getRouteName,
        initRoute: initRoute,
        addPoint: addPoint,
        removePoint: removePoint,
        finishRoute: finishRoute,
        finishEditRoute: finishEditRoute,
        existPoint: existPoint,
        getRoutes: getRoutes,
        setRoutes: setRoutes,
        deleteRoute: deleteRoute,
        getModes: getModes,
        setModes: setModes,
        getRouteDetail: getRouteDetail,
        reDrawMarkers: reDrawMarkers
    };
});
