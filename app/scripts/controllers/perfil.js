'use strict';

/**
 * @ngdoc function
 * @name poluxApp.controller:PerfilCtrl
 * @description
 * # PerfilCtrl
 * Controller of the poluxApp
 */
angular.module('poluxApp')
  .controller('PerfilCtrl', function (areasRequest,docentesRequest) {
    var perfilctrl=this;
    perfilctrl.fabricadocentes=docentesRequest;
    perfilctrl.fabricadocentes.obtenerDocentesJson();
    //console.log(perfilctrl.scopearea);
    //perfilctrl.scopeareas= areasService.obtenerAreas();
    //cambia el estado del boton que genera la nueva vista de creación de areas.
    perfilctrl.menucreacion=false;
    perfilctrl.estadoboton=function(estado){
      if (estado){ return false; }
      else{ return true;}
    };

  });
