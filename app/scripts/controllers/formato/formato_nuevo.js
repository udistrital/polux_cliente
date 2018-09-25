'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:FormatoNuevoCtrl
 * @description
 * # FormatoNuevoCtrl
 * Controller of the poluxClienteApp
 * Controlador que permite crear un nuevo formato de evaluación de una carrera. Como la dinámica de formatos
 * de evaluación no se utiliza en el sistema este controlador tampoco es utilizado.
 * @requires services/poluxService.service:poluxRequest
 * @requires $scope
 * @requires $location
 * @requires $route
 */
angular.module('poluxClienteApp')
    .controller('FormatoNuevoCtrl', function (poluxRequest, $scope, $location, $route) {

        $scope.formatos = [];
        //Preguntas existentes en la base de datos
        $scope.preguntas = [];
        $scope.pSeleccion = "";
        //Respuestas existentes en la base de datos
        $scope.respuestas = [];
        $scope.rSeleccion = "";

        //cargar todos los formatos de la base de datos
        poluxRequest.get("pregunta", $.param({
            limit: "0"
        })).then(function (response) {
            $scope.preguntas = response.data;
        });

        poluxRequest.get("respuesta", "").then(function (response) {
            $scope.respuestas = response.data;
        });

        //Gestion de ui-grid
        $scope.evaluacion = {};
        $scope.id_formato = 0;
        $scope.mostrar_preguntas = false;
        $scope.message = 'Formulario para la creación de ';
        $scope.gridOptions = {
            enableFiltering: false,
            enableSorting: false,
            treeRowHeaderAlwaysVisible: false,
            showTreeExpandNoChildren: false,
            enableRowSelection: true,
            enableSelectAll: true,
            selectionRowHeaderWidth: 30,
            rowHeight: 30,
            showGridFooter: true,
            columnDefs: [{
                field: 'Orden',
                width: '12%',
                enableCellEdit: false,
                cellClass: 'aligncenter',
                displayName: 'ORDEN'
            }, {
                field: 'IdPregunta.Enunciado',
                width: '50%',
                enableCellEdit: true,
                enableSorting: false,
                cellClass: 'alignleft',
                displayName: 'ENUNCIADO'
            }, {
                field: 'Peso',
                width: '12%',
                enableCellEdit: true,
                type: 'number',
                displayName: 'PESO'
            }, {
                field: 'Tipo',
                width: '20%',
                enableCellEdit: true,
                editableCellTemplate: 'ui-grid/dropdownEditor',
                cellClass: 'aligncenter',
                editDropdownValueLabel: 'tipo',
                resizable: false,
                displayName: 'TIPO',
                editDropdownOptionsArray: [{
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
                }]
            }],
            isRowSelectable: function (row) {
                return row.treeLevel === 0;
            },

            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
        };
        $scope.gridOptions.multiSelect = false;

        $scope.ajustar_id = function () {
            var p = 0;
            var h = 0;
            for (var j = 0; j < $scope.gridOptions.data.length; j++) {
                if ($scope.gridOptions.data[j].$$treeLevel === 0) {
                    p++;
                    $scope.gridOptions.data[j].Orden = p;
                } else {
                    h++;
                    $scope.gridOptions.data[j].Orden = h;
                }
            }
        }


        $scope.anadir_opcion = function () {
            if ($scope.rSeleccion !== '') {
                var seleccion = $scope.gridApi.selection.getSelectedRows();
                var pos = 0;
                var respuesta = null;
                for (var i = 0; i < $scope.respuestas.length; i++) {
                    if ($scope.respuestas[i].Descripcion === $scope.rSeleccion) {
                        respuesta = {
                            Id: $scope.respuestas[i].Id,
                            Enunciado: $scope.respuestas[i].Descripcion
                        }
                    }
                }
                if (respuesta === null) {
                    respuesta = {
                        Enunciado: $scope.rSeleccion
                    }
                }
                if ($scope.gridOptions.data.length > 0 && seleccion.length > 0) {
                    var objeto = null;
                    for (var i = 0; i < $scope.gridOptions.data.length; i++) {
                        if ($scope.gridOptions.data[i].$$hashKey == seleccion[0].$$hashKey &&
                            ($scope.gridOptions.data[i].Tipo.substring(0, 7) === 'cerrado')) {
                            pos = i + 1;
                            objeto = {
                                Orden: pos,
                                IdPregunta: respuesta,
                                Peso: "0",
                                $$treeLevel: 1,
                                padre: seleccion[0].$$hashKey
                            };
                            $scope.gridOptions.data[i].opciones.unshift(objeto);
                            $scope.gridOptions.data.splice(pos, 0, objeto);
                        }
                    }
                }
                $scope.ajustar_id();
                $scope.rSeleccion = '';
            }
        }
        $scope.anadir_pregunta = function () {
            if ($scope.pSeleccion !== '') {
                var pos = 0;
                var pregunta = null;
                for (var i = 0; i < $scope.preguntas.length; i++) {
                    if ($scope.preguntas[i].Enunciado === $scope.pSeleccion) {
                        pregunta = $scope.preguntas[i];
                    }
                }
                if (pregunta === null) {
                    pregunta = {
                        Enunciado: $scope.pSeleccion
                    };
                }
                var seleccion = $scope.gridApi.selection.getSelectedRows();
                if ($scope.gridOptions.data.length > 0 && seleccion.length > 0) {
                    var objeto = null;
                    for (var i = 0; i < $scope.gridOptions.data.length; i++) {
                        if ($scope.gridOptions.data[i].$$hashKey === seleccion[0].$$hashKey) {
                            pos = i;
                            objeto = {
                                Orden: i,
                                IdPregunta: pregunta,
                                Peso: "0",
                                Tipo: "Seleccione ...",
                                opcion: '',
                                $$treeLevel: 0,
                                opciones: []
                            };
                        }
                    }
                    $scope.gridOptions.data.splice(pos, 0, objeto);
                } else {
                    $scope.gridOptions.data.push({
                        Orden: 1,
                        IdPregunta: pregunta,
                        Peso: "0",
                        Tipo: "Seleccione ...",
                        opcion: '',
                        $$treeLevel: 0,
                        opciones: []
                    });
                }
                $scope.ajustar_id();
                $scope.pSeleccion = '';
            }
        };

        $scope.borrar = function () {
            var pos = 0;
            var seleccion = $scope.gridApi.selection.getSelectedRows();
            if (seleccion.length > 0) {
                for (var i = 0; i < $scope.gridOptions.data.length; i++) {

                    if ($scope.gridOptions.data[i].$$hashKey == seleccion[0].$$hashKey) {
                        var pos = i;
                        for (var j = i + 1; j < $scope.gridOptions.data.length; j++) {
                            if ($scope.gridOptions.data[j].padre === seleccion[0].$$hashKey) {
                                $scope.gridOptions.data.splice(j, 1);
                                j--;
                            }
                        }

                    }
                }
                $scope.gridOptions.data.splice(pos, 1);
            }
            $scope.ajustar_id();
        };

        $scope.guardar = function () {
            var formato_post = {
                formato: {
                    Nombre: $scope.nombre_formato,
                    Introduccion: $scope.introduccion_formato,

                    FechaRealizacion: new Date()
                },
                TrPreguntas: []
            };
            var i = -1;
            angular.forEach($scope.gridOptions.data, function (data) {
                console.log(data);
                if (data.$$treeLevel === 0 && (data.Tipo === 'cerrado_unico' || data.Tipo === 'cerrado_multiple')) {
                    formato_post.TrPreguntas.push({
                        Pregunta: {
                            IdFormato: {
                                Id: 0
                            },
                            IdPregunta: data.IdPregunta,
                            Tipo: data.Tipo,
                            Activo: true,
                            Orden: parseInt(data.Orden),
                            Valoracion: parseInt(data.Peso)
                        },
                        Respuestas: []
                    });
                    i += 1;
                } else if (data.$$treeLevel === 0 && (data.Tipo === 'abierto' || data.Tipo === 'calificado')) {
                    formato_post.TrPreguntas.push({
                        Pregunta: {
                            IdFormato: {
                                Id: 0
                            },
                            IdPregunta: data.IdPregunta,
                            Tipo: data.Tipo,
                            Activo: true,
                            Orden: parseInt(data.Orden),
                            Valoracion: parseInt(data.Peso)
                        },
                        Respuestas: [{
                            IdPreguntaFormato: {
                                Id: 0
                            },
                            IdRespuesta: {
                                Id: 1,
                                Descripcion: "Abierto"
                            },
                            IdPaqueteRespuestas: null,
                            Orden: 1,
                            Valoracion: 100
                        }]
                    });
                    i += 1;
                } else {
                    var Resp = {};
                    Resp.Descripcion = data.IdPregunta.Enunciado;
                    if (data.IdPregunta.Id !== 'undefined') {
                        Resp.Id = data.IdPregunta.Id;
                    }
                    formato_post.TrPreguntas[i].Respuestas.push({
                        IdPreguntaFormato: {
                            Id: 0
                        },
                        IdRespuesta: Resp,
                        IdPaqueteRespuestas: null,
                        Orden: parseInt(data.Orden),
                        Valoracion: parseInt(data.Peso)
                    });
                }
            });
            i += 1;
            console.log(formato_post);
            poluxRequest.post("tr_formato", formato_post).then(function (response) {
                console.log(response.data);
                swal({
                    title: 'Ok',
                    text: 'Se ha creado formato: <br> ' +
                        response.data.Formato.Nombre,
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'Aceptar'
                }).then(function () {
                    $location.path('/formato_ver');
                });
                $route.reload();
            });
        };
    });