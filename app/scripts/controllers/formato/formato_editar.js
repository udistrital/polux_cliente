'use strict';
function fnClone (obj) {
    return JSON.parse(JSON.stringify(obj));
}
/**
 * @ngdoc function
 * @name poluxClienteApp.controller:FormatoEditarCtrl
 * @description
 * # FormatoEditarCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('FormatoEditarCtrl', function(poluxRequest, $scope, uiGridTreeViewConstants) {

    var ctrl = this;
    ctrl.request = poluxRequest;
    ctrl.formatos = [];
    ctrl.formato_vista = null;
    $scope.SelectedFormat = null;
    $scope.copy_format = null;
    //cargar todos los formatos de la base de datos
    ctrl.get_all_format = function() {
      poluxRequest.get("formato", $.param({
        limit: "0"
      })).then(function(response) {
        ctrl.formatos = response.data;

      });
    };
    ctrl.get_all_format();

    ctrl.refresh_format_view = function() {
      console.log($scope.SelectedFormat);
      poluxRequest.get("tr_formato/" + $scope.SelectedFormat,'')
        .then(function(response) {
          ctrl.formato_vista = response.data;
          $scope.copy_format = fnClone(response.data);
        });
    };
  });
