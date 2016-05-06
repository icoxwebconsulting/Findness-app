app.factory('transaction', function ($resource, SERVER_CONF, OAUTH_CONF) {
    return function () {
        return $resource(SERVER_CONF.API_HOST + 'transactions', null, {
            save: {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('accessToken')
                }
            }
        });
    }
});
