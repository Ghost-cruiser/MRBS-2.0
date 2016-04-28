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






(function () {

    'use strict';
    angular.module('MRBS').config(
        ['$routeProvider', '$locationProvider', router]);

        function router($routeProvider, $locationProvider) {
            $routeProvider
                .when('/', {
                    //controller: 'userCtrl', //Devra retourner une vue en fonction du niveau de l'utilisateur
                    //templateUrl: 'components/authentication/login.html',
                    controllerAs: 'vm'
                })

                .when('/Authentification', {
                    controller: 'loginCtrl',
                    templateUrl: 'pages/login.html',
                    controllerAs: 'ctrl'
                })

                .when('/Salles', {
                    controller: 'AreaEditController',
                    templateUrl: 'pages/areaEdit.html',
                    controllerAs: 'ctrl'
                })

                .when('/Calendrier', {
                    controller: 'PlanningController',
                    templateUrl: 'pages/planning.html',
                    controllerAs: 'ctrl'
                })

                .when('/Aide', {
                    controller: '',
                    templateUrl: 'pages/help.html',
                    controllerAs: 'ctrl'
                })

                .when('/Reservations', {
                    controller: 'BookingController',
                    templateUrl: 'pages/booking.html',
                    controllerAs: 'ctrl'
                })

                .otherwise({ redirectTo: '/' });
        }
})();
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