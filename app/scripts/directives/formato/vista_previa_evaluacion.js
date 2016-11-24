'use strict';

/**
* @ngdoc directive
* @name poluxApp.directive:vistaPreviaEvaluacion
* @description
* # vistaPreviaEvaluacion
*/
angular.module('poluxApp')
.directive('poVistaPreviaEvaluacion', function (evaluacion) {
    return {
        restrict:'E',
        templateUrl: "views/directives/formato/vista_previa_evaluacion.html",
        controller: function ($scope) {
            var ctrl = this;
            $scope.evaluacion = evaluacion;

            $scope.pdf_evaluacion = {
            pageSize: 'LETTER',
            content: [
                {
                    text: 'FORMATO DE EVALUACION \n ' +
                            $scope.evaluacion.nombre,
                    style: 'header'
                }
                , {
                    table: {
                        style: 'demoTable',
                        // headers are automatically repeated if the table spans over multiple pages
                        // you can declare how many rows should be treated as headers
                        headerRows: 1,
                        widths: [15, 70, 300, 100],
                        body: []
                    }
                }
            ],
            styles: {
                header: {
                    bold: true,
                    color: '#000',
                    fontSize: 14,
                    alignment: 'center'
                },
                demoTable: {
                    color: '#666',
                    fontSize: 10
                }
            }

        };
            ctrl.enviar = function (id) {
                ctrl.evaluacion.guardar_evaluacion();
            };

        },
        controllerAs: "VistaPreviaEvaluacionCtrl"
    };
});
