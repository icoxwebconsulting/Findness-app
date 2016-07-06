app.factory('user', function ($q, $rootScope, device, deviceDatastore, customer, userDatastore, paymentSrv, OAUTH_CONF) {

    function register(registrationData) {
        var bcrypt = dcodeIO.bcrypt;
        //generar y agregar salt
        registrationData.salt = bcrypt.genSaltSync(10);
        registrationData.password = bcrypt.hashSync(registrationData.password, registrationData.salt);
        registrationData.salt = registrationData.salt.slice(7);

        return customer().save(registrationData).$promise
            .then(function (response) {
                if (response.id) {
                    userDatastore.setIsConfirm(0);
                    userDatastore.setUsername(registrationData.username);
                    userDatastore.setPassword(registrationData.password);
                    return response;
                } else {
                    return false;
                }
            });
    }

    function requestSalt(loginData) {
        var deferred = $q.defer();
        var bcrypt = dcodeIO.bcrypt;

        customer().requestSalt({
            customer: loginData.username
        }).$promise.then(function (response) {
            var salt = '$2a$10$' + response.salt;
            var password = bcrypt.hashSync(loginData.password, salt);
            deferred.resolve(password);
        }, function (response) {
            //error salt
            console.log("error salt", response);
            deferred.reject({
                type: 1,
                data: response.data
            });
        });

        return deferred.promise;
    }

    function login(loginData) {
        var deferred = $q.defer();
        var authData = {
            client_id: OAUTH_CONF.CLIENT_ID,
            client_secret: OAUTH_CONF.CLIENT_SECRET,
            grant_type: 'password',
            redirect_uri: 'www.findness.com'
        };

        customer(loginData.username, loginData.password).refreshAccessToken(authData).$promise
            .then(function (response) {
                //TODO: el servicio de login debería devolver algún aviso si el usuario no se ha confirmado (y se ha logueado correctamente
                userDatastore.setIsConfirm(1);
                userDatastore.setIsLogged(1);
                userDatastore.setCustomerId(response.id);
                userDatastore.setPassword(loginData.password);
                userDatastore.setUsername(loginData.username);
                userDatastore.setTokens(response.access_token, response.refresh_token);
                //
                paymentSrv.requestBalance();
                refreshAccessToken();
                deferred.resolve(response);
            })
            .catch(function (response) {
                console.log(response);
                deferred.reject({
                    type: 1,
                    data: response.data
                });
            });

        return deferred.promise;
    }

    function confirm(token) {
        var deferred = $q.defer();
        var username = userDatastore.getUsername();
        customer().confirm({
            customer: username
        }, {
            token: token
        }).$promise.then(function (response) {
            if (response.confirmed) {
                userDatastore.setIsConfirm(1);
                userDatastore.setCustomerId(response.id);
                deferred.resolve();
            } else {
                deferred.reject();
            }
        }, function (response) {
            deferred.reject();
        });

        return deferred.promise;
    }

    function logout() {
        userDatastore.deleteUserData();
    }

    function refreshAccessToken() {
        var deferred = $q.defer();

        // refresh access_token every minute
        refreshToken = setInterval(refreshAccessToken, OAUTH_CONF.REFRESH_INTERVAL);

        if (userDatastore.isRefreshingAccessToken() == 0 && userDatastore.getIsLogged()) {
            userDatastore.setRefreshingAccessToken(1);
            var authData = {
                client_id: OAUTH_CONF.CLIENT_ID,
                client_secret: OAUTH_CONF.CLIENT_SECRET,
                grant_type: 'refresh_token',
                redirect_uri: 'www.findness.com',
                refresh_token: userDatastore.getTokens().refreshToken
            };
            return customer(userDatastore.getUsername(), userDatastore.getPassword()).refreshAccessToken(authData).$promise
                .then(function (response) {
                    userDatastore.setTokens(response.access_token, response.refresh_token);
                    userDatastore.setRefreshingAccessToken(0);
                })
                .catch(function () {
                    requestAccessToken(function () {
                        userDatastore.setRefreshingAccessToken(0);
                    }, function () {
                        userDatastore.setRefreshingAccessToken(0);
                    });
                });
        } else {
            deferred.resolve(true);
        }

        return deferred.promise;
    }

    function requestAccessToken() {
        var authData = {
            client_id: OAUTH_CONF.CLIENT_ID,
            client_secret: OAUTH_CONF.CLIENT_SECRET,
            grant_type: 'password',
            redirect_uri: 'www.findness.com'
        };
        return customer(userDatastore.getUsername(), userDatastore.getPassword()).requestAccessToken(authData).$promise
            .then(function (response) {
                userDatastore.setTokens(response.access_token, response.refresh_token);
            });
    }

    function resendConfirm() {
        var deferred = $q.defer();
        var username = userDatastore.getUsername();
        customer().resendConfirm({
            customer: username
        }).$promise.then(function (response) {
            console.log(response);
            deferred.resolve();
        }, function (response) {
            deferred.reject();
        });

        return deferred.promise;
    }

    function requestPassword(email) {
        return customer().requestPassword({"customer": email}).$promise
            .then(function (response) {
                if (response.status) {
                    return true;
                } else {
                    return false;
                }
            });
    }

    function confirmPassword(email, code, password) {
        var bcrypt = dcodeIO.bcrypt;
        var salt = bcrypt.genSaltSync(10);
        password = bcrypt.hashSync(password, salt);
        salt = salt.slice(7);

        return customer().confirmPassword({"customer": email}, {
            "code": code,
            "password": password,
            "salt": salt
        }).$promise
            .then(function (response) {
                return response.status;
            });
    }

    return {
        refreshAccessToken: refreshAccessToken,
        register: register,
        requestPassword: requestPassword,
        confirmPassword: confirmPassword,
        confirm: confirm,
        resendConfirm: resendConfirm,
        requestSalt: requestSalt,
        login: login,
        logout: logout
    };
});
