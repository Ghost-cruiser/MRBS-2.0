(function (angular) {
    'use strict';
    angular.module('nwprototypes').directive('nwDatagrid',
        [function () {

            return {

                template: '<table data-ng-class="TableClasses"style="position: relative"><thead> <tr> <th data-ng-class="HeaderClasses" class="col-header" data-ng-if="AreRowHeadersVisible"></th><th data-ng-repeat="(keyHeaderColumn, header) in Headers track by $index | limitTo:LimitColumns"data-ng-class="HeaderClasses"> {{ header[propHeader] }} </th> </tr> </thead><tbody> <tr data-ng-click="selectContent(keyLine)" data-ng-repeat="(keyLine, line) in Datasource track by $index | limitTo:LimitRows"><td class="{{HeaderClasses}}" data-ng-if="AreRowHeadersVisible" > <div> {{RowHeaders[keyLine] | date : \'HH:mm\'}} </div> </td><td data-ng-class="{highlightCell: hover || Datasource[keyLine][keyCol].selected}" data-ng-mouseenter="hover = true" data-ng-mouseleave="hover = false" data-ng-repeat="(keyCol, column) in Datasource[keyLine] track by $index | limitTo:LimitColumns" data-ng-attr-id="{{\'c\'+ \'(\' + keyLine + \':\' + keyCol + \')\'}}" data-ng-click="selectContent(keyLine, keyCol)"><div data-ng-if="!HideDatasourceContent">{{Datasource[keyLine][keyCol]}}</div> <div data-ng-if="HideDatasourceContent"></div></td> </tr> </tbody> </table> <div data-ng-transclude></div>',
                
                transclude: true,

                scope: {
                    Datasource: '=datasource',
                    SelectedItem: '&',

                    HideDatasourceContent: '=hideDatasourceContent',
                    Headers: '=headers',
                    propHeader: '=propHeader',
                    RowHeaders: '=rowHeaders',
                    TableClasses: '=tableClasses', // Css classes affecting the all table
                    HeaderClasses: '=headerClasses', // css classes affecting headers

                    AreRowHeadersVisible: '=areRowHeadersVisible',

                    FilterCell: '=filterCell', //TODO : implémenter l'ajout de filtres personnalisés.

                    LimitColumns: '=limitColumns',
                    LimitRows: '=limitRows',

                    selectionType: '=selectionType',
                    onSelectedItemChanged: '&'
                },

                controller: ['$scope', function ($scope) {
                    var ctrl = this;
                    var location = { x: "", y: "" };
                    ctrl.viewsData = [];   // Represents data displayed on the planning (example : entries)

                    // Allows a requiring directive to add itself to this item
                    ctrl.addViewData = function (viewData) {
                        viewsData.push(viewData);
                    };

                    
                    //////////////////////////////////////////////////////////
                    var usableSelectionType = ["Cell", "Row"];
                    // Using functions to return either the content of a row,
                    // either the content of a cell, depending on the chosen property.
                    // Default Mode : cell
                    if (!$scope.selectionType)
                        $scope.selectionType = "Cell";
                    else if (!usableSelectionType.find($scope.selectionType))
                    {
                        console.log($scope.selectionType + " n'est pas un système de sélection valide.")
                        $scope.selectionType = "Cell";
                    }
                    ////////////////////////////////////////////////////////////////////

                    if (!$scope.Headers && $scope.Datasource) {
                        $scope.Headers = [];
                        for (var i = 0; i < $scope.Datasource.length; i++) {
                            if ($scope.Datasource[i]) {
                                // Should retrieve properties of an object
                                angular.forEach($scope.Datasource[i], function (value, key) {
                                    $scope.Headers[i] = value;
                                })
                                break;
                            }
                        }
                    }

                    // Selection function
                    $scope.selectContent = function (keyLine, keyCol) {
                        if ($scope.selectionType == "Row" && keyLine) {
                            delete $scope.Datasource[location.x]["selected"];
                            $scope.SelectedItem = $scope.Datasource[keyLine];
                            $scope.Datasource[keyLine]["selected"] = true;
                            location.x = keyLine;
                        }

                        else if ($scope.selectionType == "Cell" && keyCol) {
                            delete $scope.Datasource[location.x][location.y]["selected"];
                            $scope.SelectedItem = $scope.Datasource[keyLine];
                            $scope.Datasource[keyLine][keyCol]["selected"] = true;
                            $scope.SelectedItem = $scope.Datasource[keyLine][keyCol];
                            location.x = keyLine;
                            location.y = keyCol;
                        }
                        
                        if ($scope.onSelectedItemChanged) {
                            $scope.onSelectedItemChanged({ item: $scope.SelectedItem });
                        }
                        
                    }



                }]
            }
    }]);

})(window.angular);





