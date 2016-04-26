(function () {
    // Controller used for the logStripe    
    'use strict';
    angular.module('authentication').controller('UserController',
        ['$location', '$rootScope', '$scope', 'AuthenticationService', UserController]);

    function UserController($location, $rootScope, $scope, AuthenticationService) {

        // Button "Connection"
        $scope.toAuthentication = function () {
            $location.path('/Authentification').replace();
        };

        $scope.unlogUser = function () {
            AuthenticationService.ClearCredentials();
            $location.path('/Authentification').replace();
        };

        $rootScope.$watch('loggedIn', connectionChanged, true);

        function connectionChanged() {
            if ($rootScope.loggedIn)
                $scope.CurrentUser = $rootScope.globals.currentUser.username;
            else
                $scope.CurrentUser = "Visiteur";
        };

    }
})();