'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:formato/llenarEvaluacion
 * @description
 * # formato/llenarEvaluacion
 */
angular.module('poluxClienteApp')
    .directive('llenarEvaluacion', function() {
        return {
            restrict: 'E',
            scope: {
                formato: '=?'
            },
            templateUrl: 'views/directives/formato/llenar_evaluacion.html',
            controller: function(poluxRequest, $scope) {

                var ctrl = this;
                $scope.selected = [];
                ctrl.enviar = [];

                ctrl.enviar_evaluacion = function() {
                    angular.forEach($scope.selected, function(data) {
                        ctrl.enviar.push({
                            RespuestaFormato: data
                        });
                    });
                };

                $scope.$watch('formato', function() {
                    console.log(ctrl.Formato);
                });

                poluxRequest.get("tr_formato/" + $scope.formato, "")
                    .then(function(response) {
                        ctrl.Formato = response.data;
                        angular.forEach(ctrl.Formato.TrPreguntas, function(data) {
                            if (data.Tipo == "cerrado_multiple") {
                                data.Respuestas = [];
                            }
                        });
                    });

                $scope.toggle = function(item, list) {
                    var idx = list.indexOf(item);
                    if (idx > -1) {
                        list.splice(idx, 1);
                    } else {
                        list.push(item);
                    }
                };

                $scope.exists = function(item, list) {
                    return list.indexOf(item) > -1;
                };

            },
            controllerAs: 'd_llenar_evaluacion'
        };
    });