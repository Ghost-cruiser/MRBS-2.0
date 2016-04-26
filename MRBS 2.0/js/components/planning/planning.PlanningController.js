(function () {

    'use strict';
    angular.module('planning').controller('PlanningController',

        ['$scope', '$filter', 'AreaService', 'EventsService',
            'timeSlotsFactory', EntriesController]);

    function EntriesController($scope, $filter, AreaService, EventsService, timeSlotsFactory) {

        var ctrl = this;

        ctrl.Areas = [];
        ctrl.timeSlots = [];
        ctrl.roomsIds = [];
        ctrl.mode = "";

        // TODO : rendre ce chiffre configurable
        ctrl.dataSource = [22];
        ctrl.timeSlots = timeSlotsFactory.timeSlotsHours(8, 30, 22);

        for (var i = 0; i < 22; i++) {
            ctrl.dataSource[i] = [7, 7, 7, 7, 7, 7, 7];
        }
        //
        ctrl.setPlanningMode = setPlanningMode;
        ctrl.selectDate = function (date) {
            $scope.selectedDate = date;
        }
        InitializeScope();

        setPlanningMode("RoomMode");

        return ctrl;

        function InitializeScope() {
            // Set the selected date as today's date
            $scope.selectedDate = new Date();

            // Loading all Areas with their rooms
            AreaService.GetAreas()
            .then(function (result) {
                ctrl.Areas = result.data;
                $scope.selectedArea = ctrl.Areas[0];
                $scope.selectedRoom = $scope.selectedArea.Rooms[0];
            });

            // Initializing the planning properties and its events
            $scope.planningTable = { columnsHeadersProperty: '', columns: [] };
            $scope.planningEvents = { idColumn: '' };

            // Using scope to trigger function on events
            $scope.$watch('selectedArea', onAreaChanged, true);
            $scope.$watch('selectedDate', onDateChanged, true);
            $scope.$watch('selectedRoom', QueryEntriesForRoomAndWeek, true);

        }

        function setPlanningMode(param) {
            var date = $scope.selectedDate;
            ctrl.mode = param;

            // RoomMode - One room displayed, for one week
            if (param == "RoomMode") {
                $scope.planningTable.columnsHeadersProperty = 'header';
                $scope.planningEvents.idColumn = null;

                onDateChanged();
            }
            else {
                //Default mode : 7 rooms of an Area displayed for one day
                $scope.planningTable.columnsHeadersProperty = 'roomName';
                $scope.planningEvents.idColumn = 'RoomId';
                $scope.tableClasses = 'table-responsive table-condensed';

                if ($scope.selectedArea) {
                    onAreaChanged();
                }
            }
        };

        function onDateChanged() {

            if (ctrl.mode == "RoomMode") {
                ctrl.planningWeek = timeSlotsFactory.WeekFromDate($scope.selectedDate);
                $scope.planningTable.columns = ctrl.planningWeek.fullWeek;
                QueryEntriesForRoomAndWeek();
            }
            else {
                QueryEntriesForDateAndRooms();
                console.log($scope.selectedDate);
            }
        }

        function onAreaChanged() {
            var area = $scope.selectedArea;
            if (area) {
                angular.forEach(area.Rooms, function (value, key) {
                    ctrl.roomsIds[key] = value.id;
                });

                if (ctrl.mode != "RoomMode") {
                    // if only one room in the Area, display RoomMode
                    if (area.Rooms.length == 1) {
                        setPlanningMode("RoomMode");
                        $scope.selectedRoom = $scope.selectedArea.Rooms[0];
                    }
                    else {
                        $scope.planningTable.columns = $scope.selectedArea.Rooms;
                        QueryEntriesForDateAndRooms();
                    }
                }
                else
                    $scope.selectedRoom = $scope.selectedArea.Rooms[0];
            }
        };

        function QueryEntriesForDateAndRooms() {
            var timeRangeAndRooms = timeSlotsFactory.timeRangeFromDay($scope.selectedDate);
            timeRangeAndRooms['rooms'] = ctrl.roomsIds;

            EventsService.GetEntriesForRoomsForTimeRange(timeSlotsFactory.timeRangeFromDay($scope.selectedDate), ctrl.roomsIds)
                .then(function (result) {
                    $scope.Entries = result;
                });
        }

        function QueryEntriesForRoomAndWeek() {
            if ($scope.selectedRoom) {
                var timeRange = { dateStart: ctrl.planningWeek.dateStart, dateEnd: ctrl.planningWeek.dateEnd };
                EventsService.GetEntriesByRoomForTimeRange($scope.selectedRoom.id, timeRange)
                    .then(function (result) {
                        $scope.Entries = result;
                    });
            }
        }
    }
})();
