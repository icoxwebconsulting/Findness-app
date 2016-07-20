app.service('routeService', function ($q, $rootScope, routes, userDatastore) {

    var directionsService = new google.maps.DirectionsService();
    var polylines = [];
    var routeMode = false;
    var route = {
        id: null, //mostrado al guardar la ruta
        name: null,
        transport: null,
        lastPoint: null,
        points: {}
    };

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
                    theRoute.push(new plugin.google.maps.LatLng(gRoute[s].lat(), gRoute[s].lng()));
                }
                deferred.resolve(theRoute);
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
        route.name = name;
        route.transport = transport;
    }

    function existPoint(id) {
        return (typeof route.points[id] != "undefined");
    }

    function addPoint(point) {
        if (routeMode) {
            if (typeof route.points[point.id] == "undefined") {
                route.points[point.id] = (point);
                if (Object.keys(route.points).length > 1) {
                    //drawRoute()
                    requestRoute(route.lastPoint.position, point.position).then(function (theRoute) {
                        $rootScope.$emit('drawDirections', {
                            startId: route.lastPoint.id,
                            endId: point.id,
                            path: theRoute
                        });
                        route.lastPoint = point;
                    });
                } else {
                    route.lastPoint = point;
                }
            }
            return true;
        } else {
            return false;
        }
    }

    function removePoint(id) {
        if (typeof route.points[id] != "undefined") {
            $rootScope.$emit('deletePath', {
                deleteId: id
            });
            delete route.points[id];
            return true;
        } else {
            return false;
        }
    }

    function finishRoute() {
        var token = userDatastore.getTokens();
        var data = route;
        delete data.lastPoint;
        data.points = JSON.stringify(data.points);

        return routes(token.accessToken).saveRoute(data).$promise
            .then(function (response) {
                console.log(response);
                routeMode = false;
                return response;
            }, function (e) { //error
                throw e;
            });
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
            route = {
                id: item.id,
                name: item.name,
                transport: item.transport,
                lastPoint: test[Object.keys(item.points)[Object.keys.length - 1]].id,
                points: item.points
            };
            //TODO: revisar que el objeto esté adecuadamente construido
            // for(var point in item.points){
            //
            // }
            deferred.resolve(polyline);
        } catch (e) {
            deferred.reject(polyline);
        }

        return deferred.promise;
    }

    return {
        requestRoute: requestRoute,
        drawRoute: drawRoute,
        getRouteMode: getRouteMode,
        getRouteName: getRouteName,
        //setRouteMode: setRouteMode,
        initRoute: initRoute,
        addPoint: addPoint,
        removePoint: removePoint,
        finishRoute: finishRoute,
        existPoint: existPoint,
        getRoutes: getRoutes,
        setRoutes: setRoutes
    };
});
