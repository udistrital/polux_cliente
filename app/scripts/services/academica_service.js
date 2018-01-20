'use strict';

/**
 * @ngdoc service
 * @name poluxClienteApp.academicaService
 * @description
 * # academicaService
 * Factory in the poluxClienteApp.
 */
angular.module('academicaService', [])
    .factory('academicaRequest', function($http, CONF) {

        var path = "http://10.20.0.127/polux/index.php?data=";
        //var periodo = "sj7574MlJOsg4LjjeAOJP5CBi1dRh84M-gX_Z-i_0On4uKrtXAvwZ0V0Rn0jx7a9DpWV8USQg0uH8PEHS9mgJw";
        //var carreras = "sj7574MlJOsg4LjjeAOJP5CBi1dRh84M-gX_Z-i_0OlFcjLj2zQ5wW34uJpjj5pwevOJCnr9Xzx9Z7KT38Atd3O0c9_4iv7A6ODAQz8nzk3-L-wp9KXARJdYvqggsPUb";
        //var pensums = "sj7574MlJOsg4LjjeAOJP5CBi1dRh84M-gX_Z-i_0OnIVBtC05kzstJX6_qx6LgDBlcNYcrQP1Lz8z2iiZvWgQ";
        var asignaturas = "sj7574MlJOsg4LjjeAOJP5CBi1dRh84M-gX_Z-i_0OnPocKxqi6prdfjXOq1yymHX3abRIdvETpaO8S9lxTuR4Xq2CqQ4Xv9hT1-aS2d1AWBjKJ3XZ5zFWIghLxhGhnA";
        var promedio = "sj7574MlJOsg4LjjeAOJP5CBi1dRh84M-gX_Z-i_0OmC_hbsex4Tv1IrqkTYjEq0MQj_sfpjVUNQ7FG1R2tKwmypXuJCD3kPEhE-4YJTOXR-nf3m2xfG7TTOR1itS2t-";
        var docentes = "sj7574MlJOsg4LjjeAOJP5CBi1dRh84M-gX_Z-i_0OmWhton7vEvfcvwRdSGHCTl2WlcEunFl-15PLUWhzSwdnO0c9_4iv7A6ODAQz8nzk3-L-wp9KXARJdYvqggsPUb";
        var estudiantes = "sj7574MlJOsg4LjjeAOJP5CBi1dRh84M-gX_Z-i_0Om74SuwW6IkfDoYa6tncUbxFQOnPY89W5nK1iqlZM0A46MmBGhubLLF7DrHMUwJvi67vmq5o_7ABH2LLvMfV9hM";
        var porcentaje_cursado = "sj7574MlJOsg4LjjeAOJP5CBi1dRh84M-gX_Z-i_0Ok4ZN5LoYsioCLeOgBJwmWDK9e6x1T-0xKlpwCmwUjaXmypXuJCD3kPEhE-4YJTOXR-nf3m2xfG7TTOR1itS2t-";
        //var periodo_anterior = "sj7574MlJOsg4LjjeAOJP5CBi1dRh84M-gX_Z-i_0Okv8IQ9qNj125-wfzl-rR7R9IygNmerbc-w_VnnqEawBQ";
        //var coordinador_carrera = "sj7574MlJOsg4LjjeAOJP5CBi1dRh84M-gX_Z-i_0OmXyQ-hqKi02A-HoywRRQVhzx5WnJ2f7qi-ei4TkWGaUAFeySeBzV_jUp-Cp2YQC3-Q5iMzSdWmVtIklG3eZ8s2";
        var docentesTG = "sj7574MlJOsg4LjjeAOJP5CBi1dRh84M-gX_Z-i_0OmWhton7vEvfcvwRdSGHCTl2WlcEunFl-15PLUWhzSwdr0eXTqZJyKMJkeoxrgxRwA3AZcDeYW7lkxP8XpjclOP";

        var nueva_ruta = CONF.GENERAL.ACADEMICA_SERVICE;

        return {

            obtener: function(ruta, parametros) {
                return $http.get(path + ruta, { params: parametros })
                    .then(function(response) {
                        return response.data;
                    });
            },

            obtener_docente_id: function(ruta, parametros) {
                return $http.get(path + ruta + "&" + parametros)
                    .then(function(response) {
                        console.log(ruta + parametros);
                        var json = response.data.split("<json>");
                        var jsonObj = JSON.parse(json[1]);
                        return jsonObj;
                    });
            },

            buscarAsignaturas: function(parametros) {
                return this.obtener(asignaturas, parametros);
            },

            promedioEstudiante: function(parametros) {
                return this.obtener(promedio, parametros);
            },

            obtenerDocentes: function(parametros) {
                return this.obtener(docentes, parametros);
            },

            obtenerDocentesTG: function(parametros) {
                return this.obtener(docentesTG, parametros);
            },
            obtenerDocenteId: function(parametros) {
                return this.obtenerDocenteId(docentes, parametros);
            },

            obtenerEstudiantes: function(parametros) {
                return this.obtener(estudiantes, parametros);
            },

            porcentajeCursado: function(parametros) {
                return this.obtener(porcentaje_cursado, parametros);
            },

            get: function(service, params) {
                var param_string = "";

                /*angular.forEach(params, function(p) {
                    param_string += "/" + p.value;
                    console.log(p);
                });*/
                //return $http.get(nueva_ruta + "/" + service + param_string, { headers: { 'Accept': 'application/json' } });
                if(params){
                  return $http.get(nueva_ruta + "/" + service + "/" +params, { headers: { 'Accept': 'application/json' } });
                }else{
                  return $http.get(nueva_ruta + "/" + service, { headers: { 'Accept': 'application/json' } });
                }


            }

        };
    });
