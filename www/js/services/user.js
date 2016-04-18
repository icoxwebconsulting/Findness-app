app.factory('user', function ($q, $rootScope, device, deviceDatastore, customer, userDatastore, OAUTH_CONF, pushNotification) {

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
        return customer().requestSalt({
            customer: loginData.username
        }).$promise.then(function (response) {
            console.log("respuesta del salt");
            var salt = '$2a$10$' + response.salt;
            loginData.password = bcrypt.hashSync(loginData.password, salt);

            customer().requestAccessToken(loginData).$promise
                .then(function (response) {
                    console.log("respuesta login");
                    console.log(response);
                    return;
                    if (response.id) {
                        userDatastore.setIsLogged(1);
                        userDatastore.setCustomerId(response.id);
                        userDatastore.setPassword(response.password);
                        userDatastore.setUsername(response.username);
                        userDatastore.setTokens(response.access_token, response.refresh_token);
                        return registerDevice();
                    } else {
                        return false;
                    }
                });
        });
    }

    function logout() {
        //borrar datos
        userDatastore.deleteUserData();
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

    // function setProfile(displayName, avatarPath, avatarData, avatarMimeType) {
    //     var params = {
    //         customer: userDatastore.getCustomerId()
    //     };
    //     var profileData = {
    //         displayName: displayName,
    //         avatarData: avatarData,
    //         avatarMimeType: avatarMimeType
    //     };
    //     return customer(null, null, userDatastore.getTokens().accessToken).setProfile(params, profileData).$promise
    //         .then(function (response) {
    //             userDatastore.setProfile(response.display_name, avatarPath ? avatarPath : getProfile().avatarURL);
    //         });
    // }
    //
    // function getProfile() {
    //     var profile = userDatastore.getProfile();
    //     if (profile.avatarURL == null ||
    //         profile.avatarURL == undefined ||
    //         profile.avatarURL == 'undefined') {
    //         profile.avatarURL = 'img/person.png';
    //     }
    //     if (profile.displayName == null ||
    //         profile.displayName == undefined ||
    //         profile.displayName == 'undefined') {
    //         profile.displayName = userDatastore.getNumber();
    //     }
    //     return profile;
    // }

    return {
        // getVerified: userDatastore.getVerified,
        // isVerified: userDatastore.isVerified,
        refreshAccessToken: refreshAccessToken,
        // setProfile: setProfile,
        // verifyCode: verifyCode,
        register: register,
        login: login,
        logout: logout
        // getProfile: getProfile
    };
});
