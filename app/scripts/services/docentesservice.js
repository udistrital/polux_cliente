'use strict';

/**
 * @ngdoc service
 * @name poluxApp.docentesService
 * @description
 * # docentesService
 * Factory in the poluxApp.
 */
angular.module('docentesService',[])
  .factory('docentesRequest', function ($http, $q) {

    var servicio = {
      docentes:[],
      docentesArea:[],
      mostrar:[],
      //listado de docentes
      obtenerDocentes:function(){
        $http.get("http://10.20.0.149/polux/index.php?data=G_Rq1d3UMbgUy219X8sw57GNOCZacwFTByxJII75OkXxOZ-HY1bScxf-JFdvOgyeKWwpnXkmSPY8h8LdJnYlwLQU9q6Cs_7G8SRSrsiccRYbwElYk1C9UmHzBRlT5_BY")
        .success(function(data) {
          var jsonDocente = data.substring(data.indexOf("["),data.lastIndexOf('}<json>'));
          var jsonObjDocente = JSON.parse(jsonDocente);
          servicio.docentes=jsonObjDocente;
          //console.log(jsonObjDocente);
        });
      },

      /*
      funcion listarDocentesArea: se trae el data dependiendo
      del codigo de area :IdAreaConocimiento
      */
      listarDocentesArea:function(codArea){

        $http.get("http://localhost:8080/v1/areas_docente/?query=IdAreaConocimiento%3A"+codArea)
        .success(function(data){
          if (data==null) {
            servicio.docentesArea=[];
          }else {
            servicio.docentesArea=servicio.unificarDocentes(data);

          }
        });

      },
      /*
      funcion unificarDocentes: se compara
      el parametro IdentificacionDocente de areas_docente con
      el de DOC_NRO_IDEN que viene de el servicio de docentes
      */
      unificarDocentes:function(data){
        var filtro=[];
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < servicio.docentes.length; j++) {
            if (data[i].IdentificacionDocente==servicio.docentes[j].DOC_NRO_IDEN) {
                //console.log(data[i].IdentificacionDocente +" Nombre: "+servicio.docentes[j].DOC_NOMBRE);
                filtro.push(
                  servicio.docentes[j]
                );
            }
          }

        }
        return filtro;
      },
/*
Funcion obtenerDocentesJson:
informacion provisional de ejemplo de docentes
*/

      obtenerDocentesJson:function(){
        var docenteJson = [
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
        servicio.docentes=docenteJson;
      }




    };
    return servicio;

  });
