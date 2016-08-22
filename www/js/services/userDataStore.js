app.factory('userDatastore', function () {

    function setIsLogged(status) {
        window.localStorage.setItem('isLogged', status);
    }

    function getIsLogged() {
        return window.localStorage.getItem('isLogged') || 0;
    }

    function setIsConfirm(status) {
        window.localStorage.setItem('isConfirm', status);
    }

    function getIsConfirm() {
        return window.localStorage.getItem('isConfirm') || 0;
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

    function setProfile(firstName, lastName) {
        window.localStorage.setItem('firstName', firstName);
        window.localStorage.setItem('lastName', lastName);
    }

    function getProfile() {
        return {
            firstName: window.localStorage.getItem('firstName'),
            lastName: window.localStorage.getItem('lastName')
        }
    }

    function deleteUserData() {
        window.localStorage.clear();
    }

    function setSalt(salt, username) {
        window.localStorage.setItem('salt', salt + '::' + username);
    }

    function getSalt() {
        return window.localStorage.getItem('salt') || false;
    }

    function setBalance(balance) {
        window.localStorage.setItem('balance', balance);
    }

    function getBalance() {
        return window.localStorage.getItem('balance') || 0;
    }

    function setUsernameRecover(email) {
        window.localStorage.setItem('username_recover', email);
    }

    function getUsernameRecover() {
        return window.localStorage.getItem('username_recover');
    }

    function setResultPayment(data) {
        window.localStorage.setItem('result_payment', data);
    }

    function getResultPayment() {
        return window.localStorage.getItem('result_payment');
    }

    return {
        setIsLogged: setIsLogged,
        getIsLogged: getIsLogged,
        setIsConfirm: setIsConfirm,
        getIsConfirm: getIsConfirm,
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
        getSalt: getSalt,
        setBalance: setBalance,
        getBalance: getBalance,
        setUsernameRecover: setUsernameRecover,
        getUsernameRecover: getUsernameRecover,
        setResultPayment: setResultPayment,
        getResultPayment: getResultPayment
    };
});