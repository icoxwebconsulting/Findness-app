app.factory('user', function ($q, $rootScope, device, deviceDatastore, customer, userDatastore, OAUTH_CONF, pushNotification, $http) {

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

        return customer().requestSalt({
            customer: loginData.username
        }).$promise.then(function (response) {
            console.log("respuesta del salt");
            var salt = '$2a$10$' + response.salt;
            loginData.password = bcrypt.hashSync(loginData.password, salt);

            $http({
                method: 'GET',
                url: OAUTH_CONF.OAUTH_HOST + 'token?client_id=' + OAUTH_CONF.CLIENT_ID + '&client_secret=' + OAUTH_CONF.CLIENT_SECRET + '&grant_type=password&redirect_uri=www.findness.com',
                headers: {
                    username: loginData.username,
                    password: loginData.password
                }
            }).then(function (response) {
                pushNotification.init();
                if (response.data.access_token) {
                    userDatastore.setIsLogged(1);
                    userDatastore.setPassword(loginData.password);
                    userDatastore.setUsername(loginData.username);
                    userDatastore.setTokens(response.data.access_token, response.data.refresh_token);

                    console.log("antes de register device")
                    return registerDevice().then(function () {
                        console.log("ok de register device")
                    });
                }
            });
        });

        return deferred.promise;
    }

    function logout() {
        //desregistrar dispositivo
        return customer().logout().$promise
            .then(function () {
                userDatastore.deleteUserData();
            });
    }

    function registerDevice() {
        var deviceToken = pushNotification.getRegistrationId();

        function register(token) {
            var data = {
                token: token,
                os: 'Android'
            };
            return device(userDatastore.getTokens().accessToken).save(data).$promise
                .then(function (response) {
                    deviceDatastore.setDeviceId(response.device);
                    return true;
                })
                .catch(function () {
                    deviceDatastore.setDeviceId(token);
                    return true;
                });
        }

        if (deviceToken) {
            return register(deviceToken);
        } else {
            var deferred = $q.defer();

            $rootScope.$on('pushRegistrationId', function (pushRegistrationId) {
                register(pushRegistrationId)
                    .then(function () {
                        deferred.resolve(true);
                    });
            });

            return deferred.promise;
        }
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

    return {
        refreshAccessToken: refreshAccessToken,
        register: register,
        login: login,
        logout: logout
    };
});
