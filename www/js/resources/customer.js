app.factory('customer', function ($resource, userDatastore, SERVER_CONF, OAUTH_CONF) {
    return function (username, password, token) {
        return $resource(SERVER_CONF.API_HOST + 'customers/:customer', {customer: '@customer'}, {
            requestAccessToken: {
                method: 'GET',
                url: OAUTH_CONF.OAUTH_HOST + 'token?client_id=' + OAUTH_CONF.CLIENT_ID + '&client_secret=' + OAUTH_CONF.CLIENT_SECRET + '&grant_type=password&redirect_uri=www.findness.com',
                headers: {
                    username: username,
                    password: password
                }
            },
            refreshAccessToken: {
                method: 'GET',
                url: OAUTH_CONF.OAUTH_HOST + 'token?client_id=' + OAUTH_CONF.CLIENT_ID + '&client_secret=' + OAUTH_CONF.CLIENT_SECRET + '&grant_type=refresh_token&redirect_uri=www.findness.com&refresh_token=' + userDatastore.getRefreshingAccessToken(),
                headers: {
                    username: username,
                    password: password
                }
            },
            requestSalt: {
                method: 'GET',
                url: SERVER_CONF.API_HOST + 'customers/:customer/salt'
            }
        });
    }
});
