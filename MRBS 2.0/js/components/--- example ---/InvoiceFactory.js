/*
    Injecter EntriesService, InvoiceService de manière à récup les réservations correspondantes...
    /!\ Processus de query asynchrone, doit être fini avant de return l'invoice ! (no calcul sinon)
    => stacker les fonctions dans un .then (comme dans les routes)

    Doit pouvoir récupérer certains paramètres, tels que les dates, réservations...
    => dans le return, associer des functions au lieu des paramètres...
*/


(function () {
    'use strict';
    angular.module('invoice').factory('InvoiceFactory',
        ['$scope', 'EntriesService']);

    function InvoiceFactory($scope, EntriesService) {

        var fac = this;

        fac.Invoices = [];

        fac.entriesID = [];

        fac.entries = {};
        fac.selctedInvoices = {};

        function saveInvoice() {
            var entry = $scope.entries;

            if (entry) {
                angular.forEach(entry, function (value, key) {
                    fac.entriesID[key] = value.id;
                });

                if (entry.length == 1) {
                    QueryEntriesForDateAndRooms();
                    $scope.entries = entry[0];
                }
                else {
                    QueryEntriesForDateAndRooms();
                }
            }
        }
    }
})();