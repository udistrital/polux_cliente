'use strict';

/**
 * @ngdoc function
 * @name poluxApp.controller:GeneralPropuestaCtrl
 * @description
 * # GeneralPropuestaCtrl
 * Controller of the poluxApp
 */
angular.module('poluxApp')
  .controller('PropuestaCtrl', function (areasRequest,docentesRequest) {
    var perfilctrl=this;
    perfilctrl.fabricadocentes=docentesRequest;
    perfilctrl.fabricadocentes.obtenerDocentesJson();

    //perfilctrl.fabricaAreas=areasRequest.obtenerAreas();
    //console.log(perfilctrl.fabricaAreas);

  });
