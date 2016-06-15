app.factory('qualitas', function ($resource, SERVER_CONF) {
    return function (token) {
        // if (token === null || token === undefined) {
        //     throw new Error('access token need to be provided');
        // }

        return $resource(SERVER_CONF.API_HOST + 'qualitas', null, {
            search: {
                method: 'GET',
                url: SERVER_CONF.API_HOST + 'qualitas',
                headers: {
                    Authorization: 'Bearer ' + token
                }
            },
            searchStates: {
                method: 'GET',
                url: SERVER_CONF.API_HOST + 'qualitas/states'
            },
            searchCities: {
                method: 'GET',
                url: SERVER_CONF.API_HOST + 'qualitas/cities'
            },
            searchPostalCodes: {
                method: 'GET',
                url: SERVER_CONF.API_HOST + 'qualitas/postal-codes'
            }
        });
    };
});

