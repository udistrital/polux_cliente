'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:TrabajoGradoRevisarAnteproyectoCtrl
 * @description
 * # TrabajoGradoRevisarAnteproyectoCtrl
 * Controller of the poluxClienteApp.
 * Controlador que regula las acciones necesarias para que el docente revise los trabajos de grado asignados.
 * Se enseñan los trabajos de grado asignados desde la coordinación del proyecto.
 * El docente revisa el contenido de cada anteproyecto que tiene asignado.
 * El trabajo de grado cambia de estado según corresponda (viable, modificable o no viable).
 * Este procedimiento puede aplicarse a docentes que son primer o segundo revisor.
 * @requires $q
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires services/academicaService.service:academicaRequest
 * @requires services/poluxService.service:poluxRequest
 * @requires services/poluxClienteApp.service:sesionesService
 * @requires services/poluxClienteApp.service:tokenService
 * @requires uiGridConstants
 * @property {String} usuarioSesion El identificador del docente en sesión para consultar y revisar sus anteproyectos pendientes
 * @property {Boolean} cargandoAnteproyectos Indicador que maneja la carga de los anteproyectos para revisar
 * @property {String} mensajeCargandoAnteproyectos Mensaje que aparece durante la carga de anteproyectos para revisar
 * @property {Array} botonFormalizarSolicitud Establece las propiedades del botón que se muestra para cada solicitud pendiente de formalización
 * @property {Object} cuadriculaAnteproyectos Almacena y adapta la información de los anteproyectos para visualizar el contenido y poder hacer la revisión del mismo
 * @property {Array} coleccionFechasFormalizacion Almacena las fechas de inicio y cierre de periodos para la formalización de solicitudes
 * @property {Boolean} errorCargandoSolicitudesParaFormalizar Indicador que maneja la aparición de un error durante la carga de solicitudes para formalizar
 * @property {String} mensajeErrorCargandoSolicitudesParaFormalizar Mensaje que aparece en caso de error durante la carga de solicitudes para formalizar
 * @property {Boolean} periodoDeFormalizacionNoCorrespondiente Indicador que maneja la correspondencia de periodos para efectuar la formalización de solicitudes
 * @property {Array} coleccionSolicitudesParaFormalizar Almacena las solicitudes pendientes de formalización para obtener la información visible para el usuario y necesaria para la transacción
 */
angular.module('poluxClienteApp')
	.controller('TrabajoGradoRevisarAnteproyectoCtrl',
		function($q, $translate, academicaRequest, poluxRequest, sesionesRequest, token_service, uiGridConstants) {
			var ctrl = this;

			//El Id del usuario en sesión
			token_service.token.documento = "20131020002";
			ctrl.usuarioSesion = token_service.token.documento;

			//La página al inicio carga los anteproyectos asociados al docente
			ctrl.cargandoAnteproyectos = true;
			ctrl.mensajeCargandoAnteproyectos = $translate.instant("LOADING.CARGANDO_ANTEPROYECTOS");

			// Se configura el botón por el cual el usuario podrá formalizar la solicitud
			ctrl.botonFormalizarSolicitud = [{
				clase_color: "ver",
				clase_css: "fa fa-check fa-lg  faa-shake animated-hover",
				titulo: $translate.instant('BTN.VER_DETALLES'),
				operacion: 'formalizarSolicitudSeleccionada',
				estado: true
			}];

			// Se define el objeto que carga los anteproyectos que serán visualizados y revisados
			ctrl.cuadriculaAnteproyectos = {};
			// Se definen los espacios a mostrar por cada anteproyecto
			ctrl.cuadriculaAnteproyectos = [{
				name: 'idAnteproyecto',
				displayName: $translate.instant("ANTEPROYECTO"),
				width: '12%',
				sort: {
					direction: uiGridConstants.ASC,
					priority: 0
				}
			}, {
				name: 'tituloAnteproyecto',
				displayName: $translate.instant("TITULO_PROPUESTA"),
				width: '9%'
			}, {
				name: 'modalidadAnteproyecto',
				displayName: $translate.instant("MODALIDAD"),
				width: '15%'
			}, {
				name: 'estadoAnteproyecto',
				displayName: $translate.instant("ESTADO_SIN_DOSPUNTOS"),
				width: '15%'
			}, {
				name: 'papelRevisor',
				displayName: $translate.instant("ROL"),
				width: '30%',
			}, {
				name: 'opcionesRevision',
				displayName: $translate.instant("REVISAR_ANTEPROYECTO.ACCION"),
				width: '18%',
				cellTemplate: '<btn-registro ' +
					'funcion="grid.appScope.formalizarSolicitud.cargarFila(row)"' +
					'grupobotones="grid.appScope.revisarAnteproyecto.botonRevisarAnteproyecto">' +
					'</btn-registro>'
			}];

			/**
			 * @ngdoc method
			 * @name obtenerParametrosVinculacionTrabajoGrado
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarAnteproyectoCtrl
			 * @description
			 * Función que define los parámetros para consultar en la tabla vinculacion_trabajo_grado.
			 * La modalidad asociada al tipo de solicitud 13 es la que relaciona solicitud inicial con espacios académicos de posgrado.
			 * @param {undefined} undefined No requiere parámetros
			 * @returns {String} La sentencia para la consulta correspondiente
			 */
			ctrl.obtenerParametrosVinculacionTrabajoGrado = function() {
				return $.param({
					query: "SolicitudTrabajoGrado.ModalidadTipoSolicitud.Id:13," +
						"Usuario:" +
						ctrl.usuarioSesion,
					limit: 0
				});
			}

			/**
			 * @ngdoc method
			 * @name consultarAnteproyectos
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarAnteproyectoCtrl
			 * @description
			 * Función que recorre la base de datos de acuerdo al docente en sesión para traer los anteproyectos asignados para revisión.
			 * Llama a las funciones: .
			 * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los datos de la base del aplicativo.
			 * @param {undefined} undefined No requiere parámetros
			 * @returns {Promise} El mensaje en caso de no corresponder la información, o la excepción generada
			 */
			ctrl.consultarAnteproyectos = function() {
				// Se trae el diferido desde el servicio para manejar las promesas
				var deferred = $q.defer();
				// Se define una colección de procedimientos necesarios para cargar la información
				var conjuntoProcesamientoDeAnteproyectos = [];
				// Se define una colección general para los anteproyectos
				ctrl.coleccionAnteproyectos = [];
				poluxRequest.get("vinculacion_trabajo_grado", ctrl.obtenerParametrosVinculacionTrabajoGrado())
					.then(function(anteproyectosPendientes) {
						console.log(anteproyectosPendientes);
					})
					.catch(function(excepcionVinculacionTrabajoGrado) {
						// En caso de error se rechaza la petición con el mensaje correspondiente
						deferred.reject($translate.instant("ERROR.CARGANDO_USUARIO_SOLICITUD"));
					});
				// Se devuelve el diferido que maneja la promesa
				return deferred.promise;
			}

		});