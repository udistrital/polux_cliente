'use strict';

/**
 * @ngdoc directive
 * @name poluxApp.directive:crearArea
 * @description
 * # crearArea
 */
angular.module('poluxApp')
  .directive('crearArea', function () {
    return {
      templateUrl: 'views/directives/crear-area.html',
      scope: {
        areasc: '=',
        newarea:'='
      },
      restrict: 'E',
      controller: function() {
        //var self=this;


      },
      controllerAs: "crear"
    };
  });
