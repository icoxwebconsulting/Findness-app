app.factory('searchService', function ($q, $http, $rootScope, userDatastore, qualitas) {

    var cnaes;
    var states;
    var cities;
    var zipcodes;
    var resultSearch;

    function readCnaesJson() {
        var deferred = $q.defer();

        $http.get('js/cnaes.json',
            {header: {'Content-Type': 'application/json; charset=UTF-8'}}
        ).then(function (cnaeArray) {
            deferred.resolve(cnaeArray.data);
        }).catch(function () {
            deferred.reject(false);
        });

        return deferred.promise;
    }

    function filter(list, query, prop) {
        if (prop != undefined) {
            return list.items.filter(function (el) {
                return el[prop].indexOf(query) > -1
            });
        } else {
            return list.items.filter(function (el) {
                return el.indexOf(query) > -1
            });
        }

    }

    function getCnaes(query) {
        var deferred = $q.defer();

        if (!cnaes) {
            readCnaesJson().then(function (data) {
                cnaes = data;
                var filtered = filter(cnaes, query, 'view');
                console.log("va a retornar", filtered.length, "de la búsqueda", query)
                deferred.resolve({
                    items: filtered
                });
            })
        } else {
            var filtered = filter(cnaes, query, 'view');
            console.log("va a retornar", filtered.length, "de la búsqueda", query)
            deferred.resolve({
                items: filtered
            });
        }

        return deferred.promise;
    }

    function queryStates() {
        return qualitas().searchStates().$promise
            .then(function (response) {
                console.log("1...-", response);
                return response;
            })
            .catch(function (response) {
                console.log(response);
            });
    }

    function queryCities(data) {
        return qualitas().searchCities(data).$promise
            .then(function (response) {
                return response;
            })
            .catch(function (response) {
                console.log(response);
            });
    }

    function queryZipcodes() {
        return qualitas().searchPostalCodes().$promise
            .then(function (response) {
                return response;
            })
            .catch(function (response) {
                console.log(response);
            });
    }

    function getStates(query) {
        var deferred = $q.defer();

        if (!states) {
            queryStates().then(function (data) {
                console.log("2...-", data)
                states = {
                    items: data
                };
                var filtered = filter(states, query, "name");
                deferred.resolve({
                    items: filtered
                });
            })
        } else {
            var filtered = filter(states, query, "name");
            deferred.resolve({
                items: filtered
            });
        }

        return deferred.promise;
    }

    function getCities(query, selectState) {
        console.log(selectState);
        var deferred = $q.defer();
        var data = {
            state: selectState.id
        };
        queryCities(data).then(function (data) {
            cities = {
                items: data
            };
            var filtered = filter(cities, query, "name");
            deferred.resolve({
                items: filtered
            });
        });

        return deferred.promise;
    }

    function getZipcodes(query) {
        var deferred = $q.defer();

        if (!zipcodes) {
            queryZipcodes().then(function (data) {
                console.log("2...-", data)
                zipcodes = {
                    items: data
                };
                var filtered = filter(zipcodes, query);
                console.log("va a retornar", filtered.length, "de la búsqueda", query)
                deferred.resolve({
                    items: filtered
                });
            })
        } else {
            var filtered = filter(zipcodes, query);
            console.log("va a retornar", filtered.length, "de la búsqueda", query)
            deferred.resolve({
                items: filtered
            });
        }

        return deferred.promise;
    }

    function omitirAcentos(text) {
        var acentos = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüû";
        var original = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuu";
        for (var i = 0; i < acentos.length; i++) {
            text = text.replace(acentos.charAt(i), original.charAt(i));
        }
        return text;
    }

    function storeQuery(query) {
        window.localStorage.setItem('lastQuery', JSON.stringify(query));
    }

    function getLastQuery() {
        return window.localStorage.getItem('lastQuery') || null;
    }

    function searchQualitas(query) {
        var token = userDatastore.getTokens();

        storeQuery(query);

        return qualitas(token.accessToken).search(query).$promise
            .then(function (response) {
                setResultSearch(response);
                //map.processMakers(response.items);
                return response;
            })
            .catch(function (response) {
                console.log(null);
            });
    }

    function setResultSearch(result) {
        resultSearch = result;
    }

    function getResultSearch() {
        return resultSearch;
    }

    function executeLastQuery(quantity) {
        var options = JSON.parse(getLastQuery());
        var token = userDatastore.getTokens();
        options.nonViewedCompanies = quantity;

        return qualitas(token.accessToken).search(options).$promise
            .then(function (response) {
                setResultSearch(response);
                //retorna el query no los resultados
                return options;
            })
            .catch(function (response) {
                console.log(response);
            });
    }

    return {
        getCnaes: getCnaes,
        getStates: getStates,
        getCities: getCities,
        getZipcodes: getZipcodes,
        omitirAcentos: omitirAcentos,
        searchQualitas: searchQualitas,
        getResultSearch: getResultSearch,
        getLastQuery: getLastQuery,
        executeLastQuery: executeLastQuery
    };
});
