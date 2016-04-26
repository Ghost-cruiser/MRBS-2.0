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