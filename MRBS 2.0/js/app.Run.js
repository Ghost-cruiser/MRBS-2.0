(function () {

    'use strict';
    angular.module('MRBS').run(
        ['$rootScope', '$location', '$cookies', '$http', runner]);

    function runner($rootScope, $location, $cookies, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookies.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        //$rootScope.$on('$locationChangeStart', function (event, next, current) {
        //    // redirect to login page if not logged in and trying to access a restricted page
        //    //var restrictedPage = angular.inArray($location.path(), ['/Authentification', '/Inscription', '/Aide']) === -1;
        //    var loggedIn = $rootScope.globals.currentUser;
        //    if ( !loggedIn) {
        //        $location.path('/Authentification');
        //    }
        //});
    }
})();