﻿(function (angular) {
    'use strict';
    angular.module('nwprototypes').directive('nwCalendar',
        [
            'Datetime',
            'nwCalendarFactory',

            function (datetime, nwCalendarFactory) {
            return {
                template: '<div class="row-calendars"> <div style="display:flex; align-items:center"> <span class="glyphicon glyphicon-arrow-left leftsmall-menu-glyph" data-ng-click="ctrl.previousMonth()"></span> </div> <div class="row-calendars"> <div data-ng-repeat="(keyMonth, month) in ctrl.DisplayedMonths"data-ng-attr-id="{{\'displayedmonth:\' + keyMonth}}"><label>{{month.currentMonth + \' \' +month.Year}}</label><div> <div data-nw-datagrid=""data-on-selected-item-changed="ctrl.SelectDate(item, month);"data-datasource="month.fullMonth"data-headers="Headers"data-are-row-headers-visible="false"data-table-classes="tableClasses"data-header-classes="\'text-center\'"></div> </div> </div> </div> <div style="display:flex; align-items:center"> <span class="glyphicon glyphicon-arrow-right rightsmall-menu-glyph" data-ng-click="ctrl.nextMonth()"></span> </div> </div>',

                scope: {
                    NumberOfMonths: '=numberOfMonths',
                    SelectedDate: "=selectedDate",
                    onDateSelection: "&",
                },

                controllerAs: 'ctrl',
                controller: ['$scope', function ($scope) {
                    // Tests and temp
                    if (!$scope.NumberOfMonths)
                        $scope.NumberOfMonths = 1;

                    $scope.tableClasses = 'table table-responsive center-justified';
                    $scope.Headers = ["L", "M", "M", "J", "V", "S", "D"];

                    $scope.FilterCell = nwCalendarFactory.filterDateForCalendar;
                    ////////////////

                    var ctrl = this;

                    angular.extend(ctrl, {
                        range: 1, // TODO : Replace by a function returning 1 or NumberOfMonths depending on the developer's choice

                        nextMonth: nextMonth,
                        previousMonth: previousMonth,

                        CurrentDate: new Date(),
                        DisplayedDate: new Date().setDate(1),

                        DisplayedMonths: [],
                    });

                    //////////////////////////////////////

                    getMonths();

                    ctrl.SelectDate = function (item, month) {
                        $scope.SelectedDate = new Date(month.Year, month.Month, item);
                        if ($scope.onDateSelection) {
                            $scope.onDateSelection({ date: $scope.SelectedDate});
                        }
                    }
                    return ctrl;

                    //////////////////////////////////////

                    // Construct the ViewModel part of the calendar
                    function getMonths() {

                        ctrl.DisplayedMonths.push(nwCalendarFactory.GetMonthByYearAndMonth(
                            ctrl.DisplayedDate)
                            );

                        for (var i = 1; i < $scope.NumberOfMonths; i++) {
                            if (!isEven(i)) {
                                ctrl.DisplayedMonths.push(nwCalendarFactory.GetMonthByYearAndMonth(
                                    datetime.calcul.addMonthsToDate(ctrl.DisplayedDate, i))
                                    );
                            }
                            else {
                                ctrl.DisplayedMonths.unshift(nwCalendarFactory.GetMonthByYearAndMonth(
                                    datetime.calcul.removeMonthsFromDate(ctrl.DisplayedDate, i - 1))
                                    );
                            }
                        }

                    }


                    function isEven(n) {
                        n = Number(n);
                        return n === 0 || !!(n && !(n % 2));
                    }

                    // Carousel functions
                    function nextMonth() {
                        ctrl.DisplayedDate = datetime.calcul.addMonthsToDate(ctrl.DisplayedDate, 1);
                        var displayedMonths = [];
                        for (var i = 1; i < $scope.NumberOfMonths; i++) {
                            displayedMonths.push(ctrl.DisplayedMonths[i]);
                        }
                        displayedMonths.push(nwCalendarFactory.GetMonthByYearAndMonth(
                            datetime.calcul.addMonthsToDate(ctrl.DisplayedDate, parseInt($scope.NumberOfMonths / 2))
                            ));

                        ctrl.DisplayedMonths = displayedMonths;
                    };

                    function previousMonth() {
                        ctrl.DisplayedDate = datetime.calcul.removeMonthsFromDate(ctrl.DisplayedDate, 1);

                        var displayedMonths = [nwCalendarFactory.GetMonthByYearAndMonth(
                            datetime.calcul.removeMonthsFromDate(ctrl.DisplayedDate, parseInt($scope.NumberOfMonths / 2))
                            )];

                        for (var i = 0; i < $scope.NumberOfMonths - 1; i++) {
                            displayedMonths.push(ctrl.DisplayedMonths[i]);
                        }
                        ctrl.DisplayedMonths = displayedMonths;
                    };

                    //////////////////////////////////////

                }]
            }
    }]);

})(window.angular);





