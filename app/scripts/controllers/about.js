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


/*TRANSACCIÓN DEL TRABAJO DE GRADO*/

//var data_detalles = [];
var data_trabajo_grado={};
var data_estudiantes = [];
var data_documento = {};
var data_doc_tg = {};
var data_areas = [];
var data_vinculacion = [];

       data_trabajo_grado={
            "Titulo": "titulo trabajo grado",
            "Modalidad": {
              "Id": 1
            },
            "EstadoTrabajoGrado": {
              "Id": 1
            },
            "DistincionTrabajoGrado": null
          }

       data_estudiantes=[{
          "Estudiante": "20141020036",
          "TrabajoGrado": {
            "Id": 0
          },
          "EstadoEstudianteTrabajoGrado": {
            "Id": 1
          }
        }]

        data_documento={
          "Titulo": "Prueba de los trabajos de grados en polux",
          "Enlace": "98e8656d-5e96-48a9-a6d9-9a4d19d931f9",
          "Resumen": "Esta es una prueba de los trabajos de grados de polux",
          "TipoDocumentoEscrito": 1
        }

        data_doc_tg={
          "TrabajoGrado": {
            "Id": 0
          },
          "DocumentoEscrito": {
            "Id": 0
          }
        }

        data_areas=[{
          "AreaConocimiento": {
            "Id": 2
          },
          "TrabajoGrado": {
            "Id": 0
          }
        }]

        data_vinculacion=[{
          "Usuario": 80093200,
          "Nombre": "C",
          "Activo": true,
          "FechaInicio": "2017-10-07T19:00:00-05:00",
          "FechaFin": "2017-12-23T11:25:39.976-05:00",
          "RolTrabajoGrado": {
            "Id": 1
          },
          "TrabajoGrado": {
            "Id": 0
          }
        }]

       ctrl.trabajo_grado={
          TrabajoGrado: data_trabajo_grado,
        	EstudianteTrabajoGrado: data_estudiantes,
        	DocumentoEscrito: data_documento,
        	DocumentoTrabajoGrado: data_doc_tg,
        	AreasTrabajoGrado: data_areas,
        	VinculacionTrabajoGrado: data_vinculacion
       }

       poluxRequest.post("tr_trabajo_grado", ctrl.trabajo_grado).then(function(response) {
         console.log(response);
       });

/*FIN TRANSACCIÓN DEL TRABAJO DE GRADO*/




        /*To find your API token go to https://kc.kobotoolbox.org/[yourusername]/api-token  a0e87739ca2d1cb2fc10eea61743d877e0f9d322
        http://10.20.2.75:8001/oas/api-token  86c7fb8f51375cecf7119d370ea2265b4182f64e

        https://kc.kobotoolbox.org/api/v1/data
        http://10.20.2.75:8001/api/v1/data
        */
      /*  $http.get('https://kc.kobotoolbox.org/api/v1/data', {
          headers: {
              "Authorization": 'Token a0e87739ca2d1cb2fc10eea61743d877e0f9d322'
          }
        }).then(function(response) {
          ctrl.formatos = response.data;
          console.log(response.data)
        });
*/
/*
        ctrl.actualizar_formato = function() {
            ctrl.id="";
            console.log(ctrl.SelectedFormat);*/

            /*https://kc.kobotoolbox.org/api/v1/forms/
            http://10.20.2.75:8001/api/v1/forms/  */
      /*
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
*/


    });
