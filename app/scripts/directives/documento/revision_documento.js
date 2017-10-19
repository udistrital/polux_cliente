'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:revisionDocumento
 * @description
 * # revisionDocumento
 */
angular.module('poluxClienteApp')
    .directive('revisionDocumento', function(poluxRequest) {
        return {
            restrict: "E",
            scope: {
                revisionid: '=?',
                paginadoc: '=?',
                paginaset: '=?',
                revisionestado: '=?'
            },
            templateUrl: "views/directives/documento/revision_documento.html",
            controller: function($scope) {
                var ctrl = this;

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
                    /* //Opcion recursiva
                    if ( obj === null || typeof obj  !== 'object' ) {
                          return obj;
                      }
                      var temp = obj.constructor();
                      for ( var key in obj ) {
                          temp[ key ] = clone( obj[ key ] );
                      }
                      return temp;*/
                    //Opcion Json
                    return JSON.parse(JSON.stringify(Obj));
                };

                ctrl.editar = function(correc, temp) {
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

                ctrl.agregar_correccion = function(correcion) {
                    if (ctrl.agregarpag) {
                        correcion.Pagina = $scope.paginadoc;
                    }
                    var idrev = {};
                    idrev = $scope.revisionid;
                    correcion.RevisionTrabajoGrado={
                        Id:idrev
                    };
                    correcion.Cambio = "nuevo";
                    ctrl.correcciones.push(correcion);
                    ctrl.correccion = {};
                };

                ctrl.eliminar_correccion = function(correcion) {
                    if (correcion.Id != null) {
                        ctrl.correcciones_eliminadas.push(correcion);
                    }
                    ctrl.correcciones.splice(ctrl.correcciones.indexOf(correcion), 1);
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
                    switch (accion) {
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
                    for (var i = 0; i < ctrl.correcciones_eliminadas.length; i++) {
                        poluxRequest.delete("correccion", ctrl.correcciones_eliminadas[i].Id);
                    }
                };

            },
            controllerAs: "d_revisionDocumento"
        };
    });
