(function (angular) {
    'use strict';
    angular.module('navigation').directive('nwNavigationMenu',
        [function () {
            return {
                scope: true,
                template: '<div class="navigation-menu"><div class="navigation-element"><span class="glyphicon glyphicon-search menu-glyph" data-ng-click="ctrl.viewSearchBar()"></span><span class="navigation-element" data-ng-if="ctrl.isSearchBarVisible"><input type="text" style="width:75%; z-index:1;" /></span></div><div data-ng-click="ctrl.navClass(\'Acceuil\')" class="navigation-element"> <span class="glyphicon glyphicon-home menu-glyph"></span> <span class="element-label">Accueil</span> </div><div data-ng-click="ctrl.navClass(\'Calendrier\')" class="navigation-element"> <span class="glyphicon glyphicon-calendar menu-glyph"></span> <span class="element-label">Calendrier</span> </div> <div data-ng-click="ctrl.navClass(\'Salles\')" class="navigation-element"><span class="glyphicon glyphicon-list menu-glyph"></span><span class="element-label">Les Salles</span></div> <div data-ng-click="ctrl.navClass(\'Reservations\')" class="navigation-element"><span class="glyphicon glyphicon-credit-card menu-glyph"></span><span class="element-label">Réserver</span></div><div style="height:30%"></div> </div>',
                replace: true,
                controllerAs: 'ctrl',

                controller:['$scope', '$location', function($scope, $location){
                    var ctrl = this;
                    ctrl.isSearchBarVisible = false;
                    ctrl.viewSearchBar = function(){
                        ctrl.isSearchBarVisible = !ctrl.isSearchBarVisible;
                    }

                    ctrl.navClass = function (navtarget) {
                        $location.path('/' + navtarget);
                    };
                }]
            }
    }]);

})(window.angular);





