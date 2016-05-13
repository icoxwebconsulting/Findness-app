app.factory('filterSrv', function ($q, $http, $filter, $timeout) {

    var cnaes;

    function readCnaesJson() {
        console.log("leyendo json con cnaes");
        var deferred = $q.defer();

        $http.get('js/cnaes.json',
            {header: {'Content-Type': 'application/json; charset=UTF-8'}}
        ).then(function (cnaeArray) {
            console.log(cnaeArray);
            deferred.resolve(cnaeArray.data);
        }).catch(function () {
            deferred.reject(false);
        });

        return deferred.promise;
    }

    function filter(cnaes, query) {
        return cnaes.items.filter(function (el) {
            return el.view.indexOf(query) > -1
        });
    }

    function getCnaes(query) {
        var deferred = $q.defer();

        if (!cnaes) {
            readCnaesJson().then(function (data) {
                cnaes = data;
                console.log("hizo el resolve ");
                var filtered = filter(cnaes, query)
                console.log("va a retornar", filtered.length, "de la búsqueda", query)
                console.log(filtered);
                deferred.resolve({
                    items: filtered
                });
            })
        } else {
            console.log("ya existe cnae");
            var filtered = filter(cnaes, query)
            console.log("va a retornar", filtered.length, "de la búsqueda", query)
            console.log(filtered);
            deferred.resolve({
                items: filtered
            });
        }

        return deferred.promise;
    }

    return {
        getCnaes: getCnaes
    };
});
