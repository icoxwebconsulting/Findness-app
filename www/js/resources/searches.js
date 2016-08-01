app.factory('searches', function ($resource, SERVER_CONF) {
    return function (token) {
        // if (token === null || token === undefined) {
        //     throw new Error('access token need to be provided');
        // }

        return $resource(SERVER_CONF.API_HOST + 'searches/:search', {search: '@search'}, {
            get: {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token
                }
            },
            update: {
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }
        });
    };
});
