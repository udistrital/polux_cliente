'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:FormatoFacultadCtrl
 * @description
 * # FormatoFacultadCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('FormatoFacultadCtrl', function(poluxRequest, academicaRequest, $scope) {
    var ctrl = this;

    ctrl.cargar_datos = function() {
      //cargar todos los formatos
      poluxRequest.get("formato", $.param({
        limit: "0"
      })).then(function(response) {
        ctrl.formatos = response.data;
      });

      poluxRequest.get("modalidad", $.param({
        limit: "0"
      })).then(function(response) {
        ctrl.modalidades = response.data;
      });

      academicaRequest.obtenerCarreras({
        'tipo': 'PREGRADO'
      }).then(function(response) {
        ctrl.carreras = response;
      });
    };

    ctrl.actualizar_formato = function() {
      //console.log($scope.SelectedFormat);
      poluxRequest.get("tr_formato/" + ctrl.SelectedFormat, '')
        .then(function(response) {
          ctrl.formato_vista = response.data;
        });
    };

    ctrl.cargar_datos();
    ctrl.actualizar_formato();

    $scope.selected = [];

    $scope.toggle = function(item, list) {
      var idx = list.indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
      } else {
        list.push(item);
      }
    };

    $scope.exists = function(item, list) {
      return list.indexOf(item) > -1;
    };

    ctrl.guardar_datos = function() {
      angular.forEach($scope.selected, function(modalidad) {
        var data = {};
        data.IdFormato = "Id:" + ctrl.SelectedFormat ;
        data.IdModalidad = modalidad;
        data.Activo = true;
        data.CodigoProyecto = ctrl.selectedCareer;
        data.FechaInicio = ctrl.fecha_inicio;
        poluxRequest.post('formato_evaluacion_carrera', data)
          .then(function(response) {
            console.log(response.data);
          });
      });
    }

  });
