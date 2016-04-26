'use strict';

var mrbsFilters = angular.module('mrbsFilters');

mrbsFilters.filter('inArray', function () {
    return function (array, value) {
        return array.indexOf(value) !== -1;
    };
});