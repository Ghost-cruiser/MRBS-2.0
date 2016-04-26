(function(){
    // Implémente la logique LogIn/LogOut
    'use strict';
    angular.module('authentication').controller('loginCtrl',
        ['$location', 'AuthenticationService', 'FlashService', LoginController]);

    function LoginController($location, AuthenticationService, FlashService) {

            var ctrl = this;

            ctrl.login = login;

            return ctrl;

            (function initController() {
                // reset login status
                AuthenticationService.ClearCredentials();
            })();

            function login() {
                ctrl.dataLoading = true;
                AuthenticationService.Login(ctrl.username, ctrl.password, function (response) {
                    if (response.success) {
                        AuthenticationService.SetCredentials(ctrl.username, ctrl.password);
                        $location.path('/');
                    } else {
                        console.log(response);
                        FlashService.Error(response.message, true);
                        ctrl.dataLoading = false;
                        alert(response.message);
                    }
                });
            };
        }
})();