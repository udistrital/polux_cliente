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
        templateUrl: "views/directives/vista_previa_evaluacion.html",
        controller: function () {
            var ctrl = this;
            ctrl.evaluacion = evaluacion;
            ctrl.remover_pregunta = function (id) {
                ctrl.evaluacion.remove_pregunta(id);
            };
        },
        controllerAs: "VistaPreviaEvaluacionCtrl"
    };
});
