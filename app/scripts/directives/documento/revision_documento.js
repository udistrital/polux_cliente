'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:revisionDocumento
 * @description
 * # revisionDocumento
 * Directiva que permite revisar un documento de trabajo de grado.
 * Controlador: {@link poluxClienteApp.directive:revisionDocumento.controller:revisionDocumentoCtrl revisionDocumentoCtrl}
 * @param {number} revisionid Id de la revisión que se carga.
 * @param {number} paginadoc Página del documento en la que se realiza la revisión.
 * @param {number} paginaset Página del documento que se visualiza en directiva {@link poluxClienteApp.directive:verDocumento verDocumento}.
 * @param {number} revisionestado Estado de la revisión que se muestra.
 * @param {string} docdocente Documento del docente que revisan el documento.
 */
angular.module('poluxClienteApp')
    .directive('revisionDocumento', function (poluxRequest, $translate, $route, academicaRequest, nuxeoClient) {
        return {
            restrict: "E",
            scope: {
                revisionid: '=?',
                paginadoc: '=?',
                paginaset: '=?',
                revisionestado: '=?',
                docdocente: '='
            },
            templateUrl: "views/directives/documento/revision_documento.html",
            /**
             * @ngdoc controller
             * @name poluxClienteApp.directive:revisionDocumento.controller:revisionDocumentoCtrl
             * @description
             * # revisionDocumentoCtrl
             * # Controller of the poluxClienteApp.directive:revisionDocumento
             * Controlador de la directiva {@link poluxClienteApp.directive:revisionDocumento revisionDocumento}.
             * @requires services/poluxService.service:poluxRequest
             * @requires decorators/poluxClienteApp.decorator:TextTranslate
             * @requires $filter
             * @requires $route
             * @requires $scope
             * @requires services/poluxService.service:nuxeoClient
             * @requires services/academicaService.service:academicaRequest
             * @property {string} mensajeCargando Mensaje que se muestra mientras se esta cargando.
             * @property {array} correcciones Arreglo de correcciones de la revisión.
             * @property {object} revision Revisión.
             */
            controller: function ($scope) {
                var ctrl = this;

                ctrl.mensajeCargando = $translate.instant("LOADING.REGISTRANDO_REVISION");

                /**
                     * @ngdoc method
                     * @name watch
                     * @methodOf poluxClienteApp.directive:revisionDocumento.controller:revisionDocumentoCtrl
                     * @param {number} paginadoc Número de la página a la que desea ir al usuario.
                     * @returns {undefined} No retorna ningún valor.
                     * @description 
                     * Permite dirigirse a una página seleccionada en la revisión al documento.
                     */
                $scope.$watch('paginadoc', function () {
                    $scope.paginadoc = $scope.paginadoc;
                });

                console.log($scope.revisionid);
                ctrl.correcciones = [];

                /**
                     * @ngdoc method
                     * @name cargar
                     * @methodOf poluxClienteApp.directive:revisionDocumento.controller:revisionDocumentoCtrl
                     * @param {undefined} undefined No recibe ningún parametro.
                     * @returns {undefined} No retorna ningún valor.
                     * @description 
                     * Permite la data de la revisión y las correcciones.
                     */
                poluxRequest.get("revision_trabajo_grado", $.param({
                    query: "Id:" + $scope.revisionid
                })).then(function (response) {
                    console.log(response);
                    ctrl.revision = response.data[0];
                });
                poluxRequest.get("correccion", $.param({
                    query: "RevisionTrabajoGrado.Id:" + $scope.revisionid,
                    sortby: "Id",
                    order: "asc"
                })).then(function (response) {
                    if (Object.keys(response.data[0]).length > 0) {
                        ctrl.correcciones = response.data;
                    } else {
                        ctrl.correcciones = [];
                    }
                });

                /**
                     * @ngdoc method
                     * @name copyObject
                     * @methodOf poluxClienteApp.directive:revisionDocumento.controller:revisionDocumentoCtrl
                     * @param {undefined} undefined No recibe ningún parametro.
                     * @returns {undefined} No retorna ningún valor.
                     * @description 
                     * Permite clonar un objeto.
                     */
                ctrl.copyObject = function (Obj) {
                    return JSON.parse(JSON.stringify(Obj));
                };

                /**
                     * @ngdoc method
                     * @name editar
                     * @methodOf poluxClienteApp.directive:revisionDocumento.controller:revisionDocumentoCtrl
                     * @param {object} correc Corrección que se va a editar.
                     * @param {object} temp Corrección temporal editada.
                     * @returns {undefined} No retorna ningún valor.
                     * @description 
                     * Permite clonar un objeto.
                     */
                ctrl.editar = function (correc, temp) {
                    console.log("edit");
                    for (var key in correc) {
                        correc[key] = temp[key];
                    }
                    if (temp.agregarpag) {
                        correc.Pagina = $scope.paginadoc;
                    }
                    if (correc.Cambio != "nuevo") {
                        correc.Cambio = "editado";
                    }
                    /*correc.Observacion = temp.Observacion;
                    correc.Justificacion = temp.Justificacion;*/
                };

                ctrl.correccion = {};
                ctrl.correcciones_eliminadas = [];
                ctrl.fecha = new Date();
                ctrl.agregarpag = false;

                /**
                     * @ngdoc method
                     * @name verpag
                     * @methodOf poluxClienteApp.directive:revisionDocumento.controller:revisionDocumentoCtrl
                     * @param {undefined} undefined No recibe ningún parametro.
                     * @returns {undefined} No retorna ningún valor.
                     * @description 
                     * Permite ir a una página en especifico.
                     */
                ctrl.verpag = function (pag) {
                    $scope.paginaset = pag;
                };

                /**
                     * @ngdoc method
                     * @name agregar_correccion
                     * @methodOf poluxClienteApp.directive:revisionDocumento.controller:revisionDocumentoCtrl
                     * @param {undefined} undefined No recibe ningún parametro.
                     * @returns {undefined} No retorna ningún valor.
                     * @description 
                     * Permite agregar una correción al arreglo de correcciones.
                     */
                ctrl.agregar_correccion = function () {
                    ctrl.correccion.RevisionTrabajoGrado = {
                        Id: $scope.revisionid
                    };
                    ctrl.correccion.Pagina = 1;
                    ctrl.correccion.Documento = false;
                    ctrl.correccion.Cambio = "nuevo";
                    ctrl.correcciones.push(ctrl.correccion);
                    ctrl.correccion = {};
                };

                /**
                     * @ngdoc method
                     * @name eliminar_correccion
                     * @methodOf poluxClienteApp.directive:revisionDocumento.controller:revisionDocumentoCtrl
                     * @param {object} correccion Corrección que se va a eliminar.
                     * @returns {undefined} No retorna ningún valor.
                     * @description 
                     * Permite eliminar correcciones.
                     */                
                ctrl.eliminar_correccion = function (correccion) {
                    if (correccion.Id != null) {
                        ctrl.correcciones_eliminadas.push(correccion);
                    }
                    ctrl.correcciones.splice(ctrl.correcciones.indexOf(correccion), 1);
                };

                /**
                     * @ngdoc method
                     * @name cancelar_revisado
                     * @methodOf poluxClienteApp.directive:revisionDocumento.controller:revisionDocumentoCtrl
                     * @param {undefined} undefined No recibe ningún parametro.
                     * @returns {undefined} No retorna ningún valor.
                     * @description 
                     * Cancela la revisión actual del documento.
                     */
                ctrl.cancelar_revisado = function () {
                    poluxRequest.get("correccion", $.param({
                        query: "RevisionTrabajoGrado.Id:" + $scope.revisionid,
                        sortby: "Id",
                        order: "asc"
                    })).then(function (response) {
                        if (response.data != null) {
                            ctrl.correcciones = response.data;
                        } else {
                            ctrl.correcciones = [];
                        }
                    });
                    ctrl.correcciones_eliminadas = [];
                };

                /**
                     * @ngdoc method
                     * @name guardar_revision
                     * @methodOf poluxClienteApp.directive:revisionDocumento.controller:revisionDocumentoCtrl
                     * @param {undefined} undefined No recibe ningún parametro.
                     * @returns {undefined} No retorna ningún valor.
                     * @description 
                     * Permite guardar la corrección y los comentarios llamando la función registrarRevisión, si es necesario carga
                     * el documento de revisiones en {@link services/poluxService.service:nuxeoClient nuxeoClient}.
                     */
                ctrl.guardar_revision = function (accion) {
                    /*switch (accion) {
                        case "borrador":
                            console.log(ctrl.revision);
                            if (ctrl.revision.EstadoRevisionTrabajoGrado.Id != 2) {
                                ctrl.revision.EstadoRevisionTrabajoGrado.Id=2;
                                poluxRequest.put("revision_trabajo_grado", ctrl.revision.Id, ctrl.revision);
                            }
                            break;
                        case "finalizar":
                            ctrl.revision.EstadoRevisionTrabajoGrado.Id = 3;
                            ctrl.revision.FechaRevision = new Date();
                            poluxRequest.put("revision_trabajo_grado", ctrl.revision.Id, ctrl.revision);
                            $scope.revisionestado = ctrl.revision.Estado;
                            break;
                    }
                    for (var i = 0; i < ctrl.correcciones.length; i++) {
                        if (ctrl.correcciones[i].Cambio == "nuevo") {
                            console.log(ctrl.correcciones[i]);
                            poluxRequest.post("correccion", ctrl.correcciones[i]);
                        }
                        if (ctrl.correcciones[i].Cambio == "editado") {
                            poluxRequest.put("correccion", ctrl.correcciones[i].Id, ctrl.correcciones[i]);
                        }
                    }
                    for (var j = 0; j < ctrl.correcciones_eliminadas.length; j++) {
                        poluxRequest.delete("correccion", ctrl.correcciones_eliminadas[j].Id);
                    }*/
                    switch (accion) {
                        case "borrador":
                            break;
                        case "finalizar":
                            swal({
                                title: $translate.instant("REVISAR_PROYECTO.CONFIRMACION"),
                                text: $translate.instant("REVISAR_PROYECTO.MENSAJE_CONFIRMACION_PLANO"),
                                type: "info",
                                confirmButtonText: $translate.instant("ACEPTAR"),
                                cancelButtonText: $translate.instant("CANCELAR"),
                                showCancelButton: true
                            })
                                .then(function (confirmacionDelUsuario) {
                                    if (confirmacionDelUsuario) {
                                        ctrl.cargandoRevision = true;
                                        if (ctrl.documentModel) {
                                            //SI la revision tiene un documento se carga y se agrega a las correcciones
                                            nuxeoClient.createDocument(ctrl.revision.DocumentoTrabajoGrado.TrabajoGrado.Titulo + " Correcciones", "Correcciones sobre el proyecto", ctrl.documentModel, "correcciones", undefined)
                                                .then(function (respuestaCrearDocumento) {
                                                    console.log(respuestaCrearDocumento);
                                                    ctrl.correcciones.push({
                                                        Observacion: respuestaCrearDocumento,
                                                        Justificacion: "Por favor descargue el documento de observaciones",
                                                        Pagina: 1,
                                                        RevisionTrabajoGrado: {
                                                            Id: $scope.revisionid
                                                        },
                                                        Documento: true
                                                    });
                                                    ctrl.registrarRevision();
                                                })
                                                .catch(function (excepcionCrearDocumento) {
                                                    console.log(excepcionCrearDocumento);
                                                    ctrl.cargandoRevision = false;
                                                    swal(
                                                        $translate.instant("ERROR.SUBIR_DOCUMENTO"),
                                                        $translate.instant("VERIFICAR_DOCUMENTO"),
                                                        'warning'
                                                    );
                                                });
                                            //console.log(ctrl.revision.DocumentoTrabajoGrado.TrabajoGrado.Titulo);
                                        } else {
                                            ctrl.registrarRevision();
                                        }
                                    }
                                });
                            break;
                    }
                };

                /**
                     * @ngdoc method
                     * @name registrarRevision
                     * @methodOf poluxClienteApp.directive:revisionDocumento.controller:revisionDocumentoCtrl
                     * @param {undefined} undefined No recibe ningún parametro.
                     * @returns {undefined} No retorna ningún valor.
                     * @description 
                     * Permite registrar la revisión con el servicio {@link services/poluxService.service:poluxRequest poluxRequest}.
                     */
                ctrl.registrarRevision = function () {
                    //Se consulta la información de quien registra los comentarios
                    academicaRequest.get("docente_tg", [$scope.docdocente])
                        .then(function (informacionDocente) {
                            if (!angular.isUndefined(informacionDocente.data.docenteTg.docente)) {
                                var nombreDocente = informacionDocente.data.docenteTg.docente[0].nombre;
                                ctrl.revision.EstadoRevisionTrabajoGrado.Id = 3;
                                var fecha = new Date();
                                ctrl.revision.FechaRevision = fecha;
                                var comentarios = [];
                                angular.forEach(ctrl.correcciones, function (correccion) {
                                    comentarios.push({
                                        Comentario: correccion.Justificacion,
                                        Fecha: fecha,
                                        Autor: nombreDocente,
                                        Correccion: correccion,
                                    });
                                });
                                var data_transaccion = {
                                    RevisionTrabajoGrado: ctrl.revision,
                                    Comentarios: comentarios
                                }
                                console.log(data_transaccion);
                                poluxRequest.post("tr_registrar_revision_tg", data_transaccion)
                                    .then(function (respuestaRegistrarRevisionTg) {
                                        if (respuestaRegistrarRevisionTg.data[0] === "Success") {
                                            swal(
                                                $translate.instant("REGISTRAR_REVISION.CONFIRMACION"),
                                                $translate.instant("REGISTRAR_REVISION.REGISTRADA"),
                                                'success'
                                            );
                                            ctrl.cargandoRevision = false;
                                            $route.reload();
                                        } else {
                                            swal(
                                                $translate.instant("REGISTRAR_REVISION.CONFIRMACION"),
                                                $translate.instant(respuestaRegistrarRevisionTg.data[1]),
                                                'warning'
                                            );
                                            ctrl.cargandoRevision = false;
                                        }
                                    })
                                    .catch(function (excepcionRegistrarRevisionTg) {
                                        console.log(excepcionRegistrarRevisionTg);
                                        swal(
                                            $translate.instant("REGISTRAR_REVISION.CONFIRMACION"),
                                            $translate.instant("REGISTRAR_REVISION.ERROR"),
                                            'warning'
                                        );
                                        ctrl.cargandoRevision = false;
                                    })
                            } else {
                                swal(
                                    $translate.instant("REGISTRAR_REVISION.CONFIRMACION"),
                                    $translate.instant("REGISTRAR_REVISION.ERROR"),
                                    'warning'
                                );
                                ctrl.cargandoRevision = false;
                            }
                        })
                        .catch(function (excepcionInformacionDocente) {
                            console.log(excepcionInformacionDocente);
                            swal(
                                $translate.instant("REGISTRAR_REVISION.CONFIRMACION"),
                                $translate.instant("REGISTRAR_REVISION.ERROR"),
                                'warning'
                            );
                            ctrl.cargandoRevision = false;
                        })
                    /*
                    if (ctrl.correcciones.length > 0) {
                        poluxRequest.post("tr_registrar_revision_tg", data_transaccion)
                            .then(function(respuestaRegistrarRevisionTg) {
                                if (respuestaRegistrarRevisionTg.data[0] === "Success") {
                                    swal(
                                        $translate.instant("REGISTRAR_REVISION.CONFIRMACION"),
                                        $translate.instant("REGISTRAR_REVISION.REGISTRADA"),
                                        'success'
                                    );
                                    $route.reload();
                                } else {
                                    swal(
                                        $translate.instant("REGISTRAR_REVISION.CONFIRMACION"),
                                        $translate.instant(respuestaRegistrarRevisionTg.data[1]),
                                        'warning'
                                    );
                                }
                            })
                            .catch(function(excepcionRegistrarRevisionTg) {
                                swal(
                                    $translate.instant("REGISTRAR_REVISION.CONFIRMACION"),
                                    $translate.instant("REGISTRAR_REVISION.ERROR"),
                                    'warning'
                                );
                            })
                    } else {
                        swal(
                            $translate.instant("REGISTRAR_REVISION.CONFIRMACION"),
                            $translate.instant("REGISTRAR_REVISION.AGREGAR_COMENTARIO"),
                            'warning'
                        );
                    }*/
                }
            },
            controllerAs: "d_revisionDocumento"
        };
    });