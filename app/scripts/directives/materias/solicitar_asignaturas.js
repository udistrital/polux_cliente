'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:materias/solicitarAsignaturas
 * @description
 * # materias/solicitarAsignaturas
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
                              var resultado = response2.data.carrerasCollection.carrera[0];
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
                        query: "CarreraElegible:" + response.data[0].Id
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
                    });;

                })
                .catch(function(error){
                  console.log(error);
                  ctrl.errorCargandoAsignaturas = true;
                  ctrl.loadingAsignaturas = false;
                });;
            };

            ctrl.selected = [];
            ctrl.creditos = 0;

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
