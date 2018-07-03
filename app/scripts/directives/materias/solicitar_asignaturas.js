'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:solicitarAsignaturas
 * @description
 * # materias/solicitarAsignaturas
 * Directiva que permite solicitar asignaturas para cursar la modalidad de espacios academicos de posgrado o de profundizacion
 * Controlador: {@link poluxClienteApp.directive:solicitarAsignaturas.controller:solicitarAsignaturasCtrl solicitarAsignaturasCtrl}
 * @param {object} estudiante Estudiante que esta realizando la solicitud
 * @param {number} modalidad Identificador de la modalidad que cursará el estudiante
 * @param {object} carrerasElegidas Contiene las carreras que el estudiante escogio si ha realizado solicitudes inicales de materias de posgrado antes para el mismo periodo.
 */
 angular.module('poluxClienteApp')
.directive('solicitarAsignaturas', function($q,poluxRequest, academicaRequest, $route,poluxMidRequest) {
    return {
        restrict: 'E',
        scope: {
            estudiante: '=',
            modalidad: '=',
            e: '=?',
        },
        templateUrl: 'views/directives/materias/solicitar_asignaturas.html',
        /**
         * @ngdoc controller
         * @name poluxClienteApp.directive:solicitarAsignaturas.controller:solicitarAsignaturasCtrl
         * @description
         * # poluxClienteApp.directive:solicitarAsignaturas.controller:solicitarAsignaturasCtrl
         * Controller of the poluxClienteApp.directive:solicitarAsignaturas
         * Controlador de la directiva Solicitar asignaturas que permite a un estudiante solicitar asignaturas en las modalidades
         * de materias de posgrado y profundización
         * @requires $q
         * @requires $route
         * @requires services/academicaService.service:academicaRequest
         * @requires services/poluxMidService.service:poluxMidRequest
         * @requires services/poluxService.service:poluxRequest
         * @property {object} creditosMinimos Minimo de créditos que tiene que inscribir el estudiante en la modalidad
         * @property {object} carreras Listado de carreras elegibles para el estudiante
         * @property {object} asignaturas Listado de asignaturas elegibles asociadas a una carrera elegible para el estudiante
         * @property {object} gridOptions Opciones del ui-grid donde se muestran las asignaturas
         */
        controller: function($scope, $route, $translate) {
            var ctrl = this;
            ctrl.cargando = $translate.instant("LOADING.CARGANDO_ASIGNATURAS");
            ctrl.loading = true;
            ctrl.maxCreditos = 0;
            ctrl.carreras = [];
            ctrl.gridOptions = {};
            ctrl.estudiante = $scope.estudiante;
            if ($scope.estudiante.Modalidad === 3) {
                $scope.estudiante.Tipo = "PREGRADO";
            }
            ctrl.tipo = $scope.estudiante.Tipo;
            $scope.sols = [];
            if ($scope.e === undefined) {
                $scope.e = [];
               // $scope.e = {
                    //"Codigo": "null",
               // };
            }
            console.log("carreras ya elegidas", $scope.e);
            /*número de créditos mínimos, según la modalidad
              modalidad de espacios académicos de posgrado: 8 créditos,
              modalidad de espacios académicos de profundización: 6 créditos*/
            ctrl.creditosMinimos = 0;
            //if ($scope.modalidad == 2) {
               // ctrl.creditosMinimos = 8;
            //} else {
               // ctrl.creditosMinimos = 6;
            //}
            /**
             * @ngdoc method
             * @name cargarDatos
             * @methodOf poluxClienteApp.directive:solicitarAsignaturas.controller:solicitarAsignaturasCtrl
             * @param {undefined} undefined No recibe parametros
             * @returns {undefined} No retorna ningún valor
             * @description 
             * Permite obtener los datos de las carreras y las asignaturas, primero busa el periodo academeco actual del servicio 
             * {@link services/academicaService.service:academicaRequest academicaRequest}, consulta en {@link services/poluxMidService.service:poluxMidRequest poluxMidRequest} la cantidad de ccreditos que debe cursarse en la modalidad,
             *  con esto busca las carreras elegibles  del servicio {@link services/poluxService.service:poluxRequest poluxRequest} y los nombres de {@link services/academicaService.service:academicaRequest academicaRequest}.
             */  
            academicaRequest.get("periodo_academico", "X").then(function(response) {
                if (!angular.isUndefined(response.data.periodoAcademicoCollection.periodoAcademico)) {
                    ctrl.periodo = response.data.periodoAcademicoCollection.periodoAcademico[0];
                }

                //buscar las carreras q tengan asignaturas en asignaturas_elegibles para el año y el periodo
                var parametros = $.param({
                    query: "Anio:" + ctrl.periodo.anio + ",Periodo:" + ctrl.periodo.periodo,
                    fields: "CodigoCarrera,CodigoPensum"
                });
                poluxRequest.get("carrera_elegible", parametros).then(function(response) {
                    var promises = []
                    var getCreditos = function(){
                        var defer = $q.defer();
                        poluxMidRequest.get("creditos_materias/ObtenerCreditos").then(function(responseCreditos){
                            if ($scope.modalidad == 2) {
                                ctrl.creditosMinimos = responseCreditos.data.MateriasPosgrado;
                            } else {
                                ctrl.creditosMinimos = responseCreditos.data.MateriasProfundizacion;
                            }
                            defer.resolve()
                        })
                        .catch(function(error){
                            defer.reject(error);
                        });
                        return defer.promise;
                    }
                    var getCarrera = function(value){
                      var defer = $q.defer()
                      academicaRequest.get("carrera_codigo_nivel", [value.CodigoCarrera, ctrl.tipo]).then(function(response2) {
                          var resultado = null;
                          if (!angular.isUndefined(response2.data.carrerasCollection.carrera)) {
                              resultado = response2.data.carrerasCollection.carrera[0];
                          }
                          if (resultado !== null) {
                              var carrera = {
                                  "Codigo": value.CodigoCarrera,
                                  "Nombre": resultado.nombre,
                                  "Pensum": value.CodigoPensum
                              };
                              ctrl.carreras.push(carrera);
                          }
                          defer.resolve();
                      })
                      .catch(function(error){
                        defer.reject(error);
                      });
                      return defer.promise
                    }
                    promises.push(getCreditos());
                    angular.forEach(response.data, function(value) {
                        //if (value.CodigoCarrera !== $scope.e.Codigo) {
                        if (!$scope.e.includes(value.CodigoCarrera)) {
                            promises.push(getCarrera(value));
                        }
                    });
                    $q.all(promises).then(function(){
                      ctrl.loading = false;
                    })
                    .catch(function(error){
                      console.log(error);
                      ctrl.errorCargando = true;
                      ctrl.loading = false;
                    });
                })
                .catch(function(error){
                  console.log(error);
                  ctrl.errorCargando = true;
                  ctrl.loading = false;
                });
            })
            .catch(function(error){
              console.log(error);
              ctrl.errorCargando = true;
              ctrl.loading = false;
            });

            /**
             * @ngdoc method
             * @name cargarMaterias
             * @methodOf poluxClienteApp.directive:solicitarAsignaturas.controller:solicitarAsignaturasCtrl
             * @param {number} carreraSeleccionada Identificador de la carrera seleccionada.
             * @returns {undefined} No retorna ningún valor
             * @description 
             * Carga las materias publicadas con la carrera elegible del servicio de {@link services/poluxService.service:poluxRequest poluxRequest} y los datos de la misma (nombre y créditos) de 
             * {@link services/academicaService.service:academicaRequest academicaRequest}.
             */ 
            ctrl.cargarMaterias = function(carreraSeleccionada) {
                ctrl.loadingAsignaturas = true;
                ctrl.selected = [];
                ctrl.selected.push(carreraSeleccionada);
                $scope.estudiante.asignaturas_elegidas = ctrl.selected;
                ctrl.asignaturas = [];

                ctrl.carrera = carreraSeleccionada.Codigo;

                //buscar la carrera en: carrera_elegible
                var parametros = $.param({
                    query: "Anio:" + ctrl.periodo.anio + ",Periodo:" + ctrl.periodo.periodo + ",CodigoCarrera:" + carreraSeleccionada.Codigo
                });

                poluxRequest.get("carrera_elegible", parametros).then(function(response) {

                    //asignaturas elegibles para ser vistas en la modalidad de espacios académicos de posgrado
                    var parametros = $.param({
                        query: "CarreraElegible:" + response.data[0].Id+",Activo:true"
                    });

                    poluxRequest.get("espacios_academicos_elegibles", parametros).then(function(response) {
                      var promises = [];
                      var getAsignatura = function(value){
                        var defer = $q.defer();
                        academicaRequest.get("asignatura_pensum", [value.CodigoAsignatura, value.CarreraElegible.CodigoPensum]).then(function(responseAsignatura) {
                            var data = {
                                "Id": value.Id,
                                "Anio": value.Anio,
                                "CodigoAsignatura": value.CodigoAsignatura,
                                "CodigoCarrera": value.CodigoCarrera,
                                "CodigoPensum": value.CodigoPensum,
                                "Periodo": value.Periodo,
                                "Nombre": responseAsignatura.data.asignatura.datosAsignatura[0].nombre,
                                "Creditos": responseAsignatura.data.asignatura.datosAsignatura[0].creditos
                            };
                            ctrl.asignaturas.push(data);
                            defer.resolve();
                        })
                        .catch(function(error){
                          defer.reject(error);
                        });
                          return defer.promise;
                        }
                        //recorrer data y buscar datos de las asignaturas
                        angular.forEach(response.data, function(value) {
                            //buscar asignaturas
                            promises.push(getAsignatura(value));
                        });
                        //ui-grid
                        ctrl.gridOptions.columnDefs = [{
                            name: 'CodigoAsignatura',
                            displayName: $translate.instant('CODIGO'),
                            width: 200
                        }, {
                            name: 'Nombre',
                            displayName: $translate.instant('NOMBRE'),
                        }, {
                            name: 'Creditos',
                            displayName: $translate.instant('CREDITOS'),
                            width: 200
                        }, {
                            name: 'Check',
                            displayName: $translate.instant('SELECCIONAR'),
                            width: 200,
                            type: 'boolean',
                            cellTemplate: '<input type="checkbox" ng-click="grid.appScope.d_solicitarAsignaturas.toggle(row.entity, grid.appScope.d_solicitarAsignaturas.selected)">'
                        }];

                        ctrl.gridOptions = {
                            data: ctrl.asignaturas,
                            rowTemplate: '<div ng-style="{}"></div>'
                        };

                        $q.all(promises).then(function(){
                          console.log("asignaturas", ctrl.asignaturas);
                          ctrl.loadingAsignaturas = false;
                        })
                        .catch(function(error){
                          console.log(error);
                          ctrl.errorCargandoAsignaturas = true;
                          ctrl.loadingAsignaturas = false;
                        });
                    })
                    .catch(function(error){
                      console.log(error);
                      ctrl.errorCargandoAsignaturas = true;
                      ctrl.loadingAsignaturas = false;
                    });

                })
                .catch(function(error){
                  console.log(error);
                  ctrl.errorCargandoAsignaturas = true;
                  ctrl.loadingAsignaturas = false;
                });
            };

            ctrl.selected = [];
            ctrl.creditos = 0;

            /**
             * @ngdoc method
             * @name toggle
             * @methodOf poluxClienteApp.directive:solicitarAsignaturas.controller:solicitarAsignaturasCtrl
             * @param {undefined} undefined No recibe parametros
             * @returns {undefined} No retorna ningún valor
             * @description 
             * Agrega y elimina los elementos de la lista de asignaturas elegidas, y suma y resta el valor de los ccreditos.
             */  
            ctrl.toggle = function(item, list) {
                if (ctrl.selected.length == 0) {
                    ctrl.creditos = 0;
                }
                var idx = list.indexOf(item);
                if (idx > -1) {
                    list.splice(idx, 1);
                    var c = parseInt(item.Creditos, 10);
                    ctrl.creditos = ctrl.creditos - c;
                } else {

                    list.push(item);
                    var c = parseInt(item.Creditos, 10);
                    ctrl.creditos = ctrl.creditos + c;
                }

                if (ctrl.creditos >= ctrl.creditosMinimos) {
                    ctrl.minimoCreditos = true;
                } else {
                    ctrl.minimoCreditos = false;
                }
                $scope.estudiante.minimoCreditos = ctrl.minimoCreditos;
                console.log(JSON.stringify($scope.estudiante.asignaturas_elegidas))

            }; ///////////fin add()///////////////////

        },
        controllerAs: 'd_solicitarAsignaturas'
    };
});
