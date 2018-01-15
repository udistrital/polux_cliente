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
          ctrl.socializacion=[];
            poluxRequest.get("socializacion", $.param({
                limit: "-1"
            })).then(function(response) {
                console.log(response);
                //ctrl.socializacion = response.data;

                angular.forEach(response.data, function(s) {
                  console.log(s);
                  //buscar datos tg
                  poluxRequest.get("trabajo_grado", $.param({
                      query: "Id:" + s.TrabajoGrado.Id
                  })).then(function(response2) {
                      s.TrabajoGrado = response2.data[0];
                      //buscar lugar
                      oikosRequest.get("espacio_fisico", $.param({
                          query: "Id:" + s.Lugar
                      })).then(function(response3) {
                        s.Lugar = response3.data[0];
                      });
                  });
                  console.log(s);
                  ctrl.socializacion.push(s);

                });

                console.log(ctrl.socializacion);
                ctrl.gridOptions.data = ctrl.socializacion;
                angular.forEach(ctrl.socializacion, function(social) {
                    oikosRequest.get("espacio_fisico", $.param({
                        query: "Codigo:" + social.Lugar,
                        limit: "-1",
                    })).then(function(response) {
                        ctrl.lugares = response.data;
                        //social.Lugar = response.data[0];
                    });
                });
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
                console.log(ctrl.lugares);
            });
        };
        ctrl.add_socializacion = function() {
            var data = {};
            console.log(ctrl.trabajo_grado.selected);
            ctrl.trabajo_grado.selected.$$hashKey = undefined;
            data.TrabajoGrado = ctrl.trabajo_grado.selected;
            data.Lugar = ctrl.lugar.selected.Id;
            data.Fecha = ctrl.fecha;
            console.log(data);
            poluxRequest.post("socializacion", data)
                .then(function(response) {
                    console.log(response.data);
                    $('#add').modal('hide');
                    swal(
                        '',
                        'Ha Asignado al proyecto ' + response.data.TrabajoGrado.Titulo + ' una socialización',
                        'success'
                    );
                    ctrl.get_socializacion();
                });
        };
        ctrl.get_trabajos_grado();
        ctrl.get_socializacion();

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
                    displayName: '#',
                    width: '5%'
                },
                {
                    field: 'TrabajoGrado.Titulo',
                    displayName: $translate.instant('TITULO_PROPUESTA'),
                    width: '60%'
                },
                {
                    field: 'Lugar.Nombre',
                    displayName: $translate.instant('LUGAR'),
                    cellTemplate: '<div align="center"><span>{{row.entity.Lugar.Codigo}} - {{row.entity.Lugar.Nombre}}</span></div>',
                    width: '15%'
                },
                {
                    field: 'Fecha',
                    displayName: $translate.instant('FECHA'),
                    cellTemplate: '<div align="center"><span>{{row.entity.Fecha| date:"yyyy-MM-dd":"+0900"}}</span></div>',
                    width: '20%'
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
                    ctrl.get_lugares();
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
