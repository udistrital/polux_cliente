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
    templateUrl: "views/directives/formato/form_evaluacion.html",
    controller: function () {
      var ctrl = this;

      ctrl.paquete    = null;
      ctrl.paquete_ver    = null;
      ctrl.pregunta   = null;
      ctrl.id_cerradas = [];
      ctrl.respuestas   =  [
        {
          id:1,
          name_package: 'si-no',
          options: [
            {name:'si',id:'1'},
            {name:'no',id:'2'}
          ]
        },
        { id:2,
          name_package: 'Totalmente-de-acuerdo',
          options: [
            {name:'Totalmente de acuerdo', id:'3'},
            {name:'De acuerdo',id:'4'},
            {name:'Ni de acuerdo, ni en desacuerdo',id:'5'},
            {name:'En desacuerdo',id:'6'}
          ]
        }
      ];

      ctrl.evaluacion = evaluacion;
      ctrl.evaluacion.id_pregunta++;

      ctrl.actualizar = function(){
        ctrl.paquete_ver = JSON.parse(ctrl.paquete);
      }

      ctrl.nuevo_paquete = function(){
        ctrl.evaluacion.nueva_respuestas_paquete(ctrl.pregunta, ctrl.paquete_ver);
        ctrl.pregunta = null;
        ctrl.paquete_ver = null;
        ctrl.paquete = null;

      }

      ctrl.nueva_pregunta = function (tipo) {
        if ($('#enunciado_abierta').val().length > 0){
          if(tipo === 'C'){
            ctrl.id_cerradas.push(ctrl.evaluacion.id_pregunta);
          }
          ctrl.id++;
          var resp = {enunciado: ctrl.enunciado, tipo: tipo, id: ctrl.evaluacion.id_pregunta};
          ctrl.evaluacion.nueva_pregunta(resp);
          ctrl.enunciado = '';
        }
      };
    },
    controllerAs: "FormEvaluacionCtrl"
  };
});
