(function () {

    // TODO : reorganize file !!!
    'use strict';
    angular.module('planning').factory('timeSlotsFactory', 
       ['$filter', function ($filter) {

        var factory = this;
        
        factory.timeSlotsHours = timeSlotsHours; // Create an array of hours for planning

        // Provide an object containing a fullWeek, a dateStart (Monday) and a dateEnd (Sunday),
        // wich can be used as headers for the planning, and paramaters to query events
        factory.WeekFromDate = WeekFromDate; // for planning and planningController
        factory.timeRangeFromDay = timeRangeFromDay; // for planning Controller

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

            // getDay: place in week, 0 being sunday
            var day = 1 - new Date(date).getDay();
            
            var givenDate = new Date(date).getDate();

            day = day + givenDate; // = Monday
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

        /////////////////////////////////

        function addMinutes(date, minutes) {
            return new Date(date.getTime() + minutes * 60000);
        }

       }]);
})();
