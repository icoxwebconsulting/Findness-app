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
        return cnaes;
    }

    function getCnaes(query) {
        var deferred = $q.defer();
        //$filter('filter')(cnaes, expression, comparator)
        //TODO: filtrar aqui
        if (!cnaes) {
            readCnaesJson().then(function (data) {
                cnaes = data;
                console.log("hizo el resolve ");

                deferred.resolve(filter(cnaes, query));
            })
        } else {
            console.log("ya existe cnae");
            deferred.resolve(filter(cnaes, query));
        }

        return deferred.promise;
    }

    return {
        getCnaes: getCnaes
    };
});
