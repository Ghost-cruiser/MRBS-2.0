(function () {
    'use strict';

    angular.module('events').service('EventsService',
        ['ContextService', 'NotificationService', EventsService]);

    function EventsService(ContextService) {

        /// <summary>
        /// Service returning entries. 
        /// </summary>
        /// <param name="ContextService">Depends on ContextService for the DB access.</param>
        /// <returns></returns>

        var URI = 'entries/dateStart/dateEnd/';
        var error = 'Error getting Areas';

        this.GetEntriesByRoomForTimeRange = GetEntriesByRoomForTimeRange;
        this.GetEntriesForRoomsForTimeRange = GetEntriesForRoomsForTimeRange;

        return this;

        function GetEntriesByRoomForTimeRange(roomId, timeRange) {
            /// <summary>
            /// Gets the entries by room for a date range.
            /// </summary>
            /// <param name="roomId">The room identifier.</param>
            /// <param name="timeRange">The time range. {dateStart, dateEnd}</param>
            /// <returns></returns>
            return ContextService._post(URI + 'room/' + roomId, timeRange);
        };

        function GetEntriesForRoomsForTimeRange(rooms, timeRange) {
            /// <summary>
            /// Gets the entries for a list of rooms for a date range.
            /// </summary>
            /// <param name="rooms">The rooms identifiers.</param>
            /// <param name="timeRange">The time range. {dateStart, dateEnd}</param>
            /// <returns></returns>
            timeRange['rooms'] = rooms;
            return ContextService._post(URI + 'rooms', error, timeRange);
        };
    }

})();
