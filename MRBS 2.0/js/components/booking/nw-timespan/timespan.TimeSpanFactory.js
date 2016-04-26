(function () {

    // TODO : reorganize file !!!
    'use strict';
    angular.module('booking').factory('TimeSpanFactory',
       ['$filter', function ($filter) {


           return {

               BuildArrayOfMinutes: BuildArrayOfMinutes,     // Array of available minutes
               BuildArrayOfHours: BuildArrayOfHours,

               AddMinutesToTime: AddMinutesToTime,
               RemoveMinutesFromTime: RemoveMinutesFromTime,         // Array of available hours
               IsOver: IsOver,

           }

           //Methodes
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
