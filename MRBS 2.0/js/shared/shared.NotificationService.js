(function () {
    // Permet de renvoyer des messages de validation ou 
    // d'erreur dans l'application
    'use strict';
    angular.module('shared').service('NotificationService',
        ['$rootScope', NotificationService]);

    function NotificationService($rootScope) {

        var service = this;

        service.NotifyOnError = NotifyOnError;
        service.NotifyResult = NotifyResult;

        initService();

        return service;

        function initService() {
            $rootScope.$on('$locationChangeStart', function () {
                clearFlashMessage();
            });

            function clearFlashMessage() {
                var flash = $rootScope.flash;
                if (flash) {
                    if (!flash.keepAfterLocationChange) {
                        delete $rootScope.flash;
                    } else {
                        // only keep for a single location change
                        flash.keepAfterLocationChange = false;
                    }
                }
            }
        }

        function Notification(message, type, keepAfterLocationChange) {
            console.log(message);
            $rootScope.flash = {
                message: message,
                type: type,
                keepAfterLocationChange: keepAfterLocationChange
            };
        }

        function NotifyResult(success, messages, keepAfterLocationChange) {
            var message = "";
            var type = "";

            if (success) {
                message = messages.ifSuccess;
                type = "Success";
            }
            else {
                message = messages.ifError;
                type = "Error";
            }
            Notification(message,  keepAfterLocationChange);
        }

        function NotifyOnError(success, message, keepAfterLocationChange) {
            if (!success) {
                Notification(message, "Error", keepAfterLocationChange);
            }
        }
    }

})();