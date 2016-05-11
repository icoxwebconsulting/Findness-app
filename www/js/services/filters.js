app.factory('filters', function ($q, $rootScope, $http) {

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

    function getCnaes() {
        var deferred = $q.defer();
        if (!cnaes) {
            readCnaesJson().then(function (data) {
                cnaes = data;
                console.log("hizo el resolve ", cnaes);
                deferred.resolve(cnaes);
            })
        } else {
            console.log("ya existe cnae");
            deferred.resolve(cnaes);
        }

        return deferred.promise;
    }

    return {
        getCnaes: getCnaes
    };
});
