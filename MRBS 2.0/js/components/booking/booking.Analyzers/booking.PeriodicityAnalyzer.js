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
		        // TODO create a task calculating all dates for month case
		        // that executes in parallel;
		    }
		    return true;
		}

		function BuildPeriodicity(days, entry) {
		    var periodeType = entry.periodicityType;
		    var periode = entry.periodicityParameter;
		    console.log(entry.periodicityType, entry.periodicityParameter);
		    var x = 0; 
		    var iteration = 0;
		    if (periodeType === 1) {
                // Week
		        for (var i = 0; i < entry.repeat; i++) {
		            iteration = days.length;

		            //console.log(iteration);


		            for (var y = x; y < iteration; y++) {
		                var time = 7 * periode;
		                console.log(time, 7 * periode, periode);
		                days.push(datetime.calcul.addDaysToDate(days[y], time));
		            }
		            x = iteration;
		        }
		    }
            // Year
		    else if (periodeType == 3) {
		        for (var i = 0; i < entry.repeat; i++) {
		            iteration = days.length;
		            for (var y = x; y < iteration; y++) {
		                days.push(datetime.calcul.addYearsToDate(days[y], 1));
		            }
		            x = iteration;
		        }
		    }
                //Month
		    else {
		        days = buildDaysForMonthlyPeriod(days, entry.periodicityParameter, entry.dateStart, entry.repeat);
		        //
		    }
		    console.log(days);
		    return days;
		}

		function buildDaysForMonthlyPeriod(days, parameter, mainDate, repeat) {
		    if (angular.isNumber(parameter)) {
		        console.log(parseInt(parameter))
		        days = BuildDaysOnDate(days, mainDate, repeat);
		    }
		    else {
		        days = AnalyzeMonthParameter(days, parameter, mainDate, repeat);
		    }
		    return days;

            /////////////////////////////////////////////////////////////////////

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
		        console.log(parseInt(firstParam));
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
		        console.log(paramString, repeat, date, days);
		        var englishDay = datetime.french.convertToEnglishDay(paramString);
		        var newDate = datetime.calcul.addMonthsToDate(new Date(date), 1);
		        newDate = new Date(newDate).setDate(datetime.month.getMonthLength(newDate));
		        for (var i = 0; i < repeat; i++) {
		            var newDate = datetime.calcul.addMonthsToDate(new Date(date), 1);
		            var length = datetime.month.getMonthLength(newDate);
		            newDate = new Date(newDate).setDate(length);
		            days.push(newDate);

		            console.log(length, newDate, days);
		        }
		        return days;
		    }

		    function findXDay(x, day, date) {
		        console.log(x, day, date);
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