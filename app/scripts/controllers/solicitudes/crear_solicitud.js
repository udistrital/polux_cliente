'use strict';

/**
 * @ngdoc controller
 * @name poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
 * @description
 * # SolicitudesCrearSolicitudCtrl
 * Controller of the poluxClienteApp
 * Controlador que permite al estudiante crear una solicitud, en caso de que cuente con un trabajo de grado muestra los tipos de solicitudes
 * asociadas a esa modalidad (cancelación, cambio de nombre, cambio de director, entre otros), en caso contrario, muestra una lista de las solicitudes
 * iniciales de cada modalidad.
 * @requires $location
 * @requires $q
 * @requires $routeParams
 * @requires $sce
 * @requires $scope
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires $window
 * @requires services/parametrosService.service:parametrosRequest
 * @requires services/academicaService.service:academicaRequest
 * @requires services/cidcRequest.service:cidcService
 * @requires services/poluxClienteApp.service:coreAmazonCrudService
 * @requires services/poluxMidService.service:poluxMidRequest
 * @requires services/poluxService.service:poluxRequest
 * @requires services/poluxService.service:gestorDocumentalMidService
 * @requires services/poluxClienteApp.service:sesionesService
 * @requires services/poluxClienteApp.service:tokenService
 * @requires services/documentoService.service:documentoRequest
 * @property {Array} modalidades Modalidades disponibles para la elección del estudiante.
 * @property {Object} estudiante Datos del estudiante que esta realizando la solicitud.
 * @property {Object} periodoAnterior Periodo academico anterior.
 * @property {Object} periodoActual Periodo academico actual.
 * @property {Object} periodoSiguiente Periodo academico siguiente.
 * @property {Array} solicitudes Solicitudes realizadas por el estudiante anteriormente
 * @property {Array} detalles Detalles cargados para mostrar en el formulario que se asocian con la modalidad y el tipo de solicitud escogidas por el solicitante.
 * @property {Array} areas Areas del conocimiento.
 * @property {Array} espaciosElegidos Objeto que contiene los espacios elegidos por el estudiante en la solicitud inicial.
 * @property {Boolean} detallesCargados Flag que indica que los detalles terminaron de cargarse..
 * @property {Boolean} siPuede Flag que permite identificar si se puede realizar la solicitud (el estudiante cumple con los requisitos y se encuentra en las fechas para hacerlo)
 * @property {Boolean} restringirModalidadesPosgrado Flag que permite identificar si se deben restringir las demas modalidades debido a que el estudiante ya realizo una solicitud inicial de materias de posgrado.
 * @property {Array} estudiantesTg Estudiantes asociados al tranajo de grado.
 * @property {Array} estudiantes Estudiantes que se agregan a la solicitud inicial.
 * @property {Object} Trabajo Datos del trabajo de grado que cursa el estudiante que esta realizando la solicitud.
 * @property {Boolean} siModalidad Indicador que maneja la habilitación de una modalidad
 * @property {Boolean} modalidad_select Indicador que maneja la selección de una modalidad
 * @property {Boolean} solicitudConDetalles Indicador que maneja el contenido de los detalles dentro de una solicitud
 * @property {Boolean} restringirModalidadesProfundizacion Indicador que maneja la restricción de modalidades para crear solicitud y solo habilita la modalidad de profundización
 * @property {Array} detallesConDocumento Colección que maneja los detalles con documento de una solicitud
 * @property {Boolean} tieneProrrogas Indicador que maneja si existen prórrogas registradas para el estudiante que realiza la solicitud
 * @property {String} codigo Texto que carga el código del estudiante en sesión
 * @property {String} mensajeErrorCarga Texto que aparece en caso de haber un error durante la carga de información
 * @property {Object} modalidad Objeto que carga el contenido de la modalidad seleccionada
 * @property {Object} Trabajo Objeto que carga la información del estudiante con trabajo de grado registrado
 * @property {Object} carreraElegida Objeto que carga la información sobre la carrera elegida por el estudiante
 * @property {Object} trabajo_grado_completo Objeto que carga la información del trabajo de grado en curso
 * @property {Number} trabajo_grado Valor que carga el identificador del trabajo de grado
 * @property {Object} trabajoGrado Objeto que carga la información del trabajo de grado en curso
 * @property {Boolean} errorCarga Indicador que maneja la aparición de un error durante la carga de información
 * @property {String} mensajeError Texto que aparece en caso de haber un error al cargar los datos del estudiante con solicitud de trabajo de grado
 * @property {Object} periodo Objeto que carga la información del periodo académico en curso
 * @property {Object} fechaActual Objeto que carga la información de la fecha actual
 * @property {Object} fechaInicio Objeto que carga la fecha de inicio para un periodo de solicitudes
 * @property {Object} fechaFin Objeto que carga la fecha de finalización para un periodo de solicitudes
 * @property {Boolean} errorParametros Indicador que maneja la aparición de un error durante la carga de parámetros
 * @property {Object} TipoSolicitud Objeto que carga la información del tipo de solicitud seleccionada
 * @property {Number} ModalidadTipoSolicitud Valor que carga el identificador del tipo de solicitud asociada a una modalidad
 * @property {Boolean} erroresFormulario Indicador que maneja la aparición de errores durante el diligenciamiento del formulario
 * @property {Object} solicitud Contenido que va a registrarse en la base de datos sobre la solicitud
 * @property {Object} doc Objeto que carga la información sobre el documento que se obtiene
 * @property {Object} document Objeto que carga la información sobre el documento que se obtiene
 * @property {Object} blob Objeto que carga la información sobre el Blob del documento en carga
 * @property {Object} content Objeto que define las propiedades de visualización para el documento en carga
 * @property {Boolean} cargandoParametros Texto que aparece durante la carga de parámetros en la vista
 * @property {Boolean} enviandoFormulario Texto que aparece durante el envío del formulario
 * @property {Boolean} cargandoDetalles Texto que aparece durante la carga de detalles en el módulo
 * @property {Boolean} loadParametros Indicador que define el periodo de carga para los parámetros
 * @property {Object} infiniteScroll Objeto que configura las propiedades para la barra de desplazamiento en la visualización
 * @property {Boolean} loadDetalles Indicador que define el periodo de carga para los detalles de la solicitud
 * @property {Boolean} loadFormulario Indicador que define el periodo de carga para el formulario
 * @property {Number} posDocente Posición en la que se encuentra la información del docente en los detalles del tipo de solicitud
 * @property {Number} docDocenteDir Documento del docente director
 * @property {Number} contador contador para no repetir valores en la modalidad de pasantia
 * @property {Boolean} Nota flag que indica si el trabajo de grado ya está calificado
 */
angular.module('poluxClienteApp')
  .controller('SolicitudesCrearSolicitudCtrl',
    function($location,notificacionRequest ,$q, $routeParams, $sce, $scope, $translate, $window, parametrosRequest,academicaRequest,utils,gestorDocumentalMidRequest, cidcRequest, coreAmazonCrudService, poluxMidRequest, poluxRequest, sesionesRequest, token_service, documentoRequest,autenticacionMidRequest,CONF) {
      $scope.cargandoParametros = $translate.instant('LOADING.CARGANDO_PARAMETROS');
      $scope.enviandoFormulario = $translate.instant('LOADING.ENVIANDO_FORLMULARIO');
      $scope.cargandoDetalles = $translate.instant('LOADING.CARGANDO_DETALLES');
      $scope.loadParametros = true;
      //opciones infinite scroll
      $scope.infiniteScroll = {};
      $scope.infiniteScroll.numToAdd = 20;
      $scope.infiniteScroll.currentItems = 20;
      $scope.reloadScroll = function() {
        $scope.infiniteScrollcurrentItems = $scope.infiniteScroll.numToAdd;
      };
      $scope.addMoreItems = function() {
        $scope.infiniteScroll.currentItems += $scope.infiniteScroll.numToAdd;
      };
      
      var ctrl = this;
      ctrl.modalidades = [];
      ctrl.solicitudesDisponibles = [];
      ctrl.solicitudes = [];
      ctrl.detalles = [];
      ctrl.areas = [];
      ctrl.modalidad = "";
      ctrl.espaciosElegidos = [];
      ctrl.Modalidades = [];
      ctrl.siModalidad = false;
      ctrl.modalidad_select = false;
      ctrl.detallesCargados = false;
      ctrl.soliciudConDetalles = true;
      //modalidad restringida ninguna
      ctrl.restringirModalidades = false;
      //estudiantes que estan en el tg
      ctrl.estudiantesTg = [];
      //estudiantes que se agregan a la solicitud inicial
      ctrl.estudiantes = [];
      ctrl.detallesConDocumento = [];
      ctrl.siPuede = false;
      ctrl.tieneProrrogas = false;
      ctrl.Docente = 0;
      ctrl.Docente_solicitudes=[];
      ctrl.loadDocenteSolicitud=false;
      ctrl.rol= token_service.getAppPayload().role;
      ctrl.url="url"
      if( ctrl.rol==null)
      {
        ctrl.rol= token_service.getAppPayload().appUserRole;
      }
      if(ctrl.rol!=null && ctrl.rol.includes('DOCENTE'))
      {
        ctrl.Docente = 1;
      }
      ctrl.Docente_trabajos=false;
      ctrl.tipoSolicitud_Docente=null;
      ctrl.codigo = token_service.getAppPayload().appUserDocument;
      ctrl.codigoEstu = 0;
      ctrl.Nota = false;
      ctrl.Cancelacion = false;
      ctrl.ModalidadCancelada = false
      //Objeto en el que se almacenan los datos personales del estudiante para la modalidad pasantía (interna).
      ctrl.datosEstudiante = {
        pasantiaInterna: false,
        fechaNacimiento: '',
        ciudadNacimiento: '',
        direccionResidencia: '',
        telefono: '',
        correoPersonal: '',
        eps: ''
    };

      //SE CONSULTAN LOS PARAMETROS USADOS
      /**
       * @ngdoc method
       * @name getconsultarParametros
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
       * Consulta el servicio de {@link services/poluxService.service:parametrosRequest parametrosRequest} para extraer los datos necesarios
       * @param {undefined} undefined No requiere parámetros
       */
      async function getconsultarParametros(){
        return new Promise (async (resolve, reject) => {
          var parametrosConsulta = $.param({
            query: "TipoParametroId__CodigoAbreviacion:EST_SOL",
            limit: 0,
          });

          await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (responseEstadosSolicitudes){
            ctrl.EstadosSolicitudes = responseEstadosSolicitudes.data.Data;
          });

          parametrosConsulta = $.param({
            query: "TipoParametroId__CodigoAbreviacion:EST_TRG",
            limit: 0,
          });

          await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (responseEstadosTrabajoGrado){
            ctrl.EstadosTrabajoGrado = responseEstadosTrabajoGrado.data.Data;
          });

          parametrosConsulta = $.param({
            query: "TipoParametroId__CodigoAbreviacion:EST_ESTU_TRG",
            limit: 0,
          });

          await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (responseEstadosEstudianteTrabajoGrado){
            ctrl.EstadosEstudianteTrabajoGrado = responseEstadosEstudianteTrabajoGrado.data.Data;
          });

          parametrosConsulta = $.param({
            query: "TipoParametroId__CodigoAbreviacion:MOD_TRG",
            limit: 0,
          });

          await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (responseModalidades){
            ctrl.Modalidades = responseModalidades.data.Data;
          });

          parametrosConsulta = $.param({
            query: "TipoParametroId__CodigoAbreviacion:TIP_SOL",
            limit: 0,
          });

          await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (responseTiposSolicitudes){
            ctrl.TiposSolicitudes = responseTiposSolicitudes.data.Data;
          });

          parametrosConsulta = $.param({
            query: "TipoParametroId__CodigoAbreviacion:TIP_DET",
            limit: 0,
          });

          await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (responseTiposDetalle){
            ctrl.TiposDetalle = responseTiposDetalle.data.Data;
          });

          parametrosConsulta = $.param({
            query: "TipoParametroId__CodigoAbreviacion:ROL_TRG",
            limit: 0,
          });

          await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (responseRolesTrabajoGrado){
            ctrl.RolesTrabajoGrado = responseRolesTrabajoGrado.data.Data;
          });

          parametrosConsulta = $.param({
            limit: 0,
          });

          await poluxRequest.get("modalidad_tipo_solicitud", parametrosConsulta).then(function (responseModalidadesTiposSolicitudes){
            ctrl.ModalidadesTiposSolicitudes = responseModalidadesTiposSolicitudes.data.Data;
          });

          parametrosConsulta = $.param({
            query: "TipoParametroId__CodigoAbreviacion:AC",
            limit: 0,
          });

          await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (responseAreasConocimiento){
            ctrl.AreasConocimiento = responseAreasConocimiento.data.Data;
          });

          parametrosConsulta = $.param({
            query: "DominioTipoDocumento__CodigoAbreviacion:DOC_PLX",
            limit: 0,
          });

          await documentoRequest.get("tipo_documento", parametrosConsulta).then(function (responseTiposDocumento){
            ctrl.TiposDocumento = responseTiposDocumento.data;
          });

          resolve();
        });
      }


      //CONSULTA A VINCULACIÓN_TRABAJO_GRADO
      /**
       * @ngdoc method
       * @name getNotaTrabajoGrado
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
       * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para saber si al trabajo de grado
       * ya posee una nota
       * @param {undefined} undefined No requiere parámetros
       * @returns {boolean} Boleano que indica si el trabajo de grado posee una nota o no
       */
      ctrl.getNotaTrabajoGrado = function() {
        let EstadoEstudianteTrabajoGradoTemp = ctrl.EstadosEstudianteTrabajoGrado.find(data => {
          return data.CodigoAbreviacion == "EST_ACT_PLX"
        });

        var parametrosConsulta = $.param({
          query: "estudiante:" + ctrl.codigo + ",EstadoEstudianteTrabajoGrado:" + EstadoEstudianteTrabajoGradoTemp.Id,
          limit: 1,
        });

        return poluxRequest.get("estudiante_trabajo_grado", parametrosConsulta).then(function (estudiante_trabajo_grado) {
          parametrosConsulta = $.param({
            query: "TrabajoGrado:" + estudiante_trabajo_grado.data.Data[0].TrabajoGrado.Id,
            limit: 0,
          });

          return poluxRequest.get("vinculacion_trabajo_grado", parametrosConsulta);
        }).then(function (vinculacion_trabajo_grado) {
          var promises = [];

          for (var i = 0; i < vinculacion_trabajo_grado.data.Data.length; i++) {
            parametrosConsulta = $.param({
              query: "VinculacionTrabajoGrado:" + vinculacion_trabajo_grado.data.Data[i].Id,
              limit: 0,
            });

            promises.push(poluxRequest.get("evaluacion_trabajo_grado", parametrosConsulta));
          }

          return $q.all(promises);
        }).then(function (evaluacion_trabajo_grado_results) {
          for (var i = 0; i < evaluacion_trabajo_grado_results.length; i++) {
            if (evaluacion_trabajo_grado_results[i].data.Data[0].Nota >= 0) {
              return true;
            }
          }
          return false;
        }).catch(function (error) {
          return false;
        });
      }


      /**
       * @ngdoc method
       * @name getCancelaciondeModalidad
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
       * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para saber si el estudiante ya tiene una solicitud
       * de cancelación aprobada
       * @param {undefined} undefined No requiere parámetros
       * @returns {boolean} Boleano que indica si el trabajo de grado posee una nota o no
       */

      ctrl.getCancelacionModalidad = function () {
        var parametrosConsulta = $.param({
          query: "usuario:" + ctrl.codigo,
          limit: 0,
        });

        return poluxRequest.get("usuario_solicitud", parametrosConsulta).then(function (usuario_solicitud) {
          var promises = [];

          let TipoSolicitudTemp = ctrl.TiposSolicitudes.find(data => {
            return data.CodigoAbreviacion == "SCM_PLX"
          });

          usuario_solicitud.data.Data.forEach(function (solicitud) {
            if (solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud == TipoSolicitudTemp.Id) {

              let EstadoSolicitudTemp = ctrl.EstadosSolicitudes.find(data => {
                return data.CodigoAbreviacion == "ACC_PLX"
              });

              parametrosConsulta = $.param({
                query: "solicitud_trabajo_grado:" + solicitud.SolicitudTrabajoGrado.Id + ",estado_solicitud:" + EstadoSolicitudTemp.Id,
                limit: 0,
              });

              promises.push(poluxRequest.get("respuesta_solicitud", parametrosConsulta).then(function (respuesta_solicitud) {
                if (respuesta_solicitud.data.Data[0].EstadoSolicitud == ctrl.EstadosSolicitudes[2].Id) {
                  return true;
                }
                return false;
              }));
            }
          });

          return Promise.all(promises).then(function (cancelados) {
            return cancelados.includes(true);
          });
        });
      }

      /**
       * @ngdoc method
       * @name getModalidadCancelada
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
       * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para saber si el estudiante ya ha cancelado la modalidad seleccionada
       * @param {number} modalidadSeleccionada ID de la modalidad seleccionada
       * @returns {boolean} Boleano que indica si el la modalidad fue cancelada o no
       */

      ctrl.getModalidadCancelada = function (modalidadSeleccionada) {
        var parametrosConsulta = $.param({
          query: "usuario:" + ctrl.codigo,
          limit: 0,
        });

        return poluxRequest.get("usuario_solicitud", parametrosConsulta).then(function (usuario_solicitud) {
          var promises = [];

          let TipoSolicitudTemp = ctrl.TiposSolicitudes.find(data => {
            return data.CodigoAbreviacion == "SCM_PLX"
          });

          usuario_solicitud.data.Data.forEach(function (solicitud) {
            if (solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud == TipoSolicitudTemp.Id && solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.Modalidad == modalidadSeleccionada) {

              let EstadoSolicitudTemp = ctrl.EstadosSolicitudes.find(data => {
                return data.CodigoAbreviacion == "ACC_PLX"
              });

              parametrosConsulta = $.param({
                query: "solicitud_trabajo_grado:" + solicitud.SolicitudTrabajoGrado.Id + ",estado_solicitud:" + EstadoSolicitudTemp.Id,
                limit: 0,
              });

              promises.push(poluxRequest.get("respuesta_solicitud", parametrosConsulta).then(function (respuesta_solicitud) {
                if (respuesta_solicitud.data.Data[0].EstadoSolicitud == ctrl.EstadosSolicitudes[2].Id) {
                  return true;
                }
                return false;
              }));
            }
          });

          return Promise.all(promises).then(function (cancelados) {
            return cancelados.includes(true);
          });
        });
      }

      /**
       * @ngdoc method
       * @name getProrroga
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
       * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para saber si al trabajo de grado
       * ya se le concedió una prórroga previamente
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplió la petición y se resuelve con el objeto tieneProrrogas
       */
      ctrl.getProrroga = function() {
        var defer = $q.defer();

        let EstadoTrabajoGradoTemp = ctrl.EstadosTrabajoGrado.find(data => {
          return data.CodigoAbreviacion == "EC_PLX"
        });

        var parametrosConsulta = $.param({
          query: "TrabajoGrado.EstadoTrabajoGrado:" + EstadoTrabajoGradoTemp.Id + ",Estudiante:" + ctrl.codigo,
          limit: 1,
        });
        //se consulta el trabajo de grado actual
        poluxRequest.get("estudiante_trabajo_grado", parametrosConsulta).then(function(responseTrabajoGrado) {
          if (Object.keys(responseTrabajoGrado.data.Data[0]).length > 0) {
            //se consulta si el trabajo tiene solicitudes de proroga aprobadas
            
            let EstadoSolicitudTemp = ctrl.EstadosSolicitudes.find(data => {
              return data.CodigoAbreviacion == "ACC_PLX"
            });

            let TipoSolicitudTemp = ctrl.TiposSolicitudes.find(data => {
              return data.CodigoAbreviacion == "SPR_PLX"
            });

            var parametrosProrroga = $.param({
              query: "EstadoSolicitud:" + EstadoSolicitudTemp.Id + ",activo:TRUE,SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud:" + TipoSolicitudTemp.Id + ",SolicitudTrabajoGrado.TrabajoGrado.Id:" + responseTrabajoGrado.data.Data[0].Id,
              limit: 1,
            });
            poluxRequest.get("respuesta_solicitud", parametrosProrroga).then(function(responseProrroga) {
              if (Object.keys(responseProrroga.data.Data[0]).length > 0) {
                ctrl.tieneProrrogas = true;
              }
              defer.resolve(ctrl.tieneProrrogas);
            });
          } else {
            defer.resolve(ctrl.tieneProrrogas);
          }
        });
        return defer.promise;
      }


      
      /**
       * @ngdoc method
       * @name verificarSolicitudes
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
       * Función que permite consultar las solicitudes pendientes por respuesta que tenga el estudiante
       * en el serivicio que provee {@link services/poluxService.service:poluxRequest poluxRequest}.
       * Si las solicitudes pendientes son de tipo inicial y pertenecen a la modalidad de materias de posgrado se permite que el estudiante
       * siga solicitando carreras, en cambio si la solicitud es de cualquier otro tipo se bloquea solicitar una solicitud nueva.
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplió la petición y se resuleve con el objeto solicitudesActuales
       */
      ctrl.verificarSolicitudes = function() {
        var defer = $q.defer();
        var parametrosUser = $.param({
          query: "usuario:" + ctrl.codigo,
          limit: 0,
        });
        var actuales = [];

        var requestRespuesta = function(solicitudesActuales, id) {
          var defer = $q.defer();

          let EstadoSolicitudTemp1 = ctrl.EstadosSolicitudes.find(data => {
            return data.CodigoAbreviacion == "RDC_PLX"
          });

          let EstadoSolicitudTemp2 = ctrl.EstadosSolicitudes.find(data => {
            return data.CodigoAbreviacion == "PRDI_PLX"
          });

          let EstadoSolicitudTemp3 = ctrl.EstadosSolicitudes.find(data => {
            return data.CodigoAbreviacion == "ADD_PLX"
          });

          var parametrosSolicitudesActuales = $.param({
            query: "EstadoSolicitud.in:" + EstadoSolicitudTemp1.Id + "|" + EstadoSolicitudTemp2.Id + "|" + EstadoSolicitudTemp3.Id + ",activo:TRUE,SolicitudTrabajoGrado:" + id,
            limit: 1,
          });
          poluxRequest.get("respuesta_solicitud", parametrosSolicitudesActuales).then(function(responseSolicitudesActuales) {
              if (Object.keys(responseSolicitudesActuales.data.Data[0]).length > 0) {
                solicitudesActuales.push(responseSolicitudesActuales.data.Data[0]);
                defer.resolve(responseSolicitudesActuales.data.Data);
              } else {
                defer.resolve(responseSolicitudesActuales.data.Data);
              }
            })
            .catch(function(error) {
              ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_RESPUESTA_SOLICITUD");
              defer.reject(error);
            });
          return defer.promise;
        }

        var requestRespuestaMateriasPosgrado = function(solicitudesActuales, id) {
          var defer = $q.defer();

          let EstadoSolicitudTemp1 = ctrl.EstadosSolicitudes.find(data => {
            return data.CodigoAbreviacion == "RDC_PLX"
          });

          let EstadoSolicitudTemp2 = ctrl.EstadosSolicitudes.find(data => {
            return data.CodigoAbreviacion == "RPP_PLX"
          });

          let EstadoSolicitudTemp3 = ctrl.EstadosSolicitudes.find(data => {
            return data.CodigoAbreviacion == "OPC_PLX"
          });

          let EstadoSolicitudTemp4 = ctrl.EstadosSolicitudes.find(data => {
            return data.CodigoAbreviacion == "AEP_PLX"
          });

          let EstadoSolicitudTemp5 = ctrl.EstadosSolicitudes.find(data => {
            return data.CodigoAbreviacion == "FEP_PLX"
          });

          let EstadoSolicitudTemp6 = ctrl.EstadosSolicitudes.find(data => {
            return data.CodigoAbreviacion == "FNE_PLX"
          });

          let EstadoSolicitudTemp7 = ctrl.EstadosSolicitudes.find(data => {
            return data.CodigoAbreviacion == "ACPR_PLX"
          });

          let EstadoSolicitudTemp8 = ctrl.EstadosSolicitudes.find(data => {
            return data.CodigoAbreviacion == "ACPO1_PLX"
          });

          let EstadoSolicitudTemp9 = ctrl.EstadosSolicitudes.find(data => {
            return data.CodigoAbreviacion == "RCPO1_PLX"
          });

          let EstadoSolicitudTemp10 = ctrl.EstadosSolicitudes.find(data => {
            return data.CodigoAbreviacion == "ACPO2_PLX"
          });

          let EstadoSolicitudTemp11 = ctrl.EstadosSolicitudes.find(data => {
            return data.CodigoAbreviacion == "RCPO2_PLX"
          });

          var parametrosSolicitudesActuales = $.param({
            query: "EstadoSolicitud.in:" + EstadoSolicitudTemp1.Id + "|" + EstadoSolicitudTemp2.Id + "|" + EstadoSolicitudTemp3.Id + "|" + EstadoSolicitudTemp4.Id + "|" + EstadoSolicitudTemp5.Id + "|" + EstadoSolicitudTemp6.Id + "|" + EstadoSolicitudTemp7.Id + "|" + EstadoSolicitudTemp8.Id + "|" + EstadoSolicitudTemp9.Id + "|" + EstadoSolicitudTemp10.Id + "|" + EstadoSolicitudTemp11.Id + ",activo:TRUE,SolicitudTrabajoGrado:" + id,
            limit: 1,
          });

          // var parametrosSolicitudesActuales = $.param({
          //   query: "EstadoSolicitud.in:" + EstadoSolicitudTemp1.Id + "|" + EstadoSolicitudTemp2.Id + "|" + EstadoSolicitudTemp3.Id + "|" + EstadoSolicitudTemp4.Id + "|" + EstadoSolicitudTemp5.Id + "|" + EstadoSolicitudTemp6.Id + "|" + EstadoSolicitudTemp7.Id + ",activo:TRUE,SolicitudTrabajoGrado:" + id,
          //   limit: 1,
          // });

          poluxRequest.get("respuesta_solicitud", parametrosSolicitudesActuales).then(function(responseSolicitudesActuales) {
              if (Object.keys(responseSolicitudesActuales.data.Data[0]).length > 0) {
                solicitudesActuales.push(responseSolicitudesActuales.data.Data[0]);
                defer.resolve(responseSolicitudesActuales.data.Data);
              } else {
                defer.resolve(responseSolicitudesActuales.data.Data);
              }
            })
            .catch(function(error) {
              ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_RESPUESTA_SOLICITUD");
              defer.reject(error);
            });
          return defer.promise;
        }

        poluxRequest.get("usuario_solicitud", parametrosUser).then(async function(responseUser) {
            await getconsultarParametros();
            let TipoSolicitudIniTemp = ctrl.TiposSolicitudes.find(data => {
              return data.CodigoAbreviacion == "SI_PLX"
            });
            ctrl.INICIAL = TipoSolicitudIniTemp;
            if (Object.keys(responseUser.data.Data[0]).length == 0) {
              responseUser.data.Data = [];
            }
            var solicitudesUsuario = responseUser.data.Data;
            var promesas = [];
            //solicitud de prorroga
            promesas.push(ctrl.getProrroga());
            //otras solicitudes

            let TipoSolicitudTemp = ctrl.TiposSolicitudes.find(data => {
              return data.CodigoAbreviacion == "SI_PLX"
            });

            let ModalidadTemp = ctrl.Modalidades.find(data => {
              return data.CodigoAbreviacion == "EAPOS_PLX"
            });

            angular.forEach(solicitudesUsuario, function(solicitud) {
              if (solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud != TipoSolicitudTemp.Id && solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.Modalidad != ModalidadTemp.Id) {
                promesas.push(requestRespuesta(actuales, solicitud.SolicitudTrabajoGrado.Id));
              } else {
                promesas.push(requestRespuestaMateriasPosgrado(actuales, solicitud.SolicitudTrabajoGrado.Id));
              }
            });
            $q.all(promesas).then(function() {
                //
                if (actuales.length == 0) {
                  //
                  defer.resolve(true);
                  //}else if(actuales.length == 1 && actuales[0].SolicitudTrabajoGrado.ModalidadTipoSolicitud.Id === 13 ){
                }/* else if (actuales[0].SolicitudTrabajoGrado.ModalidadTipoSolicitud.Id === 13) {
                  //
                  //
                  ctrl.restringirModalidadesPosgrado = true;
                  defer.resolve(true);
                } else if (actuales[0].SolicitudTrabajoGrado.ModalidadTipoSolicitud.Id === 16) {
                  //
                  ctrl.restringirModalidadesProfundizacion = true;
                  defer.resolve(true);
                } */else {
                  //
                  defer.resolve(false);
                }
              })
              .catch(function(error) {
                defer.reject(error);
              });
          })
          .catch(function(error) {
            ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGA_SOLICITUDES");
            defer.reject(error);
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name obtenerDatosEstudiante
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
       * Permite buscar los datos del estudiante que realiza la solicitud en el servicio de {@link services/academicaService.service:academicaRequest academicaRequest}
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplió la petición y se resuleve con el objeto estudiannte
       */
      ctrl.obtenerDatosEstudiante = function() {
        var defer = $q.defer();
        academicaRequest.get("datos_estudiante", [ctrl.codigo]).then(function(response2) {  
            if (!angular.isUndefined(response2.data.estudianteCollection.datosEstudiante)) {
              ctrl.estudiante = {
                "Codigo": ctrl.codigo,
                "Nombre": response2.data.estudianteCollection.datosEstudiante[0].nombre,
                "Modalidad": ctrl.modalidad,
                "Tipo": "POSGRADO",
                "PorcentajeCursado": response2.data.estudianteCollection.datosEstudiante[0].porcentaje_cursado,
                // "PorcentajeCursado": response2.data.estudianteCollection.datosEstudiante[0].creditosCollection.datosCreditos[0].porcentaje.porcentaje_cursado[0].porcentaje_cursado,
                "Promedio": response2.data.estudianteCollection.datosEstudiante[0].promedio,
                "Rendimiento": response2.data.estudianteCollection.datosEstudiante[0].rendimiento,
                "Estado": response2.data.estudianteCollection.datosEstudiante[0].estado,
                "Nivel": response2.data.estudianteCollection.datosEstudiante[0].nivel,
                "TipoCarrera": response2.data.estudianteCollection.datosEstudiante[0].nombre_tipo_carrera,
                "Carrera": response2.data.estudianteCollection.datosEstudiante[0].carrera
              };
              if (ctrl.estudiante.Nombre === undefined) {
                ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_DATOS_ESTUDIANTE");
                defer.reject("datos del estudiante invalidos");
              } else {
                //ctrl.estudiante.asignaturas_elegidas = [];
                //ctrl.estudiante.asignaturas_elegidas2 = [];
                ctrl.estudiante.areas_elegidas = [];
                ctrl.estudiante.minimoCreditos = false;
                defer.resolve(ctrl.estudiante);
              }
            } else {
              if(ctrl.Docente == 1)
              {
                defer.resolve(true);
              }else{
              ctrl.mensajeErrorCarga = $translate.instant("ERROR.ESTUDIANTE_NO_ENCONTRADO");
              defer.reject("no se encuentran datos estudiante");
            }}
          })
          .catch(function(error) {
            ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_DATOS_ESTUDIANTE");
            defer.reject(error);
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name getPeriodoAnterior
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
       * Consulta el periodo académico previo en el servicio de {@link services/academicaService.service:academicaRequest academicaRequest}.
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplió la petición y se resuleve sin retornar ningún objeto
       */
      ctrl.getPeriodoAnterior = function() {
        var defer = $q.defer()
        academicaRequest.get("periodo_academico", "P")
          .then(function(responsePeriodo) {
            if (!angular.isUndefined(responsePeriodo.data.periodoAcademicoCollection.periodoAcademico)) {
              ctrl.periodoAnterior = responsePeriodo.data.periodoAcademicoCollection.periodoAcademico[0];
              defer.resolve();
            } else {
              ctrl.mensajeErrorCarga = $translate.instant("ERROR.SIN_PERIODO");
              defer.reject("sin periodo");
            }
          })
          .catch(function(error) {
            ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGANDO_PERIODO");
            defer.reject(error);
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name getPeriodoSiguiente
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
       * Consulta el periodo académico siguiente en el servicio de {@link services/academicaService.service:academicaRequest academicaRequest}.
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplió la petición y se resuleve sin retornar ningún objeto
       */
      ctrl.getPeriodoSiguiente = function() {
        var defer = $q.defer()
        academicaRequest.get("periodo_academico", "X")
          .then(function(responsePeriodo) {
            if (!angular.isUndefined(responsePeriodo.data.periodoAcademicoCollection.periodoAcademico)) {
              ctrl.periodoSiguiente = responsePeriodo.data.periodoAcademicoCollection.periodoAcademico[0];
              defer.resolve();
            } else {
              ctrl.mensajeErrorCarga = $translate.instant("ERROR.SIN_PERIODO");
              defer.reject("sin periodo");
            }
          })
          .catch(function(error) {
            ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGANDO_PERIODO");
            defer.reject(error);
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name getPeriodoActual
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
       * Consulta el periodo académico actual en el servicio de {@link services/academicaService.service:academicaRequest academicaRequest}.
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplió la petición y se resuleve sin retornar ningún objeto
       */
      ctrl.getPeriodoActual = function() {
        var defer = $q.defer()
        academicaRequest.get("periodo_academico", "A")
          .then(function(responsePeriodo) {
            if (!angular.isUndefined(responsePeriodo.data.periodoAcademicoCollection.periodoAcademico)) {
              ctrl.periodoActual = responsePeriodo.data.periodoAcademicoCollection.periodoAcademico[0];
              ctrl.periodo = ctrl.periodoActual.anio + "-" + ctrl.periodoActual.periodo;
              defer.resolve();
            } else {
              ctrl.mensajeErrorCarga = $translate.instant("ERROR.SIN_PERIODO");
              defer.reject("sin periodo");
            }
          })
          .catch(function(error) {
            ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGANDO_PERIODO");
            defer.reject(error);
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name obtenerAreas
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
       * Consulta las áreas de conocimiento del servicio de {@link services/poluxService.service:poluxRequest poluxRequest} y las 
       * áreas asociadas del snies en el servicio de {@link services/poluxClienteApp.service:coreAmazonCrudService coreAmazonCrudService}.
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplió la petición y se resuleve sin retornar ningún objeto
       */
      ctrl.obtenerAreas = function () {
        var defer = $q.defer();

        if (Object.keys(ctrl.AreasConocimiento).length > 0) {
          ctrl.areas = [];

          const data = ctrl.AreasConocimiento.filter(function(area_filter){
            return area_filter.ParametroPadreId == null
          }).map(function(areaSnies) {
            return areaSnies
          });

          var areasSnies = data;
          if (Object.keys(areasSnies).length > 0) {
            angular.forEach(ctrl.AreasConocimiento, function(area) {
              angular.forEach(areasSnies, function(snies){
                if (area.ParametroPadreId != null && area.ParametroPadreId.Id == snies.Id && area.Descripcion == "") {
                  area.Snies = snies.Nombre;
                  ctrl.areas.push(area)
                }
              });
            });

            defer.resolve();

          } else {
            ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_AREAS");
            defer.reject("no hay areas");
          }
          /*  })
            .catch(function(error) {
              ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_AREAS");
              defer.reject(error);
            });
            */
        } else {
          ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_AREAS");
          defer.reject("no hay areas");
        }
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name cargarTipoSolicitud
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
       * Consulta los diferentes tipos de solicitudes del servicio {@link services/poluxService.service:poluxRequest poluxRequest} 
       * asociadas a la modalidad que recibe como parámetro.
       * @param {Number} modalidad Modalidad asociada al trabajo
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplió la petición y se resuelve con el objeto solicitudes
       */
      ctrl.cargarTipoSolicitud = function(modalidad) {
        var defer = $q.defer();
        ctrl.solicitudes = [];
        if(ctrl.Docente !=0 && modalidad == null){
          let ModalidadTemp = ctrl.Modalidades.find(data => {
            return data.CodigoAbreviacion == "PAS_PLX"//Se debe revisar si el código de abreviación debe ser el de Materias de Posgrado, se deja el de Pasantía por defecto
          });

          modalidad = ModalidadTemp.Id;
        }
        var parametrosTiposSolicitudes = $.param({
          query: "Modalidad:" + modalidad,
          limit: 0,
        });
        poluxRequest.get("modalidad_tipo_solicitud", parametrosTiposSolicitudes).then(function(responseTiposSolicitudes) {
            //ctrl.solicitudes = responseTiposSolicitudes.data;
    
            if (ctrl.tieneProrrogas) {
              let TipoSolicitudTemp = ctrl.TiposSolicitudes.find(data => {
                return data.CodigoAbreviacion == "SPR_PLX"
              });
              angular.forEach(responseTiposSolicitudes.data.Data, function(solicitud) {
                //si la solicitud es diferente de una de prorroga
                if (solicitud.TipoSolicitud !== TipoSolicitudTemp.Id ) {
                  ctrl.solicitudesDisponibles.push(solicitud);
                }
              });
            } 
            else {
                if(ctrl.Docente===1){
                  let TipoSolicitudTemp = ctrl.TiposSolicitudes.find(data => {
                    return data.CodigoAbreviacion == "SSO_PLX"
                  });

                  angular.forEach(responseTiposSolicitudes.data.Data, function(solicitud) {
                  if (solicitud.TipoSolicitud == TipoSolicitudTemp.Id) {
                    ctrl.solicitudesDisponibles.push(solicitud);
                  } 
                });                
                }else{
                  let TipoSolicitudTemp = ctrl.TiposSolicitudes.find(data => {
                    return data.CodigoAbreviacion == "SSO_PLX"
                  });

                  angular.forEach(responseTiposSolicitudes.data.Data, function(solicitud) {
                    //si la solicitud es diferente de una de socializacion
               
                    if (solicitud.TipoSolicitud !== TipoSolicitudTemp.Id ) {
                      ctrl.solicitudesDisponibles.push(solicitud);
                    }
                  });
                }
            }
            angular.forEach(ctrl.solicitudesDisponibles, function(solicitud){
              angular.forEach(ctrl.TiposSolicitudes, function(tiposolicitud){
                if((solicitud.TipoSolicitud == tiposolicitud.Id) && (tiposolicitud.Activo)){
                  ctrl.solicitudes.push(tiposolicitud)
                }
              });
            });
            defer.resolve(ctrl.solicitudes);
          })
          .catch(function(error) {
            ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_TIPOS_SOLICITUD");
            defer.reject(error);
          });
        return defer.promise;
      };


      /**
       * @ngdoc method
       * @name getTrabajoGrado
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
       * Función que consulta los datos del trabajo de grado asociado al estudiante que realiza la solicitud.
       * Consulta todos los estudiantes asociados al trabajo de grado, los docentes vinculados, los espacios inscritos.
       * Llama a la función para consultar las solicitudes anteriores y verificar si no tiene ninguna pendiente
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplió la petición y se resuelve sin ningún objeto
       */
      ctrl.getTrabajoGrado = function() {
        var defer = $q.defer();
        var getEstudiantesTg = function(idTrabajoGrado) {
          var defer = $q.defer();

          EstadoEstudianteTrabajoGradoTemp = ctrl.EstadosEstudianteTrabajoGrado.find(data => {
            return data.CodigoAbreviacion == "EST_ACT_PLX"
          });

          var parametros = $.param({
            query: "EstadoEstudianteTrabajoGrado:" + EstadoEstudianteTrabajoGradoTemp.Id + ",TrabajoGrado:" + idTrabajoGrado,
            limit: 0,
          });
          poluxRequest.get("estudiante_trabajo_grado", parametros).then(function(autoresTg) {
              angular.forEach(autoresTg.data.Data, function(estudiante) {
                if (estudiante.Estudiante !== ctrl.codigo && estudiante.Estudiante !=="") {
                  ctrl.estudiantesTg.push(estudiante.Estudiante);
                }
              });
              defer.resolve();
            })
            .catch(function(error) {
              ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_DATOS_TRABAJOS");
              defer.reject(error);
            });
          return defer.promise;
        }

        var getVinculadosTg = function(idTrabajoGrado) {
          var defer = $q.defer();
          var parametrosVinculacion = $.param({
            query: "TrabajoGrado:" + idTrabajoGrado + ",Activo:true",
            limit: 0
          });
          poluxRequest.get("vinculacion_trabajo_grado", parametrosVinculacion).then(function(responseVinculacion) {
              console.log("Vinculación Trabajo Grado", responseVinculacion);
              ctrl.Trabajo.evaluadores = [];
              if (Object.keys(responseVinculacion.data.Data[0]).length === 0) {
                responseVinculacion.data.Data = [];
              }

              let RolTrabajoGradoTemp1 = ctrl.RolesTrabajoGrado.find(data => {
                return data.CodigoAbreviacion == "DIRECTOR_PLX"
              });

              let RolTrabajoGradoTemp2 = ctrl.RolesTrabajoGrado.find(data => {
                return data.CodigoAbreviacion == "DIR_EXTERNO_PLX"
              });

              let RolTrabajoGradoTemp3 = ctrl.RolesTrabajoGrado.find(data => {
                return data.CodigoAbreviacion == "EVALUADOR_PLX"
              });

              let RolTrabajoGradoTemp4 = ctrl.RolesTrabajoGrado.find(data => {
                return data.CodigoAbreviacion == "CODIRECTOR_PLX"
              });

              let RolTrabajoGradoTemp5 = ctrl.RolesTrabajoGrado.find(data => {
                return data.CodigoAbreviacion == "COR_POSGRADO_PLX"
              });

              angular.forEach(responseVinculacion.data.Data, function(vinculado) {
                if (vinculado.RolTrabajoGrado == RolTrabajoGradoTemp1.Id) {
                  ctrl.Trabajo.directorInterno = vinculado;
                }
                if (vinculado.RolTrabajoGrado == RolTrabajoGradoTemp2.Id) {
                  ctrl.Trabajo.directorExterno = vinculado;
                }
                if (vinculado.RolTrabajoGrado == RolTrabajoGradoTemp3.Id) {
                  ctrl.Trabajo.evaluadores.push(vinculado);
                }
                if (vinculado.RolTrabajoGrado == RolTrabajoGradoTemp4.Id) {
                  ctrl.Trabajo.codirector = vinculado;
                }
                if (vinculado.RolTrabajoGrado == RolTrabajoGradoTemp5.Id) {
                  ctrl.Trabajo.coordinadorPosgrado = vinculado;
                }
              });
              //
              //
              //
              //
              defer.resolve();
            })
            .catch(function(error) {
              ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_DATOS_TRABAJOS");
              defer.reject(error);
            });
          return defer.promise;
        }

        var getEspaciosInscritos = function(idTrabajoGrado) {
          var defer = $q.defer();
          var parametrosEspacios = $.param({
            //query: "EstadoEspacioAcademicoInscrito:1,trabajo_grado:" + idTrabajoGrado,
            query: "trabajo_grado:" + idTrabajoGrado,
            limit: 0
          });
          poluxRequest.get("espacio_academico_inscrito", parametrosEspacios).then(function(responseEspacios) {
              if (Object.keys(responseEspacios.data.Data[0]).length > 0) {
                angular.forEach(responseEspacios.data.Data, function(espacio) {
                  console.log("ctrl.espaciosElegidos", espacio);
                  ctrl.espaciosElegidos.push(espacio.ProyectoCurricularTg);
                  console.log("ctrl.espaciosElegidos", ctrl.espaciosElegidos);
                });                
                //ctrl.carreraElegida = responseEspacios.data.Data[0].EspaciosAcademicosElegibles.CarreraElegible.Id;
              }
              defer.resolve();
            })
            .catch(function(error) {
              ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_DATOS_TRABAJOS");
              defer.reject(error);
            });
          return defer.promise;
        }

        /*var getSolicitudesAnteriores = function() {
          var defer = $q.defer();
          //Se consultan modalidad tipo solicitud:
          //13: para modalidades de materias de posgrado, detalles con id 37 para tener la carrera solicitada
          //17: Para modalidad de materias de profundizacion, detalles con id 44 para tener las carrearas solicitadas

          let TipoSolicitudTemp = ctrl.TiposSolicitudes.find(data => {
            return data.CodigoAbreviacion == "SI_PLX"
          });

          let ModalidadTemp1 = ctrl.Modalidades.find(data => {
            return data.CodigoAbreviacion == "EAPOS_PLX"
          });

          let ModalidadTemp2 = ctrl.Modalidades.find(data => {
            return data.CodigoAbreviacion == "EAPRO_PLX"
          });

          var parametrosSolicitudes = $.param({
            query: "Usuario:" + ctrl.codigo + ",SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud:" + TipoSolicitudTemp.Id + ",SolicitudTrabajoGrado.ModalidadTipoSolicitud.Modalidad.in:" + ModalidadTemp1.Id + "|" + ModalidadTemp2.Id,
            limit: 0,
          });
          poluxRequest.get("usuario_solicitud", parametrosSolicitudes).then(function(responseSolicitudes) {
            
              if (Object.keys(responseSolicitudes.data.Data[0]).length > 0) {
                //
                //si ha hecho una solicitud se obtienen las materias por el detalle
                var getSolicitud = function(solicitud) {
                  //
                  var defer = $q.defer();
                  var parametrosSolicitud = $.param({
                    query: "SolicitudTrabajoGrado:" + solicitud.SolicitudTrabajoGrado.Id + ",DetalleTipoSolicitud.Detalle.CodigoAbreviacion:ESPELE,DetalleTipoSolicitud.ModalidadTipoSolicitud.TipoSolicitud:" + TipoSolicitudTemp.Id + ",DetalleTipoSolicitud.ModalidadTipoSolicitud.Modalidad.in:" + ModalidadTemp1.Id + "|" + ModalidadTemp2.Id,
                    limit: 1,
                  });
                  poluxRequest.get("detalle_solicitud", parametrosSolicitud).then(function(responseSolicitud) {
                      //se obtiene guarda la carrera que ya eligio
                      ctrl.carrerasElegidas.push(JSON.parse(responseSolicitud.data.Data[0].Descripcion.split("-")[1]).Codigo);
                      defer.resolve();
                    })
                    .catch(function(error) {
                      defer.reject(error);
                    });
                  return defer.promise;
                }

                var promises = [];
                ctrl.carrerasElegidas = [];
                angular.forEach(responseSolicitudes.data.Data, function(solicitud) {
                  promises.push(getSolicitud(solicitud));
                });
                $q.all(promises).then(function() {
                    //
                    defer.resolve();
                  })
                  .catch(function(error) {
                    ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_DATOS_TRABAJOS");
                    defer.reject(error);
                  });
              } else {
                defer.resolve();
              }
            })
            .catch(function(error) {
              ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_DATOS_TRABAJOS");
              defer.reject(error);
            });
          return defer.promise;
        }*/

        let EstadoEstudianteTrabajoGradoTemp = ctrl.EstadosEstudianteTrabajoGrado.find(data => {
          return data.CodigoAbreviacion == "EST_ACT_PLX"
        });

        var parametrosTrabajoEstudiante = $.param({
          query: "Estudiante:" + ctrl.codigo + ",EstadoEstudianteTrabajoGrado:" + EstadoEstudianteTrabajoGradoTemp.Id,
          limit: 1
        });
        poluxRequest.get("estudiante_trabajo_grado", parametrosTrabajoEstudiante).then(async function(responseTrabajoEstudiante) {
            var promises = [];

            let ModalidadTemp1 = ctrl.Modalidades.find(data => {
              return data.CodigoAbreviacion == "EAPOS_PLX"
            });

            let ModalidadTemp2 = ctrl.Modalidades.find(data => {
              return data.CodigoAbreviacion == "EAPRO_PLX"
            });

            if (Object.keys(responseTrabajoEstudiante.data.Data[0]).length > 0) {
              console.log("response TrabajoEstudiante", responseTrabajoEstudiante.data.Data[0]);
              ctrl.Trabajo = responseTrabajoEstudiante.data.Data[0];
              ctrl.modalidad = responseTrabajoEstudiante.data.Data[0].TrabajoGrado.Modalidad;
              console.log("MODALIDAD 1", ctrl.modalidad)
              ctrl.trabajo_grado_completo = responseTrabajoEstudiante.data.Data[0].TrabajoGrado;
              ctrl.trabajo_grado = responseTrabajoEstudiante.data.Data[0].TrabajoGrado.Id;
              ctrl.trabajoGrado = responseTrabajoEstudiante.data.Data[0].TrabajoGrado;
              ctrl.siModalidad = true;
              ctrl.modalidad_select = true;
              //buscar # de autores del tg
              promises.push(getEstudiantesTg(ctrl.trabajo_grado));
              promises.push(ctrl.cargarTipoSolicitud(ctrl.modalidad));
              promises.push(getVinculadosTg(ctrl.trabajo_grado));
              if (ctrl.modalidad == ModalidadTemp1.Id || ctrl.modalidad == ModalidadTemp2.Id) {
                promises.push(getEspaciosInscritos(ctrl.trabajo_grado));
              }
            } else {
              if(ctrl.Docente==1){

                let RolTrabajoGradoTemp = ctrl.RolesTrabajoGrado.find(data => {
                  return data.CodigoAbreviacion == "EVALUADOR_PLX"
                });

                var parametrodocente = $.param({
                  query: "usuario:" + ctrl.codigo + ",ACTIVO:true,rol_trabajo_grado:" + RolTrabajoGradoTemp.Id
                });
                poluxRequest.get("vinculacion_trabajo_grado", parametrodocente).then(function(responseVinculacion) {
                  let EstadoTrabajoGradoTemp = ctrl.RolesTrabajoGrado.find(data => {
                    return data.CodigoAbreviacion == "LPS_PLX"
                  });
                  angular.forEach(responseVinculacion.data.Data, function(solicitud) {
                    if(solicitud.TrabajoGrado.EstadoTrabajoGrado === EstadoTrabajoGradoTemp.Id){
                    ctrl.Docente_solicitudes.push(solicitud);
                    ctrl.loadDocenteSolicitud = true;
                  }
                  });
                  ModalidadTemp1 = ctrl.Modalidades.find(data => {
                    return data.CodigoAbreviacion == "EAPOS_PLX"
                  });
                  ModalidadTemp2 = ctrl.Modalidades.find(data => {
                    return data.CodigoAbreviacion == "EAPRO_PLX"
                  });
                  if (Object.keys(responseVinculacion.data.Data[0]).length > 0) {
                    ctrl.Trabajo = responseVinculacion.data.Data[0];
                    ctrl.modalidad = responseVinculacion.data.Data[0].TrabajoGrado.Modalidad;
                    console.log("MODALIDAD 2", ctrl.modalidad)
                    ctrl.trabajo_grado_completo = responseVinculacion.data.Data[0].TrabajoGrado;
                    ctrl.trabajo_grado = responseVinculacion.data.Data[0].TrabajoGrado.Id;
                    ctrl.trabajoGrado = responseVinculacion.data.Data[0].TrabajoGrado;
                    ctrl.siModalidad = true;
                    ctrl.modalidad_select = true;
                    //buscar # de autores del tg
                    promises.push(getEstudiantesTg(ctrl.trabajo_grado));
                    promises.push(ctrl.cargarTipoSolicitud(ctrl.modalidad));
                    promises.push(getVinculadosTg(ctrl.trabajo_grado));
                    if (ctrl.modalidad == ModalidadTemp1.Id || ctrl.modalidad == ModalidadTemp2.Id) {
                      promises.push(getEspaciosInscritos(ctrl.trabajo_grado));
                    }
                  }
                });
              }
              else{
                // SE DEBE REVISAR CUANDO SE TRABAJO MODALIDAD DE
                await getModalidades();
                //obtener solicitudes iniciales anteriores hechas por el usuario modalidad de posgrado
                //promises.push(getSolicitudesAnteriores());
              }
            }

            $q.all(promises).then(function() {
                defer.resolve();
              })
              .catch(function(error) {
                defer.reject(error);
              });
          })
          .catch(function(error) {
            ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_DATOS_TRABAJOS");
            defer.reject(error);
          });
        return defer.promise;
      }

      async function getModalidades(modalidad) {
        return new Promise(async (resolve, reject) => {
          let mod = ctrl.Modalidades.find(modal => {
            if (modalidad === undefined) {
              return modal.CodigoAbreviacion == "EAPOS_PLX"
            } else {
              return modal.Id == modalidad
            }
          });
          ctrl.modalidad = mod.CodigoAbreviacion
          console.log("MODALIDAD 3", ctrl.modalidad)
          resolve()
        })
      }

      ctrl.verificarSolicitudes().then(function(puede) {
          if (puede) {
            var promises = [];
            promises.push(ctrl.getPeriodoActual());
            promises.push(ctrl.getPeriodoAnterior());
            promises.push(ctrl.getPeriodoSiguiente());
            promises.push(ctrl.obtenerAreas());
            promises.push(ctrl.getTrabajoGrado());
            $q.all(promises).then(function() {
                ctrl.obtenerDatosEstudiante().then(function() {
                    $scope.loadParametros = false;
                  })
                  .catch(function(error) {
                    ctrl.errorCarga = true;
                    $scope.loadParametros = false
                  });
              })
              .catch(function(error) {
                ctrl.errorCarga = true;
                $scope.loadParametros = false
              });
          } else {
            ctrl.mensajeErrorCarga = $translate.instant("ERROR.HAY_SOLICITUD_PENDIENTE");
            ctrl.errorCarga = true;
            $scope.loadParametros = false;
          }
        })
        .catch(function(error) {
          ctrl.errorCarga = true;
          $scope.loadParametros = false;
        });


      /**
       * @ngdoc method
       * @name verificarRequisitos
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description
       * Con los datos del estudiante y el tipo de solicitud verifica por medio del servicio {@link services/poluxMidService.service:poluxMidRequest poluxMidRequest} si el estudiante cumple o no con los requisitos para realizar la solicitud,
       * en caso de que la solicitud sea de tipo inicial en la modalidad de materias de posgrado consulta en el servicio {@link services/poluxClienteApp.service:sesionesService sesionesService} si las fechas coinciden con las fechas del proceso
       * de modalidad de materias de posgrado para el periodo correspondiente.
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplió la petición y se resuelve con un valor True o False que indica si el estudiante puede o no realizar la solicitud
       */
      ctrl.verificarRequisitos = function(tipoSolicitud, modalidad) {
        var defer = $q.defer();
        var verificarRequisitosModalidad = async function() {
          var defer = $q.defer();
          await getModalidades(modalidad)
          ctrl.estudiante.Modalidad = ctrl.modalidad
          if(ctrl.estudiante.Modalidad == null){
            let ModalidadTemp = ctrl.Modalidades.find(data => {
              return data.Id == ctrl.modalidad
            });
            ctrl.estudiante.Modalidad = ModalidadTemp.CodigoAbreviacion;
          }
          poluxMidRequest.post("verificarRequisitos/Registrar", ctrl.estudiante).then(function(responseModalidad) {  
            //ctrl.estudiante.Modalidad = null;
              if (responseModalidad.data.Data.RequisitosModalidades) {
                defer.resolve(true);
              } else {
                if(ctrl.Docente == 1){
                  defer.resolve(true);
                }
                else{
                ctrl.mensajeError = $translate.instant("ESTUDIANTE_NO_REQUISITOS");

                defer.reject('No cumple con los requisitos');

                }
              }
            })
            .catch(function() {
              ctrl.mensajeError = $translate.instant("ERROR.VALIDAR_REQUISITOS");
              defer.reject("no se pudo cargar requisitos");
            });
          //
          return defer.promise;
        }

        var verificarFechas = function(tipoSolicitudVF, modalidadVF, periodo) {
          var defer = $q.defer();
          //si la solicitud es de materias de posgrado e inicial
          let TipoSolicitudTemp = ctrl.TiposSolicitudes.find(data => {
            return data.CodigoAbreviacion == "SI_PLX"
          });
          let ModalidadTemp1 = ctrl.Modalidades.find(data => {
            return data.CodigoAbreviacion == "EAPOS_PLX"
          });
          let ModalidadTemp2 = ctrl.Modalidades.find(data => {
            return data.CodigoAbreviacion == "EAPRO_PLX"
          });
          if (tipoSolicitudVF === TipoSolicitudTemp.Id && (modalidadVF === ModalidadTemp1.Id || modalidadVF === ModalidadTemp2.Id )) {
            ctrl.periodo = ctrl.periodoSiguiente.anio + "-" + ctrl.periodoSiguiente.periodo;
            ctrl.fechaActual = moment(new Date()).format("YYYY-MM-DD HH:mm");
            var tipoSesionPadre = 0;
            if (modalidadVF === ModalidadTemp1.Id) {
              // modalidad == 'POSGRADO'
              tipoSesionPadre = 1;
            } else {
              // modalidad === 3, modalidad === 'PREGRADO'
              tipoSesionPadre = 9;
            }
            var parametrosSesiones = $.param({
             query: "SesionPadre.TipoSesion.Id:"+tipoSesionPadre+",SesionHijo.TipoSesion.Id:3,SesionPadre.periodo:"+ctrl.periodoSiguiente.anio+ ctrl.periodoSiguiente.periodo,
             limit: 1
            });
            sesionesRequest.get("relacion_sesiones", parametrosSesiones)
              .then(function(responseFechas) {
                if (Object.keys(responseFechas.data[0]).length > 0) {
                  //
                  var sesion = responseFechas.data[0];
                  var fechaHijoInicio = new Date(sesion.SesionHijo.FechaInicio);
                  fechaHijoInicio.setTime(fechaHijoInicio.getTime() + fechaHijoInicio.getTimezoneOffset() * 60 * 1000);
                  ctrl.fechaInicio = moment(fechaHijoInicio).format("YYYY-MM-DD HH:mm");
                  var fechaHijoFin = new Date(sesion.SesionHijo.FechaFin);
                  fechaHijoFin.setTime(fechaHijoFin.getTime() + fechaHijoFin.getTimezoneOffset() * 60 * 1000);
                  ctrl.fechaInicio = moment(fechaHijoInicio).format("YYYY-MM-DD HH:mm");
                  ctrl.fechaFin = moment(fechaHijoFin).format("YYYY-MM-DD HH:mm");
                  //
                  //
                  if (ctrl.fechaInicio <= ctrl.fechaActual && ctrl.fechaActual <= ctrl.fechaFin) {
                    defer.resolve(true);
                  } else {
                    ctrl.mensajeError = $translate.instant('ERROR.NO_EN_FECHAS_INSCRIPCION');
                    defer.reject(false);
                  }
                } else {
                  ctrl.mensajeError = $translate.instant('ERROR.SIN_FECHAS_MODALIDAD');
                  defer.reject(false);
                }
              })
              .catch(function() {
                ctrl.mensajeError = $translate.instant("ERROR.CARGAR_FECHAS_MODALIDAD");
                defer.reject("no se pudo cargar fechas");
              });
          } else {
            defer.resolve(true);
          }
          return defer.promise;
        }

        var verificarTipoSolicitud = function(tipoSolicitudVTS) {
          var defer = $q.defer();
          let TipoSolicitudTemp = ctrl.TiposSolicitudes.find(data => {
            return data.CodigoAbreviacion == "SSO_PLX"
          });
          let TipoSolicitudTemp2 = ctrl.TiposSolicitudes.find(data => {
            return data.CodigoAbreviacion == "SRTG_PLX"
          });
          if (tipoSolicitudVTS.TipoSolicitud === TipoSolicitudTemp.Id) {
            // solicitud de socialización
            // el estado del trabajo de grado debe ser Listo para sustentar Id 17
            let EstadoTrabajoGradoTemp = ctrl.EstadosTrabajoGrado.find(data => {
              return data.CodigoAbreviacion == "LPS_PLX"
            });
            if (ctrl.trabajoGrado.EstadoTrabajoGrado === EstadoTrabajoGradoTemp.Id) {
              defer.resolve(true);
            } else {
              ctrl.mensajeError = $translate.instant("ERROR.ESTADO_TRABAJO_GRADO_NO_PERMITE", {
                estado_tg: ctrl.trabajoGrado.EstadoTrabajoGrado.Nombre,
                tipoSolicitudVTS: tipoSolicitud.TipoSolicitud.Nombre,
              });
              defer.reject(false);
            }
          } else if (tipoSolicitudVTS.TipoSolicitud === TipoSolicitudTemp2.Id) {
            // solicitud de revisión de jurado 
            // el estado del trabajo de grado debe ser en curso Id 13 o en Modificable 16
            let EstadoTrabajoGradoTemp = ctrl.EstadosTrabajoGrado.find(data => {
              return data.CodigoAbreviacion == "EC_PLX"
            });
            let EstadoTrabajoGradoTemp2 = ctrl.EstadosTrabajoGrado.find(data => {
              return data.CodigoAbreviacion == "MOD_PLX"
            });
            if (ctrl.trabajoGrado.EstadoTrabajoGrado === EstadoTrabajoGradoTemp.Id || ctrl.trabajoGrado.EstadoTrabajoGrado === EstadoTrabajoGradoTemp2.Id) {
              defer.resolve(true);
            } else {
              ctrl.mensajeError = $translate.instant("ERROR.ESTADO_TRABAJO_GRADO_NO_PERMITE", {
                estado_tg: ctrl.trabajoGrado.EstadoTrabajoGrado.Nombre,
                tipoSolicitudVTS: tipoSolicitud.TipoSolicitud.Nombre,
              });
              defer.reject(false);
            }
          } else {
            defer.resolve(true);
          }
          return defer.promise;
        }
        var promesas = [];
        if(!ctrl.siModalidad){
          promesas.push(verificarRequisitosModalidad());
        }
        if (!angular.isUndefined(tipoSolicitud.TipoSolicitud)) {
          promesas.push(verificarRequisitosModalidad());
          promesas.push(verificarTipoSolicitud(tipoSolicitud));
        }
        $q.all(promesas)
          .then(function() {
            //var puede = responseRequisitos[0] && responseRequisitos[1];
            defer.resolve(true)
          })
          .catch(function(error) {
            defer.reject(error);
          });

        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name docenteVinculado
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
       * Verifica si un docente se encuentra vinculado o no a un trabajo de grado, compara el documento con la lista de docentes del objeto Trabajo
       * @param {Number} docente Documento del docente que se verificará
       * @returns {boolean} Objeto de tipo promesa que indica si ya se cumplió la petición y se resuelve con un valor True o False que indica si el estudiante puede o no realizar la solicitud.
       */
      ctrl.docenteVinculado = function(docente) {
        if (ctrl.Trabajo != undefined) {
          if (ctrl.Trabajo.directorInterno !== undefined) {
            if (ctrl.Trabajo.directorInterno.Usuario == docente) {
              return true;
            }
          }
          if (ctrl.Trabajo.directorExterno !== undefined) {
            if (ctrl.Trabajo.directorInterno.Usuario == docente) {
              return true;
            }
          }
          if (ctrl.Trabajo.evaluadores != undefined) {
            var esta = false;
            angular.forEach(ctrl.Trabajo.evaluadores, function(evaluador) {
              if (evaluador.Usuario == docente) {
                esta = true;
              }
            });
            if (esta) {
              return true;
            }
          }
          if (ctrl.Trabajo.codirector !== undefined) {
            if (ctrl.Trabajo.codirector.Usuario == docente) {
              return true;
            }
          }
        }
        //
        //
        //
        //
        return false;
      }

      /**
       * @ngdoc method
       * @name cargarDetalles
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
       * Llama la función verificar requisitos para validar que el estudiante cumpla los requisitos para el tipo de solicitud que seleccionó, si los cumple carga los detalles asociados a
       * la modaliad y al tipo de solicitud correspondientes.
       * Se realiza la internacionalización de los mensajes que se muestran en los labels, en caso de que el detalle tenga una lista consulta los parámetros correspondientes y se ejecutan las consultas necesarias
       * con los servicios y parámetros descritos en la descripción del detalle.
       * La descripción de los detalles contiene el valor no_service si no requiere nigún tipo de consulta, el valor estático si los valores no se consultan (valores separados por coma), nombre de algún servicio
       * separado por punto y coma con la tabla que debe consultar y con comas los parametros que este requiere, por último en valor mensaje si se queire mostrar un mensaje al usuario y contiene la variable de internacinalización a que tiene el texto a mostrar.
       * @param {Number} tipoSolicitudSeleccionada Tipo de solicitud seleccionada por el estudiante
       * @param {Number} modalidad_seleccionada Modalidad seleccionada por el estudiante
       * @returns {undefined} No retorna ningún valor
       */
      ctrl.cargarDetalles = function(tipoSolicitudSeleccionada, modalidad_seleccionada) {   
        console.log("Tipo Solicitud Seleccionada", tipoSolicitudSeleccionada);     
        if(ctrl.Docente==1 && ctrl.Docente_trabajos==false){
          ctrl.Docente_trabajos =true;
          ctrl.tipoSolicitud_Docente = tipoSolicitudSeleccionada;
        }else{
        $scope.loadDetalles = true;
        ctrl.errorParametros = false;
        ctrl.siPuede = false;
        ctrl.detallesCargados = false;
        ctrl.estudiantes = [];
        ctrl.TipoSolicitud = tipoSolicitudSeleccionada;
        //ctrl.ModalidadTipoSolicitud = tipoSolicitud;

        if (modalidad_seleccionada !== undefined) {
          ctrl.modalidad = modalidad_seleccionada;
          console.log("MODALIDAD 4", ctrl.modalidad)
        }
        
        if(CONF.PRODUCCION){//Si se ejecuta desde ambiente de producción, se evaluan las restricciones
          if(tipoSolicitudSeleccionada.CodigoAbreviacion != "SI_PLX"  && tipoSolicitudSeleccionada.CodigoAbreviacion == "SCM_PLX"){
            // SE LLAMA A LA FUNCION PARA MIRAR SI TIENE UNA SOLICITUD
            ctrl.getCancelacionModalidad().then(function (cancelado) {
              ctrl.Cancelacion = cancelado;
              ctrl.mensajeCancelacion = $translate.instant("ERROR.CANCELACIONES");
            });
          }else{
            ctrl.Cancelacion = false;
          }
  
          //SE LLAMA A LA FUNCION PARA VERIFICAR SI LA MODALIDAD SELECCIONADA FUE CANCELADA ANTERIORMENTE
          if(tipoSolicitudSeleccionada.CodigoAbreviacion == "SI_PLX"){
            ctrl.getModalidadCancelada(modalidad_seleccionada).then(function(cancelado){
              ctrl.ModalidadCancelada = cancelado
              ctrl.mensajeModalidadCancelada = $translate.instant("ERROR.MODALIDAD_CANCELADA");
            })
          }
  
          //SE LLAMA LA FUNCIÓN POR CADA UNA DE LAS NOVEDADES
          ctrl.getNotaTrabajoGrado().then(function (resultado) {
            ctrl.Nota = resultado;
            ctrl.mensajeCalificado = $translate.instant("ERROR.CALIFICADO");
          });
        }

        ctrl.verificarRequisitos(tipoSolicitudSeleccionada, modalidad_seleccionada).then(function() {
          ctrl.soliciudConDetalles = true;
          ctrl.detalles = [];

          //var tipo_solicitud = ctrl.TipoSolicitud.Id;

          if(ctrl.Docente==1){
            let TipoSolicitudTemp = ctrl.TiposSolicitudes.find(data => {
              return data.CodigoAbreviacion == "SSO_PLX"
            });
            ctrl.TipoSolicitud = TipoSolicitudTemp;
          }
          var promises = []
          var parametrosDetalles;
            if (modalidad_seleccionada === undefined) {
            parametrosDetalles = $.param({
              query: "ModalidadTipoSolicitud__TipoSolicitud:" + ctrl.TipoSolicitud.Id + ",ModalidadTipoSolicitud__Modalidad:" + ctrl.Trabajo.TrabajoGrado.Modalidad,
              limit: 0,
              sortby: "NumeroOrden",
              order: "asc"
            });
            var get_ModalidadTipoSolicitud = function() {
              var defer = $q.defer();
              var parametrosModalidadTipoSolicitud = $.param({
                query: "TipoSolicitud:"+ ctrl.TipoSolicitud.Id +",Modalidad:" + ctrl.Trabajo.TrabajoGrado.Modalidad,
                limit: 1,
              });
              console.log("Modalidad", ctrl.Trabajo);
              poluxRequest.get("modalidad_tipo_solicitud", parametrosModalidadTipoSolicitud).then(function(responseModalidadTipoSolicitud) {
                ctrl.ModalidadTipoSolicitud = responseModalidadTipoSolicitud.data.Data[0];
                  defer.resolve();
                })
                .catch(function(error) {
                  defer.reject(error);
                });
              return defer.promise;
            }
            promises.push(get_ModalidadTipoSolicitud());
          } else {
            parametrosDetalles = $.param({
              query: "Activo:TRUE,ModalidadTipoSolicitud__TipoSolicitud:"+ ctrl.TipoSolicitud.Id +",ModalidadTipoSolicitud__Modalidad:" + modalidad_seleccionada,
              limit: 0,
              sortby: "NumeroOrden",
              order: "asc"
            });
            var getModalidadTipoSolicitud = function(modalidadSeleccionada) {
              var defer = $q.defer();
              var parametrosModalidadTipoSolicitud = $.param({
                query: "TipoSolicitud:"+ ctrl.TipoSolicitud.Id +",Modalidad:" + modalidadSeleccionada,
                limit: 1,
              });
              poluxRequest.get("modalidad_tipo_solicitud", parametrosModalidadTipoSolicitud).then(function(responseModalidadTipoSolicitud) {
                ctrl.ModalidadTipoSolicitud = responseModalidadTipoSolicitud.data.Data[0];
                  defer.resolve();
                })
                .catch(function(error) {
                  defer.reject(error);
                });
              return defer.promise;
            }
            promises.push(getModalidadTipoSolicitud(modalidad_seleccionada));
          }
          poluxRequest.get("detalle_tipo_solicitud", parametrosDetalles)
            .then(function(responseDetalles) {
              if (Object.keys(responseDetalles.data.Data[0]).length > 0) {

                var filtereddetalles = responseDetalles.data.Data;
                angular.forEach(filtereddetalles, function(detalle){
                  if((detalle.Detalle.CodigoAbreviacion !=="CUEP") && (detalle.Detalle.Activo)  && (detalle.Activo)){
                    let TipoDetalleTemp = ctrl.TiposDetalle.find(data => {
                      return data.Id == detalle.Detalle.TipoDetalle
                    });
                    detalle.Detalle.TipoDetalleAux = TipoDetalleTemp;
                    ctrl.detalles.push(detalle);
                  }
                });                
                //Se cargan opciones de los detalles
                angular.forEach(ctrl.detalles, function(detalle) {
                  //Se internacionalizan variables y se crean labels de los detalles
                  detalle.label = $translate.instant(detalle.Detalle.Enunciado);
                  detalle.respuesta = "";
                  detalle.fileModel = null;
                  detalle.opciones = [];
                  if (detalle.Detalle.Enunciado.includes('DOCENTE_AVALA_PROPUESTA') || detalle.Detalle.Enunciado.includes('SELECCIONE_DOCENTE_DESIGNADO_INVESTIGACION')) {
                    ctrl.posDocente = detalle.Id;
                  }
                  //Se evalua si el detalle necesita cargar datos
                  let TipoDetalleTemp = ctrl.TiposDetalle.find(data => {
                    return data.CodigoAbreviacion == "DRT_PLX"
                  });
                  if (!detalle.Detalle.Descripcion.includes('no_service') && detalle.Detalle.TipoDetalle !== TipoDetalleTemp.Id) {
                    //Se separa el strig
                    var parametrosServicio = detalle.Detalle.Descripcion.split(";");
                    var sql = "";
                    var parametrosConsulta = [];
                    //servicio de academiaca
                    if (parametrosServicio[0] === "polux") {
                      var getOpcionesPolux = function(parametros_servicio) {
                        var defer = $q.defer()
                        if (parametros_servicio[2] !== undefined) {
                          parametrosConsulta = parametros_servicio[2].split(",");
                          angular.forEach(parametrosConsulta, function(parametro) {
                            if (!parametro.includes(":")) {
                              if (parametro == "trabajo_grado") {
                                parametro = parametro + ":" + ctrl.trabajo_grado;
                              }
                              if (parametro == "carrera_elegible") {
                                parametro = parametro + ":" + ctrl.espaciosElegidos[0]; //ctrl.carreraElegida;
                              }
                              /* //Si el parametro es activo se deja tal y como esta en la bd
                              if (parametro == "activo") {
                                parametro = parametro;
                              }*/
                              if (parametro == "id") {
                                parametro = parametro + ":" + ctrl.trabajo_grado;
                              }
                            }
                            if (sql === "") {
                              sql = parametro;
                            } else {
                              sql = sql + "," + parametro;
                            }
                          });
                          detalle.parametros = $.param({
                            query: sql,
                            limit: 0
                          });
                        }
                        poluxRequest.get(parametros_servicio[1], detalle.parametros).then(function(responseOpciones) {
                            if (detalle.Detalle.Nombre.includes("Nombre actual de la propuesta")) {
                              detalle.opciones.push({
                                "NOMBRE": responseOpciones.data.Data[0].Titulo,
                                "bd": responseOpciones.data.Data[0].Titulo,
                              });
                              defer.resolve();
                            } else if (detalle.Detalle.Nombre.includes("Actual resumen de la propuesta")) {
                              detalle.opciones.push({
                                "NOMBRE": responseOpciones.data.Data[0].DocumentoEscrito.Resumen,
                                "bd": responseOpciones.data.Data[0].DocumentoEscrito.Resumen
                              });
                              defer.resolve();
                            } else if (detalle.Detalle.Nombre.includes("Propuesta actual")) {
                              detalle.respuesta = responseOpciones.data.Data[0].DocumentoEscrito.Enlace;
                              //
                              defer.resolve();
                            } else if (detalle.Detalle.Nombre.includes("Areas de conocimiento actuales")) {
                              //
                              var areasString = "";
                              angular.forEach(responseOpciones.data.Data, function(area) {
                                areasString = areasString + ", " + area.AreaConocimiento.Nombre;
                              });
                              detalle.opciones.push({
                                "NOMBRE": areasString.substring(2),
                                "bd": areasString.substring(2)
                              });
                              defer.resolve();
                            } else if (detalle.Detalle.Nombre.includes("Nombre Empresa")) {
                              angular.forEach(responseOpciones.data.Data, function(empresa) {
                                detalle.opciones.push({
                                  "NOMBRE": empresa.Identificacion + "",
                                  "bd": empresa.Identificacion + "",
                                });
                              });
                              defer.resolve();
                            } else if (detalle.Detalle.Nombre.includes("Espacio Academico Anterior")) {
                              var getEspacioAnterior = function(detalleEspAnt, espacio) {
                                var defer = $q.defer();
                                academicaRequest.get("asignatura_pensum", [espacio.EspaciosAcademicosElegibles.CodigoAsignatura, espacio.EspaciosAcademicosElegibles.CarreraElegible.CodigoPensum]).then(function(asignatura) {
                                    detalleEspAnt.asignatura = asignatura.data.asignatura.datosAsignatura[0];
                                    detalleEspAnt.opciones.push({
                                      "NOMBRE": asignatura.data.asignatura.datosAsignatura[0].nombre + ", creditos: " + asignatura.data.asignatura.datosAsignatura[0].creditos,
                                      "bd": espacio.EspaciosAcademicosElegibles.CodigoAsignatura + '-' + asignatura.data.asignatura.datosAsignatura[0].nombre,
                                    });
                                    defer.resolve();
                                  })
                                  .catch(function(error) {
                                    defer.reject(error);
                                  });
                                return defer.promise;
                              }
                              var promisesEspacio = [];
                              angular.forEach(responseOpciones.data.Data, function(espacio) {
                                promisesEspacio.push(getEspacioAnterior(detalle, espacio));
                              });
                              $q.all(promisesEspacio).then(function() {
                                  defer.resolve()
                                })
                                .catch(function(error) {
                                  defer.reject(error);
                                });
                            } else if (detalle.Detalle.Nombre.includes("Evaluador Actual")) {
                              var promisesDocente = []
                              var getDocente = function(evaluador, detalleDocente) {
                                var defer = $q.defer();
                                academicaRequest.get("docente_tg", [evaluador.Usuario]).then(function(docente) {
                                    if (!angular.isUndefined(docente.data.docenteTg.docente)) {
                                      detalleDocente.opciones.push({
                                        "NOMBRE": docente.data.docenteTg.docente[0].nombre,
                                        "bd": docente.bd = docente.data.docenteTg.docente[0].id
                                      });
                                    }
                                    defer.resolve();
                                  })
                                  .catch(function(error) {
                                    defer.reject(error);
                                  });
                                return defer.promise;
                              }
                              angular.forEach(responseOpciones.data.Data, function(evaluador) {
                                promisesDocente.push(getDocente(evaluador, detalle));
                              });
                              $q.all(promisesDocente).then(function() {
                                  defer.resolve();
                                })
                                .catch(function(error) {
                                  defer.reject(error);
                                });
                            } else if (detalle.Detalle.Nombre.includes("Director Actual")) {
                              academicaRequest.get("docente_tg", [ctrl.Trabajo.directorInterno.Usuario]).then(function(docente) {
                                  if (!angular.isUndefined(docente.data.docenteTg.docente)) {
                                    //
                                    detalle.opciones.push({
                                      "NOMBRE": docente.data.docenteTg.docente[0].nombre,
                                      //"bd":  docente.bd = docente[0].DIR_NRO_IDEN+"-"+docente[0].NOMBRE,
                                      "bd": docente.bd = docente.data.docenteTg.docente[0].id
                                    });
                                    //
                                  }
                                  defer.resolve();
                                })
                                .catch(function(error) {
                                  defer.reject(error);
                                });
                            } else if (detalle.Detalle.Nombre.includes("Codirector Actual")) {
                              if (!angular.isUndefined(ctrl.Trabajo.codirector)) {
                                academicaRequest.get("docente_tg", [ctrl.Trabajo.codirector.Usuario]).then(function(docente) {
                                    if (!angular.isUndefined(docente.data.docenteTg.docente)) {
                                      //
                                      detalle.opciones.push({
                                        "NOMBRE": docente.data.docenteTg.docente[0].nombre,
                                        //"bd":  docente.bd = docente[0].DIR_NRO_IDEN+"-"+docente[0].NOMBRE,
                                        "bd": docente.bd = docente.data.docenteTg.docente[0].id
                                      });
                                      //
                                    }
                                    defer.resolve();
                                  })
                                  .catch(function(error) {
                                    defer.reject(error);
                                  });
                              } else {
                                defer.reject("Sin codirector");
                              }
                            } else if (detalle.Detalle.Nombre.includes("Espacio Academico Nuevo")) {
                              promises = [];
                              var getEspacio = function(detalleEspacio, espacio) {
                                var defer = $q.defer();
                                academicaRequest.get("asignatura_pensum", [espacio.CodigoAsignatura, espacio.CarreraElegible.CodigoPensum]).then(function(asignatura) {
                                    detalleEspacio.asignatura = asignatura.data.asignatura.datosAsignatura[0];
                                    detalleEspacio.opciones.push({
                                      "NOMBRE": asignatura.data.asignatura.datosAsignatura[0].nombre + ", creditos: " + asignatura.data.asignatura.datosAsignatura[0].creditos,
                                      "bd": espacio.CodigoAsignatura + '-' + asignatura.data.asignatura.datosAsignatura[0].nombre
                                    });
                                    defer.resolve();
                                  })
                                  .catch(function(error) {
                                    defer.reject(error);
                                  });
                                return defer.promise;
                              }
                              angular.forEach(responseOpciones.data.Data, function(espacio) {
                                var esta = false;
                                angular.forEach(ctrl.espaciosElegidos, function(asignatura) {
                                  if (espacio.CodigoAsignatura == asignatura.CodigoAsignatura) {
                                    esta = true;
                                  }
                                });
                                if (!esta) {
                                  promises.push(getEspacio(detalle, espacio));
                                }
                              });
                              $q.all(promises).then(function() {
                                  defer.resolve();
                                })
                                .catch(function(error) {
                                  defer.reject(error);
                                });
                            } else if (detalle.Detalle.Nombre.includes("Nombre del anterior director externo")) {
                              var temp = responseOpciones.data.Data[0].Observaciones.split(" y dirigida por ");
                              temp = temp[1].split(" con número de identificacion ");
                              detalle.opciones.push({
                                "NOMBRE": temp[1] + " - " + temp[0],
                                "bd": temp[1]
                              });
                              defer.resolve();
                            } else if (detalle.Detalle.Nombre.includes("Nombre de evaluador(es) actuales")) {
                              var promisasDocente = []
                              var obtenerDocente = function(evaluador) {
                                var defer = $q.defer();
                                academicaRequest.get("docente_tg", [evaluador.Usuario]).then(function(docente) {
                                    evaluador = {
                                      nombre: "",
                                      id: "",
                                    }
                                    if (!angular.isUndefined(docente.data.docenteTg.docente)) {
                                      evaluador.nombre = docente.data.docenteTg.docente[0].nombre;
                                      evaluador.id = docente.data.docenteTg.docente[0].id;
                                    }
                                    defer.resolve(evaluador);
                                  })
                                  .catch(function(error) {
                                    defer.reject(error);
                                  });
                                return defer.promise;
                              }
                              angular.forEach(responseOpciones.data.Data, function(evaluador) {
                                promisasDocente.push(obtenerDocente(evaluador));
                              });
                              $q.all(promisasDocente).then(function(evaluadores) {
                                  detalle.opciones.push({
                                    "NOMBRE": evaluadores.map(function(evaluador) {
                                      return evaluador.nombre
                                    }).join(", "),
                                    "bd": evaluadores.map(function(evaluador) {
                                      return evaluador.id
                                    }).join(",")
                                  });
                                  defer.resolve();
                                })
                                .catch(function(error) {
                                  defer.reject(error);
                                });
                            }else if(detalle.Detalle.Nombre.includes("Objetivo Actual")){
                              detalle.opciones.push({
                                "NOMBRE": responseOpciones.data.Data[0].Objetivo,
                                "bd": responseOpciones.data.Data[0].Objetivo,
                              });
                              defer.resolve();
                            //Resolve promesa
                            } else {
                              detalle.opciones = responseOpciones.data.Data;
                              defer.resolve();
                            }
                          })
                          .catch(function(error) {
                            defer.reject(error);
                          });
                        return defer.promise;
                      }
                      promises.push(getOpcionesPolux(parametrosServicio));
                    }
                    if (parametrosServicio[0] === "academica") {
                      var getOpcionesAcademica = function(parametros_Servicio) {
                        var defer = $q.defer();
                        if (parametros_Servicio[1] === "docente") {
                          academicaRequest.get("docentes_tg").then(function(response) {
                              if (!angular.isUndefined(response.data.docentesTg.docente)) {
                                var docentes = response.data.docentesTg.docente;
                                var vinculados = [];
                                angular.forEach(docentes, function(docente) {
                                  if (ctrl.docenteVinculado(docente.id)) {
                                    vinculados.push(docente);
                                  } else {
                                    docente.bd = docente.id;
                                  }
                                });
                                angular.forEach(vinculados, function(docente) {
                                  var index = docentes.indexOf(docente);
                                  docentes.splice(index, 1);
                                });
                                detalle.opciones = docentes;
                                defer.resolve();
                              }
                            })
                            .catch(function(error) {
                              defer.reject(error);
                            });
                        } else {
                          defer.resolve();
                        }
                        return defer.promise
                      }
                      promises.push(getOpcionesAcademica(parametrosServicio));
                    }
                    if (parametrosServicio[0] === "cidc") {
                      if (parametrosServicio[1] === "estructura_investigacion") {
                        detalle.opciones = cidcRequest.obtenerEntidades();
                      }
                      if (parametrosServicio[1] === "docentes") {
                        detalle.opciones = cidcRequest.obtenerDoncentes();
                      }
                    }
                    if (parametrosServicio[0] === "estatico") {
                      parametrosConsulta = parametrosServicio[2].split(",");
                      angular.forEach(parametrosConsulta, function(opcion) {
                        detalle.opciones.push({
                          "NOMBRE": opcion,
                          "bd": opcion
                        });
                      });
                    }
                    if (parametrosServicio[0] === "mensaje") {
                      detalle.opciones.push({
                        "NOMBRE": $translate.instant(parametrosServicio[1]),
                        "bd": $translate.instant(parametrosServicio[1])
                      });
                    }

                    if(parametrosServicio[0] === "categorias-revista"){
                      parametrosConsulta = $.param({
                        query:"CodigoAbreviacion.in:A1_PLX|A2_PLX|B_PLX|C_PLX"
                      });

                      parametrosRequest.get("parametro/?", parametrosConsulta).then(function(parametros){
                        angular.forEach(parametros.data.Data, function(parametro){
                          detalle.opciones.push({
                            "NOMBRE": parametro.Nombre,
                            "bd": parametro.Id
                          });
                        });
                      });
                    }
                  }
                  // FILTRO SEGÚN MODALIDAD PARA EL CAMPO DE ACEPTACIÓN DE TERMINOS
                  if(detalle.Detalle.CodigoAbreviacion == "ACTERM"){
                    let ModalidadTemp = ctrl.Modalidades.find(data => {
                      return data.CodigoAbreviacion == ctrl.modalidad
                    });
                    // PARA MODALIDAD DE MONOGRAFIA
                    if(ModalidadTemp.CodigoAbreviacion == "MONO_PLX"){
                      detalle.label = $translate.instant("TERMINOS.MONOGRAFIA")
                    }
                    // PARA MODALIDAD DE PASANTIA
                    if(ModalidadTemp.CodigoAbreviacion == "PAS_PLX"){
                      detalle.label = $translate.instant("TERMINOS.PASANTIA")
                    }
                    // PARA MODALIDAD DE EMPRENDIMIENTO
                    if(ModalidadTemp.CodigoAbreviacion == "PEMP_PLX"){
                      detalle.label = $translate.instant("TERMINOS.EMPRENDIMIENTO")
                    }
                    // PARA MODALIDAD DE MATERIAS DE POSGRADO
                    if(ModalidadTemp.CodigoAbreviacion == "EAPOS_PLX"){
                      detalle.label = $translate.instant("TERMINOS.POSGRADO")
                    }
                    // PARA MODALIDAD DE MATERIAS DE PROFUNDIZACIÓN
                    if(ModalidadTemp.CodigoAbreviacion == "EAPRO_PLX"){
                      detalle.label = $translate.instant("TERMINOS.PROFUNDIZACION")
                    }
                    // PARA MODALIDAD DE MATERIAS DE INVESTIGACION E INNOVACION
                    if(ModalidadTemp.CodigoAbreviacion == "INV_PLX"){
                      detalle.label = $translate.instant("TERMINOS.INVESTIGACION")
                    }
                    // PARA MODALIDAD DE MATERIAS DE ARTICULO ACADEMICO
                    if(ModalidadTemp.CodigoAbreviacion == "PACAD_PLX"){
                      detalle.label = $translate.instant("TERMINOS.ARTICULO")
                    }
                  }
                });
                $q.all(promises).then(function() {
                    $scope.loadDetalles = false;
                    ctrl.detallesCargados = true;
                    if (ctrl.detalles == null) {
                      ctrl.soliciudConDetalles = false;
                    }
                  })
                  .catch(function(error) {
                    ctrl.mensajeError = $translate.instant("ERROR.CARGAR_OPCIONES_DETALLES_SOLICITUD");
                    if (error === "Sin codirector") {
                      ctrl.mensajeError = $translate.instant("ERROR.SIN_CODIRECTOR");
                    }
                    ctrl.errorParametros = true;
                    $scope.loadDetalles = false;
                    ctrl.detalles = [];
                  });
              } else {
                ctrl.mensajeError = $translate.instant("ERROR.SIN_DETALLE_SOLICITUD");
                ctrl.errorParametros = true;
                $scope.loadDetalles = false;
                ctrl.detalles = [];
              }
            })
            .catch(function(error) {
              ctrl.mensajeError = $translate.instant("ERROR.CARGAR_DETALLES_SOLICITUD");
              ctrl.errorParametros = true;
              $scope.loadDetalles = false;
              ctrl.detalles = [];
            });
          //}else {
          //$scope.loadDetalles = false;
          //ctrl.siPuede=true;
          //ctrl.detalles = [];
          //}
        }).catch(function(error) {
          ctrl.errorParametros = true;
          $scope.loadDetalles = false;
          ctrl.detalles = [];
        });
      }
    };

    function getValueRadio() {
      var ele = document.getElementsByName('opcion');
        for (var i = 0; i < ele.length; i++) {
          if (ele[i].checked) {
            return ele[i].value
          }
        }
    }

      /**
       * @ngdoc method
       * @name validarFormularioSolicitud
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
       * Valida que el formulario se haya diligenciado correctamente, con cada tipo de detalle y los campos requeridos,
       * si el detalle es de tipo lista verifica que el valor seleccionado se encuentre entre la lista de opciones del detalle, también si el tipo es una directiva
       * verifica que los valores necesarios para la directiva estén bien. Si no se encuentran errores en el formulario llama a la función cargarDocumentos.
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No retorna ningún valor
       */
      ctrl.validarFormularioSolicitud = function() {
        //

        ctrl.detallesConDocumento = [];
        let TipoDetalleTemp = ctrl.TiposDetalle.find(data => {
          return data.CodigoAbreviacion == "NUM_PLX"
        });
        let TipoDetalleTemp2 = ctrl.TiposDetalle.find(data => {
          return data.CodigoAbreviacion == "LBL_PLX"
        });
        let TipoDetalleTemp3 = ctrl.TiposDetalle.find(data => {
          return data.CodigoAbreviacion == "DOC_PLX"
        });
        let TipoDetalleTemp4 = ctrl.TiposDetalle.find(data => {
          return data.CodigoAbreviacion == "DRT_PLX"
        });
        let TipoDetalleTemp5 = ctrl.TiposDetalle.find(data => {
          return data.CodigoAbreviacion == "CHECK_PLX"
        });
        let TipoDetalleTemp6 = ctrl.TiposDetalle.find(data => {
          return data.CodigoAbreviacion == "RBTN_PLX"
        });
        let TipoDetalleTemp7 = ctrl.TiposDetalle.find(data => {
          return data.CodigoAbreviacion == "SLCT_PLX"
        });
        let TipoDetalleTemp8 = ctrl.TiposDetalle.find(data => {
          return data.CodigoAbreviacion == "LIST_PLX"
        });
        let TipoDetalleTemp9 = ctrl.TiposDetalle.find(data => {
          return data.CodigoAbreviacion == "DAN_PLX"
        });
        angular.forEach(ctrl.detalles, function(detalle) {
          if (detalle.Detalle.TipoDetalle === TipoDetalleTemp.Id) {
            //console.log("DETALLENUM", detalle)
            detalle.respuesta = detalle.respuestaNumerica + "";
          }
          if (detalle.Detalle.TipoDetalle === TipoDetalleTemp2.Id) {
            detalle.respuesta = detalle.opciones[0].bd;
          }
          if (detalle.Detalle.TipoDetalle === TipoDetalleTemp3.Id) {
            //console.log("DETALLE ", detalle)
            detalle.respuesta = ctrl.url;            
            ctrl.detallesConDocumento.push(detalle);
          }
          if (detalle.Detalle.TipoDetalle === TipoDetalleTemp9.Id) {
            console.log("DETALLE 9 ", detalle)
            //console.log("respuesta", detalle.respuesta)
            detalle.respuesta = ctrl.url;
            if(detalle.fileModel !== null) {
              ctrl.detallesConDocumento.push(detalle);
            }            
          }
          if (detalle.Detalle.TipoDetalle === TipoDetalleTemp4.Id) {
            if (detalle.Detalle.Descripcion == 'solicitar-asignaturas') {
              detalle.respuesta = "JSON";

              if(ctrl.estudiante.asignaturas_elegidas.length > 0) {
                ctrl.estudiante.asignaturas_elegidas[0].$$hashKey = undefined;
                //Nuevo campo para Detalles
                ctrl.estudiante.asignaturas_elegidas[0].Opcion = 1;
                detalle.respuesta = detalle.respuesta + "-" + JSON.stringify(ctrl.estudiante.asignaturas_elegidas[0]); 
              }
            }

            if (detalle.Detalle.Descripcion == 'solicitar-asignaturas-2') {
              if(ctrl.estudiante.asignaturas_elegidas2.length > 0) {
                detalle.respuesta = "JSON";
                ctrl.estudiante.asignaturas_elegidas2[0].$$hashKey = undefined;
                //Nueva campo para Detalles
                ctrl.estudiante.asignaturas_elegidas2[0].Opcion = 2;
                detalle.respuesta = detalle.respuesta + "-" + JSON.stringify(ctrl.estudiante.asignaturas_elegidas2[0]); 
              } else {
                detalle.respuesta = "undefined"
              }
            }
            
            if (detalle.Detalle.Descripcion == 'asignar-estudiantes') {
              detalle.respuesta = (ctrl.estudiantes.length === 0) ? ctrl.codigo : ctrl.codigo + "," + ctrl.estudiantes.toString();
            }
            if (detalle.Detalle.Descripcion == 'asignar-area') {
              detalle.respuesta = "JSON";
              angular.forEach(ctrl.estudiante.areas_elegidas, function(area) {
                area.$$hashKey = undefined;
                detalle.respuesta = detalle.respuesta + "-" + JSON.stringify({"Id":area.Id});
                //detalle.respuesta = detalle.respuesta +"," + (area.Id+"-"+area.Nombre);
              });
              //detalle.respuesta = detalle.respuesta.substring(1);
            }
          }
          if (detalle.Detalle.TipoDetalle === TipoDetalleTemp5.Id || detalle.Detalle.TipoDetalle === TipoDetalleTemp6.Id) {
            if (detalle.Detalle.CodigoAbreviacion == "PEAP") {

              var valueRadio = getValueRadio();

              if(ctrl.estudiante.dobleSolicitud){
                detalle.respuesta = valueRadio
              } else{
                detalle.respuesta = "1"
              }

            } else {
              if (detalle.bool === undefined) {
                detalle.bool = false;
              }
              if (detalle.bool) {
                detalle.respuesta = "SI";
              } else {
                detalle.respuesta = "NO";
              }
            }

            //detalle.respuesta = detalle.bool.toString();
          }
        });
        //Realizar validaciones
        ctrl.erroresFormulario = false;
        angular.forEach(ctrl.detalles, function(detalle) {
          if (typeof(detalle.respuesta) !== "string") {
            swal(
              'Validación del formulario',
              "Diligencie correctamente el formulario por favor.",
              'warning'
            );
            //
            ctrl.erroresFormulario = true;
          }
          if (detalle.respuesta === "" && detalle.Detalle.TipoDetalle !== TipoDetalleTemp4.Id && detalle.Detalle.TipoDetalle !== TipoDetalleTemp7.Id && detalle.Detalle.TipoDetalle !== TipoDetalleTemp7.Id) {
            swal(
              'Validación del formulario',
              "Debe completar todos los campos del formulario.",
              'warning'
            );
            //
            ctrl.erroresFormulario = true;
          }
          if (ctrl.estudiante.areas_elegidas.length === 0 && detalle.Detalle.Descripcion == 'asignar-area') {
            swal(
              'Validación del formulario',
              "Debe ingresar al menos un área de conocimiento.",
              'warning'
            );
            //
            ctrl.erroresFormulario = true;
          }
          /*if (detalle.Detalle.Descripcion == 'solicitar-asignaturas' && !ctrl.estudiante.minimoCreditos) {
            swal(
              'Validación del formulario',
              "Debe cumplir con el minimo de creditos.",
              'warning'
            );
            ctrl.erroresFormulario = true;
          }*/
          if (detalle.Detalle.TipoDetalle === TipoDetalleTemp7.Id || detalle.Detalle.TipoDetalle === TipoDetalleTemp8.Id) {
            var contiene = false;
            //
            angular.forEach(detalle.opciones, function(opcion) {
              if (opcion.bd == detalle.respuesta) {
                contiene = true;
              }
            });
            //Si el detalle es de docente co-director se puede dejar vacio
            if (detalle.Detalle.CodigoAbreviacion == 'SDC' && (detalle.respuesta == "" || detalle.respuesta == "No solicita")) {
              detalle.respuesta = "No solicita";
              contiene = true;
            }
            if (!contiene) {
              swal(
                'Validación del formulario',
                "Error ingrese una opcion valida.",
                'warning'
              );
              ctrl.erroresFormulario = true;
            }
          }
          if (detalle.Detalle.TipoDetalle === TipoDetalleTemp3.Id) {
            if (detalle.fileModel == null || detalle.fileModel.type !== "application/pdf") {
              swal(
                'Validación del formulario',
                "Error, ingrese documento PDF en campo de documento final. (Documento)",
                'warning'
              );
              ctrl.erroresFormulario = true;
            }
          }
          if (detalle.Detalle.TipoDetalle === TipoDetalleTemp9.Id) {            
            if(detalle.fileModel === null) {
              return;
            }
            var archivo = detalle.fileModel.name;
            var extension = archivo.split('.').pop().toLowerCase();
            if (extension === 'rar' || extension === 'zip' || detalle.fileModel.type === "application/zip" || detalle.fileModel.type === "application/x-zip-compressed" || detalle.fileModel.type === "application/vnd.rar") {
              swal(
                'Validación del formulario',
                "Error, no ingrese archivo comprimido (.rar, .zip) en campo de documento anexo.",
                'warning'
              );
              ctrl.erroresFormulario = true;
            }
          }
          if(detalle.Detalle.TipoDetalle === TipoDetalleTemp5.Id){
            if(detalle.respuesta == "NO"){
              if (detalle.Detalle.CodigoAbreviacion != "ADA" || ctrl.estudiantesTg.length > 0) {
                swal(
                  'Validación del formulario',
                  "Debe aceptar los terminos y condiciones de la modalidad.",
                  'warning'
                );
                ctrl.erroresFormulario = true;
              }
            }
          }
          if(detalle.Detalle.CodigoAbreviacion == "ESPELE" || detalle.Detalle.CodigoAbreviacion == "ESPELE"){
            if(ctrl.estudiante.selectsDeshabilitados == undefined){
              swal(
                'Validación del formulario',
                "Debe confirmar la selección de los proyectos curriculares",
                'warning'
              );
              ctrl.erroresFormulario = true;
            }
          }
        });
        if (!ctrl.erroresFormulario) {
          //ctrl.cargarSolicitudes();
          ctrl.cargarDocumentos();
        }
      }

      function cargueDocumentos(docs) {//Función para el cargue de documentos al Gestor Documental

        let detalle = docs.shift();//Se toma el primer documento del Array de documentos

        var descripcion;
        var fileBase64;
        var dataDocs = [];
        let TipoDocumentoTemp = ctrl.TiposDocumento.find(dataTipoDoc => {
          return dataTipoDoc.CodigoAbreviacion == "DTR_PLX"
        });
        descripcion = detalle.Detalle.Nombre + ":" + ctrl.codigo;
        utils.getBase64(detalle.fileModel).then(
          async function (base64) {
            fileBase64 = base64;

            //Se prepara la información a enviar a la API
            dataDocs = [{
              IdTipoDocumento: TipoDocumentoTemp.Id, //id tipo documento de documentos_crud
              nombre: detalle.fileModel.name, // nombre formado por nombre de la solicitud
              metadatos: {
                NombreArchivo: detalle.Detalle.Nombre + ": " + ctrl.codigo,
                Tipo: "Archivo",
                Observaciones: "Solicitud inicial"
              },
              descripcion: descripcion,
              file: fileBase64,
            }]

            await gestorDocumentalMidRequest.post('/document/uploadAnyFormat', dataDocs) //Se envía el documento al Gestor Documental
              .then(function (response) {
                if (response.data.res.Enlace) {//Si la respuesta fue correcta
                  detalle.respuesta = response.data.res.Enlace;//Se almacena la URL del documento
                  ctrl.url = response.data.res.Enlace;

                  if (docs.length > 0) {//Si aún quedan documentos por cargar, se llama a esta misma función y se repite el proceso
                    cargueDocumentos(docs)
                  }
                  else {//Si no quedan más documentos por cargar...
                    ctrl.cargarSolicitudes();
                  }

                } else {//El API no retornó la URL del documento
                  reject("No se recibió un enlace en la respuesta.");
                }
              })
              .catch(function (error) {//El API no respondió de forma correcta
                console.error("Error al subir el documento:", error);
                reject(error);
              });
          })
      }

      /**
       * @ngdoc method
       * @name cargarDocumentos
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description
       * Si los detalles de la solicitud tienen asociados documentos, llama a la función cargarDocumento para cargar todos 
       * los documentos a {@link services/poluxService.service:gestorDocumentalMidService gestorDocumentalMidRequest}, en caso de que no los tenga o que haya terminado de cargarlos llama a la función cargarSolicitudes.
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No retorna nigún valor
       */
      ctrl.cargarDocumentos = function(callFunction) {
        if (ctrl.detallesConDocumento.length > 0) {
          // OK, the returned client is connected
          var fileTypeError = false;
          var validExtensions = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
          angular.forEach(ctrl.detallesConDocumento, function (detalle) {            
            var documento = detalle.fileModel;
            var tam = parseInt(detalle.Detalle.Descripcion.split(";")[1] + "000");            
            if (!validExtensions.includes(documento.type) || documento.size > tam) {             
              fileTypeError = true;
            }            
          });
          $scope.loadFormulario = true;
          if (!fileTypeError) {

            cargueDocumentos(ctrl.detallesConDocumento)

          } else {
            swal(
              $translate.instant("ERROR.SUBIR_DOCUMENTO"),
              $translate.instant("VERIFICAR_DOCUMENTO"),
              'warning'
            );
            $scope.loadFormulario = false;
          }
        } else {
          //agregar validación de error
          $scope.loadFormulario = true;
          ctrl.cargarSolicitudes();
        }
      };

      /**
       * @ngdoc method
       * @name cargarSolicitudes
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
       * Crea la data necesaria para registrar la solicitud (detalles, respuesta, usuarios y solicitud) y la envía a {@link services/poluxService.service:poluxRequest poluxRequest}
       * para registrarla.
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No retorna nigún valor
       */
      ctrl.cargarSolicitudes = function() {
        //var data_solicitud = [];
        var data_solicitud = {};
        var data_detalles = [];
        var data_usuarios = [];
        var data_respuesta = {};
        var fecha = new Date();
        if (ctrl.trabajo_grado !== undefined) {
          data_solicitud = {
            "Fecha": fecha,
            "ModalidadTipoSolicitud": {
              "Id": ctrl.ModalidadTipoSolicitud.Id
            },
            "TrabajoGrado": {
              "Id": ctrl.trabajo_grado
            },
            "PeriodoAcademico": ctrl.periodo
          };
        } else {
          let TipoSolicitudTemp = ctrl.TiposSolicitudes.find(data => {
            return data.CodigoAbreviacion == "SI_PLX"
          });

          let ModalidadTemp = ctrl.Modalidades.find(data => {
            return data.CodigoAbreviacion == "EAPRO_PLX"
          });
          /*if((ctrl.TipoSolicitud.Id == TipoSolicitudTemp.Id) && (ctrl.modalidad == ModalidadTemp.CodigoAbreviacion)){
            let TipoSolicitudTemp = ctrl.TiposSolicitudes.find(data => {
              return data.CodigoAbreviacion == "SAD_PLX"
            });
            let ModalidadesTipoSolicitudTemp = ctrl.ModalidadesTiposSolicitudes.find(data => {
              return data.Modalidad == ctrl.modalidad && data.TipoSolicitud == TipoSolicitudTemp.Id
            });
            ctrl.ModalidadTipoSolicitud = ModalidadesTipoSolicitudTemp;
          }*/

          ModalidadTemp = ctrl.Modalidades.find(data => {
            return data.CodigoAbreviacion == "MONO_PLX"
          });
          console.log("MODALIDAD ASD ", ctrl.modalidad)
          if((ctrl.TipoSolicitud.Id == TipoSolicitudTemp.Id) && (ctrl.modalidad == ModalidadTemp.CodigoAbreviacion)){
            console.log("entra a modalidad")
            TipoSolicitudTemp = ctrl.TiposSolicitudes.find(data => {
              return data.CodigoAbreviacion == "SAD_PLX"
            });
            let ModalidadesTipoSolicitudTemp = ctrl.ModalidadesTiposSolicitudes.find(data => {
              // TENER EN CUENTA PARA AJUSTE CON LAS OTRAS MODALIDADES
              return data.Modalidad == ModalidadTemp.Id && data.TipoSolicitud == TipoSolicitudTemp.Id
            });
            ctrl.ModalidadTipoSolicitud = ModalidadesTipoSolicitudTemp;
          }

          ModalidadTemp = ctrl.Modalidades.find(data => {
            return data.CodigoAbreviacion == "INV_PLX"
          });
          if((ctrl.TipoSolicitud.Id == TipoSolicitudTemp.Id) && (ctrl.modalidad == ModalidadTemp.CodigoAbreviacion)){
            TipoSolicitudTemp = ctrl.TiposSolicitudes.find(data => {
              return data.CodigoAbreviacion == "SAD_PLX"
            });
            let ModalidadesTipoSolicitudTemp = ctrl.ModalidadesTiposSolicitudes.find(data => {
              return data.Modalidad == ModalidadTemp.Id && data.TipoSolicitud == TipoSolicitudTemp.Id
            });
            ctrl.ModalidadTipoSolicitud = ModalidadesTipoSolicitudTemp;
          }

          ModalidadTemp = ctrl.Modalidades.find(data => {
            return data.CodigoAbreviacion == "CRE_PLX"
          });
          if((ctrl.TipoSolicitud.Id == TipoSolicitudTemp.Id) && (ctrl.modalidad == ModalidadTemp.CodigoAbreviacion)){
            TipoSolicitudTemp = ctrl.TiposSolicitudes.find(data => {
              return data.CodigoAbreviacion == "SAD_PLX"
            });
            let ModalidadesTipoSolicitudTemp = ctrl.ModalidadesTiposSolicitudes.find(data => {
              return data.Modalidad == ModalidadTemp.Id && data.TipoSolicitud == TipoSolicitudTemp.Id
            });
            ctrl.ModalidadTipoSolicitud = ModalidadesTipoSolicitudTemp;
          }

          ModalidadTemp = ctrl.Modalidades.find(data => {
            return data.CodigoAbreviacion == "PEMP_PLX"
          });
          if((ctrl.TipoSolicitud.Id == TipoSolicitudTemp.Id) && (ctrl.modalidad == ModalidadTemp.CodigoAbreviacion)){
            TipoSolicitudTemp = ctrl.TiposSolicitudes.find(data => {
              return data.CodigoAbreviacion == "SAD_PLX"
            });
            let ModalidadesTipoSolicitudTemp = ctrl.ModalidadesTiposSolicitudes.find(data => {
              return data.Modalidad == ModalidadTemp.Id && data.TipoSolicitud == TipoSolicitudTemp.Id
            });
            ctrl.ModalidadTipoSolicitud = ModalidadesTipoSolicitudTemp;
          }

          ModalidadTemp = ctrl.Modalidades.find(data => {
            return data.CodigoAbreviacion == "PACAD_PLX"
          });
          console.log("MODALIDAD ", ctrl.modalidad)
          console.log("TIPO SOL ", ctrl.TipoSolicitud)
          if((ctrl.TipoSolicitud.Id == TipoSolicitudTemp.Id) && (ctrl.modalidad == ModalidadTemp.CodigoAbreviacion)){
            TipoSolicitudTemp = ctrl.TiposSolicitudes.find(data => {
              return data.CodigoAbreviacion == "SAD_PLX"
            });
            let ModalidadesTipoSolicitudTemp = ctrl.ModalidadesTiposSolicitudes.find(data => {
              return data.Modalidad == ModalidadTemp.Id && data.TipoSolicitud == TipoSolicitudTemp.Id
            });
            ctrl.ModalidadTipoSolicitud = ModalidadesTipoSolicitudTemp;
          }

          ModalidadTemp = ctrl.Modalidades.find(data => {
            return data.CodigoAbreviacion == "PAS_PLX"
          });
          if((ctrl.TipoSolicitud.Id == TipoSolicitudTemp.Id) && (ctrl.modalidad == ModalidadTemp.CodigoAbreviacion)){
            TipoSolicitudTemp = ctrl.TiposSolicitudes.find(data => {
              return data.CodigoAbreviacion == "SAD_PLX"
            });
            let ModalidadesTipoSolicitudTemp = ctrl.ModalidadesTiposSolicitudes.find(data => {
              return data.Modalidad == ModalidadTemp.Id && data.TipoSolicitud == TipoSolicitudTemp.Id
            });
            ctrl.ModalidadTipoSolicitud = ModalidadesTipoSolicitudTemp;
          }

          // ModalidadTemp = ctrl.Modalidades.find(data => {
          //   return data.CodigoAbreviacion == "EAPOS_PLX"
          // });
          // console.log("revisa modalidad EAPOS")
          // if((ctrl.TipoSolicitud.Id == TipoSolicitudTemp.Id) && (ctrl.modalidad == ModalidadTemp.CodigoAbreviacion)){
          //   TipoSolicitudTemp = ctrl.TiposSolicitudes.find(data => {
          //     return data.CodigoAbreviacion == "SAD_PLX"
          //   });
          //   let ModalidadesTipoSolicitudTemp = ctrl.ModalidadesTiposSolicitudes.find(data => {
          //     return data.Modalidad == ModalidadTemp.Id && data.TipoSolicitud == TipoSolicitudTemp.Id
          //   });
          //   ctrl.ModalidadTipoSolicitud = ModalidadesTipoSolicitudTemp;
          // }

          data_solicitud = {
            "Fecha": fecha,
            "ModalidadTipoSolicitud": ctrl.ModalidadTipoSolicitud,
            "PeriodoAcademico": ctrl.periodo,
            "DatosPersonalesArl": ctrl.datosEstudiante
          };
          //console.log("DATA ", data_solicitud)
        }
        angular.forEach(ctrl.detalles, function(detalle) {
          //console.log("Detalle para la solicitud", detalle);
          if (detalle.fileModel === null && 
            (detalle.Detalle.CodigoAbreviacion === "DAR1" || 
             detalle.Detalle.CodigoAbreviacion === "DAR2" || 
             detalle.Detalle.CodigoAbreviacion === "DAR3")) {   
            return;
          }
          if (detalle.Requerido === false && detalle.respuesta === "undefined") {
            return;
          }
          if (detalle.Id == ctrl.posDocente) {
            ctrl.docDocenteDir = detalle.respuesta;
          }          
          data_detalles.push({
            "Descripcion": detalle.respuesta,
            "SolicitudTrabajoGrado": {
              "Id": 0
            },
            "DetalleTipoSolicitud": {
              "Id": detalle.Id
            }
          });

        });
        //Se agrega solicitud al estudiante
        data_usuarios.push({
          "Usuario": ctrl.codigo,
          "SolicitudTrabajoGrado": {
            "Id": 0
          }
        });
        //estudiantes que ya pertenecian al tg
        //si es diferente a una solicitud de cancelación
        if (ctrl.TipoSolicitud !== undefined) {
          let TipoSolicitudTemp = ctrl.TiposSolicitudes.find(data => {
            return data.CodigoAbreviacion == "SCM_PLX"
          });
          if (ctrl.TipoSolicitud.Id !== TipoSolicitudTemp.Id) {
            angular.forEach(ctrl.estudiantesTg, function(estudiante) {
              if(estudiante!==undefined){
              data_usuarios.push({
                "Usuario": estudiante,
                "SolicitudTrabajoGrado": {
                  "Id": 0
                }
              });}
            });
          }
        }
        //estudiantes agregados en la solicitud inicial
        angular.forEach(ctrl.estudiantes, function(estudiante) {
            data_usuarios.push({
            "Usuario": estudiante,
            "SolicitudTrabajoGrado": {
              "Id": 0
            }
          });
        });
        if(this.siModalidad && ["SCM_PLX","SCDI_PLX","SCDE_PLX","SPR_PLX","SMDTG_PLX","SCE_PLX","SCCI_PLX","SRTG_PLX","SCO_PLX"].includes(ctrl.TipoSolicitud.CodigoAbreviacion)){
          let EstadoSolicitudTemp = ctrl.EstadosSolicitudes.find(data => {
            return data.CodigoAbreviacion == "PRDI_PLX"
          });
          //Respuesta de la solicitud
          data_respuesta = {
            "Fecha": fecha,
            "Justificacion": "Su solicitud esta pendiente a la revision del docente",
            "EnteResponsable": 0,
            "Usuario": 0,
            "EstadoSolicitud": EstadoSolicitudTemp.Id,
            "SolicitudTrabajoGrado": {
              "Id": 0
            },
            "Activo": true
          }

          let ModalidadTemp1 = ctrl.Modalidades.find(data => {
            return data.CodigoAbreviacion == "EAPOS_PLX"
          });
          let ModalidadTemp2 = ctrl.Modalidades.find(data => {
            return data.CodigoAbreviacion == "EAPRO_PLX"
          });

          if (ctrl.Trabajo.TrabajoGrado.Modalidad != ModalidadTemp1.Id && ctrl.Trabajo.TrabajoGrado.Modalidad != ModalidadTemp2.Id) {
            console.log("Entró al if != EAPOS", ctrl.Trabajo.TrabajoGrado.Modalidad, ModalidadTemp2.Id)
            data_respuesta.EnteResponsable = ctrl.Trabajo.directorInterno.Usuario
          } else {
            EstadoSolicitudTemp = ctrl.EstadosSolicitudes.find(data => {
              return data.CodigoAbreviacion == "RDC_PLX"
            });
            data_respuesta.EstadoSolicitud = EstadoSolicitudTemp.Id
          }
        }else{
          if(ctrl.modalidad == "PAS_PLX"){ //Si la modalidad seleccionada es pasantia, entonces se envia a la oficina externa de pasantias
            let EstadoSolicitudTemp = ctrl.EstadosSolicitudes.find(data => {
              return data.CodigoAbreviacion == "PREP_PLX"
            });
            //Respuesta de la solicitud
            data_respuesta = {
              "Fecha": fecha,
              "Justificacion": "Su solicitud esta Pendiente por la revisión por parte de la oficina de extension de pasantias",
              "EnteResponsable": 0,
              "Usuario": 0,
              "EstadoSolicitud": EstadoSolicitudTemp.Id,
              "SolicitudTrabajoGrado": {
                "Id": 0
              },
              "Activo": true
            }
          }
          else{
            let EstadoSolicitudTemp = ctrl.EstadosSolicitudes.find(data => {
              return data.CodigoAbreviacion == "RDC_PLX"
            });
            //Respuesta de la solicitud
            data_respuesta = {
              "Fecha": fecha,
              "Justificacion": "Su solicitud fue radicada",
              "EnteResponsable": parseInt(ctrl.docDocenteDir),
              "Usuario": 0,
              "EstadoSolicitud": EstadoSolicitudTemp.Id,
              "SolicitudTrabajoGrado": {
                "Id": 0
              },
              "Activo": true
            }
          }
        }

        //se crea objeto con las solicitudes
        ctrl.solicitud = {
          Solicitud: data_solicitud,
          Respuesta: data_respuesta,
          DetallesSolicitud: data_detalles,
          UsuariosSolicitud: data_usuarios
        }
        poluxMidRequest.post("tr_solicitud", ctrl.solicitud).then(async function (response) {
          if (response.data.Success === true) {

            if (CONF.PRODUCCION) {//Si está en ambiente de producción, se enviarán las notificaciones
              //Se prepara la información para enviar la notificación al siguiente usuario en el flujo
              var titulo_tg, modalidad_tg, correos = []

              if (ctrl.TipoSolicitud.CodigoAbreviacion == "SI_PLX") {//Si es solicitud inicial, los datos de Modalidad y Título se recuperan de una forma distinta a las demás solicitudes
                angular.forEach(ctrl.Modalidades, function (mod) {
                  if (mod.CodigoAbreviacion == ctrl.modalidad) {
                    modalidad_tg = mod.Nombre
                  }
                })

                if (ctrl.modalidad == "EAPOS_PLX") {//Si la modalidad es Materias de Posgrado, se debe ingresar el título de forma manual
                  titulo_tg = "Espacios Académicos de Posgrado"

                } else {//Para las demás modalidades se recupera desde los detalles de la solicitud inicial
                  angular.forEach(ctrl.detalles, function (detalle) {
                    if (detalle.Detalle.CodigoAbreviacion == "NPRO") {
                      titulo_tg = detalle.respuesta;
                    }
                  })
                }
              }
              else {
                angular.forEach(ctrl.Modalidades, function (mod) {
                  if (mod.Id == ctrl.trabajoGrado.Modalidad) {
                    modalidad_tg = mod.Nombre
                  }
                })

                titulo_tg = ctrl.trabajoGrado.Titulo
              }

              //Se busca el codigo de abreviación de la modalidad del tg
              var ModalidadTemp = ctrl.Modalidades.find(data => {
                return data.Id == ctrl.modalidad
              });

              if (ctrl.modalidad == "PAS_PLX" && ctrl.TipoSolicitud.CodigoAbreviacion == "SI_PLX") {//si es solicitud inicial de pasantía
                //se debe enviar a la Oficina de Extensión de Pasantías
                correos.push("pasantias_ing@udistrital.edu.co")
              }
              else if (ctrl.modalidad == "EAPOS_PLX" || ModalidadTemp.CodigoAbreviacion == "EAPOS_PLX") {//Si la modalidad es Materias de Posgrado, se debe enviar el correo al coordinador y asistente del proyecto del estudiante

                await academicaRequest.get("consulta_carrera_condor", [ctrl.estudiante.Carrera]).then(async function (carrera) {//se busca el documento del coordinador

                  console.log("data_carrera:", carrera)

                  var data_auth_mid = {
                    numero: carrera.data.carreraCondorCollection.carreraCondor[0].numero_documento_coordinador
                  }

                  await autenticacionMidRequest.post("token/documentoToken", data_auth_mid).then(function (response) {//se busca el correo
                    correos.push(response.data.email)//se almacena en los correos destinatarios
                  })
                })
                //se busca el correo del Asistente de Proyecto
                await academicaRequest.get("obtener_asistente", [ctrl.estudiante.Carrera]).then(async function (asistente) {//se busca el documento del asistente

                  console.log("data_asistente:", asistente)

                  var data_auth_mid = {
                    numero: asistente.data.asistente.proyectos[0].documento_asistente
                  }

                  await autenticacionMidRequest.post("token/documentoToken", data_auth_mid).then(function (response) {//se busca el correo del asistente con el documento
                    correos.push(response.data.email)//se almacena en los correos destinatarios
                  })
                })
              } else {
                //se debe enviar al Docente Director
                if (ctrl.TipoSolicitud.CodigoAbreviacion == "SI_PLX") {//si es solicitud inicial, se busca el documento desde los detalles del formulario
                  angular.forEach(ctrl.detalles, async function (detalle) {
                    if (detalle.Detalle.CodigoAbreviacion == "DAP") {

                      console.log(detalle.respuesta)

                      data_auth_mid = {
                        numero: detalle.respuesta
                      }

                      await autenticacionMidRequest.post("token/documentoToken", data_auth_mid).then(function (responseCorreo) {
                        correos.push(responseCorreo.data.email)
                      })
                    }
                  })
                }
              }

              var data_correo = {
                "Source": "notificacionPolux@udistrital.edu.co",
                "Template": "POLUX_PLANTILLA_SOLICITUD",
                "Destinations": [
                  {
                    "Destination": {
                      "ToAddresses": correos
                    },
                    "ReplacementTemplateData": {
                      "tipo_solicitud": ctrl.TipoSolicitud.Nombre,
                      "nombre_estudiante": ctrl.estudiante.Nombre,
                      "titulo_tg": titulo_tg,
                      "modalidad": modalidad_tg
                    }
                  }
                ]
              }

              //console.log(correos)

              notificacionRequest.post("email/enviar_templated_email", data_correo).then(function (response) {
                console.log("Envia el correo")
                console.log(response)
              }).catch(function (error) {
                console.log("Error: ", error)
              });
            }

            swal(
              $translate.instant("FORMULARIO_SOLICITUD"),
              $translate.instant("SOLICITUD_REGISTRADA"),
              'success'
            );

            if (ctrl.Docente == 1) {
              $location.path("/#");
            } else {
              $location.path("/solicitudes/listar_solicitudes");
            }
          } else {
            swal(
              $translate.instant("FORMULARIO_SOLICITUD"),
              $translate.instant(response.data.Data[1]),
              'warning'
            );
          }
          $scope.loadFormulario = false;
        });
      }

      ctrl.getDocumento = function(docid) {
        nuxeo.header('X-NXDocumentProperties', '*');

        ctrl.obtenerDoc = function() {
          var defer = $q.defer();

          nuxeo.request('/id/' + docid)
            .get()
            .then(function(response) {
              ctrl.doc = response;
              //var aux = response.get('file:content');
              ctrl.document = response;
              defer.resolve(response);
            })
            .catch(function(error) {
              defer.reject(error)
            });
          return defer.promise;
        };

        ctrl.obtenerFetch = function(doc) {
          var defer = $q.defer();

          doc.fetchBlob()
            .then(function(res) {
              defer.resolve(res.blob());

            })
            .catch(function(error) {
              defer.reject(error)
            });
          return defer.promise;
        };

        ctrl.obtenerDoc().then(function() {

          ctrl.obtenerFetch(ctrl.document).then(function(r) {
            ctrl.blob = r;
            var fileURL = URL.createObjectURL(ctrl.blob);
            //
            ctrl.content = $sce.trustAsResourceUrl(fileURL);
            $window.open(fileURL);
          });
        });

      }

      /**
       * @ngdoc method
       * @name saveDataEstudianteARL
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description
       * Cuando el estudiante esté realizando una solicitud inicial de Pasantía (interna) debe cargar datos personales, esta función abre el modal donde los va a ingresar
       * @param {undefined} undefined No requiere parámetros 
       */

      ctrl.saveDataEstudianteARL = function () {
        // Validaciones opcionales antes de procesar los datos
        if (ctrl.datosEstudiante.fechaNacimiento && ctrl.datosEstudiante.ciudadNacimiento &&
            ctrl.datosEstudiante.direccionResidencia && ctrl.datosEstudiante.telefono &&
            ctrl.datosEstudiante.correoPersonal && ctrl.datosEstudiante.eps) {
            ctrl.datosEstudiante.pasantiaInterna = true;
            // Datos capturados del formulario
            console.log('Pasantía Interna:', ctrl.datosEstudiante.pasantiaInterna);
            console.log('Fecha de Nacimiento:', ctrl.datosEstudiante.fechaNacimiento);
            console.log('Ciudad de Nacimiento:', ctrl.datosEstudiante.ciudadNacimiento);
            console.log('Dirección de Residencia:', ctrl.datosEstudiante.direccionResidencia);
            console.log('Teléfono:', ctrl.datosEstudiante.telefono);
            console.log('Correo Personal:', ctrl.datosEstudiante.correoPersonal);
            console.log('EPS:', ctrl.datosEstudiante.eps);

            // Cierra el modal después de guardar los datos
            $('#modalDataPersonalARL').modal('hide');
        } else {
            console.log('Por favor complete todos los campos antes de guardar');
        }
    };




      /**
       * @ngdoc method
       * @name openModalDataARL
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description
       * Cuando el estudiante esté realizando una solicitud inicial de Pasantía (interna) debe cargar datos personales, esta función abre el modal donde los va a ingresar
       * @param {undefined} undefined No requiere parámetros 
       */
      ctrl.openModalDataARL = function () {
      //console.log("Si llega la orden!!!")
      // Mostrar el modal
        $('#modalDataPersonalARL').modal('show');
      };

      /**
       * @ngdoc method
       * @name getdatasolicitudDocente
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
      Se asigna La data del trabajo de grado para el formulario como tal
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplió la petición y se resuelve con el objeto tieneProrrogas
       */
       ctrl.getdatasolicitudDocente = function(responseTrabajoEstudiante) {
              console.log("Respuesta consulta dataSolicitudEstudiante", responseTrabajoEstudiante);
              ctrl.Trabajo = responseTrabajoEstudiante;
              ctrl.modalidad = responseTrabajoEstudiante.TrabajoGrado.Modalidad.Id;
              console.log("MODALIDAD 6", ctrl.modalidad)
              ctrl.trabajo_grado_completo = responseTrabajoEstudiante.TrabajoGrado;
              ctrl.trabajo_grado = responseTrabajoEstudiante.TrabajoGrado.Id;
              ctrl.trabajoGrado = responseTrabajoEstudiante.TrabajoGrado;
              ctrl.siModalidad = true;
              ctrl.modalidad_select = true;
              //buscar # de autores del tg
              var parametros = $.param({
                query: "TrabajoGrado:" + ctrl.trabajo_grado,
                limit: 0,
              });
              poluxRequest.get("estudiante_trabajo_grado", parametros).then(function(autoresTg) {
              ctrl.codigoEstu = autoresTg.data.Data[0].Estudiante;
                angular.forEach(autoresTg.data.Data, function(estudiante) {
                  if (estudiante.Estudiante !== ctrl.codigo) {
                    ctrl.estudiantesTg.push(estudiante.Estudiante);
                    var parametrosVinculacion = $.param({
                      query: "TrabajoGrado:" + ctrl.trabajo_grado + ",Activo:True",
                      limit: 0
                    });
                    poluxRequest.get("vinculacion_trabajo_grado", parametrosVinculacion).then(function(responseVinculacion) {
                        ctrl.Trabajo.evaluadores = [];
                        if (Object.keys(responseVinculacion.data.Data[0]).length === 0) {
                          responseVinculacion.data.Data = [];
                        }

                        let RolTrabajoGradoTemp1 = ctrl.RolesTrabajoGrado.find(data => {
                          return data.CodigoAbreviacion == "DIRECTOR_PLX"
                        });

                        let RolTrabajoGradoTemp2 = ctrl.RolesTrabajoGrado.find(data => {
                          return data.CodigoAbreviacion == "DIR_EXTERNO_PLX"
                        });
          
                        let RolTrabajoGradoTemp3 = ctrl.RolesTrabajoGrado.find(data => {
                          return data.CodigoAbreviacion == "EVALUADOR_PLX"
                        });
          
                        let RolTrabajoGradoTemp4 = ctrl.RolesTrabajoGrado.find(data => {
                          return data.CodigoAbreviacion == "CODIRECTOR_PLX"
                        });

                        angular.forEach(responseVinculacion.data.Data, function(vinculado) {
                          if (vinculado.RolTrabajoGrado == RolTrabajoGradoTemp1.Id) {
                            ctrl.Trabajo.directorInterno = vinculado;
                          }
                          if (vinculado.RolTrabajoGrado == RolTrabajoGradoTemp2.Id) {
                            ctrl.Trabajo.directorExterno = vinculado;
                          }
                          if (vinculado.RolTrabajoGrado == RolTrabajoGradoTemp3.Id) {
                            ctrl.Trabajo.evaluadores.push(vinculado);
                          }
                          if (vinculado.RolTrabajoGrado == RolTrabajoGradoTemp4.Id) {
                            ctrl.Trabajo.codirector = vinculado;
                          }
                        });
                        academicaRequest.get("datos_estudiante", [ctrl.codigoEstu]).then(function(response2) {
                          if (!angular.isUndefined(response2.data.estudianteCollection.datosEstudiante)) {
                            ctrl.estudiante = {
                              "Codigo": ctrl.codigo,
                              "Nombre": response2.data.estudianteCollection.datosEstudiante[0].nombre,
                              "Modalidad": ctrl.modalidad,
                              "Tipo": "POSGRADO",
                              "PorcentajeCursado": response2.data.estudianteCollection.datosEstudiante[0].porcentaje_cursado,
                              // "PorcentajeCursado": response2.data.estudianteCollection.datosEstudiante[0].creditosCollection.datosCreditos[0].porcentaje.porcentaje_cursado[0].porcentaje_cursado,
                              "Promedio": response2.data.estudianteCollection.datosEstudiante[0].promedio,
                              "Rendimiento": response2.data.estudianteCollection.datosEstudiante[0].rendimiento,
                              "Estado": response2.data.estudianteCollection.datosEstudiante[0].estado,
                              "Nivel": response2.data.estudianteCollection.datosEstudiante[0].nivel,
                              "TipoCarrera": response2.data.estudianteCollection.datosEstudiante[0].nombre_tipo_carrera,
                              "Carrera": response2.data.estudianteCollection.datosEstudiante[0].carrera
                            };
                            if (ctrl.estudiante.Nombre === undefined) {
                              ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_DATOS_ESTUDIANTE");
                            } else {
                              //ctrl.estudiante.asignaturas_elegidas = [];
                              //ctrl.estudiante.asignaturas_elegidas2 = [];
                              ctrl.estudiante.areas_elegidas = [];
                              ctrl.estudiante.minimoCreditos = false;
                            }
                            ctrl.cargarDetalles(ctrl.tipoSolicitud_Docente,ctrl.modalidad);
                          } else {
                            ctrl.mensajeErrorCarga = $translate.instant("ERROR.ESTUDIANTE_NO_ENCONTRADO");
                          }
                        })
                        .catch(function(error) {
                          ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_DATOS_ESTUDIANTE");
                        });
                      })
                      .catch(function(error) {
                        ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_DATOS_TRABAJOS");
                      });
                  }
                });
              })
              .catch(function(error) {
                ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_DATOS_TRABAJOS");
              });
      }
    });
