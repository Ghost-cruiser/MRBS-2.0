(function (angular) {
    'use strict';
    angular.module('events').directive('nwEvent',
        [function () {

            return {
                scope: { data: '=eventData', timeSlots: '=timeSlots', idColumn: '=idColumn' },
                templateUrl: '<div style="position:absolute; padding: 5px 5px 5px 5px" data-ng-style="{left:data.left, top:data.top, height:data.height, width:data.width}"><div class="view-events"style="position:absolute; z-index:2;"data-ng-class="{highlightCell: hover}"data-ng-mouseenter="hover = true"data-ng-mouseleave="hover = false"> </div></div>',
                restrict: 'A',
                require: '^nwDatagrid',

                // When a directive requires a controller, it receives that controller as the fourth argument of its link function
                link: function (scope, element, attrs, tableCtrl) {

                    var divTarget = function () {
                        if (scope.idColumn) {
                            return document.getElementById(getLine(scope.data.dateStart) + ':' + scope.data[scope.idColumn]);
                        }
                        else {
                            var day = new Date(scope.data.dateStart).getDay();
                            return document.getElementById(getLine(scope.data.dateStart) + ':' + day);
                        }
                    }
                    setPosition(scope.data, divTarget);

                    tableCtrl.addViewData(scope);

                    function setPosition(data, divTarget) {
                        
                        var div = divTarget();

                        var position = getPosition(div);
                        // Adding properties dynamically so the object can be displayed

                        data['height'] = position.height*getHeight(scope.data.dateStart, scope.data.dateEnd) + 'px';
                        data['left'] = position.left + 'px';
                        data['top'] = position.top + 'px';
                        data['width'] = position.width + 'px';

                        data['view'] = true;
                        //  
                    };

                    function getPosition(elem) {
                        // (1)
                        var box = elem.getBoundingClientRect()
                        var body = document.body
                        var docElem = document.documentElement

                        // (2)
                        var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
                        var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft

                        // (3)
                        var clientTop = docElem.clientTop || body.clientTop || 0
                        var clientLeft = docElem.clientLeft || body.clientLeft || 0

                        // (4)
                        var top = box.top + scrollTop - clientTop;
                        var left = box.left + scrollLeft - clientLeft;
                        var width = box.width;
                        var height = box.height;

                        return {
                            top: Math.round(top), left: Math.round(left),
                            width: Math.round(width), height: Math.round(height)
                        };
                    }

                    function getHeight(timeStart, timeEnd) {
                        var i, y = 0;
                        var timeRange = new Date(timeEnd).getTime() - new Date(timeStart).getTime();

                        // 22 = Numbers of [timeSlots]
                        for (i = 1; i < 22; i++) {
                            var slotRange = scope.timeSlots[i].getTime() - scope.timeSlots[0].getTime();

                            if (slotRange == timeRange) {
                                return i + 1;
                            }
                        }
                        return i;
                    };

                    function getLine(dateStart) {
                        var i = 0;

                        var convertedDateStart = new Date(dateStart).setFullYear(1970, 0, 1);

                         // 22 = Numbers of [timeSlots]
                        for (i = 0; i < 22; i++) {
                            // TODO : replace the need of a constant (we are at GMT+1) by normalized dates in the app
                            var range = scope.timeSlots[i].getTime() - convertedDateStart + 3600000;
                           
                            if (range == 0) {
                                return i;
                            }
                        }

                        return i;
                    };
                }
            }
        }]);

})(window.angular);





