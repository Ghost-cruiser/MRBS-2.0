(function (angular) {
    'use strict';
    angular.module('navigation').directive('nwNavigationMenu',
        [function () {
            return {
                scope: true,
                templateUrl: 'js/shared/navigation/nw-navigation-menu.html',
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





