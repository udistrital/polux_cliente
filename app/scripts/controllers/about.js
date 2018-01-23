'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
    .controller('AboutCtrl', function(nuxeo, $http, $scope, $sce, poluxRequest) {
        var ctrl = this;
        ctrl.nuxeo = nuxeo;
      /*  $http.get('http://jbpm.udistritaloas.edu.co:8280/services/academicaProxy/periodo_academico/A', {

        }).then(function(response) {
          console.log(response)
        });
        */

      /*  nuxeo.connect().then(function(client) {
            // OK, the returned client is connected
            console.log('Client is connected: ' + client.connected);
        }, function(err) {
            // cannot connect
            console.log('Client is not connected: ' + err);
        });
*/
        /*$http.get('http://jbpm.udistritaloas.edu.co:8280/services/academicaProxy/creditos_aprobados/20102020001', {

        }).then(function(response) {
            console.log(response);
            ctrl.creditos_aprobados=response.data.notas.nota[0].creditos_aprobados;
            //Créditos del pensum
            $http.get('http://jbpm.udistritaloas.edu.co:8280/services/academicaProxy/creditos_plan/205', {

              }).then(function(response) {
                console.log(response)
                ctrl.creditos_plan=response.data.creditosCollection.creditosPlan[0].creditos;
                console.log(ctrl.creditos_aprobados+"*100/"+ctrl.creditos_plan);
                var porcentaje_cursado=ctrl.creditos_aprobados*100/ctrl.creditos_plan;
                console.log(porcentaje_cursado);

              });
          });*/

        ctrl.trustSrc = function(src) {
          return $sce.trustAsResourceUrl(src);
        }

        $scope.someFunction = function(formato){
           console.log(formato);
        }

       ctrl.id="";

    });
