app.controller('SearchesCtrl', function ($scope, $rootScope, $state, $ionicModal, searchesService,
                                         searchService, routeService, $ionicPopup, cart, map, $ionicLoading,
                                         $ionicListDelegate, subscriptionSrv) {

    $scope.items;

    function getSearches() {
        searchesService.getSearches().then(function (result) {
            $scope.items = result.searches;
        }).catch(function () {
            console.log("Error");
        });
    }

    $scope.$on('$ionicView.enter', function (e) {
        getSearches();
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
        var validate = subscriptionSrv.validateSubscription('');

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
            if (results.TotalElementosNoConsultados == 0) {
                //caso 3 mostrar mapa sin popup
                map.setShowPopup(false);
            } else {
                if (validate == true) {
                    $ionicPopup.alert({
                        title: 'Cuenta',
                        template: '<div>Se han encontrado ' + searchService.getNonConsultedElements() + ' empresas.</div>',
                        okText: 'Activar',
                    }).then(function (res) {
                        if (res) {
                            $state.go('app.account');
                        }
                    });
                    map.setShowPopup(false);
                }
                else {
                    //caso 4 mostrar mapa con popup
                    map.setShowPopup(true);
                }
            }
            routeService.setModes(false, false);
            map.deleteRouteLines().then(function () {
                $state.go("app.map");
            });
        }
    }

    $scope.callSearch = function (search) {

        console.info('search --> ', search);
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
            if (typeof search.filters.cities == 'object' && search.filters.cities.hasOwnProperty('cities') && search.filters.cities.cities.length > 0) {
                options.cities = JSON.stringify(search.filters.cities);
            }

            if (search.filters.states && search.filters.states.length > 0) {
                options.states = JSON.stringify(search.filters.states);
            }

            if (search.filters.postalCodes && search.filters.postalCodes.length > 0) {
                options.postalCodes = JSON.stringify(search.filters.postalCodes);
            }
        }

        searchService.searchQualitas(options).then(function (response) {
            $ionicLoading.hide();
            console.log("resultados searches", response);
            processResults(response);
        }).catch(function (e) {
            $ionicLoading.hide();
            console.log("Catch de la busqueda", e);
            $ionicPopup.alert({
                title: "Ocurrió un error al realizar la búsqueda, intente más tarde."
            });
        });
    };

    $scope.delete = function (search, index) {
        searchesService.remove(search.id)
            .then(function (response) {
                if (response.deleted) {
                    $scope.items.splice(index, 1);
                }
            })
            .catch(function () {
                $ionicListDelegate.closeOptionButtons();
            });
    };

    $scope.changeNameSearch = null;
    $scope.showChangeName = function (search) {
        $ionicModal.fromTemplateUrl('templates/searches-change-name.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.changeNameSearch = search;
            $scope.modal = modal;
            $scope.modal.show();
        });

        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });

        // Execute action on hide modal
        $scope.$on('modal.hidden', function () {
            $scope.changeNameSearch = null;
        });

        // Execute action on remove modal
        $scope.$on('modal.removed', function () {
            $scope.changeNameSearch = null;
        });
    };

    $scope.changeName = function () {
        $ionicLoading.show();
        searchesService.update($scope.changeNameSearch.id, $scope.changeNameSearch.name)
            .then(function (response) {
                if (!response.updated) {
                    $scope.items = null;
                    getSearches();
                }
                $ionicLoading.hide();
                $scope.modal.hide();
                $ionicListDelegate.closeOptionButtons();
            })
            .catch(function () {
                $ionicLoading.hide();
                $scope.modal.hide();
                $ionicListDelegate.closeOptionButtons();
            });
    };
});
