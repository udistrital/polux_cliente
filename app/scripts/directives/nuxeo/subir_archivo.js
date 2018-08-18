'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:subirArchivo
 * @description
 * # subirArchivo
 * Directiva que permite subir un archivo a nuxeo.
 * Actualmente no se utilzia.
 * Controlador: {@link poluxClienteApp.directive:subirArchivo.controller:subirArchivoCtrl subirArchivoCtrl}
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
      /**
       * @ngdoc controller
       * @name poluxClienteApp.directive:subirArchivo.controller:subirArchivoCtrl
       * @description
       * # subirArchivoCtrl
       * # Controller of the poluxClienteApp.directive:subirArchivo
       * Controlador de la directiva {@link poluxClienteApp.directive:subirArchivo subirArchivo}.
       * Actualmente no se utiliza.
       * @requires services/poluxClienteApp.service:nuxeoService
       */
      controller: function () {
      },
      controllerAs: 'd_nuxeo/subirArchivo'
    };
  });
