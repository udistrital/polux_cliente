'use strict';

/**
 * @ngdoc controller
 * @name poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
 * @description
 * # SolicitudesAprobarSolicitudCtrl
 * Controller of the poluxClienteApp
 * Controlador de la vista de aprobar_solicitud que permite al coordinador aprobar una solicitud de cualquier tipo
 * para acceder a la opción se debenn  incluir en los parametros de la url el id de la solicitud
 * @requires $location
 * @requires $q
 * @requires $routeParams
 * @requires $scope
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires $window
 * @requires services/parametrosService.service:parametrosRequest
 * @requires services/academicaService.service:academicaRequest
 * @requires services/poluxMidService.service:poluxMidRequest
 * @requires services/poluxService.service:poluxRequest
 * @requires services/poluxService.service:gestorDocumentalMidService
 * @requires services/poluxClienteApp.service:sesionesService
 * @requires services/poluxClienteApp.service:tokenService
 * @requires services/documentoService.service:documentoRequest
 * @property {Object} carrerasCoordinador Objeto que contiene las carreras asociadas al coordinador que aprueba la solicitud
 * @property {Object} respuestaActual Objeto que contiene la respuesta actual de la solicitud, que se encuentra en estado radicada.
 * @property {Boolean} noAprobar booleano que permite saber si se puede permitir o no aprobar a solicitud
 * @property {Object} fechaInicio Contiene la fecha de inicio del proceso de aprobación de solicitudes de materias de posgrado
 * @property {Object} fechaFin Contiene la fecha de fin del proceso de aprobación de solicitudes de materias de posgrado
 * @property {Object} detallesSolicitud Contiene los detalles asociados a la solicitud
 * @property {Object} detallesOriginal Contiene los detalles asociados a la solicitud originalmente
 * @property {Object} dataSolicitud Contiene los datos principales de la solicitud
 * @property {Object} docentes Contiene los docientes que pueden ser elegidos como evaluadores o directores de trabajo de grado que no estan asociados al trabajo de grado actual
 * @property {Object} docentesVinculadosTg Contiene los docenes vinculados al trabajo de grado
 * @property {Object} dataRespuesta Contiene la data de la respuesta que se va a registrar cuando se apruebe o rechace la solicitud
 * @property {Object} documentos Contiene las actas subidas a las carreras asocuadas al coordinador
 * @property {String} respuestaSolicitud Texto que carga la respuesta de la solicitud en atención
 * @property {String} justificacion Texto que carga la justificación de la solicitud en atención
 * @property {Number} solicitud Número que carga el identificador de la solicitud que llega al controlador
 * @property {Boolean} isInicial Identificador que decide si la solicitud es inicial
 * @property {Boolean} isCambio Identificador que decide si la solicitud es de cambio
 * @property {Boolean} isPasantia Identificador que decide si la solicitud es de pasantía
 * @property {Boolean} hasRevisor Identificador que decide si la solicitud tiene revisor asociado
 * @property {Array} acta Colección que maneja el contenido de las actas en el controlador
 * @property {Array} docentesVinculadosTg Colección que almacena el contenido de los docentes vinculados a la solicitud
 * @property {String} mensajeErrorCargaSolicitud Texto que aparece en caso de aparecer un error durante la carga de la solicitud
 * @property {Object} periodoSiguiente Objeto que carga la informración del periodo siguiente
 * @property {Object} fechaActual Objeto que carga la información de la fecha actual
 * @property {String} mensajeNoAprobar Texto que aparece en caso de haber un error durante la comprobación de las fechas
 * @property {Array} todoDetalles Colección que almacena el contenido de todos los detalles de la solicitud
 * @property {Object} docenteDirector Objeto que guarda la información del docente director
 * @property {Object} docenteCoDirector Objeto que guarda la información del docente co-director
 * @property {Object} docenteCambio Objeto que guarda la información del docente para el cambio
 * @property {Object} directorActualTg Objeto que guarda la información del director actual del trabajo de grado
 * @property {Object} directorOpcionTg Objeto que guarda la información del director opcionado para el trabajo de grado
 * @property {Array} evaluadoresActualesTg Colección que respalda la información de los evaluadores actuales del trabajo de grado
 * @property {Array} evaluadoresOpcionesTg Colección que respalda la información de los evaluadores opcionados para el trabajo de grado
 * @property {Array} areas Colección que maneja las áreas de conocimiento para el trabajo de grado
 * @property {Boolean} tieneCoDirector Indicador que maneja si en la solicitud aparece co-director del proyecto
 * @property {Array} evaluadoresInicial Colección que maneja el contenido de los evaluadores para inicio de solicitud
 * @property {Number} directorActual Valor que carga el identificador del director actual sobre la solicitud
 * @property {Number} directorNuevo Valor que carga el identificador del nuevo director sobre la solicitud
 * @property {Number} evaluadorActual Valor que carga el identificador del director actual sobre la solicitud
 * @property {Number} evaluadorNuevo Valor que carga el identificador del nuevo evaluador sobre la solicitud
 * @property {String} tituloNuevo Texto que carga el contenido del nuevo título para el trabajo de grado
 * @property {Number} asignaturaActual Valor que carga el identificador de la asignatura en curso
 * @property {Number} asignaturaNueva Valor que carga el identificador de la nueva asignatura a cursar
 * @property {Number} directorExternoActual Valor que carga el identificador del director externo que está vinculado al trabajo de grado
 * @property {String} nombreDirectorExternoNUevo Texto que carga el nombre del nuevo director externo a vincular al trabajo de grado
 * @property {Object} docenteCambio Objeto que carga la información del cambio de docente
 * @property {Number} codirector Valor que carga el identificador para el nuevo codirector del trabajo de grado
 * @property {String} docPropuestaFinal Texto que carga la información sobre el documeto para la propuesta final
 * @property {Boolean} switchCodirector Indicador que decide si se habilita la inscripción de co-director en la solicitud
 * @property {Object} trabajo_grado Objeto que carga la información sobre el trabajo de grado a registrarse con la solicitud
 * @property {Boolean} switchRevision Indicador que decide si se habilita el contenido para cambiar la vinculación
 * @property {Object} doc Objeto que carga la información sobre el documento que se obtiene
 * @property {Object} document Objeto que carga la información sobre el documento que se obtiene
 * @property {String} msgCargandoSolicitud Texto que aparece durante la carga de los detalles de la solicitud
 * @property {String} msgEnviandFormulario Texto que aparece durante el envío del formulario
 * @property {Boolean} loadSolicitud Indicador que maneja la carga de la solicitud
 * @property {Boolean} loadFormulario Indicador que maneja la carga del formulario
 * @property {Object} infiniteScroll Objeto que configura las propiedades para la barra de desplazamiento en la visualización
 * @property {Number} userId Valor que carga el código de identificación para el usuario
 * @property {Boolean} loadDocumento Indicador que maneja la carga del documento para la solicitud
 * @property {String} ObjetivoNuevo Texto que carga el contenido del nuevo objetivo para el trabajo de grado
 * @property {Object} modalidad Modalidad a la que pertenece la solicitud del trabajo de grado
 * @property {Objecto} tipoDocumento Tipos de documento
 * @property {Object} documentoSolicitud Documentos asociados a la solicitud
 */
angular.module('poluxClienteApp')
  .controller('SolicitudesAprobarSolicitudCtrl',
    function ($location, $q, $routeParams, notificacionRequest, $scope, $rootScope, utils, gestorDocumentalMidRequest, $translate, $window, parametrosRequest, academicaRequest, poluxRequest, poluxMidRequest, documentoRequest, sesionesRequest, token_service, autenticacionMidRequest) {
      var ctrl = this;

      ctrl.rol = "";
      ctrl.respuestaSolicitud = 0;
      ctrl.justificacion = "";
      ctrl.solicitud = $routeParams.idSolicitud;
      ctrl.prioridad = 0;
      ctrl.TipoSolicitud = [];
      ctrl.Modalidad = [];
      ctrl.EstadoSolicitud = [];
      ctrl.EstadoAsignaturaTrabajoGrado = [];
      ctrl.EstudianteTg = "";
      ctrl.EstadoEstudianteTrabajoGrado = [];
      ctrl.EstadoEspacioAcademicoInscrito = [];
      ctrl.TipoDocumento = [];
      ctrl.TipoDetalle = [];
      ctrl.RolTrabajoGrado = [];
      ctrl.tipoSolicitudTemp = [];
      ctrl.modalidadTemp = [];
      ctrl.estadoSolicitudTemp = [];
      ctrl.estadoAsignaturaTrabajoGradoTemp = [];
      ctrl.estadoEstudianteTrabajoGradoTemp = [];
      ctrl.detallesJson = "";
      //ctrl.pasantiaInterna = false;
      //ctrl.dataPersonaArl;
      //ctrl.SolicitudTrabajoGrado;
      var parametrosSolicitudes = $.param({
        query: "Id:" + ctrl.solicitud,
      });
      poluxRequest.get("solicitud_trabajo_grado", parametrosSolicitudes).then(function (responsesolicitud) {        
        ctrl.SolicitudTrabajoGrado = responsesolicitud.data.Data[0];       
        console.log("CONSULTA 1", ctrl.SolicitudTrabajoGrado); 
        ctrl.dataPersonaArl = JSON.parse(ctrl.SolicitudTrabajoGrado.DatosPersonalesArl);
        ctrl.pasantiaInterna = ctrl.dataPersonaArl.pasantiaInterna;
        console.log("Data__Solicitud_ARL", ctrl.dataPersonaArl);
        console.log("Data__Solicitud", ctrl.SolicitudTrabajoGrado);
        console.log("Fecha Nacimiento", ctrl.dataPersonaArl.fechaNacimiento);
      }).catch(function (error) {
      })
      ctrl.Noaprobardescripcion = "";
      $scope.msgCargandoSolicitud = $translate.instant("LOADING.CARGANDO_DETALLES_SOLICITUD");
      $scope.msgEnviandFormulario = $translate.instant('LOADING.ENVIANDO_FORLMULARIO');
      $scope.loadSolicitud = true;
      $scope.loadFormulario = false;
      ctrl.Respuestadocentebtn = 0;
      ctrl.isInicial = false;
      ctrl.isCambio = false;
      ctrl.isPasantia = false;
      ctrl.hasRevisor = false;

      //datos para el acta
      ctrl.acta = [];
      ctrl.acta.nombre = $translate.instant('DOCUMENTO.SIN_DOCUMENTO');
      ctrl.acta.url = "";

      ctrl.docentesVinculadosTg = [];

      //datos para infinite SolicitudesAprobarSolicitudCtrl//Infinite Scroll Magic
      $scope.infiniteScroll = {};
      $scope.infiniteScroll.numToAdd = 20;
      $scope.infiniteScroll.currentItems = 20;
      $scope.reloadScroll = function () {
        $scope.infiniteScrollcurrentItems = $scope.infiniteScroll.numToAdd;
      };
      $scope.addMoreItems = function () {
        $scope.infiniteScroll.currentItems += $scope.infiniteScroll.numToAdd;
      };
      ctrl.Docente = 0;
      ctrl.UnidadExtPasantia = 0;

      //carreras del coordinador
      /*  var parametrosCoordinador = {
          "identificacion":19451396,
          "tipo":"PREGRADO",
        };*/
      //$scope.userId=19451396;
      //token_service.token.documento = "79537917"; //Coordinador de artes
      //token_service.token.documento = "79647592" //Coordinador de sistemas
      //$scope.userId = parseInt(token_service.token.documento);
      $scope.userId = parseInt(token_service.getAppPayload().appUserDocument);
      ctrl.roles = token_service.getAppPayload().appUserRole;
      if (token_service.getAppPayload().appUserRole.includes("DOCENTE")) {
        ctrl.Docente = 1;
      }

      if (token_service.getAppPayload().appUserRole.includes("EXTENSION_PASANTIAS") && !token_service.getAppPayload().appUserRole.includes("COORDINADOR")) {
        ctrl.UnidadExtPasantia = 1;
      }
      ctrl.carrerasCoordinador = [];

      /**
       * @ngdoc method
       * @name getParametros
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {undefined} undefined No recibe ningún parámetro
       * @returns {Promise} Objeto de tipo promesa que consuta los parametros requeridos
       * @description 
       * se consueme el servicio {@link parametrosService.service:parametrosRequest parametrosRequest}
       */

      async function getParametros() {
        return new Promise(async (resolve, reject) => {
          //Solicitud inicial
          if (ctrl.tipoSolicitudTemp.CodigoAbreviacion == "SI_PLX" || ctrl.tipoSolicitudTemp.CodigoAbreviacion == "SRTG_PLX") {
            // MODALIDAD DE PASANTÍA
            if (ctrl.modalidadTemp.CodigoAbreviacion == "PAS_PLX") {              
              var parametrosConsulta = $.param({
                query: "CodigoAbreviacion.in:EMPRZ_PLX|CIIU_PLX|NIT_PLX"
              });
              //CONSULTA A PARAMETROS
              await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (parametros) {
                ctrl.parametro = parametros;
              });

              // MODALIDAD DE ARTICULO ACADEMICO
            } else if (ctrl.modalidadTemp.CodigoAbreviacion == "PACAD_PLX") {
              var parametrosConsultaArticulo = $.param({
                query: "CodigoAbreviacion.in:NRVS_PLX|LRVS_PLX|CRVS_PLX"
              });

              //CONSULTA A PARAMETROS
              const responseArticulo = await parametrosRequest.get("parametro/?", parametrosConsultaArticulo);
              ctrl.parametro = responseArticulo;

              var parametrosConsultaRevista = $.param({
                query: "CodigoAbreviacion.in:A1_PLX|A2_PLX|B_PLX|C_PLX"
              });

              const responseRevista = await parametrosRequest.get("parametro/?", parametrosConsultaRevista);
              ctrl.parametro_revista = responseRevista;
            }

            //SOLICITUD DE PRORROGA
          } else if (ctrl.tipoSolicitudTemp.CodigoAbreviacion == "SPR_PLX") {
            parametrosConsulta = $.param({
              query: "CodigoAbreviacion.in:JPR_PLX"
            });

            //CONSULTA A PARAMETROS
            await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (parametros) {
              ctrl.parametro = parametros;
            });
          }

          resolve();
        })
      }

      /**
       * @ngdoc method
       * @name openModalDataARL
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description
       * Cuando el estudiante esté realizando una solicitud inicial de Pasantía (interna) debe cargar datos personales, esta función abre el modal donde los va a ingresar
       * @param {undefined} undefined No requiere parámetros 
       */
      ctrl.openModalDataARL = function () {        
        // Mostrar el modal
          $('#modalVistaDataPersonalARL').modal('show');
        };

      /**
       * @ngdoc method
       * @name getCarrerasCoordinador
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {undefined} undefined No recibe ningún parámetro
       * @returns {Promise} Objeto de tipo promesa que resuelve las carreras del coordinador o la excepción gnerada
       * @description 
       * Consulta las carreras asociadas al coordinador
       * se consueme el servicio {@link academicaService.service:academicaRequest academicaRequest}
       */
      ctrl.getCarrerasCoordinador = function () {
        var rol = ""
        var defer = $q.defer();
        if (token_service.getAppPayload().appUserRole.includes("CONTRATISTA")) {

          academicaRequest.get("asistente_proyecto", [$scope.userId]).then(async function (responseAsistente) {

            if (!angular.isUndefined(responseAsistente.data.asistente.proyectos)) {
              ctrl.carrerasCoordinador = responseAsistente.data.asistente.proyectos;
              defer.resolve();
            } else {
              ctrl.mensajeErrorCargaSolicitud = $translate.instant("NO_CARRERAS_PREGRADO");
              defer.reject("Carreras no definidas");
            }
          }).catch(function (error) {
            ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_CARRERAS");
            defer.reject(error);
          });

        } else {
          academicaRequest.get("coordinador_carrera_snies", [$scope.userId]).then(function (response) {
            if (response.data.coordinadorCollection.coordinador[0].nivel == "PREGRADO") {
              rol = "PREGRADO";
              ctrl.rol = "PREGRADO";
            } else {
              rol = "POSGRADO";
              ctrl.rol = "POSGRADO";
            }

            academicaRequest.get("coordinador_carrera", [$scope.userId, rol]).then(function (response) {
              if (!angular.isUndefined(response.data.coordinadorCollection.coordinador)) {
                ctrl.carrerasCoordinador = response.data.coordinadorCollection.coordinador;
                defer.resolve();
              } else {
                ctrl.mensajeErrorCargaSolicitud = $translate.instant("NO_CARRERAS_PREGRADO");
                defer.reject("Carreras no definidas");
              }
            }).catch(function (error) {
              ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_CARRERAS");
              defer.reject(error);
            });

          }).catch(function (error) {
            defer.reject(error);
          });      
        }
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name getRespuestaSolicitud
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {undefined} undefined No recibe ningún parámetro
       * @returns {Promise} Objeto de tipo promesa que se resuelve con la respuesta de la solicitud o la excepción generada
       * @description 
       * Consulta si la respuesta tiene una respuesta asociada actualmente en el servicio {@link services/poluxService.service:poluxRequest poluxRequest} y bloquea el formulario que permite aprobar la solicitud.
       */
      ctrl.getRespuestaSolicitud = function () {
        var defer = $q.defer();
        var parametros = $.param({
          query: "SolicitudTrabajoGrado.Id:" + ctrl.solicitud + ",Activo:TRUE"
        });
        poluxRequest.get("respuesta_solicitud", parametros).then(async function (responseRespuesta) {
          if (Object.keys(responseRespuesta.data.Data[0]).length > 0) {
            ctrl.respuestaActual = responseRespuesta.data.Data[0];
            var estadoSolicitud = $.param({
              query: "TipoParametroId__CodigoAbreviacion:EST_SOL",
              limit: 0
            });
            await parametrosRequest.get("parametro/?", estadoSolicitud).then(function (responseEstadoSolicitud) {
              ctrl.EstadoSolicitud = responseEstadoSolicitud.data.Data;
            })
            let estadoSolicitudTemp = ctrl.EstadoSolicitud.find(est => {
              return est.Id == ctrl.respuestaActual.EstadoSolicitud
            })
            ctrl.estadoSolicitudTemp = estadoSolicitudTemp
            var respuestas = ["RDC_PLX", "ADD_PLX", "APEP_PLX", "ACPR_PLX", "ACPO1_PLX", "ACPO2_PLX", "RCPO1_PLX", "RCPO2_PLX"]
            if (!respuestas.includes(ctrl.estadoSolicitudTemp.CodigoAbreviacion)) {
              ctrl.mensajeNoAprobar += ' ' + $translate.instant('SOLICITUD_CON_RESPUESTA');
              ctrl.noAprobar = true;
            }
            defer.resolve();
          } else {
            ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_RESPUESTA_SOLICITUD");
            defer.reject("no hay respuesta");
          }
        })
          .catch(function (error) {
            ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_RESPUESTA_SOLICITUD");
            defer.reject(error);
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name getFechasAprobacion
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {Number} idModalidadTipoSolicitud Identificador de modalidad_tipo_solicitud que permite saber el tipo de solicitud y la modaliad a la que pertenece
       * @returns {Promise} Objeto de tipo promesa que indica si se cumplen las fechas de aprobación o se rechaza con la excepción generada
       * @description 
       * Si el idModalidadTipoSolicitud es igual a 13 (solicitud inicial de materias de posgrado) consulta las fechas asociadas al proceso de solicitudes en el servicio
       * {@link services/poluxClienteApp.service:sesionesService sesionesService}, con el periodo que consulta de 
       * {@link services/academicaService.service:academicaRequest academicaRequest}.
       */
      ctrl.getFechasAprobacion = function () {
        var defer = $q.defer();
        //si la solicitud es de tipo inicial en la modalidad de materias de posgrado (13) o de profundizacion (16)
        if (ctrl.tipoSolicitudTemp.CodigoAbreviacion === "SI_PLX" && (ctrl.modalidadTemp.CodigoAbreviacion == "EAPOS_PLX" || ctrl.modalidadTemp.CodigoAbreviacion == "EAPRO_PLX")) {
          academicaRequest.get("periodo_academico", "P") //Aquí debe ir "X" pero aún no hay datos en dicho periodo académico, así que por el momento uso la "P"
            .then(function (responsePeriodo) {
              if (!angular.isUndefined(responsePeriodo.data.periodoAcademicoCollection.periodoAcademico)) {
                ctrl.periodoSiguiente = responsePeriodo.data.periodoAcademicoCollection.periodoAcademico[0];
                var tipoSesionPadre = 0;
                if (ctrl.modalidadTemp.CodigoAbreviacion == "EAPOS_PLX") {
                  //Materias de posgrado
                  tipoSesionPadre = 1;
                } else {
                  //Materias de profundizacion
                  //idModalidadTipoSolicitud === 16
                  tipoSesionPadre = 9;
                }
                var parametrosSesiones = $.param({
                  query: "SesionPadre.TipoSesion.Id:" + tipoSesionPadre + ",SesionHijo.TipoSesion.Id:8,SesionPadre.periodo:" + ctrl.periodoSiguiente.anio + ctrl.periodoSiguiente.periodo,
                  limit: 1
                });
                sesionesRequest.get("relacion_sesiones", parametrosSesiones)
                  .then(function (responseFechas) {
                    if (Object.keys(responseFechas.data[0]).length > 0) {
                      //ctrl.fechaActual = moment(new Date()).format("YYYY-MM-DD HH:mm"); Se usa la fecha actual para hacaer la comparación

                      var sesion = responseFechas.data[0];
                      
                      var fechaHijoInicio = new Date(sesion.SesionHijo.FechaInicio);
                      fechaHijoInicio.setTime(fechaHijoInicio.getTime() + fechaHijoInicio.getTimezoneOffset() * 60 * 1000);
                      ctrl.fechaInicio = moment(fechaHijoInicio).format("YYYY-MM-DD HH:mm");
                      
                      var fechaHijoFin = new Date(sesion.SesionHijo.FechaFin);
                      fechaHijoFin.setTime(fechaHijoFin.getTime() + fechaHijoFin.getTimezoneOffset() * 60 * 1000);
                      ctrl.fechaFin = moment(fechaHijoFin).format("YYYY-MM-DD HH:mm");

                      ctrl.fechaActual = moment(fechaHijoFin).format("YYYY-MM-DD HH:mm"); //Pondré la fecha hijo fin de la petición para poder continuar con el desarrollo, pero esto se debe cambiar por la actual
                      
                      if (ctrl.fechaInicio <= ctrl.fechaActual && ctrl.fechaActual <= ctrl.fechaFin) {
                        defer.resolve();
                      } else {
                        ctrl.mensajeNoAprobar += ' ' + $translate.instant('ERROR.NO_EN_FECHAS_APROBACION', {
                          inicio: ctrl.fechaInicio,
                          fin: ctrl.fechaFin
                        });
                        ctrl.noAprobar = true;
                        defer.resolve();
                      }
                    } else {
                      ctrl.mensajeNoAprobar += ' ' + $translate.instant('ERROR.SIN_FECHAS_MODALIDAD');
                      ctrl.noAprobar = true;
                      defer.resolve();
                    }
                  })
                  .catch(function () {
                    ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_FECHAS_MODALIDAD");
                    defer.reject("no se pudo cargar fechas");
                  });
              } else {
                ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.SIN_PERIODO");
                defer.reject("sin periodo");
              }
            })
            .catch(function (error) {
              ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGANDO_PERIODO");
              defer.reject(error);
            });
        } else {
          defer.resolve();
        }
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name getDetallesSolicitud
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {Object} parametrosDetalleSolicitud Parámetros necesarios para hacer las consultas
       * @returns {Promise} Objeto de tipo promesa que indica si se cumple la consulta de las solicitudes o se rechaza con la excepción generada
       * @description 
       * Consulta los detalles y usuarios asociados a la solicitud del servicio 
       * {@link services/poluxService.service:poluxRequest poluxRequest} para poder mostrarlos en el formulario.
       * En caso de que la descripción del dellate tenga el documento de un docente se usa el servicio {@link services/academicaService.service:academicaRequest academicaRequest}
       * para consultar los datos del docente, por último si el detalle es un JSON lo divide y formatea como correspoda.
       */
      ctrl.getDetallesSolicitud = async function (parametrosDetallesSolicitud) {
        var defered = $q.defer();
        var promise = defered.promise;
        var carrerasAux = [];
        var parametrosEstadoSolicitud = $.param({
          limit: 0
        });

        await asignarParametros();
        await getParametros();
        console.log("ACA INICIA");
        console.log("Pasantía Interna", ctrl.pasantiaInterna);
        poluxRequest.get("estado_solicitud", parametrosEstadoSolicitud).then(function (responseEstadoSolicitud) {
          if (Object.keys(responseEstadoSolicitud.data.Data[0]).length > 0) {
            ctrl.estadoSolicitud = responseEstadoSolicitud.data.Data;
          }
        });        
        poluxRequest.get("detalle_solicitud", parametrosDetallesSolicitud).then(function (responseDetalles) {
          poluxRequest.get("usuario_solicitud", parametrosDetallesSolicitud).then(async function (responseEstudiantes) {
            poluxRequest.get("documento_solicitud", parametrosDetallesSolicitud).then(function (responseDocumentoSolicitud) {
              ctrl.documentoSolicitud = [];
              angular.forEach(responseDocumentoSolicitud.data.Data, function (documentoSol) {
                if (documentoSol.DocumentoEscrito) {
                  var parametrosDocumentoEscrito = $.param({
                    query: "Id:" + documentoSol.DocumentoEscrito.Id,
                    limit: 0
                  });
                  poluxRequest.get("documento_escrito", parametrosDocumentoEscrito).then(function (responseDocumentoEscrito) {
                    ctrl.documentoSolicitud.push(responseDocumentoEscrito.data.Data[0]);
                  });
                }
              })
            });
            ctrl.EstudianteTg = responseEstudiantes.data.Data[0].Usuario;
            ctrl.modalidad = responseEstudiantes.data.Data[0].SolicitudTrabajoGrado.ModalidadTipoSolicitud.Modalidad;
            if (Object.keys(responseDetalles.data.Data[0]).length === 0) {
              ctrl.detallesSolicitud = [];
            } else {
              var tipoDetalle = $.param({
                query: "TipoParametroId__CodigoAbreviacion:TIP_DET",
                limit: 0
              });
              await parametrosRequest.get("parametro/?", tipoDetalle).then(function (responseTipoDetalle) {
                ctrl.TipoDetalle = responseTipoDetalle.data.Data;
              })
              ctrl.detallesSolicitud = responseDetalles.data.Data;
              ctrl.detallesSolicitud.forEach(detalle => {
                detalle.DetalleTipoSolicitud.Detalle.TipoDetalleAux = ctrl.TipoDetalle.find(datatipoDetalle => {
                  return datatipoDetalle.Id == detalle.DetalleTipoSolicitud.Detalle.TipoDetalle
                })
              });
            }
            var solicitantes = "";
            angular.forEach(ctrl.carrerasCoordinador, function (carreraCoord) {
              carrerasAux.push(parseInt(carreraCoord.codigo_proyecto_curricular));
            })
            angular.forEach(ctrl.detallesSolicitud, function (detalleAux) {
              if (detalleAux.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "ESPELE" || detalleAux.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "ESPELE2") {
                /*var datosMaterias = detalleAux.Descripcion.split("-");
                var carrera = JSON.parse(datosMaterias[1]);
                if (!carrerasAux.includes(carrera.Codigo) && token_service.getAppPayload().appUserRole.includes("POSGRADO")) {
                  var index = ctrl.detallesSolicitud.indexOf(detalleAux)
                  ctrl.detallesSolicitud.splice(index, 1)
                }*/
              }
              if (detalleAux.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "PEAP") {
                ctrl.prioridad = parseInt(detalleAux.Descripcion)
              }
            });
            
            console.log("ctrl.detallesSolicitud", ctrl.detallesSolicitud);

            let deleteDetalle;

            //Recorrer los detalles con Codigo de Abreviación ESPELE y ESPELE2
            for (let i = 0; i < ctrl.detallesSolicitud.length; i++) {
              if (ctrl.detallesSolicitud[i].DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "ESPELE" || ctrl.detallesSolicitud[i].DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "ESPELE2") {                    
                //Quitar el primer fragmento del string 'JSON-'
                var detalleString = ctrl.detallesSolicitud[i].Descripcion.replace("JSON-", "");
                
                if (ctrl.detallesSolicitud[i].DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "ESPELE") {
                  console.log("Entre a ESPELE");

                  //Convertir el JSON en objeto si es ESPELE (Proyecto Curricular 1)
                  var infoESPELE = JSON.parse(detalleString);

                  if(infoESPELE.Codigo == $rootScope.codigoProyectoCurricularPosgrado) {
                    deleteDetalle = "ESPELE2";
                    break;
                  }
                }
                else {
                  console.log("Entre a ESPELE2");
                  //Convertir el JSON en objeto si es ESPELE2 (Proyecto Curricular 2)
                  var infoESPELE2 = JSON.parse(detalleString);

                  if(infoESPELE2.Codigo == $rootScope.codigoProyectoCurricularPosgrado) {
                    deleteDetalle = "ESPELE";
                    break;
                  }
                }
              }
            }
            console.log("deleteDetalle", deleteDetalle);

            //Eliminar el detalle del proyecto curricular del cuál actualmente no se tiene seleccionado
            ctrl.detallesSolicitud = ctrl.detallesSolicitud.filter(detalle => {
              const codigoAbreviacion = detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion;
              return codigoAbreviacion !== deleteDetalle;
            })

            ctrl.detallesSolicitud.id = ctrl.solicitud;
            ctrl.detallesSolicitud.tipoSolicitud = ctrl.dataSolicitud.ModalidadTipoSolicitud;
            ctrl.detallesSolicitud.fechaSolicitud = ctrl.dataSolicitud.Fecha.toString().substring(0, 10);
            ctrl.detallesSolicitud.PeriodoAcademico = ctrl.dataSolicitud.PeriodoAcademico;
            angular.forEach(responseEstudiantes.data.Data, function (estudiante) {
              solicitantes += (", " + estudiante.Usuario);
            });

            ctrl.todoDetalles = [];
            var promises = [];

            //PARA EJECUTAR LA FUNCION DE PARAMETROS
            //promises.push(ctrl.getParametros());
            var getDocente = function (codigoAbreviacion, detalle) {
              var defer = $q.defer();
              academicaRequest.get("docente_tg", [detalle.Descripcion]).then(function (docente) {
                if (!angular.isUndefined(docente.data.docenteTg.docente)) {

                  detalle.Descripcion = docente.data.docenteTg.docente[0].id + " " + docente.data.docenteTg.docente[0].nombre;
                  // ids detalle se deben modificar
                  if (codigoAbreviacion == "DAP" || codigoAbreviacion == "DDDI") {
                    ctrl.docenteDirector = {
                      "NOMBRE": docente.data.docenteTg.docente[0].nombre,
                      "id": docente.data.docenteTg.docente[0].id,
                    };
                    //
                  }

                  //docente codirector solicitado
                  // id detalle
                  if (codigoAbreviacion == "SDC") {
                    ctrl.docenteCoDirector = {
                      "NOMBRE": docente.data.docenteTg.docente[0].nombre,
                      "id": docente.data.docenteTg.docente[0].id,
                    };
                  }

                  //docente solicitado para el cambio
                  // id detalle
                  if (codigoAbreviacion == "DIRN" || codigoAbreviacion == "EVNU" || codigoAbreviacion == "CDN") {
                    ctrl.docenteCambio = {
                      "NOMBRE": docente.data.docenteTg.docente[0].nombre,
                      "id": docente.data.docenteTg.docente[0].id,
                    };
                  }

                  //docente en solicitud de socialización o de director
                  // id detalle
                  if (codigoAbreviacion == "DANT") {
                    ctrl.directorActualTg = {
                      "NOMBRE": docente.data.docenteTg.docente[0].nombre,
                      "id": docente.data.docenteTg.docente[0].id,
                    };
                    ctrl.directorOpcionTg = {
                      "NOMBRE": docente.data.docenteTg.docente[0].nombre,
                      "id": docente.data.docenteTg.docente[0].id,
                    };
                  }

                  defer.resolve();
                } else {
                  ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_VINCULADOS_TRABAJO_GRADO");
                  defer.reject(error);
                }
              })
                .catch(function (error) {
                  ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_VINCULADOS_TRABAJO_GRADO");
                  defer.reject(error);
                });
              return defer.promise;
            }

            var getDocentes = function (detalle) {
              var defer = $q.defer();
              var promesasDocentes = [];
              var detallesTemporales = [];

              angular.forEach(detalle.Descripcion.split(","), function (docDocente) {
                var detalleTemp = {
                  Descripcion: docDocente,
                  id: docDocente,
                }
                detallesTemporales.push(detalleTemp);
                promesasDocentes.push(getDocente(0, detalleTemp));
              })
              $q.all(promesasDocentes)
                .then(function () {
                  detalle.Descripcion = detallesTemporales.map(function (detalleTemp) {
                    return detalleTemp.Descripcion
                  }).join(", ");
                  if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "NEA") {
                    for (var j = 0; j < detallesTemporales.length; j++) {
                      detallesTemporales[j].label = (detallesTemporales.length > 1) ? $translate.instant('SELECT.EVALUADOR_NUMERO', {
                        numero: (j + 1)
                      }) : $translate.instant('SELECT.DOCENTE_REVISOR');
                      detallesTemporales[j].docente = {
                        NOMBRE: detallesTemporales[j].Descripcion.substring(detallesTemporales[j].Descripcion.indexOf(" ") + 1),
                        id: detallesTemporales[j].id,
                      }
                    }
                    ctrl.evaluadoresActualesTg = angular.copy(detallesTemporales);
                    ctrl.evaluadoresOpcionesTg = angular.copy(detallesTemporales);
                  }
                  defer.resolve();
                })
                .catch(function (error) {
                  defer.reject(error);
                });
              return defer.promise;
            }

            var getExterno = function (detalle) {
              var defer = $q.defer();
              var parametrosVinculado = $.param({
                query: "TrabajoGrado:" + detalle.SolicitudTrabajoGrado.TrabajoGrado.Id,
                limit: 0
              });
              poluxRequest.get("detalle_pasantia", parametrosVinculado)
                .then(function (dataExterno) {
                  if (Object.keys(dataExterno.data.Data[0]).length > 0) {
                    var temp = dataExterno.data.Data[0].Observaciones.split(" y dirigida por ");
                    temp = temp[1].split(" con número de identificacion ");
                    detalle.Descripcion = temp[0];
                    detalle.documentoExterno = temp[1];
                    defer.resolve();
                  } else {
                    defer.reject("No hay datos relacionados al director externo");
                  }
                })
                .catch(function (error) {
                  defer.reject(error);
                });
              return defer.promise;
            }
            angular.forEach(ctrl.detallesSolicitud, function (detalle) {
              ctrl.todoDetalles.push(detalle);

              detalle.filas = [];
              var codigoAbreviacion = detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion

              if (codigoAbreviacion == "TD") {
                detalle.Descripcion = detalle.Descripcion.split("-")[1];
              } else if (codigoAbreviacion == "DAP" || codigoAbreviacion == "DANT" || codigoAbreviacion == "DIRN" || codigoAbreviacion == "EVANT" || codigoAbreviacion == "EVNU" ||
                codigoAbreviacion == "ES" || codigoAbreviacion == "DDDI" || codigoAbreviacion == "SDC" || codigoAbreviacion == "CDA" || codigoAbreviacion == "CDN") {
                if (detalle.Descripcion != "No solicita") {
                  promises.push(getDocente(codigoAbreviacion, detalle));
                }
              } else if (codigoAbreviacion == "NEA") {
                promises.push(getDocentes(detalle));
              } else if (codigoAbreviacion == "NADE") {
                //detalle de director externo anterior
                promises.push(getExterno(detalle));
              } else if (detalle.Descripcion.includes("JSON-")) {
                if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "ACON") {
                  //areas de conocimiento
                  ctrl.areas = []
                  var datosAreas = detalle.Descripcion.split("-");
                  datosAreas.splice(0, 1); //Eliminar la primera parte que es "JSON-"
                  detalle.Descripcion = "";
                  var areaConocimiento = ""; // Inicializamos la variable como una cadena vacía
                  angular.forEach(datosAreas, async function(area) {
                    var parametroAreaConocimiento = $.param({
                      limit: 0
                    });
                    await parametrosRequest.get("parametro/" + JSON.parse(area).Id + "?", parametroAreaConocimiento).then(function (responseArea) {
                      var nombreArea = responseArea.data.Data.Nombre; // Obtenemos el nombre del área de conocimiento
                      if (areaConocimiento.length > 0) {
                        areaConocimiento += " - "; // Si ya hay un nombre, agregamos una guión para separarlos
                      }
                      areaConocimiento += nombreArea; // Concatenamos el nombre del área
                    })
                    ctrl.areas.push(JSON.parse(area).Id);
                    detalle.Descripcion = areaConocimiento;
                  });
                } else if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "ESPELE" || detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "ESPELE2") {
                  //materias
                  var datosMaterias = detalle.Descripcion.split("-");
                  detalle.carrera = JSON.parse(datosMaterias[1]);
                  datosMaterias.splice(0, 2);
                  angular.forEach(datosMaterias, function (materia) {
                    detalle.filas.push(JSON.parse(materia));

                  });

                  /*detalle.gridOptions = [];
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
                  detalle.gridOptions.data = detalle.filas;*/
                }
              }
              // Si la solicitud tiene un detalle con id 56 es por que tiene codirector
              if (codigoAbreviacion === "SDC") {
                ctrl.tieneCoDirector = true;
              }
            });
            console.log("ctrl.detallesSolicitud", ctrl.detallesSolicitud)
            $q.all(promises).then(function () {
              //CAMBIO DE VISUALIZACIÓN DE PARAMETRO
              angular.forEach(ctrl.detallesSolicitud, function (data_detalle) {
                if (data_detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "CR") {
                  angular.forEach(ctrl.parametro_revista.data.Data, function (PR) {
                    if (data_detalle.Descripcion == String(PR.Id)) {
                      data_detalle.Descripcion = PR.Nombre;
                    }
                  });
                }
              });

              ctrl.detallesSolicitud.solicitantes = solicitantes.substring(2);
              defered.resolve(ctrl.detallesSolicitud);
            })
              .catch(function (error) {
                ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_DATOS_SOLICITUD");
                defered.reject(error);
              });
          })
            .catch(function (error) {
              ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_DATOS_ESTUDIANTES");
              defered.reject(error);
            });
        })
          .catch(function (error) {
            ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_DETALLES_SOLICITUD");
            defered.reject(error);
          });
        return promise;
      };

      async function asignarParametros() {
        return new Promise(async (resolve, reject) => {
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
          var estadoEstudianteTrabajoGrado = $.param({
            query: "TipoParametroId__CodigoAbreviacion:EST_ESTU_TRG",
            limit: 0
          });
          await parametrosRequest.get("parametro/?", estadoEstudianteTrabajoGrado).then(function (responseEstadoEstudianteTrabajoGrado) {
            ctrl.EstadoEstudianteTrabajoGrado = responseEstadoEstudianteTrabajoGrado.data.Data;
          })
          var estadoAsignaturaTrabajoGrado = $.param({
            query: "TipoParametroId__CodigoAbreviacion:EST_ASIG_TRG",
            limit: 0
          });
          await parametrosRequest.get("parametro/?", estadoAsignaturaTrabajoGrado).then(function (responseEstadoAsignaturaTrabajoGrado) {
            ctrl.EstadoAsignaturaTrabajoGrado = responseEstadoAsignaturaTrabajoGrado.data.Data;
          })
          var estadoEspacioAcademicoInscrito = $.param({
            query: "TipoParametroId__CodigoAbreviacion:EST_ESP",
            limit: 0
          });
          await parametrosRequest.get("parametro/?", estadoEspacioAcademicoInscrito).then(function (responseEstadoEspacioAcademicoInscrito) {
            ctrl.EstadoEspacioAcademicoInscrito = responseEstadoEspacioAcademicoInscrito.data.Data;
          })
          var rolTrabajoGrado = $.param({
            query: "TipoParametroId__CodigoAbreviacion:ROL_TRG",
            limit: 0
          });
          await parametrosRequest.get("parametro/?", rolTrabajoGrado).then(function (responseRolTrabajoGrado) {
            ctrl.RolTrabajoGrado = responseRolTrabajoGrado.data.Data;
          })
          var parametroTipoDocumento = $.param({
            query: "DominioTipoDocumento__CodigoAbreviacion:DOC_PLX",
            limit: 0
          });
          await documentoRequest.get("tipo_documento", parametroTipoDocumento).then(function (responseTipoDocumento) {
            ctrl.TipoDocumento = responseTipoDocumento.data;
          })
          //SOLICITUD INICIAL
          let tipoSolicitudTemp = ctrl.TipoSolicitud.find(tipo => {
            return tipo.Id == ctrl.dataSolicitud.ModalidadTipoSolicitud.TipoSolicitud
          })
          let modalidadTemp = ctrl.Modalidad.find(mod => {
            return mod.Id == ctrl.dataSolicitud.ModalidadTipoSolicitud.Modalidad
          })
          let estadoAsignaturaTrabajoGradoTemp = ctrl.EstadoAsignaturaTrabajoGrado.find(estAsig => {
            return estAsig.CodigoAbreviacion == "CND_PLX"
          })
          ctrl.tipoSolicitudTemp = tipoSolicitudTemp
          ctrl.modalidadTemp = modalidadTemp
          ctrl.estadoAsignaturaTrabajoGradoTemp = estadoAsignaturaTrabajoGradoTemp
          resolve();
        });
      }

      /**
       * @ngdoc method
       * @name evaluarSolicitud
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} Objeto de tipo promesa que indica si se cumple la consulta para evaluar la solicitud
       * @description 
       * Verifica el tipo de solicitud y guarda sus datos, si la solicitud no es de tipo de materias de posgrado consulta los docentes disponibles 
       * para dirigir trabajos de grado del servicio docentes_tg de {@link services/academicaService.service:academicaRequest academicaRequest}.
       */
      ctrl.evaluarSolicitud = async function () {
        var defer = $q.defer();
        var promise = defer.promise;
        await asignarParametros();
        //await getParametros();
        ctrl.dataSolicitud.TipoSolicitud = ctrl.tipoSolicitudTemp.Id;
        ctrl.dataSolicitud.NombreTipoSolicitud = ctrl.tipoSolicitudTemp.Nombre
        ctrl.dataSolicitud.NombreModalidad = ctrl.modalidadTemp.Nombre;
        ctrl.dataSolicitud.modalidad = ctrl.modalidadTemp.Id;
        if (ctrl.tipoSolicitudTemp.CodigoAbreviacion === "SI_PLX") {
          if (ctrl.modalidadTemp.CodigoAbreviacion != "EAPOS_PLX" && ctrl.modalidadTemp.CodigoAbreviacion != "EAPRO_PLX") {
            ctrl.isInicial = true;
            //Si no es de materias de posgrado y profundización trae los docentes
            academicaRequest.get("docentes_tg").then(function (docentes) {
              if (!angular.isUndefined(docentes.data.docentesTg.docente)) {
                ctrl.docentes = docentes.data.docentesTg.docente;
                defer.resolve(ctrl.docentes);
              }
            })
              .catch(function (error) {
                ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_DOCENTES");
                defer.reject(error);
              });
            if (ctrl.modalidadTemp.CodigoAbreviacion == "PAS_PLX") {
              ctrl.isPasantia = true;
            }
          } else {
            defer.resolve(ctrl.dataSolicitud.modalidad);
          }
        } else if (ctrl.tipoSolicitudTemp.CodigoAbreviacion == "SCDI_PLX" || ctrl.tipoSolicitudTemp.CodigoAbreviacion == "SCE_PLX" || ctrl.tipoSolicitudTemp.CodigoAbreviacion == "SCCI_PLX") {
          ctrl.isCambio = true;
          academicaRequest.get("docentes_tg").then(function (docentes) {
            if (!angular.isUndefined(docentes.data.docentesTg.docente)) {
              ctrl.docentes = docentes.data.docentesTg.docente;
              defer.resolve(ctrl.docentes);
            }
          })
            .catch(function (error) {
              ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_DOCENTES");
              defer.reject(error);
            });
        } else if (ctrl.tipoSolicitudTemp.CodigoAbreviacion == "SRTG_PLX" || ctrl.tipoSolicitudTemp.CodigoAbreviacion == "SSO_PLX") {
          ctrl.isRevision = true;
          academicaRequest.get("docentes_tg").then(function (docentes) {
            if (!angular.isUndefined(docentes.data.docentesTg.docente)) {
              ctrl.docentes = docentes.data.docentesTg.docente;
              defer.resolve(ctrl.docentes);
            }
          })
            .catch(function (error) {
              ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_DOCENTES");
              defer.reject(error);
            });
        } else {
          defer.resolve(ctrl.dataSolicitud.modalidad);
        }
        return promise;
      };

      /**
       * @ngdoc method
       * @name getEvaluadores
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {Object} solicitud Objeto de tipo solicitud
       * @returns {Promise} Objeto de tipo promesa que indica si se cumple la consulta para traer los evaluadores vinculados
       * @description 
       * Función que llama al servicio {@link services/poluxMidService.service:poluxMidRequest poluxMidRequest} para
       * consultar el número de evaluadores máximo que puede tener la modalidad.
       */
      ctrl.getEvaluadores = function (solicitud) {
        var defer = $q.defer();
        poluxMidRequest.post("evaluadores/ObtenerEvaluadores", {
          "Modalidad": solicitud
        }).then(function (response) {
          ctrl.evaluadoresInicial = new Array(parseInt(response.data.Data.cantidad_evaluadores));
          for (var i = 0; i < ctrl.evaluadoresInicial.length; i++) {
            var label = (ctrl.evaluadoresInicial.length > 1) ? $translate.instant('SELECT.EVALUADOR_NUMERO', {
              numero: (i + 1)
            }) : $translate.instant('SELECT.DOCENTE_REVISOR');
            ctrl.evaluadoresInicial[i] = {
              indice: i + 1,
              label: label,
            };
          }
          ctrl.hasRevisor = ctrl.evaluadoresInicial.length > 0;
          defer.resolve(ctrl.evaluadoresInicial);
        })
          .catch(function (error) {
            console.log(error)
            ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_EVALUADORES");
            defer.reject(error);
          });
        return defer.promise;
      };

      /**
       * @ngdoc method
       * @name docenteVinculado
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {Object} vinculados Docentes vinculados al trabajo de grado
       * @param {Object} docente Documento del docente que se confronta para ver si se encuentra vinculado
       * @returns {Boolean} Indicador que define si el docente tiene vinculación a la solicitud de trabajo de grado
       * @description 
       * Verifica si un docente se encuentra vinculado al trabajo de grado de un estudiante
       */
      ctrl.docenteVinculado = function (vinculados, docente) {
        var esta = false;
        angular.forEach(vinculados, function (vinculado) {
          if (vinculado.Usuario == docente) {
            esta = true;
          }
        });
        return esta;
      };

      var parametrosSolicitud = $.param({
        query: "Id:" + ctrl.solicitud,
        limit: 1
      });

      poluxRequest.get("solicitud_trabajo_grado", parametrosSolicitud).then(async function (responseSolicitud) {   
        console.log("CONSULTA 2");     
        if (Object.keys(responseSolicitud.data.Data[0]).length > 0) {
          var parametrosDetallesSolicitud = $.param({
            query: "SolicitudTrabajoGrado.Id:" + ctrl.solicitud,
            limit: 0
          });
          ctrl.mensajeNoAprobar = $translate.instant('ERROR') + ':';
          ctrl.dataSolicitud = responseSolicitud.data.Data[0];

          var promises = [];
          if (ctrl.Docente === 1 || ctrl.UnidadExtPasantia === 1) {            
            /*var parametro = ({
              "modalidad_tipo_solicitud": responseSolicitud.data.Data[0].ModalidadTipoSolicitud,
            });*/
          }
          else {
            promises.push(ctrl.getCarrerasCoordinador());
            promises.push(ctrl.getRespuestaSolicitud());
          }
          promises.push(ctrl.getDetallesSolicitud(parametrosDetallesSolicitud));
          promises.push(await ctrl.evaluarSolicitud());
          promises.push(ctrl.getEvaluadores(ctrl.dataSolicitud.ModalidadTipoSolicitud.Modalidad));
          //obtener fechas de aprobación para la solicitud
          promises.push(ctrl.getFechasAprobacion());
          $q.all(promises).then(function () {
            if (ctrl.dataSolicitud.TrabajoGrado !== null) {
              var parametrosVinculacion = $.param({
                query: "Activo:true,TrabajoGrado:" + ctrl.dataSolicitud.TrabajoGrado.Id,
                limit: 0
              });
              poluxRequest.get("vinculacion_trabajo_grado", parametrosVinculacion).then(function (docentesVinculados) {
                if (Object.keys(docentesVinculados.data.Data[0]).length > 0) {
                  var vinculados = [];
                  ctrl.docentesVinculadosTg = docentesVinculados.data.Data;
                  angular.forEach(ctrl.docentes, function (docente) {
                    if (ctrl.docenteVinculado(docentesVinculados.data.Data, docente.id)) {

                      vinculados.push(docente);
                    }
                  });
                  angular.forEach(vinculados, function (docente) {
                    var index = ctrl.docentes.indexOf(docente);
                    ctrl.docentes.splice(index, 1);
                  });
                  $scope.loadSolicitud = false;
                } else {
                  $scope.loadSolicitud = false;
                }
              })
                .catch(function (error) {

                  ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_VINCULADOS_TRABAJO_GRADO");
                  ctrl.errorCargarSolicitud = true;
                  $scope.loadSolicitud = false;
                });
            } else {
              $scope.loadSolicitud = false;
            }
          })
            .catch(function (error) {
              console.log("FALLA ", error)
              ctrl.errorCargarSolicitud = true;
              $scope.loadSolicitud = false;
            });
        } else {
          ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.SOLICITUD_NO_ENCONTRADA");
          ctrl.errorCargarSolicitud = true;
          $scope.loadSolicitud = false;
        }
      })
        .catch(function (error) {

          ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.SOLICITUD_NO_ENCONTRADA");
          ctrl.errorCargarSolicitud = true;
          $scope.loadSolicitud = false;
        });

      /**
       * @ngdoc method
       * @name responder
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No retorna ningún valor
       * @description 
       * Crea la data necesaria para responder la solicitud y la envía al servicio post de 
       * {@link services/poluxMidService.service/poluxMidRequest poluxMidRequest} para realizar la transacción correspondiente.
       */
      ctrl.responder = async function () {
        var fechaRespuesta = new Date();
        var errorDocente = false;
        //se desactiva respuesta anterior
        var objRtaAnterior = ctrl.respuestaActual;
        objRtaAnterior.Activo = false;
        var resOriginal = ctrl.respuestaSolicitud
        let estadoSolRtaNueva = ctrl.EstadoSolicitud.find(est => {
          return est.CodigoAbreviacion == resOriginal
        })
        //data respuesta nueva
        var objRtaNueva = {
          "Id": null,
          "Fecha": fechaRespuesta,
          "Justificacion": ctrl.justificacion,
          "EnteResponsable": 0,
          "Usuario": $scope.userId,
          "Activo": true,
          "EstadoSolicitud": estadoSolRtaNueva.Id,
          "SolicitudTrabajoGrado": {
            "Id": Number(ctrl.solicitud)
          }
        }

        var anio = ctrl.detallesSolicitud.PeriodoAcademico.split('-')[0];
        var periodo = ctrl.detallesSolicitud.PeriodoAcademico.split('-')[1];

        if (ctrl.acta.id != null) {
          var data_documento = {
            "DocumentoEscrito": {
              "Id": ctrl.acta.id,
            },
            "SolicitudTrabajoGrado": {
              "Id": Number(ctrl.solicitud)
            }
          }

          ctrl.dataRespuesta = {
            RespuestaAnterior: objRtaAnterior,
            RespuestaNueva: objRtaNueva,
            DocumentoSolicitud: data_documento,
            TipoSolicitud: {
              "Id": ctrl.respuestaActual.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud
            },
            Vinculaciones: null,
            EstudianteTrabajoGrado: null,
            VinculacionesCancelacion: null,
            TrTrabajoGrado: null,
            ModalidadTipoSolicitud: ctrl.detallesSolicitud.tipoSolicitud,
            TrabajoGrado: null,
            SolicitudTrabajoGrado: null,
            EspaciosAcademicos: null,
            DetallesPasantia: null,
            TrRevision: null,
            EspaciosAcademicosInscritos: null,
            MateriasProPos: false,
          };
          let modalidad = ctrl.Modalidad.find(mod => {
            return mod.Id == ctrl.SolicitudTrabajoGrado.ModalidadTipoSolicitud.Modalidad
          })
          let tipoSolicitud = ctrl.TipoSolicitud.find(tipSol => {
            return tipSol.Id == ctrl.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud
          })
          /*if (modalidad.CodigoAbreviacion == "EAPOS_PLX" && tipoSolicitud.CodigoAbreviacion == "SI_PLX"
            && this.roles.includes("COORDINADOR")) {
            await aprobarPosgrado();
          } else*/ 
          
          //solicitud espacios académicos de posgrado o solicitud espacios académicos de profundización
          if (tipoSolicitud.CodigoAbreviacion == "SI_PLX" && (ctrl.modalidadTemp.CodigoAbreviacion == "EAPOS_PLX" || ctrl.modalidadTemp.CodigoAbreviacion == "EAPRO_PLX")) {
            //La solicitud solo se aprueba para que siga el curso
            var data_trabajo_grado = {};
            var data_estudiantes = [];
            var otro = {};
            var estudiante = {};
            var solicitudInicial = {};
            angular.forEach(ctrl.detallesSolicitud, function (detalle) {
              if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "AE") {
                otro.Estudiantes = detalle.Descripcion;
              }
            });

            var data_asignaturasTrabajoGrado = [];
            //Para asignatura tg1
            data_asignaturasTrabajoGrado.push({
              "CodigoAsignatura": 1,
              "Periodo": parseInt(periodo),
              "Anio": parseInt(anio),
              "Calificacion": 0,
              "TrabajoGrado": {
                "Id": 0
              },
              "EstadoAsignaturaTrabajoGrado": ctrl.estadoAsignaturaTrabajoGradoTemp.Id
            });
            //Para asignatura tg2
            data_asignaturasTrabajoGrado.push({
              "CodigoAsignatura": 2,
              "Periodo": parseInt(periodo),
              "Anio": parseInt(anio),
              "Calificacion": 0,
              "TrabajoGrado": {
                "Id": 0
              },
              "EstadoAsignaturaTrabajoGrado": ctrl.estadoAsignaturaTrabajoGradoTemp.Id
            });
            let estadoEspacioAcademicoInscrito = ctrl.EstadoEspacioAcademicoInscrito.find(estEspacioAcademico => {
              return estEspacioAcademico.CodigoAbreviacion == "ESP_ACT_PLX"
            })
            angular.forEach(ctrl.detallesSolicitud, function (detalle) {
              if (detalle.Descripcion.includes("JSON-")) {
                if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion === "ESPELE" || detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion === "ESPELE2") {
                  var datosMaterias = detalle.Descripcion.split("-");
                  datosMaterias.splice(0, 2);
                  var materiasAux = []
                  angular.forEach(datosMaterias, function (materia) {
                    var aux = JSON.parse(materia)
                    materiasAux.push({
                      "TrabajoGrado": {
                        "Id": null
                      },
                      "EspaciosAcademicosElegibles": {
                        "Id": aux.Id
                      },
                      "EstadoEspacioAcademicoInscrito": estadoEspacioAcademicoInscrito.Id
                    })
                  });
                  ctrl.dataRespuesta.EspaciosAcademicosInscritos = materiasAux
                }
              }
            })
            var parametrosConsulta = $.param({
              query: "CodigoAbreviacion.in:PR_PLX" //Se dejará en Radicado pero se debe revisar más a fondo 
            });
            var estadoTrabajoGradoParametro
            await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (parametros) {
              estadoTrabajoGradoParametro = parametros;
            });
            let estadoEstudianteTrabajoGradoTemp = ctrl.EstadoEstudianteTrabajoGrado.find(estEstud => {
              return estEstud.CodigoAbreviacion == "EST_ACT_PLX"
            })
            let rolTrabajoGradoTemp = ctrl.RolTrabajoGrado.find(rolTrGr => {
              return rolTrGr.CodigoAbreviacion == "COR_POSGRADO_PLX"
            })
            modalidad = ctrl.Modalidad.find(mod => {
              return mod.Id == ctrl.detallesSolicitud.tipoSolicitud.Modalidad
            })
            data_trabajo_grado = {
              "Titulo": modalidad.Nombre,
              "Modalidad": ctrl.detallesSolicitud.tipoSolicitud.Modalidad,
              "EstadoTrabajoGrado": estadoTrabajoGradoParametro.data.Data[0].Id,
              "DistincionTrabajoGrado": null,
              "PeriodoAcademico": ctrl.detallesSolicitud.PeriodoAcademico
            }
            estudiante = {
              "Estudiante": ctrl.EstudianteTg,
              "TrabajoGrado": {
                "Id": 0
              },
              "EstadoEstudianteTrabajoGrado": estadoEstudianteTrabajoGradoTemp.Id
            }
            vinculacion = {
              "Usuario": $scope.userId,
              "Activo": true,
              "FechaInicio": '',
              "FechaFin": '',
              "RolTrabajoGrado": rolTrabajoGradoTemp.Id,
              "TrabajoGrado": {
                "Id": 0
              }
            };
            
            //se agregan las areaSnies
            var data_areas = [];
            angular.forEach(ctrl.areas, function (area) {
              data_areas.push({
                "AreaConocimiento": Number(area),
                "TrabajoGrado": {
                  "Id": 0
                },
                "Activo": true,
              });
            });

            var data_vinculacion = [];
            data_vinculacion.push(vinculacion)
            data_estudiantes.push(estudiante);
            ctrl.trabajo_grado = {
              TrabajoGrado: data_trabajo_grado,
              EstudianteTrabajoGrado: data_estudiantes,
              DocumentoEscrito: null,
              DocumentoTrabajoGrado: null,
              AreasTrabajoGrado: data_areas,
              VinculacionTrabajoGrado: data_vinculacion,
              AsignaturasTrabajoGrado: data_asignaturasTrabajoGrado
            }
            let estadoRtaNueva = ctrl.EstadoSolicitud.find(estSol => {
              return estSol.Id == objRtaNueva.EstadoSolicitud
            })
            if (estadoRtaNueva.CodigoAbreviacion == "ACC_PLX" && this.roles.includes("COORDINADOR") || this.roles.includes("CONTRATISTA")) {
              let estadoAux = ctrl.EstadoSolicitud.find(est => {
                return est.CodigoAbreviacion == "ACPR_PLX"
              })
              objRtaNueva.EstadoSolicitud = estadoAux.Id
            }
            ctrl.rtaSol = {
              RespuestaAnterior: objRtaAnterior,
              RespuestaNueva: objRtaNueva,
              DocumentoSolicitud: data_documento,
              TipoSolicitud: {
                "Id": ctrl.respuestaActual.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud
              },
              Vinculaciones: null,
              EstudianteTrabajoGrado: null,
              TrTrabajoGrado: ctrl.trabajo_grado,
              ModalidadTipoSolicitud: ctrl.detallesSolicitud.tipoSolicitud,
              SolicitudTrabajoGrado: ctrl.respuestaActual.SolicitudTrabajoGrado
            };
            ctrl.rtaSol.SolicitudTrabajoGrado.TrabajoGrado = {
              "Id": 0
            }

            ctrl.dataRespuesta.RespuestaAnterior = ctrl.rtaSol.RespuestaAnterior
            ctrl.dataRespuesta.RespuestaNueva = ctrl.rtaSol.RespuestaNueva
            ctrl.dataRespuesta.DocumentoSolicitud = ctrl.rtaSol.DocumentoSolicitud
            ctrl.dataRespuesta.TipoSolicitud = ctrl.rtaSol.TipoSolicitud
            ctrl.dataRespuesta.TrTrabajoGrado = ctrl.rtaSol.TrTrabajoGrado
            ctrl.dataRespuesta.SolicitudTrabajoGrado = ctrl.rtaSol.SolicitudTrabajoGrado
            ctrl.dataRespuesta.ModalidadTipoSolicitud = ctrl.rtaSol.ModalidadTipoSolicitud

            console.log("ctrl.dataRespuesta", ctrl.dataRespuesta);

            if (this.roles.includes("COORDINADOR")) {
              await aprobarPosgrado();
            }
          }

          if (ctrl.respuestaSolicitud == "RCC_PLX") {
            enviarTransaccion();
          }

          //solicitud aprobada
          if (ctrl.respuestaSolicitud == "ACC_PLX") {
            //solicitud aprobada
            //se recorren los detalles y se obtienen los nombres de las nuevas vinculaciones
            angular.forEach(ctrl.todoDetalles, function (detalle) {
              if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "DANT") {
                var auxiliarDirectorActual = detalle.Descripcion.split(" ");
                ctrl.directorActual = Number(auxiliarDirectorActual[0]);
              } else if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "DIRN") {
                var auxiliarDirectorNuevo = detalle.Descripcion.split(" ");
                ctrl.directorNuevo = Number(auxiliarDirectorNuevo[0]);
              } else if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "EVANT") {
                var auxiliarEvaluadorActual = detalle.Descripcion.split(" ");
                ctrl.evaluadorActual = Number(auxiliarEvaluadorActual[0]);
              } else if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "EVNU") {
                var auxiliarEvaluadorNuevo = detalle.Descripcion.split(" ");
                ctrl.evaluadorNuevo = Number(auxiliarEvaluadorNuevo[0]);
              } else if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "NNP") {
                ctrl.tituloNuevo = detalle.Descripcion;
              } else if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "ESACAANT") {
                //Para obtener la asignatura Actual
                ctrl.asignaturaActual = Number(detalle.Descripcion.split("-")[0]);
              } else if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "ESACANUE") {
                //Para obtener la asignatura Nueva
                ctrl.asignaturaNueva = Number(detalle.Descripcion.split("-")[0]);
              } else if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "NADE") {
                //Director externo anterior
                ctrl.directorExternoActual = Number(detalle.documentoExterno);
              } else if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "NNDE") {
                //Nombre del nuevo director Externo
                ctrl.nombreDirectorExternoNuevo = detalle.Descripcion;
              } else if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "IDNDE") {
                //Documento del nuevo director Externo
                ctrl.docenteCambio = {
                  id: detalle.Descripcion,
                }
              } else if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "CDA") {
                //Documento del codirector
                var auxiliarCodirector = detalle.Descripcion.split(" ");
                ctrl.codirector = Number(auxiliarCodirector[0]);
              } else if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "DFR" || detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "EP") {
                //Documento de propuesta final si el detalle es documennto fila o evidencias de publicación
                ctrl.docPropuestaFinal = detalle.Descripcion;
              } else if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "OBJNUE") {
                ctrl.ObjetivoNuevo = detalle.Descripcion;
              } else if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == 'CAUS') {
                ctrl.CausaSolicitud = detalle.Descripcion;
              }
            });

            //funcion para cambiar vinculaciones
            var addVinculacion = function (data_Vinculaciones, documentoActual, documentoNuevo) {
              vinculacionActual = [];
              angular.forEach(ctrl.docentesVinculadosTg, function (docenteVinculado) {
                if (docenteVinculado.Usuario === Number(documentoActual)) {
                  vinculacionActual = docenteVinculado;
                }
              });
              nuevaVinculacion = angular.copy(vinculacionActual);
              //actualizar vinculacion actual
              vinculacionActual.Activo = false;
              vinculacionActual.FechaFin = fechaRespuesta;
              //nueva vinculacion
              nuevaVinculacion.Id = null;
              nuevaVinculacion.Usuario = Number(documentoNuevo);
              nuevaVinculacion.FechaInicio = fechaRespuesta;
              //nuevaVinculacion.FechaFin=null;
              data_Vinculaciones.push(vinculacionActual);
              data_Vinculaciones.push(nuevaVinculacion);
            }

            console.log("ctrl.tipoSolicitudTemp", ctrl.tipoSolicitudTemp);
            
            //Se verifica por tipo de solicitud
            if (ctrl.tipoSolicitudTemp.CodigoAbreviacion == "SI_PLX") {
              //solicitud inicial
              if (ctrl.modalidadTemp.CodigoAbreviacion == "MONO_PLX" || ctrl.modalidadTemp.CodigoAbreviacion == "PEMP_PLX" || ctrl.modalidadTemp.CodigoAbreviacion == "CRE_PLX" || ctrl.modalidadTemp.CodigoAbreviacion == "PACAD_PLX" || ctrl.modalidadTemp.CodigoAbreviacion == "INV_PLX" || ctrl.modalidadTemp.CodigoAbreviacion == "PAS_PLX") {
                //Pasantia, Monografia, Proyecto de emprendimento, Creación e Interpretación, Producción académica
                //se obtienen datos para crear el trabajo
                console.log("ENTRA MONOGRAFIA")
                var tempTrabajo = {};
                angular.forEach(ctrl.detallesSolicitud, function (detalle) {
                  if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "NPRO") {
                    tempTrabajo.Titulo = detalle.Descripcion;
                  } else if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "AE") {
                    tempTrabajo.Estudiantes = detalle.Descripcion.split(',');
                  } else if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "PRO" ||
                    detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "PAI" ||
                    detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "POMN") {
                    tempTrabajo.Enlace = detalle.Descripcion;
                  } else if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "RPRO") {
                    tempTrabajo.Resumen = detalle.Descripcion;
                  } else if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "ACON") {
                    tempTrabajo.Areas = ctrl.areas;
                  } else if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "NEMP") {
                    tempTrabajo.Empresa = detalle.Descripcion;
                  } else if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "INDE") {
                    tempTrabajo.NombreDirectorExterno = detalle.Descripcion;
                  } else if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "IDDE") {
                    tempTrabajo.DocumentoDirectorExterno = detalle.Descripcion;
                  } else if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "INDI") {
                    tempTrabajo.NombreDirectorInterno = detalle.Descripcion;
                  } else if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "IDDI") {
                    tempTrabajo.DocumentoDirectorInterno = detalle.Descripcion;
                  } else if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "OBJ") {
                    tempTrabajo.Objetivo = detalle.Descripcion;
                  } else if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "CIIU") {
                    tempTrabajo.CIIU = detalle.Descripcion;
                  } else if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "NIT") {
                    tempTrabajo.NIT = detalle.Descripcion;
                  } else if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "CCUAA") {
                    tempTrabajo.Carta = detalle.Descripcion;
                  } else if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "CAV") {
                    tempTrabajo.Contrato = detalle.Descripcion;
                  } else if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "HVDE") {
                    tempTrabajo.HojaVida = detalle.Descripcion;
                  }
                });
                // por defecto el estado es En evaluación por revisor
                var estadoTrabajoGrado = "EC_PLX";
                // si  la modalidad es de producción academica de una se vez se crea en estado listo para sustentar
                if (ctrl.modalidadTemp.CodigoAbreviacion == "PACAD_PLX") {
                  estadoTrabajoGrado = "EC_PLX";
                }
                // si la modalidad es de pasantia se crea en estado de espera de ARL id 21
                if (ctrl.modalidadTemp.CodigoAbreviacion == "PAS_PLX") {
                  estadoTrabajoGrado = "PAEA_PLX";
                }
                if (ctrl.modalidadTemp.CodigoAbreviacion == "CRE_PLX") {
                  // Si la modalidad es creación o interpretación el trabajo de grado  se crea en estado en curso
                  //KB 26100
                  estadoTrabajoGrado = "EC_PLX";
                }
                parametrosConsulta = $.param({
                  query: "CodigoAbreviacion.in:" + estadoTrabajoGrado
                });
                await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (parametros) {
                  estadoTrabajoGradoParametro = parametros;
                });
                //data para crear el trabajo de grado
                data_trabajo_grado = {
                  "Titulo": tempTrabajo.Titulo,
                  "Modalidad": ctrl.detallesSolicitud.tipoSolicitud.Modalidad,
                  "EstadoTrabajoGrado": estadoTrabajoGradoParametro.data.Data[0].Id,
                  "DistincionTrabajoGrado": null,
                  "PeriodoAcademico": ctrl.detallesSolicitud.PeriodoAcademico,
                  "Objetivo": tempTrabajo.Objetivo,
                }

                //se agregan estudiantes
                estudiante = {};
                data_estudiantes = [];
                let estadoEstudianteTrabajoGradoTemp = ctrl.EstadoEstudianteTrabajoGrado.find(estEstud => {
                  return estEstud.CodigoAbreviacion == "EST_ACT_PLX"
                })
                let rolTrabajoGradoTemp = ctrl.RolTrabajoGrado.find(rolTrGr => {
                  return rolTrGr.CodigoAbreviacion == "DIRECTOR_PLX"
                })
                angular.forEach(tempTrabajo.Estudiantes, function (est) {
                  estudiante = {
                    "Estudiante": est,
                    "TrabajoGrado": {
                      "Id": 0
                    },
                    "EstadoEstudianteTrabajoGrado": estadoEstudianteTrabajoGradoTemp.Id
                  }
                  data_estudiantes.push(estudiante);
                });
                //Se crea la data para el documento de propuesta
                let tipoDocumento = ctrl.TipoDocumento.find(tipoDoc => {
                  return tipoDoc.CodigoAbreviacion == "DTR_PLX"
                })
                var data_propuesta = {
                  "Titulo": tempTrabajo.Titulo,
                  "Enlace": tempTrabajo.Enlace,
                  "Resumen": tempTrabajo.Resumen,
                  "TipoDocumentoEscrito": tipoDocumento.Id
                }
                //SI la modalidad es la de producción academica se sube de una vez como propuesta el documento
                if (ctrl.modalidadTemp.CodigoAbreviacion == "PACAD_PLX") {
                  data_propuesta.TipoDocumentoEscrito = tipoDocumento.Id;
                }
                //SI la modalidad es la de creación sube de una vez como propuesta el documento
                if (ctrl.modalidadTemp.CodigoAbreviacion == "CRE_PLX") {
                  data_propuesta.TipoDocumentoEscrito = tipoDocumento.Id;
                }
                var data_documento_tg = {
                  "TrabajoGrado": {
                    "Id": 0
                  },
                  "DocumentoEscrito": {
                    "Id": 0
                  }
                }
                //se agregan las areaSnies
                var data_areas = [];
                angular.forEach(ctrl.areas, function (area) {
                  data_areas.push({
                    "AreaConocimiento": Number(area),
                    "TrabajoGrado": {
                      "Id": 0
                    },
                    "Activo": true,
                  });
                });
                // se agregan las vinculaciones del tg
                var vinculacion = {};
                data_vinculacion = [];
                // docente director
                vinculacion = {
                  "Usuario": Number(ctrl.docenteDirector.id),
                  "Activo": true,
                  "FechaInicio": '',
                  "FechaFin": '',
                  "RolTrabajoGrado": rolTrabajoGradoTemp.Id,
                  "CodigoAbreviacion": rolTrabajoGradoTemp.CodigoAbreviacion,
                  "TrabajoGrado": {
                    "Id": 0
                  }
                }
                data_vinculacion.push(vinculacion);
                //verificar que el docente no este repetido
                var vinculados = [];
                vinculados.push(ctrl.docenteDirector.id);
                // docente codirector
                // Si la opción del docente codirector esta activada se agrega la vinculacion
                if (ctrl.switchCodirector) {
                  if (ctrl.docenteCoDirector.id != ctrl.docenteDirector.id) {
                    rolTrabajoGradoTemp = ctrl.RolTrabajoGrado.find(rolTrGr => {
                      return rolTrGr.CodigoAbreviacion == "CODIRECTOR_PLX"
                    })
                    data_vinculacion.push({
                      "Usuario": Number(ctrl.docenteCoDirector.id),
                      "Activo": true,
                      "FechaInicio": '',
                      "FechaFin": '',
                      // Rol de codirector
                      "RolTrabajoGrado": rolTrabajoGradoTemp.Id,
                      "CodigoAbreviacion": rolTrabajoGradoTemp.CodigoAbreviacion,
                      "TrabajoGrado": {
                        "Id": 0
                      }
                    });
                    vinculados.push(ctrl.docenteCoDirector.id)
                  } else {
                    errorDocente = true;
                  }
                }
                rolTrabajoGradoTemp = ctrl.RolTrabajoGrado.find(rolTrGr => {
                  return rolTrGr.CodigoAbreviacion == "EVALUADOR_PLX"
                })
                // evaluadores
                angular.forEach(ctrl.evaluadoresInicial, function (docente) {
                  vinculacion = {
                    "Usuario": Number(docente.docente.id),
                    "Activo": true,
                    "FechaInicio": '',
                    "FechaFin": '',
                    "RolTrabajoGrado": rolTrabajoGradoTemp.Id,
                    "CodigoAbreviacion": rolTrabajoGradoTemp.CodigoAbreviacion,
                    "TrabajoGrado": {
                      "Id": 0
                    }
                  };
                  data_vinculacion.push(vinculacion);
                  if (vinculados.includes(docente.docente.id)) {
                    errorDocente = true;
                  } else {
                    vinculados.push(docente.docente.id);
                  }
                });
                //data para las asignaturas_trabajo_grado
                data_asignaturasTrabajoGrado = [];
                //Para asignatura tg1
                data_asignaturasTrabajoGrado.push({
                  "CodigoAsignatura": 1,
                  "Periodo": parseInt(periodo),
                  "Anio": parseInt(anio),
                  "Calificacion": 0,
                  "TrabajoGrado": {
                    "Id": 0
                  },
                  "EstadoAsignaturaTrabajoGrado": ctrl.estadoAsignaturaTrabajoGradoTemp.Id
                });
                //Para asignatura tg2
                data_asignaturasTrabajoGrado.push({
                  "CodigoAsignatura": 2,
                  "Periodo": parseInt(periodo),
                  "Anio": parseInt(anio),
                  "Calificacion": 0,
                  "TrabajoGrado": {
                    "Id": 0
                  },
                  "EstadoAsignaturaTrabajoGrado": ctrl.estadoAsignaturaTrabajoGradoTemp.Id
                });
                // Solicitud inicial pasantia
                if (ctrl.modalidadTemp.CodigoAbreviacion == "PAS_PLX" && ctrl.tipoSolicitudTemp.CodigoAbreviacion == "SI_PLX") {

                  //se crea el detalle y se almacena en la data y se agregan a las vinculaciones el docente director externo

                  //SE AGREGAN LOS DETALLES DE PASANTÍA EXTERNA
                  ctrl.dataRespuesta.DetallesPasantiaExterna = [{
                    "Parametro": String(ctrl.parametro.data.Data[0].Id),
                    "Valor": String(tempTrabajo.Empresa),
                    TrabajoGrado: {
                      Id: 0,
                    }
                  },
                  {
                    "Parametro": String(ctrl.parametro.data.Data[1].Id),
                    "Valor": String(tempTrabajo.CIIU),
                    TrabajoGrado: {
                      Id: 0,
                    }
                  },
                  {
                    "Parametro": String(ctrl.parametro.data.Data[2].Id),
                    "Valor": String(tempTrabajo.NIT),
                    TrabajoGrado: {
                      Id: 0,
                    }
                  }]

                  //Se preparan los documentos de Contrato y Carta de la Unidad Académica

                  //Se busca el tipo de documento "Acuerdo de Voluntad, Convenio o Contrato"
                  let tipoDocumento1 = ctrl.TipoDocumento.find(tipoDoc => {
                    return tipoDoc.CodigoAbreviacion == "AVCC_PLX"
                  })
                  var data_contrato = {
                    "Titulo": "Acuerdo de Voluntad, Convenio o Contrato",
                    "Enlace": tempTrabajo.Contrato,
                    "Resumen": "Acuerdo de Voluntad, Convenio o Contrato de la Empresa " + tempTrabajo.Empresa,
                    "TipoDocumentoEscrito": tipoDocumento1.Id
                  }
                  //Se busca el tipo de documento "Carta de la Unidad Académica"
                  let tipoDocumento2 = ctrl.TipoDocumento.find(tipoDoc => {
                    return tipoDoc.CodigoAbreviacion == "CUA_PLX"
                  })
                  var data_carta = {
                    "Titulo": "Carta de la Unidad Académica",
                    "Enlace": tempTrabajo.Carta,
                    "Resumen": "Carta de la Unidad Académica encargada",
                    "TipoDocumentoEscrito": tipoDocumento2.Id
                  }

                  //Se busca el tipo de documento "Hoja de Vida de Director Externo"
                  let tipoDocumento3 = ctrl.TipoDocumento.find(tipoDoc => {
                    return tipoDoc.CodigoAbreviacion == "HVDE_PLX"
                  })
                  var data_hv = {
                    "Titulo": "Hoja de Vida Director Externo",
                    "Enlace": tempTrabajo.HojaVida,
                    "Resumen": "Hoja de Vida del Director Externo de la pasantía",
                    "TipoDocumentoEscrito": tipoDocumento3.Id
                  }

                  ctrl.dataRespuesta.DetallesPasantia = {
                    Empresa: 0,
                    Horas: 0,
                    ObjetoContrato: "Contrato de aprendizaje",
                    Observaciones: "Pasantia realizada en " + tempTrabajo.Empresa + " y dirigida por " + tempTrabajo.NombreDirectorExterno + " con número de identificacion " + tempTrabajo.DocumentoDirectorExterno,
                    TrabajoGrado: {
                      Id: 0,
                    },
                    Contrato: data_contrato,
                    Carta: data_carta,
                    HojaVidaDE: data_hv,
                    DTG_Contrato: data_documento_tg,
                    DTG_Carta: data_documento_tg,
                    DTG_HojaVida: data_documento_tg
                  }
                  //Docente director
                  rolTrabajoGradoTemp = ctrl.RolTrabajoGrado.find(rolTrGr => {
                    return rolTrGr.CodigoAbreviacion == "DIR_EXTERNO_PLX"
                  })
                  data_vinculacion.push({
                    "Usuario": Number(tempTrabajo.DocumentoDirectorExterno),
                    "Activo": true,
                    "FechaInicio": '',
                    "FechaFin": '',
                    "RolTrabajoGrado": rolTrabajoGradoTemp.Id,
                    "CodigoAbreviacion": rolTrabajoGradoTemp.CodigoAbreviacion,
                    "TrabajoGrado": {
                      "Id": 0
                    }
                  });
                }
                ctrl.trabajo_grado = {
                  TrabajoGrado: data_trabajo_grado,
                  EstudianteTrabajoGrado: data_estudiantes,
                  DocumentoEscrito: data_propuesta,
                  DocumentoTrabajoGrado: data_documento_tg,
                  AreasTrabajoGrado: data_areas,
                  VinculacionTrabajoGrado: data_vinculacion,
                  AsignaturasTrabajoGrado: data_asignaturasTrabajoGrado
                }
                solicitudInicial = ctrl.respuestaActual.SolicitudTrabajoGrado;
                solicitudInicial.TrabajoGrado = {
                  "Id": 0
                }
                //se guarda data de la respuesta
                ctrl.dataRespuesta.TrTrabajoGrado = ctrl.trabajo_grado;
                ctrl.dataRespuesta.SolicitudTrabajoGrado = solicitudInicial;
              }
            } else if (ctrl.tipoSolicitudTemp.CodigoAbreviacion == "SCDI_PLX" || ctrl.tipoSolicitudTemp.CodigoAbreviacion == "SCE_PLX" || ctrl.tipoSolicitudTemp.CodigoAbreviacion == "SCDE_PLX" || ctrl.tipoSolicitudTemp.CodigoAbreviacion == "SCCI_PLX") {
              //cambio de director interno, codirector o evaluadores
              // 5 cambio de director externo
              var vinculaciones = [];
              var vinculacionActual = [];
              angular.forEach(ctrl.docentesVinculadosTg, function (docenteVinculado) {
                if (docenteVinculado.Usuario === ctrl.directorActual) {
                  vinculacionActual = docenteVinculado;
                } else if (docenteVinculado.Usuario === ctrl.evaluadorActual) {
                  vinculacionActual = docenteVinculado;
                } else if (docenteVinculado.Usuario === Number(ctrl.directorExternoActual)) {
                  vinculacionActual = docenteVinculado;
                } else if (docenteVinculado.Usuario === Number(ctrl.codirector)) {
                  vinculacionActual = docenteVinculado;
                }
              });
              var nuevaVinculacion = angular.copy(vinculacionActual);
              //actualizar vinculacion actual
              vinculacionActual.Activo = false;
              vinculacionActual.FechaFin = fechaRespuesta;
              //nueva vinculacion
              nuevaVinculacion.Id = null;
              nuevaVinculacion.Usuario = Number(ctrl.docenteCambio.id);
              nuevaVinculacion.FechaInicio = fechaRespuesta;
              //nuevaVinculacion.FechaFin=null;
              vinculaciones.push(vinculacionActual);
              vinculaciones.push(nuevaVinculacion);
              //Esperar a que se cumplan las promesas

              //Se escribe la data de las vinculaciones
              ctrl.dataRespuesta.Vinculaciones = vinculaciones;
              //Si la solicitud es de cambio de director externo se envia el detalle de la pasantia para actualizarlo
              if (ctrl.tipoSolicitudTemp.CodigoAbreviacion == "SCDE_PLX") {

                var HojaVida

                angular.forEach(ctrl.detallesSolicitud, function (detalle) {
                  if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "HVDE") {
                    console.log(detalle.Descripcion)
                    HojaVida = detalle.Descripcion;
                  }
                })

                let tipoDocumento = ctrl.TipoDocumento.find(tipoDoc => {
                  return tipoDoc.CodigoAbreviacion == "HVDE_PLX"
                })

                data_hv = {
                  "Titulo": "Hoja de Vida Director Externo",
                  "Enlace": HojaVida,
                  "Resumen": "Hoja de Vida del Director Externo de la pasantía",
                  "TipoDocumentoEscrito": tipoDocumento.Id
                }

                data_documento_tg = {
                  "TrabajoGrado": {
                    "Id": 0
                  },
                  "DocumentoEscrito": {
                    "Id": 0
                  }
                }

                ctrl.dataRespuesta.DetallesPasantia = {
                  Empresa: 0,
                  Horas: 0,
                  ObjetoContrato: "Contrato de aprendizaje",
                  Observaciones: " y dirigida por " + ctrl.nombreDirectorExternoNuevo + " con número de identificacion " + ctrl.docenteCambio.id,
                  TrabajoGrado: {
                    Id: nuevaVinculacion.TrabajoGrado.Id
                  },
                  Contrato: {},
                  Carta: {},
                  HojaVidaDE: data_hv,
                  DTG_Contrato: {},
                  DTG_Carta: {},
                  DTG_HojaVida: data_documento_tg
                }
              }
            } else if (ctrl.tipoSolicitudTemp.CodigoAbreviacion == "SCM_PLX") {
              //solicitud de cancelacion de modalidad
              //se crea data del estudiante
              let estadoEstudianteTrabajoGradoTemp = ctrl.EstadoEstudianteTrabajoGrado.find(estEstud => {
                return estEstud.CodigoAbreviacion == "EST_CAN_PLX"
              })
              var dataEstudianteTg = {
                "Estudiante": ctrl.detallesSolicitud.solicitantes,
                "TrabajoGrado": ctrl.respuestaActual.SolicitudTrabajoGrado.TrabajoGrado,
                "EstadoEstudianteTrabajoGrado": estadoEstudianteTrabajoGradoTemp.Id,
              }
              //Se cambia la fecha de finalización de los vinculados
              angular.forEach(ctrl.docentesVinculadosTg, function (docente) {
                docente.FechaFin = fechaRespuesta;
              });

              ctrl.dataRespuesta.VinculacionesCancelacion = ctrl.docentesVinculadosTg;
              ctrl.dataRespuesta.EstudianteTrabajoGrado = dataEstudianteTg;
            } else if (ctrl.tipoSolicitudTemp.CodigoAbreviacion == "SMDTG_PLX") {
              //solicitud de cambio titulo de trabajo de grado
              var tgTemp = ctrl.respuestaActual.SolicitudTrabajoGrado.TrabajoGrado;
              //Se cambia el titulo
              tgTemp.Titulo = ctrl.tituloNuevo;
              ctrl.dataRespuesta.TrabajoGrado = tgTemp;
            } else if (ctrl.tipoSolicitudTemp.CodigoAbreviacion == "SCMA_PLX") {
              let estadoEspacioAcademicoInscrito = ctrl.EstadoEspacioAcademicoInscrito.find(estEspacioAcademico => {
                return estEspacioAcademico.CodigoAbreviacion == "ESP_CAN_PLX"
              })
              //solicitud de cambio de materia
              var espacios = [];
              //Asignatura vieja
              espacios.push({
                "Nota": 0,
                "EspaciosAcademicosElegibles": {
                  "Id": 0,
                  "CodigoAsignatura": ctrl.asignaturaActual,
                },
                "EstadoEspacioAcademicoInscrito": estadoEspacioAcademicoInscrito.Id,
                "TrabajoGrado": ctrl.respuestaActual.SolicitudTrabajoGrado.TrabajoGrado,
              });
              //Asignatura Nueva
              estadoEspacioAcademicoInscrito = ctrl.EstadoEspacioAcademicoInscrito.find(estEspacioAcademico => {
                return estEspacioAcademico.CodigoAbreviacion == "ESP_ACT_PLX"
              })
              espacios.push({
                "Nota": 0,
                "EspaciosAcademicosElegibles": {
                  "Id": 0,
                  "CodigoAsignatura": ctrl.asignaturaNueva,
                },
                "EstadoEspacioAcademicoInscrito": estadoEspacioAcademicoInscrito.Id,
                "TrabajoGrado": ctrl.respuestaActual.SolicitudTrabajoGrado.TrabajoGrado,
              });
              ctrl.dataRespuesta.EspaciosAcademicos = espacios;

            } else if (ctrl.tipoSolicitudTemp.CodigoAbreviacion == "SRTG_PLX") {
              //Solicitud de revisión de tg
              var data_tg = ctrl.respuestaActual.SolicitudTrabajoGrado.TrabajoGrado;
              var data_ttg = null;
              //trabajo de grado en revisión id 15
              modalidad = ctrl.modalidadTemp.CodigoAbreviacion;
              // Por defecto el trabajo de grado pasa a listo para sustentar
              var codigoEstadoTrabajoGrado = "LPS_PLX"

              // Para las modalidades innovación, monografía y emprendimiento: el trabajo de grado pasa a revisión de evaluador
              if (modalidad === 'INV_PLX' || modalidad === 'PEMP_PLX' || modalidad === 'MONO_PLX') {
                codigoEstadoTrabajoGrado = "RDE_PLX"
              }
              parametrosConsulta = $.param({
                query: "CodigoAbreviacion.in:" + codigoEstadoTrabajoGrado
              });
              await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (parametros) {
                estadoTrabajoGradoParametro = parametros;
              });
              data_tg.EstadoTrabajoGrado = estadoTrabajoGradoParametro.data.Data[0].Id

              if (ctrl.modalidadTemp.CodigoAbreviacion === 'PACAD_PLX') {
                var detalles_trabajo_grado = {};

                //RESTABLECIMIENTO DE ID DEL PARAMETRO ASOCIADO A LA CLASIFICACION DE REVISTA
                angular.forEach(ctrl.detallesSolicitud, function (detalles_finales) {
                  if (detalles_finales.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "CR") {
                    angular.forEach(ctrl.parametro_revista.data.Data, function (data_parametro) {
                      if (detalles_finales.Descripcion == data_parametro.Nombre) {
                        detalles_finales.Descripcion = data_parametro.Id;
                      }
                    });
                  }
                });

                angular.forEach(ctrl.detallesSolicitud, function (detalle) {
                  if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "NR") {
                    detalles_trabajo_grado.NombreRevista = detalle.Descripcion;
                  } else if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "LR") {
                    detalles_trabajo_grado.LinkRevista = detalle.Descripcion;
                  } else if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "CR") {
                    detalles_trabajo_grado.ClasificacionRevista = detalle.Descripcion;
                  }
                });

                //GUARDA LOS VALORES
                data_ttg = [{
                  "Parametro": String(ctrl.parametro.data.Data[0].Id),
                  "Valor": String(detalles_trabajo_grado.NombreRevista),
                  TrabajoGrado: {
                    Id: data_tg.Id,
                  }
                },
                {
                  "Parametro": String(ctrl.parametro.data.Data[1].Id),
                  "Valor": String(detalles_trabajo_grado.LinkRevista),
                  TrabajoGrado: {
                    Id: data_tg.Id,
                  }
                },
                {
                  "Parametro": String(ctrl.parametro.data.Data[2].Id),
                  "Valor": String(detalles_trabajo_grado.ClasificacionRevista),
                  TrabajoGrado: {
                    Id: data_tg.Id,
                  }
                }]
              }

              //Vinculaciones del tg
              var data_vinculaciones = [];
              //Si se escogio cambiar la vinculación
              if (ctrl.switchRevision) {
                //Si se cambio el  director original
                if (ctrl.directorOpcionTg.id != ctrl.directorActualTg.id) {
                  //Cambiar vinculaciones
                  // 
                  addVinculacion(data_vinculaciones, ctrl.directorActualTg.id, ctrl.directorOpcionTg.id);
                }
                //Si se cambiaron los evaluadores actuales
                if (ctrl.evaluadoresActualesTg != undefined) {
                  for (var e = 0; e < ctrl.evaluadoresActualesTg.length; e++) {
                    if (ctrl.evaluadoresActualesTg[e].docente.id != ctrl.evaluadoresOpcionesTg[e].docente.id) {
                      //Cambiar vinculaciones                  
                      //
                      //
                      addVinculacion(data_vinculaciones, ctrl.evaluadoresActualesTg[e].docente.id, ctrl.evaluadoresOpcionesTg[e].docente.id);
                    }
                  }
                  //
                  //buscar si hay algun valor repetido
                  angular.forEach(data_vinculaciones, function (dataVinculacion) {
                    if (data_vinculaciones.filter(function (value) {
                      return value.Usuario === dataVinculacion.Usuario
                    }).length > 1) {
                      errorDocente = true;
                    }
                  });
                }
              }

              //Documento escrito
              let tipoDocumentoGradoRevision = ctrl.TipoDocumento.find(tipoDoc => {
                return tipoDoc.CodigoAbreviacion == "DGRREV_PLX";
              });

              let tipoAnexos = ctrl.TipoDocumento.find(tipoDoc => {
                return tipoDoc.CodigoAbreviacion == "ANX_PLX";
              });

              let data_documentoEscrito = [];

              ctrl.detallesSolicitud.forEach(detalle => {
                if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion === "DFR") {
                  data_documentoEscrito.push({
                    Id: 0,
                    Titulo: data_tg.Titulo,
                    Enlace: ctrl.docPropuestaFinal,
                    Resumen: "Documento para revisión final del trabajo de grado",
                    TipoDocumentoEscrito: tipoDocumentoGradoRevision.Id
                  });
                } else if (["DAR1", "DAR2", "DAR3"].includes(detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion)) {
                  data_documentoEscrito.push({
                    Id: 0,
                    Titulo: data_tg.Titulo,
                    Enlace: detalle.Descripcion,
                    Resumen: "Documento Anexo",
                    TipoDocumentoEscrito: tipoAnexos.Id
                  });
                }
              });

              var data_revision = {
                TrabajoGrado: data_tg,
                Vinculaciones: data_vinculaciones,
                DocumentoEscrito: data_documentoEscrito,
                DocumentoTrabajoGrado: {
                  Id: 0,
                  DocumentoEscrito: {
                    Id: 0,
                  },
                  TrabajoGrado: data_tg,
                },
                DetalleTrabajoGrado: data_ttg
              };

              ctrl.dataRespuesta.TrRevision = data_revision;
            } else if (ctrl.tipoSolicitudTemp.CodigoAbreviacion == "SSO_PLX") {
              //Solicitud de socialización
              //Vinculaciones del tg
              var dataVinculaciones = [];
              //Si se escogio cambiar las vinculaciones se cambian, el resto de la justificación va en la data
              if (ctrl.switchRevision) {
                //Si se cambio el  director original
                if (ctrl.directorOpcionTg.id != ctrl.directorActualTg.id) {
                  //Cambiar vinculaciones
                  addVinculacion(dataVinculaciones, ctrl.directorActualTg.id, ctrl.directorOpcionTg.id);
                }
                //Si se cambiaron los evaluadores actuales
                if (ctrl.evaluadoresActualesTg != undefined) {
                  for (var item = 0; item < ctrl.evaluadoresActualesTg.length; item++) {
                    if (ctrl.evaluadoresActualesTg[item].docente.id != ctrl.evaluadoresOpcionesTg[item].docente.id) {
                      //Cambiar vinculaciones
                      addVinculacion(dataVinculaciones, ctrl.evaluadoresActualesTg[item].docente.id, ctrl.evaluadoresOpcionesTg[item].docente.id);
                    }
                  }
                  //buscar si hay algun valor repetido
                  angular.forEach(dataVinculaciones, function (data_vinculacion_cambio) {
                    if (dataVinculaciones.filter(function (value) {
                      return value.Usuario === data_vinculacion_cambio.Usuario
                    }).length > 1) {
                      errorDocente = true;
                    }
                  });
                }
              } else {
                dataVinculaciones = null;
              }
              ctrl.dataRespuesta.Vinculaciones = dataVinculaciones;
              //SOLICITUD DE PRORROGA
            } else if (ctrl.tipoSolicitudTemp.CodigoAbreviacion == "SPR_PLX") {
              //GUARDA LOS VALORES
              ctrl.dataRespuesta.CausaProrroga = [{
                "Parametro": String(ctrl.parametro.data.Data[0].Id),
                "Valor": String(ctrl.CausaSolicitud),
                TrabajoGrado: {
                  Id: ctrl.respuestaActual.SolicitudTrabajoGrado.TrabajoGrado.Id,
                }
              }]
            } else if (ctrl.tipoSolicitudTemp.CodigoAbreviacion == "SCO_PLX") {
              // SOLICITUD DE CAMBIOS DE OBJETIVOS DEL TRABAJO DE GRADO
              tgTemp = ctrl.respuestaActual.SolicitudTrabajoGrado.TrabajoGrado;
              // SE CAMBIAN LOS OBJETIVOS
              tgTemp.Objetivo = ctrl.ObjetivoNuevo;
              ctrl.dataRespuesta.TrabajoGrado = tgTemp;
            }
            enviarTransaccion();
          }

          async function aprobarPosgrado() {
            return new Promise(async (resolve, reject) => {
              //Trae los registros de la tabla Respuesta_Solicitud con campo Activo True
              var parametrosRespuestaSol = $.param({
                query: "Activo:true,SolicitudTrabajoGrado:" + ctrl.solicitud,
                limit: 0
              });

              //Almacena lo que traiga de Respuesta_Solicitud
              var respuesta_solicitud;
              await poluxRequest.get("respuesta_solicitud", parametrosRespuestaSol).then(async function (responseRespuestaSolicitud) {
                respuesta_solicitud = responseRespuestaSolicitud;
              })
              console.log("respuesta_solicitud", respuesta_solicitud);

              //Si se elige Aprobar o Rechazar Solicitud y es Coordinador de PREGRADO
              if (ctrl.rol == "PREGRADO") {
                //Si la solicitud inicial se encuentra en Radicado significa que el Coordinador de Pregrado debe Aprobar o Rechazar la solicitud
                var estadoRadicadoSolicitud = ctrl.EstadoSolicitud.find(estSol => {
                  return estSol.CodigoAbreviacion == "RDC_PLX" //4610 - Radicado
                });

                if(respuesta_solicitud.data.Data[0].EstadoSolicitud == estadoRadicadoSolicitud.Id){
                  var respuestaAprobado = "ACPR_PLX" //Aprobado por Consejo de Carrera [Coordinador Pregrado]
                  var respuestaRechazo = "RCC_PLX" //Rechazado por Consejo de Carrera [Coordinador Pregrado]
                }

                if(ctrl.respuestaSolicitud == "ACC_PLX") {
                  console.log("Aprobar Coordinador Pregrado");

                  var estadoSolicitud = ctrl.EstadoSolicitud.find(estSol => {
                    return estSol.CodigoAbreviacion == respuestaAprobado
                  });
                  
                  //Poner el campo Estado Solicitud de la Respuesta Nueva en 4631 (Aprobado por Consejo de Carrera [Coordinador Pregrado])
                  ctrl.dataRespuesta.RespuestaNueva.EstadoSolicitud = estadoSolicitud.Id;
                }
                else {
                  console.log("Rechazar Coordinador Pregrado");

                  var estadoSolicitud = ctrl.EstadoSolicitud.find(estSol => {
                    return estSol.CodigoAbreviacion == respuestaRechazo
                  });

                  //Traer el Estado de Trabajo de Grado en Cancelado
                  /*let parametrosConsulta = $.param({
                    query: "CodigoAbreviacion.in:RCC_PLX" //4611 - Anteproyecto rechazado por consejo de carrera 
                  });

                  await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (parametros) {
                    estadoTrabajoGrado = parametros.data.Data[0];
                  });
                  
                  //Se coloca en rechazo el trabajo de grado
                  ctrl.trabajo_grado.TrabajoGrado.EstadoTrabajoGrado = estadoTrabajoGrado.Id;*/

                  //Poner el campo Estado Solicitud de la Respuesta Nueva en 4611 (Rechazada por Consejo de Carrera [Coordinador Pregrado])
                  ctrl.dataRespuesta.RespuestaNueva.EstadoSolicitud = estadoSolicitud.Id;
                }

                //Poner el campo de la respuesta anterior en False
                ctrl.dataRespuesta.RespuestaAnterior.Activo = false;

                //Resolver la promesa, actualizar el campo Activo de las Respuestas Anteriores en False y crear el nuevo registro de Respuesta Nueva
                resolve();
              }

              //Si se elige Aprobar o Rechazar Solicitud y es Coordinador de POSGRADO
              if (ctrl.rol == "POSGRADO") {
                //Recorrer los detalles con Codigo de Abreviación ESPELE y ESPELE2
                for (let i = 0; i < ctrl.detallesSolicitud.length; i++) {
                  if (ctrl.detallesSolicitud[i].DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "ESPELE" || ctrl.detallesSolicitud[i].DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "ESPELE2") {                    
                    //Quitar el primer fragmento del string 'JSON-'
                    var detalleString = ctrl.detallesSolicitud[i].Descripcion.replace("JSON-", "");
                    
                    if (ctrl.detallesSolicitud[i].DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "ESPELE")
                    {
                      //Convertir el JSON en objeto si es ESPELE (Proyecto Curricular 1)
                      var infoESPELE = JSON.parse(detalleString);
                    }
                    else {
                      //Convertir el JSON en objeto si es ESPELE2 (Proyecto Curricular 2)
                      var infoESPELE2 = JSON.parse(detalleString);
                    }
                  }

                  if (ctrl.detallesSolicitud[i].DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "PEAP") {
                    var opcionPrioridad = parseInt(ctrl.detallesSolicitud[i].Descripcion);
                  }
                }
                
                console.log("infoESPELE", infoESPELE);
                console.log("infoESPELE2", infoESPELE2);

                console.log("ctrl.carrerasCoordinador", ctrl.carrerasCoordinador);

                var proyectoCurricularSeleccionado = ctrl.carrerasCoordinador.find(carrera => {
                  //Proyecto Curricular y Código de Posgrado traído de la Fila seleccionada en el grid de listar_solicitudes
                  return carrera.codigo_proyecto_curricular == $rootScope.codigoProyectoCurricularPosgrado; 
                });

                console.log("Proyecto Curricular Seleccionado: ", proyectoCurricularSeleccionado);

                //Va a responder el Coordinador del Proyecto Curricular 1
                if(proyectoCurricularSeleccionado.codigo_proyecto_curricular == infoESPELE.Codigo) {
                  respuestaAprobado = "ACPO1_PLX" //Aprobado por Coordinador de Posgrado Opcion 1
                  respuestaRechazo = "RCPO1_PLX" //Rechazado por Coordinador de Posgrado Opcion 1
                  
                  //Si es Coordinador Posgrado de Proyecto Curricular 1 y la Opción Prioritaria también es la 1
                  if(infoESPELE.Opcion == opcionPrioridad) {
                    //Si en el Select se elige Aprobar Solicitud
                    if(ctrl.respuestaSolicitud == "ACC_PLX") {
                      console.log("Aprobado por Coordinador Proyecto Curricular 1 Opción PRIORITARIA");

                      //Traer el Estado en que el codigo de abreviación ACC_PLX | Antes se ponía ACP01_PLX
                      var estadoSolicitud = ctrl.EstadoSolicitud.find(estSol => {
                        return estSol.CodigoAbreviacion == "ACC_PLX"
                      });
                      
                      //Poner el campo Estado Solicitud de la Respuesta Nueva en 4612 (Aprobado por consejo de carrerra) | Antes era 4654 (Aprobado por Coordinador de Posgrado Opcion 1) 
                      ctrl.dataRespuesta.RespuestaNueva.EstadoSolicitud = estadoSolicitud.Id;

                      //Traer el Estado de Trabajo de Grado en Curso
                      let parametrosConsulta = $.param({
                        query: "CodigoAbreviacion.in:EC_PLX" //4582 - El estudiante recibe la aprobación del anteproyecto y el trabajo de grado entra en desarrollo 
                      });

                      var estadoTrabajoGrado;
                      await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (parametros) {
                        estadoTrabajoGrado = parametros.data.Data[0];
                      });

                      //Se coloca en curso el trabajo de grado
                      ctrl.trabajo_grado.TrabajoGrado.EstadoTrabajoGrado = estadoTrabajoGrado.Id;

                      //Se pone la respuesta nueva en False para que ya no aparezca al momento de listar solicitud
                      ctrl.dataRespuesta.RespuestaNueva.Activo = false;

                      //Poner el campo de MateriasProPos en True para crear el Proyecto de Grado
                      ctrl.dataRespuesta.MateriasProPos = true;
                    }
                    //Si en el Select se elige Rechazar Solicitud
                    else {
                      //Si la solicitud inicial se encuentra en Rechazado por Coordinador de Posgrado Opcion 2 significa que el Coordinador de Posgrado debe Aprobar o Rechazar la solicitud
                      var estadoRCPO2Solicitud = ctrl.EstadoSolicitud.find(estSol => {
                        return estSol.CodigoAbreviacion == "RCPO2_PLX" //4657 - Rechazado por Coordinador de Posgrado Opción 2
                      });
                      console.log("estadoRCPO2Solicitud", estadoRCPO2Solicitud);

                      //O si la solicitud inicial se encuentra en Aceptado por Coordinador de Posgrado Opcion 2 significa que el Coordinador de Posgrado debe Aprobar o Rechazar la solicitud
                      var estadoACPO2Solicitud = ctrl.EstadoSolicitud.find(estSol => {
                        return estSol.CodigoAbreviacion == "ACPO2_PLX" //4656 - Aceptado por Coordinador de Posgrado Opción 2
                      });

                      //Comparar con la respuesta anterior a cuál de los dos Estados anteriores está siendo equivalente
                      //Si la respuesta anterior es rechazado por Coordinador de Posgrado 2
                      if(respuesta_solicitud.data.Data[0].EstadoSolicitud == estadoRCPO2Solicitud.Id) {
                        console.log("Rechazado por Coordinador Proyecto Curricular 1 Opción PRIORITARIA y Rechazado por Coordinador Proyecto Curricular 2 Opción NO PRIORITARIA");

                        //Traer el Estado de Trabajo de Grado en Cancelado
                        let parametrosConsulta = $.param({
                          query: "CodigoAbreviacion.in:RCC_PLX" //4611 - Anteproyecto rechazado por consejo de carrera 
                        });

                        await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (parametros) {
                          estadoTrabajoGrado = parametros.data.Data[0];
                        });

                        //Se coloca en rechazo el trabajo de grado
                        ctrl.trabajo_grado.TrabajoGrado.EstadoTrabajoGrado = estadoTrabajoGrado.Id;

                        //Se pone la respuesta nueva en False para que ya no aparezca al momento de listar solicitud
                        ctrl.dataRespuesta.RespuestaNueva.Activo = false;
                      } 
                      //Si la respuesta anterior es aprobado por Coordinador de Posgrado 2
                      else if (respuesta_solicitud.data.Data[0].EstadoSolicitud == estadoACPO2Solicitud.Id) {
                        console.log("Rechazado por Coordinador Proyecto Curricular 1 Opción PRIORITARIA y Aprobado por Coordinador Proyecto Curricular 2 Opción NO PRIORITARIA");

                        //Traer el Estado de Solicitud de Aprobado por consejo de carrera
                        var estadoACCSolicitud = ctrl.EstadoSolicitud.find(estSol => {
                          return estSol.CodigoAbreviacion == "ACC_PLX" //4612 - Aprobado por consejo de carrera
                        });

                        //Poner el campo Estado Solicitud de la Respuesta Nueva en 4612 | Antes era 4656 (Aprobada por Coordinador de Posgrado Opcion 2)
                        ctrl.dataRespuesta.RespuestaNueva.EstadoSolicitud = estadoACCSolicitud.Id;
                        
                        //Traer el Estado de Trabajo de Grado en Curso
                        let parametrosConsulta = $.param({
                          query: "CodigoAbreviacion.in:EC_PLX" //4582 - El estudiante recibe la aprobación del anteproyecto y el trabajo de grado entra en desarrollo 
                        });

                        await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (parametros) {
                          estadoTrabajoGrado = parametros.data.Data[0];
                        });

                        //Se coloca En Curso el estado del trabajo de grado
                        ctrl.trabajo_grado.TrabajoGrado.EstadoTrabajoGrado = estadoTrabajoGrado.Id;

                        //Se coloca en Vinculación Trabajo Grado al Usuario de la respuesta anterior (Coordinador Posgrado Opción 2).
                        ctrl.dataRespuesta.TrTrabajoGrado.VinculacionTrabajoGrado[0].Usuario = respuesta_solicitud.data.Data[0].Usuario;

                        //Se pone la respuesta nueva en False para que ya no aparezca al momento de listar solicitud
                        ctrl.dataRespuesta.RespuestaNueva.Activo = false;

                        //Poner el campo de la respuesta anterior en False
                        ctrl.dataRespuesta.RespuestaAnterior.Activo = false;

                        //Poner el campo de MateriasProPos en True para crear el Proyecto de Grado
                        ctrl.dataRespuesta.MateriasProPos = true;
                        
                        //Resolver la promesa, actualizar el campo Activo de las Respuestas Anteriores en False y crear el nuevo registro de Respuesta Nueva
                        resolve();
                      }

                      estadoSolicitud = ctrl.EstadoSolicitud.find(estSol => {
                        return estSol.CodigoAbreviacion == respuestaRechazo
                      });
    
                      console.log("estadoSolicitud", estadoSolicitud);

                      //Poner el campo Estado Solicitud de la Respuesta Nueva en 4655 (Rechazada por Coordinador de Posgrado Opcion 1)
                      ctrl.dataRespuesta.RespuestaNueva.EstadoSolicitud = estadoSolicitud.Id;
                    }

                    //Poner el campo de la respuesta anterior en False
                    ctrl.dataRespuesta.RespuestaAnterior.Activo = false;

                    //Resolver la promesa, actualizar el campo Activo de las Respuestas Anteriores en False y crear el nuevo registro de Respuesta Nueva
                    resolve();
                  }
                  //Si es Coordinador de Proyecto Curricular 1 y es la Opción NO Prioritaria
                  else {
                    //Solicitud inicial se encuentra en Aprobado por Consejo de Carrera significa que el Coordinador de Posgrado debe Aprobar o Rechazar la solicitud
                    var estadoACPRSolicitud = ctrl.EstadoSolicitud.find(estSol => {
                      return estSol.CodigoAbreviacion == "ACPR_PLX" //4631 - Aprobado por Consejo de Carrera [Coordinador Pregrado]
                    });
                    console.log("estadoACPRSolicitud", estadoACPRSolicitud);

                    //Solicitud inicial se encuentra en Rechazado por Coordinador de Posgrado Opcion 2 significa que el Coordinador de Posgrado debe Aprobar o Rechazar la solicitud
                    var estadoRCPO2Solicitud = ctrl.EstadoSolicitud.find(estSol => {
                      return estSol.CodigoAbreviacion == "RCPO2_PLX" //4657 - Rechazado por Coordinador de Posgrado Opción 2
                    });
                    console.log("estadoRCPO2Solicitud", estadoRCPO2Solicitud);

                    //Comparar con la respuesta anterior a cuál de los dos Estados anteriores está siendo equivalente
                    //Si la respuesta anterior es de Coordinador de Pregrado
                    if(respuesta_solicitud.data.Data[0].EstadoSolicitud == estadoACPRSolicitud.Id) {
                      //Si en el Select se elige Aprobar Solicitud
                      if(ctrl.respuestaSolicitud == "ACC_PLX") {
                        console.log("Aprobado por Coordinador Proyecto Curricular 1 Opción NO PRIORITARIA");

                        //Traer el Estado en que el codigo de abreviación ACP01_PLX
                        estadoSolicitud = ctrl.EstadoSolicitud.find(estSol => {
                          return estSol.CodigoAbreviacion == respuestaAprobado
                        });

                        //Poner el campo Estado Solicitud de la Respuesta Nueva en 4654 (Aprobado por Coordinador de Posgrado Opcion 1)
                        ctrl.dataRespuesta.RespuestaNueva.EstadoSolicitud = estadoSolicitud.Id;
                      }
                      //Si en el Select se elige Rechazar Solicitud
                      else {
                        console.log("Rechazado por Coordinador Proyecto Curricular 1 Opción NO PRIORITARIA");

                        estadoSolicitud = ctrl.EstadoSolicitud.find(estSol => {
                          return estSol.CodigoAbreviacion == respuestaRechazo
                        });
      
                        //Poner el campo Estado Solicitud de la Respuesta Nueva en 4655 (Rechazada por Coordinador de Posgrado Opcion 1)
                        ctrl.dataRespuesta.RespuestaNueva.EstadoSolicitud = estadoSolicitud.Id;
                      }

                      //Poner el campo de la respuesta anterior en False
                      ctrl.dataRespuesta.RespuestaAnterior.Activo = false;

                      //Resolver la promesa, actualizar el campo Activo de las Respuestas Anteriores en False y crear el nuevo registro de Respuesta Nueva
                      resolve();
                    }
                    //Si la respuesa anterior es Rechazada por Coordinador de Posgrado Opción 2 (PRIORITARIA)
                    else if(respuesta_solicitud.data.Data[0].EstadoSolicitud == estadoRCPO2Solicitud.Id) {
                      //Si en el Select se elige Aprobar Solicitud
                      if(ctrl.respuestaSolicitud == "ACC_PLX") {
                        console.log("Aprobado por Coordinador Proyecto Curricular 1 Opción NO PRIORITARIA y Rechazado por Coordinador Proyecto Curricular 2 Opción PRIORITARIA");

                        //Traer el Estado en que el codigo de abreviación ACC_PLX | Antes era ACP01_PLX
                        estadoSolicitud = ctrl.EstadoSolicitud.find(estSol => {
                          return estSol.CodigoAbreviacion == "ACC_PLX"
                        });

                        //Poner el campo Estado Solicitud de la Respuesta Nueva en 4612 (Aprobado por consejo de carrera) | Antes era 4654 (Aprobado por Coordinador de Posgrado Opcion 1)
                        ctrl.dataRespuesta.RespuestaNueva.EstadoSolicitud = estadoSolicitud.Id;

                        //Traer el Estado de Trabajo de Grado en Curso
                        let parametrosConsulta = $.param({
                          query: "CodigoAbreviacion.in:EC_PLX" //4582 - El estudiante recibe la aprobación del anteproyecto y el trabajo de grado entra en desarrollo 
                        });

                        await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (parametros) {
                          estadoTrabajoGrado = parametros.data.Data[0];
                        });

                        console.log("estadoTrabajoGrado", estadoTrabajoGrado);

                        //Se coloca en curso el trabajo de grado
                        ctrl.trabajo_grado.TrabajoGrado.EstadoTrabajoGrado = estadoTrabajoGrado.Id;

                        //Se pone la respuesta nueva en False para que ya no aparezca al momento de listar solicitud
                        ctrl.dataRespuesta.RespuestaNueva.Activo = false;

                        //Poner el campo de MateriasProPos en True para crear el Proyecto de Grado
                        ctrl.dataRespuesta.MateriasProPos = true;
                      }
                      //Si en el Select se elige Rechazar Solicitud
                      else {
                        console.log("Rechazado por Coordinador Proyecto Curricular 1 Opción NO PRIORITARIA y Rechazado por Coordinador Proyecto Curricular 2 Opción PRIORITARIA");

                        estadoSolicitud = ctrl.EstadoSolicitud.find(estSol => {
                          return estSol.CodigoAbreviacion == respuestaRechazo
                        });
      
                        //Poner el campo Estado Solicitud de la Respuesta Nueva en 4655 (Rechazada por Coordinador de Posgrado Opcion 1)
                        ctrl.dataRespuesta.RespuestaNueva.EstadoSolicitud = estadoSolicitud.Id;

                        //Traer el Estado de Trabajo de Grado en Cancelado
                        let parametrosConsulta = $.param({
                          query: "CodigoAbreviacion.in:RCC_PLX" //4611 - Anteproyecto rechazado por consejo de carrera 
                        });

                        await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (parametros) {
                          estadoTrabajoGrado = parametros.data.Data[0];
                        });

                        //Se pone la respuesta nueva en False para que ya no aparezca al momento de listar solicitud
                        ctrl.dataRespuesta.RespuestaNueva.Activo = false;

                        //Se coloca en rechazo el trabajo de grado
                        ctrl.trabajo_grado.TrabajoGrado.EstadoTrabajoGrado = estadoTrabajoGrado.Id;
                      }

                      //Poner el campo de la respuesta anterior en False
                      ctrl.dataRespuesta.RespuestaAnterior.Activo = false;

                      //Resolver la promesa, actualizar el campo Activo de las Respuestas Anteriores en False y crear el nuevo registro de Respuesta Nueva
                      resolve();
                    }
                  }
                }
                //Va a responder el Coordinador del Proyecto Curricular 2
                else if(proyectoCurricularSeleccionado.codigo_proyecto_curricular == infoESPELE2.Codigo) {
                  respuestaAprobado = "ACPO2_PLX" //Aprobado por Coordinador de Posgrado Opcion 2 4656
                  respuestaRechazo = "RCPO2_PLX" //Rechazado por Coordinador de Posgrado Opcion 2 4657
                  
                  //Si es Coordinador Posgrado de Proyecto Curricular 2 y la Opción Prioritaria también es la 2
                  if(infoESPELE2.Opcion == opcionPrioridad) {
                    //Si en el Select se elige Aprobar Solicitud
                    if(ctrl.respuestaSolicitud == "ACC_PLX") {
                      console.log("Aprobado por Coordinador Proyecto Curricular 2 Opción PRIORITARIA");

                      //Traer el Estado en que el codigo de abreviación ACC_PLX | Antes era ACP02_PLX
                      var estadoSolicitud = ctrl.EstadoSolicitud.find(estSol => {
                        return estSol.CodigoAbreviacion == "ACC_PLX"
                      });
    
                      console.log("estadoSolicitud", estadoSolicitud);
                      
                      //Poner el campo Estado Solicitud de la Respuesta Nueva en 4612 (Aprobado por consejo de carrera) | Antes era 4656 (Aprobado por Coordinador de Posgrado Opcion 2)
                      ctrl.dataRespuesta.RespuestaNueva.EstadoSolicitud = estadoSolicitud.Id;

                      //Traer el Estado de Trabajo de Grado en Curso
                      let parametrosConsulta = $.param({
                        query: "CodigoAbreviacion.in:EC_PLX" //4582 - El estudiante recibe la aprobación del anteproyecto y el trabajo de grado entra en desarrollo 
                      });

                      await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (parametros) {
                        estadoTrabajoGrado = parametros.data.Data[0];
                      });

                      //Se coloca en curso el trabajo de grado
                      ctrl.trabajo_grado.TrabajoGrado.EstadoTrabajoGrado = estadoTrabajoGrado.Id;

                      //Se pone la respuesta nueva en False para que ya no aparezca al momento de listar solicitud
                      ctrl.dataRespuesta.RespuestaNueva.Activo = false;

                      //Poner el campo de MateriasProPos en True para crear el Proyecto de Grado
                      ctrl.dataRespuesta.MateriasProPos = true;
                    }
                    //Si en el Select se elige Rechazar Solicitud
                    else {
                      //Solicitud inicial se encuentra en Rechazado por Coordinador de Posgrado Opcion 1 significa que el Coordinador de Posgrado debe Aprobar o Rechazar la solicitud
                      var estadoRCPO1Solicitud = ctrl.EstadoSolicitud.find(estSol => {
                        return estSol.CodigoAbreviacion == "RCPO1_PLX" //4655 - Rechazado por Coordinador de Posgrado Opción 1
                      });
                      console.log("estadoRCPO1Solicitud", estadoRCPO1Solicitud);

                      //Solicitud inicial se encuentra en Aprobado por Coordinador de Posgrado Opcion 1 significa que el Coordinador de Posgrado debe Aprobar o Rechazar la solicitud
                      var estadoACPO1Solicitud = ctrl.EstadoSolicitud.find(estSol => {
                        return estSol.CodigoAbreviacion == "ACPO1_PLX" //4654 - Aprobado por Coordinador de Posgrado Opción 1
                      });

                      //Comparar con la respuesta anterior a cuál de los dos Estados anteriores está siendo equivalente
                      //Si la respuesta anterior es rechazado por Coordinador de Posgrado 1 (Opción NO Prioritaria)
                      if(respuesta_solicitud.data.Data[0].EstadoSolicitud == estadoRCPO1Solicitud.Id) {
                        console.log("Rechazado por Coordinador Proyecto Curricular 2 Opción PRIORITARIA y Rechazado por Coordinador Proyecto Curricular 1 Opción NO PRIORITARIA");

                        //Traer el Estado de Trabajo de Grado en Cancelado
                        let parametrosConsulta = $.param({
                          query: "CodigoAbreviacion.in:RCC_PLX" //4611 - Anteproyecto rechazado por consejo de carrera
                        });

                        await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (parametros) {
                          estadoTrabajoGrado = parametros.data.Data[0];
                        });

                        //Se pone la respuesta nueva en False para que ya no aparezca al momento de listar solicitud
                        ctrl.dataRespuesta.RespuestaNueva.Activo = false;

                        //Se coloca en rechazo el trabajo de grado
                        ctrl.trabajo_grado.TrabajoGrado.EstadoTrabajoGrado = estadoTrabajoGrado.Id;
                      } 
                      //Si la respuesta anterior es aprobado por Coordinador de Posgrado 1 (Opción NO Prioritaria)
                      else if (respuesta_solicitud.data.Data[0].EstadoSolicitud == estadoACPO1Solicitud.Id) {
                        console.log("Rechazado por Coordinador Proyecto Curricular 2 Opción PRIORITARIA y Aprobado por Coordinador Proyecto Curricular 1 Opción NO PRIORITARIA");

                        //Traer el Estado de Solicitud de Aprobado por consejo de carrera
                        var estadoACCSolicitud = ctrl.EstadoSolicitud.find(estSol => {
                          return estSol.CodigoAbreviacion == "ACC_PLX" //4612 - Aprobado por consejo de carrera
                        });

                        //Poner el campo Estado Solicitud de la Respuesta Nueva en 4612 (Aprobado por consejo de carrera) | Antes era 4654 (Aprobada por Coordinador de Posgrado Opcion 1)
                        ctrl.dataRespuesta.RespuestaNueva.EstadoSolicitud = estadoACCSolicitud.Id;
                        
                        //Traer el Estado de Trabajo de Grado en Curso
                        let parametrosConsulta = $.param({
                          query: "CodigoAbreviacion.in:EC_PLX" //4582 - El estudiante recibe la aprobación del anteproyecto y el trabajo de grado entra en desarrollo 
                        });

                        await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (parametros) {
                          estadoTrabajoGrado = parametros.data.Data[0];
                        });

                        //Se coloca En Curso el estado del trabajo de grado
                        ctrl.trabajo_grado.TrabajoGrado.EstadoTrabajoGrado = estadoTrabajoGrado.Id;

                        //Se coloca en Vinculación Trabajo Grado al Usuario de la respuesta anterior (Coordinador Posgrado Opción 1).
                        ctrl.dataRespuesta.TrTrabajoGrado.VinculacionTrabajoGrado[0].Usuario = respuesta_solicitud.data.Data[0].Usuario;

                        //Poner el campo de la respuesta anterior en False
                        ctrl.dataRespuesta.RespuestaAnterior.Activo = false;

                        //Se pone la respuesta nueva en False para que ya no aparezca al momento de listar solicitud
                        ctrl.dataRespuesta.RespuestaNueva.Activo = false;

                        //Poner el campo de MateriasProPos en True para crear el Proyecto de Grado
                        ctrl.dataRespuesta.MateriasProPos = true;
                        
                        //Resolver la promesa, actualizar el campo Activo de las Respuestas Anteriores en False y crear el nuevo registro de Respuesta Nueva
                        resolve();
                      }

                      estadoSolicitud = ctrl.EstadoSolicitud.find(estSol => {
                        return estSol.CodigoAbreviacion == respuestaRechazo
                      });
    
                      console.log("estadoSolicitud", estadoSolicitud);

                      //Poner el campo Estado Solicitud de la Respuesta Nueva en 4657 (Rechazada por Coordinador de Posgrado Opcion 2)
                      ctrl.dataRespuesta.RespuestaNueva.EstadoSolicitud = estadoSolicitud.Id;
                    }

                    //Poner el campo de la respuesta anterior en False
                    ctrl.dataRespuesta.RespuestaAnterior.Activo = false;

                    //Resolver la promesa, actualizar el campo Activo de las Respuestas Anteriores en False y crear el nuevo registro de Respuesta Nueva
                    resolve();
                  }
                  //Cuando la opción prioritaria y el Proyecto Curricular no coinciden
                  else {
                    //Solicitud inicial se encuentra en Aprobado por Consejo de Carrera significa que el Coordinador de Posgrado debe Aprobar o Rechazar la solicitud
                    var estadoACPRSolicitud = ctrl.EstadoSolicitud.find(estSol => {
                      return estSol.CodigoAbreviacion == "ACPR_PLX" //4631 - Aprobado por Consejo de Carrera [Coordinador Pregrado]
                    });
                    console.log("estadoACPRSolicitud", estadoACPRSolicitud);

                    //Solicitud inicial se encuentra en Rechazado por Coordinador de Posgrado Opcion 1 significa que el Coordinador de Posgrado debe Aprobar o Rechazar la solicitud
                    var estadoRCPO1Solicitud = ctrl.EstadoSolicitud.find(estSol => {
                      return estSol.CodigoAbreviacion == "RCPO1_PLX" //4655 - Rechazado por Coordinador de Posgrado Opción 1
                    });
                    console.log("estadoRCPO1Solicitud", estadoRCPO1Solicitud);

                    //Comparar con la respuesta anterior a cuál de los dos Estados anteriores está siendo equivalente
                    //Si la respuesta anterior fue el Coordinador de Pregrado
                    if(respuesta_solicitud.data.Data[0].EstadoSolicitud == estadoACPRSolicitud.Id) {
                      //Si en el Select se elige Aprobar Solicitud
                      if(ctrl.respuestaSolicitud == "ACC_PLX") {
                        console.log("Aprobado por Coordinador Proyecto Curricular 2 Opción NO PRIORITARIA");

                        //Traer el Estado en que el codigo de abreviación ACP02_PLX
                        estadoSolicitud = ctrl.EstadoSolicitud.find(estSol => {
                          return estSol.CodigoAbreviacion == respuestaAprobado
                        });

                        //Poner el campo Estado Solicitud de la Respuesta Nueva en 4656 (Aprobado por Coordinador de Posgrado Opcion 2)
                        ctrl.dataRespuesta.RespuestaNueva.EstadoSolicitud = estadoSolicitud.Id;
                      }
                      //Si en el Select se elige Rechazar Solicitud
                      else {
                        console.log("Rechazado por Coordinador Proyecto Curricular 2 Opción NO PRIORITARIA");

                        estadoSolicitud = ctrl.EstadoSolicitud.find(estSol => {
                          return estSol.CodigoAbreviacion == respuestaRechazo
                        });
      
                        //Poner el campo Estado Solicitud de la Respuesta Nueva en 4657 (Rechazada por Coordinador de Posgrado Opcion 2)
                        ctrl.dataRespuesta.RespuestaNueva.EstadoSolicitud = estadoSolicitud.Id;
                      }

                      //Poner el campo de la respuesta anterior en False
                      ctrl.dataRespuesta.RespuestaAnterior.Activo = false;

                      //Resolver la promesa, actualizar el campo Activo de las Respuestas Anteriores en False y crear el nuevo registro de Respuesta Nueva
                      resolve();
                    }
                    //Si la respuesta anterior fue Rechazado por Coordinador de Posgrado Opción 1 (Opción PRIORITARIA)
                    else if(respuesta_solicitud.data.Data[0].EstadoSolicitud == estadoRCPO1Solicitud.Id) {
                      //Si en el Select se elige Aprobar Solicitud
                      if(ctrl.respuestaSolicitud == "ACC_PLX") {
                        console.log("Aprobado por Coordinador Proyecto Curricular 2 Opción NO PRIORITARIA y Rechazado por Coordinador Proyecto Curricular 1 Opción PRIORITARIA");

                        //Traer el Estado en que el codigo de abreviación ACC_PLX | Antes era ACP01_PLX
                        estadoSolicitud = ctrl.EstadoSolicitud.find(estSol => {
                          return estSol.CodigoAbreviacion == "ACC_PLX"
                        });

                        //Poner el campo Estado Solicitud de la Respuesta Nueva en 4612 (Aprobado por consejo de carrera) | Antes era 4656 (Aprobado por Coordinador de Posgrado Opcion 2)
                        ctrl.dataRespuesta.RespuestaNueva.EstadoSolicitud = estadoSolicitud.Id;

                        //Traer el Estado de Trabajo de Grado en Curso
                        let parametrosConsulta = $.param({
                          query: "CodigoAbreviacion.in:EC_PLX" //4582 - El estudiante recibe la aprobación del anteproyecto y el trabajo de grado entra en desarrollo 
                        });

                        await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (parametros) {
                          estadoTrabajoGrado = parametros.data.Data[0];
                        });

                        console.log("estadoTrabajoGrado", estadoTrabajoGrado);

                        //Se coloca en curso el trabajo de grado
                        ctrl.trabajo_grado.TrabajoGrado.EstadoTrabajoGrado = estadoTrabajoGrado.Id;

                        //Se pone la respuesta nueva en False para que ya no aparezca al momento de listar solicitud
                        ctrl.dataRespuesta.RespuestaNueva.Activo = false;

                        //Poner el campo de MateriasProPos en True para crear el Proyecto de Grado
                        ctrl.dataRespuesta.MateriasProPos = true;
                      }
                      //Si en el Select se elige Rechazar Solicitud
                      else {
                        console.log("Rechazado por Coordinador Proyecto Curricular 1 Opción NO PRIORITARIA y Rechazado por Coordinador Proyecto Curricular 1 Opción PRIORITARIA");

                        estadoSolicitud = ctrl.EstadoSolicitud.find(estSol => {
                          return estSol.CodigoAbreviacion == respuestaRechazo
                        });
      
                        //Poner el campo Estado Solicitud de la Respuesta Nueva en 4657 (Rechazada por Coordinador de Posgrado Opcion 2)
                        ctrl.dataRespuesta.RespuestaNueva.EstadoSolicitud = estadoSolicitud.Id;

                        //Traer el Estado de Trabajo de Grado en Cancelado
                        let parametrosConsulta = $.param({
                          query: "CodigoAbreviacion.in:RCC_PLX" //4611 - Anteproyecto rechazado por consejo de carrera 
                        });

                        await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (parametros) {
                          estadoTrabajoGrado = parametros.data.Data[0];
                        });

                        //Se pone la respuesta nueva en False para que ya no aparezca al momento de listar solicitud
                        ctrl.dataRespuesta.RespuestaNueva.Activo = false;

                        //Se coloca en rechazo el trabajo de grado
                        ctrl.trabajo_grado.TrabajoGrado.EstadoTrabajoGrado = estadoTrabajoGrado.Id;
                      }

                      //Poner el campo de la respuesta anterior en False
                      ctrl.dataRespuesta.RespuestaAnterior.Activo = false;

                      //Resolver la promesa, actualizar el campo Activo de las Respuestas Anteriores en False y crear el nuevo registro de Respuesta Nueva
                      resolve();
                    }
                  }
                }                 
              }
            })
          }

          async function enviarTransaccion() {
            return new Promise((resolve, reject) => {
              if (!errorDocente) {
                poluxMidRequest.post("tr_respuesta_solicitud", ctrl.dataRespuesta).then(function (response) {
                  //la coordinación responde a la solicitud
                  ctrl.EnvioNotificacion()
                  ctrl.mostrarRespuesta(response);
                  resolve();
                })
                  .catch(function (error) {

                    swal(
                      $translate.instant("MENSAJE_ERROR"),
                      $translate.instant("ERROR.ENVIO_SOLICITUD"),
                      'warning'
                    );
                    resolve();
                  });
              } else {

                swal(
                  $translate.instant("MENSAJE_ERROR"),
                  $translate.instant("ERROR.DOCENTE_DUPLICADO"),
                  'warning'
                );
                resolve();
              }
            })
          }
        } else {
          ctrl.mostrarRespuesta("SELECCIONE_ACTA");
          resolve();
        }
      }

      /**
       * @ngdoc method
       * @name mostrarRespuesta
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {object} response Respuesta que se mostrará
       * @returns {undefined} No retorna ningún valor
       * @description 
       * Función que se encarga de mostrar el resultado de la transacción de responder solicitud.
       */
      ctrl.mostrarRespuesta = function (response) {
        if (response.data.Data !== undefined) {
          console.log("Comparación Success")
          if (response.data.Success == true) {
            var Atributos = {
              rol: 'ESTUDIANTE',
            }
            notificacionRequest.enviarCorreo('Respuesta de solicitud TRABAJO DE GRADO', Atributos, [ctrl.detallesSolicitud.solicitantes], '', '', 'Se ha realizado la respuesta de la solicitud, se ha dado respuesta de parte de ' + token_service.getAppPayload().email + ' para la solicitud.Cuando se desee observar el msj se puede copiar el siguiente link para acceder https://polux.portaloas.udistrital.edu.co/');

            // notificacionRequest.enviarCorreo('Respuesta de solicitud TRABAJO DE GRADO',Atributos,[ctrl.detallesSolicitud.solicitantes],'','','Se ha realizado la respuesta de la solicitud, se ha dado respuesta de parte de '+token_service.getAppPayload().email+' para la solicitud');                        

            swal(
              $translate.instant("RESPUESTA_SOLICITUD"),
              $translate.instant("SOLICITUD_APROBADA"),
              'success'
            );
            $location.path("/solicitudes/listar_solicitudes");
          } else {
            if (Array.isArray(response.data.Data)) {
              swal(
                $translate.instant("RESPUESTA_SOLICITUD"),
                $translate.instant(response.data.Data[1]),
                'warning'
              );
            } else {
              swal(
                $translate.instant("RESPUESTA_SOLICITUD"),
                response.data.Data,
                'warning'
              );
            }
          }
        } else {
          swal(
            $translate.instant("RESPUESTA_SOLICITUD"),
            $translate.instant(response.data.Data),
            'warning'
          );
        }
      }

      /**
       * @ngdoc method
       * @name cargarJustificacion
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {function} callFunction Funcion que se ejecuta una vez se termina de cargar el documento
       * @returns {undefined} No retorna ningún valor
       * @description 
       * Conecta el cliente de {@link services/poluxService.service:gestorDocumentalMidService gestorDocumentalMidRequest} y crea la data del documento que se va a cargar y llama a la función cargar documento.
       */
      ctrl.cargarJustificacion = function (callFunction) {
        // OK, the returned client is connected

        var tam = 2000;
        $scope.loadFormulario = true;
        var documento = ctrl.acta;
        if (documento.type !== "application/pdf" || documento.size > tam) {

          //Subida de archivos por medio del Gestor documental
          var fileBase64;
          var data = [];
          var URL = "";
          let tipoDocumento = ctrl.TipoDocumento.find(tipoDoc => {
            return tipoDoc.CodigoAbreviacion == "ACT_PLX"
          })
          utils.getBase64(documento).then(
            function (base64) {
              fileBase64 = base64;
              data = [{
                IdTipoDocumento: tipoDocumento.Id, //id tipo documento de documentos_crud
                nombre: "ActaSolicitud" + ctrl.solicitud,// nombre formado por el acta de solicitud y la solicitud

                metadatos: {
                  NombreArchivo: "ActaSolicitud" + ctrl.solicitud,
                  Tipo: "Archivo",
                  Observaciones: "actas"
                },
                descripcion: "Acta de evaluación de la solicitud " + ctrl.solicitud,
                file: fileBase64,
              }]

              gestorDocumentalMidRequest.post('/document/upload', data).then(function (response) {
                URL = response.data.res.Enlace
                ctrl.urlActa = URL
                ctrl.cargarRespuesta();
              })

            })
            .catch(function (error) {
              ctrl.swalError();
              $scope.loadFormulario = false;
            });
        } else {
          ctrl.swalError();
          $scope.loadFormulario = false;
        }


      };

      /**
       * @ngdoc method
       * @name swalError
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No retorna ningún valor
       * @description 
       * Enseña un mensaje de error al usuario de forma emergente
       */
      ctrl.swalError = function () {
        swal(
          $translate.instant("ERROR.SUBIR_DOCUMENTO"),
          $translate.instant("VERIFICAR_DOCUMENTO"),
          'warning'
        );
        $scope.loadFormulario = false;
      };

      /**
       * @ngdoc method
       * @name cargarRespuesta
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No retorna ningún valor
       * @description 
       * Enseña un mensaje de notificación al usuario de forma emergente
       */
      ctrl.cargarRespuesta = function () {
        swal(
          $translate.instant("ERROR.SUBIR_DOCUMENTO"),
          $translate.instant("VERIFICAR_DOCUMENTO"),
          'success'
        );
        $scope.loadFormulario = false;
      };

      /**
       * @ngdoc method
       * @name validarFormularioAprobacion
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No retorna ningún valor
       * @description 
       * Valida si el formulario de aprobación necesita cargar la justificación asociada a la solicitud
       */
      ctrl.validarFormularioAprobacion = function () {
        if (!ctrl.isInicial) {
          ctrl.cargarJustificacion();
        }
      };

      /**
       * @ngdoc method
       * @name getDocumento
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {number} docid Id del documento en {@link services/poluxClienteApp.service:gestorDocumentalMidService gestorDocumentalMidService}
       * @returns {undefined} No retorna ningún valor
       * @description 
       * Llama al gestor documental para recuperar y mostrar el documento.
       */
      ctrl.getDocumento = function (docid) {
        //Muestra de documento con el gestor documental
        gestorDocumentalMidRequest.get('/document/' + docid).then(function (response) {
          var file = new Blob([utils.base64ToArrayBuffer(response.data.file)], { type: 'application/pdf' });
          var fileURL = URL.createObjectURL(file);
          $window.open(fileURL, 'resizable=yes,status=no,location=no,toolbar=no,menubar=no,fullscreen=yes,scrollbars=yes,dependent=no,width=700,height=900');

        })
          .catch(function (error) {

            swal(
              $translate.instant("MENSAJE_ERROR"),
              $translate.instant("ERROR.CARGAR_DOCUMENTO"),
              'warning'
            );
          });
      }

      /**
       * @ngdoc method
       * @name getDocAnyFormat
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {number} docid Id del documento en {@link services/poluxClienteApp.service:gestorDocumentalMidService gestorDocumentalMidService}
       * @returns {undefined} No retorna ningún valor
       * @description 
       * Llama al gestor documental para recuperar y mostrar el documento.
       */
      ctrl.getDocAnyFormat = function (docid) {
        gestorDocumentalMidRequest.get('/document/' + docid).then(function (response) {
          console.log("Response GET", response);
          var file = new Blob([utils.base64ToArrayBuffer(response.data.file)]);
          var fileURL = URL.createObjectURL(file);
          
          var a = document.createElement('a');
          a.href = fileURL;
          a.download = response.data["dc:title"]; // Nombre del archivo a descargar
          document.body.appendChild(a);
          a.click();
          
          // Limpieza
          setTimeout(function() {
            document.body.removeChild(a);
            URL.revokeObjectURL(fileURL);
          }, 100);
        })
        .catch(function (error) {
          swal(
            $translate.instant("MENSAJE_ERROR"),
            $translate.instant("ERROR.CARGAR_DOCUMENTO"),
            'warning'
          );
        });
      }

      /**
       * @ngdoc method
       * @name getDocumentos
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {undefined} undefined no requiere parámetros
       * @returns {undefined} No retorna ningún valor
       * @description 
       * Función que consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para consultar las 
       * actas subidas en las carreras del coordinador.
       */
      ctrl.getDocumentos = function () {
        var sql = "";
        let tipoDocumento = ctrl.TipoDocumento.find(tipoDoc => {
          return tipoDoc.CodigoAbreviacion == "ACT_PLX"
        })
        angular.forEach(ctrl.carrerasCoordinador, function (carrera) {
          
          if(token_service.getAppPayload().appUserRole.includes("CONTRATISTA")){
            sql = sql + ",Titulo.contains:Codigo de carrera: " + carrera.proyecto;
          }else{
            sql = sql + ",Titulo.contains:Codigo de carrera: " + carrera.codigo_proyecto_curricular;
          }

          var parametrosDocumentos = $.param({
            query: "TipoDocumentoEscrito:" + tipoDocumento.Id + sql,
            limit: 0
          });
          $scope.loadDocumento = true;
          poluxRequest.get("documento_escrito", parametrosDocumentos).then(function (responseDocumentos) {
            if (Object.keys(responseDocumentos.data.Data[0]).length > 0) {
              angular.forEach(responseDocumentos.data.Data, function (documento) {

                var tempDoc = {
                  "id": documento.Id,
                  "nombre": documento.Titulo,
                  "url": documento.Enlace,
                }
                ctrl.documentos.push(tempDoc);
              });
            }
            $scope.loadDocumento = false;
          })
            .catch(function (error) {

              ctrl.errorCargarDocumento = true;
              $scope.loadDocumento = false;
            });
        });
      }

      /**
       * @ngdoc method
       * @name seleccionarDocumento
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {undefined} undefined no requiere parámetros
       * @returns {undefined} No retorna ningún valor
       * @description 
       * Función que guarda el documento seleccionado por el usuario en el modalDocumento y lo cierra
       */
      ctrl.seleccionarDocumento = function () {
        if (ctrl.acta.url !== undefined) {
          $('#modalSeleccionarDocumento').modal('hide');
        } else {
          swal(
            $translate.instant("DOCUMENTO.SIN_DOCUMENTO"),
            ' ',
            'warning'
          );
        }
      }

      /**
       * @ngdoc method
       * @name EnvioNotificacion
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No retorna ningún valor
       * @description 
       * Función que se encarga de enviar la notificación de la respuesta de la solicitud por correo 
       */
      ctrl.EnvioNotificacion = async function () {

        var titulo_tg, respuesta, usuario, rol_id, docente_id, correos = []
        var tieneEvaluador = false

        //Todas las respuestas de las solicitudes se envían al estudiante
        var data_auth_mid = {
          numero : ctrl.detallesSolicitud.solicitantes.toString()
        }

        await autenticacionMidRequest.post("token/documentoToken",data_auth_mid).then(function(response){//se busca el correo del estudiante con el documento
          correos.push(response.data.email)//se almacena en los correos destinatarios
        })

        //Se recupera la información para adjuntar en la plantilla del correo
        if(ctrl.tipoSolicitudTemp.CodigoAbreviacion == "SI_PLX" || ctrl.tipoSolicitudTemp.CodigoAbreviacion == "SAD_PLX"){//si es solicitud inicial
          if(ctrl.respuestaSolicitud == "ADD_PLX" || ctrl.respuestaSolicitud == "RDD_PLX"){ //respondió docente director
            
            usuario = ctrl.docenteDirector.NOMBRE

            if(ctrl.respuestaSolicitud == "ADD_PLX"){
              //Se adjunta el correo de la coordinación al aprobar
              await academicaRequest.get("datos_basicos_estudiante", [ctrl.detallesSolicitud.solicitantes]).then(async function(datosEstudiante){//se busca la carrera
                await academicaRequest.get("consulta_carrera_condor", [datosEstudiante.data.datosEstudianteCollection.datosBasicosEstudiante[0].carrera]).then(async function(carrera){//se busca el documento del coordinador

                  data_auth_mid = {
                    numero : carrera.data.carreraCondorCollection.carreraCondor[0].numero_documento_coordinador
                  }
          
                  await autenticacionMidRequest.post("token/documentoToken",data_auth_mid).then(function(response){//se busca el correo
                    correos.push(response.data.email)//se almacena en los correos destinatarios
                  })
                })
                //se busca el correo del Asistente de Proyecto
                await academicaRequest.get("obtener_asistente", [estudiante.data.datosEstudianteCollection.datosBasicosEstudiante[0].carrera]).then(async function(asistente){

                  data_auth_mid = {
                    numero : asistente.data.asistente.proyectos[0].documento_asistente
                  }
          
                  await autenticacionMidRequest.post("token/documentoToken",data_auth_mid).then(function(response){//se busca el correo del estudiante con el documento
                    correos.push(response.data.email)//se almacena en los correos destinatarios
                  })
                })
              })
            }
          }

          angular.forEach(ctrl.detallesSolicitud, function (detalle) {
            if (detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "NPRO") {
              titulo_tg = detalle.Descripcion;//se obtiene el título del tg
            }
          })
        }
        else{//demás solicitudes
          if(ctrl.respuestaSolicitud == "ADD_PLX" || ctrl.respuestaSolicitud == "RDD_PLX"){ //respondió docente director
            
            //se busca el nombre del docente con el documento
            angular.forEach(ctrl.RolTrabajoGrado, function(dataRol){ 
              if(dataRol.CodigoAbreviacion == "DIRECTOR_PLX"){
                rol_id = rol.Id
              }
            })
    
            angular.forEach(ctrl.docentesVinculadosTg, function(docente){
              if(docente.RolTrabajoGrado == rol_id){
                docente_id = docente.Usuario
              }
            })
    
            await academicaRequest.get("docente_tg", [docente_id]).then(function(docente){
              if (!angular.isUndefined(docente.data.docenteTg.docente)) {
                usuario = docente.data.docenteTg.docente[0].nombre
              }
            })

            //se preparan los correos a notificar
            if(ctrl.modalidadTemp.CodigoAbreviacion == "PAS_PLX" && ctrl.respuestaSolicitud == "ADD_PLX" && ctrl.tipoSolicitudTemp.CodigoAbreviacion == 'SRTG_PLX'){
              //si el director aprueba la solicitud de revisión de tg para Pasantía, se notifica a la oficina de pasantías
              correos.push("pasantias_ing@udistrital.edu.co")
            }
            else if(ctrl.respuestaSolicitud == "ADD_PLX"){
              //si el director aprueba cualquier otra solicitud, se debe notificar a la coordinación

              await academicaRequest.get("datos_basicos_estudiante", [ctrl.detallesSolicitud.solicitantes]).then(async function(estudianteTemp){
                await academicaRequest.get("consulta_carrera_condor", [estudianteTemp.data.datosEstudianteCollection.datosBasicosEstudiante[0].carrera]).then(async function(carrera){

                  data_auth_mid = {
                    numero : carrera.data.carreraCondorCollection.carreraCondor[0].numero_documento_coordinador
                  }
          
                  await autenticacionMidRequest.post("token/documentoToken",data_auth_mid).then(function(response){//se busca el correo del estudiante con el documento
                    correos.push(response.data.email)//se almacena en los correos destinatarios
                  })
                })

                //se busca el correo del Asistente de Proyecto
                await academicaRequest.get("obtener_asistente", [estudianteTemp.data.datosEstudianteCollection.datosBasicosEstudiante[0].carrera]).then(async function(asistente){

                  data_auth_mid = {
                    numero : asistente.data.asistente.proyectos[0].documento_asistente
                  }
          
                  await autenticacionMidRequest.post("token/documentoToken",data_auth_mid).then(function(response){//se busca el correo del estudiante con el documento
                    correos.push(response.data.email)//se almacena en los correos destinatarios
                  })
                })
              })
            }
          }

          titulo_tg = ctrl.dataSolicitud.TrabajoGrado.Titulo
        }

        if(ctrl.respuestaSolicitud == "ACC_PLX" || ctrl.respuestaSolicitud == "RCC_PLX"){//respondió coordinación
          usuario = $translate.instant("NOTIFICACION.COORDINACION")

          if(ctrl.respuestaSolicitud == "ACC_PLX" && ctrl.modalidadTemp.CodigoAbreviacion == "PAS_PLX"){//Cada vez que la coordinación apruebe una solicitud de una pasantía, se debe notificar a la oficina de pasantía
            correos.push("pasantias_ing@udistrital.edu.co")
          }

          if(ctrl.tipoSolicitudTemp.CodigoAbreviacion == 'SRTG_PLX' && ctrl.respuestaSolicitud == "ACC_PLX"){//si la solicitud es de revisión tg y fue aprobada, se adjuntan los correos del docente director y evaluador (si tiene)

            angular.forEach(ctrl.RolTrabajoGrado, function(rolTemp){//se busca el rol de director
              if(rolTemp.CodigoAbreviacion == "DIRECTOR_PLX"){
                rol_id = rol.Id
              }
            })
    
            angular.forEach(ctrl.docentesVinculadosTg, function(docente){//se busca el documento del docente con el rol
              if(docente.RolTrabajoGrado == rol_id){
                docente_id = docente.Usuario
              }
            })

            data_auth_mid = {
              numero : docente_id.toString()
            }
    
            await autenticacionMidRequest.post("token/documentoToken",data_auth_mid).then(function(response){//se busca el correo con el documento
              correos.push(response.data.email)
            })

            angular.forEach(ctrl.RolTrabajoGrado, function(rolTemp2){//se busca el rol de evaluador
              if(rolTemp2.CodigoAbreviacion == "EVALUADOR_PLX"){
                rol_id = rol.Id
              }
            })
    
            angular.forEach(ctrl.docentesVinculadosTg, function(docente){//se busca el documento del docente con el rol
              if(docente.RolTrabajoGrado == rol_id){
                docente_id = docente.Usuario
                tieneEvaluador = true
              }
            })
            
            if(tieneEvaluador){//si el tg tiene evaluador, se adjunta el correo
              data_auth_mid = {
                numero : docente_id.toString()
              }
      
              await autenticacionMidRequest.post("token/documentoToken",data_auth_mid).then(function(response){
                correos.push(response.data.email)
              })
            }
          }
          else if((ctrl.tipoSolicitudTemp.CodigoAbreviacion == 'SCDI_PLX' || ctrl.tipoSolicitudTemp.CodigoAbreviacion == 'SCE_PLX' || ctrl.tipoSolicitudTemp.CodigoAbreviacion == 'SCCI_PLX') && ctrl.respuestaSolicitud == "ACC_PLX"){
            //si la solicitud aprobada es de Cambio de Director, Codirector o evaluador, se debe enviar una notificación al nuevo vinculado

            var rol, estudiante, correo_vinculado = []

            //Se establece el nombre del rol por medio del tipo de solicitud
            if (ctrl.tipoSolicitudTemp.CodigoAbreviacion == 'SCDI_PLX') {
              angular.forEach(ctrl.RolTrabajoGrado,function(rolTemp){
                if(rolTemp.CodigoAbreviacion == "DIRECTOR_PLX"){
                  rol = rolTemp.Nombre
                }
              })
            } else if (ctrl.tipoSolicitudTemp.CodigoAbreviacion == 'SCE_PLX') { 
              angular.forEach(ctrl.RolTrabajoGrado,function(rolTemp){
                if(rolTemp.CodigoAbreviacion == "EVALUADOR_PLX"){
                  rol = rolTemp.Nombre
                }
              })
            } else if (ctrl.tipoSolicitudTemp.CodigoAbreviacion == 'SCCI_PLX') { 
              angular.forEach(ctrl.RolTrabajoGrado,function(rolTemp){
                if(rolTemp.CodigoAbreviacion == "CODIRECTOR_PLX"){
                  rol = rolTemp.Nombre
                }
              })
            }

            //se busca el nombre del estudiante con el codigo
            await academicaRequest.get("datos_basicos_estudiante", [ctrl.detallesSolicitud.solicitantes]).then(function(est){
              estudiante = est.data.datosEstudianteCollection.datosBasicosEstudiante[0].nombre
            })

            //Se busca el correo del nuevo vinculado por su documento
            data_auth_mid = {
              numero : ctrl.docenteCambio.id
            }
    
            await autenticacionMidRequest.post("token/documentoToken",data_auth_mid).then(function(response){
              correo_vinculado.push(response.data.email)
            })

            var data_correo = {
              "Source": "notificacionPolux@udistrital.edu.co",
              "Template": "POLUX_PLANTILLA_ASIGNACION",
              "Destinations": [
                {
                  "Destination": {
                    "ToAddresses": correo_vinculado
                  },
                  "ReplacementTemplateData": {
                    "rol": rol,
                    "nombre_estudiante": estudiante,
                    "titulo_tg": titulo_tg,
                    "modalidad": ctrl.modalidadTemp.Nombre
                  }
                }
              ]
            }

            //console.log(correo_vinculado)

            //DESCOMENTAR AL SUBIR A PRODUCCIÓN
            /*notificacionRequest.post("email/enviar_templated_email", data_correo).then(function (response) {
              console.log("Envia el correo: ", response)
            }).catch(function (error) {
              console.log("Error: ", error)
            });*/

          }
        }
        else if(ctrl.respuestaSolicitud == "AOP_PLX" || ctrl.respuestaSolicitud == "ROP_PLX"){//respondió la oficina de pasantías
          //se envía el nombre de la oficina
          usuario = $translate.instant("NOTIFICACION.PASANTIA")

          if(ctrl.respuestaSolicitud == "AOP_PLX"){
            await academicaRequest.get("datos_basicos_estudiante", [ctrl.detallesSolicitud.solicitantes]).then(async function(data_estudiante_temp){
              await academicaRequest.get("consulta_carrera_condor", [data_estudiante_temp.data.datosEstudianteCollection.datosBasicosEstudiante[0].carrera]).then(async function(carrera){

                data_auth_mid = {
                  numero : carrera.data.carreraCondorCollection.carreraCondor[0].numero_documento_coordinador
                }
        
                await autenticacionMidRequest.post("token/documentoToken",data_auth_mid).then(function(response){//se busca el correo del estudiante con el documento
                  correos.push(response.data.email)//se almacena en los correos destinatarios
                })
              })

              //se busca el correo del Asistente de Proyecto
              await academicaRequest.get("obtener_asistente", [data_estudiante_temp.data.datosEstudianteCollection.datosBasicosEstudiante[0].carrera]).then(async function(asistente){

                data_auth_mid = {
                  numero : asistente.data.asistente.proyectos[0].documento_asistente
                }
        
                await autenticacionMidRequest.post("token/documentoToken",data_auth_mid).then(function(response){//se busca el correo del estudiante con el documento
                  correos.push(response.data.email)//se almacena en los correos destinatarios
                })
              })
            })
          }
        }

        angular.forEach(ctrl.EstadoSolicitud, function (estado) {
          if (estado.CodigoAbreviacion == ctrl.respuestaSolicitud) {
            respuesta = estado.Nombre;//se obtiene el nombre de la respuesta
          }
        })

        data_correo = {
          "Source": "notificacionPolux@udistrital.edu.co",
          "Template": "POLUX_PLANTILLA_RESPUESTA_SOL",
          "Destinations": [
            {
              "Destination": {
                "ToAddresses": correos
              },
              "ReplacementTemplateData": {
                "respuesta": respuesta,
                "nombre_usuario": usuario,
                "titulo_tg": titulo_tg,
                "tipo_solicitud": ctrl.tipoSolicitudTemp.Nombre,
                "comentario": ctrl.justificacion
              }
            }
          ]
        }

        //console.log(correos)

        //DESCOMENTAR AL SUBIR A PRODUCCIÓN
        /*notificacionRequest.post("email/enviar_templated_email", data_correo).then(function (response) {
          console.log("Envia el correo: ",response)
        }).catch(function (error) {
          console.log("Error: ", error)
        });*/
      }

      /**
       * @ngdoc method
       * @name modalDocumento
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No retorna ningún valor
       * @description 
       * Función que muestra el modal que permite seleccionar un documento 
       */
      ctrl.modalDocumento = function () {
        ctrl.documentos = [];
        ctrl.getDocumentos();
        $('#modalSeleccionarDocumento').modal('show');
      }

      /**
       * @ngdoc method
       * @name RespuestaDocente
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No retorna ningún valor
       * @description 
       * Función que se encarga de cargar la solicitud cambiando el estado de la misma para continuar con el flujo del proyecto de grado
       */
      ctrl.RespuestaDocente = async function () {
        console.log("RESPUESTA DOCENTE")
        //Aprobar
        var resOriginal = ctrl.respuestaSolicitud
        var estadoSolicitud = $.param({
          query: "TipoParametroId__CodigoAbreviacion:EST_SOL",
          limit: 0
        });
        await parametrosRequest.get("parametro/?", estadoSolicitud).then(function (responseEstadoSolicitud) {
          ctrl.EstadoSolicitud = responseEstadoSolicitud.data.Data;
        })
        let estadoSolRtaNueva = ctrl.EstadoSolicitud.find(est => {
          return est.CodigoAbreviacion == resOriginal
        })
        if (estadoSolRtaNueva.CodigoAbreviacion == "ADD_PLX") {
          parametrosSolicitudes = $.param({
            query: "Id:" + ctrl.solicitud,
          });
          poluxRequest.get("solicitud_trabajo_grado", parametrosSolicitudes).then(async function (responsesolicitud) {
            console.log("CONSULTA 3");
            var parametro = responsesolicitud.data.Data[0];
            var modalidad = 0;
            if (ctrl.tipoSolicitudTemp.CodigoAbreviacion == "SAD_PLX") {
              if (ctrl.modalidadTemp.CodigoAbreviacion == "PAS_PLX") {
                let estadoResAux = ctrl.EstadoSolicitud.find(est => {
                  return est.CodigoAbreviacion == "PREP_PLX"
                })
                var parametros = $.param({
                  query: "Activo:true,SolicitudTrabajoGrado.Id:" + ctrl.solicitud,
                  limit: 0
                });
                poluxRequest.get("respuesta_solicitud", parametros).then(function (respuestaSolicitud) {
                  angular.forEach(respuestaSolicitud.data.Data, function (value) {
                    if (Object.keys(value).length > 0) {
                      var parametrosRespuestaSolicitud = {
                        "Id": value.Id,
                        "Fecha": new Date(),
                        "Justificacion": "El Director aprobo la " + ctrl.tipoSolicitudTemp.Nombre,
                        "EnteResponsable": 0,
                        "Usuario": $scope.userId,
                        "Activo": true,
                        "EstadoSolicitud": estadoResAux.Id,
                        "SolicitudTrabajoGrado": {
                          "Id": Number(ctrl.solicitud)
                        }

                      };
                      poluxRequest.put("respuesta_solicitud", ctrl.solicitud, parametrosRespuestaSolicitud).then(function (responsesolicitudsolicitud) {

                        if (responsesolicitudsolicitud.data.Data !== undefined) {

                          //no entra nunca
                          
                          swal(
                            $translate.instant("RESPUESTA_SOLICITUD"),
                            $translate.instant("SOLICITUD_APROBADA"),
                            'success'
                          );
                          $location.path("/solicitudes/listar_solicitudes");

                        } else {
                          swal(
                            $translate.instant("RESPUESTA_SOLICITUD"),
                            $translate.instant(responsesolicitudsolicitud.data.Data),
                            'warning'
                          );
                        }


                      });
                    }
                  });
                })
                  .catch(function () {
                    $scope.mensajeErrorSolicitudes = $translate.instant('ERROR.CARGA_SOLICITUDES');
                    $scope.errorCargarSolicitudes = true;
                    $scope.loadSolicitudes = false;

                  });
              }
              let idTipoSolTemp = ctrl.TipoSolicitud.find(tipo => {
                return tipo.CodigoAbreviacion == "SI_PLX";
              });
              var parametrosSolicitudModalidad = $.param({
                query: "Modalidad:" + ctrl.modalidadTemp.Id + ",TipoSolicitud:" + idTipoSolTemp.Id,
              });
              await poluxRequest.get("modalidad_tipo_solicitud", parametrosSolicitudModalidad).then(function (responseSolicitudModalidad) {
                modalidad = responseSolicitudModalidad.data.Data[0].Id
              });
              parametrosSolicitud = $.param({
                query: "Modalidad:" + ctrl.modalidadTemp.Id + ",TipoSolicitud:" + ctrl.tipoSolicitudTemp.Id,
              });
              poluxRequest.get("modalidad_tipo_solicitud", parametrosSolicitud).then(function (response_modalidad_solicitud) {

                if (response_modalidad_solicitud.data.Data !== undefined) {
                  parametro.ModalidadTipoSolicitud = response_modalidad_solicitud.data.Data;


                  var parametrosSolicitud1 = {
                    "Id": parametro.Id,
                    "Fecha": parametro.Fecha,
                    "ModalidadTipoSolicitud": {
                      "Id": modalidad,
                      "TipoSolicitud": null,
                      "Modalidad": null
                    },
                    "TrabajoGrado": null,
                    "PeriodoAcademico": parametro.PeriodoAcademico,
                    "DatosPersonalesArl": ctrl.SolicitudTrabajoGrado.DatosPersonalesArl

                  };
                  ctrl.getRespuestaSolicitud().then(function () {
                    var rtaActual = ctrl.respuestaActual;
                    rtaActual.Activo = false
                    poluxRequest.put("respuesta_solicitud", ctrl.respuesta_solicitud, rtaActual).then(function (responseSolicitud) {
                      if (responseSolicitud.data.Data !== undefined) {
                        rtaActual.Id = null;
                        rtaActual.Activo = true;
                        rtaActual.Fecha = new Date();
                        rtaActual.Justificacion = ctrl.justificacion;
                        rtaActual.Usuario = rtaActual.EnteResponsable;
                        rtaActual.EnteResponsable = 0;
                        rtaActual.EstadoSolicitud = estadoSolRtaNueva.Id
                        poluxRequest.post("respuesta_solicitud", rtaActual).then(function (response) {
                        }).catch(function (error) {
                          swal(
                            $translate.instant("MENSAJE_ERROR"),
                            $translate.instant("ERROR.ENVIO_SOLICITUD"),
                            'warning'
                          )
                        });
                      }
                    });
                  });
                  poluxRequest.put("solicitud_trabajo_grado", ctrl.solicitud, parametrosSolicitud1).then(function (responsesolicitudsolicitud) {
                    console.log("CONSULTA 4");
                    if (responsesolicitudsolicitud.data.Data !== undefined) {

                      //Solicitud inicial aprobada por docente director
                      ctrl.EnvioNotificacion()

                      swal(
                        $translate.instant("RESPUESTA_SOLICITUD"),
                        $translate.instant("SOLICITUD_APROBADA"),
                        'success'
                      );
                      $location.path("/solicitudes/listar_solicitudes");

                    } else {
                      swal(
                        $translate.instant("RESPUESTA_SOLICITUD"),
                        $translate.instant(responsesolicitudsolicitud.data.Data),
                        'warning'
                      );
                    }


                  });
                }
              });
            } else {
              parametros = $.param({
                query: "Activo:true,SolicitudTrabajoGrado.Id:" + ctrl.solicitud,
                limit: 0
              });
              poluxRequest.get("respuesta_solicitud", parametros).then(function (respuestaSolicitud) {
                angular.forEach(respuestaSolicitud.data.Data, function (value) {
                  if (Object.keys(value).length > 0) {

                    // Validacion de solicitud final para pasantia
                    if (ctrl.tipoSolicitudTemp.CodigoAbreviacion == "SRTG_PLX" && (ctrl.modalidadTemp.CodigoAbreviacion == "PAS_PLX")) {
                      let estadoResAux = ctrl.EstadoSolicitud.find(est => {
                        return est.CodigoAbreviacion == "PREP_PLX"
                      })
                      var parametrosRespuestaSolicitud = {
                        "Id": value.Id,
                        "Fecha": new Date(),
                        "Justificacion": "El Director aprobo la " + ctrl.tipoSolicitudTemp.Nombre,
                        "EnteResponsable": 0,
                        "Usuario": $scope.userId,
                        "Activo": true,
                        "EstadoSolicitud": estadoResAux.Id,
                        "SolicitudTrabajoGrado": {
                          "Id": Number(ctrl.solicitud)
                        }

                      };
                    } else {
                      let estadoResAux = ctrl.EstadoSolicitud.find(est => {
                        return est.CodigoAbreviacion == "ADD_PLX"
                      })
                      parametrosRespuestaSolicitud = {
                        "Id": value.Id,
                        "Fecha": new Date(),
                        "Justificacion": "El Director aprobo la " + ctrl.tipoSolicitudTemp.Nombre,
                        "EnteResponsable": 0,
                        "Usuario": $scope.userId,
                        "Activo": true,
                        "EstadoSolicitud": estadoResAux.Id,
                        "SolicitudTrabajoGrado": {
                          "Id": Number(ctrl.solicitud)
                        }

                      };
                    }
                    poluxRequest.put("respuesta_solicitud", ctrl.solicitud, parametrosRespuestaSolicitud).then(function (responsesolicitudsolicitud) {

                      if (responsesolicitudsolicitud.data.Data !== undefined) {

                        //el docente director aprobó las solicitudes sin contar Solicitud Inicial
                        ctrl.EnvioNotificacion()

                        swal(
                          $translate.instant("RESPUESTA_SOLICITUD"),
                          $translate.instant("SOLICITUD_APROBADA"),
                          'success'
                        );
                        $location.path("/solicitudes/listar_solicitudes");

                      } else {
                        swal(
                          $translate.instant("RESPUESTA_SOLICITUD"),
                          $translate.instant(responsesolicitudsolicitud.data.Data),
                          'warning'
                        );
                      }


                    });
                  }
                });
              })
                .catch(function () {
                  $scope.mensajeErrorSolicitudes = $translate.instant('ERROR.CARGA_SOLICITUDES');
                  $scope.errorCargarSolicitudes = true;
                  $scope.loadSolicitudes = false;

                });
            }

          });

        } else if (estadoSolRtaNueva.CodigoAbreviacion == "RDD_PLX") {
          //Rechazar solicitud
          var fechaRespuesta = new Date();
          parametrosSolicitudes = $.param({
            query: "Id:" + ctrl.solicitud,
          });
          poluxRequest.get("solicitud_trabajo_grado", parametrosSolicitudes).then(function () {
            //Solicitud inicial
            if (ctrl.tipoSolicitudTemp.CodigoAbreviacion == "SI_PLX") {
              var data_documento = {
                //PENDIENTE POR VERIFICAR EL DOCUMENTO CORRECTO
                "DocumentoEscrito": {
                  "Id": 49,
                },
                "SolicitudTrabajoGrado": {
                  "Id": Number(ctrl.solicitud)
                }
              };
              var objRtaNueva = {
                "Id": null,
                "Fecha": fechaRespuesta,

                "Justificacion": "El director no aprobo ser el Docente del proyecto",

                "EnteResponsable": 0,
                "Usuario": $scope.userId,
                "Activo": true,
                "EstadoSolicitud": estadoSolRtaNueva.Id,
                "SolicitudTrabajoGrado": {
                  "Id": Number(ctrl.solicitud)
                }
              };
              ctrl.getRespuestaSolicitud().then(function () {
                var objRtaAnterior = ctrl.respuestaActual;
                objRtaAnterior.Activo = false;
                ctrl.dataRespuesta = {
                  DocumentoSolicitud: data_documento,
                  EstudianteTrabajoGrado: null,
                  ModalidadTipoSolicitud: ctrl.detallesSolicitud.tipoSolicitud,
                  RespuestaAnterior: objRtaAnterior,
                  RespuestaNueva: objRtaNueva,
                  SolicitudTrabajoGrado: null,
                  TipoSolicitud: ctrl.respuestaActual.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud,
                  TrTrabajoGrado: null,
                  TrabajoGrado: null,
                  MateriasProPos: false
                };
                //console.log(ctrl.dataRespuesta);

                poluxRequest.post("tr_respuesta_solicitud", ctrl.dataRespuesta).then(function (response) {
                  ctrl.mostrarRespuesta(response);
                })
                  .catch(function (error) {

                    swal(
                      $translate.instant("MENSAJE_ERROR"),
                      $translate.instant("ERROR.ENVIO_SOLICITUD"),
                      'warning'
                    );
                  });
              }
              ).catch(function (error) {

                ctrl.errorCargarSolicitud = true;
                $scope.loadSolicitud = false;
              });
            } else {
              //Solicitud de novedad
              let estadoResAux = ctrl.EstadoSolicitud.find(est => {
                return est.CodigoAbreviacion == "RDD_PLX"
              })
              var parametros = $.param({
                query: "Activo:true,SolicitudTrabajoGrado.Id:" + ctrl.solicitud,
                limit: 0
              });
              poluxRequest.get("respuesta_solicitud", parametros).then(function (respuestaSolicitud) {
                angular.forEach(respuestaSolicitud.data.Data, function (value) {
                  if (Object.keys(value).length > 0) {
                    var parametrosRespuestaSolicitud = {
                      "Id": value.Id,
                      "Fecha": new Date(),
                      "Justificacion": ctrl.justificacion,
                      "EnteResponsable": 0,
                      "Usuario": $scope.userId,
                      "Activo": true,
                      "EstadoSolicitud": estadoResAux.Id,
                      "SolicitudTrabajoGrado": {
                        "Id": Number(ctrl.solicitud)
                      }

                    };
                    poluxRequest.put("respuesta_solicitud", ctrl.solicitud, parametrosRespuestaSolicitud).then(function (responsesolicitudsolicitud) {

                      if (responsesolicitudsolicitud.data !== undefined) {
                        //Se rechaza la solicitud por el docente
                        ctrl.EnvioNotificacion()

                        swal(
                          $translate.instant("RESPUESTA_SOLICITUD"),
                          $translate.instant("SOLICITUD_RECHAZADA"),
                          'success'
                        );
                        $location.path("/solicitudes/listar_solicitudes");

                      } else {
                        swal(
                          $translate.instant("RESPUESTA_SOLICITUD"),
                          $translate.instant(responsesolicitudsolicitud.data.Data),
                          'warning'
                        );
                      }


                    });
                  }
                });
              })
                .catch(function () {
                  $scope.mensajeErrorSolicitudes = $translate.instant('ERROR.CARGA_SOLICITUDES');
                  $scope.errorCargarSolicitudes = true;
                  $scope.loadSolicitudes = false;

                });

            }
          }).catch(function (error) {
            $scope.mensajeErrorSolicitudes = $translate.instant('ERROR.CARGA_SOLICITUDES');
            $scope.errorCargarSolicitudes = true;
            $scope.loadSolicitudes = false;
          });

        } else if (estadoSolRtaNueva.CodigoAbreviacion == "ACC_PLX" || estadoSolRtaNueva.CodigoAbreviacion == "RCC_PLX") {
          swal(
            $translate.instant("MENSAJE_ERROR"),
            $translate.instant("DEBE_SELECCIONAR_UNA_RESPUESTA"),
            'warning'
          );
        }
      }

      /**
       * @ngdoc method
       * @name RespuestaExtensionPasantia
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No retorna ningún valor
       * @description 
       * Función que se encarga de tramitar las respuesta por parte de la unidad de extension de pasantia
       */
      ctrl.RespuestaExtensionPasantia = async function () {

        /*let estadoRespuesta = ctrl.EstadoSolicitud.find(est => {
          return est.CodigoAbreviacion == ctrl.respuestaSolicitud
        })
*/
        var resOriginal = ctrl.respuestaSolicitud
        var estadoSolicitud = $.param({
          query: "TipoParametroId__CodigoAbreviacion:EST_SOL",
          limit: 0
        });
        await parametrosRequest.get("parametro/?", estadoSolicitud).then(function (responseEstadoSolicitud) {
          ctrl.EstadoSolicitud = responseEstadoSolicitud.data.Data;
        })
        let estadoSolRtaNueva = ctrl.EstadoSolicitud.find(est => {
          return est.CodigoAbreviacion == resOriginal
        })

        if (estadoSolRtaNueva.CodigoAbreviacion == "AOP_PLX") {
          //aprobar
          if (ctrl.tipoSolicitudTemp.CodigoAbreviacion == "SRTG_PLX" && ctrl.modalidadTemp.CodigoAbreviacion == "PAS_PLX") {
            var fileBase64;
            var data = [];
            var URL = "";
            utils.getBase64(ctrl.docCertificadoUnidadExt.fileModel).then(
              function (base64) {

                fileBase64 = base64;
                let tipoDocumento = ctrl.TipoDocumento.find(tipoDoc => {
                  return tipoDoc.CodigoAbreviacion == "DPAS_PLX"
                })
                data = [{
                  IdTipoDocumento: tipoDocumento.Id, //id tipo documento de documentos_crud
                  nombre: "Certificado Unidad Extension solicitud" + ctrl.solicitud,// nombre formado por el acta de solicitud y la solicitud

                  metadatos: {
                    NombreArchivo: "Certificado Unidad Extension solicitud" + ctrl.solicitud,
                    Tipo: "Archivo",
                    Observaciones: "certificado"
                  },
                  descripcion: "Certificado Unidad Extension solicitud " + ctrl.solicitud,
                  file: fileBase64,
                }]

                gestorDocumentalMidRequest.post('/document/upload', data).then(function (response) {
                  URL = response.data.res.Enlace;
                  ctrl.urlCertUniExt = URL
                  var detalle_documento_certi = {
                    "Descripcion": ctrl.urlCertUniExt,
                    "SolicitudTrabajoGrado": {
                      "Id": Number(ctrl.solicitud)
                    },
                    "DetalleTipoSolicitud": {
                      "Id": ctrl.SolicitudTrabajoGrado.ModalidadTipoSolicitud == 64 ? 301 : 302
                    }
                  }
                  let estadoResAux = ctrl.EstadoSolicitud.find(est => {
                    return est.CodigoAbreviacion == "APEP_PLX"
                  })

                  poluxRequest.post("detalle_solicitud", detalle_documento_certi).then(function () {
                    parametros = $.param({
                      query: "Activo:true,SolicitudTrabajoGrado.Id:" + ctrl.solicitud,
                      limit: 0
                    });
                    poluxRequest.get("respuesta_solicitud", parametros).then(function (respuestaSolicitud) {
                      angular.forEach(respuestaSolicitud.data.Data, function (value) {
                        if (Object.keys(value).length > 0) {
                          var parametrosRespuestaSolicitud = {
                            "Id": value.Id,
                            "Fecha": new Date(),
                            "Justificacion": "La oficina de extension de pasantias aprobó la " + ctrl.tipoSolicitudTemp.Nombre,

                            "EnteResponsable": 0,
                            "Usuario": $scope.userId,
                            "Activo": true,
                            "EstadoSolicitud": estadoResAux.Id,
                            "SolicitudTrabajoGrado": {
                              "Id": Number(ctrl.solicitud)
                            }

                          };
                          poluxRequest.put("respuesta_solicitud", ctrl.solicitud, parametrosRespuestaSolicitud).then(function (responsesolicitudsolicitud) {

                            if (responsesolicitudsolicitud.data.Data !== undefined) {

                              //la oficina de pasantía aprueba la solicitud de revisión
                              ctrl.EnvioNotificacion()

                              swal(
                                $translate.instant("RESPUESTA_SOLICITUD"),
                                $translate.instant("SOLICITUD_ES_APROBADA"),
                                'success'
                              );
                              $location.path("/solicitudes/listar_solicitudes");

                            } else {
                              swal(
                                $translate.instant("RESPUESTA_SOLICITUD"),
                                $translate.instant(responsesolicitudsolicitud.data.Data),
                                'warning'
                              );
                            }
                          });
                        }
                      });
                    })
                      .catch(function () {
                        swal(
                          $translate.instant("RESPUESTA_SOLICITUD"),
                          $translate.instant(responsesolicitudsolicitud),
                          'warning'
                        );
                      });
                  }).catch(function (error) {
                    swal(
                      $translate.instant("RESPUESTA_SOLICITUD"),
                      $translate.instant(responsesolicitudsolicitud),
                      'warning'
                    );
                  })
                }).catch(function () {
                  swal(
                    $translate.instant("RESPUESTA_SOLICITUD"),
                    $translate.instant(responsesolicitudsolicitud),
                    'warning'
                  );
                })

              })
              .catch(function (error) {
                swal(
                  $translate.instant("MENSAJE_ERROR"),
                  $translate.instant("ERROR.ENVIO_SOLICITUD"),
                  'warning'
                );
                $scope.mensajeErrorSolicitudes = $translate.instant('ERROR.CARGA_SOLICITUDES');
                $scope.errorCargarSolicitudes = true;
                $scope.loadSolicitudes = false;
              });
          } else {//Si no es una solicitud de revisión

            //Se debe cambiar el Estado de Solicitud a Aprobada por la oficina de extension de pasantias en Respuesta_solicitud
            let estadoResAux = ctrl.EstadoSolicitud.find(est => {//Busca el estado de Aprobado por la oficina de Pasantia
              return est.CodigoAbreviacion == "APEP_PLX"
            })
            var parametros = $.param({//Se prepara el query con el id de la Solicitud
              query: "Activo:true,SolicitudTrabajoGrado.Id:" + ctrl.solicitud,
              limit: 0
            });
            poluxRequest.get("respuesta_solicitud", parametros).then(function (respuestaSolicitud) {//Se trae la Respuesta_Solicitud
              angular.forEach(respuestaSolicitud.data.Data, function (value) {//Recorre los registros consultados
                if (Object.keys(value).length > 0) {
                  var parametrosRespuestaSolicitud = {//Prepara la respuesta cambiando el estado de la solicitud y el usuario
                    "Id": value.Id,
                    "Fecha": new Date(),
                    "Justificacion": "La oficina de extension de pasantias aprobó la " + ctrl.tipoSolicitudTemp.Nombre,

                    "EnteResponsable": 0,
                    "Usuario": $scope.userId,
                    "Activo": true,
                    "EstadoSolicitud": estadoResAux.Id,
                    "SolicitudTrabajoGrado": {
                      "Id": Number(ctrl.solicitud)
                    }

                  };
                  poluxRequest.put("respuesta_solicitud", ctrl.solicitud, parametrosRespuestaSolicitud).then(async function (responsesolicitudsolicitud) { //Se realizan los cambios

                    if (responsesolicitudsolicitud.data.Data !== undefined) { //Si no hubo error...

                      //Se debe cambiar la Modalidad_tipo_solicitud en Solicitud_trabajo_grado por el tipo de solicitud de Solicitud inicial

                      parametrosSolicitudes = $.param({//Se prepara la query para traer la solicitud_trabajo_grado
                        query: "Id:" + ctrl.solicitud,
                      });
                      poluxRequest.get("solicitud_trabajo_grado", parametrosSolicitudes).then(async function (responsesolicitud) {//Se trae la solicitud_trabajo_grado que cumpla las condiciones
                        console.log("CONSULTA 6");
                        var parametro = responsesolicitud.data.Data[0];
                        var modalidad = 0;

                        let idTipoSolTemp = ctrl.TipoSolicitud.find(tipo => {//Busca el Tipo de solicitud de Solicitud Inicial
                          return tipo.CodigoAbreviacion == "SI_PLX";
                        });
                        var parametrosSolicitudModalidad = $.param({//Se prepara la query para buscar en modalidad_tipo_solicitud
                          query: "Modalidad:" + ctrl.modalidadTemp.Id + ",TipoSolicitud:" + idTipoSolTemp.Id,
                        });


                        await poluxRequest.get("modalidad_tipo_solicitud", parametrosSolicitudModalidad).then(function (responseSolicitudModalidad) {//Se trae la modalidad_tipo_solicitud que cumpla con las condiciones
                          modalidad = responseSolicitudModalidad.data.Data[0].Id //Se guarda el id del nuevo modalidad_tipo_solicitud
                        });

                        var parametrosSolicitud1 = {
                          "Id": parametro.Id,
                          "Fecha": parametro.Fecha,
                          "ModalidadTipoSolicitud": {
                            "Id": modalidad,
                            "TipoSolicitud": null,
                            "Modalidad": null
                          },
                          "TrabajoGrado": null,
                          "PeriodoAcademico": parametro.PeriodoAcademico,
                          "DatosPersonalesArl": ctrl.SolicitudTrabajoGrado.DatosPersonalesArl

                        };
                        poluxRequest.put("solicitud_trabajo_grado", ctrl.solicitud, parametrosSolicitud1).then(function (responseSolicitud_TG) {//Se envia la solicitud_trabajo_grado actualizado

                          if (responseSolicitud_TG.data !== undefined) {//Si no falló
                            //la Oficina de Extensión de Pasantía aprueba S.I
                            ctrl.EnvioNotificacion()

                            swal(
                              $translate.instant("RESPUESTA_SOLICITUD"),
                              $translate.instant("SOLICITUD_APROBADA"),
                              'success'
                            );
                            $location.path("/solicitudes/listar_solicitudes");

                          } else {
                            swal(
                              $translate.instant("RESPUESTA_SOLICITUD"),
                              $translate.instant(responseSolicitud_TG.data.Data),
                              'warning'
                            );
                          }
                        });
                      });
                    } else {
                      swal(
                        $translate.instant("RESPUESTA_SOLICITUD"),
                        $translate.instant(responsesolicitudsolicitud.data.Data),
                        'warning'
                      );
                    }
                  });
                }
              });
            })
              .catch(function () {
                $scope.mensajeErrorSolicitudes = $translate.instant('ERROR.CARGA_SOLICITUDES');
                $scope.errorCargarSolicitudes = true;
                $scope.loadSolicitudes = false;
              });
          }

        } else {
          //rechazar
          let estadoResAux = ctrl.EstadoSolicitud.find(est => {
            return est.CodigoAbreviacion == "RPEP_PLX"
          })
          parametros = $.param({
            query: "Activo:true,SolicitudTrabajoGrado.Id:" + ctrl.solicitud,
            limit: 0
          });
          poluxRequest.get("respuesta_solicitud", parametros).then(function (respuestaSolicitud) {
            angular.forEach(respuestaSolicitud.data.Data, function (value) {
              if (Object.keys(value).length > 0) {
                var parametrosRespuestaSolicitud = {
                  "Id": value.Id,
                  "Fecha": new Date(),
                  "Justificacion": "La oficina de extension de pasantias rechazo la " + ctrl.tipoSolicitudTemp.Nombre,

                  "EnteResponsable": 0,
                  "Usuario": $scope.userId,
                  "Activo": true,
                  "EstadoSolicitud": estadoResAux.Id,
                  "SolicitudTrabajoGrado": {
                    "Id": Number(ctrl.solicitud)
                  }

                };
                poluxRequest.put("respuesta_solicitud", ctrl.solicitud, parametrosRespuestaSolicitud).then(function (responsesolicitudsolicitud) {

                  if (responsesolicitudsolicitud.data.Data !== undefined) {

                    //rechazo por parte de la oficina de extensión de pasantía
                    ctrl.EnvioNotificacion()

                    swal(
                      $translate.instant("RESPUESTA_SOLICITUD"),
                      $translate.instant("SOLICITUD_RECHAZADA"),
                      'success'
                    );
                    $location.path("/solicitudes/listar_solicitudes");

                  } else {
                    swal(
                      $translate.instant("RESPUESTA_SOLICITUD"),
                      $translate.instant(responsesolicitudsolicitud.data.Data),
                      'warning'
                    );
                  }


                });
              }
            });
          })
            .catch(function () {
              $scope.mensajeErrorSolicitudes = $translate.instant('ERROR.CARGA_SOLICITUDES');
              $scope.errorCargarSolicitudes = true;
              $scope.loadSolicitudes = false;

            });
        }
      }

    });