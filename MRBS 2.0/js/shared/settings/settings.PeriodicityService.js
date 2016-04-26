(function () {
    'use strict';

   
    angular.module('settings').service('SettingsPeriodicityService',
        [SettingsPeriodicityService]);

    function SettingsPeriodicityService() {
        //TODO : éclater en plusieurs petits services
            /// <summary>
            /// Service retrieving settings for the periodicity.
            /// </summary>
            /// <returns></returns

            return {
                    Week: {
                        maximumSpan: 10,
                        maximumRepeat: 10,
                    },
                    Month: {
                        maximumRepeat: 10,
                    },
                    Year: {
                        maximumRepeat: 10,
                    },
                }
            }
})();