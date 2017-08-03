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
                var self = this;
                self.correcciones = [];
                poluxRequest.get("revision", $.param({
                    query: "Id:" + $scope.revisionid
                })).then(function(response) {
                    self.revision = response.data[0];
                });
                poluxRequest.get("correccion", $.param({
                    query: "IdRevision:" + $scope.revisionid,
                    sortby: "Id",
                    order: "asc"
                })).then(function(response) {
                    if (response.data != null) {
                        self.correcciones = response.data;
                    } else {
                        self.correcciones = [];
                    }
                });

                self.copyObject = function(Obj) {
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

                self.editar = function(correc, temp) {
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

                self.correccion = {};
                self.correcciones_eliminadas = [];
                self.fecha = new Date();
                self.agregarpag = false;
                self.verpag = function(pag) {
                    $scope.paginaset = pag;
                };

                self.agregar_correccion = function(correcion) {
                    if (self.agregarpag) {
                        correcion.Pagina = $scope.paginadoc;
                    }
                    var idrev = {};
                    idrev.Id = $scope.revisionid;
                    correcion.IdRevision = idrev;
                    correcion.Cambio = "nuevo";
                    self.correcciones.push(correcion);
                    self.correccion = {};
                };

                self.eliminar_correccion = function(correcion) {
                    if (correcion.Id != null) {
                        self.correcciones_eliminadas.push(correcion);
                    }
                    self.correcciones.splice(self.correcciones.indexOf(correcion), 1);
                };

                self.cancelar_revisado = function() {
                    poluxRequest.get("correccion", $.param({
                        query: "IdRevision:" + $scope.revisionid,
                        sortby: "Id",
                        order: "asc"
                    })).then(function(response) {
                        if (response.data != null) {
                            self.correcciones = response.data;
                        } else {
                            self.correcciones = [];
                        }
                    });
                    self.correcciones_eliminadas = [];
                };

                self.guardar_revision = function(accion) {
                    switch (accion) {
                        case "borrador":
                            if (self.revision.Estado != "borrador") {
                                self.revision.Estado = "borrador";
                                poluxRequest.put("revision", self.revision.Id, self.revision);
                            }
                            break;
                        case "finalizar":
                            self.revision.Estado = "finalizada";
                            self.revision.FechaRevision = new Date();
                            poluxRequest.put("revision", self.revision.Id, self.revision);
                            $scope.revisionestado = self.revision.Estado;
                            break;
                    }
                    for (var i = 0; i < self.correcciones.length; i++) {
                        if (self.correcciones[i].Cambio == "nuevo") {
                            poluxRequest.post("correccion", self.correcciones[i]);
                        }
                        if (self.correcciones[i].Cambio == "editado") {
                            poluxRequest.put("correccion", self.correcciones[i].Id, self.correcciones[i]);
                        }
                    }
                    for (var i = 0; i < self.correcciones_eliminadas.length; i++) {
                        poluxRequest.delete("correccion", self.correcciones_eliminadas[i].Id);
                    }
                };

            },
            controllerAs: "d_revisionDocumento"
        };
    });