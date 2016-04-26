(function () {
    'use strict';

    angular.module('settings').service('settingsLocationService',
        [settingsLocationService]);

    function settingsLocationService() {
        //TODO : éclater en plusieurs petits services
            /// <summary>
            /// Service retrieving general settings.
            /// </summary>
            /// <returns></returns>
            var start = new Date(1970, 1, 1, 8, 30);
            var end = new Date(1970, 1, 1, 19, 30);

            return {
                OpeningHours: { start: start, end: end },
                MinimalTimeRent: 30,
                MinimalSlotSize: 15,
            }
    }
})();