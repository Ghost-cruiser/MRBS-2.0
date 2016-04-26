(function () {
    'use strict';

    angular.module('booking').service('BookingService',
        ['ContextService', BookingService]);

    function BookingService(ContextService) {

        this.SaveEntries = SaveEntries;

        return this;

        ///////////////////////////////////////
        // TODO Periodicity is not retrieve properly. dateAndTime have not been tested.
        function SaveEntries(entries) {

            ContextService._post('entries', entries)
                    .then(function successCallback(response) {
                        console.log(response);
                    }, function errorCallback(response) {
                        console.log("Ops: " + response.error);
                    });
        }

    }

})();