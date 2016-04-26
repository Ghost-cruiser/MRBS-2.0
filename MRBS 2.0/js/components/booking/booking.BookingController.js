(function () {
    
    'use strict';
    angular.module('booking').controller('BookingController',
        ['AreaService', 'BookingService', 'Entry', 'AnalyzerService', 'Datetime', BookingController]);

    function BookingController(AreaService, BookingService, Entry, AnalyzerService, datetime) {
        /// <summary>
        /// Bookings the controller.
        /// </summary>
        /// <param name="AreaService">Depends on this service to provide the areas and the rooms.</param>
        /// <param name="BookingService">Depends on this service to record the entry.</param>
        /// <returns></returns>
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
        console.log(ctrl.selectedBookedRooms.length);
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
                console.log(day);
                angular.forEach(ctrl.selectedDays, function (value, key) {
                    if (key == ctrl.days[day]) {
                        console.log(value, key, ctrl.selectedDays[key]);
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

        ///

        function bookRooms() {
            console.log(ctrl.entry);
            var req = AnalyzerService.Analyze(ctrl.entry, ctrl.selectedDays, ctrl.bookedRooms);
            console.log(req);
            if (req) {
                BookingService.SaveEntries(req);
            }
        }
    }
})();