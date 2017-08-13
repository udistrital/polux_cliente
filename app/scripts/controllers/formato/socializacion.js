'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:SocializacionCtrl
 * @description
 * # SocializacionCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
    .controller('SocializacionCtrl', function(poluxRequest, oikosRequest, $translate, $scope) {
        var ctrl = this;
        ctrl.get_socializacion = function() {
            poluxRequest.get("socializacion", $.param({
                limit: "-1"
            })).then(function(response) {
                ctrl.socializacion = response.data;
                ctrl.gridOptions.data = response.data;
            });
        };
        ctrl.get_trabajos_grado = function() {
            poluxRequest.get("trabajo_grado", $.param({
                limit: "-1"
            })).then(function(response) {
                ctrl.trabajos_grado = response.data;
            });
        };
        ctrl.get_lugares = function() {
            oikosRequest.get("espacio_fisico", $.param({
                limit: "-1"
            })).then(function(response) {
                ctrl.lugares = response.data;
            });
        };
        ctrl.add_socializacion = function() {
            var data = {};
            data.IdTrabajoGrado = ctrl.trabajo_grado.selected;
            console.log(ctrl.time);
            // poluxRequest.post("socializacion", $.param({
            //     limit: "-1"
            // })).then(function(response) {
            //     ctrl.socializacion = response.data;
            //     ctrl.gridOptions.data = response.data;
            // });
        };
        ctrl.get_trabajos_grado();
        ctrl.get_socializacion();
        ctrl.get_lugares();

        ctrl.operacion = "";
        ctrl.row_entity = {};
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
                    field: 'Id',
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

                        '<a class="configuracion" ng-click="grid.appScope.load_row(row,\'config\');" data-toggle="modal" data-target="#myModal">' +
                        '<i data-toggle="tooltip" title="{{\'BTN.CONFIGURAR\' | translate }}" class="fa fa-cog fa-lg faa-spin animated-hover" aria-hidden="true"></i></a> ' +

                        '<a  ng-click="grid.appScope.consultaPropuesta.load_row(row,\'descargar\')" class="editar">' +
                        '<i data-toggle="tooltip" title="{{\'BTN.DESCARGAR\' | translate }}" class="fa fa-download faa-shake animated-hover" aria-hidden="true"></i></a>' +

                        '</center>'
                }
            ]
        };
        ctrl.gridOptions.enablePaginationControls = true;
        ctrl.gridOptions.multiSelect = false;

        ctrl.gridOptions.onRegisterApi = function(gridApi) {
            ctrl.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function() {});
        };
        ctrl.load_row = function(row, operacion) {
            ctrl.row_entity = row.entity;
            switch (operacion) {
                case "ver":
                    //ctrl.docentes = academicaRequest.obtenerDocentes();
                    break;
                case "add":
                    $('#add').modal('show');
                    break;
                case "edit":
                    break;
                case "delete":
                    break;
                case "descargar":
                    break;
                default:
            }
        };

    });