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

            // #region Methods
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
            // #endregion

        }
        
    }
})();