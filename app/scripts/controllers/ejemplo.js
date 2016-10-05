'use strict';

/**
 * @ngdoc function
 * @name poluxApp.controller:EjemploCtrl
 * @description
 * # EjemploCtrl
 * Controller of the poluxApp
 */
angular.module('poluxApp')
  .controller('EjemploCtrl', function (ejemploRequest) {
    var self =this;
    self.documento = {id:1,
    titulo:"titulo de un documento",
    enlace:"images/dibujo.pdf",
    estado:"registrado",
    resumen:"este es el resumen"};
    self.servicio = ejemploRequest.metodoEjemplo();
    self.pagina = 13;

  });
