// Logique de génération des factures mensuelles ou ponctuelles
(function () {

    'use strict';
    angular.module('invoice').controller('InvoiceController',
        ['$scope', 'InvoiceFactory,', 'InvoiceService', 'InvoiceTextFileService', 'InvoicePrintService', 'InvoiceTotalService']);

    function InvoiceController($scope, InvoiceFactory, InvoiceService, InvoiceTextFileService, InvoicePrintService, TotalInvoiceService)
    {

        var ctrl = this; // we're in a service controller
        /*
            Injecter pouvoir appeler InvoiceFactory  + les autres services !!
    
            => pointer d'autres services ou des factories qui exécutent des actions
            controller = répartiteur
        */

        function saveInvoice() {
            InvoiceService.SaveInvoice(
                {
                    totalHT: ctrl.selctedInvoices.totalHT,
                    month: ctrl.selctedInvoices.month,
                    year: ctrl.selctedInvoices.year,
                    appliedReduction: ctrl.selctedInvoices.appliedReduction
                });
        }
       // $scope.userName = "toto";
    }


})();