app.factory('routes', function ($resource, SERVER_CONF) {
    return function (token) {
        // if (token === null || token === undefined) {
        //     throw new Error('access token need to be provided');
        // }

        return $resource(SERVER_CONF.API_HOST + 'map-routes', null, {
            search: {
                method: 'GET',
                url: SERVER_CONF.API_HOST + 'map-routes',
                headers: {
                    Authorization: 'Bearer ' + token
                }
            },
            saveRoute: {
                method: 'POST',
                url: SERVER_CONF.API_HOST + 'map-routes',
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }
        });
    };
});

