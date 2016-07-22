app.service('routeService', function ($q, $rootScope, routes, userDatastore) {

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
        if (routeMode || viewRoute) {
            if (typeof route.points[point.id] == "undefined") {
                route.points[point.id] = (point);
                if (Object.keys(route.points).length > 1) {
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
                route.isEdit = true;
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
        delete data.id;
        delete data.isEdit;
        data.points = JSON.stringify(data.points);

        return routes(token.accessToken).saveRoute(data).$promise
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
            var data = route;
            delete data.lastPoint;
            delete data.id;
            delete data.isEdit;
            data.points = JSON.stringify(data.points);

            return routes(token.accessToken).editRoute({mapRoute: route.id}, data).$promise
                .then(function (response) {
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
                name: item.name,
                transport: item.transport,
                lastPoint: null,
                points: {}
            };
            //TODO: revisar que el objeto esté adecuadamente construido
            for (var i in item.points) {
                addPoint(item.points[i]);
            }
            deferred.resolve();
        } catch (e) {
            deferred.reject();
        }

        return deferred.promise;
    }

    function deleteRoute(id) {
        var token = userDatastore.getTokens();

        return routes(token.accessToken).deleteRoute(null, {mapRoute: id}).$promise
            .then(function (response) {
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
        setModes: setModes
    };
});
