app.service('route', function ($q) {

    var directionsService = new google.maps.DirectionsService();
    var polylines = [];

    function requestRoute(start, end, travelMode) {

        var request = {
            origin: start,
            destination: end,
            travelMode: travelMode
        };

        var deferred = $q.defer();

        directionsService.route(request, function (response, status) {

            if (status == google.maps.DirectionsStatus.OK) {
                var route = new Array();
                var gRoute = response.routes[0]['overview_path'];
                for (var s = 0; s < gRoute.length; s++) {
                    route.push(new plugin.google.maps.LatLng(gRoute[s].lat(), gRoute[s].lng()));
                }
                deferred.resolve(route);
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

    return {
        requestRoute: requestRoute,
        drawRoute: drawRoute
    };
});
