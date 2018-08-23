'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:FormatoFacultadCtrl
 * @description
 * # FormatoFacultadCtrl
 * Controller of the poluxClienteApp
 * Controlador que permite ver un formato de evaluación de una carrera en especifico pero buscando por la facultad. Como la dinámica de formatos
 * de evaluación no se utiliza en el sistema este controlador tampoco es utilizado.
 * @requires services/poluxService.service:poluxRequest
 * @requires $scope
 * @requires services/academicaService.service:academicaRequest
 * @requires $route
 */
angular.module('poluxClienteApp')
    .controller('FormatoFacultadCtrl', function (poluxRequest, academicaRequest, $scope, $route) {
        var ctrl = this;

        ctrl.cargar_datos = function () {
            //cargar todos los formatos
            poluxRequest.get("formato", $.param({
                limit: "0"
            })).then(function (response) {
                ctrl.formatos = response.data;
            });

            poluxRequest.get("modalidad", $.param({
                limit: "0"
            })).then(function (response) {
                ctrl.modalidades = response.data;
            });
            academicaRequest.get("carreras", ["PREGRADO"]).then(function (response) {
                ctrl.carreras = response.data.carrerasCollection;
            });
        };

        ctrl.actualizar_formato = function () {
            //console.log($scope.SelectedFormat);
            poluxRequest.get("tr_formato/" + ctrl.SelectedFormat, '')
                .then(function (response) {
                    ctrl.formato_vista = response.data;
                });
        };

        ctrl.cargar_datos();
        ctrl.actualizar_formato();

        $scope.selected = [];

        $scope.toggle = function (item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
            } else {
                list.push(item);
            }
        };

        $scope.exists = function (item, list) {
            return list.indexOf(item) > -1;
        };

        ctrl.guardar_datos = function () {
            ctrl.formato_facultad = [];
            angular.forEach($scope.selected, function (modalidad) {
                var data = {};
                data.IdFormato = { Id: parseInt(ctrl.SelectedFormat) };
                data.IdModalidad = modalidad;
                data.Activo = true;
                data.CodigoProyecto = parseFloat(ctrl.selectedCareer);
                data.FechaInicio = ctrl.fecha_inicio;
                ctrl.formato_facultad.push(data);
            });
            var formato_facultad_carrera = {};
            formato_facultad_carrera.formato_facultad = ctrl.formato_facultad;
            console.log(formato_facultad_carrera);
            poluxRequest.post("formato_evaluacion_carrera/TrFormatoEvaluacionCarrera", formato_facultad_carrera)
                .then(function (response) {
                    if (response.data === null) {
                        swal(
                            'Oops...',
                            'se asoció con éxito el formato',
                            'success'
                        );
                        $route.reload();
                    } else {
                        swal(
                            'Alerta',
                            'ha ocurrido un error',
                            'error'
                        );
                    }
                });
        };
    });
