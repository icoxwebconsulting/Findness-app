app.factory('searchesService', function ($q, userDatastore, searches) {

    function getSearches() {
        var token = userDatastore.getTokens();

        return searches(token.accessToken).get().$promise
            .then(function (response) {
                return response;
            })
            .catch(function (response) {
                console.log(response);
            });
    }

    function update(search, name) {
        var token = userDatastore.getTokens();

        return searches(token.accessToken).update({search: search}, {name: name}).$promise
            .then(function (response) {
                return response;
            })
            .catch(function (response) {
                console.log(response);
            });
    }

    function remove(search) {
        var token = userDatastore.getTokens();

        return searches(token.accessToken).delete({search: search}).$promise
            .then(function (response) {
                return response;
            })
            .catch(function (response) {
                console.log(response);
            });
    }

    return {
        getSearches: getSearches,
        update: update,
        remove: remove
    };
});
