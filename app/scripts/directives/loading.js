'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:loading
 * @description
 * # loading
 * Directiva que se muestra mientras se carga una petición
 * Controlador: {@link poluxClienteApp.directive:loading.controller:loadingCtl loadingCtl}
 * @param {boolean} load Flag que permite identificar cuando deja de mostrarse la animación
 * @param {number} tam Tamaño de la imagen de cargando
 * @param {string} message Mensaje que se muestra bajo la animación
 */
angular.module('poluxClienteApp')
  .directive('loading', function () {
    return {
      restrict: 'E',
      scope: {
        load: '=',
        tam: '=?',
        message: '=?'
      },
      template: '<div class="loading" ng-show="load">' +
        '<i class="fa fa-clock-o fa-spin fa-{{tam}}x faa-burst animated  text-info" aria-hidden="true" ></i>' +
        //'<br> </br>'+
        '</div>' +
        '<div ng-show="load">' +
        '<label class="col-sm-12 control-label" style="text-align: center;"> {{loadMessage}}</label>' +
        '</div>'
      ,
      /**
       * @ngdoc controller
       * @name poluxClienteApp.directive:loading.controller:loadingCtl
       * @description
       * # MateriasPosgradoFormalizarSolicitudCtrl
       * # Controller of the poluxClienteApp.directive:loading
       * Controlador de la directiva loading
       * @requires $scope
       */
      controller: function ($scope) {
        /**
         * @ngdoc method
         * @name mostrar
         * @methodOf poluxClienteApp.directive:loading.controller:loadingCtl
         * @description 
         * Muestra o oculta la animación con la bandera load
         */
        $scope.loadMessage = "";
        if ($scope.tam === undefined) {
          $scope.tam = 5;
        }
        if ($scope.message !== undefined) {
          $scope.loadMessage = $scope.message;
        }
      }
    };
  });
