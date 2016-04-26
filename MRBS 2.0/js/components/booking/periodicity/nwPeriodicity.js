(function () {
    'use strict';
    angular.module('periodicity').directive('nwPeriodicity',
        ['SettingsPeriodicityService', nwPeriodicityDirective]);

            function nwPeriodicityDirective(SettingsPeriodicityService) {
            /// <summary>
            /// Directive handling the paramaters of the periodicity for an entry.
            /// </summary>
            /// <dependency name="SettingsPeriodicityService">Dependends on this service to provide the settings related to the periodicity.</dependency>
            /// <param name="selectedDate">$watch(date): Value implying changes on the paramaters.</param>
            /// <param name="periodicityParameter">string: Binds the paramater specific to the type.</param>
            /// <param name="repeat">integer: Binds the number of times an entry should be repeated.</param>
            /// <returns>
            ///     <div data-nw-periodicty="" data-selected-date="" data-periodicity-paramater="" data-repeat=""></div>
            /// </returns>
            return {
                scope: {
                    selectedDate: '=selectedDate',

                    periodicityParameter: '=periodicityParameter',
                    periodicityType: '=periodicityType',
                    repeat: '=repeat'
                },
                templateUrl: 'js/components/booking/periodicity/nw-periodicity.html',
                replace: true,
                controllerAs: 'ctrl',

                controller: ['$scope', function ($scope) {
                    var ctrl = this;

                    angular.extend(ctrl, {
                        setViewPeriodicity: setViewPeriodicity,
                        checkValidityRepeat: checkValidityRepeat,
                        checkValidityWeekSpan: checkValidityWeekSpan,
                        setMonthlyParameters: setMonthlyParameters,

                        days: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', ],

                        viewPeriodicity: {},
                        WeekSpan: 1,
                    });

                    angular.extend(ctrl.viewPeriodicity, {
                        Week: false,
                        Month: false,
                        Year: false
                    });

                    $scope.$watch('selectedDate', onDateChanged, true);
                    $scope.repeat = 1;
                    return ctrl;

                    function checkValidityWeekSpan() {
                        var max = SettingsPeriodicityService['Week'].maximumSpan;
                        ctrl.WeekSpan = checkValidity(ctrl.WeekSpan, 1, max);
                        $scope.periodicityParameter = ctrl.WeekSpan;
                    }

                    function checkValidityRepeat() {
                        var max = SettingsPeriodicityService[$scope.viewPeriodicity['key']].maximumRepeat;
                        var newValue = $scope.repeat;
                        
                        $scope.repeat = checkValidity(newValue, 0, max);
                        
                    }

                    function checkValidity(newValue, min, max) {
                        
                        if (newValue < min) {
                            newValue = min;
                        }
                        else if (newValue > max) {
                            newValue = max;
                        }
                        return newValue;
                    }
                    function onDateChanged(newValue, oldValue) {
                        if (angular.isDate(newValue)){
                            $scope.selectedDate = newValue;

                            if (ctrl.viewPeriodicity.Month) {
                                setMonthlyPeriodicity();
                            }
                        }
                        else $scope.selectedDate = oldValue;


                    }

                    function setViewPeriodicity(param) {
                        angular.forEach(ctrl.viewPeriodicity, function (value, key) {
                            ctrl.viewPeriodicity[key] = (param == key);
                        });
                        if (param == "Month") {
                            setMonthlyPeriodicity();
                            setMonthlyParameters();
                            $scope.periodicityType = 2;
                        }
                        else if (param == "Week") {
                            $scope.periodicityType = 1;
                            $scope.periodicityParameter = ctrl.WeekSpan;
                        }
                        else if (param == "Year") {
                            $scope.periodicityType = 3;
                            $scope.periodicityParameter = "";
                        }
                        else {
                            console.log("error setting periodicity : paramater did not match");
                        }
                    }

                    function setMonthlyParameters() {
                        if (ctrl.first) {
                            $scope.periodicityParameter = ctrl.something;
                        }
                        else {
                            $scope.periodicityParameter = ctrl.something1 + ' ' + ctrl.something2;
                        }
                    }

                    function setMonthlyPeriodicity() {

                        var date = new Date($scope.selectedDate).getDate();
                        var placeInMonth = 0;

                        var y = date;
                        do {
                            y = y - 7;
                            placeInMonth++;
                        }
                        while (y > 0);

                        if (placeInMonth >= 4) {
                            placeInMonth = "dernier"
                        }
                        else if (placeInMonth === 1) {
                            placeInMonth = "premier"
                        }
                        else placeInMonth += 'e';

                        ctrl.something = date;
                        ctrl.something1 = placeInMonth;
                        ctrl.something2 = ctrl.days[new Date($scope.selectedDate).getDay()];
                    }                    
                }],
            }
    }
})();