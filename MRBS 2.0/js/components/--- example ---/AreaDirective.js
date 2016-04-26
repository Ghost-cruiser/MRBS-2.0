(function () {

    angular.module('area').directive('AreaDirective',
        ['$compile', AreaDirective]);

    function AreaDirective($compile) {

        return {
            template: '<td><strong data-ng-bind="row.room"></strong></td><td data-ng-bind="row.area"></td></tr>'
        };
    }
})();

// TODO : Mettre le .factory ci-dessous dans un autre fichier;
//        Ajouter les chemins des deux fichiers dans index.html
//        (bonne section ou section "Tests");
// Je pense aussi qu'éviter un html si c'est faisable, ce sera 
// plus facile à intégrer.
(function () {

    angular.module('area').factory('DataForTests',
        ['$scope', DataForTests]);

    function DataForTests($scope) {

        $scope.datas = [{
            room: 'room1',
            area: 'area1'
        }, {
            room: 'room2',
            area: 'area2'
        }, {
            room: 'room3',
            area: 'area1'
        }, {
            room: 'room4',
            area: 'area2'
        }, {
            room: 'room5',
            area: 'area2'
        }, {
            room: 'room6',
            area: 'area3'
        }
        ];
    }
})();



