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
          tam:'=?',
          message:'=?'
        },
      template: '<div class="loading" ng-show="load">' +
                   '<i class="fa fa-clock-o fa-spin fa-{{tam}}x faa-burst animated  text-info" aria-hidden="true" ></i>' +
                   //'<br> </br>'+
                '</div>'+
                '<div ng-show="load">' +
                    '<label class="col-sm-12 control-label" style="text-align: center;"> {{loadMessage}}</label>'+
                '</div>'
                ,
      controller:function($scope){
        console.log($scope.message);
        $scope.loadMessage = "";
        if ($scope.tam===undefined) {
          $scope.tam=5;
        }
        if ($scope.message!==undefined) {
          $scope.loadMessage = $scope.message;
        }
      }
    };
  });
