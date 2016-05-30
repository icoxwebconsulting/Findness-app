app.service('searchSrv', function ($q, sqliteDatastore, userDatastore, qualitas, DATETIME_FORMAT_CONF) {

    var sqlDateTimeFormat = DATETIME_FORMAT_CONF.dateTimeFormat;

    function search() {
        var token = userDatastore.getTokens();
        return qualitas.search(token.accessToken).then(function () {

        })
    }

    function searchCities() {
        return qualitas.searchCities().then(function () {

        })
    }

    function searchPostalCodes() {
        return qualitas.searchStates().then(function () {

        })
    }

    function searchStates() {
        return qualitas.searchStates().then(function () {

        })
    }

    return {
        search: search,
        searchCities: searchCities,
        searchPostalCodes: searchPostalCodes,
        searchStates: searchStates
    }
});