'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:GeneralConsultaPropuestaCtrl
 * @description
 * # GeneralConsultaPropuestaCtrl
 * Controller of the poluxClienteApp
 */


angular.module('poluxClienteApp')
    .controller('ConsultaPropuestaCtrl', function(poluxRequest, $translate, $scope, constantes, nuxeo) {
        var ctrl = this;
        ctrl.nuxeo = nuxeo;
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
                    //<button class="btn primary" ng-click="grid.appScope.deleteRow(row)">Delete</button>
                    name: $translate.instant('OPCIONES'),
                    enableFiltering: false,
                    width: '10%',

                    cellTemplate: '<center>' +
                        '<a class="ver" ng-click="grid.appScope.load_row(row,\'ver\')" data-toggle="modal" data-target="#modalVer">' +
                        '<i class="fa fa-eye fa-lg  faa-shake animated-hover" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.VER\' | translate }}"></i></a> ' +
                        '<a class="editar" ng-click="grid.appScope.load_row(row,\'edit\');" data-toggle="modal" data-target="#myModal">' +
                        '<i data-toggle="tooltip" title="{{\'BTN.EDITAR\' | translate }}" class="fa fa-pencil fa-lg  faa-shake animated-hover" aria-hidden="true"></i></a> ' +
                        '<a class="configuracion" ng-click="grid.appScope.load_row(row,\'config\');" data-toggle="modal" data-target="#modalConf">' +
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
                    break;
                case "add":
                    break;
                case "edit":
                    break;
                case "delete":
                    break;
                case "descargar":
                    ctrl.nuxeo.repository().fetch(ctrl.row_entity.IdDocumento.Enlace)
                        .then(function(doc) {
                            doc.fetchBlob()
                                .then(function(res) {
                                    window.open(res.url);
                                    // in Node.js, use res.body
                                })
                                .catch(function(error) {
                                    throw error;
                                });
                        })
                        .catch(function(error) {
                            throw error;
                        });

                    break;
                default:
            }
        };

    });