app.factory('company', function ($resource, SERVER_CONF) {
    return function (token) {
        if (token === null || token === undefined) {
            throw new Error('access token need to be provided');
        }

        return $resource(SERVER_CONF.API_HOST + 'companies', null, {
            companyStyle: {
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                url: SERVER_CONF.API_HOST + 'companies/:company/style',
                params: {company: '@company'}
            }
        });
    };
});

