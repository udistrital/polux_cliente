'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:GeneralConsultaPropuestaCtrl
 * @description
 * # GeneralConsultaPropuestaCtrl
 * Controller of the poluxClienteApp
 */


angular.module('poluxClienteApp')
    .controller('ConsultaPropuestaCtrl', function(poluxRequest, academicaRequest, $translate, $scope, constantes, $window) {
        var ctrl = this;
        academicaRequest.obtenerDocentes("").then(function(response) {
            ctrl.docentes = response;
        });
        ctrl.tipos = function() {
            poluxRequest.get("tipo_vinculacion", $.param({
                    limit: -1
                }))
                .then(function(response) {
                    ctrl.tipo_vinculacion = response.data;
                });
        };
        ctrl.asignar_docente = function() {
            var data = {};
            data.IdentificacionDocente = parseFloat(ctrl.profesores.selected.DOC_NRO_IDEN);
            data.IdTipoVinculacion = ctrl.vinculacion.selected;
            data.IdTrabajoGrado = ctrl.row_entity.IdTrabajoGrado;
            data.Activo = true;
            data.FechaInicio = ctrl.fecha;
            poluxRequest.post("vinculacion_docente", data)
                .then(function(response) {
                    $('#myModal').modal('hide');
                    swal(
                        '',
                        'Ha Asignado al proyecto' + response.data.IdTrabajoGradoTitulo + ' El Docente ' + ctrl.profesores.selected.DOC_NOMBRE + " " + ctrl.profesores.selected.DOC_APELLIDO,
                        'success'
                    );
                    ctrl.get_socializacion();
                });
        };
        ctrl.ver_asignaturas = function(item, model) {
            console.log(item);
            poluxRequest.get("areas_docente", $.param({
                    limit: -1,
                    query: "IdentificacionDocente:" + item.DOC_NRO_IDEN
                }))
                .then(function(response) {
                    ctrl.materias = response.data;
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

                    cellTemplate: '<center>' +

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
        ctrl.solicitudes = function() {
            poluxRequest.get("documento_tg", $.param({
                    limit: -1,
                    sortby: "Id",
                    order: "asc"
                }))
                .then(function(response) {
                    ctrl.gridOptions.data = response.data;
                    ctrl.documentos = response.data;
                });

        };

        ctrl.gridOptions.onRegisterApi = function(gridApi) {
            ctrl.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function() {});
        };

        ctrl.solicitudes();

        ctrl.load_row = function(row, operacion) {
            ctrl.row_entity = row.entity;
            switch (operacion) {
                case "ver":
                    //ctrl.docentes = academicaRequest.obtenerDocentes();
                    break;
                case "add":
                    break;
                case "config":
                    break;
                case "delete":
                    break;
                case "descargar":
                    $window.open(constantes.DOWNLOAD_FILE + ctrl.row_entity.IdDocumento.Enlace, "New Window", "width=800,height=600,resizable=1");
                    break;
                default:
            }
        };

    });