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
 * @requires $window
 * @requires $location
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires services/academicaService.service:academicaRequest
 * @requires services/poluxClienteApp.service:nuxeoService
 * @requires services/poluxService.service:poluxRequest
 * @requires services/poluxClienteApp.service:sesionesService
 * @requires services/poluxClienteApp.service:tokenService
 * @requires uiGridConstants
 * @property {String} usuarioSesion El identificador del docente en sesión para consultar y revisar sus anteproyectos pendientes
 * @property {Boolean} cargandoAnteproyectos Indicador que maneja la carga de los anteproyectos para revisar
 * @property {String} mensajeCargandoAnteproyectos Mensaje que aparece durante la carga de anteproyectos para revisar
 * @property {String} mensajeCargandoDatosEstudiantiles Mensjae que aparece durante la carga de los datos de los estudiantes asociados al anteproyecto seleccionado
 * @property {Array} botonVerDocumento Establece las propiedades del botón que se muestra para ver el documento asociado a cada anteproyecto
 * @property {Array} botonRevisarAnteproyecto Establece las propiedades del botón que se muestra para dar respuesta a la revisión del anteproyecto asignado
 * @property {Object} cuadriculaAnteproyectos Almacena y adapta la información de los anteproyectos para visualizar el contenido y poder hacer la revisión del mismo
 * @property {Object} cuadriculaEstudiantesDelAnteproyecto Almacena y adapta la información de los datos estudiantiles sobre los autores del anteproyecto
 * @property {Array} coleccionAnteproyectos Almacena los anteproyectos a medida que se consultan y se cargan con la información correspondiente
 * @property {Boolean} errorCargandoAnteproyectos Indicador que maneja la aparición de un error durante la carga de los anteproyectos pendientes
 * @property {String} mensajeErrorCargandoAnteproyectos Mensaje que aparece en caso de error durante la carga de los anteproyectos pendientes
 * @property {Object} anteproyectoSeleccionado Objeto que carga el anteproyecto que el usuario selecciona desde la vista
 * @property {Array} coleccionRespuestasAnteproyecto Almacena las posibles respuestas para el cambio de estado del trabajo de grado de acuerdo a la revisión del anteproyecto
 * @property {Boolean} cargandoDatosEstudiantiles Indicador que maneja carga de los datos de los estudiantes asociados al anteproyecto seleccionado
 * @property {Boolean} errorCargandoDatosEstudiantiles Indicador que maneja la aparición de un error durante la carga de los datos de los estudiantes
 * @property {String} mensajeErrorCargandoDatosEstudiantiles Mensaje que aparece en caso de error durante la carga de los datos de los estudiantes
 * @property {Object} respuestaSeleccionada Selección del docente como respuesta del estado que define para el anteproyecto (viable, modificable, no viable)
 * @property {String} respuestaExplicada Contenido de la justificación que brinda el docente para la decisión que tomó sobre la respuesta del anteproyecto
 * @property {Boolean} respuestaHabilitada Indicador que maneja la habilitación de la justificación de la respuesta, una vez se seleeciona una opción para el anteproyecto
 * @property {Object} document Almacena la respuesta del documento desde la petición a nuxeo.
 * @property {Object} blob Almacena la respuesta sobre el blob del documento para visualizarlo
 */
angular.module('poluxClienteApp')
	.controller('TrabajoGradoRevisarAnteproyectoCtrl',
		function($q, $translate, $window, academicaRequest, nuxeoClient, poluxRequest, sesionesRequest, token_service, uiGridConstants, $location) {
			var ctrl = this;

			//El Id del usuario en sesión
			//token_service.token.documento = "80093200";
			//ctrl.usuarioSesion = token_service.token.documento;

			ctrl.usuarioSesion = token_service.getAppPayload().appUserDocument;

			ctrl.cargandoAnteproyectos = true;
			ctrl.mensajeCargandoAnteproyectos = $translate.instant("LOADING.CARGANDO_ANTEPROYECTOS");
			ctrl.mensajeCargandoDatosEstudiantiles = $translate.instant("LOADING.CARGANDO_INFO_ACADEMICA");

			ctrl.botonVerDocumento = [{
				clase_color: "ver",
				clase_css: "fa fa-eye fa-lg  faa-shake animated-hover",
				titulo: $translate.instant('VER_DOCUMENTO'),
				estado: true
			}];

			ctrl.botonRevisarAnteproyecto = [{
				clase_color: "ver",
				clase_css: "fa fa-cog fa-lg  faa-shake animated-hover",
				titulo: $translate.instant('BTN.REVISAR_ANTEPROYECTO'),
				estado: true
			}];

			ctrl.cuadriculaAnteproyectos = {};

			ctrl.cuadriculaAnteproyectos.columnDefs = [{
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
				displayName: $translate.instant("REVISAR_ANTEPROYECTO.ACCION"),
				width: '15%',
				cellTemplate: '<btn-registro ' +
					'ng-if="row.entity.TrabajoGrado.EstadoTrabajoGrado.Id == 4 || row.entity.TrabajoGrado.EstadoTrabajoGrado.Id == 9"' +
					'funcion="grid.appScope.revisarAnteproyecto.verDocumentoAnteproyecto(row)"' +
					'grupobotones="grid.appScope.revisarAnteproyecto.botonVerDocumento">' +
					'</btn-registro>' +
					'<btn-registro ' +
					'ng-if="row.entity.TrabajoGrado.EstadoTrabajoGrado.Id == 4 || row.entity.TrabajoGrado.EstadoTrabajoGrado.Id == 9"' +
					'funcion="grid.appScope.revisarAnteproyecto.revisarAnteproyectoSeleccionado(row)"' +
					'grupobotones="grid.appScope.revisarAnteproyecto.botonRevisarAnteproyecto">' +
					'</btn-registro>' +
					'<div class="ui-grid-cell-contents" ' +
					'ng-if="row.entity.TrabajoGrado.EstadoTrabajoGrado.Id != 4 && row.entity.TrabajoGrado.EstadoTrabajoGrado.Id != 9">' +
					'{{"REVISAR_ANTEPROYECTO.REGISTRO_NO_HABILITADO" | translate}}' +
					'</div>'
			}];

			ctrl.cuadriculaEstudiantesDelAnteproyecto = {};

			ctrl.cuadriculaEstudiantesDelAnteproyecto.columnDefs = [{
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
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarAnteproyectoCtrl
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
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarAnteproyectoCtrl
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
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarAnteproyectoCtrl
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
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarAnteproyectoCtrl
			 * @description
			 * Función que recorre la base de datos de acuerdo al docente en sesión para traer los anteproyectos asignados para revisión.
			 * Llama a la función: obtenerParametrosVinculacionTrabajoGrado.
			 * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los datos de la base del aplicativo.
			 * @param {Object} anteproyecto El anteproyecto al que se le cargarán los estudiantes asociados
			 * @returns {Promise} El mensaje en caso de no corresponder la información, o la excepción generada
			 */
			ctrl.consultarEstudiantesAsociados = function(anteproyecto) {
				var deferred = $q.defer();
				poluxRequest.get("estudiante_trabajo_grado", ctrl.obtenerParametrosEstudianteTrabajoGrado(anteproyecto.TrabajoGrado.Id))
					.then(function(estudiantesAsociados) {
						if (estudiantesAsociados.data) {
							anteproyecto.EstudiantesTrabajoGrado = estudiantesAsociados.data;
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
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarAnteproyectoCtrl
			 * @description
			 * Función que define los parámetros para consultar en la tabla documento_trabajo_grado.
			 * @param {Number} idTrabajoGrado El identificador del trabajo de grado a consultar
			 * @returns {String} La sentencia para la consulta correspondiente
			 */
			ctrl.obtenerParametrosDocumentoTrabajoGrado = function(idTrabajoGrado) {
				return $.param({
					query: "DocumentoEscrito.TipoDocumentoEscrito:3," +
						"TrabajoGrado.Id:" +
						idTrabajoGrado,
					limit: 1
				});
			}


			/**
			 * @ngdoc method
			 * @name consultarDocumentoTrabajoGrado
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarAnteproyectoCtrl
			 * @description
			 * Función que recorre la base de datos de acuerdo al trabajo de grado vinculado y trae el documento asociado.
			 * Llama a la función: obtenerParametrosDocumentoTrabajoGrado.
			 * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los datos de la base del aplicativo.
			 * @param {Object} anteproyecto El anteproyecto para cargar la información del documento
			 * @returns {Promise} El mensaje en caso de no corresponder la información, o la excepción generada
			 */
			ctrl.consultarDocumentoTrabajoGrado = function(anteproyecto) {
				var deferred = $q.defer();
				poluxRequest.get("documento_trabajo_grado", ctrl.obtenerParametrosDocumentoTrabajoGrado(anteproyecto.TrabajoGrado.Id))
					.then(function(documentoAsociado) {
						if (documentoAsociado.data) {
							anteproyecto.documentoTrabajoGrado = documentoAsociado.data[0].Id;
							anteproyecto.documentoEscrito = documentoAsociado.data[0].DocumentoEscrito;
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
			 * @name obtenerParametrosVinculacionTrabajoGrado
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarAnteproyectoCtrl
			 * @description
			 * Función que define los parámetros para consultar en la tabla vinculacion_trabajo_grado.
			 * El rol de trabajo de grado número 3 identifica los docentes evaluadores.
			 * Los estados de trabajo de grado desde el número 4 al número 12 identifican los estados asociados a la dinámica del docente evaluando los anteproyectos asociados.
			 * @param {undefined} undefined No requiere parámetros
			 * @returns {String} La sentencia para la consulta correspondiente
			 */
			ctrl.obtenerParametrosVinculacionTrabajoGrado = function() {
				return $.param({
					query: "Activo:True," +
						"RolTrabajoGrado.Id:3," +
						"TrabajoGrado.EstadoTrabajoGrado.Id.in:4|5|6|7|8|9|10|11|12|13," +
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
			 * Llama a las funciones: obtenerParametrosVinculacionTrabajoGrado, consultarEstudiantesAsociados y consultarDocumentoTrabajoGrado.
			 * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los datos de la base del aplicativo.
			 * @param {undefined} undefined No requiere parámetros
			 * @returns {Promise} El mensaje en caso de no corresponder la información, o la excepción generada
			 */
			ctrl.consultarAnteproyectos = function() {
				var deferred = $q.defer();
				var conjuntoProcesamientoDeAnteproyectos = [];
				ctrl.coleccionAnteproyectos = [];
				poluxRequest.get("vinculacion_trabajo_grado", ctrl.obtenerParametrosVinculacionTrabajoGrado())
					.then(function(anteproyectosPendientes) {
						if (anteproyectosPendientes.data) {
							angular.forEach(anteproyectosPendientes.data, function(anteproyecto) {
								conjuntoProcesamientoDeAnteproyectos.push(ctrl.consultarEstudiantesAsociados(anteproyecto));
								conjuntoProcesamientoDeAnteproyectos.push(ctrl.consultarDocumentoTrabajoGrado(anteproyecto));
							});
							$q.all(conjuntoProcesamientoDeAnteproyectos)
								.then(function(resultadoDelProcesamiento) {
									angular.forEach(anteproyectosPendientes.data, function(anteproyecto) {
										if (anteproyecto.EstudiantesTrabajoGrado &&
											anteproyecto.documentoTrabajoGrado &&
											anteproyecto.documentoEscrito) {
											ctrl.coleccionAnteproyectos.push(anteproyecto);
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
			 * @name mostrarAnteproyectos
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarAnteproyectoCtrl
			 * @description
			 * Función que carga el contenido de los anteproyectos a la cuadrícula correspondiente.
			 * @param {Array} anteproyectos La colección de anteproyectos listada
			 * @returns {undefined} No hace retorno de resultados
			 */
			ctrl.mostrarAnteproyectos = function(anteproyectos) {
				angular.forEach(anteproyectos, function(anteproyecto) {
					anteproyecto.autores = anteproyecto.EstudiantesTrabajoGrado.map(function(estudianteTrabajoGrado) {
							return estudianteTrabajoGrado.Estudiante;
						})
						.join(", ");
				});
				ctrl.cuadriculaAnteproyectos.data = anteproyectos;
			}

			/**
			 * @ngdoc method
			 * @name actualizarCuadriculaDeAnteproyectos
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarAnteproyectoCtrl
			 * @description
			 * Función que actualiza el contenido de la cuadrícula según la consulta de los anteproyectos existentes.
			 * Llama a las funciones: consultarAnteproyectos y mostrarAnteproyectos.
			 * @param {undefined} undefined No requiere parámetros
			 * @returns {undefined} No hace retorno de resultados
			 */
			ctrl.actualizarCuadriculaDeAnteproyectos = function() {
				ctrl.cuadriculaAnteproyectos.data = [];
				ctrl.cargandoAnteproyectos = false;
				ctrl.errorCargandoAnteproyectos = false;
				ctrl.consultarAnteproyectos()
					.then(function(respuestaConsultandoAnteproyectos) {
						if (ctrl.coleccionAnteproyectos.length > 0) {
							ctrl.mostrarAnteproyectos(ctrl.coleccionAnteproyectos);
						} else {
							ctrl.errorCargandoAnteproyectos = true;
							ctrl.mensajeErrorCargandoAnteproyectos = respuestaConsultandoAnteproyectos[0];
						}
					})
					.catch(function(excepcionConsultandoAnteproyectos) {
						ctrl.errorCargandoAnteproyectos = true;
						ctrl.mensajeErrorCargandoAnteproyectos = excepcionConsultandoAnteproyectos;
					});
			}

			//Invocación del método inicial
			ctrl.actualizarCuadriculaDeAnteproyectos();

			/**
			 * @ngdoc method
			 * @name revisarAnteproyectoSeleccionado
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarAnteproyectoCtrl
			 * @description
			 * Función que despliega la ventana emergente que describe el anteproyecto seleccionado y le permite al docente brindar la respuesta asociada a su revisión.
			 * @param {Object} filaAsociada El anteproyecto de grado que el docente seleccionó
			 * @returns {undefined} No hace retorno de resultados
			 */
			ctrl.revisarAnteproyectoSeleccionado = function(filaAsociada) {
				//se  redireccióna a la página para dar el concepto
				//console.log(filaAsociada.entity.Id);
				$location.path("general/concepto_tg/" + filaAsociada.entity.Id);
				/*
				ctrl.anteproyectoSeleccionado = filaAsociada.entity;
				ctrl.coleccionRespuestasAnteproyecto = [];
				if (ctrl.anteproyectoSeleccionado.TrabajoGrado.EstadoTrabajoGrado.Id == 4) {
					ctrl.coleccionRespuestasAnteproyecto = [{
						idEstadoTrabajoGrado: 5,
						nombreEstadoTrabajoGrado: "Viable",
					}, {
						idEstadoTrabajoGrado: 6,
						nombreEstadoTrabajoGrado: "Modificable",
					}, {
						//idEstadoTrabajoGrado: 7, porque si le llega a dar no viable, el trabajo de grado se cancela
						idEstadoTrabajoGrado: 2,
						nombreEstadoTrabajoGrado: "No viable",
					}];
				} else {
					ctrl.coleccionRespuestasAnteproyecto = [{
						idEstadoTrabajoGrado: 10,
						nombreEstadoTrabajoGrado: "Viable",
					}, {
						idEstadoTrabajoGrado: 11,
						nombreEstadoTrabajoGrado: "Modificable",
					}, {
						//idEstadoTrabajoGrado: 12, porque si le llega a dar no viable, el trabajo de grado se cancela
						idEstadoTrabajoGrado: 2,
						nombreEstadoTrabajoGrado: "No viable",
					}];
				}
				ctrl.cuadriculaEstudiantesDelAnteproyecto.data = [];
				ctrl.cargandoDatosEstudiantiles = true;
				ctrl.errorCargandoDatosEstudiantiles = false;
				ctrl.respuestaSeleccionada = null;
				ctrl.respuestaExplicada = null;
				ctrl.respuestaHabilitada = false;
				$('#modalRevisarAnteproyecto').modal('show');
				var conjuntoProcesamientoDatosEstudiantiles = [];
				angular.forEach(ctrl.anteproyectoSeleccionado.EstudiantesTrabajoGrado, function(estudianteTrabajoGrado) {
					conjuntoProcesamientoDatosEstudiantiles.push(ctrl.consultarInformacionAcademicaDelEstudiante(estudianteTrabajoGrado));
				});
				$q.all(conjuntoProcesamientoDatosEstudiantiles)
					.then(function(resultadoDelProcesamiento) {
						ctrl.cargandoDatosEstudiantiles = false;
						angular.forEach(ctrl.anteproyectoSeleccionado.EstudiantesTrabajoGrado, function(estudianteTrabajoGrado) {
							if (estudianteTrabajoGrado.informacionAcademica) {
								estudianteTrabajoGrado.codigo = estudianteTrabajoGrado.informacionAcademica.codigo;
								estudianteTrabajoGrado.nombre = estudianteTrabajoGrado.informacionAcademica.nombre;
								ctrl.cuadriculaEstudiantesDelAnteproyecto.data.push(estudianteTrabajoGrado);
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
					});*/
			}

			/**
			 * @ngdoc method
			 * @name registrarRevision
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarAnteproyectoCtrl
			 * @description
			 * Función que maneja la confirmación del usuario al haber revisado el anteproyecto de grado.
			 * Llama a las funciones: actualizarEstadoAnteproyecto y actualizarCuadriculaDeAnteproyectos.
			 * @param {undefined} undefined No requiere parámetros
			 * @returns {undefined} No hace retorno resultados
			 */
			ctrl.registrarRevision = function() {
				swal({
						title: $translate.instant("REVISAR_ANTEPROYECTO.CONFIRMACION"),
						text: $translate.instant("REVISAR_ANTEPROYECTO.MENSAJE_CONFIRMACION", {
							autores: ctrl.anteproyectoSeleccionado.EstudiantesTrabajoGrado.map(function(estudianteTrabajoGrado) {
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
							ctrl.cargandoAnteproyectos = true;
							ctrl.cargandoDatosEstudiantiles = true;
							ctrl.actualizarEstadoAnteproyecto()
								.then(function(respuestaActualizarAnteproyecto) {
									if (respuestaActualizarAnteproyecto.data[0] === "Success") {
										ctrl.cargandoAnteproyectos = false;
										ctrl.cargandoDatosEstudiantiles = false;
										swal(
											$translate.instant("REVISAR_ANTEPROYECTO.CONFIRMACION"),
											$translate.instant("REVISAR_ANTEPROYECTO.REVISION_REGISTRADA"),
											'success'
										);
										ctrl.actualizarCuadriculaDeAnteproyectos();
										$('#modalRevisarAnteproyecto').modal('hide');
									} else {
										ctrl.cargandoAnteproyectos = false;
										ctrl.cargandoDatosEstudiantiles = false;
										swal(
											$translate.instant("REVISAR_ANTEPROYECTO.CONFIRMACION"),
											$translate.instant(respuestaActualizarAnteproyecto.data[1]),
											'warning'
										);
									}
								})
								.catch(function(excepcionActualizarAnteproyecto) {
									ctrl.cargandoAnteproyectos = false;
									ctrl.cargandoDatosEstudiantiles = false;
									swal(
										$translate.instant("REVISAR_ANTEPROYECTO.CONFIRMACION"),
										$translate.instant("ERROR.REGISTRANDO_REVISION"),
										'warning'
									);
								});
						}
					});
			}

			/**
			 * @ngdoc method
			 * @name actualizarEstadoAnteproyecto
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarAnteproyectoCtrl
			 * @description
			 * Función que prepara el contenido de la información para actualizar.
			 * Efectúa el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para registrar los resultados de la revisión en la base de datos.
			 * @param {undefined} undefined No requiere parámetros
			 * @returns {Promise} La respuesta de operar el registro en la base de datos
			 */
			ctrl.actualizarEstadoAnteproyecto = function() {
				var deferred = $q.defer();
				var fechaParaRegistrar = new Date();
				ctrl.anteproyectoSeleccionado.TrabajoGrado.EstadoTrabajoGrado = {
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
						Id: ctrl.anteproyectoSeleccionado.documentoTrabajoGrado
					},
					VinculacionTrabajoGrado: {
						Id: ctrl.anteproyectoSeleccionado.Id
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
					"TrabajoGrado": ctrl.anteproyectoSeleccionado.TrabajoGrado,
					"RevisionTrabajoGrado": revisionTrabajoGrado,
					"Correccion": correccion
				};
				poluxRequest
					.post("tr_revisar_anteproyecto", informacionParaActualizar)
					.then(function(respuestaRevisarAnteproyecto) {
						deferred.resolve(respuestaRevisarAnteproyecto);
					})
					.catch(function(excepcionRevisarAnteproyecto) {
						deferred.reject(excepcionRevisarAnteproyecto);
					});
				return deferred.promise;
			}

			/**
			 * @ngdoc method
			 * @name verDocumentoAnteproyecto
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarAnteproyectoCtrl
			 * @description
			 * Función que se dispara al momento de seleccionar la opción de visualización del documento del anteproyecto, y permite desplegar el contenido del mismo.
			 * Llama a la función: abrirDocumento
			 * @param {Object} filaAsociada El anteproyecto de grado que el docente seleccionó
			 * @returns {undefined} No hace retorno de resultados
			 */
			ctrl.verDocumentoAnteproyecto = function(filaAsociada) {
				ctrl.abrirDocumento(filaAsociada.entity.documentoEscrito.Enlace);
			}

			/**
			 * @ngdoc method
			 * @name abrirDocumento
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarAnteproyectoCtrl
			 * @description
			 * Función que abre el documento asociado en una ventana emergente.
			 * Llama a las funciones: obtenerDoc y obtenerFetch
			 * Consulta el servicio de {@link services/poluxClienteApp.service:nuxeoService nuxeo} para usar la gestión documental.
			 * @param {String} docid Identificador del documento en del documento en {@link services/poluxClienteApp.service:nuxeoService nuxeo}
			 * @returns {undefined} No hace retorno de resultados
			 */
			ctrl.abrirDocumento = function(docid) {
				nuxeoClient.getDocument(docid)
					.then(function(document) {
						$window.open(document.url);
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