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
      ctrl.areas = [];
      ctrl.siModalidad = false;
      ctrl.modalidad_select = false;
      ctrl.detallesCargados = false;
      ctrl.soliciudConDetalles = true;
      ctrl.conEstudiante = false;
      ctrl.codigo = $routeParams.idEstudiante;

            var parametrosTrabajoEstudiante = $.param({
                query:"CodigoEstudiante:"+ctrl.codigo,
            });
            poluxRequest.get("estudiante_trabajo_grado",parametrosTrabajoEstudiante).then(function(responseTrabajoEstudiante){

                    if(responseTrabajoEstudiante.data != null){
                      ctrl.codigo = responseTrabajoEstudiante.data[0].CodigoEstudiante;
                      ctrl.modalidad = responseTrabajoEstudiante.data[0].TrabajoGrado.Modalidad.Id;
                      ctrl.siModalidad = true;
                      ctrl.modalidad_select = true;
                      ctrl.cargarTipoSolicitud(ctrl.modalidad);
                    }else{
                      poluxRequest.get("modalidad").then(function (responseModalidad){
                          ctrl.modalidades=responseModalidad.data;
                      });
                    }
                    ctrl.obtenerDatosEstudiante();
                    ctrl.obtenerAreas();
          });


        ctrl.obtenerAreas = function (){
            poluxRequest.get("area_conocimiento").then(function(responseAreas){
                ctrl.areas = responseAreas.data;
                  console.log(ctrl.areas);
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
            angular.forEach(ctrl.detalles, function(detalle){
                detalle.respuesta= "";
                detalle.opciones = [];
                //SE evalua si el detalle necesita cargar datos
                if(detalle.Detalle.Descripcion!=='no_service' && detalle.Detalle.TipoDetalle.Id!==8){
                    //Se separa el strig
                    var parametrosConsulta = detalle.Detalle.Descripcion.split(";");
                    //servicio de academiac
                    if(parametrosConsulta[0]==="academica"){
                        if(parametrosConsulta[1]==="docente"){
                              /*academicaRequest.obtenerDocentesJson().then(function(respuestaDocentes){
                                  detalle.opciones= respuestaDocentes.data;
                              });*/
                              detalle.opciones=academicaRequest.obtenerDocentesJson();
                              console.log(detalle.opciones);
                        }
                    }
                };
            });
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
                if(detalle.Detalle.TipoDetalle.Descripcion!=="no_service"){
                    console.log("No consume servicios")
                };
            });
            //cargar directiva para areas de conocimiento, modificar directiva, y enviar respuesta al controlador
            //cargar resultados de directivas en un json stringify
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
                ctrl.conEstudiante=true;
                ctrl.estudiante.asignaturas_elegidas = [];
                ctrl.estudiante.areas_elegidas= [];
              });
            }
          });
        });
      }

      ctrl.imprimir = function (valor){
        console.log(valor);
      };

  });
