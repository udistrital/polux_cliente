'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:listarSolicitudes
 * @description
 * # listarSolicitudes
 * Directiva que permite ver las solicitudes asociadas a un trabajo de grado
 * Controller: {@link poluxClienteApp.directive:listarSolicitudes.controller:listarSolicitudesCtrl listarSolicitudesCtrl}
 * @param {Object} tg Objeto que contiene el trabajo de grado que se consultará
  */
angular.module('poluxClienteApp')
  .directive('listarSolicitudes', function () {
    return {
      restrict: 'E',
      scope:{
        tg:'='
      },
      templateUrl: 'views/directives/solicitudes/listar_solicitudes.html',
      /**
       * @ngdoc controller
       * @name poluxClienteApp.directive:listarSolicitudes.controller:listarSolicitudesCtrl
       * @description
       * # poluxClienteApp.directive:listarSolicitudes.controller:listarSolicitudesCtrl
       * # Controller of poluxClienteApp.directive:listarSolicitudes
       * Controlador de la directiva {@link poluxClienteApp.directive:listarSolicitudes  listarSolicitudes} que permite ver las solicitudes asociadas a un trabajo de grado
       * @requires decorators/poluxClienteApp.decorator:TextTranslate
       * @requires services/poluxService.service:poluxRequest
       * @requires $scope
       * @requires services/poluxService.service:nuxeoClient
       * @property {Object} trabajoGrado Trabajo de grado del qeu se consultarán los documentos
       * @property {Object} gridOptions Grid Options de la grilla de solicitudes
       * @property {Boolean} loadingSolicitudes Booleano para indicar que se estan consultando las versiones de los documentos
       * @property {Boolean} errorCargando Booleano para indicar que hubo un error cargando los parametros
       * @property {String} mensajeError Mensaje que se muestra cuando ocurre un error cargando
       * @property {String} mensajeCargando Mensaje que se muestra cuando esta cargando
       */
      controller:function($scope,$translate,poluxRequest,$q,academicaRequest,nuxeoClient){
        var ctrl = this;
        ctrl.trabajoGrado = $scope.tg;

        $scope.botones = [
          { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER_DETALLES'), operacion: 'ver', estado: true },
        ];

        ctrl.gridOptions = {
            paginationPageSizes: [5,10,15, 20, 25],
            paginationPageSize: 10,
            enableFiltering: true,
            enableSorting: true,
            enableSelectAll: false,
            useExternalPagination: false,
        };

        ctrl.gridOptions.columnDefs = [{
          name: 'data.Id',
          displayName: $translate.instant('NUMERO_RADICADO'),
          width:'15%',
        },{
          name: 'data.ModalidadTipoSolicitud',
          displayName: $translate.instant('TIPO_SOLICITUD'),
          width:'40%',
        },{
          name: 'data.Estado',
          displayName: $translate.instant('ESTADO_SOLICITUD'),
          width: '15%',
        }, {
          name: 'data.Fecha',
          displayName: $translate.instant('FECHA'),
          width: '15%',
        }, {
          name: 'Detalle',
          displayName: $translate.instant('DETALLE'),
          width:'15%',
          type: 'boolean',
          cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>'
        }];

        /**
         * @ngdoc method
         * @name consultarSolicitudes
         * @methodOf poluxClienteApp.directive:listarSolicitudes.controller:listarSolicitudesCtrl
         * @description 
         * Permite cargar las solicitudes asociadas a un documenti
         * @param {Object} trabajoGrado trabajo de grado del que se consultan los documentos
         * @returns {undefined} no retorna ningún valor
         */
        ctrl.consultarSolicitudes = function(trabajoGrado){
          ctrl.loadingSolicitudes = true;
          ctrl.mensajeCargando = $translate.instant("LOADING.CARGANDO_SOLICITUDES");
          var parametrosSolicitudes = $.param({
            limit: 0,
            query:"TrabajoGrado:"+trabajoGrado.Id,
          });
          poluxRequest
            .get("solicitud_trabajo_grado",parametrosSolicitudes)
            .then(function(responseSolicitudes){
             if(responseSolicitudes.data) {

              //Funcion para traer la respuesta de la solicitud
              var getDataSolicitud = function(solicitud){
                var defer = $q.defer();
                solicitud.data = {
                  'Id':solicitud.Id,
                  'Modalidad':solicitud.ModalidadTipoSolicitud.Modalidad.Nombre,
                  'ModalidadTipoSolicitud':solicitud.ModalidadTipoSolicitud.TipoSolicitud.Nombre,
                  'Fecha': solicitud.Fecha.toString().substring(0, 10),
                }
                var parametrosRespuesta=$.param({
                  query:"ACTIVO:TRUE,SolicitudTrabajoGrado:"+solicitud.Id,
                });
                poluxRequest.get("respuesta_solicitud",parametrosRespuesta).then(function(responseRespuesta){
                    solicitud.data.Estado = responseRespuesta.data[0].EstadoSolicitud.Nombre;
                    solicitud.data.Respuesta = responseRespuesta.data[0];
                    //solicitud.data.Respuesta.Resultado = ctrl.mostrarResultado(responseRespuesta.data[0]);
                    ctrl.gridOptions.data = ctrl.solicitudes;
                    defer.resolve();
                })
                .catch(function(error){
                  console.log(error);
                  defer.reject(error);
                })
                return defer.promise;
              }

              trabajoGrado.Solicitudes = responseSolicitudes.data;
              var promises = [];
              angular.forEach(trabajoGrado.Solicitudes, function(solicitud){
                promises.push(getDataSolicitud(solicitud));
              });
              $q.all(promises).then(function(){
                  ctrl.gridOptions.data = trabajoGrado.Solicitudes ;
                  console.log(trabajoGrado.Solicitudes )
                  ctrl.loadingSolicitudes = false;
              })
              .catch(function(error){
                  console.log(error);
                  ctrl.mensajeError = $translate.instant("ERROR.CARGAR_DATOS_SOLICITUDES");
                  ctrl.errorCargando = true;
                  ctrl.loadingSolicitudes = false;
              });

             } else {
              console.log("Sin solicitudes");
              ctrl.mensajeError = $translate.instant("ERROR.SIN_SOLICITUDES");
              ctrl.errorCargando = true;
              ctrl.loadingSolicitudes = false;
             }
            })
            .catch(function(error){
              console.log(error);
              ctrl.mensajeError = $translate.instant("ERROR.CARGAR_DATOS_SOLICITUDES");
              ctrl.errorCargando = true;
              ctrl.loadingSolicitudes = false;
          });
        }

        /**
         * @ngdoc method
         * @name mostrarResultado
         * @methodOf poluxClienteApp.directive:listarSolicitudes.controller:listarSolicitudesCtrl
         * @description 
         * Función que muestra el resultado de la solicitud, esta función muestra lo sucedido con la solicitud cuando fue aprobada o rechazada, y realiza una pequeña descripción de lo que 
         * sucedio, por ejemplo en el casos de cambio de materias muestra el nombre de la materia que se cancelo y el nombre de la que se registro, en el caso de las iniciales muestra siel estudiante
         * puede o no cursar la modalidad solicitada, etc.
         * @param {object} solicitud Solicitud que se consulta
         * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplio la petición y se resuleve con el string resultado
         */
        ctrl.mostrarResultado = function(solicitud){
          var defer = $q.defer();
          var promise = defer.promise;
          var detalles = solicitud.detallesSolicitud;
          console.log("solicitud",solicitud);
          var estadoSolicitud = solicitud.data.Respuesta.EstadoSolicitud.Id;
          var resultado = $translate.instant('SOLICITUD_SIN_RESPUESTA');
          var nuevo = "";
          var anterior = "";
          if(estadoSolicitud === 2){
            resultado = $translate.instant('SOLICITUD_RECHAZADA');
            solicitud.resultado = resultado;
            defer.resolve(resultado);
          } else if(estadoSolicitud === 3){
            resultado = $translate.instant('SOLICITUD_ES_APROBADA');
            switch(solicitud.ModalidadTipoSolicitud.TipoSolicitud.Id){
              //solicitud inicial
              case 2:
                resultado += ". " + $translate.instant('APROBADO.CURSAR_MODALIDAD') + solicitud.data.Modalidad;
                solicitud.resultado = resultado;
                defer.resolve(resultado);
                break;
              //solicitud de cancelación de modalidad
              case 3:
                resultado += ". " + $translate.instant('APROBADO.CANCELAR_MODALIDAD') + solicitud.data.Modalidad;
                solicitud.resultado = resultado;
                defer.resolve(resultado);
                break;
              //solicitud de cambio de director interno
              case 4:
                resultado += ". " + $translate.instant('APROBADO.DIRECTOR_INTERNO');
                solicitud.resultado = resultado;
                defer.resolve(resultado)
                break;
              //solicitud de cambio de director externo
              case 5:
                resultado += ". " + $translate.instant('APROBADO.DIRECTOR_EXTERNO');
                solicitud.resultado = resultado;
                defer.resolve(resultado);
                break;
              // solicitud de socialización
              case 6:
                resultado += ". " + $translate.instant('APROBADO.SOCIALIZACION');
                solicitud.resultado = resultado;
                defer.resolve(resultado);
                break;
              //solicitud de prorroga
              case 7:
                resultado += ". " + $translate.instant('APROBADO.PRORROGA');
                solicitud.resultado = resultado;
                defer.resolve(resultado);
                break;
              //Solicitud de cambio de nombre de trabajo de grado
              case 8:
                angular.forEach(detalles, function(detalle){
                  var id = detalle.DetalleTipoSolicitud.Detalle.Id;
                  if(id===26){
                    nuevo = detalle.Descripcion;
                  }
                  if(id===25){
                    anterior = detalle.Descripcion;
                  }
                });
                resultado += ". " + $translate.instant('APROBADO.CAMBIAR_NOMBRE',{nuevo:nuevo,anterior:anterior});
                solicitud.resultado = resultado;
                defer.resolve(resultado);
                break;
              //Solicitd de camibio de materias
              case 9:
                angular.forEach(detalles, function(detalle){
                  var id = detalle.DetalleTipoSolicitud.Detalle.Id;
                  if (id===23) {
                    anterior = detalle.Descripcion.split("-")[1];
                  }
                  if (id===24) {
                    nuevo = detalle.Descripcion.split("-")[1];
                  }
                });
                resultado += ". " + $translate.instant('APROBADO.CAMBIAR_MATERIA',{nuevo:nuevo,anterior:anterior});
                solicitud.resultado = resultado;
                defer.resolve(resultado);
                break;
              //solicitud de cambio de director interno
              case 10:
                resultado += ". " + $translate.instant('APROBADO.EVALUADOR');
                solicitud.resultado = resultado;
                defer.resolve(resultado);
                break;
              //Solicitud de cambio de codirector
              case 12:
                resultado += ". " + $translate.instant('APROBADO.CODIRECTOR');
                solicitud.resultado = resultado;
                defer.resolve(resultado);
                break;
              // solicitud de revisión
              case 13:
                resultado += ". " + $translate.instant('APROBADO.REVISION');
                solicitud.resultado = resultado;
                defer.resolve(resultado);
                break;
              //default
              default:
                solicitud.resultado = resultado;
                defer.resolve(resultado);
                break;
            }

          } else if (estadoSolicitud === 5) {
            resultado = $translate.instant('SOLICITUD_OPCIONADA_SEGUNDA_CONVOCATORIA');
            solicitud.resultado = resultado;
            defer.resolve(resultado);
          } else if(estadoSolicitud === 6) {
            resultado = $translate.instant('SOLICITUD_RECHAZADA_CUPOS_INSUFICIENTES');
            solicitud.resultado = resultado;
            defer.resolve(resultado);
          } else if(estadoSolicitud === 7) {
            resultado = $translate.instant("SOLICITUD_APROBADA_EXENTA");
            solicitud.resultado = resultado;
            defer.resolve(resultado);
          } else if (estadoSolicitud === 8) {
            resultado = $translate.instant("SOLICITUD_RECHAZADA_CUPOS_INSUFICIENTES");
            solicitud.resultado = resultado;
            defer.resolve(resultado);
          } else if (estadoSolicitud === 9) {
            resultado = $translate.instant("SOLICITUD_FORMALIZADA_EXENTA_PAGO");
            solicitud.resultado = resultado;
            defer.resolve(resultado);
          } else if (estadoSolicitud === 10) {
            resultado = $translate.instant("SOLICITUD_FORMALIZADA_NO_EXENTA_PAGO");
            solicitud.resultado = resultado;
            defer.resolve(resultado);
          } else if (estadoSolicitud === 11) {
            resultado = $translate.instant("SOLICITUD_NO_FORMALIZADA");
            solicitud.resultado = resultado;
            defer.resolve(resultado);
          } else if (estadoSolicitud === 12) {
            resultado = $translate.instant("SOLICITUD_OFICIALIZADA");
            solicitud.resultado = resultado;
            defer.resolve(resultado);
          } else if (estadoSolicitud === 13) {
            resultado = $translate.instant("SOLICITUD_NO_OFICIALIZADA");
            solicitud.resultado = resultado;
            defer.resolve(resultado);
          } else if (estadoSolicitud === 14) {
            resultado = $translate.instant("SOLICITUD_CUMPLIDA_PARA_ESPACIOS_ACADEMICOS_POSGRADO");
            solicitud.resultado = resultado;
            defer.resolve(resultado);
          } else if (estadoSolicitud === 15) {
            resultado = $translate.instant("SOLICITUD_CARTA_APROBADA_PASANTIA");
            solicitud.resultado = resultado;
            defer.resolve(resultado);
          } else if (estadoSolicitud === 16) {
            resultado = $translate.instant("SOLICITUD_CARTA_RECHAZADA_PASANTIA");
            solicitud.resultado = resultado;
            defer.resolve(resultado);
          } else {
            solicitud.resultado = resultado;
            defer.resolve(resultado);
          }
          return promise;
        }

         /**
           * @ngdoc method
           * @name cargarDetalles
           * @methodOf poluxClienteApp.directive:listarSolicitudes.controller:listarSolicitudesCtrl
           * @description 
           * Función que se ejecuta cuando un usario desea ver los detalles especificos de una solicitud, se consulta los documentos con los que se aprobó o rechazó la solicitud,
           * y los detalles asociados a la solicitud del servicio {@link services/poluxService.service:poluxRequest poluxRequest}
           * {@link services/}
           * @param {object} fila Fila seleccionada en el uigrid que contiene los detalles de la solicitud que se quiere consultar
           * @returns {undefined} No retorna ningún valor
           */
          ctrl.cargarDetalles = function(fila){
            ctrl.solicitudSeleccionada = fila.entity;
            var parametrosSolicitud = $.param({
                query:"SolicitudTrabajoGrado.Id:"+ctrl.solicitudSeleccionada.Id,
                limit:0
            });

            var getDocumentoRespuesta = function(fila,solicitud){
              var defer = $q.defer();
              if(solicitud.data.Respuesta.EstadoSolicitud.Id!==1){
                var parametrosDocumentoSolicitud = $.param({
                  query:"SolicitudTrabajoGrado.Id:"+solicitud.Id,
                  limit:0
                });
                poluxRequest.get("documento_solicitud",parametrosDocumentoSolicitud).then(function(documento){
                  if(documento.data !== null){
                    solicitud.documento = documento.data[0].DocumentoEscrito;
                  }
                  defer.resolve();
                })
                .catch(function(error){
                  defer.reject(error);
                });
              }else{
                defer.resolve();
              }
              return defer.promise;
            }

            poluxRequest.get("detalle_solicitud",parametrosSolicitud).then(function(responseDetalles){
                poluxRequest.get("usuario_solicitud",parametrosSolicitud).then(function(responseEstudiantes){
                  if(responseDetalles.data===null){
                    ctrl.solicitudSeleccionada.detallesSolicitud = [];
                  }else{
                    ctrl.solicitudSeleccionada.detallesSolicitud = responseDetalles.data;
                  } 
                    var promises = [];
                    var solicitantes = "";
                    promises.push(ctrl.mostrarResultado(ctrl.solicitudSeleccionada));
                    angular.forEach(responseEstudiantes.data,function(estudiante){
                        solicitantes += (", "+estudiante.Usuario) ;
                    });

                    var getDocente = function(detalle){
                      var defer = $q.defer();
                      academicaRequest.get("docente_tg", [detalle.Descripcion]).then(function(docente){
                        if (!angular.isUndefined(docente.data.docenteTg.docente)) {
                          detalle.Descripcion = docente.data.docenteTg.docente[0].nombre;
                          defer.resolve();
                        }
                      })
                      .catch(function(error){
                        defer.reject(error);
                      });
                      return defer.promise;
                    }

                    var getDocentes = function(detalle){
                      var defer = $q.defer();
                      var promesasDocentes = [];
                      var detallesTemporales = [];
                      angular.forEach(detalle.Descripcion.split(","), function(docDocente){
                        var detalleTemp  = {
                          Descripcion : docDocente,
                        }
                        detallesTemporales.push(detalleTemp);
                        promesasDocentes.push(getDocente(detalleTemp));
                      })
                      $q.all(promesasDocentes)
                      .then(function(){
                        detalle.Descripcion = detallesTemporales.map(function(detalleTemp) {return detalleTemp.Descripcion}).join(", ");
                        defer.resolve();
                      })
                      .catch(function(error){
                        defer.reject(error);
                      });
                      return defer.promise;
                    }

                    var getExterno = function(detalle){
                      var defer = $q.defer();
                      var parametrosVinculado = $.param({
                        query:"TrabajoGrado:"+detalle.SolicitudTrabajoGrado.TrabajoGrado.Id,
                        limit:0
                      });
                      poluxRequest.get("detalle_pasantia",parametrosVinculado)
                      .then(function(dataExterno){
                        if(dataExterno.data != null){
                          var temp = dataExterno.data[0].Observaciones.split(" y dirigida por ");
                          temp = temp[1].split(" con número de identificacion ");
                          detalle.Descripcion = temp[0];
                          defer.resolve();
                        }else{
                          defer.reject("No hay datos relacionados al director externo");
                        }
                      })
                      .catch(function(error){
                        defer.reject(error);
                      });
                      return defer.promise;
                    }

                    angular.forEach(ctrl.solicitudSeleccionada.detallesSolicitud,function(detalle){
                          detalle.filas = [];
                          var id = detalle.DetalleTipoSolicitud.Detalle.Id;
                          if(id===49){
                            detalle.Descripcion = detalle.Descripcion.split("-")[1];
                          } else if( id === 9 || id === 14 || id===15 || id === 16 || id === 17 || id===48 || id === 37 || id === 56 || id === 57 || id === 58) {
                            if(detalle.Descripcion != "No solicita"){
                              promises.push(getDocente(detalle));
                            }
                          } else if (id == 61){
                            promises.push(getDocentes(detalle));
                          } else if(id == 39) {
                            //detalle de director externo anterior
                            promises.push(getExterno(detalle));
                          } else if(detalle.Descripcion.includes("JSON-")){
                              if(detalle.DetalleTipoSolicitud.Detalle.Id===8){
                                //areas de conocimiento
                                var datosAreas = detalle.Descripcion.split("-");
                                datosAreas.splice(0,1);
                                detalle.Descripcion = "";
                                angular.forEach(datosAreas, function(area){
                                    console.log(JSON.parse(area));
                                    detalle.Descripcion = detalle.Descripcion+", "+JSON.parse(area).Nombre;
                                });
                                detalle.Descripcion = detalle.Descripcion.substring(2);
                              }else if(detalle.DetalleTipoSolicitud.Detalle.Id===22){
                                //materias
                                var datosMaterias = detalle.Descripcion.split("-");
                                detalle.carrera = JSON.parse(datosMaterias[1]);
                                datosMaterias.splice(0, 2);
                                angular.forEach(datosMaterias, function(materia){
                                    detalle.filas.push(JSON.parse(materia));
                                });

                                detalle.gridOptions = [];
                                detalle.gridOptions.columnDefs = [{
                                  name: 'CodigoAsignatura',
                                  displayName: $translate.instant('CODIGO_MATERIA'),
                                  width:'30%',
                                },{
                                  name: 'Nombre',
                                  displayName: $translate.instant('NOMBRE'),
                                  width: '50%',
                                }, {
                                  name: 'Creditos',
                                  displayName: $translate.instant('CREDITOS'),
                                  width: '20%',
                                }];
                                detalle.gridOptions.data = detalle.filas;
                              }

                          }
                    });
                    ctrl.solicitudSeleccionada.solicitantes = solicitantes.substring(2)+".";
                    promises.push(getDocumentoRespuesta(fila,ctrl.solicitudSeleccionada));
                    $q.all(promises).then(function(){
                      $('#modalSolicitud').modal('show');
                    })
                    .catch(function(error){
                      console.log(error);
                      swal(
                        $translate.instant('ERROR'),
                        $translate.instant('ERROR.CARGAR_DETALLES_SOLICITUD'),
                        'warning'
                      );
                    });
                })
                .catch(function(error){
                  console.log(error);
                  swal(
                    $translate.instant('ERROR'),
                    $translate.instant('ERROR.CARGAR_DATOS_ESTUDIANTES'),
                    'warning'
                  );
                });
            })
            .catch(function(error){
              console.log(error);
              swal(
                $translate.instant('ERROR'),
                $translate.instant('ERROR.CARGAR_DETALLES_SOLICITUD'),
                'warning'
              );
            });
        }

        /**
         * @ngdoc method
         * @name getDocumento
         * @methodOf poluxClienteApp.directive:listarSolicitudes.controller:listarSolicitudesCtrl
         * @description 
         * Permite ver un documento que sea versión de un trabajo de grado
         * @param {String} uid Uid del documento que se va a descargar
         * @returns {undefined} No hace retorno de resultados
         */
        ctrl.getDocumento = function(uid) {
          if (uid) {
            ctrl.loadingDocument = true;
            nuxeoClient.getDocument(uid)
              .then(function(documento) {
                ctrl.loadingDocument = false;
                window.open(documento.url);
              })
              .catch(function(error) {
                console.log("error", error);
                ctrl.loadingVersion = false;
                swal(
                  $translate.instant("ERROR"),
                  $translate.instant("ERROR.CARGAR_DOCUMENTO"),
                  'warning'
                );
              });
          }
        }

        /**
         * @ngdoc method
         * @name loadrow
         * @methodOf poluxClienteApp.directive:listarSolicitudes.controller:listarSolicitudesCtrl
         * @description 
         * Ejecuta las funciones especificas de los botones seleccionados en el ui-grid
         * @param {object} row Fila seleccionada en el uigrid que contiene los detalles de la solicitud que se quiere consultar
         * @param {string} operacion Operación que se debe ejecutar cuando se selecciona el botón
         * @returns {undefined} No retorna ningún valor
         */
        $scope.loadrow = function(row, operacion) {
          switch (operacion) {
              case "ver":
                  ctrl.cargarDetalles(row)
                  //$('#modalVerSolicitud').modal('show');
                  break;
              default:
                  break;
          }
        };

        ctrl.consultarSolicitudes(ctrl.trabajoGrado);

      },
      controllerAs:'d_listarSolicitudes'
    };
  });
