app.factory('userDatastore', function () {

    function setIsLogged(status) {
        window.localStorage.setItem('isLogged', status);
    }

    function getIsLogged() {
        return window.localStorage.getItem('isLogged') || 0;
    }

    function setCustomerId(id) {
        window.localStorage.setItem('customerId', id);
    }

    function getCustomerId() {
        return window.localStorage.getItem('customerId');
    }

    function setUsername(number) {
        window.localStorage.setItem('username', number);
    }

    function getUsername() {
        return window.localStorage.getItem('username');
    }

    function setPassword(password) {
        window.localStorage.setItem('password', password);
    }

    function getPassword() {
        return window.localStorage.getItem('password');
    }

    function setTokens(accessToken, refreshToken) {
        window.localStorage.setItem('accessToken', accessToken);
        window.localStorage.setItem('refreshToken', refreshToken);
    }

    function getTokens() {
        return {
            accessToken: window.localStorage.getItem('accessToken'),
            refreshToken: window.localStorage.getItem('refreshToken')
        };
    }

    function isRefreshingAccessToken() {
        return window.localStorage.getItem('refreshingAccessToken') || false;
    }

    function setRefreshingAccessToken(refreshing) {
        window.localStorage.setItem('refreshingAccessToken', refreshing);
    }

    function getRefreshingAccessToken() {
        return window.localStorage.getItem('refreshingAccessToken');
    }

    function setProfile(displayName, avatarURL) {
        window.localStorage.setItem('displayName', displayName);
        window.localStorage.setItem('avatarURL', avatarURL);
    }

    function getProfile() {
        return {
            displayName: window.localStorage.getItem('displayName'),
            avatarURL: window.localStorage.getItem('avatarURL')
        }
    }

    function deleteUserData() {
        window.localStorage.removeItem('isLogged');
        window.localStorage.removeItem('customerId');
        window.localStorage.removeItem('password');
        window.localStorage.removeItem('username');
        window.localStorage.removeItem('accessToken');
        window.localStorage.removeItem('refreshToken');
        window.localStorage.removeItem('device_id');
    }

    function setSalt(salt, username) {
        window.localStorage.setItem('salt', salt + '::' + username);
    }

    function getSalt() {
        return window.localStorage.getItem('salt') || false;
    }

    return {
        setIsLogged: setIsLogged,
        getIsLogged: getIsLogged,
        setCustomerId: setCustomerId,
        getCustomerId: getCustomerId,
        setUsername: setUsername,
        getUsername: getUsername,
        setTokens: setTokens,
        getTokens: getTokens,
        setPassword: setPassword,
        getPassword: getPassword,
        isRefreshingAccessToken: isRefreshingAccessToken,
        setRefreshingAccessToken: setRefreshingAccessToken,
        getRefreshingAccessToken: getRefreshingAccessToken,
        setProfile: setProfile,
        getProfile: getProfile,
        deleteUserData: deleteUserData,
        setSalt: setSalt,
        getSalt: getSalt
    };
});