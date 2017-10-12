'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:loading
 * @description
 * # loading: Directiva que se muestra mientras se carga una petición
 */
angular.module('poluxClienteApp')
.directive('loading', function () {
    return {
      restrict: 'E',
      scope:{
          load:'=',
          tam:'=?'
        },
      template: '<div class="loading" ng-show="load">' +
                   '<i class="fa fa-clock-o fa-spin fa-{{tam}}x faa-burst animated  text-info" aria-hidden="true" ></i>' +
                   '</div>',
      controller:function($scope){
        if ($scope.tam===undefined) {
          $scope.tam=5;
        }
      }
    };
  });
