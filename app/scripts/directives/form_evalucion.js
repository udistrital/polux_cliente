'use strict';

/**
* @ngdoc directive
* @name poluxApp.directive:formEvalucion
* @description
* # formEvalucion
*/
angular.module('poluxApp')

.directive('poFormEvalucion', function (evaluacion) {
    return {
        restrict:'E',
        templateUrl: "views/directives/form_evaluacion.html",
        controller: function () {
            var ctrl = this;
            ctrl.evaluacion = evaluacion;
            ctrl.evaluacion.id_pregunta++;

            ctrl.nueva_pregunta = function (tipo) {
                if ($('#enunciado_abierta').val().length > 0){
                    ctrl.id++;
                    var resp = {enunciado: ctrl.enunciado, tipo: tipo, id: ctrl.evaluacion.id_pregunta};
                    ctrl.evaluacion.nueva_pregunta(resp);
                    ctrl.enunciado = '';
                }else{
                    swal({
                        title: 'Espera...!',
                        text: 'Debes añadir un enunciado para crear una pregunta.',
                        timer: 1000
                    });
                }
            };
        },
        controllerAs: "FormEvaluacionCtrl"
    };
});
