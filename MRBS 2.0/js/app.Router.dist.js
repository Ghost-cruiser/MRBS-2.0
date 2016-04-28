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