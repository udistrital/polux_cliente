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
 * @param {Object} estadorev Arreglo de estados de revisión de los trabajos de grado.
 * @param {Object} tipodocumento Arreglo de los tipos de documentos.
 */
angular.module('poluxClienteApp')
    .directive('revisionDocumento', function (poluxRequest, poluxMidRequest, nuxeoMidRequest,utils,gestorDocumentalMidRequest,$translate, $route, academicaRequest, nuxeoClient,notificacionRequest) {
        return {
            restrict: "E",
            scope: {
                revisionid: '=?',
                paginadoc: '=?',
                paginaset: '=?',
                revisionestado: '=?',
                docdocente: '=',
                estadorev: '=?',
                tipodocumento: '='
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
                    ctrl.revision = response.data.Data[0];
                });
                poluxRequest.get("correccion", $.param({
                    query: "RevisionTrabajoGrado.Id:" + $scope.revisionid,
                    sortby: "Id",
                    order: "asc"
                })).then(function (response) {
                    if (Object.keys(response.data.Data[0]).length > 0) {
                        ctrl.correcciones = response.data.Data;
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
                        if (response.data.Data != null) {
                            ctrl.correcciones = response.data.Data;
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
                                            //Carga de documento con Gesto Documental
                                            var descripcion;
                                            var fileBase64 ;
                                            var data = [];
                                            var URL = "";
                                            let tipoDocumentoAux = $scope.tipodocumento.find(tipoDoc => {
                                                return tipoDoc.CodigoAbreviacion == "DREV_PLX"
                                            })
                                            utils.getBase64(ctrl.documentModel).then(
                                                function (base64) {
                                                fileBase64 = base64;
                                                data = [{
                                                    IdTipoDocumento: tipoDocumentoAux.Id, //id tipo documento de documentos_crud
                                                    nombre:ctrl.revision.DocumentoTrabajoGrado.TrabajoGrado.Titulo + " Correcciones" ,// nombre formado el titulo y correccion
                                                    file:  fileBase64,
                                                    metadatos: {
                                                        NombreArchivo: ctrl.revision.DocumentoTrabajoGrado.TrabajoGrado.Titulo + " Correcciones" ,
                                                        Tipo: "Archivo",
                                                        Observaciones: "correciones"
                                                    },
                                                    descripcion:"Correcciones sobre el proyecto",
                                                    file:  fileBase64,
                                                }]

                                                gestorDocumentalMidRequest.post('/document/upload',data).then(function (response){ 
                                                ctrl.correcciones.push({
                                                        Observacion: response.data.res.Enlace,
                                                        Justificacion: "Por favor descargue el documento de observaciones",
                                                        Pagina: 1,
                                                        RevisionTrabajoGrado: {
                                                            Id: $scope.revisionid
                                                        },
                                                        Documento: true
                                                })
                                                ctrl.registrarRevision();
                                                nuxeoMidRequest.post('workflow?docID=' + URL, null)
                                                   .then(function (response) {
                                                    console.log('nuxeoMid response: ',response)
                                                }).catch(function (error) {
                                                  console.log('nuxeoMid error:',error)
                                                })
                                               })
                                                //  nuxeoClient.createDocument(ctrl.revision.DocumentoTrabajoGrado.TrabajoGrado.Titulo + " Correcciones", "Correcciones sobre el proyecto", ctrl.documentModel, "correciones", undefined)
                                                //.then(function (respuestaCrearDocumento) {
                                               // })
                                                .catch(function (excepcionCrearDocumento) {
                                                    ctrl.cargandoRevision = false;
                                                    swal(
                                                        $translate.instant("ERROR.SUBIR_DOCUMENTO"),
                                                        $translate.instant("VERIFICAR_DOCUMENTO"),
                                                        'warning'
                                                    );
                                                });
                                            //
                                            })
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
                                let estadoRevTemp = $scope.estadorev.find(estRev => {
                                    return estRev.CodigoAbreviacion == "FINALIZADA_PLX"
                                  });
                                ctrl.revision.EstadoRevisionTrabajoGrado = estadoRevTemp.Id;
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
                                
                                poluxMidRequest.post("tr_registrar_revision_tg", data_transaccion)
                                    .then(function (respuestaRegistrarRevisionTg) {
                                        if (respuestaRegistrarRevisionTg.data[0] === "Success") {
                                            var Atributos={
                                                rol:'ESTUDIANTE',
                                            }
                                            notificacionRequest.enviarCorreo('Revision realizada',Atributos,['101850341'],'','','Se ha realizado la revision del trabajo de grado, se ha dado de parte de '+nombreDocente+'.Cuando se desee observar el msj se puede copiar el siguiente link para acceder https://polux.portaloas.udistrital.edu.co/');              
                                           // notificacionRequest.enviarCorreo('Revision realizada',Atributos,['Documento.estudiante'],'','','Se ha realizado larevision del trabajo de grado, se ha dado de parte de '+nombreDocente+'.Cuando se desee observar el msj se puede copiar el siguiente link para acceder https://polux.portaloas.udistrital.edu.co/');              
                      
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
                            console.log("FALLA 1 ", excepcionInformacionDocente)
                            swal(
                                $translate.instant("REGISTRAR_REVISION.CONFIRMACION"),
                                $translate.instant("REGISTRAR_REVISION.ERROR"),
                                'warning'
                            );
                            ctrl.cargandoRevision = false;
                        })
                }
            },
            controllerAs: "d_revisionDocumento"
        };
    });