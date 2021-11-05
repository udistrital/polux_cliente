'use strict';

/**
* @ngdoc directive
* @name poluxClienteApp.directive:reportesSpagobi
* @description
* # reportesSpagobi
*/
angular.module('poluxClienteApp')
  .directive('spagobi', function () {
    return {
      restrict: "E",
      scope:{ 
          reporte: "@",
          codigo: "=",
          periodo: "=",
          boton: "="
      },
      template: '<div id="frame" ></div>',
      controller:function($scope){
        $scope.$watch('boton', function (oldValue,newValue) {
       //   if ($scope.codigo && $scope.codigo.length !== 0 && $scope.periodo && $scope.periodo.length !== 0) {
            var parametros = '';
            parametros = 'codigo_carrera=' + $scope.codigo + '&Periodo=' + $scope.periodo;       
            url="https://inteligenciainstitucional.portaloas.udistrital.edu.co/knowage/servlet/AdapterHTTP?ACTION_NAME=EXECUTE_DOCUMENT_ACTION&TOOLBAR_VISIBLE=true&ORGANIZATION=DEFAULT_TENANT&NEW_SESSION=true&OBJECT_LABEL="+ReportePoluxG
            $('#frame').html('');
            $('#frame').append(url);
          
       // }
      });
    },
    controllerAs:'d_reportesSpagobi'
  };
});