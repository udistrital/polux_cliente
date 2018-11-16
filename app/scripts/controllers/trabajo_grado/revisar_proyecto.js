'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:TrabajoGradoRevisarProyectoCtrl
 * @description
 * # TrabajoGradoRevisarProyectoCtrl
 * Controller of the poluxClienteApp.
 * Controlador que regula las acciones necesarias para que el docente revise los trabajos de grado asignados.
 * Se enseñan los trabajos de grado asignados desde la coordinación del proyecto.
 * El docente revisa el contenido de cada Proyecto que tiene asignado.
 * El trabajo de grado cambia de estado según corresponda (viable, modificable o no viable).
 * Este procedimiento puede aplicarse a docentes que son primer o segundo revisor.
 * @requires $q
 * @requires $sce
 * @requires $window
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires services/academicaService.service:academicaRequest
 * @requires services/poluxClienteApp.service:nuxeoService
 * @requires services/poluxService.service:poluxRequest
 * @requires services/poluxClienteApp.service:sesionesService
 * @requires services/poluxClienteApp.service:tokenService
 * @requires uiGridConstants
 * @property {String} usuarioSesion El identificador del docente en sesión para consultar y revisar sus Proyectos pendientes
 * @property {Boolean} cargandoProyectos Indicador que maneja la carga de los Proyectos para revisar
 * @property {String} mensajeCargandoProyectos Mensaje que aparece durante la carga de Proyectos para revisar
 * @property {String} mensajeCargandoDatosEstudiantiles Mensjae que aparece durante la carga de los datos de los estudiantes asociados al Proyecto seleccionado
 * @property {Array} botonVerDocumento Establece las propiedades del botón que se muestra para ver el documento asociado a cada Proyecto
 * @property {Array} botonRevisarProyecto Establece las propiedades del botón que se muestra para dar respuesta a la revisión del Proyecto asignado
 * @property {Object} cuadriculaProyectos Almacena y adapta la información de los Proyectos para visualizar el contenido y poder hacer la revisión del mismo
 * @property {Object} cuadriculaEstudiantesDelProyecto Almacena y adapta la información de los datos estudiantiles sobre los autores del Proyecto
 * @property {Array} coleccionProyectos Almacena los Proyectos a medida que se consultan y se cargan con la información correspondiente
 * @property {Boolean} errorCargandoProyectos Indicador que maneja la aparición de un error durante la carga de los Proyectos pendientes
 * @property {String} mensajeErrorCargandoProyectos Mensaje que aparece en caso de error durante la carga de los Proyectos pendientes
 * @property {Object} ProyectoSeleccionado Objeto que carga el Proyecto que el usuario selecciona desde la vista
 * @property {Array} coleccionRespuestasProyecto Almacena las posibles respuestas para el cambio de estado del trabajo de grado de acuerdo a la revisión del Proyecto
 * @property {Boolean} cargandoDatosEstudiantiles Indicador que maneja carga de los datos de los estudiantes asociados al Proyecto seleccionado
 * @property {Boolean} errorCargandoDatosEstudiantiles Indicador que maneja la aparición de un error durante la carga de los datos de los estudiantes
 * @property {String} mensajeErrorCargandoDatosEstudiantiles Mensaje que aparece en caso de error durante la carga de los datos de los estudiantes
 * @property {Object} respuestaSeleccionada Selección del docente como respuesta del estado que define para el Proyecto (viable, modificable, no viable)
 * @property {String} respuestaExplicada Contenido de la justificación que brinda el docente para la decisión que tomó sobre la respuesta del Proyecto
 * @property {Boolean} respuestaHabilitada Indicador que maneja la habilitación de la justificación de la respuesta, una vez se seleeciona una opción para el Proyecto
 * @property {Object} document Almacena la respuesta del documento desde la petición a nuxeo. 
 * @property {Object} blob Almacena la respuesta sobre el blob del documento para visualizarlo
 */
angular.module('poluxClienteApp')
	.controller('TrabajoGradoRevisarProyectoCtrl',
		function($q, $sce, $translate, $window, academicaRequest, nuxeo, poluxRequest, sesionesRequest, token_service, uiGridConstants, $location) {
			var ctrl = this;

			//El Id del usuario en sesión
			//token_service.token.documento = "80093200";
			//ctrl.usuarioSesion = token_service.token.documento;

			ctrl.usuarioSesion = token_service.getAppPayload().appUserDocument;

			ctrl.cargandoProyectos = true;
			ctrl.mensajeCargandoProyectos = $translate.instant("LOADING.CARGANDO_PROYECTOS");
			ctrl.mensajeCargandoDatosEstudiantiles = $translate.instant("LOADING.CARGANDO_INFO_ACADEMICA");

			ctrl.botonVerDocumento = [{
				clase_color: "ver",
				clase_css: "fa fa-eye fa-lg  faa-shake animated-hover",
				titulo: $translate.instant('VER_DOCUMENTO'),
				estado: true
			}];

			ctrl.botonRevisarProyecto = [{
				clase_color: "ver",
				clase_css: "fa fa-check-square-o fa-lg  faa-shake animated-hover",
				titulo: $translate.instant('BTN.REVISAR_PROYECTO'),
				estado: true
			}];

			ctrl.cuadriculaProyectos = {};

			ctrl.cuadriculaProyectos.columnDefs = [{
				name: 'TrabajoGrado.Id',
				displayName: $translate.instant("NUMERO"),
				width: '6%',
				sort: {
					direction: uiGridConstants.ASC,
					priority: 0
				}
			}, {
				name: 'TrabajoGrado.Titulo',
				displayName: $translate.instant("TITULO_PROPUESTA"),
				width: '20%'
			}, {
				name: 'TrabajoGrado.Modalidad.Nombre',
				displayName: $translate.instant("MODALIDAD"),
				width: '13%'
			}, {
				name: 'TrabajoGrado.EstadoTrabajoGrado.Nombre',
				displayName: $translate.instant("ESTADO_SIN_DOSPUNTOS"),
				width: '13%'
			}, {
				name: 'RolTrabajoGrado.Nombre',
				displayName: $translate.instant("ROL"),
				width: '13%',
			}, {
				name: 'autores',
				displayName: $translate.instant("ESTUDIANTE_ESTUDIANTES"),
				width: '20%',
			}, {
				name: 'opcionesRevision',
				displayName: $translate.instant("REVISAR_PROYECTO.ACCION"),
				width: '15%',
				cellTemplate: '<btn-registro ' +
					//'ng-if=""' +
					'funcion="grid.appScope.revisarProyecto.verDocumentoProyecto(row)"' +
					'grupobotones="grid.appScope.revisarProyecto.botonVerDocumento">' +
					'</btn-registro>' +
					'<btn-registro ' +
					//'ng-if=""' +
					'funcion="grid.appScope.revisarProyecto.revisarProyectoSeleccionado(row)"' +
					'grupobotones="grid.appScope.revisarProyecto.botonRevisarProyecto">' +
					'</btn-registro>'
				//+ '<div class="ui-grid-cell-contents" ' +
				//'ng-if="row.entity.TrabajoGrado.EstadoTrabajoGrado.Id != 4 && row.entity.TrabajoGrado.EstadoTrabajoGrado.Id != 9">' +
				//'{{"REVISAR_Proyecto.REGISTRO_NO_HABILITADO" | translate}}' +
				//'</div>'
			}];

			ctrl.cuadriculaEstudiantesDelProyecto = {};

			ctrl.cuadriculaEstudiantesDelProyecto.columnDefs = [{
				name: 'codigo',
				displayName: $translate.instant("CODIGO"),
				width: '25%',
			}, {
				name: 'nombre',
				displayName: $translate.instant("NOMBRE"),
				width: '75%'
			}];


			/**
			 * @ngdoc method
			 * @name consultarPeriodoAcademicoPrevio
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarProyectoCtrl
			 * @description
			 * Función que obtiene el periodo académico previo dado el parámetro "P" de consulta.
			 * Consulta el servicio de {@link services/academicaService.service:academicaRequest academicaRequest} para traer el periodo académico previo al actual.
			 * @param {undefined} undefined No requiere parámetros
			 * @returns {Promise} El periodo académico previo, o la excepción generada
			 */
			ctrl.consultarPeriodoAcademicoPrevio = function() {
				var deferred = $q.defer();
				academicaRequest.get("periodo_academico", "P")
					.then(function(periodoAcademicoPrevio) {
						if (!angular.isUndefined(periodoAcademicoPrevio.data.periodoAcademicoCollection.periodoAcademico)) {
							deferred.resolve(periodoAcademicoPrevio.data.periodoAcademicoCollection.periodoAcademico[0]);
						} else {
							deferred.reject($translate.instant("ERROR.SIN_PERIODO"));
						}
					})
					.catch(function(excepcionPeriodoAcademico) {
						deferred.reject($translate.instant("ERROR.CARGANDO_PERIODO"));
					});
				return deferred.promise;
			}

			/**
			 * @ngdoc method
			 * @name consultarInformacionAcademicaDelEstudiante
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarProyectoCtrl
			 * @description
			 * Función que según el estudiante asociado, carga la información académica correspondiente.
			 * Llama a la función: consultarPeriodoAcademicoPrevio.
			 * Consulta el servicio de {@link services/academicaService.service:academicaRequest academicaRequest} para traer la información académica registrada.
			 * @param {Object} estudianteAsociado El estudiante al que se le cargará la información académica
			 * @returns {Promise} El mensaje en caso de no corresponder la información, o la excepción generada
			 */
			ctrl.consultarInformacionAcademicaDelEstudiante = function(estudianteAsociado) {
				var deferred = $q.defer();
				ctrl.consultarPeriodoAcademicoPrevio()
					.then(function(periodoAcademicoPrevio) {
						academicaRequest.get("datos_estudiante", [estudianteAsociado.Estudiante, periodoAcademicoPrevio.anio, periodoAcademicoPrevio.periodo])
							.then(function(estudianteConsultado) {
								if (!angular.isUndefined(estudianteConsultado.data.estudianteCollection.datosEstudiante)) {
									estudianteAsociado.informacionAcademica = estudianteConsultado.data.estudianteCollection.datosEstudiante[0];
								}
								deferred.resolve($translate.instant("ERROR.SIN_INFO_ESTUDIANTE"));
							})
							.catch(function(excepcionEstudianteConsultado) {
								deferred.reject($translate.instant("ERROR.CARGANDO_INFO_ESTUDIANTE"));
							});
					})
					.catch(function(excepcionPeriodoAcademico) {
						deferred.reject(excepcionPeriodoAcademico);
					});
				return deferred.promise;
			}

			/**
			 * @ngdoc method
			 * @name obtenerParametrosEstudianteTrabajoGrado
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarProyectoCtrl
			 * @description
			 * Función que define los parámetros para consultar en la tabla estudiante_trabajo_grado.
			 * @param {Number} idTrabajoGrado El identificador del trabajo de grado a consultar
			 * @returns {String} La sentencia para la consulta correspondiente
			 */
			ctrl.obtenerParametrosEstudianteTrabajoGrado = function(idTrabajoGrado) {
				return $.param({
					query: "TrabajoGrado.Id:" +
						idTrabajoGrado,
					limit: 0
				});
			}

			/**
			 * @ngdoc method
			 * @name consultarEstudiantesAsociados
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarProyectoCtrl
			 * @description
			 * Función que recorre la base de datos de acuerdo al docente en sesión para traer los Proyectos asignados para revisión.
			 * Llama a la función: obtenerParametrosVinculacionTrabajoGrado.
			 * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los datos de la base del aplicativo.
			 * @param {Object} Proyecto El Proyecto al que se le cargarán los estudiantes asociados
			 * @returns {Promise} El mensaje en caso de no corresponder la información, o la excepción generada
			 */
			ctrl.consultarEstudiantesAsociados = function(Proyecto) {
				var deferred = $q.defer();
				poluxRequest.get("estudiante_trabajo_grado", ctrl.obtenerParametrosEstudianteTrabajoGrado(Proyecto.TrabajoGrado.Id))
					.then(function(estudiantesAsociados) {
						if (Object.keys(estudiantesAsociados.data[0]).length > 0) {
							Proyecto.EstudiantesTrabajoGrado = estudiantesAsociados.data;
						}
						deferred.resolve($translate.instant("ERROR.SIN_ESTUDIANTE_TRABAJO_GRADO"));
					})
					.catch(function(excepcionVinculacionTrabajoGrado) {
						deferred.reject($translate.instant("ERROR.CARGANDO_ESTUDIANTE_TRABAJO_GRADO"));
					});
				return deferred.promise;
			}

			/**
			 * @ngdoc method
			 * @name obtenerParametrosDocumentoTrabajoGrado
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarProyectoCtrl
			 * @description
			 * Función que define los parámetros para consultar en la tabla documento_trabajo_grado.
			 * @param {Number} idTrabajoGrado El identificador del trabajo de grado a consultar
			 * @returns {String} La sentencia para la consulta correspondiente
			 */
			ctrl.obtenerParametrosDocumentoTrabajoGrado = function(idTrabajoGrado) {
				return $.param({
					query: "DocumentoEscrito.TipoDocumentoEscrito:5," +
						"TrabajoGrado.Id:" +
						idTrabajoGrado,
					limit: 1
				});
			}


			/**
			 * @ngdoc method
			 * @name consultarDocumentoTrabajoGrado
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarProyectoCtrl
			 * @description
			 * Función que recorre la base de datos de acuerdo al trabajo de grado vinculado y trae el documento asociado.
			 * Llama a la función: obtenerParametrosDocumentoTrabajoGrado.
			 * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los datos de la base del aplicativo.
			 * @param {Object} Proyecto El Proyecto para cargar la información del documento
			 * @returns {Promise} El mensaje en caso de no corresponder la información, o la excepción generada
			 */
			ctrl.consultarDocumentoTrabajoGrado = function(Proyecto) {
				var deferred = $q.defer();
				poluxRequest.get("documento_trabajo_grado", ctrl.obtenerParametrosDocumentoTrabajoGrado(Proyecto.TrabajoGrado.Id))
					.then(function(documentoAsociado) {
						if (Object.keys(documentoAsociado.data[0]).length > 0) {
							Proyecto.documentoTrabajoGrado = documentoAsociado.data[0].Id;
							Proyecto.documentoEscrito = documentoAsociado.data[0].DocumentoEscrito;
						}
						deferred.resolve($translate.instant("ERROR.SIN_ESTUDIANTE_TRABAJO_GRADO"));
					})
					.catch(function(excepcionVinculacionTrabajoGrado) {
						deferred.reject($translate.instant("ERROR.CARGANDO_ESTUDIANTE_TRABAJO_GRADO"));
					});
				return deferred.promise;
			}

			/**
			 * @ngdoc method
			 * @name obtenerParametrosVinculacionTrabajoGradoEvaluador
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarProyectoCtrl
			 * @description
			 * Función que define los parámetros para consultar en la tabla vinculacion_trabajo_grado.
			 * El rol de trabajo de grado número 3 identifica los docentes evaluadores.
			 * Los estados de trabajo de grado desde el número 4 al número 12 identifican los estados asociados a la dinámica del docente evaluando los Proyectos asociados.
			 * @param {undefined} undefined No requiere parámetros
			 * @returns {String} La sentencia para la consulta correspondiente
			 */
			ctrl.obtenerParametrosVinculacionTrabajoGradoEvaluador = function() {
				return $.param({
					query: "Activo:True," +
						"RolTrabajoGrado.Id:3," +
						"TrabajoGrado.EstadoTrabajoGrado.Id.in:15," +
						"Usuario:" +
						ctrl.usuarioSesion,
					limit: 0
				});
			}

			/**
			 * @ngdoc method
			 * @name obtenerParametrosVinculacionTrabajoGradoDirector
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarProyectoCtrl
			 * @description
			 * Función que define los parámetros para consultar en la tabla vinculacion_trabajo_grado.
			 * El rol de trabajo de grado número 3 identifica los docentes evaluadores.
			 * Los estados de trabajo de grado desde el número 4 al número 12 identifican los estados asociados a la dinámica del docente evaluando los Proyectos asociados.
			 * @param {undefined} undefined No requiere parámetros
			 * @returns {String} La sentencia para la consulta correspondiente
			 */
			ctrl.obtenerParametrosVinculacionTrabajoGradoDirector = function() {
				return $.param({
					query: "Activo:True," +
						"RolTrabajoGrado.Id:1," +
						"TrabajoGrado.Modalidad.Id.in:1|8," +
						"TrabajoGrado.EstadoTrabajoGrado.Id.in:15," +
						"Usuario:" +
						ctrl.usuarioSesion,
					limit: 0
				});
			}

			/**
			 * @ngdoc method
			 * @name consultarProyectos
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarProyectoCtrl
			 * @description
			 * Función que recorre la base de datos de acuerdo al docente en sesión para traer los Proyectos asignados para revisión.
			 * Llama a las funciones: obtenerParametrosVinculacionTrabajoGradoEvaluador, consultarEstudiantesAsociados y consultarDocumentoTrabajoGrado.
			 * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los datos de la base del aplicativo.
			 * @param {undefined} undefined No requiere parámetros
			 * @returns {Promise} El mensaje en caso de no corresponder la información, o la excepción generada
			 */
			ctrl.consultarProyectos = function() {
				var deferred = $q.defer();
				var conjuntoProcesamientoDeProyectos = [];
				ctrl.coleccionProyectos = [];

				var getProyectosPendientes = function(parametros) {
					var deferred = $q.defer();
					poluxRequest.get("vinculacion_trabajo_grado", parametros)
						.then(function(responseProyectosPendientes) {
							if (Object.keys(responseProyectosPendientes.data[0]).length > 0) {
								deferred.resolve(responseProyectosPendientes.data);
							} else {
								deferred.resolve([]);
							}
						})
						.catch(function(error) {
							deferred.reject(error);
						});
					return deferred.promise;
				}

				$q.all([getProyectosPendientes(ctrl.obtenerParametrosVinculacionTrabajoGradoEvaluador()), getProyectosPendientes(ctrl.obtenerParametrosVinculacionTrabajoGradoDirector())])
					.then(function(ProyectosPendientes) {
						var proyectosPendientes = [];

						if (ProyectosPendientes[0] != null) {
							Array.prototype.push.apply(proyectosPendientes, ProyectosPendientes[0]);
						}
						if (ProyectosPendientes[1] != null) {
							Array.prototype.push.apply(proyectosPendientes, ProyectosPendientes[1]);
						}
						//if (ProyectosPendientes.data) {
						if (proyectosPendientes.length > 0) {
							angular.forEach(proyectosPendientes, function(Proyecto) {
								conjuntoProcesamientoDeProyectos.push(ctrl.consultarEstudiantesAsociados(Proyecto));
								conjuntoProcesamientoDeProyectos.push(ctrl.consultarDocumentoTrabajoGrado(Proyecto));
							});
							$q.all(conjuntoProcesamientoDeProyectos)
								.then(function(resultadoDelProcesamiento) {
									angular.forEach(proyectosPendientes, function(Proyecto) {
										if (Proyecto.EstudiantesTrabajoGrado &&
											Proyecto.documentoTrabajoGrado &&
											Proyecto.documentoEscrito) {
											ctrl.coleccionProyectos.push(Proyecto);
										}
									});
									deferred.resolve(resultadoDelProcesamiento);
								})
								.catch(function(excepcionDuranteProcesamiento) {
									deferred.reject(excepcionDuranteProcesamiento);
								});
						} else {
							deferred.reject($translate.instant("ERROR.SIN_TRABAJO_GRADO"));
						}
					})
					.catch(function(excepcionVinculacionTrabajoGrado) {
						deferred.reject($translate.instant("ERROR.CARGANDO_TRABAJO_GRADO"));
					});
				return deferred.promise;
			}

			/**
			 * @ngdoc method
			 * @name mostrarProyectos
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarProyectoCtrl
			 * @description
			 * Función que carga el contenido de los Proyectos a la cuadrícula correspondiente.
			 * @param {Array} Proyectos La colección de Proyectos listada
			 * @returns {undefined} No hace retorno de resultados
			 */
			ctrl.mostrarProyectos = function(Proyectos) {
				angular.forEach(Proyectos, function(Proyecto) {
					Proyecto.autores = Proyecto.EstudiantesTrabajoGrado.map(function(estudianteTrabajoGrado) {
							return estudianteTrabajoGrado.Estudiante;
						})
						.join(", ");
				});
				ctrl.cuadriculaProyectos.data = Proyectos;
			}

			/**
			 * @ngdoc method
			 * @name actualizarCuadriculaDeProyectos
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarProyectoCtrl
			 * @description
			 * Función que actualiza el contenido de la cuadrícula según la consulta de los Proyectos existentes.
			 * Llama a las funciones: consultarProyectos y mostrarProyectos.
			 * @param {undefined} undefined No requiere parámetros
			 * @returns {undefined} No hace retorno de resultados
			 */
			ctrl.actualizarCuadriculaDeProyectos = function() {
				ctrl.cargandoProyectos = false;
				ctrl.errorCargandoProyectos = false;
				ctrl.coleccionProyectos = [];
				ctrl.cuadriculaProyectos.data = [];
				ctrl.consultarProyectos()
					.then(function(respuestaConsultandoProyectos) {
						if (ctrl.coleccionProyectos.length > 0) {
							ctrl.mostrarProyectos(ctrl.coleccionProyectos);
						} else {
							ctrl.errorCargandoProyectos = true;
							ctrl.mensajeErrorCargandoProyectos = respuestaConsultandoProyectos[0];
						}
					})
					.catch(function(excepcionConsultandoProyectos) {
						ctrl.errorCargandoProyectos = true;
						ctrl.mensajeErrorCargandoProyectos = excepcionConsultandoProyectos;
					});
			}

			//Invocación del método inicial
			ctrl.actualizarCuadriculaDeProyectos();

			/**
			 * @ngdoc method
			 * @name revisarProyectoSeleccionado
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarProyectoCtrl
			 * @description
			 * Función que despliega la ventana emergente que describe el Proyecto seleccionado y le permite al docente brindar la respuesta asociada a su revisión.
			 * @param {Object} filaAsociada El Proyecto de grado que el docente seleccionó
			 * @returns {undefined} No hace retorno de resultados
			 */
			ctrl.revisarProyectoSeleccionado = function(filaAsociada) {
				//ctrl.ProyectoSeleccionado = filaAsociada.entity;
				$location.path("general/concepto_tg/" + filaAsociada.entity.Id);
				/*ctrl.coleccionRespuestasProyecto = [];
				ctrl.coleccionRespuestasProyecto = [{
				idEstadoTrabajoGrado: 16,
				nombreEstadoTrabajoGrado: "Modificable",
				}, {
				idEstadoTrabajoGrado: 17,
				nombreEstadoTrabajoGrado: "Listo para sustentar",
				}];
				ctrl.cuadriculaEstudiantesDelProyecto.data = [];
				ctrl.cargandoDatosEstudiantiles = true;
				ctrl.errorCargandoDatosEstudiantiles = false;
				ctrl.respuestaSeleccionada = null;
				ctrl.respuestaExplicada = null;
				ctrl.respuestaHabilitada = false;
				$('#modalRevisarProyecto').modal('show');
				var conjuntoProcesamientoDatosEstudiantiles = [];
				angular.forEach(ctrl.ProyectoSeleccionado.EstudiantesTrabajoGrado, function(estudianteTrabajoGrado) {
					conjuntoProcesamientoDatosEstudiantiles.push(ctrl.consultarInformacionAcademicaDelEstudiante(estudianteTrabajoGrado));
				});
				$q.all(conjuntoProcesamientoDatosEstudiantiles)
					.then(function(resultadoDelProcesamiento) {
						ctrl.cargandoDatosEstudiantiles = false;
						angular.forEach(ctrl.ProyectoSeleccionado.EstudiantesTrabajoGrado, function(estudianteTrabajoGrado) {
							if (estudianteTrabajoGrado.informacionAcademica) {
								estudianteTrabajoGrado.codigo = estudianteTrabajoGrado.informacionAcademica.codigo;
								estudianteTrabajoGrado.nombre = estudianteTrabajoGrado.informacionAcademica.nombre;
								ctrl.cuadriculaEstudiantesDelProyecto.data.push(estudianteTrabajoGrado);
							} else {
								ctrl.errorCargandoDatosEstudiantiles = true;
								ctrl.mensajeErrorCargandoDatosEstudiantiles = resultadoDelProcesamiento[0];
							}
						});
					})
					.catch(function(excepcionDuranteProcesamiento) {
						ctrl.cargandoDatosEstudiantiles = false;
						ctrl.errorCargandoDatosEstudiantiles = true;
						ctrl.mensajeErrorCargandoDatosEstudiantiles = excepcionDuranteProcesamiento;
					});
				*/
			}

			/**
			 * @ngdoc method
			 * @name registrarRevision
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarProyectoCtrl
			 * @description
			 * Función que maneja la confirmación del usuario al haber revisado el Proyecto de grado.
			 * Llama a las funciones: actualizarEstadoProyecto y actualizarCuadriculaDeProyectos.
			 * @param {undefined} undefined No requiere parámetros
			 * @returns {undefined} No hace retorno resultados
			 */
			ctrl.registrarRevision = function() {
				swal({
						title: $translate.instant("REVISAR_PROYECTO.CONFIRMACION"),
						text: $translate.instant("REVISAR_PROYECTO.MENSAJE_CONFIRMACION", {
							autores: ctrl.ProyectoSeleccionado.EstudiantesTrabajoGrado.map(function(estudianteTrabajoGrado) {
									return estudianteTrabajoGrado.informacionAcademica.nombre + " (" + estudianteTrabajoGrado.codigo + ")";
								})
								.join(", ")
						}),
						type: "info",
						confirmButtonText: $translate.instant("ACEPTAR"),
						cancelButtonText: $translate.instant("CANCELAR"),
						showCancelButton: true
					})
					.then(function(confirmacionDelUsuario) {
						if (confirmacionDelUsuario.value) {
							ctrl.cargandoProyectos = true;
							ctrl.cargandoDatosEstudiantiles = true;
							ctrl.actualizarEstadoProyecto()
								.then(function(respuestaActualizarProyecto) {
									if (respuestaActualizarProyecto.data[0] === "Success") {
										ctrl.cargandoProyectos = false;
										ctrl.cargandoDatosEstudiantiles = false;
										swal(
											$translate.instant("REVISAR_PROYECTO.CONFIRMACION"),
											$translate.instant("REVISAR_PROYECTO.REVISION_REGISTRADA"),
											'success'
										);
										ctrl.actualizarCuadriculaDeProyectos();
										$('#modalRevisarProyecto').modal('hide');
									} else {
										ctrl.cargandoProyectos = false;
										ctrl.cargandoDatosEstudiantiles = false;
										swal(
											$translate.instant("REVISAR_PROYECTO.CONFIRMACION"),
											$translate.instant(respuestaActualizarProyecto.data[1]),
											'warning'
										);
									}
								})
								.catch(function(excepcionActualizarProyecto) {
									ctrl.cargandoProyectos = false;
									ctrl.cargandoDatosEstudiantiles = false;
									swal(
										$translate.instant("REVISAR_PROYECTO.CONFIRMACION"),
										$translate.instant("ERROR.REGISTRANDO_REVISION"),
										'warning'
									);
								});
						}
					});
			}

			/**
			 * @ngdoc method
			 * @name actualizarEstadoProyecto
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarProyectoCtrl
			 * @description
			 * Función que prepara el contenido de la información para actualizar.
			 * Efectúa el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para registrar los resultados de la revisión en la base de datos.
			 * @param {undefined} undefined No requiere parámetros
			 * @returns {Promise} La respuesta de operar el registro en la base de datos
			 */
			ctrl.actualizarEstadoProyecto = function() {
				var deferred = $q.defer();
				var fechaParaRegistrar = new Date();
				ctrl.ProyectoSeleccionado.TrabajoGrado.EstadoTrabajoGrado = {
					Id: ctrl.respuestaSeleccionada.idEstadoTrabajoGrado
				};
				var revisionTrabajoGrado = {
					NumeroRevision: 1,
					FechaRecepcion: fechaParaRegistrar,
					FechaRevision: fechaParaRegistrar,
					EstadoRevisionTrabajoGrado: {
						Id: 3
					},
					DocumentoTrabajoGrado: {
						Id: ctrl.ProyectoSeleccionado.documentoTrabajoGrado
					},
					VinculacionTrabajoGrado: {
						Id: ctrl.ProyectoSeleccionado.Id
					}
				};
				var correccion = {
					Observacion: ctrl.respuestaExplicada,
					Pagina: 1,
					RevisionTrabajoGrado: {
						Id: 0
					}
				};
				var informacionParaActualizar = {
					"TrabajoGrado": ctrl.ProyectoSeleccionado.TrabajoGrado,
					"RevisionTrabajoGrado": revisionTrabajoGrado,
					"Correccion": correccion
				};
				poluxRequest
					//.post("tr_revisar_Proyecto", informacionParaActualizar)
					// Se reutiliza transacción de revisar anteproyecto
					.post("tr_revisar_anteproyecto", informacionParaActualizar)
					.then(function(respuestaRevisarProyecto) {
						deferred.resolve(respuestaRevisarProyecto);
					})
					.catch(function(excepcionRevisarProyecto) {
						deferred.reject(excepcionRevisarProyecto);
					});
				return deferred.promise;
			}

			/**
			 * @ngdoc method
			 * @name verDocumentoProyecto
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarProyectoCtrl
			 * @description
			 * Función que se dispara al momento de seleccionar la opción de visualización del documento del Proyecto, y permite desplegar el contenido del mismo.
			 * Llama a la función: abrirDocumento
			 * @param {Object} filaAsociada El Proyecto de grado que el docente seleccionó
			 * @returns {undefined} No hace retorno de resultados
			 */
			ctrl.verDocumentoProyecto = function(filaAsociada) {
				ctrl.abrirDocumento(filaAsociada.entity.documentoEscrito.Enlace);
			}

			/**
			 * @ngdoc method
			 * @name abrirDocumento
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarProyectoCtrl
			 * @description
			 * Función que abre el documento asociado en una ventana emergente.
			 * Llama a las funciones: obtenerDoc y obtenerFetch
			 * Consulta el servicio de {@link services/poluxClienteApp.service:nuxeoService nuxeo} para usar la gestión documental.
			 * @param {String} docid Identificador del documento en del documento en {@link services/poluxClienteApp.service:nuxeoService nuxeo}
			 * @returns {undefined} No hace retorno de resultados
			 */
			ctrl.abrirDocumento = function(docid) {
				nuxeo.header('X-NXDocumentProperties', '*');

				/**
				 * @ngdoc method
				 * @name obtenerDoc
				 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarProyectoCtrl
				 * @description 
				 * Consulta un documento a {@link services/poluxClienteApp.service:nuxeoService nuxeo} y responde con el contenido.
				 * @param {undefined} undefined No requiere parámetros
				 * @returns {Promise} La respuesta de la petición hacia la gestión documental
				 */
				ctrl.obtenerDoc = function() {
					var defer = $q.defer();
					nuxeo.request('/id/' + docid)
						.get()
						.then(function(response) {
							ctrl.document = response;
							defer.resolve(response);
						})
						.catch(function(error) {
							defer.reject(error)
						});
					return defer.promise;
				};

				/**
				 * @ngdoc method
				 * @name obtenerFetch
				 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarProyectoCtrl
				 * @description 
				 * Obtiene el blob de un documento.
				 * @param {Object} doc Documento de nuxeo al cual se le obtendrá el Blob
				 * @returns {Promise} La respuesta de obtener el blob del documento asociado
				 */
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

				ctrl.obtenerDoc()
					.then(function() {
						ctrl.obtenerFetch(ctrl.document)
							.then(function(r) {
								ctrl.blob = r;
								var fileURL = URL.createObjectURL(ctrl.blob);
								console.log(fileURL);
								ctrl.content = $sce.trustAsResourceUrl(fileURL);
								$window.open(fileURL);
							})
							.catch(function(error) {
								console.log("Error ->", error);
								swal(
									$translate.instant("MENSAJE_ERROR"),
									$translate.instant("ERROR.CARGAR_DOCUMENTO"),
									'warning'
								);
							});
					})
					.catch(function(error) {
						console.log("Error ->", error);
						swal(
							$translate.instant("MENSAJE_ERROR"),
							$translate.instant("ERROR.CARGAR_DOCUMENTO"),
							'warning'
						);
					});
			}

		});