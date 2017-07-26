'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
 * @descriptioni
 * # SolicitudesCrearSolicitudCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('SolicitudesCrearSolicitudCtrl', function (poluxRequest) {
      var ctrl = this;
      ctrl.modalidades = [];
      ctrl.solicitudes = [];
      ctrl.siModalidad = false;
      ctrl.modalidad_select = false;

      poluxRequest.get("modalidad").then(function(response){
          ctrl.modalidades = response.data;
      });

      ctrl.cargarTipoSolicitud= function (modalidad_seleccionada) {
        ctrl.solicitudes = [];
        var parametros = $.param({
          query:"modalidad:"+modalidad_seleccionada,
          limit:0
        });
        poluxRequest.get("modalidad_tipo_solicitud",parametros).then(function(response){
            ctrl.solicitudes = response.data;
            console.log(response.data);
        });
        ctrl.modalidad_select = true;
      };

  });
