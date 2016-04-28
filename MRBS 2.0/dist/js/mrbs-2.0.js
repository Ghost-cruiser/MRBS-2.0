(function () {
    'use strict';
    angular.module('authentication', []);

})();
(function(){
    'use strict';
    angular.module('authentication').controller('loginCtrl',
        ['$location', 'AuthenticationService', 'FlashService', LoginController]);

    function LoginController($location, AuthenticationService, FlashService) {

            var ctrl = this;

            ctrl.login = login;

            return ctrl;

            (function initController() {
                AuthenticationService.ClearCredentials();
            })();

            function login() {
                ctrl.dataLoading = true;
                AuthenticationService.Login(ctrl.username, ctrl.password, function (response) {
                    if (response.success) {
                        AuthenticationService.SetCredentials(ctrl.username, ctrl.password);
                        $location.path('/');
                    } else {
                        FlashService.Error(response.message, true);
                        ctrl.dataLoading = false;
                        alert(response.message);
                    }
                });
            };
        }
})();
(function(){
    
    'use strict';

    angular.module('authentication').service('AuthenticationService',
        ['$http', '$cookies', '$rootScope', AuthenticationService]);

    function AuthenticationService($http, $cookies, $rootScope) {

        var service = {};

        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;

        return service;

        function Login(username, password, callback) {

            $http.post('http://localhost:1337/api/authenticate', { username: username, password: password })
                 .then(function (response) { callback(response.data); })
                .catch(function (response) { callback({ message: "Erreur" }); });

        }

        function SetCredentials(username, password) {
            var authdata = Base64().encode(username + password);

            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata
                }
            };

            $rootScope.loggedIn = true;

            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
            $cookies.put('globals', $rootScope.globals);
        }

        function ClearCredentials() {
            $rootScope.globals = {};

            $rootScope.loggedIn = false;

            $cookies.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';
        }

        function Base64() {

            var base64 = {

                keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

                encode: function (input) {
                    var output = "";
                    var chr1, chr2, chr3 = "";
                    var enc1, enc2, enc3, enc4 = "";
                    var i = 0;

                    do {
                        chr1 = input.charCodeAt(i++);
                        chr2 = input.charCodeAt(i++);
                        chr3 = input.charCodeAt(i++);

                        enc1 = chr1 >> 2;
                        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                        enc4 = chr3 & 63;

                        if (isNaN(chr2)) {
                            enc3 = enc4 = 64;
                        } else if (isNaN(chr3)) {
                            enc4 = 64;
                        }

                        output = output +
                            this.keyStr.charAt(enc1) +
                            this.keyStr.charAt(enc2) +
                            this.keyStr.charAt(enc3) +
                            this.keyStr.charAt(enc4);
                        chr1 = chr2 = chr3 = "";
                        enc1 = enc2 = enc3 = enc4 = "";
                    } while (i < input.length);

                    return output;
                },

                decode: function (input) {
                    var output = "";
                    var chr1, chr2, chr3 = "";
                    var enc1, enc2, enc3, enc4 = "";
                    var i = 0;

                    var base64test = /[^A-Za-z0-9\+\/\=]/g;
                    if (base64test.exec(input)) {
                        window.alert("There were invalid base64 characters in the input text.\n" +
                            "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                            "Expect errors in decoding.");
                    }
                    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                    do {
                        enc1 = this.keyStr.indexOf(input.charAt(i++));
                        enc2 = this.keyStr.indexOf(input.charAt(i++));
                        enc3 = this.keyStr.indexOf(input.charAt(i++));
                        enc4 = this.keyStr.indexOf(input.charAt(i++));

                        chr1 = (enc1 << 2) | (enc2 >> 4);
                        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                        chr3 = ((enc3 & 3) << 6) | enc4;

                        output = output + String.fromCharCode(chr1);

                        if (enc3 != 64) {
                            output = output + String.fromCharCode(chr2);
                        }
                        if (enc4 != 64) {
                            output = output + String.fromCharCode(chr3);
                        }

                        chr1 = chr2 = chr3 = "";
                        enc1 = enc2 = enc3 = enc4 = "";

                    } while (i < input.length);

                    return output;
                }
            };

            return base64;
        }


    }
})();
(function () {
    'use strict';
    angular.module('authentication').controller('UserController',
        ['$location', '$rootScope', '$scope', 'AuthenticationService', UserController]);

    function UserController($location, $rootScope, $scope, AuthenticationService) {

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
(function () {
    'use strict';
    angular.module('areas', []);

})();
(function () {

    'use strict';

    angular.module('areas').controller('AreaEditController',
        ['AreaService', AreaEditController]);

    function AreaEditController(AreaService) {


        var ctrl = this;

        ctrl.Areas = [];
        ctrl.Rooms = [];
        ctrl.selectedArea = {};

        ctrl.edit = edit;
        ctrl.add = add;

        ctrl.saveArea = saveArea;
        ctrl.deleteArea = deleteArea;
        ctrl.saveRoom = saveRoom;

        ctrl.option = "";

        ctrl.editArea = false;
        ctrl.addRoom = false;

        AreaService.GetAreas()
            .then(function (result) {
                ctrl.Areas = result.data;
                ctrl.selectedArea = ctrl.Areas[0];
            });

        return ctrl;


        function edit() {

            this.option = "Modifier";
            this.areaEdited = ctrl.selectedArea;
            this.editArea = true;
        };

        function add() {
            this.option = "Ajouter";
            this.editArea = true;
        };

        function deleteArea() {

        };

        function saveArea() {
            if (ctrl.areaEdited != "") {
                AreaService.SaveArea({
                    areaName: ctrl.areaEdited
                });
            };
        }
        function saveRoom() {
            if (ctrl.selectedRoom.id == null) {

                AreaService.SaveRoom(
                {
                    AreaId: ctrl.selectedArea.id,
                    roomName: ctrl.selectedRoom.roomName,
                    roomDescription: ctrl.selectedRoom.roomDescription,
                    capacity: ctrl.selectedRoom.capacity,
                    priceForALeague: ctrl.selectedRoom.priceForALeague,
                    priceForAClub: ctrl.selectedRoom.priceForAClub,
                    priceForAPerson: ctrl.selectedRoom.priceForAPerson

                });
            }
        }
            
        }
})();
(function () {
    'use strict';
    angular.module('periodicity', []);
})();
(function () {
    'use strict';
    angular.module('periodicity').directive('nwPeriodicity',
        ['SettingsPeriodicityService', nwPeriodicityDirective]);

            function nwPeriodicityDirective(SettingsPeriodicityService) {
            return {
                scope: {
                    selectedDate: '=selectedDate',

                    periodicityParameter: '=periodicityParameter',
                    periodicityType: '=periodicityType',
                    repeat: '=repeat'
                },
                template: '<div> <div> <label> <input type="radio" name="periodicity" data-ng-model="viewPeriodicity[\'key\']" value="Week" data-ng-change="ctrl.setViewPeriodicity(\'Week\')" /> Semaine </label> <label> <input type="radio" name="periodicity" data-ng-model="viewPeriodicity[\'key\']" value="Month" data-ng-change="ctrl.setViewPeriodicity(\'Month\')" /> Mois </label> <label> <input type="radio" name="periodicity" data-ng-model="viewPeriodicity[\'key\']" value="Year" data-ng-change="ctrl.setViewPeriodicity(\'Year\')" /> Année </label> </div> <div> <div data-ng-if="ctrl.viewPeriodicity.Week"> <label> Intervalle de semaines : <input type="number"data-ng-change="ctrl.checkValidityWeekSpan()"data-ng-model="ctrl.WeekSpan" /> </label> </div> <div> <div data-ng-if="ctrl.viewPeriodicity.Month"> <label> <input type="radio" data-ng-model="ctrl.first" data-ng-value="true" data-ng-change="ctrl.setMonthlyParameters()" />Tous les {{ctrl.something}} du mois </label> <label> <input type="radio" data-ng-model="ctrl.first" data-ng-value="false" data-ng-change="ctrl.setMonthlyParameters()" />Le {{ctrl.something1 + \'\' + ctrl.something2}} de chaque mois </label> </div> <div data-ng-if="ctrl.viewPeriodicity.Year"></div> </div> <div> <label> <input type="checkbox" data-ng-model="ctrl.periodicity" /> Répéter </label> <input type="number"data-ng-change="ctrl.checkValidityRepeat()"data-ng-model="repeat" /></div> </div> </div>',
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
(function () {
    'use strict';
    angular.module('booking', ['periodicity']);
})();
(function () {
    angular.module('booking').factory('Entry',
        [EntryFactory]);

    function EntryFactory() {

        return Entry;

        function Entry(data) {
            if (!data) {
                return protoEntry();
            }
            else return newEntry(data);
        }

        function protoEntry() {
            return {
                dateStart: new Date(),
                dateEnd: new Date,

                RoomId: 0,

                periodicityType: 0,
                periodicityParameter: "default",
                repeat:0,

                typeOfLocation: 0,

                title: "Titre",

                description: "description"
            }
        }

        function newEntry(data) {
            return {
                dateStart: data.dateStart,
                dateEnd: data.dateEnd,

                periodicityType: data.periodicityType,
                periodicityParameter: data.periodicityParameter,
                repeat: data.repeat,

                RoomId: data.RoomId,

                typeOfLocation: data.typeOfLocation,

                title: data.title,

                description: data.description,
            }
        }
    }
})();
(function () {
    'use strict';

    angular.module('booking').service('BookingService',
        ['ContextService', BookingService]);

    function BookingService(ContextService) {

        this.SaveEntries = SaveEntries;

        return this;

        function SaveEntries(entries) {

            ContextService._post('entries', entries)
                    .then(function successCallback(response) {
                        console.log(response);
                    }, function errorCallback(response) {
                        console.log("Ops: " + response.error);
                    });
        }

    }

})();
(function () {
    
    'use strict';
    angular.module('booking').controller('BookingController',
        ['AreaService', 'BookingService', 'Entry', 'AnalyzerService', 'Datetime', BookingController]);

    function BookingController(AreaService, BookingService, Entry, AnalyzerService, datetime) {
        var _default = true;
        var ctrl = this;

        angular.extend(ctrl, {
            switchView: switchView,
            bookRooms: bookRooms,
            addSelectedRooms: addSelectedRooms,
            onDateChanged: onDateChanged,

            type: "Ponctuel",
            days: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche', ],

            entry: Entry(),
            selectedRooms: [],
            selectedBookedRooms: [],
            viewPeriodicity: {},
            selectedDays: { Lundi: false, Mardi: false, Mercredi: false, Jeudi: false, Vendredi: false, Samedi: false, Dimanche: false, },
        })


        AreaService.GetAreas()
        .then(function (result) {
            ctrl.Areas = result.data;
            ctrl.selectedArea = ctrl.Areas[0];
            ctrl.selectedRooms = ctrl.selectedArea.Rooms[0];
        });
        return ctrl;

        function onDateChanged(newValue) {
            if (angular.isDate(newValue)) {
                ctrl.entry.dateStart = newValue;

                var date = new Date(newValue);
                ctrl.entry.dateEnd.setYear(date.getFullYear());
                ctrl.entry.dateEnd.setMonth(date.getMonth());
                ctrl.entry.dateEnd.setDate(date.getDate());

                resetCheckboxesTo(date.getDay());
            }

            function resetCheckboxesTo(day) {
                day = datetime.french.convertToFrenchDay(day);
                angular.forEach(ctrl.selectedDays, function (value, key) {
                    if (key == ctrl.days[day]) {
                        ctrl.selectedDays[key] = true;
                    }
                    else {
                        ctrl.selectedDays[key] = false;
                    }
                })
            }
        }

        function addSelectedRooms() {
            if (ctrl.selectedRooms) {
                if (_default) {
                    ctrl.bookedRooms = [];
                    _default = false;
                }

                angular.forEach(ctrl.selectedRooms, function (value, key) {
                    ctrl.bookedRooms.push(value);
                    var index = ctrl.selectedArea.Rooms.indexOf(value);
                    ctrl.selectedArea.Rooms.splice(index, 1);
                });

                ctrl.selectedBookedRooms = ctrl.bookedRooms[0];
            }
        }

        function switchView() {
            if (ctrl.type == "Ponctuel") {
                ctrl.type = "Périodique";
                ctrl.viewPerio = true;
            }
            else {
                ctrl.type = "Ponctuel";
                ctrl.viewPerio = false;
            }
        };


        function bookRooms() {
            var req = AnalyzerService.Analyze(ctrl.entry, ctrl.selectedDays, ctrl.bookedRooms);
            if (req) {
                BookingService.SaveEntries(req);
            }
        }
    }
})();
(function () {

    'use strict';
    angular.module('booking').factory('TimeSpanFactory',
       ['$filter', function ($filter) {


           return {

               BuildArrayOfMinutes: BuildArrayOfMinutes,
               BuildArrayOfHours: BuildArrayOfHours,

               AddMinutesToTime: AddMinutesToTime,
               RemoveMinutesFromTime: RemoveMinutesFromTime,
               IsOver: IsOver,

           }

           function BuildArrayOfMinutes(range) {
               var minutes = [];
               var rank = 0;

               do {
                   minutes[rank] = rank * range;
                   if (minutes[rank] === 0) {
                       minutes[rank] = "00";
                   }
                   rank++;
               }
               while ((rank * range) < 60);

               return minutes;
           }

           function BuildArrayOfHours(timeStart, timeEnd) {
               var hours = [];
               var end = timeEnd.getHours();
               var i = 0;
               var time = new Date(timeStart);
               while (time.getHours() <= end) {
                   hours[i] = filterHour(time);
                   time.setHours(time.getHours() + 1)
                   i++;
               }
               return hours;

               function filterHour(date) {
                   return $filter('date')(date, 'HH');
               }
           }

           function IsOver(time, timeCompared) {
               if (parseInt(time.hours) < parseInt(timeCompared.hours)) {
                   return false;
               }
               if (parseInt(time.hours) > parseInt(timeCompared.hours)) {
                   return true;
               }
               if (parseInt(time.minutes) > parseInt(timeCompared.minutes)) {
                   return true;
               }
               return false;
           }

           function AddMinutesToTime(time, minutes) {
               time.minutes = parseInt(time.minutes) + parseInt(minutes);

               ConvertMinutesToHour(time);
               return time;

               function ConvertMinutesToHour(time) {
                   if (time.minutes >= 60) {
                       time.hours = parseInt(time.hours) + 1;
                       time.minutes -= 60;
                       ConvertMinutesToHour(time);
                   }
                   else {
                       return time;
                   }
               }
           }
           function RemoveMinutesFromTime(time, minutes) {
               time.minutes = parseInt(time.minutes) - minutes;
               ConvertMinutesToHour(time);

               return time;

               function ConvertMinutesToHour(time) {
                   if (time.minutes < 0) {
                       time.hours = parseInt(time.hours) - 1;
                       time.minutes += 60;
                       ConvertMinutesToHour(time);
                   }
                   else {
                       return time;
                   }
               }
           }
       }])
})();

(function (angular) {

    'use strict';

    angular.module('booking').directive('nwTimeSpan',
        ['TimeSpanFactory', 'settingsLocationService', 'Time', TimeSpanDirective])

            function TimeSpanDirective(TimeSpanFactory, SettingsService, Time) {
            return {
                scope: { dateStart: '=dateStart', dateEnd: '=dateEnd' },
                template: '<div><div> Heure de début : <div class="flex-line" data-ng-model="timeStart"><select data-ng-model="timeStart.hours" class="form-control" data-ng-options="hour for hour in ctrl.AvailableHours"></select> <select data-ng-model="timeStart.minutes" class="form-control" data-ng-options="minutes for minutes in ctrl.AvailableMinutes"></select></div> </div><div data-ng-model="ctrl.dateEnd"> Heure de fin : <div class="flex-line" data-ng-model="timeEnd"><select data-ng-model="timeEnd.hours" class="form-control" data-ng-options="hour for hour in ctrl.AvailableHours"> </select> <select data-ng-model="timeEnd.minutes" class="form-control" data-ng-options="minutes for minutes in ctrl.AvailableMinutes"> </select> </div> </div> </div>',

                controllerAs: 'ctrl',
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
                        var shouldDateStartRefresh = false;
                        if (isUnderConfigTimeStart) {
                            changeTime(newValue, ctrl.configTimeStart);

                            shouldDateStartRefresh = true;
                        }
                        else {
                            if (isOverConfigTimeEnd || TimeSpanFactory.IsOver(possibleTimeEnd, ctrl.configTimeEnd)) {
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
                        var shouldDateEndRefresh = false;

                        if (isOverConfigTimeEnd) {
                            changeTime(newValue, ctrl.configTimeEnd);
                            shouldDateEndRefresh = true;
                        }
                        else {

                            var possibleTimeEnd = Time($scope.timeEnd);
                            var possibleTimeStart = TimeSpanFactory.RemoveMinutesFromTime($scope.timeEnd, SettingsService.MinimalTimeRent);

                            if (isUnderConfigTimeStart || IsOver(ctrl.configTimeStart, possibleTimeStart)) {
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
                        $scope.dateStart.setHours(parseInt($scope.timeStart.hours));
                        $scope.dateStart.setMinutes(parseInt($scope.timeStart.minutes));
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
                }]
            }
    };

})(window.angular);
(function () {
	'use strict';

	angular.module('booking').service('PeriodicityAnalyzer',
        ['Datetime', PeriodicityAnalyzer]);

	function PeriodicityAnalyzer(datetime) {

		var service = this;

		service.Analyze = AnalyzePeriodicity;
		service.Build = BuildPeriodicity;

		return this;

		function AnalyzePeriodicity(type, parameter) {
		    if (!type ) {
		        return false;
		    }
		    if (type == 2 && !parameter) {
		    }
		    return true;
		}

		function BuildPeriodicity(days, entry) {
		    var periodeType = entry.periodicityType;
		    var periode = entry.periodicityParameter;
		    var x = 0; 
		    var iteration = 0;
		    if (periodeType === 1) {
		        for (var i = 0; i < entry.repeat; i++) {
		            iteration = days.length;

		            for (var y = x; y < iteration; y++) {
		                var time = 7 * periode;
		                days.push(datetime.calcul.addDaysToDate(days[y], time));
		            }
		            x = iteration;
		        }
		    }
		    else if (periodeType == 3) {
		        for (var i = 0; i < entry.repeat; i++) {
		            iteration = days.length;
		            for (var y = x; y < iteration; y++) {
		                days.push(datetime.calcul.addYearsToDate(days[y], 1));
		            }
		            x = iteration;
		        }
		    }
		    else {
		        days = buildDaysForMonthlyPeriod(days, entry.periodicityParameter, entry.dateStart, entry.repeat);
		    }
		    return days;
		}

		function buildDaysForMonthlyPeriod(days, parameter, mainDate, repeat) {
		    if (angular.isNumber(parameter)) {
		        days = BuildDaysOnDate(days, mainDate, repeat);
		    }
		    else {
		        days = AnalyzeMonthParameter(days, parameter, mainDate, repeat);
		    }
		    return days;


		    function AnalyzeMonthParameter(days, parameter, mainDate, repeat) {
		        var index = parameter.indexOf(" ");
		        var firstParam = parameter.substr(0, index);
		        var secondParam = parameter.substr(index + 1, parameter.length - index);

		        if (firstParam == "premier") {
		            return buildDaysForParameter(1, secondParam, repeat, mainDate, days);
		        }
		        if (firstParam == "dernier") {
		            return BuildDaysForCaseLast(secondParam, repeat, mainDate, days);
		        }
		        return buildDaysForParameter(parseInt(firstParam), secondParam, repeat, mainDate, days);
		    }

		    function BuildDaysOnDate(days, mainDate, repeat) {
		        for (var i = 0; i < repeat; i++) {
		            days.push(datetime.calcul.addMonthsToDate(new Date(mainDate), i + 1));
		        }
		        return days;
		    }

		    function buildDaysForParameter(intParam, paramString, repeat, date, days) {
		        var englishDay = datetime.french.convertToEnglishDay(paramString);
		        var firstDate = new Date(date).setDate(1);
		        for (var i = 0; i < repeat; i++) {
		            var newDate = datetime.calcul.addMonthsToDate(firstDate, i + 1);
		            newDate = findXDay(intParam, englishDay, newDate);
		            days.push(newDate);
		        }
		        return days;
		    }

		    function BuildDaysForCaseLast(paramString, repeat, date, days) {
		        var englishDay = datetime.french.convertToEnglishDay(paramString);
		        var newDate = datetime.calcul.addMonthsToDate(new Date(date), 1);
		        newDate = new Date(newDate).setDate(datetime.month.getMonthLength(newDate));
		        for (var i = 0; i < repeat; i++) {
		            var newDate = datetime.calcul.addMonthsToDate(new Date(date), 1);
		            var length = datetime.month.getMonthLength(newDate);
		            newDate = new Date(newDate).setDate(length);
		            days.push(newDate);

		        }
		        return days;
		    }

		    function findXDay(x, day, date) {
		        date = new Date(date);
		        var firstDay = date.getDay();
		        if (firstDay > day) {
		            date = datetime.calcul.addDaysToDate(date, 7 - (firstDay - day));
		        }
		        else if (firstDay < day) {
		            date = datetime.calcul.addDaysToDate(date, day - firstDay);
		        }
		        var i = 1;
		        while (i < x) {
		            date = datetime.calcul.addDaysToDate(date, 7);
		            i++;
		        }
		        return date;
		    }
		}

	}

})();
(function () {
	'use strict';

	angular.module('booking').service('DaysAnalyzer',
        ['Datetime', DaysAnalyzer]);

	function DaysAnalyzer(datetime) {

		var service = this;

		service.Analyze = AnalyzeDays;

		return this;

		function AnalyzeDays(daysOfWeek, mainDate) {
		    var firstDate = new Date(mainDate);

		    var daysAndIndex = getSelectedDaysAndMainDateIndex(daysOfWeek, mainDate);


			if (daysAndIndex.days.length > 0) {
			    var days = buildDates(mainDate, daysAndIndex);

			    return days;
			}
			else {
			    var days = [firstDate];
			    return days;
			}

			function getSelectedDaysAndMainDateIndex(daysOfWeek, mainDate) {
			    var baseDay = datetime.french.dayInFrench(mainDate.getDay());
				var record = [];
				var i = 0;
				var x = 0;

				angular.forEach(daysOfWeek, function (value, key) {
					if (value) {
						if (key != baseDay)
							record.push(datetime.french.days.indexOf(key));
						else 
						    x = datetime.french.days.indexOf(key);
					}

					i++;
				});
				return { days: record, dayIndex: x }
			}

			function buildDates(mainDate, daysAndCount) {
			    var newDate = new Date(mainDate);
			    var dates = [];
				var mainDay = datetime.french.convertToEnglishDay(daysAndCount.dayIndex);

				dates.push(new Date(mainDate));

				for (var i = 0; i < daysAndCount.days.length; i++) {
				    var day = datetime.french.convertToEnglishDay(daysAndCount.days[i])
				    if (day < mainDay) {
					    var count = mainDay - day;
						newDate = datetime.removeDaysFromDate(newDate, count);

						if (!datetime.calcul.isDateOver(newDate, new Date())) {
							newDate = datetime.calcul.addDaysToDate(newDate, 7);
						}
					}
				    else {
						var count = day - mainDay;
						newDate = datetime.calcul.addDaysToDate(newDate, count);
					}
					dates.push(new Date(newDate));
				}
				return dates;
			}
		}

	}

})();
(function () {
	'use strict';

	angular.module('booking').service('AnalyzerService',
        [
			'Entry',
			'Datetime',
			'PeriodicityAnalyzer',
			'DaysAnalyzer',

			AnalyzerService
        ]);

	function AnalyzerService(Entry, datetime, PeriodicityAnalyzer, DaysAnalyzerService) {

		var service = this;

		service.Analyze = AnalyzeEntry;

		return this;

		function AnalyzeEntry(entry, selectedDays, rooms) {

			var req = buildRoomsId(entry, rooms);

			var periodicity = PeriodicityAnalyzer.Analyze(
				entry.periodicityType,
				entry.periodicityParameter);
            
			
			var days = DaysAnalyzerService.Analyze(selectedDays, new Date(entry.dateStart));

			if (periodicity) {
				days = PeriodicityAnalyzer.Build(days, entry);
			}
			if (days) {
				req = buildEntriesDates(days, req);
			}

			return req;
		}

		function buildRoomsId(mainEntry, rooms) {
			var req = [];
			for (var i = 0; i < rooms.length; i++) {
				var newEntry = Entry(mainEntry);
				newEntry.RoomId = rooms[i].id;
				req.push(newEntry);
			}
			return req;
		}

		function buildEntriesDates(days, entries) {
		    var y = 0;
		    var length = entries.length;
		    var allEntries = [];
		    for (y = 0; y < length; y++) {

				for (var i = 0; i < days.length; i++) {
					var newEntry = Entry(entries[y]);
					newEntry.dateStart = days[i];
					allEntries.push(newEntry);
				}
			}
			return allEntries;
		}


	}

})();
(function () {
    'use strict';
    angular.module('events', []);
})();
(function (angular) {
    'use strict';
    angular.module('events').directive('nwEvent',
        [function () {

            return {
                scope: { data: '=eventData', timeSlots: '=timeSlots', idColumn: '=idColumn' },
                templateUrl: '<div style="position:absolute; padding: 5px 5px 5px 5px" data-ng-style="{left:data.left, top:data.top, height:data.height, width:data.width}"><div class="view-events"style="position:absolute; z-index:2;"data-ng-class="{highlightCell: hover}"data-ng-mouseenter="hover = true"data-ng-mouseleave="hover = false"> </div></div>',
                restrict: 'A',
                require: '^nwDatagrid',

                link: function (scope, element, attrs, tableCtrl) {

                    var divTarget = function () {
                        if (scope.idColumn) {
                            return document.getElementById(getLine(scope.data.dateStart) + ':' + scope.data[scope.idColumn]);
                        }
                        else {
                            var day = new Date(scope.data.dateStart).getDay();
                            return document.getElementById(getLine(scope.data.dateStart) + ':' + day);
                        }
                    }
                    setPosition(scope.data, divTarget);

                    tableCtrl.addViewData(scope);

                    function setPosition(data, divTarget) {
                        
                        var div = divTarget();

                        var position = getPosition(div);

                        data['height'] = position.height*getHeight(scope.data.dateStart, scope.data.dateEnd) + 'px';
                        data['left'] = position.left + 'px';
                        data['top'] = position.top + 'px';
                        data['width'] = position.width + 'px';

                        data['view'] = true;
                    };

                    function getPosition(elem) {
                        var box = elem.getBoundingClientRect()
                        var body = document.body
                        var docElem = document.documentElement

                        var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
                        var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft

                        var clientTop = docElem.clientTop || body.clientTop || 0
                        var clientLeft = docElem.clientLeft || body.clientLeft || 0

                        var top = box.top + scrollTop - clientTop;
                        var left = box.left + scrollLeft - clientLeft;
                        var width = box.width;
                        var height = box.height;

                        return {
                            top: Math.round(top), left: Math.round(left),
                            width: Math.round(width), height: Math.round(height)
                        };
                    }

                    function getHeight(timeStart, timeEnd) {
                        var i, y = 0;
                        var timeRange = new Date(timeEnd).getTime() - new Date(timeStart).getTime();

                        for (i = 1; i < 22; i++) {
                            var slotRange = scope.timeSlots[i].getTime() - scope.timeSlots[0].getTime();

                            if (slotRange == timeRange) {
                                return i + 1;
                            }
                        }
                        return i;
                    };

                    function getLine(dateStart) {
                        var i = 0;

                        var convertedDateStart = new Date(dateStart).setFullYear(1970, 0, 1);

                        for (i = 0; i < 22; i++) {
                            var range = scope.timeSlots[i].getTime() - convertedDateStart + 3600000;
                           
                            if (range == 0) {
                                return i;
                            }
                        }

                        return i;
                    };
                }
            }
        }]);

})(window.angular);






(function () {
    'use strict';

    angular.module('events').service('EventsService',
        ['ContextService', 'NotificationService', EventsService]);

    function EventsService(ContextService) {

        var URI = 'entries/dateStart/dateEnd/';
        var error = 'Error getting Areas';

        this.GetEntriesByRoomForTimeRange = GetEntriesByRoomForTimeRange;
        this.GetEntriesForRoomsForTimeRange = GetEntriesForRoomsForTimeRange;

        return this;

        function GetEntriesByRoomForTimeRange(roomId, timeRange) {
            return ContextService._post(URI + 'room/' + roomId, timeRange);
        };

        function GetEntriesForRoomsForTimeRange(rooms, timeRange) {
            timeRange['rooms'] = rooms;
            return ContextService._post(URI + 'rooms', error, timeRange);
        };
    }

})();

(function () {
    'use strict';
    angular.module('planning', ['events']);
})();
(function () {

    'use strict';
    angular.module('planning').controller('PlanningController',

        ['$scope', '$filter', 'AreaService', 'EventsService',
            'timeSlotsFactory', EntriesController]);

    function EntriesController($scope, $filter, AreaService, EventsService, timeSlotsFactory) {

        var ctrl = this;

        ctrl.Areas = [];
        ctrl.timeSlots = [];
        ctrl.roomsIds = [];
        ctrl.mode = "";

        ctrl.dataSource = [22];
        ctrl.timeSlots = timeSlotsFactory.timeSlotsHours(8, 30, 22);

        for (var i = 0; i < 22; i++) {
            ctrl.dataSource[i] = [7, 7, 7, 7, 7, 7, 7];
        }
        ctrl.setPlanningMode = setPlanningMode;
        ctrl.selectDate = function (date) {
            $scope.selectedDate = date;
        }
        InitializeScope();

        setPlanningMode("RoomMode");

        return ctrl;

        function InitializeScope() {
            $scope.selectedDate = new Date();

            AreaService.GetAreas()
            .then(function (result) {
                ctrl.Areas = result.data;
                $scope.selectedArea = ctrl.Areas[0];
                $scope.selectedRoom = $scope.selectedArea.Rooms[0];
            });

            $scope.planningTable = { columnsHeadersProperty: '', columns: [] };
            $scope.planningEvents = { idColumn: '' };

            $scope.$watch('selectedArea', onAreaChanged, true);
            $scope.$watch('selectedDate', onDateChanged, true);
            $scope.$watch('selectedRoom', QueryEntriesForRoomAndWeek, true);

        }

        function setPlanningMode(param) {
            var date = $scope.selectedDate;
            ctrl.mode = param;
            if (param == "RoomMode") {
                $scope.planningTable.columnsHeadersProperty = 'header';
                $scope.planningEvents.idColumn = null;

                onDateChanged();
            }
            else {
                $scope.planningTable.columnsHeadersProperty = 'roomName';
                $scope.planningEvents.idColumn = 'RoomId';
                $scope.tableClasses = 'table-responsive table-condensed';

                if ($scope.selectedArea) {
                    onAreaChanged();
                }
            }
        };

        function onDateChanged() {

            if (ctrl.mode == "RoomMode") {
                ctrl.planningWeek = timeSlotsFactory.WeekFromDate($scope.selectedDate);
                $scope.planningTable.columns = ctrl.planningWeek.fullWeek;
                QueryEntriesForRoomAndWeek();
            }
            else {
                QueryEntriesForDateAndRooms();
            }
        }

        function onAreaChanged() {
            var area = $scope.selectedArea;
            if (area) {
                angular.forEach(area.Rooms, function (value, key) {
                    ctrl.roomsIds[key] = value.id;
                });

                if (ctrl.mode != "RoomMode") {
                    if (area.Rooms.length == 1) {
                        setPlanningMode("RoomMode");
                        $scope.selectedRoom = $scope.selectedArea.Rooms[0];
                    }
                    else {
                        $scope.planningTable.columns = $scope.selectedArea.Rooms;
                        QueryEntriesForDateAndRooms();
                    }
                }
                else
                    $scope.selectedRoom = $scope.selectedArea.Rooms[0];
            }
        };

        function QueryEntriesForDateAndRooms() {
            var timeRangeAndRooms = timeSlotsFactory.timeRangeFromDay($scope.selectedDate);
            timeRangeAndRooms['rooms'] = ctrl.roomsIds;

            EventsService.GetEntriesForRoomsForTimeRange(timeSlotsFactory.timeRangeFromDay($scope.selectedDate), ctrl.roomsIds)
                .then(function (result) {
                    $scope.Entries = result;
                });
        }

        function QueryEntriesForRoomAndWeek() {
            if ($scope.selectedRoom) {
                var timeRange = { dateStart: ctrl.planningWeek.dateStart, dateEnd: ctrl.planningWeek.dateEnd };
                EventsService.GetEntriesByRoomForTimeRange($scope.selectedRoom.id, timeRange)
                    .then(function (result) {
                        $scope.Entries = result;
                    });
            }
        }
    }
})();

(function () {

    'use strict';
    angular.module('planning').factory('timeSlotsFactory', 
       ['$filter', function ($filter) {

        var factory = this;
        
        factory.timeSlotsHours = timeSlotsHours;

        factory.WeekFromDate = WeekFromDate;
        factory.timeRangeFromDay = timeRangeFromDay;

        return factory;

        function timeSlotsHours(hourStart, minuteStart, range) {
            var hours = [range];
            var i = 0;
            var timeStart = new Date(1970, 0, 1, hourStart, minuteStart);

            for (i = 0; i < range; i++) {
                hours[i] = timeStart;
                timeStart = addMinutes(timeStart, 30);
            }

            return hours;
        }
        
        function WeekFromDate(date) {

            var week = [7];
            var dateStart, dateEnd = {};

            var i = 0;

            var day = 1 - new Date(date).getDay();
            
            var givenDate = new Date(date).getDate();

            day = day + givenDate;
            for (i = 0; i < 7; i++) {
                var daybis = new Date(date).setDate(day);
                var head = $filter('date')(daybis, 'EEEE dd/MM');

                var objDate = { DayOfWeek: daybis, header: head, id: new Date(daybis).getDay() };

                week[i] = objDate;

                if (i == 0)
                {
                    dateStart = $filter('date')(daybis, 'yyyy-MM-dd HH:mm:ss');
                }
                else if (i == 6)
                {
                    dateEnd = $filter('date')(daybis, 'yyyy-MM-dd HH:mm:ss');
                }

                day++;
            }

            return { fullWeek: week, dateStart: dateStart, dateEnd: dateEnd };
        };

        function timeRangeFromDay(date) {

            var beginningOfDay = new Date(date);
            beginningOfDay.setMinutes(0);
            beginningOfDay.setHours(1);
            beginningOfDay.setMilliseconds(0);
            beginningOfDay.setSeconds(0);

            var EndOfDay = new Date(date);
            EndOfDay.setMinutes(59);
            EndOfDay.setHours(24);
            EndOfDay.setMilliseconds(999);
            EndOfDay.setSeconds(59);

            return { dateStart: beginningOfDay, dateEnd: EndOfDay };
        }

        function addMinutes(date, minutes) {
            return new Date(date.getTime() + minutes * 60000);
        }

       }]);
})();
(function () {
    'use strict';
    angular.module('nwprototypes', []);

})();
(function () {
    'use strict';
    angular.module('nwprototypes').directive('nwDatePicker',
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






(function (angular) {
    'use strict';
    angular.module('nwprototypes').directive('nwDatagrid',
        [function () {

            return {

                template: '<table data-ng-class="TableClasses"style="position: relative"><thead> <tr> <th data-ng-class="HeaderClasses" class="col-header" data-ng-if="AreRowHeadersVisible"></th><th data-ng-repeat="(keyHeaderColumn, header) in Headers track by $index | limitTo:LimitColumns"data-ng-class="HeaderClasses"> {{ header[propHeader] }} </th> </tr> </thead><tbody> <tr data-ng-click="selectContent(keyLine)" data-ng-repeat="(keyLine, line) in Datasource track by $index | limitTo:LimitRows"><td class="{{HeaderClasses}}" data-ng-if="AreRowHeadersVisible" > <div> {{RowHeaders[keyLine] | date : \'HH:mm\'}} </div> </td><td data-ng-class="{highlightCell: hover || Datasource[keyLine][keyCol].selected}" data-ng-mouseenter="hover = true" data-ng-mouseleave="hover = false" data-ng-repeat="(keyCol, column) in Datasource[keyLine] track by $index | limitTo:LimitColumns" data-ng-attr-id="{{\'c\'+ \'(\' + keyLine + \':\' + keyCol + \')\'}}" data-ng-click="selectContent(keyLine, keyCol)"><div data-ng-if="!HideDatasourceContent">{{Datasource[keyLine][keyCol]}}</div> <div data-ng-if="HideDatasourceContent"></div></td> </tr> </tbody> </table> <div data-ng-transclude></div>',

                transclude: true,

                scope: {
                    Datasource: '=datasource',
                    SelectedItem: '&',

                    HideDatasourceContent: '=hideDatasourceContent',
                    Headers: '=headers',
                    propHeader: '=propHeader',
                    RowHeaders: '=rowHeaders',
                    TableClasses: '=tableClasses',
                    HeaderClasses: '=headerClasses',

                    AreRowHeadersVisible: '=areRowHeadersVisible',

                    FilterCell: '=filterCell',

                    LimitColumns: '=limitColumns',
                    LimitRows: '=limitRows',

                    selectionType: '=selectionType',
                    onSelectedItemChanged: '&'
                },

                controller: ['$scope', function ($scope) {
                    var ctrl = this;
                    var location = { x: "", y: "" };
                    ctrl.viewsData = [];

                    ctrl.addViewData = function (viewData) {
                        viewsData.push(viewData);
                    };


                    var usableSelectionType = ["Cell", "Row"];
                    if (!$scope.selectionType)
                        $scope.selectionType = "Cell";
                    else if (!usableSelectionType.find($scope.selectionType)) {
                        $scope.selectionType = "Cell";
                    }

                    if (!$scope.Headers && $scope.Datasource) {
                        $scope.Headers = [];
                        for (var i = 0; i < $scope.Datasource.length; i++) {
                            if ($scope.Datasource[i]) {
                                angular.forEach($scope.Datasource[i], function (value, key) {
                                    $scope.Headers[i] = value;
                                })
                                break;
                            }
                        }
                    }

                    $scope.selectContent = function (keyLine, keyCol) {
                        if ($scope.selectionType == "Row" && keyLine) {
                            delete $scope.Datasource[location.x]["selected"];
                            $scope.SelectedItem = $scope.Datasource[keyLine];
                            $scope.Datasource[keyLine]["selected"] = true;
                            location.x = keyLine;
                        }

                        else if ($scope.selectionType == "Cell" && keyCol) {
                            delete $scope.Datasource[location.x][location.y]["selected"];
                            $scope.SelectedItem = $scope.Datasource[keyLine];
                            $scope.Datasource[keyLine][keyCol]["selected"] = true;
                            $scope.SelectedItem = $scope.Datasource[keyLine][keyCol];
                            location.x = keyLine;
                            location.y = keyCol;
                        }

                        if ($scope.onSelectedItemChanged) {
                            $scope.onSelectedItemChanged({ item: $scope.SelectedItem });
                        }

                    }



                }]
            }
        }]);

})(window.angular);






(function (angular) {
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
                        onDateSelection: "&"
                    },

                    controllerAs: 'ctrl',
                    controller: ['$scope', function ($scope) {
                        if (!$scope.NumberOfMonths)
                            $scope.NumberOfMonths = 1;

                        $scope.tableClasses = 'table table-responsive center-justified';
                        $scope.Headers = ["L", "M", "M", "J", "V", "S", "D"];

                        $scope.FilterCell = nwCalendarFactory.filterDateForCalendar;

                        var ctrl = this;

                        angular.extend(ctrl, {
                            range: 1, 

                            nextMonth: nextMonth,
                            previousMonth: previousMonth,

                            CurrentDate: new Date(),
                            DisplayedDate: new Date().setDate(1),

                            DisplayedMonths: [],
                        });


                        getMonths();

                        ctrl.SelectDate = function (item, month) {
                            $scope.SelectedDate = new Date(month.Year, month.Month, item);
                            if ($scope.onDateSelection) {
                                $scope.onDateSelection({ date: $scope.SelectedDate });
                            }
                        }
                        return ctrl;

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

                    }]
                }
            }

        ]);

})(window.angular);
(function () {
    'use strict';
    angular.module('datetime', []);
})();
(function () {
    'use strict';
    angular.module('datetime').factory('datetimeMonth',
        [month]);

    function month() {

        return {
            getMonthLength: getMonthLength,
        }

        function getMonthLength(date) {
            var month = new Date(date).getMonth();
            var year = new Date(date).getFullYear();
            var month31 = [0, 2, 4, 6, 7, 9, 11];

            if (month === 1) {
                var february = new Date(year, month);
                february.setDate(29 ? 29 : 28);
                return february.getDate();
            }
            else if (month31.indexOf(month) === -1) {
                return 30;
            }
            else {
                return 31;
            }
        }

    }
})();
(function () {
    angular.module('datetime').factory('Time',
        [TimeFactory]);

    function TimeFactory() {

        return Time;

        function Time(data) {
            if (angular.isDate(data)) {
                return TimeFromDate(data)
            }
            else if (IsTime(data))
                return TimeFromTime(data);
            else
                return DefaultTime();

            function IsTime(data) {
                if (data && angular.isDefined(data.hours) && angular.isDefined(data.minutes))
                    return true;
                return false;
            }

            function BuildTime(hours, minutes) {
                return { hours: hours, minutes: minutes };
            }

            function DefaultTime() {
                var date = new Date();
                return TimeFromDate(date);
            }

            function TimeFromDate(date) {
                date = new Date(date);
                return BuildTime(date.getHours(), date.getMinutes());
            }

            function TimeFromTime(time) {
                return BuildTime(time.hours, time.minutes);
            }

        }
        
    }
})();
(function () {
    'use strict';
    angular.module('datetime').factory('datetimeFrench',
        ['datetimeMonth', french]);

    function french(month) {
        var days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche', ];

        return {
            dayInFrench: dayInFrench,
            convertToFrenchDay: convertToFrenchDay,
            convertToEnglishDay: convertToEnglishDay,
            days: days,
        };



        function dayInFrench(day) {
            day = convertToFrenchDay(day);
            return days[day];
        }

        function convertToFrenchDay(day) {
            if (day === 0) {
                day = 6;
            }
            else {
                day -= 1;
            }
            return day;
        }

        function convertToEnglishDay(day) {
            if (angular.isNumber(day)) {
                return convert(day);
            }
            if (angular.isString) {
                var dayNumber = days.indexOf(day);
                if (dayNumber != -1) {
                    return convert(dayNumber);
                }
            }

            return day;

            function convert(day) {

                if (day === 6) {
                    day = 0;
                }
                else {
                    day += 1;
                }

                return day;
            }
        }  
    }
})();
(function () {
	angular.module('datetime').factory('Datetime',
		[
			'datetimeMonth',
			'datetimeCalcul',
			'datetimeFrench',
			'Time',

			Datetime
		]);

	function Datetime(datetimeMonth, datetimeCalcul, datetimeFrench, datetimeTime) {

		return {
			month: datetimeMonth,
			calcul: datetimeCalcul,
			french: datetimeFrench,
			time: datetimeTime,
			};
	}
})();
(function () {
    'use strict';
    angular.module('datetime').factory('datetimeCalcul',
        ['datetimeMonth', calcul]);

    function calcul(month) {

        return {
            addDaysToDate: addDaysToDate,
            addMonthsToDate: addMonthsToDate,
            addYearsToDate: addYearsToDate,

            removeDaysFromDate: removeDaysFromDate,
            removeMonthsFromDate: removeMonthsFromDate,
            removeYearsFromDate: removeYearsFromDate,

            isDateOver: isDateOver,
        };
        

        function addYearsToDate(date, year) {
            date = new Date(date);
            year = date.getFullYear() + year;

            return date.setFullYear(year);
        }

        function addMonthsToDate(date, month) {
            date = new Date(date);
            month = date.getMonth() + month;
            if (month < 11) {
                return date.setMonth(month);
            }
            else {
                var i = 0;
                while (month > 11) {
                    month -= 11;
                    i++;
                }
                date = addYearsToDate(date, i);
                return new Date(date).setMonth(month);

            }
        }

        function addDaysToDate(date, days) {
            date = new Date(date);
            var firstDay = date.getDate() + days;

            while (firstDay > month.getMonthLength(date)) {
                firstDay -= month.getMonthLength(date);
                date = addMonthsToDate(date, 1);
            }

            return new Date(date).setDate(firstDay);

        }

        function removeYearsFromDate(date, year) {
            date = new Date(date);
            year = date.getFullYear() - year;
            if (year > 0) {
                return date.setFullYear(year);
            }
            else return { error: "Date BC not allowed" }
        }
        function removeMonthsFromDate(date, month) {
            date = new Date(date);
            month = date.getMonth() - month;
            if (month >= 0) {
                return date.setMonth(month);
            }
            else {
                var i = 0;
                while (month < 0) {
                    month += 11;
                    i++;
                }
                date = removeYearsFromDate(date, i);
                return date.setMonth(month);

            }
        }

        function removeDaysFromDate(date, days) {
            date = new Date(date);
            var firstDay = date.getDate() - days;

            var year = 0;
            var month = 0;

            while (firstDay < 1) {
                date = removeMonthsFromDate(date, 1);
                firstDay += monthElement.getMonthLength(date);
            }

            return date.setDate(firstDay);

        }
        function isDateOver(askedDate, comparedDate) {
            if (askedDate.getFullYear() > comparedDate.getFullYear())
                return true;
            if (askedDate.getFullYear() < compareDate.getFullYear())
                return false;
            if (askedDate.getMonth() > comparedDate.getMonth())
                return true;
            if (askedDate.getMonth() < comparedDate.getMonth())
                return false;
            if (askedDate.getDate() > comparedDate.getDate())
                return true;
            if (askedDate.getDate() < comparedDate.getDate())
                return false;

            return null;
        }
    }
})();
(function () {
    'use strict';
    angular.module('navigation', []);
})();
(function (angular) {
    'use strict';
    angular.module('navigation').directive('nwNavigationMenu',
        [function () {
            return {
                scope: true,
                template: '<div class="navigation-menu"><div class="navigation-element"><span class="glyphicon glyphicon-search menu-glyph" data-ng-click="ctrl.viewSearchBar()"></span><span class="navigation-element" data-ng-if="ctrl.isSearchBarVisible"><input type="text" style="width:75%; z-index:1;" /></span></div><div data-ng-click="ctrl.navClass(\'Acceuil\')" class="navigation-element"> <span class="glyphicon glyphicon-home menu-glyph"></span> <span class="element-label">Accueil</span> </div><div data-ng-click="ctrl.navClass(\'Calendrier\')" class="navigation-element"> <span class="glyphicon glyphicon-calendar menu-glyph"></span> <span class="element-label">Calendrier</span> </div> <div data-ng-click="ctrl.navClass(\'Salles\')" class="navigation-element"><span class="glyphicon glyphicon-list menu-glyph"></span><span class="element-label">Les Salles</span></div> <div data-ng-click="ctrl.navClass(\'Reservations\')" class="navigation-element"><span class="glyphicon glyphicon-credit-card menu-glyph"></span><span class="element-label">Réserver</span></div><div style="height:30%"></div> </div>',
                replace: true,
                controllerAs: 'ctrl',

                controller:['$scope', '$location', function($scope, $location){
                    var ctrl = this;
                    ctrl.isSearchBarVisible = false;
                    ctrl.viewSearchBar = function(){
                        ctrl.isSearchBarVisible = !ctrl.isSearchBarVisible;
                    }

                    ctrl.navClass = function (navtarget) {
                        $location.path('/' + navtarget);
                    };
                }]
            }
    }]);

})(window.angular);






(function () {
    'use strict';
    angular.module('settings', []);
})();
(function () {
    'use strict';

    angular.module('settings').service('settingsLocationService',
        [settingsLocationService]);

    function settingsLocationService() {
            var start = new Date(1970, 1, 1, 8, 30);
            var end = new Date(1970, 1, 1, 19, 30);

            return {
                OpeningHours: { start: start, end: end },
                MinimalTimeRent: 30,
                MinimalSlotSize: 15,
            }
    }
})();
(function () {
    'use strict';

   
    angular.module('settings').service('SettingsPeriodicityService',
        [SettingsPeriodicityService]);

    function SettingsPeriodicityService() {
            return {
                    Week: {
                        maximumSpan: 10,
                        maximumRepeat: 10,
                    },
                    Month: {
                        maximumRepeat: 10,
                    },
                    Year: {
                        maximumRepeat: 10,
                    },
                }
            }
})();
(function () {
    'use strict';
    angular.module('shared', ['settings', 'datetime', 'navigation']);
})();
(function () {
    'use strict';
    angular.module('shared').service('ContextService',
        ['$http', ContextService]);

    function ContextService($http) {
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
(function () {
    'use strict';
    angular.module('shared').service('AreaService',
        ['ContextService', AreaService]);

    function AreaService(ContextService) {

        this.GetAreas = GetAreas;
        this.SaveArea = SaveArea;
        this.SaveRoom = SaveRoom;

        return this;


        function SaveRoom(data) {
            ContextService._post('rooms', data);
        }

        function SaveArea(data) {
            ContextService._post('areas', 'Error while saving new Area', data);
        }

        function GetAreas() {
            return ContextService._get('areas').then(function(result){ return result.data});
        };

    }

})();

(function () {
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
                        flash.keepAfterLocationChange = false;
                    }
                }
            }
        }

        function Notification(message, type, keepAfterLocationChange) {
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
(function () {
    'use strict';

    angular.module("MRBS",
        [
            'ngRoute', 
            'ngCookies',

            'shared',

            'authentication',
            'booking',
            'areas',
            'planning',
            'nwprototypes',
        ]);
})();






(function () {

    'use strict';
    angular.module('MRBS').config(
        ['$routeProvider', '$locationProvider', router]);

        function router($routeProvider, $locationProvider) {
            $routeProvider

                .when('/Authentification', {
                    controller: 'loginCtrl',
                    templateUrl: 'pages/login.html',
                    controllerAs: 'ctrl'
                })

                .when('/Salles', {
                    controller: 'AreaEditController',
                    templateUrl: 'pages/areaEdit.html',
                    controllerAs: 'ctrl'
                })

                .when('/Calendrier', {
                    controller: 'PlanningController',
                    templateUrl: 'pages/planning.html',
                    controllerAs: 'ctrl'
                })

                .when('/Aide', {
                    controller: '',
                    templateUrl: 'pages/help.html',
                    controllerAs: 'ctrl'
                })

                .when('/Reservations', {
                    controller: 'BookingController',
                    templateUrl: 'pages/booking.html',
                    controllerAs: 'ctrl'
                })

                .otherwise({ redirectTo: '/' });
        }
})();
(function () {

    'use strict';
    angular.module('MRBS').run(
        ['$rootScope', '$location', '$cookies', '$http', runner]);

    function runner($rootScope, $location, $cookies, $http) {
        $rootScope.globals = $cookies.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
        }

    }
})();