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
      //listar areas por docente
      listarDocentes:function (){
        $http.get("http://10.20.0.149/polux/index.php?data=G_Rq1d3UMbgUy219X8sw57GNOCZacwFTByxJII75OkXxOZ-HY1bScxf-JFdvOgyeKWwpnXkmSPY8h8LdJnYlwLQU9q6Cs_7G8SRSrsiccRYbwElYk1C9UmHzBRlT5_BY")
        .success(function(data) {
          var jsonDocente = data.substring(data.indexOf("["),data.lastIndexOf('}<json>'));
          var jsonObjDocente = JSON.parse(jsonDocente);
          servicio.docentes=jsonObjDocente;
          //console.log(jsonObjDocente);
        });
        return servicio.docentes;
      },
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
