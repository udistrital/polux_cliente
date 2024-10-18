'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:GeneralConsultaPropuestaCtrl
 * @description
 * # GeneralConsultaPropuestaCtrl
 * Controller of the poluxClienteApp
 * Controlador de la aplicación que permite consultar una propueta de trabajo de grado.
 * Debido a que este controlador se penso para propuestas en general no se tuvo en cuenta la modalidad y no se utiliza actualmente y no se piensa hacer uso de el.
 * @requires services/poluxService.service:poluxRequest
 * @requires services/academicaService.service:academicaRequest
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires $window
 * @requires $http
 */
angular.module('poluxClienteApp')
    .controller('ConsultaPropuestaCtrl', function (poluxRequest, academicaRequest, $translate, $scope, $window, $http) {
        var ctrl = this;
        ctrl.todos_docentes = false;
        academicaRequest.obtenerDocentes("").then(function (response) {
            ctrl.docentes = response;
        });
        ctrl.tipos = function () {
            poluxRequest.get("tipo_vinculacion", $.param({
                limit: -1
            }))
                .then(function (response) {
                    ctrl.tipo_vinculacion = response.data.Data;
                });
        };
        ctrl.asignar_docente = function () {
            var data = {};
            data.IdentificacionDocente = parseFloat(ctrl.profesores.selected.DOC_NRO_IDEN);
            data.IdTipoVinculacion = ctrl.vinculacion.selected;
            data.IdTrabajoGrado = ctrl.row_entity.IdTrabajoGrado;
            data.Activo = true;
            data.FechaInicio = ctrl.fecha;
            poluxRequest.post("vinculacion_docente", data)
                .then(function (response) {
                    $('#myModal').modal('hide');
                    swal(
                        '',
                        'Ha Asignado al proyecto' + response.data.Data.IdTrabajoGradoTitulo + ' El Docente ' + ctrl.profesores.selected.DOC_NOMBRE + " " + ctrl.profesores.selected.DOC_APELLIDO,
                        'success'
                    );
                    ctrl.get_socializacion();
                });
        };
        ctrl.ver_asignaturas = function (item, model) {
            
            poluxRequest.get("areas_docente", $.param({
                limit: -1,
                query: "IdentificacionDocente:" + item.DOC_NRO_IDEN
            }))
                .then(function (response) {
                    ctrl.materias = response.data.Data;
                });
        };
        ctrl.tipos();
        ctrl.operacion = "";
        ctrl.row_entity = {};
        ctrl.requisito_select = [];
        ctrl.gridOptions = {
            paginationPageSizes: [15, 20, 25],
            paginationPageSize: 15,
            enableFiltering: true,
            enableSorting: true,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            columnDefs: [{
                field: 'IdTipo',
                visible: false
            },
            {
                field: 'IdTrabajoGrado.IdModalidad.Nombre',
                displayName: $translate.instant('MODALIDAD'),
                width: '10%',
            },
            {
                field: 'IdTrabajoGrado.Titulo',
                displayName: $translate.instant('TITULO_PROPUESTA'),
                width: '60%',
            },
            {
                field: 'IdEstadoDocumento.Nombre',
                displayName: $translate.instant('ESTADO_DOCUMENTO'),
                width: '10%',
            },
            {
                field: 'IdTrabajoGrado.Etapa',
                displayName: $translate.instant('ESTADO_DOCUMENTO'),
                width: '10%',
            },
            {
                //<button class="btn primary" ng-click="grid.appScope.deleteRow(row)">Delete</button>
                name: $translate.instant('OPCIONES'),
                enableFiltering: false,
                width: '10%',

                cellTemplate: '<centerctrl.areas_trabajo_grado >' +

                    '<a class="ver" ng-click="grid.appScope.consultaPropuesta.load_row(row,\'ver\')" data-toggle="modal" data-target="#myModalVer">' +
                    '<i class="fa fa-eye fa-lg  faa-shake animated-hover" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.VER\' | translate }}"></i></a> ' +

                    '<a class="configuracion" ng-click="grid.appScope.consultaPropuesta.load_row(row,\'config\');" data-toggle="modal" data-target="#myModal">' +
                    '<i data-toggle="tooltip" title="{{\'BTN.CONFIGURAR\' | translate }}" class="fa fa-cog fa-lg faa-spin animated-hover" aria-hidden="true"></i></a> ' +

                    '<a  ng-click="grid.appScope.consultaPropuesta.load_row(row,\'descargar\')" class="editar">' +
                    '<i data-toggle="tooltip" title="{{\'BTN.DESCARGAR\' | translate }}" class="fa fa-download faa-shake animated-hover" aria-hidden="true"></i></a>' +

                    '</center>'
            }
            ]
        };
        ctrl.gridOptions.enablePaginationControls = true;
        ctrl.gridOptions.multiSelect = false;
        ctrl.solicitudes = function () {
            poluxRequest.get("documento_tg", $.param({
                limit: -1,
                sortby: "Id",
                order: "asc"
            }))
                .then(function (response) {
                    ctrl.gridOptions.data = response.data.Data;
                    ctrl.documentos = response.data.Data;
                });

        };

        ctrl.gridOptions.onRegisterApi = function (gridApi) {
            ctrl.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function () { });
        };

        ctrl.solicitudes();

        ctrl.load_row = function (row, operacion) {
            ctrl.row_entity = row.entity;
            
            switch (operacion) {
                case "ver":
                    poluxRequest.get("vinculacion_docente", $.param({
                        limit: -1,
                        query: "IdTrabajoGrado:" + ctrl.row_entity.IdTrabajoGrado.Id
                    }))
                        .then(function (response) {
                            ctrl.vinculacion_docente_tg = response.data.Data;
                            
                            angular.forEach(ctrl.vinculacion_docente_tg, function (vd) {
                                $http.get("http://10.20.0.127/polux/index.php?data=sj7574MlJOsg4LjjeAOJP5CBi1dRh84M-gX_Z-i_0OmWhton7vEvfcvwRdSGHCTl2WlcEunFl-15PLUWhzSwdnO0c9_4iv7A6ODAQz8nzk3-L-wp9KXARJdYvqggsPUb&identificacion=" + vd.IdentificacionDocente)
                                    .then(function (response2) {
                                        var json = response2.data.Data.split("<json>");
                                        var jsonObj = JSON.parse(json[1]);
                                        var docente = jsonObj[0];
                                        vd.Docente = docente;
                                    });
                            });
                        });
                    break;
                case "add":
                    break;
                case "config":
                    ctrl.DocentesAreaConocimiento = [];
                    poluxRequest.get("vinculacion_docente", $.param({
                        limit: -1,
                        query: "IdTrabajoGrado:" + ctrl.row_entity.IdTrabajoGrado.Id
                    }))
                        .then(function (response) {
                            ctrl.vinculacion_docente_tg = response.data.Data;
                            
                            angular.forEach(ctrl.vinculacion_docente_tg, function (vd) {
                                $http.get("http://10.20.0.127/polux/index.php?data=sj7574MlJOsg4LjjeAOJP5CBi1dRh84M-gX_Z-i_0OmWhton7vEvfcvwRdSGHCTl2WlcEunFl-15PLUWhzSwdnO0c9_4iv7A6ODAQz8nzk3-L-wp9KXARJdYvqggsPUb&identificacion=" + vd.IdentificacionDocente)
                                    .then(function (response2) {
                                        var json = response2.data.Data.split("<json>");
                                        var jsonObj = JSON.parse(json[1]);
                                        var docente = jsonObj[0];
                                        vd.Docente = docente;
                                    });
                            });
                        });
                    poluxRequest.get("areas_trabajo_grado", $.param({
                        limit: -1,
                        query: "IdTrabajoGrado:" + ctrl.row_entity.IdTrabajoGrado.Id
                    }))
                        .then(function (response) {
                            ctrl.areas_trabajo_grado = response.data.Data;
                            angular.forEach(ctrl.areas_trabajo_grado, function (atg) {
                                poluxRequest.get("areas_docente", $.param({
                                    limit: -1,
                                    query: "IdAreaConocimiento:" + atg.IdAreaConocimiento.Id
                                }))
                                    .then(function (response2) {
                                        ctrl.docentes_areas = response2.data.Data;
                                        angular.forEach(ctrl.docentes_areas, function (da) {
                                            $http.get("http://10.20.0.127/polux/index.php?data=sj7574MlJOsg4LjjeAOJP5CBi1dRh84M-gX_Z-i_0OmWhton7vEvfcvwRdSGHCTl2WlcEunFl-15PLUWhzSwdnO0c9_4iv7A6ODAQz8nzk3-L-wp9KXARJdYvqggsPUb&identificacion=" + da.IdentificacionDocente)
                                                .then(function (response3) {
                                                    var json = response3.data.Data.split("<json>");
                                                    var jsonObj = JSON.parse(json[1]);
                                                    var docente = jsonObj[0];
                                                    ctrl.DocentesAreaConocimiento.push(docente);

                                                });
                                        });
                                    });
                            });
                        });
                    break;
                case "delete":
                    break;
                case "descargar":
                    break;
                default:
            }
        };

    });