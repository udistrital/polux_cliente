'use strict';

/**
 * @ngdoc controller
 * @name poluxClienteApp.controller:RevisionArlCtrl
 * @description
 * # RevisionArlCtrl
 * Controller of the poluxClienteApp
 * Controlador donde la extension pasantia puede aprobar o rechazar la arl cargada por el estudiante
 * .
 * @requires $scope
 * @requires $q
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires services/academicaService.service:academicaRequest
 * @requires services/poluxService.service:poluxRequest
 * @requires services/poluxClienteApp.service:tokenService
 * @requires services/poluxService.service:gestorDocumentalMidService
 * @requires services/poluxService.service:documentoService
 * @requires services/poluxService.service:parametrosService
 * @property {Boolean} cargandoTrabajos Bandera que muestra el loading y permite identificar cuando se cargaron todos los trabajos
 * @property {String} mensajeTrabajos Mensaje que se muestra mientras se cargan los trabajos
 * @property {Boolean} cargandoTrabajo Bandera que muestra el loading y permite identificar cuando se cargo el trabajo en especifigo
 * @property {String} mensajeTrabajo Mensaje que se muestra mientras se carga un trabajo de grado
 * @property {Boolean} errorCargando Bandera que indica que ocurrió un error y permite mostrarlo
 * @property {Boolean} errorCargandoTrabajo Bandera que indica que ocurrió un error cargando un trabajo de grado especifico y permite mostrarlo
 * @property {String} mensajeError Mensaje que se muestra cuando ocurre un error
 * @property {String} mensajeErrorTrabajo Mensaje que se muestra cuando ocurre un error cargando un trabajo especifico
 * @property {String} mensajeRegistrandoNota Mensaje que se muestra mientras se registra una nota
 * @property {Object} gridOptions Opciones del ui-grid que muestra los trabajos de grado a los cuales se vincula el usuario
 * @property {Object} trabajoSeleccionado Trabajo seleccionado en un ui-grid
 * @property {Object} docTrabajoGrado Enlace del documento de trabajo de grado
 * @property {Object} trabajosGrado Objeto que carga la información de los trabajos de grado asociados
 * @property {Array} botonesNota Colección que maneja la configuración de los botones para registrar la revisión
 * @property {Array} botonesVer Colección que maneja la configuración de los botones para ver los detalles
 * @property {Array} botonesDevolver Colección de la configuración del botón para devolver el trabajo de grado
 * @property {String} observaciones Cambios solicitados por el revisor
 */
angular.module('poluxClienteApp')
    .controller('RevisionArlCtrl',
        function ($scope, $q, $translate, notificacionRequest, academicaRequest, utils, gestorDocumentalMidRequest, $window, poluxRequest, token_service, documentoRequest, parametrosRequest,autenticacionMidRequest) {
            var ctrl = this;

            ctrl.mensajeTrabajos = $translate.instant('LOADING.CARGANDO_TRABAJOS_DE_GRADO_ASOCIADOS');
            ctrl.mensajeTrabajo = $translate.instant('LOADING.CARGANDO_DATOS_TRABAJO_GRADO');
            ctrl.mensajeRegistrandoNota = $translate.instant('LOADING.REGISTRANDO_NOTA');
            ctrl.cargandoTrabajos = true;

            var Atributos = {
                rol: 'EXTENSION_PASANTIA',
            }

            notificacionRequest.enviarCorreo('Mensaje de registro de nota de TRABAJO DE GRADO Prueba funcional notificaciones', Atributos, ['101850341'], '', '', 'Se ha registrado la nota de parte de ' + token_service.getAppPayload().email + ' para el trabajo de grado asociado. .Cuando se desee observar el msj se puede copiar el siguiente link para acceder https://polux.portaloas.udistrital.edu.co/');

            $scope.botonesNota = [{
                clase_color: "ver",
                clase_css: "fa fa-pencil-square-o fa-lg  faa-shake animated-hover",
                titulo: $translate.instant('BTN.REVISAR_ARL'),
                operacion: 'revisarArl',
                estado: true
            },];

            $scope.botonesVer = [{
                clase_color: "ver",
                clase_css: "fa fa-eye fa-lg  faa-shake animated-hover",
                titulo: $translate.instant('BTN.VER_DETALLES'),
                operacion: 'ver',
                estado: true
            },];

            ctrl.gridOptions = {
                paginationPageSizes: [5, 10, 15, 20, 25],
                paginationPageSize: 10,
                enableFiltering: true,
                enableSorting: true,
                enableSelectAll: false,
                useExternalPagination: false,
            };

            ctrl.gridOptions.columnDefs = [{
                name: 'Estudiante',
                displayName: $translate.instant('CODIGO_ESTUDIANTE'),
                width: '25%',
            }, {
                name: 'TrabajoGrado.Modalidad.Nombre',
                displayName: $translate.instant('MODALIDAD'),
                width: '25%',
            }, {
                name: 'TrabajoGrado.EstadoTrabajoGrado.Nombre',
                displayName: $translate.instant('ESTADO'),
                width: '25%',
            }, {
                name: 'Acciones',
                displayName: $translate.instant('ACCIONES'),
                width: '25%',
                type: 'boolean',
                cellTemplate: `
                  <div>
                    <btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botonesVer" fila="row"></btn-registro>
                    <btn-registro ng-if="row.entity.permitirRegistrar" funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botonesNota" fila="row"></btn-registro>
                    <btn-registro ng-if="row.entity.permitirDevolver" funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botonesDevolver" fila="row"></btn-registro>
                  </div>`
            }];

            /**
       * @ngdoc method
       * @name getconsultarParametros
       * @methodOf poluxClienteApp.controller:RevisionArlCtrl
       * @description 
       * Consulta el servicio de {@link services/poluxService.service:parametrosRequest parametrosRequest} para extraer los datos necesarios
       * @param {undefined} undefined No requiere parámetros
       */
            async function getconsultarParametros() {
                return new Promise(async (resolve, reject) => {

                    var parametrosConsulta = $.param({
                        query: "DominioTipoDocumento__CodigoAbreviacion:DOC_PLX",
                        limit: 0,
                    });

                    await documentoRequest.get("tipo_documento", parametrosConsulta).then(function (responseTiposDocumento) {
                        ctrl.TiposDocumento = responseTiposDocumento.data;
                    });

                    parametrosConsulta = $.param({
                        query: "TipoParametroId__CodigoAbreviacion:MOD_TRG",
                        limit: 0,
                    });

                    await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (responseModalidades) {
                        ctrl.Modalidades = responseModalidades.data.Data;
                    });

                    parametrosConsulta = $.param({
                        query: "TipoParametroId__CodigoAbreviacion:EST_TRG",
                        limit: 0,
                    });

                    await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (responseEstadosTrabajoGrado) {
                        ctrl.EstadosTrabajoGrado = responseEstadosTrabajoGrado.data.Data;
                    });

                    parametrosConsulta = $.param({
                        query: "TipoParametroId__CodigoAbreviacion:ROL_TRG",
                        limit: 0,
                    });

                    await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (responseRolesTrabajoGrado) {
                        ctrl.RolesTrabajoGrado = responseRolesTrabajoGrado.data.Data;
                    });

                    parametrosConsulta = $.param({
                        query: "TipoParametroId__CodigoAbreviacion:EST_ESTU_TRG",
                        limit: 0,
                    });

                    await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (responseEstadosEstudianteTrabajoGrado) {
                        ctrl.EstadosEstudianteTrabajoGrado = responseEstadosEstudianteTrabajoGrado.data.Data;
                    });

                    parametrosConsulta = $.param({
                        query: "TipoParametroId__CodigoAbreviacion:DET_PASEXT",
                        limit: 0,
                    });

                    await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (responseDetallesPasantia) {
                        ctrl.DetallesPasantia = responseDetallesPasantia.data.Data;
                    });

                    parametrosConsulta = $.param({
                        query: "TipoParametroId__CodigoAbreviacion:EST_SOL",
                        limit: 0,
                    });

                    await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (responseEstadosSolicitudes) {
                        ctrl.EstadosSolicitud = responseEstadosSolicitudes.data.Data;
                    });

                    resolve();
                });
            }

            /**
       * @ngdoc method
       * @name cargarTrabajos
       * @methodOf poluxClienteApp.controller:RevisionArlCtrl
       * @description
       * Función que permite cargar los trabajos en los que el docente se encuentra actualmente activo.
       * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los datos de la base del aplicativo.
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} Retorna una promesa que se soluciona sin regresar ningún parametro
       */
            ctrl.cargarTrabajos = async function () {
                await getconsultarParametros();
                var defer = $q.defer();
                ctrl.cargandoTrabajos = true;

                let ModalidadTemp = ctrl.Modalidades.find(data => {
                    return data.CodigoAbreviacion == "PAS_PLX";
                });

                var estadosValidos = ["PECSPR_PLX", "ACEA_PLX", "EC_PLX"]
                var query = "trabajo_grado__estado_trabajo_grado.in:"
                var guardaPrimero = false;
                ctrl.EstadosTrabajoGrado.forEach(estadoTrGt => {
                    if (estadosValidos.includes(estadoTrGt.CodigoAbreviacion)) {
                        if (guardaPrimero) {
                            query += "|";
                        } else {
                            guardaPrimero = true;
                        }
                        query += estadoTrGt.Id.toString();
                    }
                });

                query += ",trabajo_grado__modalidad:" + ModalidadTemp.Id

                var parametrosTrabajoGrado = $.param({
                    limit: 0,
                    query: query,
                });

                poluxRequest.get("estudiante_trabajo_grado", parametrosTrabajoGrado)
                    .then(function (dataTrabajos) {
                        if (Object.keys(dataTrabajos.data[0]).length > 0) {
                            ctrl.trabajosGrado = dataTrabajos.data;

                            angular.forEach(ctrl.trabajosGrado, function (trabajo) {

                                let ModalidadTemp = ctrl.Modalidades.find(data => {
                                    return data.Id == trabajo.TrabajoGrado.Modalidad;
                                });
                                trabajo.TrabajoGrado.Modalidad = ModalidadTemp;

                                let EstadoTrabajoGradoTemp = ctrl.EstadosTrabajoGrado.find(data => {
                                    return data.Id == trabajo.TrabajoGrado.EstadoTrabajoGrado;
                                });
                                trabajo.TrabajoGrado.EstadoTrabajoGrado = EstadoTrabajoGradoTemp;

                                var estado = trabajo.TrabajoGrado.EstadoTrabajoGrado.CodigoAbreviacion;

                                if (estado == "ACEA_PLX") {
                                    trabajo.permitirRegistrar = true;
                                }

                            });
                            ctrl.gridOptions.data = ctrl.trabajosGrado;
                            defer.resolve();
                        } else {
                            ctrl.mensajeError = $translate.instant('ERROR.SIN_REVISIONES_ARL');
                            defer.reject("no hay trabajos de grado asociados");
                        }
                    })
                    .catch(function (error) {
                        ctrl.mensajeError = $translate.instant('ERROR.CARGANDO_TRABAJOS_DE_GRADO_ASOCIADOS');
                        defer.reject(error);
                    });
                return defer.promise;
            }

            ctrl.cargarTrabajos()
                .then(function () {
                    ctrl.cargandoTrabajos = false;
                })
                .catch(function (error) {
                    ctrl.errorCargando = true;
                    ctrl.cargandoTrabajos = false;
                })

            /**
            * @ngdoc method
            * @name getEstudiante
            * @methodOf poluxClienteApp.controller:RevisionArlCtrl
            * @description
            * Función que permite cargar los datos básicos de un estudiante.
            * Consulta el servicio de {@link services/academicaService.service:academicaRequest academicaRequest} para traer la información académica.
            * @param {Object} estudiante Estudiante que se consulta
            * @returns {Promise} Retorna una promesa que se soluciona sin regresar ningún parametro.
            */
            ctrl.getEstudiante = function (estudiante) {
                var defer = $q.defer();
                //consultar datos básicos del estudiante
                academicaRequest.get("datos_basicos_estudiante", [estudiante.Estudiante])
                    .then(function (responseDatosBasicos) {
                        if (!angular.isUndefined(responseDatosBasicos.data.datosEstudianteCollection.datosBasicosEstudiante)) {
                            estudiante.datos = responseDatosBasicos.data.datosEstudianteCollection.datosBasicosEstudiante[0];
                            defer.resolve();
                        } else {
                            defer.reject(error);
                        }
                    })
                    .catch(function (error) {
                        defer.reject(error);
                    });
                return defer.promise;
            }

            /**
             * @ngdoc method
             * @name getEstudiantes
             * @methodOf poluxClienteApp.controller:RevisionArlCtrl
             * @description
             * Función que permite cargar los estudiantes asociados a un trabajo de grado.
             * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los datos de la base del aplicativo.
             * @param {Object} trabajoGrado Trabajo de grado que se consulta
             * @returns {Promise} Retorna una promesa que se soluciona sin regresar ningún parametro.
             */
            ctrl.getEstudiantes = function (trabajoGrado) {
                var defer = $q.defer();
                //Se consultan los estudiantes activos en el trabajo de grado y sus datos
                let EstadoEstudianteTrabajoGradoTemp = ctrl.EstadosEstudianteTrabajoGrado.find(data => {
                    return data.CodigoAbreviacion == "EST_ACT_PLX";
                });
                var parametrosEstudiantes = $.param({
                    limit: 0,
                    query: "EstadoEstudianteTrabajoGrado:" + EstadoEstudianteTrabajoGradoTemp.Id + ",TrabajoGrado.Id:" + trabajoGrado.Id,
                });
                poluxRequest.get("estudiante_trabajo_grado", parametrosEstudiantes)
                    .then(function (responseEstudiantes) {
                        if (Object.keys(responseEstudiantes.data[0]).length > 0) {
                            trabajoGrado.estudiantes = responseEstudiantes.data;
                            var promesasEstudiante = [];
                            angular.forEach(trabajoGrado.estudiantes, function (estudiante) {
                                promesasEstudiante.push(ctrl.getEstudiante(estudiante));
                            });
                            $q.all(promesasEstudiante)
                                .then(function () {
                                    defer.resolve();
                                })
                                .catch(function (error) {
                                    defer.reject(error);
                                });
                        } else {
                            defer.reject("Sin estudiantes");
                        }
                    })
                    .catch(function (error) {
                        defer.reject(error);
                    });
                return defer.promise;
            }

            /**
            * @ngdoc method
            * @name getDocente
            * @methodOf poluxClienteApp.controller:RevisionArlCtrl
            * @description
            * Función que permite cargar los datos básicos de un docente.
            * Consulta el servicio de {@link services/academicaService.service:academicaRequest academicaRequest} para traer la información académica.
            * @param {Object} docente Docente que se consulta
            * @returns {Promise} Retorna una promesa que se soluciona sin regresar ningún parametro.
            */
            ctrl.getDocente = function (docente) {
                var defer = $q.defer();
                //consultar datos básicos del docente
                academicaRequest.get("docente_tg", [docente.Usuario])
                    .then(function (responseDatosBasicos) {

                        if (!angular.isUndefined(responseDatosBasicos.data.docenteTg.docente)) {
                            docente.datos = responseDatosBasicos.data.docenteTg.docente[0];
                            defer.resolve();
                        } else {
                            defer.reject(error);
                        }
                    })
                    .catch(function (error) {
                        defer.reject(error);
                    });
                return defer.promise;
            }

            /**
             * @ngdoc method
             * @name getDocentes
             * @methodOf poluxClienteApp.controller:RevisionArlCtrl
             * @description
             * Función que permite cargar los docentes asociados a un trabajo de grado.
             * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los datos de la base del aplicativo.
             * @param {Object} trabajoGrado Trabajo de grado que se consulta
             * @returns {Promise} Retorna una promesa que se soluciona sin regresar ningún parametro.
             */
            ctrl.getDocentes = function (trabajoGrado) {
                var defer = $q.defer();

                let RolTemp = ctrl.RolesTrabajoGrado.find(data => {
                    return data.CodigoAbreviacion == "DIRECTOR_PLX";
                });
                var parametrosDocente = $.param({
                    limit: 0,
                    query: "RolTrabajoGrado:" + RolTemp.Id + ",TrabajoGrado.Id:" + trabajoGrado.Id,
                });
                poluxRequest.get("vinculacion_trabajo_grado", parametrosDocente)
                    .then(function (responseDocente) {
                        if (Object.keys(responseDocente.data[0]).length > 0) {
                            trabajoGrado.docente = responseDocente.data;

                            var promesasDocente = [];
                            promesasDocente.push(ctrl.getDocente(trabajoGrado.docente[0]));
                            $q.all(promesasDocente)
                                .then(function () {
                                    defer.resolve();
                                })
                                .catch(function (error) {
                                    defer.reject(error);
                                });
                        } else {
                            defer.reject("Sin docentes");
                        }
                    })
                    .catch(function (error) {
                        defer.reject(error);
                    });
                return defer.promise;
            }

            /**
            * @ngdoc method
            * @name getDocumento
            * @methodOf poluxClienteApp.controller:RevisionArlCtrl
            * @param {number} docid Identificador del documento en {@link services/poluxClienteApp.service:nuxeoClient nuxeoClient}
            * @returns {undefined} No retorna ningún valor
            * @description 
            * Se obtiene el documento alojado en nuxeo para mostrarse en una nueva ventana.
            */
            ctrl.getDocumento = function () {
                // Muestra de documento con gestor documental
                gestorDocumentalMidRequest.get('/document/' + ctrl.docTrabajoGrado.DocumentoEscrito.Enlace).then(function (response) {
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
            * @name obtenerParametrosDocumentoTrabajoGrado
            * @methodOf poluxClienteApp.controller:RevisionArlCtrl
            * @description
            * Función que define los parámetros para consultar en la tabla documento_trabajo_grado.
            * @param {Number} idTrabajoGrado El identificador del trabajo de grado a consultar
            * @returns {String} La sentencia para la consulta correspondiente
            */
            ctrl.obtenerParametrosDocumentoTrabajoGrado = function (idTrabajoGrado) {
                let TipoDocumentoTemp = ctrl.TiposDocumento.find(data => {
                    return data.CodigoAbreviacion == "DPAS_PLX"
                });
                return $.param({
                    query: "DocumentoEscrito.TipoDocumentoEscrito:" + TipoDocumentoTemp.Id + "," +
                        "TrabajoGrado.Id:" +
                        idTrabajoGrado,
                    limit: 1
                });
            }

            /**
            * @ngdoc method
            * @name consultarDocTrabajoGrado
            * @methodOf poluxClienteApp.controller:RevisionArlCtrl
            * @description
            * Función que recorre la base de datos de acuerdo al trabajo de grado vinculado y trae el documento asociado.
            * Llama a la función: obtenerParametrosDocumentoTrabajoGrado.
            * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para operar sobre la base de datos del proyecto.
            * @param {Object} vinculacionTrabajoGrado La vinculación hacia el trabajo de grado seleccionado
            * @returns {Promise} La información sobre el documento, el mensaje en caso de no corresponder la información, o la excepción generada
            */
            ctrl.consultarDocTrabajoGrado = function (vinculacionTrabajoGrado) {
                var deferred = $q.defer();
                poluxRequest.get("documento_trabajo_grado", ctrl.obtenerParametrosDocumentoTrabajoGrado(vinculacionTrabajoGrado.TrabajoGrado.Id))
                    .then(function (respuestaDocumentoTrabajoGrado) {
                        if (Object.keys(respuestaDocumentoTrabajoGrado.data[0]).length > 0) {
                            deferred.resolve(respuestaDocumentoTrabajoGrado.data[0]);
                        } else {
                            deferred.reject($translate.instant("ERROR.SIN_TRABAJO_GRADO"));
                        }
                    })
                    .catch(function (excepcionDocumentoTrabajoGrado) {
                        deferred.reject($translate.instant("ERROR.CARGANDO_TRABAJO_GRADO"));
                    });
                return deferred.promise;
            }

            /**
            * @ngdoc method
            * @name obtenerParametrosDetalleTrabajoGrado
            * @methodOf poluxClienteApp.controller:RevisionArlCtrl
            * @description
            * Función que define los parámetros para consultar en la tabla documento_trabajo_grado.
            * @param {Number} idTrabajoGrado El identificador del trabajo de grado a consultar
            * @returns {String} La sentencia para la consulta correspondiente
            */
            ctrl.obtenerParametrosDetalleTrabajoGrado = function (idTrabajoGrado) {
                return $.param({
                    query: "TrabajoGrado.Id:" + idTrabajoGrado,
                    limit: 0
                });
            }

            /**
            * @ngdoc method
            * @name consultarDetalleTrabajoGrado
            * @methodOf poluxClienteApp.controller:RevisionArlCtrl
            * @description
            * Función que recorre la base de datos de acuerdo al trabajo de grado vinculado y trae el documento asociado.
            * Llama a la función: obtenerParametrosDetalleTrabajoGrado.
            * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para operar sobre la base de datos del proyecto.
            * @param {Object} vinculacionTrabajoGrado La vinculación hacia el trabajo de grado seleccionado
            * @returns {Promise} La información sobre el documento, el mensaje en caso de no corresponder la información, o la excepción generada
            */
            ctrl.consultarDetalleTrabajoGrado = function (vinculacionTrabajoGrado) {
                var deferred = $q.defer();
                poluxRequest.get("detalle_trabajo_grado", ctrl.obtenerParametrosDetalleTrabajoGrado(vinculacionTrabajoGrado.TrabajoGrado.Id))
                    .then(function (respuestaDetalleTrabajoGrado) {
                        if (Object.keys(respuestaDetalleTrabajoGrado.data).length > 0) {
                            deferred.resolve(respuestaDetalleTrabajoGrado.data);
                        } else {
                            deferred.reject($translate.instant("ERROR.SIN_TRABAJO_GRADO"));
                        }
                    })
                    .catch(function (excepcionDocumentoTrabajoGrado) {
                        deferred.reject($translate.instant("ERROR.CARGANDO_TRABAJO_GRADO"));
                    });
                return deferred.promise;
            }

            /**
             * @ngdoc method
             * @name cargarTrabajo
             * @methodOf poluxClienteApp.controller:RevisionArlCtrl
             * @description
             * Función que permite cargar los datos de un trabajo de grado específico
             * @param {Object} fila Fila que se selecciona
             * @returns {undefined} No hace retorno de resultados
             */
            ctrl.cargarTrabajo = function (fila) {
                ctrl.cargandoTrabajo = true;
                ctrl.trabajoSeleccionado = fila.entity.TrabajoGrado;
                ctrl.consultarDocTrabajoGrado(fila.entity).then(function (resultadoDocTrabajoGrado) {
                    ctrl.docTrabajoGrado = resultadoDocTrabajoGrado;
                })
                ctrl.consultarDetalleTrabajoGrado(fila.entity).then(function (resultadoDetalleTG) {
                    let EmpresaTgTemp = ctrl.DetallesPasantia.find(data => {
                        return data.CodigoAbreviacion == "EMPRZ_PLX"
                    });

                    let NitTgTemp = ctrl.DetallesPasantia.find(data => {
                        return data.CodigoAbreviacion == "NIT_PLX"
                    });

                    angular.forEach(resultadoDetalleTG, function (detalle) {

                        var parametro = detalle.Parametro;

                        if (parametro == EmpresaTgTemp.Id) {
                            ctrl.trabajoSeleccionado.Empresa = detalle.Valor
                        }
                        if (parametro == NitTgTemp.Id) {
                            ctrl.trabajoSeleccionado.Nit = detalle.Valor
                        }
                    });

                })

                //Promesas del tg
                var promesasTrabajo = [];
                promesasTrabajo.push(ctrl.getEstudiantes(ctrl.trabajoSeleccionado));
                promesasTrabajo.push(ctrl.getDocentes(ctrl.trabajoSeleccionado));



                //Se muestra el modal
                $('#modalRevisarARL').modal('show');
                $q.all(promesasTrabajo)
                    .then(function () {
                        ctrl.cargandoTrabajo = false;
                    })
                    .catch(function (error) {
                        ctrl.mensajeErrorTrabajo = $translate.instant('ERROR.CARGAR_TRABAJO_GRADO');
                        ctrl.errorCargandoTrabajo = true;
                        ctrl.cargandoTrabajo = false;
                    });
            }

            /**
            * @ngdoc method
            * @name loadrow
            * @methodOf poluxClienteApp.controller:RevisionArlCtrl
            * @description 
            * Ejecuta las funciones especificas de los botones seleccionados en el ui-grid decidiendo si se opera la respuesta.
            * @param {Object} row Fila seleccionada en el uigrid que contiene los detalles del trabajo de grado que se quiere consultar
            * @param {String} operacion Operación que se debe ejecutar cuando se selecciona el botón
            * @returns {undefined} No hace retorno de resultados
            */
            $scope.loadrow = function (row, operacion) {
                switch (operacion) {
                    case "ver":
                        ctrl.revisarArl = false;
                        ctrl.devolver = false;
                        ctrl.cargarTrabajo(row)
                        //$('#modalVerSolicitud').modal('show');
                        break;
                    case "revisarArl":
                        ctrl.devolver = false;
                        ctrl.revisarArl = true;
                        ctrl.cargarTrabajo(row);
                        break;
                    default:
                        break;
                }
            };

            /**
            * @ngdoc method
            * @name EnvioNotificacion
            * @methodOf poluxClienteApp.controller:RevisionArlCtrl
            * @param {undefined} undefined No requiere parámetros
            * @returns {undefined} No retorna ningún valor
            * @description 
            * Función que se encarga de enviar la notificación de la respuesta de la solicitud
            */
            ctrl.EnvioNotificacion = async function () {
                
                var correos = [], respuesta


                var data_auth_mid = {
                    numero : ctrl.trabajoSeleccionado.estudiantes[0].Estudiante
                  }
          
                  await autenticacionMidRequest.post("token/documentoToken",data_auth_mid).then(function(response){//se busca el correo con el documento
                    correos.push(response.data.email)
                  })

                angular.forEach(ctrl.EstadosSolicitud,function(estadoSolicitud){
                    if(estadoSolicitud.CodigoAbreviacion == ctrl.respuestaRevision){
                        respuesta = estadoSolicitud.Nombre
                    }
                })

                var data_correo = {
                    "Source": "notificacionPolux@udistrital.edu.co",
                    "Template": "POLUX_PLANTILLA_RESPUESTA_ARL",
                    "Destinations": [
                        {
                            "Destination": {
                                "ToAddresses": correos
                            },
                            "ReplacementTemplateData": {
                                "respuesta": respuesta,
                                "titulo_tg": ctrl.trabajoSeleccionado.Titulo
                            }
                        }
                    ]
                }
                
                //console.log(correos)

                //DESCOMENTAR AL SUBIR A PRODUCCIÓN
                /*notificacionRequest.post("email/enviar_templated_email", data_correo).then(function (response) {
                    console.log("Envia el correo")
                    console.log(response)
                }).catch(function (error) {
                    console.log("Error: ", error)
                });*/
            }

            /**
            * @ngdoc method
            * @name responder
            * @methodOf poluxClienteApp.controller:RevisionArlCtrl
            * @param {undefined} undefined No requiere parámetros
            * @returns {undefined} No retorna ningún valor
            * @description 
            * Crea la data necesaria para responder la solicitud y la envía al servicio put de 
            * {@link services/poluxService.service:poluxRequest poluxRequest} para actualizar el estado del trabajo de grado.
            */
            ctrl.responder = function () {
                console.log(ctrl.respuestaRevision)

                if (ctrl.respuestaRevision == "AOP_PLX") {//Se aprueba la ARL

                    let EstadoTgTemp = ctrl.EstadosTrabajoGrado.find(data => {//Se busca el estado trabajo grado "En Curso"
                        return data.CodigoAbreviacion == "EC_PLX"
                    });

                    var parametrosTrabajoGrado = $.param({//Se busca el trabajo de grado por su ID
                        limit: 1,
                        query: "Id:" + ctrl.trabajoSeleccionado.Id,
                    });

                    poluxRequest.get("trabajo_grado", parametrosTrabajoGrado)
                        .then(function (dataTrabajos) {
                            ctrl.trabajoGrado = dataTrabajos.data[0]

                            console.log(ctrl.trabajoGrado)

                            //Se actualiza el estado del trabajo de grado

                            ctrl.trabajoGrado.EstadoTrabajoGrado = EstadoTgTemp.Id

                            poluxRequest.put("trabajo_grado", ctrl.trabajoGrado.Id, ctrl.trabajoGrado)
                                .then(function (dataTrabajos) {

                                    ctrl.EnvioNotificacion()

                                    swal(
                                        $translate.instant("REGISTRO_EXITOSO"),
                                        $translate.instant("REVISION_ARL.ARL_APROBADA"),
                                        'success'
                                    ).then(function (responseSwal) {
                                        if (responseSwal) {
                                            location.reload();
                                        }
                                    });

                                })
                                .catch(function (error) {
                                    swal(
                                        $translate.instant("MENSAJE_ERROR"),
                                        $translate.instant("REVISION_ARL.ARL_RECHAZADA"),
                                        'warning'
                                    );
                                });

                        })
                        .catch(function (error) {
                            ctrl.mensajeErrorTrabajo = $translate.instant('ERROR.CARGAR_TRABAJO_GRADO');
                            ctrl.errorCargandoTrabajo = true;
                            ctrl.cargandoTrabajo = false;
                        });

                }
                else {//Se rechaza la ARL
                    let EstadoTgTemp = ctrl.EstadosTrabajoGrado.find(data => {//Se busca el estado de ARL Rechazada
                        return data.CodigoAbreviacion == "ARC_PLX"
                    });

                    var parametrosTrabajoGrado = $.param({
                        limit: 1,
                        query: "Id:" + ctrl.trabajoSeleccionado.Id,
                    });

                    poluxRequest.get("trabajo_grado", parametrosTrabajoGrado)
                        .then(function (dataTrabajos) {
                            ctrl.trabajoGrado = dataTrabajos.data[0]

                            ctrl.trabajoGrado.EstadoTrabajoGrado = EstadoTgTemp.Id

                            poluxRequest.put("trabajo_grado", ctrl.trabajoGrado.Id, ctrl.trabajoGrado)
                                .then(function (dataTrabajos) {

                                    ctrl.EnvioNotificacion()

                                    swal(
                                        $translate.instant("REGISTRO_EXITOSO"),
                                        $translate.instant("REVISION_ARL.ARL_RECHAZADA"),
                                        'success'
                                    ).then(function (responseSwal) {
                                        if (responseSwal) {
                                            location.reload();
                                        }
                                    });

                                })
                                .catch(function (error) {
                                    swal(
                                        $translate.instant("MENSAJE_ERROR"),
                                        $translate.instant("REVISION_ARL.ARL_RECHAZADA"),
                                        'warning'
                                    );
                                });

                        })
                        .catch(function (error) {
                            ctrl.mensajeErrorTrabajo = $translate.instant('ERROR.CARGAR_TRABAJO_GRADO');
                            ctrl.errorCargandoTrabajo = true;
                            ctrl.cargandoTrabajo = false;
                        });
                }
            }
        });