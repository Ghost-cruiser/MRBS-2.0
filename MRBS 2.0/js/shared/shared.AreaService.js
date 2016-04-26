(function () {
    'use strict';
    // Area represente des zones qui regroupent les différentes
    // salles louables des locaux de la M2L
    angular.module('shared').service('AreaService',
        ['ContextService', AreaService]);

    function AreaService(ContextService) {

        this.GetAreas = GetAreas;
        this.SaveArea = SaveArea;
        this.SaveRoom = SaveRoom;

        return this;


        function SaveRoom(data) {
            ContextService._post('rooms', data);
        }

        function SaveArea(data) {
            ContextService._post('areas', 'Error while saving new Area', data);
        }

        function GetAreas() {
            return ContextService._get('areas').then(function(result){ return result.data});
        };

    }

})();

//function Room() {
//// Room représente les différentes salles louables.
//// Il existe 3 différents prix en fonction du type d'utilisateur
//// faisant la demande de location (particulier, club, ligue)

//    this.Id = 0;
//    this.Name = "";
//    this.Area = "";

//    // Le moins cher
//    this.PriceForALeague = 0;

//    this.PriceForAClub = 0;

//    // Le plus cher
//    this.PriceForAPrivPers = 0;

//}




//    factory.Areas = $http.get('http://localhost:1337/api/areas')
//.then(function (result) {
//    ctrl.Areas = result.data;
//});

//function GetAreaRooms(areaId) {
//    return $http.get('http://localhost:1337/api/rooms/' + areaId)
//        .then(handleSuccess, handleError('Error getting Rooms of Area'))
//};