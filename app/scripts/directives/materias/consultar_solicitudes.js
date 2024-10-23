'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:consultarSolicitudes
 * @description
 * # consultarSolicitudes
 * Directiva que permite consultar las socilitudes de materias hechas por un estudiante.
 * Actualmente no se utiliza.
 * Controlador: {@link poluxClienteApp.directive:consultarSolicitudes.controller:consultarSolicitudesCtrl consultarSolicitudesCtrl}
 * @param {object} estudiante Estudiante del que se consultan las solicitudes
 * @param {number} s Número de solicitudes realizadas por el estudiante.
 * @param {number} modalidad Modalidad de grado, puede ser materias de posgrado o materias de profundización.
 */
angular.module('poluxClienteApp')
  .directive('consultarSolicitudes', function (poluxRequest, academicaRequest, $route) {
    return {
      restrict: 'E',
      scope: {
        estudiante: '=',
        s: '=',
        modalidad: '='
      },
      templateUrl: 'views/directives/materias/consultar_solicitudes.html',
      /**
       * @ngdoc controller
       * @name poluxClienteApp.directive:consultarSolicitudes.controller:consultarSolicitudesCtrl
       * @description
       * # consultarSolicitudesCtrl
       * # Controller of the poluxClienteApp.directive:consultarSolicitudes
       * Controlador de la directiva {@link poluxClienteApp.directive:consultarSolicitudes consultarSolicitudes}.
       * @requires services/poluxService.service:poluxRequest
       * @requires services/academicaService.service:academicaRequest
       * @requires $scope
       * @requires $route
       * @property {object} solicitud Solicitud n° 1 del estudiante
       * @property {object} solicitud2 Solicitud n° 2 del estudiante
       * @property {object} carreras Carreras donde el estudiante realizó solicitudes.
       * @property {object} estudiante Estudiante del qeu se consultan las solicitudes.
       */
      controller: function ($scope) {
        var ctrl = this;
        ctrl.solicitud = [];
        ctrl.solicitud2 = [];
        ctrl.a = [];
        ctrl.carreras = [];
        ctrl.estudiante = $scope.estudiante;

        /**
         * @ngdoc method
         * @name obtenerNombres
         * @methodOf poluxClienteApp.directive:consultarSolicitudes.controller:consultarSolicitudesCtrl
         * @param {array} asignaturas Arreglo de asignaturas que se consultarán.
         * @returns {array} Arreglo que contiene las asignaturas.
         * @description 
         * Permite buscar los datos de las asignaturas del servicio de {@link services/academicaService.service:academicaRequest academicaRequest}
         */
        ctrl.obtenerNombres = function (asignaturas, arreglo) {
          arreglo = [];
          angular.forEach(asignaturas, function (value) {
            //buscar los datos de la asignatura
            var parametros = {
              'codigo': value.IdAsignaturasElegibles.CodigoAsignatura
            };
            academicaRequest.buscarAsignaturas(parametros).then(function (resp) {
              arreglo.push(resp[0]);
            });
          });
          return arreglo;
        };

        /**
         * @ngdoc method
         * @name formalizarSolicitud
         * @methodOf poluxClienteApp.directive:consultarSolicitudes.controller:consultarSolicitudesCtrl
         * @param {object} solicitud Solicitud que se va a formalizar
         * @returns {undefined} No retorna ningún valor.
         * @description 
         * Permite formalizar alguna de las solicitudes realizadas por el estudiante.
         */
        ctrl.formalizarSolicitud = function (solicitud) {
          //si existen más solicitudes, quedan canceladas
          
          
          //se formaliza la solicitud
          angular.forEach(ctrl.solicitud2, function (value) {
            
            
            if (value.Id == solicitud.Id) {
              value.Formalizacion = 'confirmado';
              poluxRequest.put("solicitud_materias", solicitud.Id, value).then(function (response) {
                
              });
            }
            //se cancelan las sols adicionales
            else {
              value.Estado = 'rechazado';
              poluxRequest.put("solicitud_materias", value.Id, value).then(function (response) {
                
              });
            }
          })
          $route.reload();
        };

        /**
         * @ngdoc method
         * @name cargarParametros
         * @methodOf poluxClienteApp.directive:consultarSolicitudes.controller:consultarSolicitudesCtrl
         * @param {undefined} undefined No recibe ningún parametro.
         * @returns {undefined} No retorna ningún valor.
         * @description 
         * Permite cargar las solicitudes realizadas y los datos asociados.
         */
        academicaRequest.obtenerPeriodo().then(function (response) {
          ctrl.periodo = response[0];
          var parametros;
          if (ctrl.estudiante.TipoCarrera != "TECNOLOGIA") {
            //buscar si hay TG para el estudiante en la modalidad de materias de posgrado
            parametros = $.param({
              query: "Estudiante:" + ctrl.estudiante.Codigo + "," + "TrabajoGrado.Modalidad.Id:3",
              related: "TrabajoGrado"
            });
          } else {
            parametros = $.param({
              query: "Estudiante:" + ctrl.estudiante.Codigo + "," + "TrabajoGrado.Modalidad.Id:4",
              related: "TrabajoGrado"
            });
          }
          poluxRequest.get("estudiante_trabajo_grado", parametros).then(function (responseEst) {
            if (Object.keys(responseEst.data.Data[0]).length > 0) {
              //por cada TG, buscar la solicitud asociada al TG
              angular.forEach(responseEst.data.Data, function (value) {
                
                
                if ((ctrl.estudiante.Tipo == 'POSGRADO') && (value.IdTrabajoGrado.IdModalidad.Id == 3)) {
                  parametros = $.param({
                    query: "TrabajoGrado:" + value.IdTrabajoGrado.Id + ",Anio:" + ctrl.periodo.APE_ANO + ",Periodo:" + ctrl.periodo.APE_PER
                  });
                  //buscar las solicitudes asociadas al TG
                  poluxRequest.get("solicitud_materias", parametros).then(function (responseSol) {
                    
                    angular.forEach(responseSol.data.Data, function (valueSol) {
                      ctrl.solicitud2.push(valueSol);
                      ctrl.carreras.push(valueSol.CodigoCarrera);
                      //buscar nombre de la carrera
                      academicaRequest.get("carrera", [valueSol.CodigoCarrera]).then(function (resp) {
                        parametros = $.param({
                          query: "SolicitudMaterias:" + valueSol.Id,
                          related: "IdAsignaturasElegibles"
                        });
                        //buscar asignaturas asociadas a la solicitud
                        poluxRequest.get("asignatura_inscrita", parametros).then(function (resp2) {
                          angular.forEach(resp2.data.Data, function (valueAsig) {
                            //buscar nombre-datos de la asignaturas
                            parametros = {
                              'codigo': valueAsig.IdAsignaturasElegibles.CodigoAsignatura
                            };
                            academicaRequest.buscarAsignaturas(parametros).then(function (resp3) {
                              var asign = resp3[0];
                              ctrl.a.push(asign);

                            });
                          });
                          //
                          ctrl.asignaturas = resp2.data.Data;
                          var aaa = ctrl.obtenerNombres(resp2.data.Data);
                          var resultado = {
                            nombre: "",
                          };
                          if (!angular.isUndefined(resp2.data.Data.carrerasCollection.carrera)) {
                            resultado = response2.data.carrerasCollection.carrera[0];
                          }
                          var sol = {
                            "Id": valueSol.Id,
                            "Fecha": valueSol.Fecha,
                            "Estado": valueSol.Estado,
                            "Formalizacion": valueSol.Formalizacion,
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
                } else {
                  if ((ctrl.estudiante.Tipo == 'PREGRADO') && (value.IdTrabajoGrado.IdModalidad.Id == 4)) {
                    var parametrosSolicitudMaterias = $.param({
                      query: "IdTrabajoGrado:" + value.IdTrabajoGrado.Id + ",Anio:" + ctrl.periodo.APE_ANO + ",Periodo:" + ctrl.periodo.APE_PER
                    });
                    //buscar la solicitud asociada al TG
                    poluxRequest.get("solicitud_materias", parametrosSolicitudMaterias).then(function (responseSolMat) {
                      academicaRequest.get("carrera", [responseSolMat.data.Data[0].CodigoCarrera]).then(function (resp) {
                        var parametrosAsignaturaInscrita = $.param({
                          query: "IdSolicitudMaterias:" + responseSolMat.data.Data[0].Id,
                          related: "IdAsignaturasElegibles"
                        });
                        //buscar asignaturas asociadas a la solicitud
                        poluxRequest.get("asignatura_inscrita", parametrosAsignaturaInscrita).then(function (resp2) {
                          angular.forEach(resp2.data.Data, function (valueSolMat) {
                            //buscar nombre-datos de la asignaturas
                            var parametrosBuscarAsignaturas = {
                              'codigo': valueSolMat.IdAsignaturasElegibles.CodigoAsignatura
                            };
                            academicaRequest.buscarAsignaturas(parametrosBuscarAsignaturas).then(function (resp3) {
                              var asign = resp3[0];
                              ctrl.a.push(asign);
                            });
                          });

                          //
                          ctrl.asignaturas = resp2.data.Data;
                          var aaa = ctrl.obtenerNombres(resp2.data.Data);

                          if (!angular.isUndefined(resp.data.carrerasCollection.carrera)) {
                            var carrera = responseSolMat.data.carrerasCollection.carrera[0].nombre;
                          }
                          var sol = {
                            "Id": responseSolMat.data[0].Id,
                            "Fecha": responseSolMat.data[0].Fecha,
                            "Estado": responseSolMat.data[0].Estado,
                            "Formalizacion": responseSolMat.data[0].Formalizacion,
                            "Carrera": carrera
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
                  
                }
              });
            }
          });
        });
      },
      controllerAs: 'd_consultarSolicitudes'
    };
  });
