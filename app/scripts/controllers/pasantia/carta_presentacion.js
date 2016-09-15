'use strict';

/**
 * @ngdoc function
 * @name poluxApp.controller:PasantiaCartaPresentacionCtrl
 * @description
 * # PasantiaCartaPresentacionCtrl
 * Controller of the poluxApp
 */
angular.module('poluxApp')
  .controller('PasantiaCartaPresentacionCtrl', function (entidadRequest) {
    var cartapasantia =this;
    cartapasantia.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    cartapasantia.entidad ={};
    cartapasantia.entidades = entidadRequest.getAll();
  });
