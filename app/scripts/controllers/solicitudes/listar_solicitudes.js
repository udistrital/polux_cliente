'use strict';

/**
 * @ngdoc controller
 * @name poluxClienteApp.controller:SolicitudesListarSolicitudesCtrl
 * @description
 * # SolicitudesListarSolicitudesCtrl
 * Controller of the poluxClienteApp
 * Controlador que permite listar las solicitudes, en caso del estudiante todas las que haya realizado, en caso de un coordinador de pregrado las solicitudes radicadas y aprobadas
 * @requires $filter
 * @requires $location
 * @requires $q 
 * @requires $scope
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires $window
 * @requires services/parametrosService.service:parametrosRequest
 * @requires services/academicaService.service:academicaRequest
 * @requires services/poluxClienteApp.service:nuxeoService
 * @requires services/poluxService.service:nuxeoClient
 * @requires services/poluxService.service:poluxRequest
 * @requires services/poluxClienteApp.service:tokenService 
 * @requires services/poluxService.service:gestorDocumentalMidService
 * @property {Number} userId Documento del usuario que ingresa al módulo
 * @property {Object} userRole Listado de roles que tiene el usuairo que ingresa al módulo
 * @property {Object} gridOptions Opciones del ui-grid que contiene las solicitudes
 * @property {Array} solicitudes Solicitudes que se muuestran en el ui-grid
 * @property {Object} detallesSolicitud Detalles especificos de una solicitud seleccionada en el ui-grid
 * @property {Array} carrerasCoordinador Colección de carreras asociadas al coordinador en sesión
 * @property {Object} detallesSolicitud Objeto que carga la información sobre los detalles de la solicitud
 * @property {Boolean} conSolicitudes Indicador que define si existen solicitudes asociadas a la consulta en curso
 * @property {String} mensajeError Texto que aparece en caso de ocurrir un error al cargar la información
 * @property {Boolean} errorCargarParametros Indicador que maneja la aparición de un error durante la carga de parámetros
 * @property {String} msgCargandoSolicitudes Texto que aparece durante la carga de las solicitudes
 * @property {Boolean} load Indicador que opera la carga de contenidos en la página
 * @property {Array} botones Colección que maneja las propiedades de los botones en pantalla
 */
angular.module('poluxClienteApp')
  .controller('SolicitudesListarSolicitudesCtrl',
    function($filter, $location, $q, $scope, $translate,utils,gestorDocumentalMidRequest, $window, parametrosRequest, academicaRequest, nuxeo, nuxeoClient, poluxRequest, token_service) {
      var ctrl = this;
      $scope.msgCargandoSolicitudes = $translate.instant('LOADING.CARGANDO_SOLICITUDES');
      ctrl.solicitudes = [];
      ctrl.carrerasCoordinador = [];
      ctrl.TipoSolicitud = [];
      ctrl.EstadoSolicitud = [];
      ctrl.TipoDetalle = [];
      ctrl.userRole = token_service.getAppPayload().appUserRole;
      $scope.userId = token_service.getAppPayload().appUserDocument;
      ctrl.userId = $scope.userId;

      /**
       * @ngdoc method
       * @name mostrarResultado
       * @methodOf poluxClienteApp.controller:SolicitudesListarSolicitudesCtrl
       * @description 
       * Función que muestra el resultado de la solicitud, esta función muestra lo sucedido con la solicitud cuando fue aprobada o rechazada, y realiza una pequeña descripción de lo que 
       * sucedió, por ejemplo en el caso de cambio de materias muestra el nombre de la materia que se canceló y el nombre de la que se registró, en el caso de las iniciales muestra si el estudiante
       * puede o no cursar la modalidad solicitada, etc.
       * @param {Object} solicitud Solicitud que se consulta
       * @param {Object} detalles Detalles asociados a la solicitud que se está consultando
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplió la petición y se resuleve con el string resultado
       */
      ctrl.mostrarResultado = async function(solicitud, detalles) {
        var defer = $q.defer();
        var promise = defer.promise;
        var resultado = $translate.instant('SOLICITUD_SIN_RESPUESTA');
        var nuevo = "";
        var anterior = "";
        let estadoSolicitudTemp = ctrl.EstadoSolicitud.find(estadoSol => {
          return estadoSol.Id == solicitud.EstadoSolicitud
        })
        let tipoSolicitudTemp = ctrl.TipoSolicitud.find(tipoSol => {
          return tipoSol.Id == solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud
        })
        if (estadoSolicitudTemp.CodigoAbreviacion == "RCC_PLX") {
          resultado = $translate.instant('SOLICITUD_RECHAZADA');
          detalles.resultado = resultado;
          defer.resolve(resultado);
        } else if (estadoSolicitudTemp.CodigoAbreviacion == "ACC_PLX") {
          resultado = $translate.instant('SOLICITUD_ES_APROBADA');
          switch (tipoSolicitudTemp.CodigoAbreviacion) {
            //solicitud inicial
            case "SI_PLX":
              resultado += ". " + $translate.instant('APROBADO.CURSAR_MODALIDAD') + ctrl.detallesSolicitud.modalidad;
              //resultado += response;
              detalles.resultado = resultado;
              defer.resolve(resultado);
              break;
              //solicitud de cancelación de modalidad
            case "SCM_PLX":
              resultado += ". " + $translate.instant('APROBADO.CANCELAR_MODALIDAD') + ctrl.detallesSolicitud.modalidad;
              detalles.resultado = resultado;
              defer.resolve(resultado);
              break;
              //solicitud de cambio de director interno
            case "SCDI_PLX":
              resultado += ". " + $translate.instant('APROBADO.DIRECTOR_INTERNO');
              detalles.resultado = resultado;
              defer.resolve(resultado)
              break;
              //solicitud de cambio de director externo
            case "SCDE_PLX":
              resultado += ". " + $translate.instant('APROBADO.DIRECTOR_EXTERNO');
              detalles.resultado = resultado;
              defer.resolve(resultado);
              break;
              // solicitud de socialización
            case "SSO_PLX":
              resultado += ". " + $translate.instant('APROBADO.SOCIALIZACION');
              detalles.resultado = resultado;
              defer.resolve(resultado);
              break;
              //solicitud de prorroga
            case "SPR_PLX":
              resultado += ". " + $translate.instant('APROBADO.PRORROGA');
              detalles.resultado = resultado;
              defer.resolve(resultado);
              break;
              //Solicitud de cambio de nombre de trabajo de grado
            case "SMDTG_PLX":
              angular.forEach(detalles, function(detalle) {
                var codigoAbreviacion = detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion;
                if (codigoAbreviacion == "NNP") {
                  nuevo = detalle.Descripcion;
                }
                if (codigoAbreviacion == "NAP") {
                  anterior = detalle.Descripcion;
                }
              });
              resultado += ". " + $translate.instant('APROBADO.CAMBIAR_NOMBRE', {
                nuevo: nuevo,
                anterior: anterior
              });
              detalles.resultado = resultado;
              defer.resolve(resultado);
              break;
              //Solicitd de camibio de materias
            case "SCMA_PLX":
              angular.forEach(detalles, function(detalle) {
                var codigoAbreviacion = detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion;
                if (codigoAbreviacion == "ESACAANT") {
                  anterior = detalle.Descripcion.split("-")[1];
                }
                if (codigoAbreviacion == "ESACANUE") {
                  nuevo = detalle.Descripcion.split("-")[1];
                }
              });
              resultado += ". " + $translate.instant('APROBADO.CAMBIAR_MATERIA', {
                nuevo: nuevo,
                anterior: anterior
              });
              detalles.resultado = resultado;
              defer.resolve(resultado);
              break;
              //solicitud de cambio de director interno
            case "SCE_PLX":
              resultado += ". " + $translate.instant('APROBADO.EVALUADOR');
              detalles.resultado = resultado;
              defer.resolve(resultado);
              break;
              //Solicitud de cambio de codirector
            case "SCCI_PLX":
              resultado += ". " + $translate.instant('APROBADO.CODIRECTOR');
              detalles.resultado = resultado;
              defer.resolve(resultado);
              break;
              // solicitud de revisión
            case "SRTG_PLX":
              resultado += ". " + $translate.instant('APROBADO.REVISION');
              detalles.resultado = resultado;
              defer.resolve(resultado);
              break;
              //default
            default:
              detalles.resultado = resultado;
              defer.resolve(resultado);
              break;
          }

        } else if (estadoSolicitudTemp.CodigoAbreviacion == "OPC_PLX") {
          resultado = $translate.instant('SOLICITUD_OPCIONADA_SEGUNDA_CONVOCATORIA');
          detalles.resultado = resultado;
          defer.resolve(resultado);
        } else if (estadoSolicitudTemp.CodigoAbreviacion == "RCI_PLX") {
          resultado = $translate.instant('SOLICITUD_RECHAZADA_CUPOS_INSUFICIENTES');
          detalles.resultado = resultado;
          defer.resolve(resultado);
        } else if (estadoSolicitudTemp.CodigoAbreviacion == "AEP_PLX") {
          resultado = $translate.instant("SOLICITUD_APROBADA_EXENTA");
          detalles.resultado = resultado;
          defer.resolve(resultado);
        } else if (estadoSolicitudTemp.CodigoAbreviacion == "ANE_PLX") {
          resultado = $translate.instant("SOLICITUD_RECHAZADA_CUPOS_INSUFICIENTES");
          detalles.resultado = resultado;
          defer.resolve(resultado);
        } else if (estadoSolicitudTemp.CodigoAbreviacion == "FEP_PLX") {
          resultado = $translate.instant("SOLICITUD_FORMALIZADA_EXENTA_PAGO");
          detalles.resultado = resultado;
          defer.resolve(resultado);
        } else if (estadoSolicitudTemp.CodigoAbreviacion == "FNE_PLX") {
          resultado = $translate.instant("SOLICITUD_FORMALIZADA_NO_EXENTA_PAGO");
          detalles.resultado = resultado;
          defer.resolve(resultado);
        } else if (estadoSolicitudTemp.CodigoAbreviacion == "NFM_PLX") {
          resultado = $translate.instant("SOLICITUD_NO_FORMALIZADA");
          detalles.resultado = resultado;
          defer.resolve(resultado);
        } else if (estadoSolicitudTemp.CodigoAbreviacion == "OFC_PLX") {
          resultado = $translate.instant("SOLICITUD_OFICIALIZADA");
          detalles.resultado = resultado;
          defer.resolve(resultado);
        } else if (estadoSolicitudTemp.CodigoAbreviacion == "NOF_PLX") {
          resultado = $translate.instant("SOLICITUD_NO_OFICIALIZADA");
          detalles.resultado = resultado;
          defer.resolve(resultado);
        } else if (estadoSolicitudTemp.CodigoAbreviacion == "CMP_PLX") {
          resultado = $translate.instant("SOLICITUD_CUMPLIDA_PARA_ESPACIOS_ACADEMICOS");
          detalles.resultado = resultado;
          defer.resolve(resultado);
        } else if (estadoSolicitudTemp.CodigoAbreviacion == "AOP_PLX") {
          resultado = $translate.instant("SOLICITUD_CARTA_APROBADA_PASANTIA");
          detalles.resultado = resultado;
          defer.resolve(resultado);
        } else if (estadoSolicitudTemp.CodigoAbreviacion == "ROP_PLX") {
          resultado = $translate.instant("SOLICITUD_CARTA_RECHAZADA_PASANTIA");
          detalles.resultado = resultado;
          defer.resolve(resultado);
        } else {
          detalles.resultado = resultado;
          defer.resolve(resultado);
        }
        return promise;
      }

      /**
       * @ngdoc method
       * @name actualizarSolicitudes
       * @methodOf poluxClienteApp.controller:SolicitudesListarSolicitudesCtrl
       * @description 
       * Esta función primero verifica el rol del usuario para luego consultar las solicitudes y sus datos (detalles, estudiantes, respuesta) en el servicio de {@link services/poluxService.service:poluxRequest poluxRequest}. Si el rol es COORDINADOR_PREGRAO se consultan 
       * todas las carreras asociadas a este del servicio de {@link services/academicaService.service:academicaRequest academicaRequest} y luego consulta las solicitudes de los estudiantes que pertenececn a estas carreras.
       * Si el rol es Estudiante consulta las solicitudes asociadas al mismo en la tabla usuario_solicitud.
       * @param {String} identificador Documento del usuario que consultará las solicitudes
       * @param {Object} lista_roles Lista de los roles que tiene el usuario que consulta las solicitudes
       * @returns {undefined} No retorna nigún valor. 
       */
      ctrl.actualizarSolicitudes = async function(identificador, lista_roles) {
        $scope.load = true;
        var promiseArr = [];

        ctrl.solicitudes = [];
        var parametrosSolicitudes;
        var solPosgrado = false;

        $scope.botones = [{
          clase_color: "ver",
          clase_css: "fa fa-eye fa-lg  faa-shake animated-hover",
          titulo: $translate.instant('BTN.VER_DETALLES'),
          operacion: 'ver',
          estado: true
        }, ];

        ctrl.gridOptions = {
          paginationPageSizes: [5, 10, 15, 20, 25],
          paginationPageSize: 10,
          enableFiltering: true,
          enableSorting: true,
          enableSelectAll: false,
          useExternalPagination: false,
        };

        ctrl.gridOptions.columnDefs = [{
          name: 'Id',
          displayName: $translate.instant('NUMERO_RADICADO'),
          width: '15%',
        }, {
          name: 'ModalidadTipoSolicitud',
          displayName: $translate.instant('TIPO_SOLICITUD'),
          width: '40%',
        }, {
          name: 'Estado',
          displayName: $translate.instant('ESTADO_SOLICITUD'),
          width: '15%',
        }, {
          name: 'Fecha',
          displayName: $translate.instant('FECHA'),
          width: '15%',
        }, {
          name: 'Detalle',
          displayName: $translate.instant('DETALLE'),
          width: '15%',
          type: 'boolean',
          cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>'
        }];

        var parametroModalidad = $.param({
          query: "TipoParametroId__CodigoAbreviacion:MOD_TRG",
          limit: 0
        });
        await parametrosRequest.get("parametro/?", parametroModalidad).then(function (responseModalidad) {
          ctrl.Modalidad = responseModalidad.data.Data;
        })
        var tipoSolicitud = $.param({
          query: "TipoParametroId__CodigoAbreviacion:TIP_SOL",
          limit: 0
        });
        await parametrosRequest.get("parametro/?", tipoSolicitud).then(function (responseTipoSolicitud) {
          ctrl.TipoSolicitud = responseTipoSolicitud.data.Data;
        })
        var estadoSolicitud = $.param({
          query: "TipoParametroId__CodigoAbreviacion:EST_SOL",
          limit: 0
        });
        await parametrosRequest.get("parametro/?", estadoSolicitud).then(function (responseEstadoSolicitud) {
          ctrl.EstadoSolicitud = responseEstadoSolicitud.data.Data;
        })

        if (lista_roles.includes("ESTUDIANTE")) {
          parametrosSolicitudes = $.param({
            query: "usuario:" + identificador,
            limit: 0
          });
          poluxRequest.get("usuario_solicitud", parametrosSolicitudes)
            .then(function(responseSolicitudes) {
              if (Object.keys(responseSolicitudes.data[0]).length > 0) {
                ctrl.conSolicitudes = true;
              }
              if (Object.keys(responseSolicitudes.data[0]).length === 0) {
                responseSolicitudes.data = [];
              }
              var getDataSolicitud = function(solicitud) {
                var defer = $q.defer();
                var promise = defer.promise;
                promiseArr.push(promise);
                let modalidadTemp = ctrl.Modalidad.find(modalidad => {
                  return modalidad.Id == solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.Modalidad
                })
                let tipoSolicitudTemp = ctrl.TipoSolicitud.find(tipoSol => {
                  return tipoSol.Id == solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud
                })
                solicitud.data = {
                  'Id': solicitud.SolicitudTrabajoGrado.Id,
                  'Modalidad': modalidadTemp.Nombre,
                  'ModalidadTipoSolicitud': tipoSolicitudTemp.Nombre,
                  'Fecha': solicitud.SolicitudTrabajoGrado.Fecha.toString().substring(0, 10),
                }
                var parametrosRespuesta = $.param({
                  query: "ACTIVO:TRUE,SolicitudTrabajoGrado:" + solicitud.SolicitudTrabajoGrado.Id,
                });
                poluxRequest.get("respuesta_solicitud", parametrosRespuesta).then(function(responseRespuesta) {
                  let estadoSolicitudTemp = ctrl.EstadoSolicitud.find(estadoSol => {
                    return estadoSol.Id == responseRespuesta.data[0].EstadoSolicitud
                  })
                    solicitud.data.Estado = estadoSolicitudTemp.Nombre;
                    solicitud.data.Respuesta = responseRespuesta.data[0];
                    //solicitud.data.Respuesta.Resultado = ctrl.mostrarResultado(responseRespuesta.data[0]);
                    ctrl.solicitudes.push(solicitud.data);
                    ctrl.gridOptions.data = ctrl.solicitudes;
                    defer.resolve(solicitud.data);
                  })
                  .catch(function(error) {
                    defer.reject(error);
                  })
                return defer.promise;
              }
              angular.forEach(responseSolicitudes.data, function(solicitud) {
                promiseArr.push(getDataSolicitud(solicitud));
              });
              $q.all(promiseArr).then(function() {
                  ctrl.gridOptions.data = ctrl.solicitudes;
                  $scope.load = false;
                })
                .catch(function(error) {
                  ctrl.mensajeError = $translate.instant("ERROR.CARGAR_DATOS_SOLICITUDES");
                  ctrl.errorCargarParametros = true;
                  $scope.load = false;
                });

            })
            .catch(function(error) {
              ctrl.mensajeError = $translate.instant('ERROR.CARGAR_DATOS_ESTUDIANTES');
              ctrl.errorCargarParametros = true;
              $scope.load = false;
            });
        } else if (lista_roles.includes("COORDINADOR_PREGRADO")||lista_roles.includes("DOCENTE")) {
          $scope.botones.push({
            clase_color: "ver",
            clase_css: "fa fa-check-square-o fa-lg  faa-shake animated-hover",
            titulo: $translate.instant('BTN.RESPONDER_SOLICITUD'),
            operacion: 'responder',
            estado: true
          });

          academicaRequest.get("coordinador_carrera", [$scope.userId, "PREGRADO"]).then(async function(responseCoordinador) {
              ctrl.carrerasCoordinador = [];
              var carreras = [];
              if(lista_roles.includes("DOCENTE"))
              {
                var query = "ESTADOSOLICITUD.in:"
                var guardaPrimero = false;
                var guardaSegundo = false;
                ctrl.EstadoSolicitud.forEach(estado => {
                  if (estado.CodigoAbreviacion == "RDC_PLX" || estado.CodigoAbreviacion == "PRDI_PLX") {
                    if (guardaPrimero) {
                      query += "|"
                    } else {
                      guardaPrimero = true
                    }
                    query += estado.Id.toString()
                  }
                });
                query += ",SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud.in:"
                var tiposSolicitud = ["SCM_PLX", "SCDI_PLX", "SCDE_PLX", "SSO_PLX", "SPR_PLX", "SMDTG_PLX", "SCMA_PLX", "SCE_PLX", "SDTG_PLX", "SCCI_PLX", "SRTG_PLX", "SAD_PLX","SCO_PLX"]
                ctrl.TipoSolicitud.forEach(tipoSolicitud => {
                  if (tiposSolicitud.includes(tipoSolicitud.CodigoAbreviacion)) {
                    if (guardaSegundo) {
                      query += "|"
                    } else {
                      guardaSegundo = true
                    }
                    query += tipoSolicitud.Id.toString()
                  }
                });
                parametrosSolicitudes = $.param({
                  query: query + ",Activo:true,EnteResponsable:" + ctrl.userId,
                  limit: 0
                });
                poluxRequest.get("respuesta_solicitud", parametrosSolicitudes).then(function(responseSolicitudes) {
                  if (Object.keys(responseSolicitudes.data[0]).length > 0) {
                    ctrl.conSolicitudes = true;
                  }
                  if (Object.keys(responseSolicitudes.data[0]).length === 0) {
                    responseSolicitudes.data = [];

                    ctrl.mensajeError = $translate.instant("Señor/a director/a , no tiene solicitudes pendientes");
                    ctrl.errorCargarParametros = true;
                  }
                  var verificarSolicitud = function(solicitud) {
                    var defer = $q.defer();
                    let modalidadTemp = ctrl.Modalidad.find(modalidad => {
                      return modalidad.Id == solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.Modalidad
                    })
                    let tipoSolicitudTemp = ctrl.TipoSolicitud.find(tipoSol => {
                      return tipoSol.Id == solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud
                    })
                    solicitud.data = {
                      'Id': solicitud.SolicitudTrabajoGrado.Id,
                      'Modalidad': modalidadTemp.Nombre,
                      'ModalidadTipoSolicitud': tipoSolicitudTemp.Nombre,
                      'Fecha': solicitud.SolicitudTrabajoGrado.Fecha.toString().substring(0, 10),
                    }

                    var parametrosUsuario = $.param({
                      query: "SolicitudTrabajoGrado:" + solicitud.SolicitudTrabajoGrado.Id,
                      sortby: "Usuario",
                      order: "asc",
                      limit: 1,
                    });
                    poluxRequest.get("usuario_solicitud", parametrosUsuario).then(function(usuario) {
                        ctrl.obtenerEstudiantes(solicitud, usuario).then(function(codigo_estudiante) {
                            academicaRequest.get("datos_basicos_estudiante",[codigo_estudiante]).then(function(response2) {
                                if (!angular.isUndefined(response2.data.datosEstudianteCollection.datosBasicosEstudiante)) {
                                  var carreraEstudiante = response2.data.datosEstudianteCollection.datosBasicosEstudiante[0].carrera;
                                  if(lista_roles.includes("DOCENTE"))
                                  {
                                    let estadoSolicitudTemp = ctrl.EstadoSolicitud.find(estadoSol => {
                                      return estadoSol.Id == solicitud.EstadoSolicitud
                                    })
                                    solicitud.data.Estado = estadoSolicitudTemp.Nombre;
                                    solicitud.data.Respuesta = solicitud;
                                    // solicitud.data.Respuesta.Resultado = $translate.instant('SOLICITUD_SIN_RESPUESTA');
                                    solicitud.data.Carrera = carreraEstudiante;
                                    ctrl.solicitudes.push(solicitud.data);
                                    defer.resolve(solicitud.data);
                                    ctrl.gridOptions.data = ctrl.solicitudes;
                                  }
                                  if (carreras.includes(carreraEstudiante)) {
                                    solicitud.data.Estado = estadoSolicitudTemp.Nombre;
                                    solicitud.data.Respuesta = solicitud;
                                    solicitud.data.Carrera = carreraEstudiante;
                                    ctrl.solicitudes.push(solicitud.data);
                                    defer.resolve(solicitud.data);
                                    ctrl.gridOptions.data = ctrl.solicitudes;
                                  }else {
                                    defer.resolve(carreraEstudiante);
                                  }
                                }
                              })
                              .catch(function(error) {
                                defer.reject(error);
                              });
                          })
                          .catch(function(error) {
                            defer.reject(error);
                          });
                      })
                      .catch(function(error) {
                        defer.reject(error);
                      });
                    return defer.promise;
                  }
                  angular.forEach(responseSolicitudes.data, function(solicitud) {
                    var parametrosDetallesSolicitud = $.param({
                      query: "SolicitudTrabajoGrado.Id:" + solicitud.SolicitudTrabajoGrado.Id,
                      limit: 0
                    });
                    poluxRequest.get("detalle_solicitud", parametrosDetallesSolicitud).then(function(responseDetalles) {
                      if (Object.keys(responseDetalles.data[0]).length === 0) {
                        ctrl.mensajeError = $translate.instant("Señor/a director/a , no hay solicitudes pendientes");
                        ctrl.errorCargarParametros = true;
                      } else {
                        var UserExiste = false;
                        let tipoSolicitudTemp = ctrl.TipoSolicitud.find(tipoSol => {
                          return tipoSol.Id == solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud
                        })
                        if(tipoSolicitudTemp.CodigoAbreviacion == "SAD_PLX"){
                          for(var i=0;i<responseDetalles.data.length;i++){
                            if(responseDetalles.data[i].Descripcion === ctrl.userId){
                              promiseArr.push(verificarSolicitud(solicitud));
                              UserExiste = true;
                            }
                          }
                        }else{
                          promiseArr.push(verificarSolicitud(solicitud));
                          UserExiste = true;
                        }
                        if(UserExiste == false){
                          ctrl.mensajeError = $translate.instant("Señor/a director/a , no tiene solicitudes pendientes");
                          ctrl.errorCargarParametros = true;
                        }
                      }
                    });
                  });
                  $q.all(promiseArr).then(function() {
                      if (ctrl.solicitudes.length != 0) {
                        ctrl.conSolicitudes = true;
                      }
                      ctrl.gridOptions.data = ctrl.solicitudes;
                      $scope.load = false;
                    })
                    .catch(function(error) {
                      ctrl.mensajeError = $translate.instant("ERROR.CARGAR_DATOS_SOLICITUDES");
                      ctrl.errorCargarParametros = true;
                      $scope.load = false;
                    });
                })
                .catch(function(error) {
                  ctrl.mensajeError = $translate.instant("ERROR.CARGAR_RESPUESTA_SOLICITUD");
                  ctrl.errorCargarParametros = true;
                  $scope.load = false;
                });
              }
              else{
              if (!angular.isUndefined(responseCoordinador.data.coordinadorCollection.coordinador)) {

                ctrl.carrerasCoordinador = responseCoordinador.data.coordinadorCollection.coordinador;
                angular.forEach(responseCoordinador.data.coordinadorCollection.coordinador, function(carrera) {
                  carreras.push(carrera.codigo_proyecto_curricular);
                });
                var parametrosModalidadTipo = $.param({
                  limit: 0
                });
                var modalidadTipoSol
                await poluxRequest.get("modalidad_tipo_solicitud", parametrosModalidadTipo).then(function (responseModalidadTipo) {
                  modalidadTipoSol = responseModalidadTipo.data;
                })
                var query = "ESTADOSOLICITUD.in:"
                var guardaPrimero = false;
                ctrl.EstadoSolicitud.forEach(estado => {
                  if (estado.CodigoAbreviacion == "RDC_PLX" || estado.CodigoAbreviacion == "ADD_PLX" || estado.CodigoAbreviacion == "APEP_PLX") {
                    if (guardaPrimero) {
                      query += "|"
                    } else {
                      guardaPrimero = true
                    }
                    query += estado.Id.toString()
                  }
                });
                var exclude = "SolicitudTrabajoGrado.ModalidadTipoSolicitud.Id.in:"
                guardaPrimero = false;
                modalidadTipoSol.forEach(modTipo => {
                  let modalidadTemp = ctrl.Modalidad.find(modalidad => {
                    return modalidad.Id == modTipo.Modalidad
                  })
                  let tipoSolicitudTemp = ctrl.TipoSolicitud.find(tipoSol => {
                    return tipoSol.Id == modTipo.TipoSolicitud
                  })
                  if (tipoSolicitudTemp.CodigoAbreviacion == "SAD_PLX" || (tipoSolicitudTemp.CodigoAbreviacion == "SCPAE_PLX" && modalidadTemp.CodigoAbreviacion == "PASEX_PLX")) {
                    if (guardaPrimero) {
                      exclude += "|"
                    } else {
                      guardaPrimero = true
                    }
                    exclude += modTipo.Id
                  }
                });
                var parametrosSolicitudes = $.param({
                  query: query + ",Activo:true",
                  exclude: exclude,
                  limit: 0
                });
                poluxRequest.get("respuesta_solicitud", parametrosSolicitudes).then(function(responseSolicitudes) {
                    if (Object.keys(responseSolicitudes.data[0]).length > 0) {
                      ctrl.conSolicitudes = true;
                    }
                    if (Object.keys(responseSolicitudes.data[0]).length === 0) {
                      responseSolicitudes.data = [];
                    }
                    var verificarSolicitud = function(solicitud) {
                      var defer = $q.defer();
                      let modalidadTemp = ctrl.Modalidad.find(modalidad => {
                        return modalidad.Id == solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.Modalidad
                      })
                      let tipoSolicitudTemp = ctrl.TipoSolicitud.find(tipoSol => {
                        return tipoSol.Id == solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud
                      })
                      solicitud.data = {
                        'Id': solicitud.SolicitudTrabajoGrado.Id,
                        'Modalidad': modalidadTemp.Nombre,
                        'ModalidadTipoSolicitud': tipoSolicitudTemp.Nombre,
                        'Fecha': solicitud.SolicitudTrabajoGrado.Fecha.toString().substring(0, 10),
                      }
                      var parametrosUsuario = $.param({
                        query: "SolicitudTrabajoGrado:" + solicitud.SolicitudTrabajoGrado.Id,
                        sortby: "Usuario",
                        order: "asc",
                        limit: 1,
                      });
                      poluxRequest.get("usuario_solicitud", parametrosUsuario).then(function(usuario) { 
                          ctrl.obtenerEstudiantes(solicitud, usuario).then(function(codigo_estudiante) {
                              academicaRequest.get("datos_basicos_estudiante",[codigo_estudiante]).then(function(response2) {
                                  if (!angular.isUndefined(response2.data.datosEstudianteCollection.datosBasicosEstudiante)) {
                                    var carreraEstudiante = response2.data.datosEstudianteCollection.datosBasicosEstudiante[0].carrera;
                                    if (carreras.includes(carreraEstudiante)) {
                                      let estadoSolicitudTemp = ctrl.EstadoSolicitud.find(estadoSol => {
                                        return estadoSol.Id == solicitud.EstadoSolicitud
                                      })
                                      solicitud.data.Estado = estadoSolicitudTemp.Nombre;
                                      solicitud.data.Respuesta = solicitud;
                                      // solicitud.data.Respuesta.Resultado = $translate.instant('SOLICITUD_SIN_RESPUESTA');
                                      solicitud.data.Carrera = carreraEstudiante;
                                      ctrl.solicitudes.push(solicitud.data);
                                      defer.resolve(solicitud.data);
                                      ctrl.gridOptions.data = ctrl.solicitudes;
                                    } else {
                                      defer.resolve(carreraEstudiante);
                                    }
                                  }
                                })
                                .catch(function(error) {
                                  defer.reject(error);
                                });
                            })
                            .catch(function(error) {
                              defer.reject(error);
                            });
                        })
                        .catch(function(error) {
                          defer.reject(error);
                        });
                      return defer.promise;
                    }
                    angular.forEach(responseSolicitudes.data, function(solicitud) {
                      promiseArr.push(verificarSolicitud(solicitud));
                    });
                    $q.all(promiseArr).then(function() {
                        if (ctrl.solicitudes.length != 0) {
                          ctrl.conSolicitudes = true;
                        }
                        ctrl.gridOptions.data = ctrl.solicitudes;
                        $scope.load = false;
                      })
                      .catch(function(error) {
                        ctrl.mensajeError = $translate.instant("ERROR.CARGAR_DATOS_SOLICITUDES");
                        ctrl.errorCargarParametros = true;
                        $scope.load = false;
                      });
                  })
                  .catch(function(error) {
                    ctrl.mensajeError = $translate.instant("ERROR.CARGAR_RESPUESTA_SOLICITUD");
                    ctrl.errorCargarParametros = true;
                    $scope.load = false;
                  });
              } else {
                ctrl.mensajeError = $translate.instant("ERROR.SIN_CARRERAS_PREGRADO");
                ctrl.errorCargarParametros = true;
                $scope.load = false;
              }
            }
            })
            .catch(function(error) {
              ctrl.mensajeError = $translate.instant("ERROR.CARGAR_CARRERAS");
              ctrl.errorCargarParametros = true;
              $scope.load = false;
            });
        } else if (lista_roles.includes("COORDINADOR_POSGRADO")) {
          $scope.botones.push({
            clase_color: "ver",
            clase_css: "fa fa-check-square-o fa-lg  faa-shake animated-hover",
            titulo: $translate.instant('BTN.RESPONDER_SOLICITUD'),
            operacion: 'responder',
            estado: true
          });
          academicaRequest.get("coordinador_carrera", [$scope.userId, "POSGRADO"]).then(function(responseCoordinador) {
            ctrl.carrerasCoordinador = [];
            var carreras = [];
            console.log("roles ", lista_roles)
            if (lista_roles.includes("COORDINADOR_POSGRADO")) {
              let estSol = ctrl.EstadoSolicitud.find(estadoSol => {
                return estadoSol.CodigoAbreviacion == "ACPR_PLX"
              })
              parametrosSolicitudes = $.param({
                query: "EstadoSolicitud:" + estSol.Id + ",Activo:true",
                limit: 0
              });
              if (!angular.isUndefined(responseCoordinador.data.coordinadorCollection.coordinador)) {
                ctrl.carrerasCoordinador = responseCoordinador.data.coordinadorCollection.coordinador;
                angular.forEach(responseCoordinador.data.coordinadorCollection.coordinador, function(carrera) {
                  carreras.push(carrera.codigo_proyecto_curricular);
                });
              }
              poluxRequest.get("respuesta_solicitud", parametrosSolicitudes). then(function(responseSolicitudes) {
                if (Object.keys(responseSolicitudes.data[0]).length > 0) {
                  ctrl.conSolicitudes = true;
                }
                if (Object.keys(responseSolicitudes.data[0]).length === 0) {
                  responseSolicitudes.data = [];

                  ctrl.mensajeError = $translate.instant("Señor/a director/a , no tiene solicitudes pendientes");
                  ctrl.errorCargarParametros = true;
                }

                async function verificarSolicitud(solicitud) {
                  return new Promise((resolve, reject) => {
                    let modalidadTemp = ctrl.Modalidad.find(modalidad => {
                      return modalidad.Id == solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.Modalidad
                    })
                    let tipoSolicitudTemp = ctrl.TipoSolicitud.find(tipoSol => {
                      return tipoSol.Id == solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud
                    })
                    solicitud.data = {
                      'Id': solicitud.SolicitudTrabajoGrado.Id,
                      'Modalidad': modalidadTemp.Nombre,
                      'ModalidadTipoSolicitud': tipoSolicitudTemp.Nombre,
                      'Fecha': solicitud.SolicitudTrabajoGrado.Fecha.toString().substring(0, 10),
                    }

                    var parametrosUsuario = $.param({
                      query: "SolicitudTrabajoGrado:" + solicitud.SolicitudTrabajoGrado.Id,
                      sortby: "Usuario",
                      order: "asc",
                      limit: 1
                    });

                    poluxRequest.get("usuario_solicitud", parametrosUsuario).then(function(usuario) {
                      ctrl.obtenerEstudiantes(solicitud, usuario).then(function(codigo_estudiante) {
                        academicaRequest.get("datos_basicos_estudiante",[codigo_estudiante]).then(function(response2) {
                          if (!angular.isUndefined(response2.data.datosEstudianteCollection.datosBasicosEstudiante)) {
                            var carreraEstudiante = response2.data.datosEstudianteCollection.datosBasicosEstudiante[0].carrera;
                            let estadoSolicitudTemp = ctrl.EstadoSolicitud.find(estadoSol => {
                              return estadoSol.Id == solicitud.EstadoSolicitud
                            })
                            if(lista_roles.includes("COORDINADOR_POSGRADO")) {
                              solicitud.data.Respuesta = solicitud;
                              solicitud.data.Carrera = carreraEstudiante;
                              solicitud.data.Estado = estadoSolicitudTemp.Nombre;
                              ctrl.solicitudes.push(solicitud.data);
                              ctrl.gridOptions.data = ctrl.solicitudes;
                            }
                            if (carreras.includes(carreraEstudiante)) {
                              solicitud.data.Estado = estadoSolicitudTemp.Nombre;
                              solicitud.data.Respuesta = solicitud;
                              // solicitud.data.Respuesta.Resultado = $translate.instant('SOLICITUD_SIN_RESPUESTA');
                              solicitud.data.Carrera = carreraEstudiante;
                              ctrl.solicitudes.push(solicitud.data);
                              ctrl.gridOptions.data = ctrl.solicitudes;
                              resolve();
                            }else {
                              resolve();
                            }
                          }
                        })
                      })
                    })
                  })
                }

                angular.forEach(responseSolicitudes.data, function(solicitud) {
                  var parametrosDetallesSolicitud = $.param({
                    query: "SolicitudTrabajoGrado.Id:" + solicitud.SolicitudTrabajoGrado.Id,
                    limit: 0
                  });
                  poluxRequest.get("detalle_solicitud", parametrosDetallesSolicitud).then(async function(responseDetalles) {
                    if (Object.keys(responseDetalles.data[0]).length === 0) {
                      ctrl.mensajeError = $translate.instant("Señor/a director/a , no hay solicitudes pendientes");
                        ctrl.errorCargarParametros = true;
                    } else {
                      var UserExiste = false;
                      let tipoSolicitudTemp = ctrl.TipoSolicitud.find(tipoSol => {
                        return tipoSol.Id == solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud
                      })
                      let modalidadTemp = ctrl.Modalidad.find(modalidad => {
                        return modalidad.Id == solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.Modalidad
                      })
                      if (tipoSolicitudTemp.CodigoAbreviacion == "SAD_PLX") {
                        for (var i = 0; i < responseDetalles.data.length; i++) {
                          if (responseDetalles.data[i].Descripcion === ctrl.userId) {
                            await verificarSolicitud(solicitud)
                            UserExiste = true;
                          }
                        }
                      } else if (tipoSolicitudTemp.CodigoAbreviacion == "SI_PLX" &&
                       modalidadTemp.CodigoAbreviacion == "EAPOS_PLX") {
                        var responseAux;
                        for (var i = 0; i < responseDetalles.data.length; i++) {
                          if (responseDetalles.data[i].DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "ESPELE" || 
                          responseDetalles.data[i].DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "ESPELE2") {
                            solPosgrado = true;
                            var datosMaterias = responseDetalles.data[i].Descripcion.split("-");
                            var carrera = JSON.parse(datosMaterias[1]);
                            if (carreras.includes((carrera.Codigo).toString())) {
                              responseAux = responseDetalles.data[i]
                              await verificarSolicitud(solicitud)
                              if (solPosgrado) {
                                var parametrosRespuesta = "";
                                var query = ",EstadoSolicitud.in:"
                                if (responseAux.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "ESPELE") {
                                  var guardaPrimero = false;
                                  ctrl.EstadoSolicitud.forEach(estado => {
                                    if (estado.CodigoAbreviacion == "ACPO1_PLX" || estado.CodigoAbreviacion == "RCPO1_PLX") {
                                      if (guardaPrimero) {
                                        query += "|"
                                      } else {
                                        guardaPrimero = true
                                      }
                                      query += estado.Id.toString()
                                    }
                                  });
                                  parametrosRespuesta = $.param({
                                    query: "SolicitudTrabajoGrado.Id:" + solicitud.SolicitudTrabajoGrado.Id + query,
                                    limit: 0
                                  });
                                } else if (responseAux.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "ESPELE2") {
                                  var guardaPrimero = false;
                                  ctrl.EstadoSolicitud.forEach(estado => {
                                    if (estado.CodigoAbreviacion == "ACPO2_PLX" || estado.CodigoAbreviacion == "RCPO2_PLX") {
                                      if (guardaPrimero) {
                                        query += "|"
                                      } else {
                                        guardaPrimero = true
                                      }
                                      query += estado.Id.toString()
                                    }
                                  });
                                  parametrosRespuesta = $.param({
                                    query: "SolicitudTrabajoGrado.Id:" + solicitud.SolicitudTrabajoGrado.Id + query,
                                    limit: 0
                                  });
                                }
                                poluxRequest.get("respuesta_solicitud", parametrosRespuesta).then(function (responseEstadoSolicitud) {
                                  if (Object.keys(responseEstadoSolicitud.data[0]).length > 0) {
                                    ctrl.solicitudes.pop();
                                    ctrl.gridOptions.data = ctrl.solicitudes;
                                  }
                                });
                              }
                              UserExiste = true;
                            }
                          }
                        }
                      } else {
                        await verificarSolicitud(solicitud)
                        UserExiste = true;
                      }
                      if (UserExiste == false) {
                        ctrl.mensajeError = $translate.instant("Señor/a director/a , no tiene solicitudes pendientes");
                          ctrl.errorCargarParametros = true;
                      }
                    }
                  });
                });
                $q.all(promiseArr).then(function() {
                  if (ctrl.solicitudes.length != 0) {
                    ctrl.conSolicitudes = true;
                  }
                  ctrl.gridOptions.data = ctrl.solicitudes;
                  $scope.load = false;
                })
              })
              .catch(function(error) {
                ctrl.mensajeError = $translate.instant("ERROR.CARGAR_DATOS_SOLICITUDES");
                ctrl.errorCargarParametros = true;
                $scope.load = false;
              })
            }
          })
        } else if (lista_roles.includes("EXTENSION_PASANTIAS")){
          //opcion para consultar las solicitudes para la oficina de pasantias
          $scope.botones.push({
            clase_color: "ver",
            clase_css: "fa fa-check-square-o fa-lg  faa-shake animated-hover",
            titulo: $translate.instant('BTN.RESPONDER_SOLICITUD'),
            operacion: 'responder',
            estado: true
          });

          let estadoSolTemp = ctrl.EstadoSolicitud.find(estSol => {
            return estSol.CodigoAbreviacion == "PREP_PLX"
          })


          parametrosSolicitudes = $.param({
            query: "ESTADOSOLICITUD.Id:" + estadoSolTemp.Id + ",Activo:true",
            limit: 0
          });
          poluxRequest.get("respuesta_solicitud", parametrosSolicitudes).then(function(responseSolicitudes) {
            if (Object.keys(responseSolicitudes.data[0]).length > 0) {
              ctrl.conSolicitudes = true;
            }
            if (Object.keys(responseSolicitudes.data[0]).length === 0) {
              responseSolicitudes.data = [];

              ctrl.mensajeError = $translate.instant("No tiene solicitudes pendientes");
              ctrl.errorCargarParametros = true;
            }
            var verificarSolicitud = function(solicitud) {
              var defer = $q.defer();
              let modalidadTemp = ctrl.Modalidad.find(modalidad => {
                return modalidad.Id == solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.Modalidad
              })
              let tipoSolicitudTemp = ctrl.TipoSolicitud.find(tipoSol => {
                return tipoSol.Id == solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud
              })
              solicitud.data = {
                'Id': solicitud.SolicitudTrabajoGrado.Id,
                'Modalidad': modalidadTemp.Nombre,
                'ModalidadTipoSolicitud': tipoSolicitudTemp.Nombre,
                'Fecha': solicitud.SolicitudTrabajoGrado.Fecha.toString().substring(0, 10),
              }

              var parametrosUsuario = $.param({
                query: "SolicitudTrabajoGrado:" + solicitud.SolicitudTrabajoGrado.Id,
                sortby: "Usuario",
                order: "asc",
                limit: 1,
              });
              poluxRequest.get("usuario_solicitud", parametrosUsuario).then(function(usuario) {
                  ctrl.obtenerEstudiantes(solicitud, usuario).then(function(codigo_estudiante) {
                      academicaRequest.get("datos_basicos_estudiante",[codigo_estudiante]).then(function(response2) {
                          if (!angular.isUndefined(response2.data.datosEstudianteCollection.datosBasicosEstudiante)) {
                            let estadoSolicitudTemp = ctrl.EstadoSolicitud.find(estadoSol => {
                              return estadoSol.Id == solicitud.EstadoSolicitud
                            })
                            var carreraEstudiante = response2.data.datosEstudianteCollection.datosBasicosEstudiante[0].carrera;
                            solicitud.data.Estado = estadoSolicitudTemp.Nombre;
                            solicitud.data.Respuesta = solicitud;
                            // solicitud.data.Respuesta.Resultado = $translate.instant('SOLICITUD_SIN_RESPUESTA');
                            solicitud.data.Carrera = carreraEstudiante;
                            ctrl.solicitudes.push(solicitud.data);
                            defer.resolve(solicitud.data);
                            ctrl.gridOptions.data = ctrl.solicitudes;
                          }
                        })
                        .catch(function(error) {
                          defer.reject(error);
                        });
                    })
                    .catch(function(error) {
                      defer.reject(error);
                    });
                })
                .catch(function(error) {
                  defer.reject(error);
                });
              return defer.promise;
            }
            angular.forEach(responseSolicitudes.data, function(solicitud) {
              var parametrosDetallesSolicitud = $.param({
                query: "SolicitudTrabajoGrado.Id:" + solicitud.SolicitudTrabajoGrado.Id,
                limit: 0
              });
              poluxRequest.get("detalle_solicitud", parametrosDetallesSolicitud).then(function(responseDetalles) {
                if (Object.keys(responseDetalles.data[0]).length === 0) {
                  ctrl.mensajeError = $translate.instant("No hay solicitudes pendientes");
                  ctrl.errorCargarParametros = true;
                } else {
                  var UserExiste = false;

                  let tipoSolicitudTemp = ctrl.TipoSolicitud.find(tipoSol => {
                    return tipoSol.Id == solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud
                  })
                  if(tipoSolicitudTemp.CodigoAbreviacion == "SAD_PLX"){
                    for(var i=0;i<responseDetalles.data.length;i++){
                      if(responseDetalles.data[i].Descripcion === ctrl.userId){
                        promiseArr.push(verificarSolicitud(solicitud));
                        UserExiste = true;
                      }
                    }
                  }else{
                    promiseArr.push(verificarSolicitud(solicitud));
                    UserExiste = true;
                  }
                  if(UserExiste == false){
                    ctrl.mensajeError = $translate.instant("No tiene solicitudes pendientes");
                    ctrl.errorCargarParametros = true;
                  }
                }
              });
            });
            $q.all(promiseArr).then(function() {
                if (ctrl.solicitudes.length != 0) {
                  ctrl.conSolicitudes = true;
                }
                ctrl.gridOptions.data = ctrl.solicitudes;
                $scope.load = false;
              })
              .catch(function(error) {
                ctrl.mensajeError = $translate.instant("ERROR.CARGAR_DATOS_SOLICITUDES");
                ctrl.errorCargarParametros = true;
                $scope.load = false;
              });
          })
          .catch(function(error) {
            ctrl.mensajeError = $translate.instant("ERROR.CARGAR_RESPUESTA_SOLICITUD");
            ctrl.errorCargarParametros = true;
            $scope.load = false;
          });
        }
      }

      ctrl.actualizarSolicitudes($scope.userId, ctrl.userRole);

      /**
       * @ngdoc method
       * @name getDocumento
       * @methodOf poluxClienteApp.controller:SolicitudesListarSolicitudesCtrl
       * @param {Number} docid Identificador del documento en {@requires services/poluxService.service:gestorDocumentalMidService gestorDocumentalMidService}
       * @returns {undefined} No retorna ningún valor
       * @description 
       * Llama a la función obtenerDoc y obtenerFetch para descargar un documento de nuxeo y msotrarlo en una nueva ventana
       */
      ctrl.getDocumento = function(docid) {
          /*nuxeoClient.getDocument(docid)
          .then(function(document) {
            $window.open(document.url);
          })
          */
        //Muestra el documento desde el gestor documental
        gestorDocumentalMidRequest.get('/document/'+docid).then(function (response) {
          var varia = utils.base64ToArrayBuffer(response.data.file);   
          var file = new Blob([varia], {type: 'application/pdf'});
					var fileURL = URL.createObjectURL(file);
					$window.open(fileURL, 'resizable=yes,status=no,location=no,toolbar=no,menubar=no,fullscreen=yes,scrollbars=yes,dependent=no,width=700,height=900');
						 })
          .catch(function(error) {
            swal(
              $translate.instant("MENSAJE_ERROR"),
              $translate.instant("ERROR.CARGAR_DOCUMENTO"),
              'warning'
            );
          });

      }

      /**
       * @ngdoc method
       * @name filtrarSolicitudes
       * @methodOf poluxClienteApp.controller:SolicitudesListarSolicitudesCtrl
       * @description
       * Permite filtrar las solicitudes para cada una de las carreras del coordinador
       * @param {Number} carrera_seleccionada Carrera seleccionada por el coordinador en el filtro
       * @returns {undefined} No retorna ningún valor
       */
      ctrl.filtrarSolicitudes = function(carrera_seleccionada) {
        var solicitudesTemporales = [];
        angular.forEach(ctrl.solicitudes, function(solicitud) {
          if (solicitud.Carrera === carrera_seleccionada) {
            solicitudesTemporales.push(solicitud);
          }
        });
        ctrl.gridOptions.data = solicitudesTemporales;
      }

      /**
       * @ngdoc method
       * @name obtenerEstudiantes
       * @methodOf poluxClienteApp.controller:SolicitudesListarSolicitudesCtrl
       * @description
       * Consulta los estudiantes asociados a la solicitud
       * @param {Object} solicitud Solicitud que se quiere consultar
       * @param {Object} usuario Usuario que se consultará
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplió la petición y se resuleve con los estudiantes que pertenecen a la solicitud
       */
      ctrl.obtenerEstudiantes = async function(solicitud, usuario) {
        let tipoSolicitudTemp = ctrl.TipoSolicitud.find(tipoSol => {
          return tipoSol.Id == solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud
        })
        if (tipoSolicitudTemp.CodigoAbreviacion == "SDTG_PLX") { //sols de distincion
          var parametros = $.param({
            query: "SolicitudTrabajoGrado:" + solicitud.SolicitudTrabajoGrado.Id
          });
          poluxRequest.get("detalle_solicitud", parametros).then(function(detalles) {
            angular.forEach(detalles.data, function(detalle) {
              if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "TG") { //buscar el detalle asociado al TG
                var parametros = $.param({
                  query: "TrabajoGrado.Id:" + detalle.Descripcion
                });
                poluxRequest.get("estudiante_trabajo_grado", parametros).then(function(estudiantes) {
                  return estudiantes.daa[0].Estudiante
                  //defer.resolve(estudiantes.data[0].Estudiante);
                });

              }
            });
          })
            .catch(function(error) {
              defer.reject(error);
            });
        } else {
          return usuario.data[0].Usuario
        }
        return;
      }

      /**
       * @ngdoc method
       * @name cargarDetalles
       * @methodOf poluxClienteApp.controller:SolicitudesListarSolicitudesCtrl
       * @description
       * Función que se ejecuta cuando un usario desea ver los detalles específicos de una solicitud, se consultan los documentos con los que se aprobó o rechazó la solicitud,
       * y los detalles asociados a la solicitud del servicio {@link services/poluxService.service:poluxRequest poluxRequest}
       * @param {Object} fila Fila seleccionada en el uigrid que contiene los detalles de la solicitud que se quiere consultar
       * @returns {undefined} No retorna ningún valor
       */
      ctrl.cargarDetalles = async function(fila) {
        var solicitud = fila.entity.Id;
        var parametrosSolicitud = $.param({
          query: "SolicitudTrabajoGrado.Id:" + solicitud,
          limit: 0
        });

        var getDocumentoRespuesta = function(fila, solicitud) {
          var defer = $q.defer();
          let estadoSolicitudTemp = ctrl.EstadoSolicitud.find(estadoSol => {
            return estadoSol.Id == fila.entity.Respuesta.EstadoSolicitud
          })
          if (estadoSolicitudTemp.CodigoAbreviacion != "RDC_PLX") {
            var parametrosDocumentoSolicitud = $.param({
              query: "SolicitudTrabajoGrado.Id:" + solicitud,
              limit: 0
            });
            poluxRequest.get("documento_solicitud", parametrosDocumentoSolicitud).then(function(documento) {
                if (Object.keys(documento.data[0]).length > 0) {
                  ctrl.detallesSolicitud.documento = documento.data[0].DocumentoEscrito;
                }
                defer.resolve();
              })
              .catch(function(error) {
                defer.reject(error);
              });
          } else {
            defer.resolve();
          }
          return defer.promise;
        }

        await poluxRequest.get("detalle_solicitud", parametrosSolicitud).then(async function(responseDetalles) {
          if (Object.keys(responseDetalles.data[0]).length > 0) {
            var tipoDetalle = $.param({
              query: "TipoParametroId__CodigoAbreviacion:TIP_DET",
              limit: 0
            });
            await parametrosRequest.get("parametro/?", tipoDetalle).then(function (responseTipoDetalle) {
              ctrl.TipoDetalle = responseTipoDetalle.data.Data;
            })
            ctrl.detallesSolicitud = responseDetalles.data;
            ctrl.detallesSolicitud.forEach(detalle => {
              detalle.DetalleTipoSolicitud.Detalle.TipoDetalleAux = ctrl.TipoDetalle.find(tipoDetalle => {
                return tipoDetalle.Id == detalle.DetalleTipoSolicitud.Detalle.TipoDetalle
              })
            });
          } else {
            ctrl.detallesSolicitud = [];
          }
            await poluxRequest.get("usuario_solicitud", parametrosSolicitud).then(function(responseEstudiantes) {
                var promises = [];
                var solicitantes = "";
                ctrl.detallesSolicitud.id = fila.entity.Id;
                ctrl.detallesSolicitud.tipoSolicitud = fila.entity.ModalidadTipoSolicitud;
                ctrl.detallesSolicitud.fechaSolicitud = fila.entity.Fecha;
                ctrl.detallesSolicitud.estado = fila.entity.Estado;
                ctrl.detallesSolicitud.modalidad = fila.entity.Modalidad;
                ctrl.detallesSolicitud.PeriodoAcademico = fila.entity.Respuesta.SolicitudTrabajoGrado.PeriodoAcademico;
                ctrl.detallesSolicitud.respuesta = fila.entity.Respuesta.Justificacion;
                //ctrl.mostrarResultado(fila.entity.Respuesta,ctrl.detallesSolicitud).then(function(resultado){
                //ctrl.detallesSolicitud.resultado = resultado;
                //});
                promises.push(ctrl.mostrarResultado(fila.entity.Respuesta, ctrl.detallesSolicitud));
                angular.forEach(responseEstudiantes.data, function(estudiante) {
                  solicitantes += (", " + estudiante.Usuario);
                });

                var getDocente = function(detalle) {
                  var defer = $q.defer();
                  academicaRequest.get("docente_tg", [detalle.Descripcion]).then(function(docente) {
                      if (!angular.isUndefined(docente.data.docenteTg.docente)) {
                        detalle.Descripcion = docente.data.docenteTg.docente[0].nombre;
                        defer.resolve();
                      }
                    })
                    .catch(function(error) {
                      defer.reject(error);
                    });
                  return defer.promise;
                }

                var getDocentes = function(detalle) {
                  var defer = $q.defer();
                  var promesasDocentes = [];
                  var detallesTemporales = [];
                  angular.forEach(detalle.Descripcion.split(","), function(docDocente) {
                    var detalleTemp = {
                      Descripcion: docDocente,
                    }
                    detallesTemporales.push(detalleTemp);
                    promesasDocentes.push(getDocente(detalleTemp));
                  })
                  $q.all(promesasDocentes)
                    .then(function() {
                      detalle.Descripcion = detallesTemporales.map(function(detalleTemp) {
                        return detalleTemp.Descripcion
                      }).join(", ");
                      defer.resolve();
                    })
                    .catch(function(error) {
                      defer.reject(error);
                    });
                  return defer.promise;
                }

                var getExterno = function(detalle) {
                  var defer = $q.defer();
                  var parametrosVinculado = $.param({
                    query: "TrabajoGrado:" + detalle.SolicitudTrabajoGrado.TrabajoGrado.Id,
                    limit: 0
                  });
                  poluxRequest.get("detalle_pasantia", parametrosVinculado)
                    .then(function(dataExterno) {
                      if (Object.keys(dataExterno.data[0]).length > 0) {
                        var temp = dataExterno.data[0].Observaciones.split(" y dirigida por ");
                        temp = temp[1].split(" con número de identificacion ");
                        detalle.Descripcion = temp[0];
                        defer.resolve();
                      } else {
                        defer.reject("No hay datos relacionados al director externo");
                      }
                    })
                    .catch(function(error) {
                      defer.reject(error);
                    });
                  return defer.promise;
                }

                angular.forEach(ctrl.detallesSolicitud, function(detalle) {
                  if(detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "CR"){
                    var parametrosConsulta = $.param({
                      query:"CodigoAbreviacion.in:A1_PLX|A2_PLX|B_PLX|C_PLX"
                    });

                    parametrosRequest.get("parametro/?", parametrosConsulta).then(function(parametros){
                      angular.forEach(parametros.data.Data, function(parametro){
                        if(detalle.Descripcion == String(parametro.Id)){
                          detalle.Descripcion = parametro.Nombre;
                        }
                      });
                    });
                  }
                  detalle.filas = [];
                  var id = detalle.DetalleTipoSolicitud.Detalle.Id;
                  var codigoAbreviacion = detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion;
                  if (codigoAbreviacion == "TF") {
                    detalle.Descripcion = detalle.Descripcion.split("-")[1];
                  } else if (codigoAbreviacion == "DAP" || codigoAbreviacion == "DANT" || codigoAbreviacion == "DIRN" || codigoAbreviacion == "EVANT" || codigoAbreviacion === "EVNU" ||
                              codigoAbreviacion === "ES" || codigoAbreviacion == "DDDI" || codigoAbreviacion === "SDC" || codigoAbreviacion === "CDA" || codigoAbreviacion === "CDN") {
                    if (detalle.Descripcion != "No solicita") {
                      promises.push(getDocente(detalle));
                    }
                  } else if (codigoAbreviacion == "NEA") {
                    promises.push(getDocentes(detalle));
                  } else if (codigoAbreviacion == "NADE") {
                    //detalle de director externo anterior
                    promises.push(getExterno(detalle));
                  } else if (detalle.Descripcion.includes("JSON-")) {
                    if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "ACON") {
                      //areas de conocimiento
                      var datosAreas = detalle.Descripcion.split("-");
                      datosAreas.splice(0, 1);
                      detalle.Descripcion = "";
                      angular.forEach(datosAreas, async function(area) {
                        var areaConocimiento
                        var parametroAreaConocimiento = $.param({
                          limit: 0
                        });
                        await parametrosRequest.get("parametro/" + JSON.parse(area).Id + "?", parametroAreaConocimiento).then(function (responseArea) {
                          areaConocimiento = responseArea.data.Data;
                        })
                        detalle.Descripcion = areaConocimiento.Nombre
                      });
                      detalle.Descripcion = detalle.Descripcion.substring(2);
                    } else if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "ESPELE" || detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "ESPELE2") {
                      //materias
                      var datosMaterias = detalle.Descripcion.split("-");
                      detalle.carrera = JSON.parse(datosMaterias[1]);
                      datosMaterias.splice(0, 2);
                      angular.forEach(datosMaterias, function(materia) {
                        detalle.filas.push(JSON.parse(materia));
                      });

                      detalle.gridOptions = [];
                      detalle.gridOptions.columnDefs = [{
                        name: 'CodigoAsignatura',
                        displayName: $translate.instant('CODIGO_MATERIA'),
                        width: '30%',
                      }, {
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
                ctrl.detallesSolicitud.solicitantes = solicitantes.substring(2) + ".";
                promises.push(getDocumentoRespuesta(fila, solicitud));
                $q.all(promises).then(function() {
                    $('#modalVerSolicitud').modal('show');
                  })
                  .catch(function(error) {
                    swal(
                      $translate.instant('ERROR'),
                      $translate.instant('ERROR.CARGAR_DETALLES_SOLICITUD'),
                      'warning'
                    );
                  });
              })
              .catch(function(error) {
                swal(
                  $translate.instant('ERROR'),
                  $translate.instant('ERROR.CARGAR_DATOS_ESTUDIANTES'),
                  'warning'
                );
              });
          })
          .catch(function(error) {
            swal(
              $translate.instant('ERROR'),
              $translate.instant('ERROR.CARGAR_DETALLES_SOLICITUD'),
              'warning'
            );
          });
      }

      /**
       * @ngdoc method
       * @name loadrow
       * @methodOf poluxClienteApp.controller:SolicitudesListarSolicitudesCtrl
       * @description
       * Ejecuta las funciones específicas de los botones seleccionados en el ui-grid
       * @param {Object} row Fila seleccionada en el uigrid que contiene los detalles de la solicitud que se quiere consultar
       * @param {String} operacion Operación que se debe ejecutar cuando se selecciona el botón
       * @returns {undefined} No retorna ningún valor
       */
      $scope.loadrow = function(row, operacion) {
        switch (operacion) {
          case "ver":
            ctrl.cargarDetalles(row)
            //$('#modalVerSolicitud').modal('show');
            break;
          case "responder":
            //$('#modalEvaluarSolicitud').modal('show');
            $location.path("solicitudes/aprobar_solicitud/" + row.entity.Id);
            break;
          default:
            break;
        }
      };
    });
