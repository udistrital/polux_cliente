'use strict';

/**
 * @ngdoc service
 * @name poluxClienteApp.academicaService
 * @description
 * # academicaService
 * Factory in the poluxClienteApp.
 */
angular.module('academicaService', [])
  .factory('academicaRequest', function ($http) {

    var path = "http://10.20.0.127/polux/index.php?data=";
    var periodo = "sj7574MlJOsg4LjjeAOJP5CBi1dRh84M-gX_Z-i_0On4uKrtXAvwZ0V0Rn0jx7a9DpWV8USQg0uH8PEHS9mgJw";
    var carreras = "sj7574MlJOsg4LjjeAOJP5CBi1dRh84M-gX_Z-i_0OlFcjLj2zQ5wW34uJpjj5pwevOJCnr9Xzx9Z7KT38Atd3O0c9_4iv7A6ODAQz8nzk3-L-wp9KXARJdYvqggsPUb";
    var pensums = "sj7574MlJOsg4LjjeAOJP5CBi1dRh84M-gX_Z-i_0OnIVBtC05kzstJX6_qx6LgDBlcNYcrQP1Lz8z2iiZvWgQ";
    var asignaturas = "sj7574MlJOsg4LjjeAOJP5CBi1dRh84M-gX_Z-i_0OnPocKxqi6prdfjXOq1yymHX3abRIdvETpaO8S9lxTuR4Xq2CqQ4Xv9hT1-aS2d1AWBjKJ3XZ5zFWIghLxhGhnA";
    var promedio = "sj7574MlJOsg4LjjeAOJP5CBi1dRh84M-gX_Z-i_0OmC_hbsex4Tv1IrqkTYjEq0MQj_sfpjVUNQ7FG1R2tKwmypXuJCD3kPEhE-4YJTOXR-nf3m2xfG7TTOR1itS2t-";
    var docentes = "sj7574MlJOsg4LjjeAOJP5CBi1dRh84M-gX_Z-i_0OmWhton7vEvfcvwRdSGHCTl2WlcEunFl-15PLUWhzSwdnO0c9_4iv7A6ODAQz8nzk3-L-wp9KXARJdYvqggsPUb";
    var estudiantes = "sj7574MlJOsg4LjjeAOJP5CBi1dRh84M-gX_Z-i_0Om74SuwW6IkfDoYa6tncUbxFQOnPY89W5nK1iqlZM0A46MmBGhubLLF7DrHMUwJvi67vmq5o_7ABH2LLvMfV9hM";
    var porcentaje_cursado="sj7574MlJOsg4LjjeAOJP5CBi1dRh84M-gX_Z-i_0Ok4ZN5LoYsioCLeOgBJwmWDK9e6x1T-0xKlpwCmwUjaXmypXuJCD3kPEhE-4YJTOXR-nf3m2xfG7TTOR1itS2t-"
    var periodo_anterior="sj7574MlJOsg4LjjeAOJP5CBi1dRh84M-gX_Z-i_0Okv8IQ9qNj125-wfzl-rR7R9IygNmerbc-w_VnnqEawBQ"

    return {

       obtener:function(ruta, parametros){
        return $http.get(path+ruta, {params: parametros})
        .then(function(response){
          var json = response.data.split("<json>");
          var jsonObj = JSON.parse(json[1]);
          return jsonObj;
        });
      },

      obtenerPeriodo:function(parametros){
        return this.obtener(periodo, parametros);
      },

      obtenerCarreras:function(parametros){
        return this.obtener(carreras, parametros);
      },

      obtenerPensums:function(parametros){
        return this.obtener(pensums, parametros);
      },

      buscarAsignaturas:function(parametros){
        return this.obtener(asignaturas, parametros);
      },

      promedioEstudiante:function(parametros){
        return this.obtener(promedio, parametros);
      },

      obtenerDocentes:function(parametros){
        return this.obtener(docentes, parametros);
      },

      obtenerEstudiantes:function(parametros){
        return this.obtener(estudiantes, parametros);
      },

      porcentajeCursado:function(parametros){
        return this.obtener(porcentaje_cursado, parametros);
      },

      periodoAnterior:function(parametros){
        return this.obtener(periodo_anterior, parametros);
      },

      getAllEstudiantesJson:function(){
  return [
    {
      "DOC_NRO_IDEN": 211,
      "DOC_NOMBRE": "DAVID",
      "DOC_APELLIDO": "MORALES"
    },
    {
      "DOC_NRO_IDEN": 312,
      "DOC_NOMBRE":"FABIAN",
      "DOC_APELLIDO": "SANCHEZ"
    },
    {
      "DOC_NRO_IDEN": 323,
      "DOC_NOMBRE": "GEINER",
      "DOC_APELLIDO": "SALCEDO"
    },
    {
      "DOC_NRO_IDEN": 134,
      "DOC_NOMBRE": "MARIA FERNANDA",
      "DOC_APELLIDO": "AVENDAÑO"
    },
    {
      "DOC_NRO_IDEN": 512,
      "DOC_NOMBRE": "FABIO",
      "DOC_APELLIDO": "PARRA"
    },
    {
      "DOC_NRO_IDEN": 236,
      "DOC_NOMBRE": "ANDREY",
      "DOC_APELLIDO": "SARMIENTO"
    }
  ];
},
obtenerDocentesJson:function(){
 return [
   {
     "DOC_NRO_IDEN": 1,
     "DOC_NOMBRE": "CARLOS ",
     "DOC_APELLIDO": "MONTENEGRO"
   },
   {
     "DOC_NRO_IDEN": 2,
     "DOC_NOMBRE":"ALEJANDRO",
     "DOC_APELLIDO": "DAZA"
   },
   {
     "DOC_NRO_IDEN": 3,
     "DOC_NOMBRE": "FREDY",
     "DOC_APELLIDO": "PARRA"
   },
   {
     "DOC_NRO_IDEN": 4,
     "DOC_NOMBRE": "ALBA CONSUELO",
     "DOC_APELLIDO": "NIETO"
   },
   {
     "DOC_NRO_IDEN": 5,
     "DOC_NOMBRE": "LUZ DEICY",
     "DOC_APELLIDO": "ALVARADO"
   },
   {
     "DOC_NRO_IDEN": 6,
     "DOC_NOMBRE": "JULIO",
     "DOC_APELLIDO": "BARON"
   },
   {
     "DOC_NRO_IDEN": 19,
     "DOC_NOMBRE": "JOSE NELSÓN",
     "DOC_APELLIDO": "PEREZ"
   }
 ];
 },

    };
  });
