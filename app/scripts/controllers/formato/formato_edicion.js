'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:FormatoFormatoEdicionCtrl
 * @description
 * # FormatoFormatoEdicionCtrl
 * Controller of the poluxClienteApp
 * Controlador que permite editar un formato de evaluación de una carrera. Como la dinámica de formatos
 * de evaluación no se utiliza en el sistema este controlador tampoco es utilizado.
 * @requires services/poluxService.service:poluxRequest
 * @requires $scope
 */
angular.module('poluxClienteApp')
    .controller('FormatoEdicionCtrl', function (poluxRequest, $scope) {
        var self = this;

        self.tipos_preg = [{
            id: 'cerrado_unico',
            tipo: 'Cerrada Unica'
        }, {
            id: 'cerrado_multiple',
            tipo: 'Cerrada Multiple'
        }, {
            id: 'abierto',
            tipo: 'Abierta'
        }, {
            id: 'calificado',
            tipo: 'Numérica'
        }];

        self.cargar_datos = function () {
            //cargar todos los formatos
            poluxRequest.get("formato", $.param({
                limit: "0"
            })).then(function (response) {
                self.formatos = response.data;
            });

            //cargar todas las preguntas
            poluxRequest.get("pregunta", $.param({
                limit: "0"
            })).then(function (response) {
                self.preguntas = response.data;
            });

            //cargar todas las respuesta
            poluxRequest.get("respuesta", $.param({
                limit: "0"
            })).then(function (response) {
                self.respuestas = response.data;
            });
        };

        self.gridOptions = {
            showTreeExpandNoChildren: false,
            enableRowSelection: true,
            enableSelectAll: false,
            showGridFooter: true,
            columnDefs: [{
                field: 'Orden',
                displayName: 'ORDEN',
                width: '150',
                cellClass: function (row, col) {
                    if (col.treeNode.children.length === 0 && col.treeLevel !== 0) {
                        return "unbold ";
                    } else {
                        return "text-info";
                    }
                }
            }, {
                field: 'IdPregunta.Enunciado',
                displayName: 'ENUNCIADO',
                width: '800',
                cellClass: function (row, col) {
                    if (col.treeNode.children.length === 0 && col.treeLevel !== 0) {
                        return "unbold ";
                    } else {
                        return "text-info";
                    }
                }
            }, {
                field: 'Peso',
                type: 'number',
                displayName: 'PESO',
                width: '155',
                cellClass: function (row, col) {
                    if (col.treeNode.children.length === 0 && col.treeLevel !== 0) {
                        return "unbold ";
                    } else {
                        return "text-info";
                    }
                }
            }, {
                field: 'Tipo',
                displayName: 'TIPO',
                width: '175',
                cellClass: function (row, col) {
                    if (col.treeNode.children.length === 0 && col.treeLevel !== 0) {
                        return "unbold ";
                    } else {
                        return "text-info";
                    }
                }
            }],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                $scope.gridApi.grid.registerDataChangeCallback(function () {
                    $scope.gridApi.treeBase.expandAllRows();
                });
                $scope.gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    self.sel_pregunta = row.entity;
                });
            }
        };

        self.gridOptions.isRowSelectable = function (row) {
            return row.treeLevel === 0;
        };

        self.actualizar_formato = function () {
            self.gridOptions.data = [];
            poluxRequest.get("tr_formato/" + self.SelectedFormat, '')
                .then(function (response) {
                    self.formato_vista = response.data;
                    self.cargar_en_uigrid(self.formato_vista);
                });
        };

        self.cargar_en_uigrid = function (data) {
            //
            angular.forEach(data.TrPreguntas, function (fila) {
                
                self.gridOptions.data.push({
                    Orden: fila.Pregunta.Orden,
                    IdPregunta: fila.Pregunta.IdPregunta,
                    Peso: fila.Pregunta.Valoracion,
                    Tipo: fila.Pregunta.Tipo,
                    opcion: '',
                    $$treeLevel: 0,
                    opciones: []
                });
                if (fila.Respuestas.length !== 0) {
                    angular.forEach(fila.Respuestas, function (respuesta) {
                        self.gridOptions.data.push({
                            Orden: respuesta.Orden,
                            IdPregunta: {
                                id: respuesta.IdRespuesta.Id,
                                Enunciado: respuesta.IdRespuesta.Descripcion
                            },
                            Peso: respuesta.Valoracion,
                            Tipo: respuesta.Tipo,
                            opcion: '',
                            $$treeLevel: 1,
                            opciones: []
                        });
                    });
                }
            });
        };



        self.gridOptions.multiSelect = false;


        self.cargar_datos();
        self.actualizar_formato();



    });