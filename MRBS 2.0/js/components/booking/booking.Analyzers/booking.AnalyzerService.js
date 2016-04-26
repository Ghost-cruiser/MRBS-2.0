(function () {
	'use strict';

	angular.module('booking').service('AnalyzerService',
        [
			'Entry',
			'Datetime',
			'PeriodicityAnalyzer',
			'DaysAnalyzer',

			AnalyzerService
        ]);

	function AnalyzerService(Entry, datetime, PeriodicityAnalyzer, DaysAnalyzerService) {

		var service = this;

		service.Analyze = AnalyzeEntry;
		// = AnalyzeEntry;

		return this;

		function AnalyzeEntry(entry, selectedDays, rooms) {

			var req = buildRoomsId(entry, rooms);

			var periodicity = PeriodicityAnalyzer.Analyze(
				entry.periodicityType,
				entry.periodicityParameter);
            
			
			var days = DaysAnalyzerService.Analyze(selectedDays, new Date(entry.dateStart));

			console.log(periodicity);
			console.log(days.length);

			if (periodicity) {
				days = PeriodicityAnalyzer.Build(days, entry);
			}
			if (days) {
				req = buildEntriesDates(days, req);
			}

			return req;
		}

		function buildRoomsId(mainEntry, rooms) {
			var req = [];
			for (var i = 0; i < rooms.length; i++) {
				var newEntry = Entry(mainEntry);
				newEntry.RoomId = rooms[i].id;
				req.push(newEntry);
			}
			console.log(req);
			return req;
		}

		function buildEntriesDates(days, entries) {
		    //console.log(days.length);
		    var y = 0;
		    var length = entries.length;
		    var allEntries = [];
		    for (y = 0; y < length; y++) {

				for (var i = 0; i < days.length; i++) {
					var newEntry = Entry(entries[y]);
					newEntry.dateStart = days[i];
					allEntries.push(newEntry);
				}
			}
			return allEntries;
		}


	}

})();