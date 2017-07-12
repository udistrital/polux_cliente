'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:FormatoFacultadCtrl
 * @description
 * # FormatoFacultadCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('FormatoFacultadCtrl', function (poluxRequest, academicaRequest) {
    var self = this;

    self.cargar_datos = function() {
      //cargar todos los formatos
      poluxRequest.get("formato", $.param({
        limit: "0"
      })).then(function(response) {
        self.formatos = response.data;
      });

      academicaRequest.obtenerCarreras({
        'tipo': 'PREGRADO'
      }).then(function(response){
        self.carreras=response;
      });
    };

    self.actualizar_formato = function() {
      //console.log($scope.SelectedFormat);
      poluxRequest.get("tr_formato/" + self.SelectedFormat, '')
        .then(function(response) {
          self.formato_vista = response.data;
        });
    };

    self.cargar_datos();
    self.actualizar_formato();

  });
