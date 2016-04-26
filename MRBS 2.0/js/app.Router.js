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
                    templateUrl: 'js/components/authentication/login.html',
                    controllerAs: 'ctrl'
                })

                .when('/Inscription', {
                    controller: '',
                    templateUrl: 'partials/register.html',
                    controllerAs: 'ctrl'
                })

                .when('/Rapport', {
                    controller: '',
                    templateUrl: 'partials/register.html',
                    controllerAs: 'ctrl'
                })

                .when('/Salles', {
                    controller: 'AreaEditController',
                    templateUrl: 'js/components/admin/areas/areaEdit.html',
                    controllerAs: 'ctrl'
                })

                .when('/Calendrier', {
                    controller: 'PlanningController',
                    templateUrl: 'js/components/planning/planning.html',
                    controllerAs: 'ctrl'
                })

                .when('/Aide', {
                    controller: '',
                    templateUrl: 'js/components/help/help.html',
                    controllerAs: 'ctrl'
                })

                .when('/Reservations', {
                    controller: 'BookingController',
                    templateUrl: 'js/components/booking/booking.html',
                    controllerAs: 'ctrl'
                })

                .otherwise({ redirectTo: '/' });
        }
})();