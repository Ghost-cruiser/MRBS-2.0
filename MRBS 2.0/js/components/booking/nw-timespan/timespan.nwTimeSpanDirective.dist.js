(function (angular) {

    'use strict';

    angular.module('booking').directive('nwTimeSpan',
        ['TimeSpanFactory', 'settingsLocationService', 'Time', TimeSpanDirective])

            function TimeSpanDirective(TimeSpanFactory, SettingsService, Time) {
            /// <summary>
            /// Directive returning two <input type="time /> linked to reflect the settings regarding the minimal time of a booking,
            /// its minimal and maximal hours.
            /// </summary>
            /// <param name="TimeSpanFactory">Dependency TimeSpanFactory.</param>
            /// <returns></returns>
            return {
                scope: { dateStart: '=dateStart', dateEnd: '=dateEnd' },
                template: '<div><div> Heure de début : <div class="flex-line" data-ng-model="timeStart"><select data-ng-model="timeStart.hours" class="form-control" data-ng-options="hour for hour in ctrl.AvailableHours"></select> <select data-ng-model="timeStart.minutes" class="form-control" data-ng-options="minutes for minutes in ctrl.AvailableMinutes"></select></div> </div><div data-ng-model="ctrl.dateEnd"> Heure de fin : <div class="flex-line" data-ng-model="timeEnd"><select data-ng-model="timeEnd.hours" class="form-control" data-ng-options="hour for hour in ctrl.AvailableHours"> </select> <select data-ng-model="timeEnd.minutes" class="form-control" data-ng-options="minutes for minutes in ctrl.AvailableMinutes"> </select> </div> </div> </div>',

                controllerAs: 'ctrl',
                // TODO : réorganiser le fichier; 
                controller: ['$scope', function ($scope) {
                    var ctrl = this;

                    if (!$scope.dateStart) {
                        $scope.dateStart = new Date();
                    }
                    if (!$scope.dateEnd) {
                        $scope.dateEnd = new Date();
                    }

                    angular.extend(ctrl,{

                        configTimeEnd: Time(new Date(SettingsService.OpeningHours.end)),
                        configTimeStart: Time(new Date(SettingsService.OpeningHours.start)),

                        AvailableHours: TimeSpanFactory.BuildArrayOfHours(SettingsService.OpeningHours.start, SettingsService.OpeningHours.end),
                        AvailableMinutes: TimeSpanFactory.BuildArrayOfMinutes(SettingsService.MinimalSlotSize),

                    });

                    InitializeScope();

                    return ctrl;

                    function InitializeScope() {

                        $scope.timeEnd = Time();   
                        $scope.timeStart = Time();

                        setFirstAvailableSlot();

                        updateModelDateEnd();
                        updateModelDateStart();

                        $scope.$watch('timeStart', onTimeStartChanged, true);
                        $scope.$watch('timeEnd', onTimeEndChanged, true);

                        function onTimeEndChanged(newValue, oldValue) {
                            if (newValue != oldValue) {
                                CheckHoursValidity(newValue, "end");
                                updateModelDateEnd();
                            }
                        }
                        function onTimeStartChanged(newValue, oldValue) {
                            if (newValue != oldValue) {
                                CheckHoursValidity(newValue, "start");
                                updateModelDateStart();
                            }
                        }

                    }
                    
                    function CheckHoursValidity(newValue, origin) {

                        var isOverConfigTimeEnd = TimeSpanFactory.IsOver(newValue, ctrl.configTimeEnd);

                        var isUnderConfigTimeStart = TimeSpanFactory.IsOver(ctrl.configTimeStart, newValue);

                        var possibleTimeEnd = Time($scope.timeStart);
                        possibleTimeEnd = TimeSpanFactory.AddMinutesToTime(possibleTimeEnd, SettingsService.MinimalTimeRent);

                        var isTimeSpanIncorrect = TimeSpanFactory.IsOver(possibleTimeEnd, $scope.timeEnd);

                        if (isOverConfigTimeEnd || isUnderConfigTimeStart || isTimeSpanIncorrect) {

                            if (origin == "start")
                                adjustHoursFromDateStart(newValue, isOverConfigTimeEnd, isUnderConfigTimeStart, isTimeSpanIncorrect, possibleTimeEnd);
                            else
                                adjustHoursFromDateEnd(newValue, isOverConfigTimeEnd, isUnderConfigTimeStart, isTimeSpanIncorrect);
                        }
                    }

                    function adjustHoursFromDateStart(newValue, isOverConfigTimeEnd, isUnderConfigTimeStart, isTimeSpanIncorrect, possibleTimeEnd) {
                        // Entering the function, we know timeStart and timeEnd don't match
                        // rules for booking
                        var shouldDateStartRefresh = false;
                        if (isUnderConfigTimeStart) {
                            // If timeStart is below the defined first hour
                            changeTime(newValue, ctrl.configTimeStart);

                            shouldDateStartRefresh = true;
                        }
                        else {
                            if (isOverConfigTimeEnd || TimeSpanFactory.IsOver(possibleTimeEnd, ctrl.configTimeEnd)) {
                                // If timeStart is above the defined last hour
                                setLastAvailableSlot();

                                shouldDateStartRefresh = true;
                            }
                            else {
                                changeTime($scope.timeEnd, possibleTimeEnd);
                            }
                        }

                        if (shouldDateStartRefresh) {
                            updateModelDateStart();
                        }
                    }
                 
                    function adjustHoursFromDateEnd(newValue, isOverConfigTimeEnd, isUnderConfigTimeStart, isTimeSpanIncorrect, possibleTimeEnd) {
                        // Entering the function, we know timeStart and timeEnd don't match
                        // rules for booking
                        var shouldDateEndRefresh = false;

                        if (isOverConfigTimeEnd) {
                            // If timeEnd is above the defined last hour
                            changeTime(newValue, ctrl.configTimeEnd);
                            shouldDateEndRefresh = true;
                        }
                        else {

                            var possibleTimeEnd = Time($scope.timeEnd);
                            var possibleTimeStart = TimeSpanFactory.RemoveMinutesFromTime($scope.timeEnd, SettingsService.MinimalTimeRent);

                            if (isUnderConfigTimeStart || IsOver(ctrl.configTimeStart, possibleTimeStart)) {
                                // If timeStart is below the defined first hour
                                setFirstAvailableSlot();
                                shouldDateEndRefresh = true;
                            }
                            else {
                                changeTime($scope.timeStart, possibleTimeStart);
                            }
                        }
                        if (shouldDateEndRefresh) {
                            updateModelDateEnd();
                        }
                    }

                    function setFirstAvailableSlot() {
                        changeTime($scope.timeStart, ctrl.configTimeStart);

                        var time = Time(ctrl.configTimeStart);      
                 
                        changeTime($scope.timeEnd, TimeSpanFactory.AddMinutesToTime(time, SettingsService.MinimalTimeRent));
                        
                    }
                    function setLastAvailableSlot() {
                        changeTime($scope.timeEnd, ctrl.configTimeEnd);

                        var time = Time(ctrl.configTimeEnd);
                        changeTime($scope.timeStart, TimeSpanFactory.RemoveMinutesFromTime(time, SettingsService.MinimalTimeRent));

                    }


                    function updateModelDateEnd() {
                        $scope.dateEnd.setHours(parseInt($scope.timeEnd.hours));
                        $scope.dateEnd.setMinutes(parseInt($scope.timeEnd.minutes));
                    }

                    function updateModelDateStart() {
                        console.log(parseInt($scope.timeStart.hours));
                        $scope.dateStart.setHours(parseInt($scope.timeStart.hours));
                        $scope.dateStart.setMinutes(parseInt($scope.timeStart.minutes));
                        console.log($scope.dateStart);
                    }


                    function changeTime(time, newTime) {
                        time.minutes = matchInArray(ctrl.AvailableMinutes, newTime.minutes);
                        time.hours = matchInArray(ctrl.AvailableHours, newTime.hours);

                        function matchInArray(array, value) {
                            for (var i = 0; i < array.length; i++) {
                                if (parseInt(array[i]) == value) {
                                    return array[i];
                                }
                            }
                        }
                    }
                }],
            }
    };

})(window.angular);