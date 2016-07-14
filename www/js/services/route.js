app.service('routeService', function ($q, routes) {

    var directionsService = new google.maps.DirectionsService();
    var polylines = [];
    var routeMode = false;
    var route = {
        name: null,
        transport: null,
        lastPoint: null,
        points: {}
    };

    function requestRoute(start, end, travelMode) {

        var request = {
            origin: start,
            destination: end,
            travelMode: travelMode
        };

        var deferred = $q.defer();

        directionsService.route(request, function (response, status) {

            if (status == google.maps.DirectionsStatus.OK) {
                // var route = new Array();
                // var gRoute = response.routes[0]['overview_path'];
                // for (var s = 0; s < gRoute.length; s++) {
                //     route.push(new plugin.google.maps.LatLng(gRoute[s].lat(), gRoute[s].lng()));
                // }
                // deferred.resolve(route);
                map.drawDirections(response);
                deferred.resolve();
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

    // function setRouteMode(status) {
    //     routeMode = status;
    // }

    function initRoute(name, transport) {
        console.log(name, transport);
        return;
        routeMode = true;
        var route = {
            name: name,
            transport: transport,
            points: []
        };
    }

    function addPoint(point) {
        if (routeMode) {
            route.points[point.id] = (point);
            route.lastPoint = point;
            if (Object.keys(route.points).length > 1) {
                //drawRoute()
                requestRoute(route.lastPoint.position, point.position, route.transport);
            }
            return true;
        } else {
            return false;
        }
    }

    function finishRoute() {
        routeMode = false;
    }

    return {
        requestRoute: requestRoute,
        drawRoute: drawRoute,
        getRouteMode: getRouteMode,
        //setRouteMode: setRouteMode,
        initRoute: initRoute,
        addPoint: addPoint,
        finishRoute: finishRoute
    };
});
