app.controller('SearchesCtrl', function ($scope, $rootScope, $state, searchesService, searchService, $ionicPopup, cart, $ionicLoading) {

    $scope.items;

    $scope.$on('$ionicView.enter', function (e) {
        searchesService.getSearches().then(function (result) {
            $scope.items = result.searches;
        });
    });

    function processResults(results) {
        /*
         CASOS:
         1- Si el total de resultados es 0 y el total de empresas por comprar es 0: Mostrar no hay resultados
         2- Si el total de resultados es 0 y el total de empresas por comprar es diferente de 0: Ir al carrito
         3- Si el total de resultados es diferente de 0 y el total de empresas por comprar es 0: Mostrar el mapa sin popup
         4- Si el total de resultados es diferente de 0 y el total de empresas por comprar es diferente de 0: Mostrar el mapa con un popup al carrito
         - Cuando se visualicen las búsquedas en el mapa  en la parte superior debe salir un selector para cambiar el modo entre mapa y listado
         */
        // if(!results){
        //
        //     return;
        // }

        if (results.ElementosDevueltos == 0) {
            if (results.TotalElementosNoConsultados == 0) {
                //Caso 1
                $ionicPopup.alert({
                    title: "La búsqueda no obtuvo resultados."
                });
                return;
            } else {
                //Caso 2 ir al carrito
                cart.setTotalCompanies(results.TotalElementosNoConsultados);
                $state.go("app.cart");
            }
        } else {
            //caso 3 mostrar mapa sin popup
            var popup = false;
            if (results.TotalElementosNoConsultados != 0) {
                //caso 4 mostrar mapa con popup
                popup = true;
            }
            $rootScope.$emit('showResults', {
                showPopUp: popup,
                toBuy: results.TotalElementosNoConsultados
            });
            $state.go("app.map");
        }
    }

    $scope.callSearch = function (search) {
        console.log(search);
        $ionicLoading.show({
            template: '<p>Realizando búsqueda seleccionada</p><p><ion-spinner icon="android"></ion-spinner></p>'
        });
        var options = {
            page: 1,
            cnaes: JSON.stringify(search.filters.cnaes)
        };
        if (search.filters.geoLocation.hasOwnProperty("latitude")) {
            options.geoLocations = search.filters.geoLocation;
        } else {
            if (search.filters.states.length > 0) {
                options.states = JSON.stringify(search.filters.states);
            }

            if (search.filters.cities.length > 0) {
                options.cities = JSON.stringify(search.filters.cities);
            }

            if (search.filters.postalCodes.length > 0) {
                options.postalCodes = JSON.stringify(search.filters.postalCodes);
            }
        }

        console.log(options);
        searchService.searchQualitas(options).then(function (response) {
            $ionicLoading.hide();
            console.log("resultados searches", response);
            processResults(response);
        }).catch(function (e) {
            $ionicLoading.hide();
            console.log("Catch de la busqueda", e);
        });
    }

});