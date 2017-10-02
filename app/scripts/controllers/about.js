'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
    .controller('AboutCtrl', function(nuxeo, $http, $scope, $sce) {
        var ctrl = this;
        ctrl.nuxeo = nuxeo;

        /*$http.get('http://athento.udistritaloas.edu.co:8080/nuxeo/api/v1/user/search?q=Administrator', {

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

        /*To find your API token go to https://kc.kobotoolbox.org/[yourusername]/api-token  a0e87739ca2d1cb2fc10eea61743d877e0f9d322
        http://10.20.2.75:8001/oas/api-token  86c7fb8f51375cecf7119d370ea2265b4182f64e

        https://kc.kobotoolbox.org/api/v1/data
        http://10.20.2.75:8001/api/v1/data
        */
        $http.get('https://kc.kobotoolbox.org/api/v1/data', {
          headers: {
              "Authorization": 'Token a0e87739ca2d1cb2fc10eea61743d877e0f9d322'
          }
        }).then(function(response) {
          ctrl.formatos = response.data;
          console.log(response.data)
        });


        ctrl.actualizar_formato = function() {
            ctrl.id="";
            console.log(ctrl.SelectedFormat);

            /*https://kc.kobotoolbox.org/api/v1/forms/
            http://10.20.2.75:8001/api/v1/forms/
            */
            var ruta='https://kc.kobotoolbox.org/api/v1/forms/'+ctrl.SelectedFormat+'/enketo';

            $http.get(ruta, {
              headers: {
                  "Authorization": 'Token a0e87739ca2d1cb2fc10eea61743d877e0f9d322'
              }
            }).then(function(response) {
              console.log(response.data)
                ctrl.id=response.data.enketo_url;
            });

        };

    });
