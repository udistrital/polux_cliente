'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:revisionDocumento
 * @description
 * # revisionDocumento
 */
angular.module('poluxClienteApp')
    .directive('revisionDocumento', function(poluxRequest, $translate, $route,academicaRequest,nuxeoClient) {
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
            controller: function($scope) {
                var ctrl = this;

                ctrl.mensajeCargando = $translate.instant("LOADING.REGISTRANDO_REVISION");

                $scope.$watch('paginadoc', function() {
                    $scope.paginadoc = $scope.paginadoc;
                });

                console.log($scope.revisionid);
                ctrl.correcciones = [];
                poluxRequest.get("revision_trabajo_grado", $.param({
                    query: "Id:" + $scope.revisionid
                })).then(function(response) {
                    console.log(response);
                    ctrl.revision = response.data[0];
                });
                poluxRequest.get("correccion", $.param({
                    query: "RevisionTrabajoGrado.Id:" + $scope.revisionid,
                    sortby: "Id",
                    order: "asc"
                })).then(function(response) {
                    if (response.data != null) {
                        ctrl.correcciones = response.data;
                    } else {
                        ctrl.correcciones = [];
                    }
                });

                ctrl.copyObject = function(Obj) {
                    return JSON.parse(JSON.stringify(Obj));
                };

                ctrl.editar = function(correc, temp) {
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
                ctrl.verpag = function(pag) {
                    $scope.paginaset = pag;
                };

                ctrl.agregar_correccion = function() {
                    ctrl.correccion.RevisionTrabajoGrado = {
                        Id: $scope.revisionid
                    };
                    ctrl.correccion.Pagina = 1;
                    ctrl.correccion.Documento = false;
                    ctrl.correccion.Cambio = "nuevo";
                    ctrl.correcciones.push(ctrl.correccion);
                    ctrl.correccion = {};
                };

                ctrl.eliminar_correccion = function(correccion) {
                    if (correccion.Id != null) {
                        ctrl.correcciones_eliminadas.push(correccion);
                    }
                    ctrl.correcciones.splice(ctrl.correcciones.indexOf(correccion), 1);
                };

                ctrl.cancelar_revisado = function() {
                    poluxRequest.get("correccion", $.param({
                        query: "RevisionTrabajoGrado.Id:" + $scope.revisionid,
                        sortby: "Id",
                        order: "asc"
                    })).then(function(response) {
                        if (response.data != null) {
                            ctrl.correcciones = response.data;
                        } else {
                            ctrl.correcciones = [];
                        }
                    });
                    ctrl.correcciones_eliminadas = [];
                };

                ctrl.guardar_revision = function(accion) {
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
                              .then(function(confirmacionDelUsuario) {
                                if (confirmacionDelUsuario.value) {
                                    ctrl.cargandoRevision = true;
                                    if (ctrl.documentModel){
                                        //SI la revision tiene un documento se carga y se agrega a las correcciones
                                        nuxeoClient.createDocument(ctrl.revision.DocumentoTrabajoGrado.TrabajoGrado.Titulo+" Correcciones", "Correcciones sobre el proyecto", ctrl.documentModel, "Correcciones", undefined)
                                        .then(function(respuestaCrearDocumento) {
                                            console.log(respuestaCrearDocumento);
                                            ctrl.correcciones.push({
                                                Observacion: respuestaCrearDocumento,
                                                Justificacion: "Por favor descargue el documento de observaciones",
                                                Pagina: 1,
                                                RevisionTrabajoGrado: {
                                                  Id:  $scope.revisionid
                                                },
                                                Documento: true
                                            });
                                            ctrl.registrarRevision();
                                        })
                                        .catch(function(excepcionCrearDocumento) {
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

                ctrl.registrarRevision = function(){
                    //Se consulta la información de quien registra los comentarios
                    academicaRequest.get("docente_tg", [$scope.docdocente])
                    .then(function(informacionDocente) {
                        if (!angular.isUndefined(informacionDocente.data.docenteTg.docente)) {
                            var nombreDocente = informacionDocente.data.docenteTg.docente[0].nombre;
                            ctrl.revision.EstadoRevisionTrabajoGrado.Id = 3;
                            var fecha = new Date();
                            ctrl.revision.FechaRevision = fecha;
                            var comentarios = [];
                            angular.forEach(ctrl.correcciones, function(correccion){
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
                            .then(function(respuestaRegistrarRevisionTg) {
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
                            .catch(function(excepcionRegistrarRevisionTg) {
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
                    .catch(function(excepcionInformacionDocente) {
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