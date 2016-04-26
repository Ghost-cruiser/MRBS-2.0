(function () {

    'use strict';
    angular.module('invoice').service('InvoiceService'
         ['$scope', 'ContextService,', InvoiceService]);

    function InvoiceService(ContextService) {

        /* 
            Doit permettre de faire une requête sur les factures...
            Injecter ContextService... (chercher en DB)
        */

        this.SaveInvoice = SaveInvoice;
        this.GetInvoices = GetInvoices;

        return this;

        function SaveInvoice(data) {
            ContextService._post('invoices', 'error while saving an invoice', data);
        }

        function GetInvoicesByEntries() {
            return ContextService._post('/invoices/month/year')
                .then(function (result) { return result.data })
        };

    }
})();