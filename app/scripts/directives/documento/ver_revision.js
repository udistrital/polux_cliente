'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:verRevision
 * @description
 * # verRevision
 */
angular.module('poluxClienteApp')
    .directive('verRevision', function(poluxRequest) {
        return {
            restrict: "E",
            scope: {
                revisionid: '=?',
                paginaset: '=?',
                autor: '=?'
            },
            templateUrl: "views/directives/documento/ver_revision.html",
            controller: function($scope) {
                var ctrl = this;

                $scope.$watch('paginaset', function() {
                    console.log("pagina" + $scope.paginaset);
                    $scope.pageNum = $scope.paginaset;
                });

                poluxRequest.get("revision_trabajo_grado", $.param({
                    query: "Id:" + $scope.revisionid
                })).then(function(response) {
                    ctrl.revision = response.data[0];
                });

                poluxRequest.get("correccion", $.param({
                    query: "RevisionTrabajoGrado.Id:" + $scope.revisionid,
                    sortby: "Id",
                    order: "asc"
                })).then(function(response) {
                    ctrl.correcciones = response.data;
                });

                ctrl.pruebac = {};
                ctrl.comentarCorreccion = function(comentario, idcorreccion) {
                    var mycomentario = {};
                    var myidcorreccion = {};
                    myidcorreccion.Id = idcorreccion;
                    mycomentario.Correccion = myidcorreccion;
                    mycomentario.Comentario = comentario;
                    mycomentario.Fecha = new Date();
                    mycomentario.Autor = "pepito";
                    ctrl.pruebac = mycomentario;
                    var comentarios = [];
                    console.log(mycomentario);
                    poluxRequest.post("comentario", mycomentario).then(function(response) {
                        poluxRequest.get("comentario", $.param({
                            query: "Correccion:" + mycomentario.Correccion.Id,
                            sortby: "Id",
                            order: "asc"
                        })).then(function(response) {
                            comentarios.push(response.data);
                        });
                    }); //.then(function(data){console.log(data);});
                    ctrl.coment = null;
                    return comentarios;
                };

                ctrl.cargarComentarios = function(correccionid) {
                    var comentarios = [];
                    poluxRequest.get("comentario", $.param({
                        query: "Correccion:" + correccionid,
                        sortby: "Id",
                        order: "asc"
                    })).then(function(response) {
                        comentarios.push(response.data);
                    });
                    return comentarios;
                };



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
                ctrl.verpag = function(pag) {
                    $scope.paginaset = pag;
                };
            },
            controllerAs: "d_verRevision"
        };
    });
