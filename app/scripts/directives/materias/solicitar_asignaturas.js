'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:materias/solicitarAsignaturas
 * @description
 * # materias/solicitarAsignaturas
 */
angular.module('poluxClienteApp')
  .directive('solicitarAsignaturas', function(poluxRequest, academicaRequest, $route) {
    return {
      restrict: 'E',
      scope: {
        estudiante: '=',
        modalidad: '=',
        l: '=?'
      },

      templateUrl: 'views/directives/materias/solicitar_asignaturas.html',
      controller: function($scope, $route, $translate) {
        console.log("carreras ya elegidas",$scope.l);
        var ctrl = this;
        ctrl.maxCreditos = 0;
        ctrl.carreras = [];
        ctrl.gridOptions = {};
        ctrl.estudiante = $scope.estudiante;
        ctrl.tipo = $scope.estudiante.Tipo;
        $scope.sols = [];
        ctrl.listado=$scope.l;

        /*número de créditos mínimos, según la modalidad
          modalidad de espacios académicos de posgrado: 8 créditos,
          modalidad de espacios académicos de profundización: 6 créditos*/
        ctrl.creditosMinimos = 0;
        if ($scope.modalidad == 'MATERIAS POSGRADO') {
          ctrl.creditosMinimos = 8;
        } else {
          ctrl.creditosMinimos = 6;
        }

        academicaRequest.obtenerPeriodo().then(function(response) {
          ctrl.periodo = response[0];


          //buscar las carreras q tengan asignaturas en asignaturas_elegibles para el año y el periodo
          var parametros = $.param({
            query: "Anio:" + ctrl.periodo.APE_ANO + ",Periodo:" + ctrl.periodo.APE_PER,
            fields: "CodigoCarrera,CodigoPensum"
          });
          poluxRequest.get("carrera_elegible", parametros).then(function(response) {
            //carreras
            console.log(response.data);

            if($scope.l){
            angular.forEach(response.data, function(value) {

              //si la carrera no ha sido solicitada
             if($scope.l.indexOf(value.CodigoCarrera)!=0){
               var parametros = {
                'codigo': value.CodigoCarrera,
                'tipo': ctrl.tipo
               };
               academicaRequest.obtenerCarreras(parametros).then(function(response2) {
                if (response2 != null) {
                  var carrera = {
                    "Codigo": value.CodigoCarrera,
                    "Nombre": response2[0].NOMBRE,
                    "Pensum": value.CodigoPensum
                  };
                  ctrl.carreras.push(carrera);
                  console.log(ctrl.carreras);
                }

               });


             }
            });
          }else{
            angular.forEach(response.data, function(value) {

               var parametros = {
                'codigo': value.CodigoCarrera,
                'tipo': ctrl.tipo
               };
               academicaRequest.obtenerCarreras(parametros).then(function(response2) {
                if (response2 != null) {
                  var carrera = {
                    "Codigo": value.CodigoCarrera,
                    "Nombre": response2[0].NOMBRE,
                    "Pensum": value.CodigoPensum
                  };
                  ctrl.carreras.push(carrera);
                  console.log(ctrl.carreras);
                }

               });

            });
          }
          });

        });


        ctrl.myFunc = function(carreraSeleccionada) {
          ctrl.selected = [];
          console.log("carrrera:"+carreraSeleccionada);
          ctrl.asignaturas2 = [];

          ctrl.carrera = carreraSeleccionada;

          //buscar la carrera en: carrera_elegible
          var parametros = $.param({
            query: "Anio:" + ctrl.periodo.APE_ANO + ",Periodo:" + ctrl.periodo.APE_PER +",CodigoCarrera:"+carreraSeleccionada
          });
          poluxRequest.get("carrera_elegible", parametros).then(function(response) {

            //asignaturas elegibles para ser vistas en la modalidad de espacios académicos de posgrado
            var parametros = $.param({
              query: "IdCarreraElegible:" + response.data[0].Id
            });
            poluxRequest.get("asignaturas_elegibles", parametros).then(function(response) {
              //recorrer data y buscar datos de las asignaturas
              angular.forEach(response.data, function(value) {
                //buscar asignaturas
                var parametros = {
                  'codigo': value.CodigoAsignatura
                };
                academicaRequest.buscarAsignaturas(parametros).then(function(response) {

                  var data = {
                    "Id": value.Id,
                    "Anio": value.Anio,
                    "CodigoAsignatura": value.CodigoAsignatura,
                    "CodigoCarrera": value.CodigoCarrera,
                    "CodigoPensum": value.CodigoPensum,
                    "Periodo": value.Periodo,
                    "Nombre": response[0].ASI_NOMBRE,
                    "Creditos": response[0].PEN_CRE
                  };

                  ctrl.asignaturas2.push(data);

                });
              });
            });

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
            data: ctrl.asignaturas2,
            rowTemplate: '<div ng-style="{}"></div>'
          };
        };

        ctrl.selected = [];
        ctrl.creditos = 0;

        ctrl.toggle = function(item, list) {
          if(ctrl.selected.length==0){
            ctrl.creditos=0;
          }
          var idx = list.indexOf(item);
          if (idx > -1) {
            list.splice(idx, 1);
            var c = parseInt(item.Creditos, 10);
            ctrl.creditos = ctrl.creditos - c;
            console.log(ctrl.creditos);
          } else {
            list.push(item);
            var c = parseInt(item.Creditos, 10);
            ctrl.creditos = ctrl.creditos + c;
            console.log(ctrl.creditos);
          }
          console.log(ctrl.selected);

        };

        ctrl.add = function() {

          ctrl.esta=-1;
          if($scope.l!=null){
            ctrl.esta=$scope.l.indexOf(ctrl.carrera);
          }

          if( ctrl.esta==-1 ){
            //buscar si el estudiante tiene un TG en la modalidad de materias de posgrado: #3
            var parametros=$.param({
              query:"CodigoEstudiante:"+ctrl.estudiante.Codigo+","+ "IdTrabajoGrado.IdModalidad.Id:3"
            });
            poluxRequest.get("estudiante_tg", parametros).then(function(response) {
              //console.log(response.data[0].Id);

///##########################################################################
               if (ctrl.creditos >= ctrl.creditosMinimos) {
                //Modalidad 3: Espacios académicos de posgrado
                var cod = parseInt(ctrl.estudiante.Codigo, 10);


                //si no hay registrados TG en modalidad #3

                if(!response.data){
                  console.log("NOOO Hay TG en la modalidad #3");
                  ctrl.datos = {
                    "TrabajoGrado": {

                      "Distincion": "",
                      "Etapa": "propuesta",
                      "IdModalidad": {
                        "Id": 3
                      },
                      "Titulo": "Trabajo de Grado"
                    },

                    "EstudianteTg": {
                      "CodigoEstudiante": cod,
                      "Estado": "activo",
                      "IdTrabajoGrado": {
                        "Id": 0
                      }
                    },
                  }

                    //registrar TG
                    poluxRequest.post("tr_trabajo_grado", ctrl.datos).then(function(response) {
                      console.log(response.data);
                      var fecha = new Date();
                      var car = parseInt(ctrl.carrera, 10);
                      var a = parseInt(ctrl.periodo.APE_ANO, 10);
                      var p = ctrl.periodo.APE_PER.toString();

                      angular.forEach(ctrl.selected, function(value) {
                        var data3 = {
                          "IdAsignaturasElegibles": {
                            "Id": value.Id
                          },
                          "IdSolicitudMaterias": {
                            "Id": 0
                          },
                          "Estado": "solicitada"
                        };
                        $scope.sols.push(data3);

                      });

                      ctrl.datosSolicitud = {
                        "Solicitud": {
                          "CodigoCarrera": car,
                          "Estado": "opcionado",
                          "Formalizacion": "pendiente",
                          "Periodo": p,
                          "IdTrabajoGrado": response.data.TrabajoGrado,
                          "Fecha": fecha,
                          "Anio": a
                        },

                        "MateriasSolicitadas": $scope.sols
                      };

                      /////registrar solicitud
                      poluxRequest.post("tr_solicitud", ctrl.datosSolicitud).then(function(response) {
                        console.log(response);
                      });


                    });

                }

                //si existen TG en la modalida #3
                else{
                      console.log("Hay TG en la modalidad #3");

                      var fecha = new Date();
                      var car = parseInt(ctrl.carrera, 10);
                      var a = parseInt(ctrl.periodo.APE_ANO, 10);
                      var p = ctrl.periodo.APE_PER.toString();

                      angular.forEach(ctrl.selected, function(value) {
                        var data3 = {
                          "IdAsignaturasElegibles": {
                            "Id": value.Id
                          },
                          "IdSolicitudMaterias": {
                            "Id": 0
                          },
                          "Estado": "solicitada"
                        };
                        $scope.sols.push(data3);

                      });

                      ctrl.datosSolicitud = {
                        "Solicitud": {
                          "CodigoCarrera": car,
                          "Estado": "opcionado",
                          "Formalizacion": "pendiente",
                          "Periodo": p,
                          "IdTrabajoGrado": response.data[0].IdTrabajoGrado,
                          "Fecha": fecha,
                          "Anio": a
                        },

                        "MateriasSolicitadas": $scope.sols
                      };

                      /////registrar solicitud
                      poluxRequest.post("tr_solicitud", ctrl.datosSolicitud).then(function(response) {
                        console.log(response);
                      });


                }

                alert("Solicitud realizada");
                $route.reload();
              } else {
                alert("Seleccione más de " + ctrl.creditosMinimos + " créditos");
              }

              ///##########################################################################

            });


          }else {
            alert("Ya tiene 1 solicitud en esa carrera");
            ctrl.selected = [];
            $route.reload();
          }

        };
        ///////////fin add()///////////////////

      },
      controllerAs: 'd_solicitarAsignaturas'
    };
  });
