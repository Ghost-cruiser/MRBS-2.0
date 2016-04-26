(function () {
    'use strict';
    angular.module('shared').service('ContextService',
        ['$http', ContextService]);

    function ContextService($http) {
        /// <summary>
        /// Service providing the Database access : exposes POST and GET methods. Define or retrieve here the URL.
        /// </summary>
        /// <dependency name="$http">$http (native) </param>
        /// <returns></returns>
        var URL = 'http://localhost:1337/api/';

        var service = this;

        angular.extend(service, {
            _post: _post,
            _get: _get,
            _put: _put,
        })

        return service;

        function _post(URI, data) {
            if (data) {
                return $http.post(URL + URI, data)
                    .then(handleSuccess, handleError)
            }
            else return handleError('\nAucune donnée fournie.');

        };
        function _put(URI, data) {
            if (data) {
                return $http.put(URL + URI, data)
                    .then(handleSuccess, handleError)
            }
            else return handleError('\nAucune donnée fournie.');

        };

        function _get(URI) {
            return $http.get(URL + URI)
                .then(handleSuccess, handleError)
        };

        function handleSuccess(result) {
            return { success: true, data: result };
        };

        function handleError(error) {
            return error;
        };
    }

})();