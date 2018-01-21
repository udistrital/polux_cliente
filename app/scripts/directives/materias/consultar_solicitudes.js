'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:materias/consultarSolicitudes
 * @description
 * # materias/consultarSolicitudes
 */
angular.module('poluxClienteApp')
  .directive('consultarSolicitudes', function (poluxRequest, academicaRequest, $route) {
    return {
      restrict: 'E',
      scope: {
          estudiante:'=',
          s:'=',
          modalidad: '='
      },
      templateUrl: 'views/directives/materias/consultar_solicitudes.html',

      controller:function($scope){
        var ctrl = this;
        ctrl.solicitud=[];
        ctrl.solicitud2=[];
        ctrl.a=[];
        ctrl.carreras=[];
        ctrl.estudiante = $scope.estudiante;

        ctrl.obtenerNombres = function(asignaturas, arreglo){
          var arreglo=[];
          angular.forEach(asignaturas, function(value) {
            //buscar los datos de la asignatura

            var parametros = {
             'codigo': value.IdAsignaturasElegibles.CodigoAsignatura
            };

            academicaRequest.buscarAsignaturas(parametros).then(function(resp){
              arreglo.push(resp[0]);
            });
          });
          return arreglo;
        };

        ctrl.formalizarSolicitud = function (solicitud){


          //si existen más solicitudes, quedan canceladas
          console.log("ctrl.solicitud2: ");
          console.log(ctrl.solicitud2);
          //se formaliza la solicitud
          angular.forEach(ctrl.solicitud2, function(value) {
            console.log("value.Id: " );
            console.log(value.Id);
            if(value.Id==solicitud.Id){
              value.Formalizacion='confirmado';
              poluxRequest.put("solicitud_materias",solicitud.Id, value).then(function(response){
                console.log("response.data confirmado: " + response.data);
              });
            }
            //se cancelan las sols adicionales
            else{
              value.Estado='rechazado';
              poluxRequest.put("solicitud_materias",value.Id, value).then(function(response){
                console.log("response.data rechazado: " + response.data);
              });
            }
          })

          $route.reload();

        };

        academicaRequest.obtenerPeriodo().then(function(response){
          ctrl.periodo=response[0];

          if(ctrl.estudiante.TipoCarrera!="TECNOLOGIA"){
            //buscar si hay TG para el estudiante en la modalidad de materias de posgrado
            var parametros=$.param({
              query:"Estudiante:"+ctrl.estudiante.Codigo+","+ "TrabajoGrado.Modalidad.Id:3",
              related:"TrabajoGrado"
            });
          }else{
            var parametros=$.param({
              query:"Estudiante:"+ctrl.estudiante.Codigo+","+ "TrabajoGrado.Modalidad.Id:4",
              related:"TrabajoGrado"
            });
          }

          poluxRequest.get("estudiante_trabajo_grado",parametros).then(function(response){

            if(response.data){

              //por cada TG, buscar la solicitud asociada al TG
              angular.forEach(response.data, function(value) {

                console.log(value.IdTrabajoGrado.IdModalidad.Id);
                console.log(ctrl.estudiante.Tipo);

                if((ctrl.estudiante.Tipo=='POSGRADO') && (value.IdTrabajoGrado.IdModalidad.Id==3)){

                  var parametros=$.param({
                    query:"TrabajoGrado:"+value.IdTrabajoGrado.Id+",Anio:"+ctrl.periodo.APE_ANO+",Periodo:"+ctrl.periodo.APE_PER
                  });

                  //buscar las solicitudes asociadas al TG
                  poluxRequest.get("solicitud_materias",parametros).then(function(response){

                    console.log(response.data);

                    angular.forEach(response.data, function(value) {
                      ctrl.solicitud2.push(value);
                      ctrl.carreras.push(value.CodigoCarrera);

                      //buscar nombre de la carrera
                      academicaRequest.get("carrera", [value.CodigoCarrera]).then(function(resp){
                        var parametros=$.param({
                          query:"SolicitudMaterias:"+value.Id,
                          related:"IdAsignaturasElegibles"
                        });

                        //buscar asignaturas asociadas a la solicitud
                        poluxRequest.get("asignatura_inscrita",parametros).then(function(resp2){

                          angular.forEach(resp2.data, function(value) {
                            //buscar nombre-datos de la asignaturas
                            var parametros = {
                             'codigo': value.IdAsignaturasElegibles.CodigoAsignatura
                            };
                            academicaRequest.buscarAsignaturas(parametros).then(function(resp3){
                              var asign=resp3[0];
                              ctrl.a.push(asign);

                            });
                          });

                          //console.log(resp2.data);
                          ctrl.asignaturas=resp2.data;
                          var aaa=ctrl.obtenerNombres(resp2.data);

                          var resultado=null;
                          if (!angular.isUndefined(resp2.data.carrerasCollection.carrera)) {
                              var resultado=response2.data.carrerasCollection.carrera[0];
                          }

                          var sol = {
                            "Id": value.Id,
                            "Fecha": value.Fecha,
                            "Estado": value.Estado,
                            "Formalizacion": value.Formalizacion,
                            "Carrera": resultado.nombre
                          };
                          var data = {
                            "Solicitud": sol,
                            "Asignaturas": aaa
                          };

                          ctrl.solicitud.push(data);
                        });
                      });



                    });


                  });

                }else{

                  if((ctrl.estudiante.Tipo=='PREGRADO') && (value.IdTrabajoGrado.IdModalidad.Id==4)){

                    var parametros=$.param({
                      query:"IdTrabajoGrado:"+value.IdTrabajoGrado.Id+",Anio:"+ctrl.periodo.APE_ANO+",Periodo:"+ctrl.periodo.APE_PER
                    });
                    //buscar la solicitud asociada al TG
                    poluxRequest.get("solicitud_materias",parametros).then(function(response){
                      academicaRequest.get("carrera", [response.data[0].CodigoCarrera]).then(function(resp){

                        var parametros=$.param({
                          query:"IdSolicitudMaterias:"+response.data[0].Id,
                          related:"IdAsignaturasElegibles"
                        });
                        //buscar asignaturas asociadas a la solicitud
                        poluxRequest.get("asignatura_inscrita",parametros).then(function(resp2){

                          angular.forEach(resp2.data, function(value) {
                            //buscar nombre-datos de la asignaturas
                            var parametros = {
                             'codigo': value.IdAsignaturasElegibles.CodigoAsignatura
                            };
                            academicaRequest.buscarAsignaturas(parametros).then(function(resp3){
                              var asign=resp3[0];
                              ctrl.a.push(asign);
                            });
                  	      });

                          //console.log(resp2.data);
                          ctrl.asignaturas=resp2.data;
                          var aaa=ctrl.obtenerNombres(resp2.data);

                          if (!angular.isUndefined(resp.data.carrerasCollection.carrera)) {
                              var carrera=response.data.carrerasCollection.carrera[0].nombre;
                          }
                          var sol = {
                            "Id": response.data[0].Id,
                            "Fecha": response.data[0].Fecha,
                            "Estado": response.data[0].Estado,
                            "Formalizacion": response.data[0].Formalizacion,
                            "Carrera":carrera
                          };
                          var data = {
                            "Solicitud": sol,
                            "Asignaturas": aaa
                          };

                          ctrl.solicitud.push(data);
                        });
                      });
                    });

                  }
                  console.log("No coincide con ninguna modalidad");
                }


              });
            }
          });

        });
      },
      controllerAs:'d_consultarSolicitudes'
    };
  });
