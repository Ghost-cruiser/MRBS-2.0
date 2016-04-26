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
        

        // #region Addition
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
            /// <summary>
            /// Removes the days from date.
            /// </summary>
            /// <param name="date">The initial date.</param>
            /// <param name="days">The number of days to add.</param>
            /// <returns>date: A new date "days" ago.</returns>
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
        // #endregion

        //#region Substraction
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
            /// <summary>
            /// Removes the days from date.
            /// </summary>
            /// <param name="date">The initial date.</param>
            /// <param name="days">The number of days to remove.</param>
            /// <returns>date: A new date "days" ago.</returns>
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
        //#endregion

        //#region Comparison
        function isDateOver(askedDate, comparedDate) {
            /// <summary>
            /// Determines whether is askedDate over to the specified comparedDate. 
            /// This function ignores the time. If you need to compare it, use isDateExactlyOver(). 
            /// </summary>
            /// <param name="askedDate">The asked date.</param>
            /// <param name="comparedDate">The compared date.</param>
            /// <returns>
            ///     true: askedDate is over
            ///     false: askedDate is under
            ///     null: dates are equal to the day
            /// </returns>
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
        //#endregion
    }
})();