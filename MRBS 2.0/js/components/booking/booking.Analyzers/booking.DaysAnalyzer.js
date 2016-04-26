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