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
          host: 'intelligentia.udistrital.edu.co', 
          port: '8443', 
          contextPath: 'SpagoBI', 
          controllerPath: 'servlet/AdapterHTTP'
        });
        $scope.$watch('boton', function (oldValue,newValue) {
          if ($scope.codigo && $scope.codigo.length !== 0 && $scope.periodo && $scope.periodo.length !== 0) {
            var parametros = '';
            parametros = 'codigo_carrera=' + $scope.codigo + '&Periodo=' + $scope.periodo;
            
            function execTest() {
              var url = sbi.api.getDocumentHtml({
                documentLabel: $scope.reporte, 
                executionRole: '/spagobi/user/admin', 
                parameters: {'PARAMETERS':parametros}, 
                displayToolbar: true, 
                displaySliders: true, 
                iframe: {
                    style: 'border: 0px;',
                    height: '500px;',
                    width: '100%.'
                }
              });
              
              $('#frame').html('');
              $('#frame').append(url);
            };

            sbi.api.authenticate({
              params: {
                user: 'sergio_orjuela',
                password: 'sergio_orjuela'
              },
              callback: {
                fn: execTest,
                scope: this
              }
            });
          }
        });
      },
      controllerAs:'d_reportesSpagobi'
    };
  });