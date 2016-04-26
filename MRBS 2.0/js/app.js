(function () {
    'use strict';

    angular.module("MRBS",
        [
            'ngRoute', 
            'ngCookies',

            'shared',

            'authentication',
            'booking',
            'areas',
            'planning',
            'nwprototypes',
        ]);
})();





