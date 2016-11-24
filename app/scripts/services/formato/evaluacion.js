'use strict';

/**
 * @ngdoc service
 * @name poluxApp.evaluacion
 * @description
 * # evaluacion
 * Factory in the poluxApp.
 */
angular.module('poluxApp')

        .factory('evaluacion', function ($http) {
            var servicio = {
                rutaBase: "http://localhost:8080/v1/",
                nombre: '',
                introduccion: '',
                preguntas: [],
                paquete_formato: [],
                peso : {min : 0, max:100, t:0},

                peso_total:function(){
                    servicio.peso.t = 0;
                    for (var i = 0; i < servicio.preguntas.length; i++) {
                        servicio.peso.t += servicio.preguntas[i].peso;
                    }if(servicio.peso.t > servicio.peso.max){
                        servicio.peso.max = servicio.peso.t;
                    }
                    return servicio.peso;
                },

                guardar_evaluacion: function () {
                    $http.get(servicio.rutaBase + "formato/")
                            .success(function (data) {
                                console.log(data);
                            });
                }
            };
            return servicio;
        });
