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