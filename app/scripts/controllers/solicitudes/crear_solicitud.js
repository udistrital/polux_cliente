'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
 * @descriptioni
 * # SolicitudesCrearSolicitudCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('SolicitudesCrearSolicitudCtrl', function (poluxRequest,$routeParams,academicaRequest,cidcRequest) {
      var ctrl = this;
      ctrl.modalidades = [];
      ctrl.solicitudes = [];
      ctrl.detalles = [];
      ctrl.areas = [];
      ctrl.espaciosElegidos = [];
      ctrl.siModalidad = false;
      ctrl.modalidad_select = false;
      ctrl.detallesCargados = false;
      ctrl.soliciudConDetalles = true;
      ctrl.conEstudiante = false;
      ctrl.estudiantes = [];
      ctrl.codigo = $routeParams.idEstudiante;
            ctrl.estudiantes.push(ctrl.codigo);
            var parametrosTrabajoEstudiante = $.param({
                query:"CodigoEstudiante:"+ctrl.codigo,
            });
            poluxRequest.get("estudiante_trabajo_grado",parametrosTrabajoEstudiante).then(function(responseTrabajoEstudiante){
                    ctrl.Trabajo = responseTrabajoEstudiante.data;
                    if(responseTrabajoEstudiante.data != null){
                      ctrl.codigo = responseTrabajoEstudiante.data[0].CodigoEstudiante;
                      ctrl.modalidad = responseTrabajoEstudiante.data[0].TrabajoGrado.Modalidad.Id;
                      ctrl.trabajo_grado = responseTrabajoEstudiante.data[0].TrabajoGrado.Id;
                      ctrl.siModalidad = true;
                      ctrl.modalidad_select = true;
                      ctrl.cargarTipoSolicitud(ctrl.modalidad);
                      var parametrosVinculacion = $.param({
                          query:"TrabajoGrado:"+ctrl.trabajo_grado,
                          limit:0
                      });
                      poluxRequest.get("vinculacion_trabajo_grado",parametrosVinculacion).then(function(responseVinculacion){
                            ctrl.Trabajo.evaluadores = [];
                            console.log(responseVinculacion.data);
                          angular.forEach(responseVinculacion.data, function(vinculado){
                              if(vinculado.RolTrabajoGrado.Id==1){
                                  ctrl.Trabajo.directorInterno = vinculado;
                              }
                              if(vinculado.RolTrabajoGrado.Id==2){
                                  ctrl.Trabajo.directorExterno = vinculado;
                              }
                              if(vinculado.RolTrabajoGrado.Id==3){
                                  ctrl.Trabajo.evaluadores.push(vinculado);
                              }
                          });
                          console.log(ctrl.Trabajo.directorInterno);
                          console.log(ctrl.Trabajo.directorExterno);
                          console.log(ctrl.Trabajo.evaluadores);
                      });
                      if(ctrl.modalidad == 2 || ctrl.modalidad==3){
                        var parametrosEspacios = $.param({
                          query:"trabajo_grado:"+ctrl.trabajo_grado,
                          limit:0
                        });
                        poluxRequest.get("espacio_academico_inscrito",parametrosEspacios).then(function (responseEspacios){
                            angular.forEach(responseEspacios.data, function(espacio){
                                ctrl.espaciosElegidos.push(espacio.EspaciosAcademicosElegibles);
                            });
                            ctrl.carreraElegida = responseEspacios.data[0].EspaciosAcademicosElegibles.CarreraElegible.Id;
                        });
                      }
                    }else{
                      poluxRequest.get("modalidad").then(function (responseModalidad){
                          ctrl.modalidades=responseModalidad.data;
                      });
                    }
                  //  ctrl.obtenerDatosEstudiante();
                    ctrl.obtenerAreas();
                    ctrl.conEstudiante= true;
          });


        ctrl.obtenerAreas = function (){
            poluxRequest.get("area_conocimiento").then(function(responseAreas){
                ctrl.areas = responseAreas.data;
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
        });
      };


      ctrl.cargarDetalles= function (tipoSolicitud, modalidad_seleccionada) {
        ctrl.soliciudConDetalles = true;
        ctrl.detalles = [];
        var parametrosDetalles;
        if(modalidad_seleccionada===undefined){
          parametrosDetalles = $.param({
            query:"ModalidadTipoSolicitud:"+tipoSolicitud,
            limit:0
          });
      }else{
          parametrosDetalles = $.param({
            query:"ModalidadTipoSolicitud.TipoSolicitud.Id:2,ModalidadTipoSolicitud.Modalidad.Id:"+modalidad_seleccionada,
            limit:0
          });
      }
        poluxRequest.get("detalle_tipo_solicitud",parametrosDetalles).then(function(responseDetalles){
            ctrl.detalles = responseDetalles.data;
            console.log(ctrl.detalles);
            angular.forEach(ctrl.detalles, function(detalle){
              detalle.respuesta= "";
              detalle.opciones = [];
              //SE evalua si el detalle necesita cargar datos
              if(detalle.Detalle.Descripcion!=='no_service' && detalle.Detalle.TipoDetalle.Id!==8){
                  //Se separa el strig
                  var parametrosServicio = detalle.Detalle.Descripcion.split(";");
                  var sql  = "";
                  var parametrosConsulta = [];
                  //servicio de academiaca
                  if(parametrosServicio[0]==="polux"){
                      var parametros= $.param({
                        limit:0
                      });
                      if(parametrosServicio[2]!==undefined){
                          parametrosConsulta = parametrosServicio[2].split(",");
                          angular.forEach(parametrosConsulta, function(parametro){
                              if(!parametro.includes(":")){
                                if(parametro == "trabajo_grado"){
                                  parametro = parametro+":"+ctrl.trabajo_grado;
                                }
                                if(parametro == "carrera_elegible"){
                                  parametro = parametro+":"+ctrl.carreraElegida;
                                }
                              }
                              if(sql === ""){
                                  sql=parametro;
                              }else{
                                  sql=sql+","+parametro;
                              }
                          });
                          detalle.parametros= $.param({
                            query:sql,
                            limit:0
                          });
                      }
                      poluxRequest.get(parametrosServicio[1], detalle.parametros).then(function(responseOpciones){
                          if (detalle.Detalle.Nombre.includes("Nombre anterior de la propuesta")) {
                              detalle.opciones.push({
                                "Nombre":responseOpciones.data[0].Documento.Titulo
                              });
                          }else if(detalle.Detalle.Nombre.includes("Anterior resumen de la propuesta")){
                            detalle.opciones.push({
                              "Nombre":responseOpciones.data[0].Documento.Resumen
                            });
                          }else if(detalle.Detalle.Nombre.includes("Anteriores areas de conocimiento")){
                            var areasString = "";
                            angular.forEach(responseOpciones.data,function(area){
                                areasString = areasString +", " + area.AreaConocimiento.Nombre;
                            });
                            detalle.opciones.push({
                              "Nombre":areasString.substring(2)
                            });
                          }else if(detalle.Detalle.Nombre.includes("Nombre Empresa")){
                            angular.forEach(responseOpciones.data,function(empresa){
                              detalle.opciones.push({
                                "Nombre":empresa.Identificacion
                              });
                            });
                          }else if(detalle.Detalle.Nombre.includes("Espacio Academico Anterior")){
                            angular.forEach(responseOpciones.data,function(espacio){
                              detalle.opciones.push({
                                "Nombre":espacio.EspaciosAcademicosElegibles.CodigoAsignatura
                              });
                            });
                          }else if(detalle.Detalle.Nombre.includes("Espacio Academico Nuevo")){
                            angular.forEach(responseOpciones.data,function(espacio){
                              var esta = false;
                              angular.forEach(ctrl.espaciosElegidos, function(asignatura){
                                  if(espacio.CodigoAsignatura==asignatura.CodigoAsignatura){
                                      esta = true;
                                  }
                              });
                              if(!esta){
                                detalle.opciones.push({
                                  "Nombre":espacio.CodigoAsignatura
                                });
                              }
                            });
                          }else{
                              detalle.opciones = responseOpciones.data;
                          }
                      });
                  }
                  if(parametrosServicio[0]==="academica"){
                      if(parametrosServicio[1]==="docente"){
                            detalle.opciones=academicaRequest.obtenerDocentesJson();
                      }
                  }
                  if(parametrosServicio[0]==="cidc"){
                      if(parametrosServicio[1]==="estructura_investigacion"){
                            detalle.opciones = cidcRequest.obtenerEntidades();
                      }
                      if(parametrosServicio[1]==="docentes"){
                            detalle.opciones = cidcRequest.obtenerDoncentes();
                      }
                  }
                  if(parametrosServicio[0]==="estatico"){
                      parametrosConsulta = parametrosServicio[2].split(",");
                      angular.forEach(parametrosConsulta, function(opcion){
                        detalle.opciones.push({
                          "Nombre":opcion
                        });
                      });
                  }

              };
            });
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
