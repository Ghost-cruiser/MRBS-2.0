(function () {
    'use strict';
    angular.module('nwprototypes').directive('nwDatePicker',
        [function () {
            return {
                scope: { selectedDate: '=selectedDate', onDateChanged: '=onDateChanged', },

                templateUrl: 'js/components/nw-prototypes/nw-date-picker/nw-date-picker.html',

                controller: ['$scope', function ($scope) {
                    $scope.selectedDate = new Date();
                    if ($scope.onDateChanged) {
                        $scope.$watch('selectedDate', $scope.onDateChanged, true);
                    }
                }]
            }
    }]);

})();





