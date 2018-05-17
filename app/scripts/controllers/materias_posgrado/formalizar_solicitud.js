'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:MateriasPosgradoFormalizarSolicitudCtrl
 * @description
 * # MateriasPosgradoFormalizarSolicitudCtrl
 * Controller of the poluxClienteApp.
 * Controlador que regula las acciones necesarias para que el estudiante formalice sus solicitudes de cursar espacios académicos de posgrado.
 * Se enseñan las solicitudes pendientes o resueltas con respecto a la formalización de solicitudes.
 * El estudiante formaliza según tenga solicitudes aprobadas por el posgrado pendientes.
 * Se consultan las solicitudes ya atendidas, pero a manera de consulta únicamente.
 * Para este procedimiento, la ejecución debe encontrarse en los periodos de formalización registrados, en caso contrario, se muestran estas fechas para tener en cuenta.
 * @requires $q
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires services/academicaService.service:academicaRequest
 * @requires services/poluxService.service:poluxRequest
 * @requires services/poluxClienteApp.service:sesionesService
 * @requires services/poluxClienteApp.service:tokenService
 * @requires uiGridConstants
 * @property {String} usuarioSesion El identificador del estudiante en sesión para consultar sus solicitudes pendientes
 * @property {Boolean} cargandoSolicitudesParaFormalizar Indicador que maneja la carga de las solicitudes para formalizar
 * @property {String} mensajeCargandoSolicitudesParaFormalizar Mensaje que aparece durante la carga de solicitudes para formalizar
 * @property {Array} botonFormalizarSolicitud Establece las propiedades del botón que se muestra para cada solicitud pendiente de formalización
 * @property {Object} cuadriculaSolicitudesParaFormalizar Almacena y adapta la información de las solicitudes para formalizar, de forma que se despliegue la información correspondiente al usuario sobre el contenido de cada solicitud
 * @property {Array} coleccionFechasFormalizacion Almacena las fechas de inicio y cierre de periodos para la formalización de solicitudes
 * @property {Boolean} errorCargandoSolicitudesParaFormalizar Indicador que maneja la aparición de un error durante la carga de solicitudes para formalizar
 * @property {String} mensajeErrorCargandoSolicitudesParaFormalizar Mensaje que aparece en caso de error durante la carga de solicitudes para formalizar
 * @property {Boolean} periodoDeFormalizacionNoCorrespondiente Indicador que maneja la correspondencia de periodos para efectuar la formalización de solicitudes
 * @property {Array} coleccionSolicitudesParaFormalizar Almacena las solicitudes pendientes de formalización para obtener la información visible para el usuario y necesaria para la transacción
 */
angular.module('poluxClienteApp')
	.controller('MateriasPosgradoFormalizarSolicitudCtrl',
		function($q, $translate, academicaRequest, poluxRequest, sesionesRequest, token_service, uiGridConstants) {
			var ctrl = this;

			//El Id del usuario en sesión
			token_service.token.documento = "20131020002";
			ctrl.usuarioSesion = token_service.token.documento;

			// En el inicio de la página, se están cargando las solicitudes
			ctrl.cargandoSolicitudesParaFormalizar = true;
			ctrl.mensajeCargandoSolicitudesParaFormalizar = $translate.instant("LOADING.CARGANDO_SOLICITUDES");

			// Se configura el botón por el cual el usuario podrá formalizar la solicitud
			ctrl.botonFormalizarSolicitud = [{
				clase_color: "ver",
				clase_css: "fa fa-check fa-lg  faa-shake animated-hover",
				titulo: $translate.instant('BTN.VER_DETALLES'),
				operacion: 'formalizarSolicitudSeleccionada',
				estado: true
			}];

			// Se define el objeto que carga las solicitudes para formalizar y que serán visualizadas
			ctrl.cuadriculaSolicitudesParaFormalizar = {};
			// Se definen los espacios a mostrar por cada solicitud
			ctrl.cuadriculaSolicitudesParaFormalizar.columnDefs = [{
				name: 'idSolicitud',
				displayName: $translate.instant("SOLICITUD"),
				width: '12%',
	      sort: {
	        direction: uiGridConstants.ASC,
	        priority: 0
	      }
			}, {
				name: 'estadoSolicitud',
				displayName: $translate.instant("ESTADO_SIN_DOSPUNTOS"),
				width: '9%'
			}, {
				name: 'descripcionSolicitud',
				displayName: $translate.instant("DESCRIPCION"),
				width: '15%'
			}, {
				name: 'posgrado',
				displayName: $translate.instant("POSGRADO"),
				width: '15%'
			}, {
				name: 'espaciosAcademicos',
				displayName: $translate.instant("ESPACIOS_ACADEMICOS"),
				width: '30%',
			}, {
				name: 'formalizarSolicitud',
				displayName: $translate.instant("FORMALIZAR_SOLICITUD.ACCION"),
				width: '18%',
				cellTemplate: '<btn-registro ' +
					'ng-if="row.entity.idEstadoSolicitud == 7 || row.entity.idEstadoSolicitud == 8"' +
					'funcion="grid.appScope.formalizarSolicitud.cargarFila(row)"' +
					'grupobotones="grid.appScope.formalizarSolicitud.botonFormalizarSolicitud">' +
					'</btn-registro>' +
					'<div class="ui-grid-cell-contents" ' +
					'ng-if="row.entity.idEstadoSolicitud == 5 || row.entity.idEstadoSolicitud == 6">' +
					'{{"FORMALIZAR_SOLICITUD.FORMALIZACION_NO_HABILITADA" | translate}}' +
					'</div>' +
					'<div class="ui-grid-cell-contents" ' +
					'ng-if="row.entity.idEstadoSolicitud == 9 || row.entity.idEstadoSolicitud == 10 || row.entity.idEstadoSolicitud == 11">' +
					'{{"FORMALIZAR_SOLICITUD.SOLICITUD_ATENDIDA" | translate}}' +
					'</div>'
			}];

			/**
			 * @ngdoc method
			 * @name obtenerPeriodoCorrespondiente
			 * @methodOf poluxClienteApp.controller:MateriasPosgradoFormalizarSolicitudCtrl
			 * @description
			 * Función que obtiene el periodo académico según los parámetros de consulta.
			 * Consulta el servicio de {@link services/academicaService.service:academicaRequest academicaRequest} para traer los periodos académicos registrados.
			 * @param {undefined} undefined no requiere parametros
			 * @returns {Promise} El periodo académico, o la excepción generada
			 */
			ctrl.obtenerPeriodoCorrespondiente = function() {
				// Se trae el diferido desde el servicio para manejar las promesas
				var deferred = $q.defer();
				// Se consulta hacia el periodo académico con el servicio de academicaRequest
				// El parámetro "X" consulta el siguiente periodo académico al actual
				academicaRequest.get("periodo_academico", "X")
					.then(function(periodoAcademicoConsultado) {
						// Se verifica que la respuesta está definida
						if (!angular.isUndefined(periodoAcademicoConsultado.data.periodoAcademicoCollection.periodoAcademico)) {
							// Se resuelve el periodo académico correspondiente
							deferred.resolve(periodoAcademicoConsultado.data.periodoAcademicoCollection.periodoAcademico[0]);
						} else {
							// En caso de no estar definida la respuesta, se rechaza el mensaje correspondiente
							deferred.reject($translate.instant("ERROR.SIN_PERIODO"));
						}
					})
					.catch(function(excepcionPeriodoAcademicoConsultado) {
						// En caso de error se rechaza la petición con el mensaje correspondiente
						deferred.reject($translate.instant("ERROR.CARGANDO_PERIODO"));
					});
				// Se devuelve el diferido que maneja la promesa
				return deferred.promise;
			}

			/**
			 * @ngdoc method
			 * @name obtenerParametrosSesionesDeFormalizacion
			 * @methodOf poluxClienteApp.controller:MateriasPosgradoFormalizarSolicitudCtrl
			 * @description
			 * Función que define los parámetros para consultar en la tabla relacion_sesiones.
			 * El tipo de sesión 1 trae las sesiones asociadas a la modalidad de materias de posgrado.
			 * @param {Object} periodoAcademicoCorrespondiente El periodo académico consultado
			 * @returns {String} La sentencia para la consulta correspondiente
			 */
			ctrl.obtenerParametrosSesionesDeFormalizacion = function(periodoAcademicoCorrespondiente) {
				return $.param({
					query: "SesionPadre.TipoSesion.Id:1,SesionPadre.periodo:" +
						periodoAcademicoCorrespondiente.anio +
						periodoAcademicoCorrespondiente.periodo,
					limit: 0
				});
			}

			/**
			 * @ngdoc method
			 * @name consultarSesiones
			 * @methodOf poluxClienteApp.controller:MateriasPosgradoFormalizarSolicitudCtrl
			 * @description
			 * Función que consulta las sesiones almacenadas en la base de datos.
			 * Llama a la función: obtenerParametrosSesionesDeFormalizacion.
			 * Consulta el servicio de {@link services/poluxClienteApp.service:sesionesService sesionesService} para traer las sesiones registradas según el periodo correspondiente.
			 * @param {undefined} undefined No requiere parámetros
			 * @returns {Promise} La colección de sesiones consultadas, o la excepción generada
			 */
			ctrl.consultarSesiones = function() {
				// Se trae el diferido desde el servicio para manejar las promesas
				var deferred = $q.defer();
				// Se consulta el periodo correspondiente
				ctrl.obtenerPeriodoCorrespondiente()
					.then(function(periodoAcademicoCorrespondiente) {
						// Se consultan las sesiones registradas según el periodo correspondiente
						sesionesRequest.get("relacion_sesiones", ctrl.obtenerParametrosSesionesDeFormalizacion(periodoAcademicoCorrespondiente))
							.then(function(sesionesDeFormalizacion) {
								// Se estudia que las sesiones tengan contenido
								if (sesionesDeFormalizacion.data) {
									// Se resuelve la información de las sesiones consultadas
									deferred.resolve(sesionesDeFormalizacion.data);
								} else {
									// En caso de no estar definidas las sesiones, se rechaza el mensaje correspondiente
									deferred.reject($translate.instant("ERROR.SIN_RELACION_SESIONES"));
								}
							}).catch(function(excepcionSesionesDeFormalizacion) {
								// En caso de error se rechaza la petición con el mensaje correspondiente
								deferred.reject($translate.instant("ERROR.CARGANDO_RELACION_SESIONES"));
							});
					})
					.catch(function(excepcionPeriodoAcademicoConsultado) {
						// En caso de no lograr obtener el periodo académico, se rechaza la excepción generada
						deferred.reject(excepcionPeriodoAcademicoConsultado);
					});
				// Se devuelve el diferido que maneja la promesa
				return deferred.promise;
			}

			/**
			 * @ngdoc method
			 * @name comprobarPeriodoFormalizacion
			 * @methodOf poluxClienteApp.controller:MateriasPosgradoFormalizarSolicitudCtrl
			 * @description
			 * Función que comprueba que la sesión permite la formalización de solicitudes.
			 * Llama a la función: consultarSesiones.
			 * @param {undefined} undefined No requiere parámetros
			 * @returns {Promise} La autorización para continuar con la formalización de solicitudes, o la excepción generada
			 */
			ctrl.comprobarPeriodoFormalizacion = function() {
				// Se trae el diferido desde el servicio para manejar las promesas
				var deferred = $q.defer();
				ctrl.consultarSesiones()
					.then(function(sesionesDeFormalizacion) {
						// Se define una colección que trabaje las fechas de formalización
						ctrl.coleccionFechasFormalizacion = [];
						// Se define la fecha actual de sesión
						var fechaActual = moment(new Date()).format("YYYY-MM-DD HH:mm");
						// Se recorre la colección de sesiones de formalización consultadas
						angular.forEach(sesionesDeFormalizacion, function(sesionDeFormalizacion) {
							/**
							 * Se estudia que el Id del tipo de sesión corresponda a los periodos de formalización
							 * 5 - Primera fecha de formalización
							 * 7 - Segunda fecha de formalización
							 */
							if (sesionDeFormalizacion.SesionHijo.TipoSesion.Id == 5 || sesionDeFormalizacion.SesionHijo.TipoSesion.Id == 7) {
								// Se ajusta el formato de la fecha de inicio de formalización
								var registroInicioDeFormalizacion = new Date(sesionDeFormalizacion.SesionHijo.FechaInicio);
								registroInicioDeFormalizacion.setTime(
									registroInicioDeFormalizacion.getTime() +
									registroInicioDeFormalizacion.getTimezoneOffset() * 60 * 1000
								);
								// Se establece la fecha de inicio de formalización comparable
								var fechaInicioDeFormalizacion = moment(registroInicioDeFormalizacion).format("YYYY-MM-DD HH:mm");
								// Se ajusta el formato de la fecha de inicio de formalización
								var registroFinDeFormalizacion = new Date(sesionDeFormalizacion.SesionHijo.FechaFin);
								registroFinDeFormalizacion.setTime(
									registroFinDeFormalizacion.getTime() +
									registroFinDeFormalizacion.getTimezoneOffset() * 60 * 1000
								);
								// Se establece la fecha de inicio de formalización comparable
								var fechaFinDeFormalizacion = moment(registroFinDeFormalizacion).format("YYYY-MM-DD HH:mm");
								// Se almacenan las fechas de inicio y fin de formalización para enseñarlas al usuario
								ctrl.coleccionFechasFormalizacion.push({
									descripcionFechaDeFormalizacion: sesionDeFormalizacion.SesionHijo.Descripcion,
									fechaInicioDeFormalizacion: fechaInicioDeFormalizacion,
									fechaFinDeFormalizacion: fechaFinDeFormalizacion
								});
								// Se estudia que el periodo actual corresponda a las fechas de formalización
								if (fechaInicioDeFormalizacion <= fechaActual && fechaActual <= fechaFinDeFormalizacion) {
									// Se resuelve la comprobación
									deferred.resolve(true);
								}
							}
						});
						// Si se recorre toda la colección y no se resuelve, se evita la autorización
						deferred.reject($translate.instant("ERROR.NO_PERIODO_FORMALIZACION"));
					})
					.catch(function(excepcionSesionesDeFormalizacion) {
						// En caso de no lograr obtener las sesiones de formalización, se rechaza la excepción generada
						deferred.reject(excepcionSesionesDeFormalizacion);
					});
				// Se devuelve el diferido que maneja la promesa
				return deferred.promise;
			}

			/**
			 * @ngdoc method
			 * @name autorizarFormalizacionDeSolicitudes
			 * @methodOf poluxClienteApp.controller:MateriasPosgradoFormalizarSolicitudCtrl
			 * @description
			 * Función que autoriza la formalización del lado del usuario, dependiendo de si se encuentra en el periodo correspondiente.
			 * Llama a las funciones: comprobarPeriodoFormalizacion y actualizarCuadriculaSolicitudesParaFormalizar.
			 * @param {undefined} undefined No requiere parámetros
			 * @returns {undefined} No hace retorno de resultados
			 */
			ctrl.autorizarFormalizacionDeSolicitudes = function() {
				ctrl.comprobarPeriodoFormalizacion()
					.then(function(autorizacionPeriodoFormalizacion) {
						ctrl.actualizarCuadriculaSolicitudesParaFormalizar();
					})
					.catch(function(excepcionAutorizacionPeriodoFormalizacion) {
						// Se apaga el mensaje de carga
						ctrl.cargandoSolicitudesParaFormalizar = false;
						// Se habilita el mensaje de error
						ctrl.errorCargandoSolicitudesParaFormalizar = true;
						// Se establece el mensaje con la excepción generada
						ctrl.mensajeErrorCargandoSolicitudesParaFormalizar = excepcionAutorizacionPeriodoFormalizacion;
						// Se define que el periodo no corresponde
						if (ctrl.coleccionFechasFormalizacion.length > 0) {
							ctrl.periodoDeFormalizacionNoCorrespondiente = true;
						}
					});
			}

			/**
			 * @ngdoc method
			 * @name obtenerDatosDelPosgrado
			 * @methodOf poluxClienteApp.controller:MateriasPosgradoFormalizarSolicitudCtrl
			 * @description
			 * Función que de acuerdo al detalle de la solicitud, obtiene los datos del posgrado.
			 * @param {Object} detalleDeSolicitud El detalle de la solicitud con el formato de almacenado en la base de datos
			 * @returns {Object} Los datos del posgrado clasificados en una variable
			 */
			ctrl.obtenerDatosDelPosgrado = function(detalleDeSolicitud) {
				return JSON.parse(detalleDeSolicitud.split("-")[1]);
			}

			/**
			 * @ngdoc method
			 * @name obtenerEspaciosAcademicos
			 * @methodOf poluxClienteApp.controller:MateriasPosgradoFormalizarSolicitudCtrl
			 * @description
			 * Función que obtiene la información de los espacios académicos de acuerdo al detalle de la solicitud.
			 * @param {Array} detalleDeSolicitud La colección de registros en el formato que se almacenan en la base de datos
			 * @returns {Array} La colección de espacios académicos
			 */
			ctrl.obtenerEspaciosAcademicos = function(detalleDeSolicitud) {
				// Se prepara una colección que contendrá los espacios académicos
				var espaciosAcademicos = [];
				// Se define una variable que interprete el formato del detalle de la solicitud recibida
				// de modo que se obtenga la información de los espacios académicos (estos inician desde el índice 2)
				var detallePosgrado = detalleDeSolicitud.split("-").slice(2);
				// Se recorre la información de los espacios académicos almacenados
				angular.forEach(detallePosgrado, function(espacioAcademico) {
					// Como el formato de almacenado guarda en cada posición el objeto de espacio académico,
					// se pasa a formato JSON para obtener su contenido
					var objetoEspacioAcademico = JSON.parse(espacioAcademico);
					// Se ajusta la información para conformar el objeto de espacio académico
					var informacionEspacioAcademico = {
						"id": objetoEspacioAcademico.Id,
						"codigo": objetoEspacioAcademico.CodigoAsignatura,
						"nombre": objetoEspacioAcademico.Nombre,
						"creditos": objetoEspacioAcademico.Creditos
					};
					// Se registra el espacio académico en la colección a modo de objeto
					espaciosAcademicos.push(informacionEspacioAcademico);
				});
				return espaciosAcademicos;
			}

			/**
			 * @ngdoc method
			 * @name obtenerEspaciosAcademicosPorNombre
			 * @methodOf poluxClienteApp.controller:MateriasPosgradoFormalizarSolicitudCtrl
			 * @description
			 * Función que obtiene los espacios académicos por su nombre.
			 * @param {Array} coleccionEspaciosAcademicos La colección de espacios académicos como objetos
			 * @returns {String} El texto compuesto de espacios académicos por su nombre
			 */
			ctrl.obtenerEspaciosAcademicosPorNombre = function(coleccionEspaciosAcademicos) {
				// Se define una variable que cargue el contenido
				var espaciosAcademicosPorNombre = "";
				// Se recorre la colección de objetos que son espacios académicos
				angular.forEach(coleccionEspaciosAcademicos, function(espacioAcademico) {
					// Se añade cada nombre a la cadena unido por una coma (,)
					espaciosAcademicosPorNombre += espacioAcademico.nombre + ", ";
				});
				// Se elimina el espacio y la coma (, ) del final de la cadena
				espaciosAcademicosPorNombre = espaciosAcademicosPorNombre.substring(0, espaciosAcademicosPorNombre.length - 2);
				// Se retorna la cadena para mostrar en la cuadrícula
				return espaciosAcademicosPorNombre;
			}

			/**
			 * @ngdoc method
			 * @name obtenerParametrosSolicitudRespondida
			 * @methodOf poluxClienteApp.controller:MateriasPosgradoFormalizarSolicitudCtrl
			 * @description
			 * Función que define los parámetros para consultar en la tabla respuesta_solicitud.
			 * El estado de la solicitud que se encuentre en los estados 5, 6, 7, 8, 9, 10 u 11 corresponde a:
			 * 5 - Opcionada para segunda convocatoria;
			 * 6 - Rechazada por cupos insuficientes;
			 * 7 - Aprobada exenta de pago;
			 * 8 - Aprobada no exenta de pago;
			 * 9 - Formalizada exenta de pago;
			 * 10 - Formalizada no exenta de pago;
			 * 11 - No formalizada.
			 * @param {Number} idSolicitudTrabajoGrado El identificador de la solicitud de trabajo de grado asociada al usuario
			 * @returns {String} La sentencia para la consulta correspondiente
			 */
			ctrl.obtenerParametrosSolicitudRespondida = function(idSolicitudTrabajoGrado) {
				return $.param({
					query: "Activo:True," +
						"EstadoSolicitud.Id.in:5|6|7|8|9|10|11," +
						"SolicitudTrabajoGrado.Id:" +
						idSolicitudTrabajoGrado,
					limit: 1
				});
			}

			/**
			 * @ngdoc method
			 * @name consultarRespuestaSolicitud
			 * @methodOf poluxClienteApp.controller:MateriasPosgradoFormalizarSolicitudCtrl
			 * @description
			 * Función que según la información del estudiante solicitante, carga la información correspondiente a la respuesta de la misma.
			 * Llama a la función: obtenerParametrosSolicitudRespondida.
			 * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer las respuestas de las solicitudes.
			 * @param {Object} usuarioAsociado El usuario asociado a la solicitud para obtener el identificador y cargar la información correspondiente a la respuesta
			 * @returns {Promise} El mensaje en caso de no corresponder la información, o la excepción generada
			 */
			ctrl.consultarRespuestaSolicitud = function(usuarioAsociado) {
				// Se trae el diferido desde el servicio para manejar las promesas
				var deferred = $q.defer();
				// Se traen los datos de la respuesta respecto a la solicitud asociada, por medio del Id.
				poluxRequest.get("respuesta_solicitud", ctrl.obtenerParametrosSolicitudRespondida(usuarioAsociado.SolicitudTrabajoGrado.Id))
					.then(function(respuestaDeSolicitud) {
						// Se comprueba que se trajeron datos no vacíos
						if (respuestaDeSolicitud.data) {
							// Se elimina la información redundante
							delete respuestaDeSolicitud.data[0].SolicitudTrabajoGrado;
							// Se adquieren los datos de la respuesta de la solicitud dentro de la misma solicitud
							usuarioAsociado.respuestaDeSolicitud = respuestaDeSolicitud.data[0];
						}
						// Se resuelve el mensaje correspondiente
						deferred.resolve($translate.instant("ERROR.SIN_RESPUESTA_SOLICITUD"));
					})
					.catch(function(excepcionRespuestaSolicitud) {
						// En caso de error se rechaza la petición con el mensaje correspondiente
						deferred.reject($translate.instant("ERROR.CARGANDO_RESPUESTA_SOLICITUD"));
					});
				// Se devuelve el diferido que maneja la promesa
				return deferred.promise;
			}

			/**
			 * @ngdoc method
			 * @name obtenerParametrosDetalleDeSolicitud
			 * @methodOf poluxClienteApp.controller:MateriasPosgradoFormalizarSolicitudCtrl
			 * @description
			 * Función que define los parámetros para consultar en la tabla detalle_solicitud.
			 * El detalle tipo solicitud 37 relaciona el detalle y la modalidad de espacios académicos de posgrado.
			 * @param {Number} idSolicitudTrabajoGrado El identificador de la solicitud de trabajo de grado asociada al usuario
			 * @returns {String} La sentencia para la consulta correspondiente
			 */
			ctrl.obtenerParametrosDetalleDeSolicitud = function(idSolicitudTrabajoGrado) {
				return $.param({
					query: "DetalleTipoSolicitud.Id:37," +
						"SolicitudTrabajoGrado.Id:" +
						idSolicitudTrabajoGrado,
					limit: 1
				});
			}

			/**
			 * @ngdoc method
			 * @name consultarDetalleSolicitud
			 * @methodOf poluxClienteApp.controller:MateriasPosgradoFormalizarSolicitudCtrl
			 * @description
			 * Función que según la solicitud, carga la información correspondiente al detalle de la misma.
			 * Llama a la función: obtenerParametrosDetalleDeSolicitud.
			 * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los detalles de las solicitudes.
			 * @param {Object} usuarioAsociado El usuario asociado a la solicitud para obtener el identificador y cargar la información correspondiente al detalle
			 * @returns {Promise} El mensaje en caso de no corresponder la información, o la excepción generada
			 */
			ctrl.consultarDetalleSolicitud = function(usuarioAsociado) {
				// Se trae el diferido desde el servicio para manejar las promesas
				var deferred = $q.defer();
				// Se traen los datos del detalle respecto a la solicitud asociada, por medio del Id.
				poluxRequest.get("detalle_solicitud", ctrl.obtenerParametrosDetalleDeSolicitud(usuarioAsociado.SolicitudTrabajoGrado.Id))
					.then(function(detalleDeSolicitud) {
						// Se comprueba que se trajeron datos no vacíos
						if (detalleDeSolicitud.data) {
							// Se adquieren los datos del detalle de la solicitud dentro de la misma solicitud
							usuarioAsociado.detalleDeSolicitud = detalleDeSolicitud.data[0].Descripcion;
						}
						// Se resuelve el mensaje correspondiente
						deferred.resolve($translate.instant("ERROR.SIN_DETALLE_SOLICITUD"));
					})
					.catch(function(excepcionDetalleDeSolicitud) {
						// En caso de error se rechaza la petición con el mensaje correspondiente
						deferred.reject($translate.instant("ERROR.CARGANDO_DETALLE_SOLICITUD"));
					});
				// Se devuelve el diferido que maneja la promesa
				return deferred.promise;
			}

			/**
			 * @ngdoc method
			 * @name obtenerParametrosUsuariosConSolicitudes
			 * @methodOf poluxClienteApp.controller:MateriasPosgradoFormalizarSolicitudCtrl
			 * @description
			 * Función que define los parámetros para consultar en la tabla usuario_solicitud.
			 * La modalidad asociada al tipo de solicitud 13 es la que relaciona solicitud inicial con espacios académicos de posgrado.
			 * @param {undefined} undefined No requiere parámetros
			 * @returns {String} La sentencia para la consulta correspondiente
			 */
			ctrl.obtenerParametrosUsuariosConSolicitudes = function() {
				return $.param({
					query: "SolicitudTrabajoGrado.ModalidadTipoSolicitud.Id:13," +
						"Usuario:" +
						ctrl.usuarioSesion,
					limit: 0
				});
			}

			/**
			 * @ngdoc method
			 * @name consultarUsuariosConSolicitudes
			 * @methodOf poluxClienteApp.controller:MateriasPosgradoFormalizarSolicitudCtrl
			 * @description
			 * Función que recorre la base de datos de acuerdo al usuario en sesión y sus solicitudes en espera de ser formalizadas.
			 * Llama a las funciones: obtenerParametrosUsuariosConSolicitudes, consultarRespuestaSolicitud y consultarDetalleSolicitud.
			 * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los detalles de las solicitudes.
			 * @param {undefined} undefined No requiere parámetros
			 * @returns {Promise} El mensaje en caso de no corresponder la información, o la excepción generada
			 */
			ctrl.consultarUsuariosConSolicitudes = function() {
				// Se trae el diferido desde el servicio para manejar las promesas
				var deferred = $q.defer();
				// Se establece un conjunto de procesamiento de solicitudes que reúne los procesos que deben cargarse antes de ofrecer funcionalidades
				var conjuntoProcesamientoDeSolicitudes = [];
				// Se establece una colección de solicitudes asociadas al usuario y que traen la información necesaria para formalizar
				ctrl.coleccionSolicitudesParaFormalizar = [];
				// Se traen los usuarios con solicitudes
				poluxRequest.get("usuario_solicitud", ctrl.obtenerParametrosUsuariosConSolicitudes())
					.then(function(usuariosConSolicitudes) {
						// Se comprueba que existen registros
						if (usuariosConSolicitudes.data) {
							// Se recorre la colección de usuarios con solicitudes
							angular.forEach(usuariosConSolicitudes.data, function(usuarioConSolicitud) {
								// Se agrega el proceso de consulta hacia la respuesta de la solicitud
								conjuntoProcesamientoDeSolicitudes.push(ctrl.consultarRespuestaSolicitud(usuarioConSolicitud));
								// Se agrega el proceso de consulta hacia el detalle de la solicitud
								conjuntoProcesamientoDeSolicitudes.push(ctrl.consultarDetalleSolicitud(usuarioConSolicitud));
							});
							// Se garantiza que se cumplan todos los procesos agregados
							$q.all(conjuntoProcesamientoDeSolicitudes)
								.then(function(resultadoDelProcesamiento) {
									// Se realiza el filtrado de las solicitudes que correspondan a la operación
									angular.forEach(usuariosConSolicitudes.data, function(usuarioConSolicitud) {
										if (usuarioConSolicitud.respuestaDeSolicitud &&
											usuarioConSolicitud.detalleDeSolicitud) {
											ctrl.coleccionSolicitudesParaFormalizar.push(usuarioConSolicitud);
										}
									});
									// Se resuelve el resultado del procesamiento
									deferred.resolve(resultadoDelProcesamiento);
								})
								.catch(function(excepcionDuranteProcesamiento) {
									// Se rechaza la carga con la excepción generada
									deferred.reject(excepcionDuranteProcesamiento);
								});
						} else {
							// En caso de no estar definida la información, se rechaza el mensaje correspondiente
							deferred.reject($translate.instant("ERROR.SIN_USUARIO_SOLICITUD"));
						}
					})
					.catch(function(excepcionUsuariosConSolicitudes) {
						// En caso de error se rechaza la petición con el mensaje correspondiente
						deferred.reject($translate.instant("ERROR.CARGANDO_USUARIO_SOLICITUD"));
					});
				// Se devuelve el diferido que maneja la promesa
				return deferred.promise;
			}

			/**
			 * @ngdoc method
			 * @name mostrarSolicitudesParaFormalizar
			 * @methodOf poluxClienteApp.controller:MateriasPosgradoFormalizarSolicitudCtrl
			 * @description
			 * Función que carga las solicitudes aprobadas a la cuadrícula con la información correspondiente.
			 * Llama a las funciones: obtenerDatosDelPosgrado, obtenerEspaciosAcademicos y obtenerEspaciosAcademicosPorNombre.
			 * @param {Array} solicitudesParaFormalizarRegistradas Las solicitudes consultadas que están asociadas al estudiante en sesión
			 * @returns {undefined} No hace retorno de resultados
			 */
			ctrl.mostrarSolicitudesParaFormalizar = function(solicitudesParaFormalizarRegistradas) {
				// Se recorren las solicitudes aprobadas para obtener los datos correspondientes
				angular.forEach(solicitudesParaFormalizarRegistradas, function(solicitudParaFormalizar) {
					// Se asignan los campos reconocidos por la cuadrícula
					solicitudParaFormalizar.idSolicitud = solicitudParaFormalizar.SolicitudTrabajoGrado.Id;
					solicitudParaFormalizar.estadoSolicitud = solicitudParaFormalizar.respuestaDeSolicitud.EstadoSolicitud.Nombre;
					solicitudParaFormalizar.descripcionSolicitud = solicitudParaFormalizar.respuestaDeSolicitud.EstadoSolicitud.Descripcion;
					solicitudParaFormalizar.posgrado = ctrl.obtenerDatosDelPosgrado(solicitudParaFormalizar.detalleDeSolicitud).Nombre;
					solicitudParaFormalizar.espaciosAcademicosSolicitados = ctrl.obtenerEspaciosAcademicos(solicitudParaFormalizar.detalleDeSolicitud);
					solicitudParaFormalizar.espaciosAcademicos = ctrl.obtenerEspaciosAcademicosPorNombre(ctrl.obtenerEspaciosAcademicos(solicitudParaFormalizar.detalleDeSolicitud));
					solicitudParaFormalizar.idEstadoSolicitud = solicitudParaFormalizar.respuestaDeSolicitud.EstadoSolicitud.Id;
				});
				// Se cargan los datos visibles a la cuadrícula
				ctrl.cuadriculaSolicitudesParaFormalizar.data = solicitudesParaFormalizarRegistradas;
			}

			/**
			 * @ngdoc method
			 * @name actualizarCuadriculaSolicitudesParaFormalizar
			 * @methodOf poluxClienteApp.controller:MateriasPosgradoFormalizarSolicitudCtrl
			 * @description
			 * Función que actualiza la carga de las solicitudes para formalizar.
			 * Llama a las funciones: consultarUsuariosConSolicitudes y mostrarSolicitudesParaFormalizar.
			 * @param {undefined} undefined No requiere parámetros
			 * @returns {undefined} No hace retorno de resultados
			 */
			ctrl.actualizarCuadriculaSolicitudesParaFormalizar = function() {
				// Se recargan las solicitudes visibles
				ctrl.cuadriculaSolicitudesParaFormalizar.data = [];
				// Se establece que inicia la carga de las solicitudes aprobadas
				ctrl.errorCargandoSolicitudesParaFormalizar = false;
				ctrl.cargandoSolicitudesParaFormalizar = true;
				// Se consultan las solicitudes respondidas
				ctrl.consultarUsuariosConSolicitudes()
					.then(function(resultadoConsultaUsuariosConSolicitudes) {
						// Se apaga el mensaje de carga
						ctrl.cargandoSolicitudesParaFormalizar = false;
						if (ctrl.coleccionSolicitudesParaFormalizar.length > 0) {
							// Se carga la información a la cuadrícula
							ctrl.mostrarSolicitudesParaFormalizar(ctrl.coleccionSolicitudesParaFormalizar);
						} else {
							// Se habilita el mensaje de error
							ctrl.errorCargandoSolicitudesParaFormalizar = true;
							// Se define el mensaje de carga de solicitudes
							ctrl.mensajeErrorCargandoSolicitudesParaFormalizar = resultadoConsultaUsuariosConSolicitudes[0];
						}
					})
					.catch(function(excepcionConsultaUsuariosConSolicitudes) {
						// Se apaga el mensaje de carga
						ctrl.cargandoSolicitudesParaFormalizar = false;
						// Se habilita el mensaje de error
						ctrl.errorCargandoSolicitudesParaFormalizar = true;
						// Se define el mensaje de carga de solicitudes
						ctrl.mensajeErrorCargandoSolicitudesParaFormalizar = excepcionConsultaUsuariosConSolicitudes;
					});
			}

			/**
			 * Se lanza la función que, una vez autorizada la formalización por periodo, actualiza el contenido de la cuadrícula
			 */
			ctrl.autorizarFormalizacionDeSolicitudes();

			/**
			 * @ngdoc method
			 * @name cargarFila
			 * @methodOf poluxClienteApp.controller:MateriasPosgradoFormalizarSolicitudCtrl
			 * @description
			 * Función que carga la fila asociada según la selección del usuario.
			 * Llama a la función: formalizarSolicitudSeleccionada.
			 * @param {Object} filaAsociada La solicitud que el usuario seleccionó
			 * @returns {undefined} No hace retorno de resultados
			 */
			ctrl.cargarFila = function(filaAsociada) {
				ctrl.formalizarSolicitudSeleccionada(filaAsociada.entity);
			}

			/**
			 * @ngdoc method
			 * @name formalizarSolicitudSeleccionada
			 * @methodOf poluxClienteApp.controller:MateriasPosgradoFormalizarSolicitudCtrl
			 * @description
			 * Función que formaliza la solicitud a petición del usuario.
			 * Llama a las funciones: registrarFormalizacion y autorizarFormalizacionDeSolicitudes.
			 * @param {Object} solicitudSeleccionada La solicitud que el usuario desea formalizar
			 * @returns {undefined} No hace retorno de resultados
			 */
			ctrl.formalizarSolicitudSeleccionada = function(solicitudSeleccionada) {
				swal({
						title: $translate.instant("FORMALIZAR_SOLICITUD.CONFIRMACION"),
						text: $translate.instant("FORMALIZAR_SOLICITUD.MENSAJE_CONFIRMACION", {
							// Se cargan datos de la solicitud para que el usuario pueda verificar antes de confirmar
							idSolicitud: solicitudSeleccionada.idSolicitud,
							nombreEstado: solicitudSeleccionada.estadoSolicitud,
							nombrePosgrado: solicitudSeleccionada.posgrado
						}),
						type: "info",
						confirmButtonText: $translate.instant("ACEPTAR"),
						cancelButtonText: $translate.instant("CANCELAR"),
						showCancelButton: true
					})
					.then(function(confirmacionDelUsuario) {
						// Se valida que el usuario haya confirmado la formalización
						if (confirmacionDelUsuario.value) {
							// Se detiene la visualización de solicitudes mientras se formaliza
							ctrl.cuadriculaSolicitudesParaFormalizar.data = [];
							// Se inicia la carga del formulario mientras se formaliza
							ctrl.cargandoSolicitudesParaFormalizar = true;
							// Se lanza la transacción
							ctrl.registrarFormalizacion(solicitudSeleccionada)
								.then(function(respuestaFormalizarSolicitud) {
									// Se detiene la carga
									ctrl.cargandoSolicitudesParaFormalizar = false;
									// Se verifica que la respuesta es exitosa
									if (respuestaFormalizarSolicitud.data[0] === "Success") {
										// Se despliega el mensaje que confirma el registro de la formalización
										swal(
											$translate.instant("FORMALIZAR_SOLICITUD.AVISO"),
											$translate.instant("FORMALIZAR_SOLICITUD.SOLICITUD_FORMALIZADA"),
											'success'
										);
									} else {
										// Se despliega el mensaje que muestra el error traído desde la transacción
										swal(
											$translate.instant("FORMALIZAR_SOLICITUD.AVISO"),
											$translate.instant(response.data[1]),
											'warning'
										);
									}
									// Se actualiza la información de la cuadrícula
									ctrl.autorizarFormalizacionDeSolicitudes();
								})
								.catch(function(excepcionFormalizarSolicitud) {
									// Se detiene la carga
									ctrl.cargandoSolicitudesParaFormalizar = false;
									// Se despliega el mensaje de error durante la transacción
									swal(
										$translate.instant("FORMALIZAR_SOLICITUD.AVISO"),
										$translate.instant("ERROR.FORMALIZAR_SOLICITUD"),
										'warning'
									);
									// Se actualiza la información de la cuadrícula
									ctrl.autorizarFormalizacionDeSolicitudes();
								});
						}
					});
			}

			/**
			 * @ngdoc method
			 * @name registrarFormalizacion
			 * @methodOf poluxClienteApp.controller:MateriasPosgradoFormalizarSolicitudCtrl
			 * @description
			 * Función que realiza la transacción de registro de la formalización.
			 * Efectúa el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para registrar los resultados de la formalización en la base de datos.
			 * @param {Object} solicitudSeleccionada La solicitud que el usuario desea formalizar
			 * @returns {Promise} El resultado de efectuar la transacción
			 */
			ctrl.registrarFormalizacion = function(solicitudSeleccionada) {
				// Se trae el diferido desde el servicio para manejar las promesas
				var deferred = $q.defer();
				// Se prepara una colección que cargue las solicitudes previas
				var coleccionSolicitudesPrevias = [];
				// Se prepara una colección que cargue las solicitudes formalizadas
				var coleccionSolicitudesFormalizadas = [];
				// Se recorre la colección de solicitudes para formalizar
				angular.forEach(ctrl.coleccionSolicitudesParaFormalizar, function(solicitudParaFormalizar) {
					// Se establece la respuesta de la solicitud previa con los mismos campos, pero con diferente valor de activo
					var respuestaSolicitudPrevia = {
						Activo: false,
						EnteResponsable: solicitudParaFormalizar.respuestaDeSolicitud.EnteResponsable,
						Fecha: solicitudParaFormalizar.respuestaDeSolicitud.Fecha,
						EstadoSolicitud: {
							Id: solicitudParaFormalizar.respuestaDeSolicitud.EstadoSolicitud.Id
						},
						Id: solicitudParaFormalizar.respuestaDeSolicitud.Id,
						Justificacion: solicitudParaFormalizar.respuestaDeSolicitud.Justificacion,
						SolicitudTrabajoGrado: {
							Id: solicitudParaFormalizar.SolicitudTrabajoGrado.Id
						},
						Usuario: solicitudParaFormalizar.respuestaDeSolicitud.Usuario
					};
					// Se utiliza la respuesta de la solicitud que fue cargada a la colección de solicitudes para formalizar,
					// Se actualizan sus campos y se envían para registrarse
					var respuestaSolicitudFormalizada = {
						Activo: true,
						EnteResponsable: solicitudParaFormalizar.respuestaDeSolicitud.EnteResponsable,
						Fecha: new Date(),
						SolicitudTrabajoGrado: {
							Id: solicitudParaFormalizar.SolicitudTrabajoGrado.Id
						},
						Usuario: solicitudParaFormalizar.respuestaDeSolicitud.Usuario
					};
					// Se verifica si la solicitud es la seleccionada
					if (solicitudParaFormalizar.Id == solicitudSeleccionada.idSolicitud) {
						// Se estudia el estado de la solicitud
						// Se verifica si la solicitud está aprobada exenta de pago (7)
						if (solicitudParaFormalizar.respuestaDeSolicitud.EstadoSolicitud.Id == 7) {
							// Entonces su nuevo estado será formalizada exenta de pago (9)
							respuestaSolicitudFormalizada.Justificacion = "Su solicitud fue formalizada con exención de pago";
							respuestaSolicitudFormalizada.EstadoSolicitud = {
								Id: 9
							}
							// En caso contrario, la solicitud está aprobada no exenta de pago (8)
						} else {
							// Entonces su nuevo estado será formalizada no exenta de pago (10)
							respuestaSolicitudFormalizada.Justificacion = "Su solicitud fue formalizada con condiciones económicas";
							respuestaSolicitudFormalizada.EstadoSolicitud = {
								Id: 10
							}
						}
					} else {
						// En caso contrario, queda sin formalizar, pues el estudiante ya se ha decidido por otra
						respuestaSolicitudFormalizada.Justificacion = "Su solicitud ha quedado sin formalizar debido a que ya formalizó una solicitud";
						respuestaSolicitudFormalizada.EstadoSolicitud = {
							Id: 11
						}
					}
					// Se añade la respuesta previa a la colección
					coleccionSolicitudesPrevias.push(respuestaSolicitudPrevia)
					// Se añade la respuesta formalizada a la colección
					coleccionSolicitudesFormalizadas.push(respuestaSolicitudFormalizada);
				});
				// Se define el objeto para enviar como información para actualizar
				var informacionParaActualizar = {
					"RespuestasNuevas": coleccionSolicitudesFormalizadas,
					"RespuestasAntiguas": coleccionSolicitudesPrevias
				};
				// Se realiza la petición post hacia la transacción con la información para formalizar la solicitud
				poluxRequest.post("tr_registrar_respuestas_solicitudes", informacionParaActualizar)
					.then(function(respuestaFormalizarSolicitud) {
						// Se resuelve la respuesta de realizar la formalización de la solicitud
						deferred.resolve(respuestaFormalizarSolicitud);
					})
					.catch(function(excepcionFormalizarSolicitud) {
						// Se rechaza la excepción que ocurrió durante la transacción
						deferred.reject(excepcionFormalizarSolicitud);
					});
				// Se devuelve el diferido que maneja la promesa
				return deferred.promise;
			}

		});