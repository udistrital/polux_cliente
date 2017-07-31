'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
 * @descriptioni
 * # SolicitudesCrearSolicitudCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('SolicitudesCrearSolicitudCtrl', function (poluxRequest,$routeParams) {
      var ctrl = this;
      ctrl.modalidades = [];
      ctrl.solicitudes = [];
      ctrl.detalles = [];
      ctrl.siModalidad = false;
      ctrl.modalidad_select = false;
      ctrl.detallesCargados = false;
      ctrl.soliciudConDetalles = true;

      ctrl.modalidad = $routeParams.idModalidad;

      ctrl.cargarTipoSolicitud= function (modalidad) {
        ctrl.solicitudes = [];
        var parametrosTiposSolicitudes = $.param({
          query:"Modalidad:"+modalidad,
          limit:0
        });
        poluxRequest.get("modalidad_tipo_solicitud",parametrosTiposSolicitudes).then(function(responseTiposSolicitudes){
            ctrl.solicitudes = responseTiposSolicitudes.data;
            console.log(ctrl.solicitudes);
        });
      };

      if(ctrl.modalidad !== undefined){
          ctrl.siModalidad = true;
          ctrl.modalidad_select = true;
          ctrl.cargarTipoSolicitud(ctrl.modalidad);
      }else{
        poluxRequest.get("modalidad").then(function (responseModalidad){
            ctrl.modalidades=responseModalidad.data;
        });
      }

      ctrl.cargarInicial= function (tipoSolicitud, modalidad_seleccionada) {
        ctrl.soliciudConDetalles = true;
        ctrl.detalles = [];
        var parametrosInicial = $.param({
          query:"ModalidadTipoSolicitud.TipoSolicitud.Id:2,ModalidadTipoSolicitud.Modalidad.Id:"+modalidad_seleccionada,
          limit:0
        });
        poluxRequest.get("detalle_tipo_solicitud",parametrosInicial).then(function(responseInicial){
            ctrl.detalles = responseInicial.data;
            ctrl.detallesCargados = true;
            if(ctrl.detalles == null){
                ctrl.soliciudConDetalles = false;
            }
        });
      };

      ctrl.cargarDetalles= function (tipoSolicitud) {
        ctrl.soliciudConDetalles = true;
        ctrl.detalles = [];
        var parametrosDetalles = $.param({
          query:"ModalidadTipoSolicitud:"+tipoSolicitud,
          limit:0
        });
        poluxRequest.get("detalle_tipo_solicitud",parametrosDetalles).then(function(responseDetalles){
            ctrl.detalles = responseDetalles.data;
            angular.forEach(ctrl.detalles, function(detalle){
                detalle.respuesta= "";
            });
            console.log(ctrl.detalles);
            ctrl.detallesCargados = true;
            if(ctrl.detalles == null){
                ctrl.soliciudConDetalles = false;
            }
        });
      };

      ctrl.imprimir = function (valor){
        console.log(valor);
      };

  });
