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
            },
            confirm: {
                method: 'POST',
                url: SERVER_CONF.API_HOST + 'customers/:customer/confirm',
                params: {customer: '@customer'}
            },
            resendConfirm: {
                method: 'POST',
                url: SERVER_CONF.API_HOST + 'customers/:customer/resend-confirmation-email'
            },
            requestPassword: {
                method: 'PUT',
                url: SERVER_CONF.API_HOST + 'customers/:customer/reset/password',
                params: {customer: '@customer'}
            },
            confirmPassword: {
                method: 'PUT',
                url: SERVER_CONF.API_HOST + 'customers/:customer/new/password',
                params: {customer: '@customer'}
            },
            getProfile: {
                method: 'GET',
                url: SERVER_CONF.API_HOST + 'customers/profile',
                headers: {
                    Authorization: 'Bearer ' + token
                }
            },
            updateProfile: {
                method: 'PUT',
                url: SERVER_CONF.API_HOST + 'customers/update-profile',
                headers: {
                    Authorization: 'Bearer ' + token
                }
            },
            changePassword: {
                method: 'PUT',
                url: SERVER_CONF.API_HOST + 'customers/change/password',
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }
        });
    }
});
