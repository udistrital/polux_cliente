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

        nuxeo.connect().then(function(client) {
            // OK, the returned client is connected
            console.log('Client is connected: ' + client.connected);
        }, function(err) {
            // cannot connect
            console.log('Client is not connected: ' + err);
        });

        ctrl.trustSrc = function(src) {
          return $sce.trustAsResourceUrl(src);
        }

        $scope.someFunction = function(formato){
           console.log(formato);
        }

       ctrl.id="";

    });
