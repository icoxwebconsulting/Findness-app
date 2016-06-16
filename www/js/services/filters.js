app.factory('filterSrv', function ($q, $http, $rootScope, qualitas) {

    var cnaes;
    var states;
    //
    var selectedCnaes;
    var selectedFilter = {
        type: 2,
        name: "Radio de 5km",
        options: {
            km: 5
        }
    };

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
        return list.items.filter(function (el) {
            return el[prop].indexOf(query) > -1
        });
    }

    function getCnaes(query) {
        var deferred = $q.defer();

        if (!cnaes) {
            readCnaesJson().then(function (data) {
                cnaes = data;
                var filtered = filter(cnaes, query, 'view');
                console.log("va a retornar", filtered.length, "de la búsqueda", query)
                console.log(filtered);
                deferred.resolve({
                    items: filtered
                });
            })
        } else {
            var filtered = filter(cnaes, query , 'view');
            console.log("va a retornar", filtered.length, "de la búsqueda", query)
            console.log(filtered);
            deferred.resolve({
                items: filtered
            });
        }

        return deferred.promise;
    }

    function queryStates() {
        //var deferred = $q.defer();

        return qualitas().searchStates().$promise
            .then(function (response) {
                console.log("1...-",response);
                return response;
            })
            .catch(function (response) {
                console.log(response);
            });

        //return deferred.promise;
    }

    function getStates(query) {
        var deferred = $q.defer();

        if (!states) {
            queryStates().then(function (data) {
                console.log("2...-",data)
                states = {
                    items: data
                };
                var filtered = filter(states, query, "name");
                console.log("va a retornar", filtered.length, "de la búsqueda", query)
                console.log(filtered);
                deferred.resolve({
                    items: filtered
                });
            })
        } else {
            var filtered = filter(states, query, "name");
            console.log("va a retornar", filtered.length, "de la búsqueda", query)
            console.log(filtered);
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

    function getSelectedCnaes() {
        return selectedCnaes;
    }

    function setSelectedCnaes(selection) {
        selectedCnaes = selection;
    }

    function getSelectedFilter() {
        return selectedFilter;
    }

    function setSelectedFilter(selection) {
        selectedFilter = selection;
        $rootScope.$emit('changeFilter', {
            choice: selectedFilter
        });
    }

    return {
        getCnaes: getCnaes,
        getStates: getStates,
        getSelectedCnaes: getSelectedCnaes,
        setSelectedCnaes: setSelectedCnaes,
        omitirAcentos: omitirAcentos,
        getSelectedFilter: getSelectedFilter,
        setSelectedFilter: setSelectedFilter
    };
});
