(function () {

    'use strict';

    angular.module('areas').controller('AreaEditController',
        ['AreaService', AreaEditController]);

    function AreaEditController(AreaService) {

        /// <summary>
        /// Controller for Area Edition (admin only).
        /// </summary>
        /// <param name="Areas">All areas provided by AreaService</param>
        /// <param name="Rooms">All rooms of the Area currently selected</param>
        /// <param name="selectedArea">Area currently selected</param>
        /// <returns></returns>

        var ctrl = this;

        ctrl.Areas = [];
        ctrl.Rooms = [];
        ctrl.selectedArea = {};

        ctrl.edit = edit;
        ctrl.add = add;

        ctrl.saveArea = saveArea;
        ctrl.deleteArea = deleteArea;
        ctrl.saveRoom = saveRoom;

        ctrl.option = "";

        ctrl.editArea = false;
        ctrl.addRoom = false;

        AreaService.GetAreas()
            .then(function (result) {
                ctrl.Areas = result.data;
                ctrl.selectedArea = ctrl.Areas[0];
            });

        return ctrl;


        function edit() {

            this.option = "Modifier";
            this.areaEdited = ctrl.selectedArea;
            this.editArea = true;
        };

        function add() {
            this.option = "Ajouter";
            //areaEdited = Area; 
            this.editArea = true;
        };

        function deleteArea() {
            // Mettre en place une double alerte : une première par défaut, une seconde si l'application trouve des réservations liées au domaine;

        };

        function saveArea() {
            if (ctrl.areaEdited != "") {
                AreaService.SaveArea({
                    areaName: ctrl.areaEdited
                });
            };
        }
        function saveRoom() {
            // A déplacer dans le service.
            // Vérifier s'il s'agit d'un update
            if (ctrl.selectedRoom.id == null) {

                AreaService.SaveRoom(
                {
                    AreaId: ctrl.selectedArea.id,
                    roomName: ctrl.selectedRoom.roomName,
                    roomDescription: ctrl.selectedRoom.roomDescription,
                    capacity: ctrl.selectedRoom.capacity,
                    priceForALeague: ctrl.selectedRoom.priceForALeague,
                    priceForAClub: ctrl.selectedRoom.priceForAClub,
                    priceForAPerson: ctrl.selectedRoom.priceForAPerson

                });
            }
        }
            
        }
})();