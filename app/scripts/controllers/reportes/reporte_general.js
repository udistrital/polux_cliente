'use strict';

/**
 * @ngdoc controller
 * @name poluxClienteApp.controller:ReportesReporteGeneralCtrl
 * @description
 * # ReportesReporteGeneralCtrl
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
 * @requires services/academicaService.service:academicaRequest
 * @requires services/cidcRequest.service:cidcService
 * @requires services/poluxClienteApp.service:coreAmazonCrudService
 * @requires services/poluxMidService.service:poluxMidRequest
 * @requires services/poluxService.service:poluxRequest
 * @requires services/poluxClienteApp.service:sesionesService
 * @requires services/poluxClienteApp.service:tokenService
 * @requires services/poluxClienteApp.service:oikosRequest
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
 * @property {Number} muestra_btn Valor que determina la carga de menus por el rol
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
 */

angular.module('poluxClienteApp')
  .controller('ReportesReporteGeneralCtrl',
    function ($location, $q, $routeParams, $sce, $scope, $translate, $window, academicaRequest, cidcRequest, coreAmazonCrudService, poluxMidRequest, poluxRequest, sesionesRequest, oikosRequest, token_service) {
      $scope.load = true;
      var ctrl = this;
      $scope.msgCargandoSolicitudes = $translate.instant('LOADING.CARGANDO_REPORTES');
      ctrl.solicitudes = [];
      ctrl.muestra_btn = 0;
      ctrl.carrerasCoordinador = [];
      //token_service.token.documento = "79647592";
      //token_service.token.role.push("COORDINADOR");
      //token_service.token.documento = "20131020002";
      //token_service.token.role.push("ESTUDIANTE");
      ctrl.userRole = token_service.getAppPayload().appUserRole;
      $scope.userId = token_service.getAppPayload().appUserDocument;
      ctrl.userId = $scope.userId;
      if(ctrl.userRole.includes('COORDINADOR_POSGRADO')||ctrl.userRole.includes('COORDINADOR')||ctrl.userRole.includes('ADMIN_POLUX'))
      {
        ctrl.muestra_btn ++;
      }
      ctrl.carreras_oikos = [];
      ctrl.carreras= [];
      ctrl.periodos = [];
      ctrl.periodo_seleccionado = '';
      ctrl.carrera_seleccionada = '';
      ctrl.generarReporte1=0;
      ctrl.generarReporte2=0;
      ctrl.url = "ReportePoluxG";
      oikosRequest.get("dependencia", "query=DependenciaTipoDependencia.TipoDependenciaId.Id:14,Activo:true&limit=0").then(function (carreras) {
        ctrl.carreras_oikos = carreras.data;
        
        $scope.load = false;
      })
        .catch(function (error) {
          
          ctrl.mensajeError = $translate.instant("ERROR.CARGAR_CARRERAS");
          ctrl.errorCargarParametros = true;
          $scope.load = false;
        });

      academicaRequest.get("periodos")
        .then(function (resultadoPeriodosCorrespondientes) {
          if (!angular.isUndefined(resultadoPeriodosCorrespondientes.data.periodosCollection.datosPeriodos)) {
            ctrl.periodos = resultadoPeriodosCorrespondientes.data.periodosCollection.datosPeriodos;
            $scope.load = false;
          } else {
            ctrl.mensajeError = $translate.instant("ERROR.SIN_PERIODO");
          }
        })
        .catch(function (excepcionPeriodosCorrespondientes) {
          
          ctrl.mensajeError = $translate.instant("ERROR.CARGAR_CARRERAS");
          ctrl.errorCargarParametros = true;
          $scope.load = false;
        });

      academicaRequest.get("coordinador_carrera", [$scope.userId, "PREGRADO"]).then(function (responseCoordinador) {
        ctrl.carrerasCoordinador = [];
        ctrl.carrerasCoordinador = responseCoordinador.data.coordinadorCollection.coordinador;
          
        angular.forEach(responseCoordinador.data.coordinadorCollection.coordinador, function (carrera) {
          ctrl.carreras.push(carrera.codigo_proyecto_curricular);
        });
      }).catch(function (error) {
        
        ctrl.mensajeError = $translate.instant("ERROR.CARGAR_CARRERAS");
        ctrl.errorCargarParametros = true;
        $scope.load = false;
      });
      /**
         * @ngdoc method
         * @name generar_reporte_general
         * @methodOf poluxClienteApp.controller:ReportesReporteGeneralCtrl
         * @description 
         * Esta Función consulta los proyectos curriculares de la universidad para mostrarlos en el desplegable y que se pueda seleccionar para consultar los docentes de los reportes.
         * @returns {undefined} No retorna nigún valor. 
         */

      ctrl.generar_reporte_general= function (){ 
        ctrl.generarReporte1 ++;
         /* if (ctrl.carrera_seleccionada && ctrl.periodo_seleccionado) {   
        ctrl.generarReporte++;
        }*/
       /* else {
          swal({
            title: $translate.instant('ERROR'),
            text: $translate.instant('COMPLETE_CAMPOS'),
            type: 'error',
            confirmButtonText: $translate.instant('ACEPTAR')
          })
       }*/
      }

      /**
         * @ngdoc method
         * @name generar_reporte_docente
         * @methodOf poluxClienteApp.controller:ReportesReporteGeneralCtrl
         * @description 
         * Esta Función consulta los proyectos curriculares de la universidad para mostrarlos en el desplegable y que se pueda seleccionar para consultar los docentes de los reportes.
         * @returns {undefined} No retorna nigún valor. 
         */

       ctrl.generar_reporte_docente= function (){ 
          ctrl.generarReporte2 ++;
      }
       /**
         * @ngdoc method
         * @name Cambio_reporte
         * @methodOf poluxClienteApp.controller:ReportesReporteGeneralCtrl
         * @description 
         * Esta Función consulta los proyectos curriculares de la universidad para mostrarlos en el desplegable y que se pueda seleccionar para consultar los docentes de los reportes.
         * @returns {undefined} No retorna nigún valor. 
         */

        ctrl.cambio_reporte= function (){ 
          ctrl.generarReporte2 = 0;
          ctrl.generarReporte1 = 0;

        }
        
      


    });