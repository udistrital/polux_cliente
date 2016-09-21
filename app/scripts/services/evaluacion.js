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
        nombre: '',
        introduccion: '',
        preguntas: [],
        respuestas: [],
        nueva_pregunta: function (data) {
            servicio.preguntas.push(data);
            servicio.id_pregunta = servicio.id_pregunta + 1;
        },
        nueva_respuesta: function (respuesta) {
            servicio.respuestas.push(respuesta);
        },
        remove_pregunta: function (id) {
            servicio.preguntas.splice(id - 1, 1);
            for (var i = 0; i < servicio.preguntas.lenght; i++) {
                servicio.preguntas[i].id = i + 1;
            }
            servicio.id_pregunta--;
        }
    };
    return servicio;
});
