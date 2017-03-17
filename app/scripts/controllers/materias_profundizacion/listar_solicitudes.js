'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:MateriasProfundizacionListarSolicitudesCtrl
 * @description
 * # MateriasProfundizacionListarSolicitudesCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('MateriasProfundizacionListarSolicitudesCtrl', function (poluxRequest, academicaRequest) {
    var ctrl = this;
    ctrl.periodo=[];
    ctrl.carreras=[];

    //uigrid
    ctrl.gridOptions = {};
    ctrl.gridOptions.columnDefs = [
      { name: 'solicitud', displayName: 'Solicitud', width: "10%"  },
      { name: 'fecha', displayName: 'Fecha', width: "15%"  },
      { name: 'estudiante', displayName: 'Código', width: "15%"  },
      { name: 'nombre', displayName: 'Nombre', width: "30%"  },
      { name: 'promedio', displayName: 'Promedio', width: "15%"  },
      { name: 'estado', displayName: 'Estado', width: "15%"  },
    ];


    academicaRequest.obtenerPeriodo().then(function(response){
      ctrl.periodo=response[0];
    });

    var parametros = {
      'tipo': 'PREGRADO'
   };
    academicaRequest.obtenerCarreras(parametros).then(function(response){
      ctrl.carreras=response;
    });

    ctrl.buscarSolicitudes = function(carrera){
      if(carrera){
        ctrl.sols=[];
        var parametros=$.param({
          query:"Anio:"+ctrl.periodo.APE_ANO+",Periodo:"+ctrl.periodo.APE_PER+",CodigoCarrera:"+carrera
        });
        //buscar la solicitudes
        poluxRequest.get("solicitud_materias",parametros).then(function(response){
          angular.forEach(response.data, function(value) {
            ctrl.buscarEstudianteTg(value);
          });
        });
        ctrl.gridOptions.data = ctrl.sols;
      }
    };

    ctrl.buscarEstudianteTg = function(tg){
      var parametros=$.param({
        query:"IdTrabajoGrado:"+tg.IdTrabajoGrado.Id,
        fields: "CodigoEstudiante"
      });
      //buscar la solicitudes
      poluxRequest.get("estudiante_tg",parametros).then(function(response){

        var parametros = {
          'codigo' : response.data[0].CodigoEstudiante
        };
        academicaRequest.promedioEstudiante(parametros).then(function(response2){

          var solicitud = {
            "solicitud": tg.Id,
            "fecha": tg.Fecha,
            "estudiante": response.data[0].CodigoEstudiante,
            "nombre": response2[0].NOMBRE,
            "promedio": response2[0].PROMEDIO,
            "estado": tg.Estado
          };
          ctrl.sols.push(solicitud);
        });

      });
    }
  });
