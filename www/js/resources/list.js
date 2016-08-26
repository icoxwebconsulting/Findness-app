app.factory('list', function ($resource, SERVER_CONF) {
    return function (token) {
        if (token === null || token === undefined) {
            throw new Error('access token need to be provided');
        }

        return $resource(SERVER_CONF.API_HOST + 'static', null, {
            getList: {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                url: SERVER_CONF.API_HOST + 'static/lists',
                isArray: true
            },
            getById: {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                url: SERVER_CONF.API_HOST + 'static/list/:list',
                params: {list: '@list'},
                isArray: true
            },
            share: {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                url: SERVER_CONF.API_HOST + 'static/list/:list/share/:username/customer',
                params: {list: '@list', username: '@username'}
            }
        });
    };
});

