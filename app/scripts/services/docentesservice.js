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
          console.log(jsonObjDocente);
        });
      },
      //listar areas por docente
      listarDocentes:function (){
        $http.get("http://10.20.0.149/polux/index.php?data=G_Rq1d3UMbgUy219X8sw57GNOCZacwFTByxJII75OkXxOZ-HY1bScxf-JFdvOgyeKWwpnXkmSPY8h8LdJnYlwLQU9q6Cs_7G8SRSrsiccRYbwElYk1C9UmHzBRlT5_BY")
        .success(function(data) {
          var jsonDocente = data.substring(data.indexOf("["),data.lastIndexOf('}<json>'));
          var jsonObjDocente = JSON.parse(jsonDocente);
          servicio.docentes=jsonObjDocente;
          console.log(jsonObjDocente);
        });
        return servicio.docentes;
      }



    };
    return servicio;

  });
