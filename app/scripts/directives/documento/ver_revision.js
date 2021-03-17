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
    .directive('verRevision', function (poluxRequest, $translate) {
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
             * @requires services/poluxClienteApp.service:nuxeoClient
             * @property {number} pageNum Número de la página en donde se realiza la revisión.
             * @property {object} revision Revisión que se está mostrando.
             * @property {array} correcciones Arreglo de correcciones que se muestren.
             * @property {object} pruebac Comentario temporal que se guarda.
             */
            controller: function ($scope, nuxeoClient) {
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
                    console.log("pagina" + $scope.paginaset);
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
                    ctrl.revision = response.data[0];
                });

                poluxRequest.get("correccion", $.param({
                    query: "RevisionTrabajoGrado.Id:" + $scope.revisionid,
                    sortby: "Id",
                    order: "asc"
                })).then(function (response) {
                    ctrl.correcciones = response.data;
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
                    console.log(mycomentario);
                    poluxRequest.post("comentario", mycomentario).then(function (response) {
                        poluxRequest.get("comentario", $.param({
                            query: "Correccion:" + mycomentario.Correccion.Id,
                            sortby: "Id",
                            order: "asc"
                        })).then(function (response) {
                            comentarios.push(response.data);
                        });
                    }); //.then(function(data){console.log(data);});
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
                        comentarios.push(response.data);
                    });
                    return comentarios;
                };


                /**
                 * @ngdoc method
                 * @name getDocument
                 * @methodOf poluxClienteApp.directive:verRevision.controller:verRevisionCtrl
                 * @description 
                 * Permite cargar un documento de {@link services/poluxClienteApp.service:nuxeoClient nuxeoClient} y mostrarlo en una ventana nueva.
                 * @param {String} uid Uid del documento que se va a descargar
                 * @returns {undefined} No hace retorno de resultados
                 */
                ctrl.getDocument = function (uid) {
                    if (uid) {
                        nuxeoClient.getDocument(uid)
                            .then(function (documento) {
                                ctrl.loadingVersion = false;
                                window.open(documento.url);
                            })
                            .catch(function (error) {
                                console.log("Error ->", error);
                                swal(
                                    $translate.instant("MENSAJE_ERROR"),
                                    $translate.instant("ERROR.CARGAR_DOCUMENTO"),
                                    'warning'
                                );
                            });
                    }
                }


                /*ctrl.postrev=function(){
                  var revisionp ={
                    "IdDocumentoTg": {Id: 1},
                    "IdVinculacionDocente":{Id: 2},
                    "NumeroRevision": 2,
                    "Estado": "pendiente",
                    "FechaRecepcion": "2016-10-17T19:00:00-05:00",
                    "FechaRevision": "0001-01-01T00:00:00Z"
                  };
                  poluxRequest.postRevision(revisionp);

                };*/

                //ctrl.correcciones=[];
                //ctrl.fecha= new Date();
                //ctrl.agregarpag=false;
                ctrl.verpag = function (pag) {
                    $scope.paginaset = pag;
                };
            },
            controllerAs: "d_verRevision"
        };
    });
