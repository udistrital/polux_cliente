'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:verRevision
 * @description
 * # verRevision
 * Directiva que permite mostrar una revisión hecha a un documento.
 * Controlador: {@link poluxClienteApp.directive:verRevision.controller:verRevisionCtrl verRevisionCtrl}
 * @param {number} revisionid Id de la revisión que se consulta.
 * @param {number} paginaset Página del documento sobre la que se hace la revisión.
 * @param {string} autor Nombre del autor que realiza el comentario.
 */
angular.module('poluxClienteApp')
    .directive('verRevision', function (poluxRequest, $translate, utils, notificacionRequest, academicaRequest, autenticacionMidRequest) {
        return {
            restrict: "E",
            scope: {
                revisionid: '=?',
                paginaset: '=?',
                autor: '=?'
            },
            templateUrl: "views/directives/documento/ver_revision.html",
            /**
             * @ngdoc controller
             * @name poluxClienteApp.directive:verRevision.controller:verRevisionCtrl
             * @description
             * # verRevisionCtrl
             * # Controller of the poluxClienteApp.directive:verRevision
             * Controlador de la directiva {@link poluxClienteApp.directive:verRevision verRevision}.
             * @requires services/poluxService.service:poluxRequest
             * @requires $scope
            * @requires services/poluxService.service:gestorDocumentalMidService
             * @property {number} pageNum Número de la página en donde se realiza la revisión.
             * @property {object} revision Revisión que se está mostrando.
             * @property {array} correcciones Arreglo de correcciones que se muestren.
             * @property {object} pruebac Comentario temporal que se guarda.
             */
            controller: function ($scope,gestorDocumentalMidRequest) {
                var ctrl = this;

                /**
                 * @ngdoc method
                 * @name verRevision
                 * @methodOf poluxClienteApp.directive:verRevision.controller:verRevisionCtrl
                 * @param {undefined} undefined No recibe parametros
                 * @returns {undefined} No retorna ningún parametro.
                 * @description 
                 * Vigila los cambios del elemento paginaset, y la muestra en el controlador.
                 */
                $scope.$watch('paginaset', function () {
                    
                    $scope.pageNum = $scope.paginaset;
                });

                /**
                 * @ngdoc method
                 * @name cargar
                 * @methodOf  poluxClienteApp.directive:verRevision.controller:verRevisionCtrl
                 * @param {undefined} undefined No recibe ningún parametro.
                 * @returns {undefined} No retorna ningún valor.
                 * @description 
                 * Permite cargar la data de la revisión y las correcciones.
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
                    ctrl.correcciones = response.data.Data;
                });

                ctrl.pruebac = {};

                /**
                 * @ngdoc method
                 * @name comentarCorreccion
                 * @methodOf poluxClienteApp.directive:verRevision.controller:verRevisionCtrl
                 * @param {object} comentario Comentario que se va a agregar.
                 * @param {number} idcorreccion Idde la corrección a la que se van a agregar los comentarios.
                 * @returns {undefined} No retorna ningún parametro.
                 * @description 
                 * Permite agregar un comentario a una corrección guardandolo en {@link services/poluxService.service:poluxRequest poluxRequest}.
                 */
                ctrl.comentarCorreccion = function (comentario, idcorreccion) {
                    var mycomentario = {};
                    var myidcorreccion = {};
                    myidcorreccion.Id = idcorreccion;
                    mycomentario.Correccion = myidcorreccion;
                    mycomentario.Comentario = comentario;
                    mycomentario.Fecha = new Date();
                    mycomentario.Autor = $scope.autor;
                    ctrl.pruebac = mycomentario;
                    var comentarios = [];
                    
                    poluxRequest.post("comentario", mycomentario).then(function () {
                        poluxRequest.get("comentario", $.param({
                            query: "Correccion:" + mycomentario.Correccion.Id,
                            sortby: "Id",
                            order: "asc"
                        })).then(async function (response_comentario) {
                            comentarios.push(response_comentario.data.Data);
                            
                            //Se prepara la información para la notificación

                            var ult_comentario = response_comentario.data.Data[response_comentario.data.Data.length-1]//Se obtiene el último comentario realizado

                            var respondio_docente, codigo, correos = []

                            //Debido a que no se almacenan los documentos del autor del comentario, se busca si el nombre autor corresponde al nombre del docente para determinar el correo del destinatario
                            await academicaRequest.get("docente_tg", [ult_comentario.Correccion.RevisionTrabajoGrado.VinculacionTrabajoGrado.Usuario]).then(function (docente) {
                                if (!angular.isUndefined(docente.data.docenteTg.docente)) {

                                    if(docente.data.docenteTg.docente[0].nombre == ult_comentario.Autor){
                                        //RESPONDIÓ DOCENTE
                                        respondio_docente = true
                                    }
                                    else{
                                        //RESPONDIÓ ESTUDIANTE
                                        respondio_docente = false
                                    }
                                }
                            })

                            if(respondio_docente){//se busca el correo del estudiante
                                
                                //Se busca el codigo del estudiante
                                var parametro = $.param({
                                    query: "trabajo_grado:"+ult_comentario.Correccion.RevisionTrabajoGrado.DocumentoTrabajoGrado.TrabajoGrado.Id,
                                    limit: 0
                                });

                                await poluxRequest.get("estudiante_trabajo_grado",parametro).then(function(estudiante_tg){
                                    codigo = estudiante_tg.data[0].Estudiante
                                })

                                var data_auth_mid = {
                                    numero: codigo
                                }

                                await autenticacionMidRequest.post("token/documentoToken", data_auth_mid).then(function (responseToken) {
                                    correos.push(responseToken.data.email)
                                })

                            } else{//se busca el correo del docente
                                var data_auth_mid = {
                                    numero: ult_comentario.Correccion.RevisionTrabajoGrado.VinculacionTrabajoGrado.Usuario.toString()
                                }

                                await autenticacionMidRequest.post("token/documentoToken", data_auth_mid).then(function (responseCorreo) {
                                    correos.push(responseCorreo.data.email)
                                })
                            }

                            var data_correo = {
                                "Source": "notificacionPolux@udistrital.edu.co",
                                "Template": "POLUX_PLANTILLA_REVISION_DOC",
                                "Destinations": [
                                    {
                                        "Destination": {
                                            "ToAddresses": correos
                                        },
                                        "ReplacementTemplateData": {
                                            "nombre_usuario": ult_comentario.Autor,
                                            "titulo_tg": ult_comentario.Correccion.RevisionTrabajoGrado.VinculacionTrabajoGrado.TrabajoGrado.Titulo,
                                            "comentario": ult_comentario.Comentario
                                        }
                                    }
                                ]
                            }

                            //console.log(correos)

                            //DESCOMENTAR AL SUBIR A PRODUCCIÓN
                            /*notificacionRequest.post("email/enviar_templated_email", data_correo).then(function (response) {
                                console.log("Envia el correo",response)
                            }).catch(function (error) {
                                console.log("Error: ", error)
                            });*/

                            //Para crear plantillas de correo
                            /*var html = ``

                            var data_plantilla = {
                                "Template": {
                                    "HtmlPart": html,
                                    "SubjectPart": "POLUX",
                                    "TemplateName": "POLUX_PLANTILLA_ASIGNACION",
                                    "TextPart": ""
                                }
                            }
                            notificacionRequest.post("template_email", data_plantilla).then(function (response) {
                                console.log("crea plantilla")
                                console.log(response)
                            }).catch(function (error) {
                                console.log("Error: ", error)
                            });*/

                        });
                    }); //.then(function(data){
                    //ctrl.coment = null;
                    comentario = null;
                    return comentarios;
                };

                /**
                 * @ngdoc method
                 * @name cargarComentarios
                 * @methodOf poluxClienteApp.directive:verRevision.controller:verRevisionCtrl
                 * @param {number} correccionid Id de la corrección de la que se cargan los comentarios.
                 * @returns {undefined} No retorna ningún parametro.
                 * @description 
                 * Permite cargar los comentarios de una corrección consultandolos en el servicio de {@link services/poluxService.service:poluxRequest poluxRequest}.
                 */
                ctrl.cargarComentarios = function (correccionid) {
                    var comentarios = [];
                    poluxRequest.get("comentario", $.param({
                        query: "Correccion:" + correccionid,
                        sortby: "Id",
                        order: "asc"
                    })).then(function (response) {
                        comentarios.push(response.data.Data);
                    });
                    return comentarios;
                };


                /**
                 * @ngdoc method
                 * @name getDocument
                 * @methodOf poluxClienteApp.directive:verRevision.controller:verRevisionCtrl
                 * @description 
                 * Permite cargar un documento de {@link services/poluxClienteApp.service:gestorDocumentalMidRequest gestorDocumentalMidRequest} y mostrarlo en una ventana nueva.
                 * @param {String} uid Uid del documento que se va a descargar
                 * @returns {undefined} No hace retorno de resultados
                 */
                ctrl.getDocument = function (uid) {
                    if (uid) {
                            gestorDocumentalMidRequest.get('/document/'+uid).then(function (response) {  
                                ctrl.loadingVersion = false;
                                  var varia = utils.base64ToArrayBuffer(response.data.file);
                                  var file = new Blob([varia], {type: 'application/pdf'});
                                  var fileURL = URL.createObjectURL(file);
                                  window.open(fileURL, 'resizable=yes,status=no,location=no,toolbar=no,menubar=no,fullscreen=yes,scrollbars=yes,dependent=no,width=700,height=900');
                           })
                            .catch(function (error) {
                                ctrl.loadingVersion = false;
                                swal(
                                    $translate.instant("MENSAJE_ERROR"),
                                    $translate.instant("ERROR.CARGAR_DOCUMENTO"),
                                    'warning'
                                );
                            });
                    }
                }
                ctrl.verpag = function (pag) {
                    $scope.paginaset = pag;
                };
            },
            controllerAs: "d_verRevision"
        };
    });
