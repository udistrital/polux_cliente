'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:GeneralConsultaPropuestaCtrl
 * @description
 * # GeneralConsultaPropuestaCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
    .controller('ConsultaPropuestaCtrl', function(poluxRequest, $translate, $scope, constantes) {
        var ctrl = this;
        ctrl.operacion = "";
        ctrl.row_entity = {};
        ctrl.requisito_select = [];
        ctrl.gridOptions = {
            paginationPageSizes: [5, 15, 20],
            paginationPageSize: 5,
            enableFiltering: true,
            enableSorting: true,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            columnDefs: [{
                    field: 'IdTipo',
                    visible: false
                },
                {
                    field: 'Nombre',
                    displayName: $translate.instant('NOMBRE'),
                    width: '15%',
                },
                {
                    field: 'IdTrabajoGrado.IdModalidad.Nombre',
                    displayName: $translate.instant('MODALIDAD'),
                    width: '10%',
                },
                {
                    field: 'IdTrabajoGrado.Titulo',
                    displayName: $translate.instant('TITULO_PROPUESTA'),
                    width: '30%',
                },
                {
                    field: 'IdDocumento.Enlace',
                    displayName: $translate.instant('TITULO_PROPUESTA'),
                    width: '15%',
                },
                {
                    field: 'FechaRegistro',
                    displayName: $translate.instant('FECHA'),
                    cellTemplate: '<div align="center"><span>{{row.entity.FechaRegistro| date:"yyyy-MM-dd":"+0900"}}</span></div>',
                    width: '12%',
                },
                {
                    //<button class="btn primary" ng-click="grid.appScope.deleteRow(row)">Delete</button>
                    name: $translate.instant('OPCIONES'),
                    enableFiltering: false,
                    width: '8%',

                    cellTemplate: '<center>' +
                        '<a class="ver" ng-click="grid.appScope.consultaPropuesta.load_row(row,\'ver\')" data-toggle="modal" data-target="#modalVer">' +
                        '<i class="fa fa-eye fa-lg  faa-shake animated-hover" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.VER\' | translate }}"></i></a> ' +
                        '<a class="editar" ng-click="grid.appScope.consultaPropuesta.load_row(row,\'edit\');" data-toggle="modal" data-target="#myModal">' +
                        '<i data-toggle="tooltip" title="{{\'BTN.EDITAR\' | translate }}" class="fa fa-pencil fa-lg  faa-shake animated-hover" aria-hidden="true"></i></a> ' +
                        '<a class="configuracion" ng-click="grid.appScope.consultaPropuesta.load_row(row,\'config\');" data-toggle="modal" data-target="#modalConf">' +
                        '<i data-toggle="tooltip" title="{{\'BTN.CONFIGURAR\' | translate }}" class="fa fa-cog fa-lg faa-spin animated-hover" aria-hidden="true"></i></a> ' +
                        '<a  ng-click="grid.appScope.consultaPropuesta.load_row(row,\'descargar\')"class="editar">' +
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
                    ctrl.documentos = response.data
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
                    break;
                case "add":
                    break;
                case "edit":
                    break;
                case "delete":
                    break;
                case "descarga":
                    console.log("descarga");
                    window.open(constantes.NUXEO_DOC + row.row_entity.IdDocumento.Enlace, '_blank');
                    break;
                default:
            }
        };

    });