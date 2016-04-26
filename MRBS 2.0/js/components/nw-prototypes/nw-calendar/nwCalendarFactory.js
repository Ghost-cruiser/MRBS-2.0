(function () {

    // TODO : reorganize file !!!
    'use strict';
    angular.module('nwprototypes').factory('nwCalendarFactory',
       ['$filter', function ($filter) {

           var factory = this;

           factory.GetMonthByYearAndMonth = GetMonthByYearAndMonth; 

           factory.filterDateForCalendar = function (date) { 
               $filter('date')(date, 'd');
           }

           return factory;

           function GetMonthByYearAndMonth(firstdate) {
               
               var day = new Date(firstdate);
               var month = day.getMonth();
               var year = day.getFullYear();
               var condition = false;
               var fullMonth = [];
               var i = 0;
               var y = 0;

               while (!condition) {
                   fullMonth[i] = day;

                   day = addDay(day);
                   condition = (day.getMonth() != month);

                   i++;
               };

               var dayOfWeek = fullMonth[0].getDay();

               // Translating to have Monday as first day of week
               dayOfWeek -= 1;

               if (dayOfWeek == -1)
                   dayOfWeek = 6;

               var monthRangedByWeek = [5];
               var daysTotal = 0;


               for (i = 0; i < 5; i++) {
                   monthRangedByWeek[i] = [];

                   for (y = 0; y < 7; y++) {
                       if (condition) {
                           y = dayOfWeek;// So the array representing the first week of the month is filled from the first day of that said week;
                           condition = false;
                       }
                       if (daysTotal < fullMonth.length) {
                           //monthRangedByWeek[i][y] = fullMonth[daysTotal];
                           monthRangedByWeek[i][y] = $filter('date')(fullMonth[daysTotal], 'd');
                           //monthRangedByWeek[i][y] = daysTotal;
                       }
                       else {
                           break;
                       }
                       daysTotal++;
                   }
               };
               var CurrentYear = FullYear();

               return { fullMonth: monthRangedByWeek, currentMonth: CurrentYear[month].Month + ' ' + year };

               function addDay(date) {
                   var tomorrow = new Date(date);
                   tomorrow.setDate(date.getDate() + 1);

                   return tomorrow;
               }

               function FullYear() {

                   var year = [

                   { Month: "Janvier" },
                   { Month: "Février" },
                   { Month: "Mars" },
                   { Month: "Avril" },
                   { Month: "Mai" },
                   { Month: "Juin" },
                   { Month: "Juillet" },
                   { Month: "Août" },
                   { Month: "Septembre" },
                   { Month: "Octobre" },
                   { Month: "Novembre" },
                   { Month: "Décembre" }

                   ];

                   return year;
               }

           }

       }]);
})();
