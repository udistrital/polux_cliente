'use strict';

/**
* @ngdoc service
* @name poluxApp.evaluacion
* @description
* # evaluacion
* Factory in the poluxApp.
*/
angular.module('poluxApp')

.factory('evaluacion', function () {
  var servicio = {
    id_pregunta: 0,
    nombre:   '',
    introduccion: '',
    preguntas: [],
    paquete_formato:[],

    nueva_pregunta: function (data) {
      servicio.preguntas.push(data);
      servicio.id_pregunta = servicio.id_pregunta + 1;
    },
    nueva_respuestas_paquete: function (pregunta,paquete) {
      servicio.paquete_formato.push({id:pregunta, paquete:paquete});
      console.log(servicio.paquete_formato);
    },
    remove_pregunta: function (id) {
      if (servicio.id_pregunta > 0) {
        servicio.preguntas.splice(id-1, 1);
        servicio.id_pregunta --;

        for (var i = 0; i < servicio.id_pregunta -1  ; i++) {
          servicio.preguntas[i].id = i + 1;
        }
        for (var i = 0; i < servicio.paquete_formato.length; i++) {
          if(servicio.paquete_formato[i].id == id){
              servicio.paquete_formato.splice(i, 1);
          }
        }
      }
    }
  };
  return servicio;
});
