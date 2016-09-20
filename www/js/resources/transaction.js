app.factory('transaction', function ($resource, SERVER_CONF) {
    return function (token) {
        return $resource(SERVER_CONF.API_HOST + 'transaction', null, {
            get: {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token
                }
            },
            save: {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token
                }
            },
            getBalance: {
                method: 'GET',
                url: SERVER_CONF.API_HOST + 'balance',
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }
        });
    }
});
