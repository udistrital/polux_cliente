'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:FormatoVerCtrl
 * @description
 * # FormatoVerCtrl
 * Controller of the poluxClienteApp
 * Controlador que permite ver un formato de evaluación de una carrera. Como la dinámica de formatos
 * de evaluación no se utiliza en el sistema este controlador tampoco es utilizado.
 * @requires services/poluxService.service:poluxRequest
 * @requires $scope
 */
angular.module('poluxClienteApp')
  .controller('FormatoVerCtrl', function(poluxRequest, $scope) {
    var ctrl = this;
    ctrl.request = poluxRequest;
    ctrl.formatos = [];
    ctrl.get_all_format = function() {
      poluxRequest.get("formato", $.param({
        limit: "0"
      })).then(function(response) {
        ctrl.formatos = response.data;
        console.log(ctrl.formatos);
      });
    };
    ctrl.get_all_format();
  });
