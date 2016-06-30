app.factory('searchesService', function ($q, userDatastore, searches) {

    function getSearches() {
        var token = userDatastore.getTokens();
        
        return searches(token.accessToken).get().$promise
            .then(function (response) {
                console.log(response);
                return response;
            })
            .catch(function (response) {
                console.log(response);
            });
    }

    return {
        getSearches: getSearches
    };
});
