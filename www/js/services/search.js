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
                deferred.resolve({
                    items: filtered
                });
            })
        } else {
            var filtered = filter(cnaes, query, 'view');
            deferred.resolve({
                items: filtered
            });
        }

        return deferred.promise;
    }

    function queryStates() {
        return qualitas().searchStates().$promise
            .then(function (response) {
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

    function readZipcodesJson() {
        var deferred = $q.defer();

        $http.get('js/zipcodes.json',
            {header: {'Content-Type': 'application/json; charset=UTF-8'}}
        ).then(function (zipcodes) {
            deferred.resolve(zipcodes.data);
        }).catch(function () {
            deferred.reject(false);
        });

        return deferred.promise;
    }

    function getStates(query) {
        var deferred = $q.defer();
        query = query.toUpperCase();
        if (!states) {
            queryStates().then(function (data) {
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
        var deferred = $q.defer();
        var data = {
            state: selectState.id
        };
        query = query.toUpperCase();
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
            readZipcodesJson().then(function (data) {
                zipcodes = data;
                var filtered = filter(zipcodes, query);
                deferred.resolve({
                    items: filtered
                });
            })
        } else {
            var filtered = filter(zipcodes, query);
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

    function callSearch(accessToken, query) {
        return qualitas(accessToken).search(query).$promise
            .then(function (response) {
                    return response;
                },
                function (e) {//error handler
                    throw e;
                })
    }

    function searchQualitas(query) {
        var token = userDatastore.getTokens();
        var deferred = $q.defer();
        var llevo = 0;
        var total = 0;

        function exec() {
            storeQuery(query);
            callSearch(token.accessToken, query).then(function (response) {
                if (!response.hasOwnProperty("error")) {
                    if (query.page == 1) {
                        console.log('response.TotalElementos',response.TotalElementos);
                        total = response.TotalElementos - response.TotalElementosNoConsultados;
                        llevo = response.ElementosDevueltos;
                    } else {
                        llevo += response.ElementosDevueltos;
                    }
                    console.log("query nro "+ query.page  + ' llevo ' + ' < ' + 'total ' + total);
//                    debugger;
                    query.page += 1;
                    setResultSearch(response);
                    if (llevo < total) {
                        exec();
                    } else {
                        //fin del query
                        console.log("fin de la cadena", getResultSearch());
                        deferred.resolve(getResultSearch());
                    }
                } else {
                    deferred.reject(response.error);
                }
            }).catch(function (e) {
                console.log("error", e);
                deferred.reject(e);
            });
        }

        exec();

        return deferred.promise;
    }

    function setResultSearch(result) {
        if (result.Pagina == 1) {
            resultSearch = result;
        } else {
            var previous = resultSearch.items;
            resultSearch = result;
            resultSearch.items = angular.extend(resultSearch.items, previous);
        }
    }

    function getResultSearch() {
        return resultSearch;
    }

    function resetResultSearch() {
        resultSearch = null;
    }

    function executeLastQuery(quantity) {
        var options = JSON.parse(getLastQuery());
        var token = userDatastore.getTokens();
        options.nonViewedCompanies = quantity;

        return qualitas(token.accessToken).search(options).$promise
            .then(function (response) {
                    if (response.hasOwnProperty("error")) {
                        throw response.error;
                    } else {
                        //retorna el query no los resultados
                        setResultSearch(response);
                        return options;
                    }
                },
                function (e) {//error handler
                    throw e;
                })
    }

    function withResults() {
        return (typeof resultSearch == 'object' && (typeof resultSearch.items == 'object' && Object.keys(resultSearch.items).length > 0))
    }

    function getNonConsultedElements() {
        return resultSearch.TotalElementosNoConsultados;
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
        executeLastQuery: executeLastQuery,
        setResultSearch: setResultSearch,
        resetResultSearch: resetResultSearch,
        withResults: withResults,
        getNonConsultedElements: getNonConsultedElements
    };
});
