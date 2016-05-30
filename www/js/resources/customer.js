app.factory('customer', function ($resource, userDatastore, deviceDatastore, SERVER_CONF, OAUTH_CONF) {
    return function (username, password, token) {
        return $resource(SERVER_CONF.API_HOST + 'customers/:customer', {customer: '@customer'}, {
            requestAccessToken: {
                method: 'GET',
                url: OAUTH_CONF.OAUTH_HOST + 'token',
                headers: {
                    username: username,
                    password: password
                }
            },
            refreshAccessToken: {
                method: 'GET',
                url: OAUTH_CONF.OAUTH_HOST + 'token',
                headers: {
                    username: username,
                    password: password
                }
            },
            requestSalt: {
                method: 'GET',
                url: SERVER_CONF.API_HOST + 'customers/:customer/salt'
            },
            logout: {
                method: 'DELETE',
                url: SERVER_CONF.API_HOST + 'devices/' + deviceDatastore.getDeviceId() || 0
            }
        });
    }
});
