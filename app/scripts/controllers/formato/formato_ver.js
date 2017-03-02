'use strict';

/**
 * @ngdoc function
 * @name poluxApp.controller:FormatoVerCtrl
 * @description
 * # FormatoVerCtrl
 * Controller of the poluxApp
 */
angular.module('poluxApp')
  .controller('FormatoVerCtrl', function(poluxRequest, $scope) {
    var ctrl = this;
    ctrl.request = poluxRequest;
    ctrl.formatos = [];
    ctrl.get_all_format = function() {
      poluxRequest.get("formato", $.param({
        limit: "0"
      })).then(function(response) {
        ctrl.formatos = response.data;
        console.log(ctrl.formatos);
      })
    };
    ctrl.get_all_format();
  });
