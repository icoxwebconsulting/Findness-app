app.factory('filterSrv', function ($q, $http) {

    var cnaes;
    //
    var selectedCnaes;
    var selectedFilter;

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
                var filtered = filter(cnaes, query)
                console.log("va a retornar", filtered.length, "de la búsqueda", query)
                console.log(filtered);
                deferred.resolve({
                    items: filtered
                });
            })
        } else {
            var filtered = filter(cnaes, query)
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
    }

    return {
        getCnaes: getCnaes,
        getSelectedCnaes: getSelectedCnaes,
        setSelectedCnaes: setSelectedCnaes,
        omitirAcentos: omitirAcentos,
        getSelectedFilter: getSelectedFilter,
        setSelectedFilter: setSelectedFilter
    };
});
