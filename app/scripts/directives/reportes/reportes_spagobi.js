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
        var sbi = Sbi.sdk;

        sbi.services.setBaseUrl({
          protocol: 'https', 
          host: 'inteligenciainstitucional.portaloas .udistrital.edu.co', 
          port: '443', 
          contextPath: 'knowage', 
          controllerPath: 'servlet/AdapterHTTP'
        });
        $scope.$watch('boton', function (oldValue,newValue) {
          if ($scope.codigo && $scope.codigo.length !== 0 && $scope.periodo && $scope.periodo.length !== 0) {
            var parametros = '';
            parametros = 'codigo_carrera=' + $scope.codigo + '&Periodo=' + $scope.periodo;
            
            function execTest() {
              var url = sbi.api.getDocumentHtml({
                documentLabel: $scope.reporte, 
                executionRole: '/spagobi/user/user', 
                parameters: {'PARAMETERS':parametros}, 
                displayToolbar: true, 
                displaySliders: true, 
                iframe: {
                    style: 'border: 0px;',
                    height: '500px;',
                    width: '100%.'
                }
              });
              url = "https://inteligenciainstitucional.portaloas.udistrital.edu.co/knowage/servlet/AdapterHTTP?ACTION_NAME=EXECUTE_DOCUMENT_ACTION&TOOLBAR_VISIBLE=true&ORGANIZATION=DEFAULT_TENANT&NEW_SitanJECT " = true & EL
               
              $('#frame').html('');
              $('#frame').append(url);
            };

            /*sbi.api.authenticate({
              params: {
                user: 'desarrollooas',
                password: 'desarrollooas'
              },
              callback: {
                fn: execTest,
                scope: this
              }
            });
            */
          }
        });
      },
      controllerAs:'d_reportesSpagobi'
    };
  });