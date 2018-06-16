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
 * @property {Array} botonVerDocumento Establece las propiedades del botón que se muestra para ver el documento asociado a cada anteproyecto
 * @property {Array} botonRevisarAnteproyecto Establece las propiedades del botón que se muestra para dar respuesta a la revisión del anteproyecto asignado
 * @property {Object} cuadriculaAnteproyectos Almacena y adapta la información de los anteproyectos para visualizar el contenido y poder hacer la revisión del mismo
 * @property {Boolean} errorCargandoAnteproyectos Indicador que maneja la aparición de un error durante la carga de los anteproyectos pendientes.
 * @property {String} mensajeErrorCargandoAnteproyectos Mensaje que aparece en caso de error durante la carga de los anteproyectos pendientes.
 * @property {Boolean} cargandoDatosEstudiantiles Indicador que maneja carga de los datos de los estudiantes asociados al anteproyecto seleccionado
 * @property {Boolean} errorCargandoDatosEstudiantiles Indicador que maneja la aparición de un error durante la carga de los datos de los estudiantes.
 * @property {String} mensajeErrorCargandoDatosEstudiantiles Mensaje que aparece en caso de error durante la carga de los datos de los estudiantes.
 */
angular.module('poluxClienteApp')
	.controller('TrabajoGradoRevisarAnteproyectoCtrl',
		function($q, $translate, academicaRequest, poluxRequest, sesionesRequest, token_service, uiGridConstants) {
			var ctrl = this;

			//El Id del usuario en sesión
			token_service.token.documento = "80093200";
			ctrl.usuarioSesion = token_service.token.documento;

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
					'funcion="grid.appScope.revisarAnteproyecto.verDocumentoAnteproyecto(row)"' +
					'grupobotones="grid.appScope.revisarAnteproyecto.botonVerDocumento">' +
					'</btn-registro>' +
					'<btn-registro ' +
					'funcion="grid.appScope.revisarAnteproyecto.revisarAnteproyectoSeleccionado(row)"' +
					'grupobotones="grid.appScope.revisarAnteproyecto.botonRevisarAnteproyecto">' +
					'</btn-registro>'
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
				var conjuntoProcesamientoDeAnteproyectos = [];
				ctrl.coleccionAnteproyectos = [];
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
			 * Llama a las funciones: obtenerParametrosVinculacionTrabajoGrado.
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
							});
							$q.all(conjuntoProcesamientoDeAnteproyectos)
								.then(function(resultadoDelProcesamiento) {
									angular.forEach(anteproyectosPendientes.data, function(anteproyecto) {
										if (anteproyecto.EstudiantesTrabajoGrado) {
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
			 * @name obtenerCodigosEstudiantiles
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarAnteproyectoCtrl
			 * @description
			 * Función que obtiene los códigos desde los objetos que guardan la información de los estudiantes del trabajo de grado.
			 * @param {Object} estudianteTrabajoGrado El objeto que contiene los datos del estudiante registrado.
			 * @returns {String} La cadena de texto acerca de los códigos estudiantiles asociados al anteproyecto
			 */
			ctrl.obtenerCodigosEstudiantiles = function(estudiantesTrabajoGrado) {
				var codigosEstudiantiles = "";
				angular.forEach(estudiantesTrabajoGrado, function(estudianteTrabajoGrado) {
					codigosEstudiantiles += estudianteTrabajoGrado.Estudiante + ", "
				});
				return codigosEstudiantiles.substring(0, codigosEstudiantiles.length - 2);
			}

			/**
			 * @ngdoc method
			 * @name mostrarAnteproyectos
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarAnteproyectoCtrl
			 * @description
			 * Función que carga el contenido de los anteproyectos a la cuadrícula correspondiente.
			 * @param {Array} anteproyectos No requiere parámetros
			 * @returns {undefined} No hace retorno de resultados
			 */
			ctrl.mostrarAnteproyectos = function(anteproyectos) {
				angular.forEach(anteproyectos, function(anteproyecto) {
					anteproyecto.autores = ctrl.obtenerCodigosEstudiantiles(anteproyecto.EstudiantesTrabajoGrado);
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
			 * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los datos de la base del aplicativo.
			 * @param {undefined} undefined No requiere parámetros
			 * @returns {undefined} No hace retorno de resultados
			 */
			ctrl.actualizarCuadriculaDeAnteproyectos = function() {
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
			 * @name verDocumentoAnteproyecto
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarAnteproyectoCtrl
			 * @description
			 * Función que se dispara al momento de seleccionar la opción de visualización del documento del anteproyecto, y permite desplegar el contenido del mismo.
			 * Llama a las funciones: 
			 * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los datos de la base del aplicativo.
			 * @param {Object} filaAsociada El anteproyecto de grado que el docente seleccionó
			 * @returns {Promise} El mensaje en caso de no corresponder la información, o la excepción generada
			 */
			ctrl.verDocumentoAnteproyecto = function(filaAsociada) {
				console.log("ver documento");
				console.log(filaAsociada.entity);
			}

			/**
			 * @ngdoc method
			 * @name revisarAnteproyectoSeleccionado
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarAnteproyectoCtrl
			 * @description
			 * Función que despliega la ventana emergente que describe el anteproyecto seleccionado y le permite al docente brindar la respuesta asociada a su revisión.
			 * Llama a las funciones: .
			 * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los datos de la base del aplicativo.
			 * @param {Object} filaAsociada El anteproyecto de grado que el docente seleccionó
			 * @returns {Promise} El mensaje en caso de no corresponder la información, o la excepción generada
			 */
			ctrl.revisarAnteproyectoSeleccionado = function(filaAsociada) {
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
						idEstadoTrabajoGrado: 7,
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
						idEstadoTrabajoGrado: 12,
						nombreEstadoTrabajoGrado: "No viable",
					}];
				}
				ctrl.cuadriculaEstudiantesDelAnteproyecto.data = [];
				ctrl.cargandoDatosEstudiantiles = true;
				ctrl.errorCargandoDatosEstudiantiles = false;
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
					});
			}

			/**
			 * @ngdoc method
			 * @name confirmarRevision
			 * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarAnteproyectoCtrl
			 * @description
			 * Función que maneja la confirmación del usuario al haber revisado el proyecto de grado.
			 * Llama a las funciones: .
			 * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los datos de la base del aplicativo.
			 * @param {Object} filaAsociada El anteproyecto de grado que el docente seleccionó
			 * @returns {Promise} El mensaje en caso de no corresponder la información, o la excepción generada
			 */
			ctrl.confirmarRevision = function() {
				
			}

			/**
			 * @ngdoc method
			 * @name getDocumento
			 * @methodOf poluxClienteApp.controller:SolicitudesListarSolicitudesCtrl
			 * @param {number} docid Id del documento en {@link services/poluxClienteApp.service:nuxeoService nuxeo}
			 * @returns {undefined} No retorna ningún valor
			 * @description 
			 * Llama a la función obtenerDoc y obtenerFetch para descargar un documento de nuxeo y msotrarlo en una nueva ventana.
			 */
			ctrl.getDocumento = function(docid) {
				nuxeo.header('X-NXDocumentProperties', '*');

				/**
				 * @ngdoc method
				 * @name obtenerDoc
				 * @methodOf poluxClienteApp.controller:SolicitudesListarSolicitudesCtrl
				 * @param {number} docid Id del documento en {@link services/poluxClienteApp.service:nuxeoService nuxeo}
				 * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplio la petición y se resuleve con el objeto Periodo anterior
				 * @description 
				 * Consulta un documento a {@link services/poluxClienteApp.service:nuxeoService nuxeo} y responde con el contenido
				 */
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

				/**
				 * @ngdoc method
				 * @name obtenerFetch
				 * @methodOf poluxClienteApp.controller:SolicitudesListarSolicitudesCtrl
				 * @param {object} doc Documento de nuxeo al cual se le obtendra el Blob
				 * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplio la petición y se resuleve con el objeto Periodo anterior
				 * @description 
				 * Obtiene el blob de un documento
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

				ctrl.obtenerDoc().then(function() {

						ctrl.obtenerFetch(ctrl.document).then(function(r) {
								ctrl.blob = r;
								var fileURL = URL.createObjectURL(ctrl.blob);
								console.log(fileURL);
								ctrl.content = $sce.trustAsResourceUrl(fileURL);
								$window.open(fileURL);
							})
							.catch(function(error) {
								console.log("error", error);
								swal(
									$translate.instant("ERROR"),
									$translate.instant("ERROR.CARGAR_DOCUMENTO"),
									'warning'
								);
							});

					})
					.catch(function(error) {
						console.log("error", error);
						swal(
							$translate.instant("ERROR"),
							$translate.instant("ERROR.CARGAR_DOCUMENTO"),
							'warning'
						);
					});

			}

		});