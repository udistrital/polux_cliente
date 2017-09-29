'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:materias/publicarAsignaturas
 * @description
 * # materias/publicarAsignaturas
 */
angular.module('poluxClienteApp')
  .directive('publicarAsignaturas', function (poluxMidRequest, poluxRequest, academicaRequest) {
    return {
      restrict: 'E',
      scope: {
        anio: '=',
        periodo: '=',
        carrera: '=',
        pensum: '=',
        modalidad: '='
      },

      templateUrl: 'views/directives/materias/publicar_asignaturas.html',
      controller: function ($scope, $route, $translate) {
        var ctrl = this;
        ctrl.creditosMinimos = 0;
        ctrl.selected = [];
        ctrl.creditos = 0;
        ctrl.totalCreditos = 0;
        ctrl.pensum = 0;
        ctrl.habilitar = true;
        ctrl.habilitar2 = true;

        //uigrid
        ctrl.gridOptions = {
          //showGridFooter: true
        };

        ctrl.gridOptions.columnDefs = [
          { name: 'asignatura', displayName: $translate.instant('CODIGO'), width: "15%" },
          { name: 'nombre', displayName: $translate.instant('NOMBRE'), width: "55%" },
          { name: 'creditos', displayName: $translate.instant('CREDITOS'), width: "15%" },
          {
            name: 'check',
            displayName: $translate.instant('SELECCIONAR'),
            type: 'boolean',
            width: "15%",
            //cellTemplate: '<center><input type="checkbox" ng-model="row.entity.check" ng-click="grid.appScope.d_publicarAsignaturas.toggle(row.entity, grid.appScope.d_publicarAsignaturas.selected)" ng-disabled="grid.appScope.d_publicarAsignaturas.habilitar" ></center>'
            cellTemplate: '<center><md-checkbox ng-model="row.entity.check" aria-label="checkbox" ng-click="grid.appScope.d_publicarAsignaturas.toggle(row.entity, grid.appScope.d_publicarAsignaturas.selected)" ng-disabled="grid.appScope.d_publicarAsignaturas.habilitar" ></md-checkbox><center>'
          }
        ];

        $scope.$watch("pensum", function () {
          ctrl.pensum = $scope.pensum;
          ctrl.asignaturas = [];
          ctrl.mostrar = [];
          ctrl.gridOptions.data = [];

          if ($scope.carrera && $scope.pensum) {
            academicaRequest.buscarAsignaturas({
              'carrera': $scope.carrera,
              'pensum': $scope.pensum,
              'semestre': 1
            }).then(function (response) {
              ctrl.asignaturas = response;
              ctrl.habilitar = false;
              ctrl.habilitar2 = true;

              angular.forEach(ctrl.asignaturas, function (value) {
                ctrl.totalCreditos = 0;

                academicaRequest.buscarAsignaturas({
                  'codigo': value.ASI_COD
                }).then(function (response) {
                  ctrl.asignatura = response;
                  ctrl.buscarAsignaturasElegibles($scope.anio, $scope.periodo, $scope.carrera, $scope.pensum, ctrl.asignatura);
                });

              });
              ctrl.gridOptions = {
                data: ctrl.mostrar,
                minRowsToShow: ctrl.gridOptions.data.length,

              };
            });
          }

        });

        ctrl.cambiar = function () {
          if (ctrl.habilitar == true) {
            ctrl.habilitar = false;
            ctrl.habilitar2 = true;
          } else {
            ctrl.habilitar = true;
            ctrl.habilitar2 = false;
          }
        };

        //buscar si hay registros en asignaturas_elegibles
        ctrl.buscarAsignaturasElegibles = function (anio, periodo, carrera, pensum, asignatura) {

          ctrl.anio = anio;
          ctrl.periodo = periodo;
          ctrl.carrera = carrera;
          ctrl.pensum = pensum;

          /*Buscar carreras en carrera_elegible*/
          var parametros = $.param({
            query: "CodigoCarrera:" + carrera + ",Anio:" + anio + ",Periodo:" + periodo + ",CodigoPensum:" + pensum
          });
          poluxRequest.get("carrera_elegible", parametros).then(function (response) {
            console.log(response);
            if (response.data != null) {
              ctrl.id = response.data[0].Id

              var parametros = $.param({
                query: "CarreraElegible:" + ctrl.id + ",CodigoAsignatura:" + asignatura[0].ASI_COD
              });

              poluxRequest.get("espacios_academicos_elegibles", parametros).then(function (response) {
                console.log(response.data);

                if (response.data != null) {
                  ctrl.habilitar = true;
                  ctrl.habilitar2 = false;

                  var nuevo = {
                    carrera: carrera,
                    año: anio,
                    periodo: periodo,
                    pensum: pensum,
                    asignatura: asignatura[0].ASI_COD,
                    nombre: asignatura[0].ASI_NOMBRE,
                    creditos: asignatura[0].PEN_CRE,
                    check: response.data[0].Activo
                  };

                  var c = parseInt(asignatura[0].PEN_CRE, 10);
                  ctrl.totalCreditos = ctrl.totalCreditos + c;
                  ctrl.mostrar.push(nuevo);

                } else {
                  var nuevo = {
                    carrera: carrera,
                    año: anio,
                    periodo: periodo,
                    pensum: pensum,
                    asignatura: asignatura[0].ASI_COD,
                    nombre: asignatura[0].ASI_NOMBRE,
                    creditos: asignatura[0].PEN_CRE,
                    check: false
                  };
                  ctrl.mostrar.push(nuevo);
                }
              });
            }
            //si la carrera no está en la tabla: carrera_elegible
            else {

              var nuevo = {
                carrera: carrera,
                año: anio,
                periodo: periodo,
                pensum: pensum,
                asignatura: asignatura[0].ASI_COD,
                nombre: asignatura[0].ASI_NOMBRE,
                creditos: asignatura[0].PEN_CRE,
                check: false
              };
              ctrl.mostrar.push(nuevo);

            }
          });

        };

        ctrl.toggle = function (item, list) {
          var idx = list.indexOf(item);
          if (idx > -1) {
            list.splice(idx, 1);
            if(item.creditos){
              var c = parseInt(item.creditos, 10);
            }else{
              var c = 0;
            }
          }
          else {
            list.push(item);
            if(item.creditos){
              var c = parseInt(item.creditos, 10);
            }else{
              var c = 0;
            }
          }
          if (item.check === false) {
            ctrl.totalCreditos = ctrl.totalCreditos + c;
            console.log(ctrl.totalCreditos);
          } else {
            ctrl.totalCreditos = ctrl.totalCreditos - c;
            console.log(ctrl.totalCreditos);
          }
        };

        ctrl.add = function () {
          poluxMidRequest.get('creditos/ObtenerMinimo').then(function (response) {
            console.log(response.data);
            $scope.creditosMinimosPosgrado = response.data['minimo_creditos_posgrado'];
            $scope.creditosMinimosProfundizacion = response.data['minimo_creditos_profundizacion'];
            if ($scope.modalidad == 'POSGRADO') {
 /*     ctrl.creditosMinimos=8;
 */           ctrl.creditosMinimos = parseInt($scope.creditosMinimosPosgrado);
              console.log("Creditos minimos posgrado: " + ctrl.creditosMinimos);
            } else {
              /*ctrl.creditosMinimos=6;*/
              ctrl.creditosMinimos = parseInt($scope.creditosMinimosProfundizacion);
              console.log("Creditos minimos profundizacion" + ctrl.creditosMinimos);
            }
          console.log("Creditos minimos obtenidos de la vista "+ $scope.modalidad + " : "+ ctrl.creditosMinimos);

          console.log(ctrl.totalCreditos);

          if (ctrl.totalCreditos >= ctrl.creditosMinimos) {
            ctrl.cambiar();

            //verificar que la carrera esté en la tabla: carrera_elegible
            var parametros = $.param({
              query: "CodigoCarrera:" + ctrl.carrera + ",Anio:" + ctrl.anio + ",Periodo:" + ctrl.periodo + ",CodigoPensum:" + ctrl.pensum
            });
            poluxRequest.get("carrera_elegible", parametros).then(function (response) {
              console.log(response.data);

              if (response.data == null) {
                var carrera = parseInt(ctrl.carrera, 10);
                var pensum = parseInt(ctrl.pensum, 10);
                var periodo = parseInt(ctrl.periodo, 10);
                var anio = parseInt(ctrl.anio, 10);

                var data = {
                  "CodigoCarrera": carrera,
                  "Periodo": periodo,
                  "Anio": anio,
                  "CodigoPensum": pensum,
                };
                poluxRequest.post("carrera_elegible", data).then(function (response22) {
                  console.log(response22);

                  //guardar las asignaturas seleccionadas
                  angular.forEach(ctrl.selected, function (value) {
                    var asignatura = parseInt(value.asignatura, 10);

                    var data = {
                      "CodigoAsignatura": asignatura,
                      "Activo": true,
                      "CarreraElegible": response22.data
                    };

                    /*antes de guardar la asignatura, se debe verificar que no esté registrada
                    si no está registrada, guardarla
                    si está registrada, actualizar el estado*/
                    var parametros = $.param({
                      query: "CodigoAsignatura:" + asignatura + " ,CarreraElegible:" + response22.data.Id
                    });

                    poluxRequest.get("espacios_academicos_elegibles", parametros).then(function (response) {
                      console.log("rta:" + response.data);

                      if (response.data == null) {
                        console.log(data);
                        poluxRequest.post("espacios_academicos_elegibles", data).then(function (response) {
                          ctrl.habilitar = true;
                          ctrl.habilitar2 = false;
                          console.log("Status respuesta ", response.data);
                        });


                      } else {
                        //si está registrada, actualizar el estado
                        var id = response.data[0].Id;
                        var estado = response.data[0].Activo;
                        if (estado === false) {
                          estado = true;
                        } else {
                          estado = false;
                        }

                        var dataModificado = {
                          "CodigoAsignatura": asignatura,
                          "Activo": estado,
                          "CarreraElegible": response22.data
                        };

                        poluxRequest.put("espacios_academicos_elegibles", id, dataModificado).then(function (response) {
                          console.log("Status respuesta ", response.data);
                        });

                      }

                    });

                  });


                });

              }
              //si está en la tabla: carrera_elegible
              else {
                console.log(response.data[0]);

                //guardar las asignaturas seleccionadas
                angular.forEach(ctrl.selected, function (value) {
                  var asignatura = parseInt(value.asignatura, 10);

                  var data = {
                    "CodigoAsignatura": asignatura,
                    "Activo": true,
                    "CarreraElegible": response.data[0]
                  };

                  /*antes de guardar la asignatura, se debe verificar que no esté registrada
                  si no está registrada, guardarla
                  si está registrada, actualizar el estado*/

                  var parametros = $.param({
                    query: "CodigoAsignatura:" + asignatura + " ,CarreraElegible:" + response.data[0].Id
                  });

                  poluxRequest.get("espacios_academicos_elegibles", parametros).then(function (response) {
                    console.log("rta:" + response.data);

                    if (response.data == null) {
                      console.log(data);
                      poluxRequest.post("espacios_academicos_elegibles", data).then(function (response) {
                        ctrl.habilitar = true;
                        ctrl.habilitar2 = false;
                        console.log("Status respuesta ", response.data);
                      });


                    } else {
                      //si está registrada, actualizar el estado
                      var id = response.data[0].Id;
                      var estado = response.data[0].Activo;
                      if (estado === false) {
                        estado = true;
                      } else {
                        estado = false;
                      }

                      var dataModificado = {
                        "CodigoAsignatura": asignatura,
                        "Activo": estado,
                        "CarreraElegible": response.data[0]
                      };

                      poluxRequest.put("asignaturas_elegibles", id, dataModificado).then(function (response) {
                        console.log("Status respuesta ", response.data);
                      });

                    }

                  });

                });

              }
            });

            swal(
              'Espacios Académicos Guardados',
              'Los espacios académicos seleccionados podrán ser elegidos por los estudiantes para optar por la modalidad de trabajo de grado',
              'success'
            );
            $route.reload();
          }

          else {
            swal(
              'Seleccione más espacios académicos',
              "La cantidad de créditos de los espacios académicos seleccionados debe ser igual o superior a " + ctrl.creditosMinimos + " créditos",
              'warning'
            );
            ctrl.habilitar = false;
            ctrl.habilitar2 = true;
          }

          }
          ).catch(function (rta) {
            console.log(rta);
          });


        };

      },
      controllerAs: 'd_publicarAsignaturas'
    };
  });
