app.factory('routes', function ($resource, SERVER_CONF) {
    return function (token) {
        // if (token === null || token === undefined) {
        //     throw new Error('access token need to be provided');
        // }

        return $resource(SERVER_CONF.API_HOST + 'map-routes', null, {
            getRoutes: {
                method: 'GET',
                isArray: true,
                headers: {
                    Authorization: 'Bearer ' + token
                }
            },
            getRouteDetail: {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                url: SERVER_CONF.API_HOST + 'map-routes/:mapRoute',
                params: {mapRoute: '@mapRoute'}
            },
            saveRoute: {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token
                }
            },
            editRoute: {
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                url: SERVER_CONF.API_HOST + 'map-routes/:mapRoute',
                params: {mapRoute: '@mapRoute'}
            },
            deleteRoute: {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                url: SERVER_CONF.API_HOST + 'map-routes/:mapRoute',
                params: {mapRoute: '@mapRoute'}
            }
        });
    };
});

