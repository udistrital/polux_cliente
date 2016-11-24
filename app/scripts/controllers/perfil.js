'use strict';

/**
 * @ngdoc function
 * @name poluxApp.controller:PerfilCtrl
 * @description
 * # PerfilCtrl
 * Controller of the poluxApp
 */
angular.module('poluxApp')
  .controller('PerfilCtrl', function (areasService) {
    var perfilctrl=this;
    perfilctrl.scopearea=areasService.getNew();
    perfilctrl.scopeareas = areasService.getAll();
  });
