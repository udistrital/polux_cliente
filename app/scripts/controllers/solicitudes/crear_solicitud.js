'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
 * @descriptioni
 * # SolicitudesCrearSolicitudCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('SolicitudesCrearSolicitudCtrl', function (poluxRequest,$routeParams,academicaRequest) {
      var ctrl = this;
      ctrl.modalidades = [];
      ctrl.solicitudes = [];
      ctrl.detalles = [];
      ctrl.siModalidad = false;
      ctrl.modalidad_select = false;
      ctrl.detallesCargados = false;
      ctrl.soliciudConDetalles = true;

      ctrl.TrabajoEstudiante = $routeParams.TrabajoEstudiante;
        if(ctrl.TrabajoEstudiante === undefined){
          poluxRequest.get("modalidad").then(function (responseModalidad){
              ctrl.modalidades=responseModalidad.data;
          });
        }else{
            var parametrosTrabajoEstudiante = $.param({
                query:"Id:"+ctrl.TrabajoEstudiante,
            });
            poluxRequest.get("estudiante_trabajo_grado",parametrosTrabajoEstudiante).then(function(responseTrabajoEstudiante){
                    if(responseTrabajoEstudiante.data != null){
                      ctrl.codigo = responseTrabajoEstudiante.data[0].CodigoEstudiante;
                      ctrl.modalidad = responseTrabajoEstudiante.data[0].TrabajoGrado.Modalidad.Id;
                      ctrl.siModalidad = true;
                      ctrl.modalidad_select = true;
                      ctrl.cargarTipoSolicitud(ctrl.modalidad);
                      console.log(ctrl.codigo);
                      console.log(ctrl.modalidad);
                      ctrl.obtenerDatosEstudiante();
                    }else{
                      poluxRequest.get("modalidad").then(function (responseModalidad){
                          ctrl.modalidades=responseModalidad.data;
                      });
                    }
          });
      }




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
                detalle.opciones = [];
            });
            console.log(ctrl.detalles);
            ctrl.detallesCargados = true;
            if(ctrl.detalles == null){
                ctrl.soliciudConDetalles = false;
            }
        });
      };

      ctrl.obtenerDatosEstudiante = function(){
        academicaRequest.periodoAnterior().then(function(periodoAnterior){

          var parametros = {
            "codigo": ctrl.codigo,
            //periodo anterior
            'ano' : periodoAnterior[0].APE_ANO,
            'periodo' :periodoAnterior[0].APE_PER
          };

          academicaRequest.promedioEstudiante(parametros).then(function(response2){

            if(response2){
              //porcentaje cursado
              var parametros2 = {
                "codigo": parametros.codigo
              };

              academicaRequest.porcentajeCursado(parametros).then(function(response3){
                console.log(response3);

                ctrl.estudiante={
                  "Codigo": parametros.codigo,
                  "Nombre": response2[0].NOMBRE,
                  "Modalidad": 6,
                  "Tipo": "POSGRADO",
                  "PorcentajeCursado": response3,
                  "Promedio": response2[0].PROMEDIO,
                  "Rendimiento": "0"+response2[0].REG_RENDIMIENTO_AC,
                  "Estado": response2[0].EST_ESTADO_EST,
                  "Nivel": response2[0].TRA_NIVEL,
                  "TipoCarrera": response2[0].TRA_NOMBRE

                };

                console.log(ctrl.estudiante);
                ctrl.modalidad="MATERIAS POSGRADO";

              });
            }
          });
        });
      }

      ctrl.imprimir = function (valor){
        console.log(valor);
      };

  });
