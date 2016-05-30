app.service('searchSrv', function ($q, sqliteDatastore, userDatastore, qualitas, map, DATETIME_FORMAT_CONF) {

    var sqlDateTimeFormat = DATETIME_FORMAT_CONF.dateTimeFormat;
    var resultSearch;

    function searchQualitas() {
        var token = userDatastore.getTokens();

        var data = {
            cnaes: JSON.stringify([01])
        };

        return qualitas(token.accessToken).search(data).$promise
            .then(function (response) {
                setResultSearch(response);
                console.log(response);
                map.processMakers(response.items);
            })
            .catch(function (response) {
                console.log(response);
            });
    }

    function setResultSearch(result) {
        resultSearch = result;
    }

    function getResultSearch() {
        return resultSearch;
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
        searchQualitas: searchQualitas,
        searchCities: searchCities,
        searchPostalCodes: searchPostalCodes,
        searchStates: searchStates,
        getResultSearch: getResultSearch
    }
});