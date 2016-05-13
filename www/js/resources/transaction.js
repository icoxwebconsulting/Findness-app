app.factory('transaction', function ($resource, SERVER_CONF) {
    return function (token) {
        return $resource(SERVER_CONF.API_HOST + 'transactions', null, {
            save: {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }
        });
    }
});
