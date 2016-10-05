'use strict';

/**
 * @ngdoc function
 * @name poluxApp.controller:PasantiaCartaPresentacionCtrl
 * @description
 * # PasantiaCartaPresentacionCtrl
 * Controller of the poluxApp
 */
angular.module('poluxApp')
  .controller('PasantiaCartaPresentacionCtrl', function () {
    var cartapasantia =this;
    cartapasantia.entidad ={};
    cartapasantia.estudiante ={
      nombre: "pepe",
      apellido: "castro",
      codigo: "202020280080",
      carrera: "ing sistemas"
    };
  });
