'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:nuxeo/subirArchivo
 * @description
 * # nuxeo/subirArchivo
 */
angular.module('poluxClienteApp')
  .directive('nuxeo/subirArchivo', function () {
    return {
      restrict: 'E',
      /*scope:{
          var:'='
        },
      */
      templateUrl: 'add-view.html',
      controller:function(){
        var ctrl = this;
      },
      controllerAs:'d_nuxeo/subirArchivo'
    };
  });
