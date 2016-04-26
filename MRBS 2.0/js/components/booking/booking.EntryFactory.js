(function () {
    angular.module('booking').factory('Entry',
        [EntryFactory]);

    function EntryFactory() {

        return Entry;

        function Entry(data) {
            if (!data) {
                return protoEntry();
            }
            else return newEntry(data);
        }

        function protoEntry() {
            return {
                // A la minute près au moins
                dateStart: new Date(),
                dateEnd: new Date,

                RoomId: 0,

                periodicityType: 0,
                periodicityParameter: "default",
                repeat:0,

                // TypeOfLocation : 0 = league, 1 = club, 3 = particulier
                typeOfLocation: 0,

                title: "Titre",

                description: "description"
            }
        }

        function newEntry(data) {
            return {
                // A la minute près au moins
                dateStart: data.dateStart,
                dateEnd: data.dateEnd,

                periodicityType: data.periodicityType,
                periodicityParameter: data.periodicityParameter,
                repeat: data.repeat,

                RoomId: data.RoomId,

                // TypeOfLocation : 0 = league, 1 = club, 3 = particulier
                typeOfLocation: data.typeOfLocation,

                title: data.title,

                description: data.description,
            }
        }
    }
})();