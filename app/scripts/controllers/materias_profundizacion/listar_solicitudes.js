'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:MateriasProfundizacionListarSolicitudesCtrl
 * @description
 * # MateriasProfundizacionListarSolicitudesCtrl
 * Controller of the poluxClienteApp
 * Actualmente no está siendo utilizado este controlador, dado que correspondie a la modalidad de materias de profundización
 */
angular.module('poluxClienteApp')
  .controller('MateriasProfundizacionListarSolicitudesCtrl',
    function(poluxRequest, academicaRequest, $scope) {
      var ctrl = this;
      ctrl.periodo = [];
      ctrl.carreras = [];

      //uigrid
      ctrl.gridOptions = {};
      ctrl.gridOptions.columnDefs = [{
        name: 'solicitud',
        displayName: 'Solicitud',
        width: "10%"
      }, {
        name: 'fecha',
        displayName: 'Fecha',
        width: "15%"
      }, {
        name: 'estudiante',
        displayName: 'Código',
        width: "15%"
      }, {
        name: 'nombre',
        displayName: 'Nombre',
        width: "30%"
      }, {
        name: 'promedio',
        displayName: 'Promedio',
        width: "15%"
      }, {
        name: 'estado',
        displayName: 'Estado',
        width: "15%"
      }, ];

      academicaRequest.get("periodo_academico", "X").then(function(response) {
        if (!angular.isUndefined(response.data.periodoAcademicoCollection.periodoAcademico)) {
          ctrl.periodo = response.data.periodoAcademicoCollection.periodoAcademico[0];
        }
      });

      academicaRequest.get("carreras", ["PREGRADO"]).then(function(response) {
        if (!angular.isUndefined(response.data.carrerasCollection.carrera)) {
          ctrl.carreras = response.data.carrerasCollection.carrera;
        }
      });

      ctrl.buscarSolicitudes = function(carrera) {
        ctrl.carrera = carrera;
        $scope.carrera = carrera;
        if (carrera) {
          $scope.sols = [];
          var parametros = $.param({
            query: "Anio:" + ctrl.periodo.periodo + ",Periodo:" + ctrl.periodo.anio + ",CodigoCarrera:" + carrera
          });
          //buscar solicitudes
          poluxRequest.get("solicitud_materias", parametros).then(function(response) {
            console.log(response);
            angular.forEach(response.data, function(value) {
              ctrl.buscarEstudianteTg(value);
            });
          });
          ctrl.gridOptions.data = $scope.sols;
        }
      };

      ctrl.buscarEstudianteTg = function(tg) {
        var parametros = $.param({
          query: "IdTrabajoGrado:" + tg.IdTrabajoGrado.Id,
          fields: "CodigoEstudiante"
        });
        //buscar la solicitudes
        poluxRequest.get("estudiante_tg", parametros).then(function(response) {
          academicaRequest.get("datos_estudiante", [response.data[0].CodigoEstudiante, ctrl.periodo.anio, ctrl.periodo.periodo]).then(function(response2) {
            if (!angular.isUndefined(response2.data.estudianteCollection.datosEstudiante)) {
              var solicitud = {
                "solicitud": tg.Id,
                "fecha": tg.Fecha,
                "estudiante": response.data[0].CodigoEstudiante,
                "nombre": response2.data.estudianteCollection.datosEstudiante[0].nombre,
                "promedio": response2.data.estudianteCollection.datosEstudiante[0].promedio,
                "estado": tg.Estado
              };
              $scope.sols.push(solicitud);
            }
          });
        });
      }
    });