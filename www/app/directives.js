'use strict';

var myApp = angular.module('myApp.directives', []);

myApp.directive('fhfooter', function() {
    return {
        scope: {},
        restrict: 'E',
        replace: true,
        templateUrl: 'views/components/footer.html',
        link: function(scope, elem, attrs, ctrl) {
            scope.version = attrs.version;
        }
    };
});