app.factory('user', function ($q, $rootScope, device, deviceDatastore, customer, userDatastore, OAUTH_CONF) {

    function register(registrationData) {
        var bcrypt = dcodeIO.bcrypt;
        //generar y agregar salt
        registrationData.salt = bcrypt.genSaltSync(10);
        registrationData.password = bcrypt.hashSync(registrationData.password, registrationData.salt);
        registrationData.salt = registrationData.salt.slice(7);

        return customer().save(registrationData).$promise
            .then(function (response) {
                console.log(response);
                if (response.id) {
                    userDatastore.setCustomerId(response.id);
                    userDatastore.setPassword(registrationData.password);
                    userDatastore.setUsername(response.username);
                    userDatastore.setSalt(registrationData.salt);
                    //return registerDevice();
                    //realizar login
                    login();
                } else {
                    return false;
                }
            });
    }

    function login(loginData) {
        var bcrypt = dcodeIO.bcrypt;
        //obtengo el salt
        var deferred = $q.defer();

        customer().requestSalt({
            customer: loginData.username
        }).$promise.then(function (response) {
            var salt = '$2a$10$' + response.salt;
            loginData.password = bcrypt.hashSync(loginData.password, salt);

            var authData = {
                client_id: OAUTH_CONF.CLIENT_ID,
                client_secret: OAUTH_CONF.CLIENT_SECRET,
                grant_type: 'password',
                redirect_uri: 'www.findness.com'
            };

            return customer(loginData.username, loginData.password).refreshAccessToken(authData).$promise
                .then(function (response) {
                    userDatastore.setIsLogged(1);
                    userDatastore.setPassword(loginData.password);
                    userDatastore.setUsername(loginData.username);
                    userDatastore.setTokens(response.access_token, response.refresh_token);
                    // refresh access_token every minute
                    setInterval(refreshAccessToken, OAUTH_CONF.REFRESH_INTERVAL);
                    deferred.resolve(response);
                })
                .catch(function (response) {
                    console.log(response);
                    deferred.reject({
                        type: 1,
                        data: response.data
                    });
                });

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

    function logout() {
        userDatastore.deleteUserData();
    }

    function refreshAccessToken() {
        var deferred = $q.defer();

        // refresh access_token every minute
        setInterval(refreshAccessToken, OAUTH_CONF.REFRESH_INTERVAL);

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

    return {
        refreshAccessToken: refreshAccessToken,
        register: register,
        login: login,
        logout: logout
    };
});
