(function () {
    'use strict';
    angular.module('shared').directive('nwDatePicker',
        [function () {
            return {
                scope: { selectedDate: '=selectedDate', onDateChanged: '=onDateChanged', },

                template: '<div class="datepicker" style="display:inline;"> <input data-ng-model="selectedDate" type="date" style="width: 150px; border:none;"><span class="glyphicon glyphicon-calendar" data-ng-click="viewCalendar = !viewCalendar"></span><div class="container"style="position:absolute; top:60px; z-index:1; left:50%;background-color:white; border:solid"data-ng-if="viewCalendar"><div data-nw-calendar="" number-of-months="1"></div> </div> </div>',

                controller: ['$scope', function ($scope) {
                    $scope.selectedDate = new Date();
                    if ($scope.onDateChanged) {
                        $scope.$watch('selectedDate', $scope.onDateChanged, true);
                    }
                }]
            }
    }]);

})();





