(function () {
	angular.module('datetime').factory('Datetime',
		[
			'datetimeMonth',
			'datetimeCalcul',
			'datetimeFrench',
			'Time',

			Datetime
		]);

	function Datetime(datetimeMonth, datetimeCalcul, datetimeFrench, datetimeTime) {

		return {
			month: datetimeMonth,
			calcul: datetimeCalcul,
			french: datetimeFrench,
			time: datetimeTime,
			};
	}
})();