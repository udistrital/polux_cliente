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
        l: '=?',
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
        if ($scope.modalidad == 2) {
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
                }

               });

            });

          });

        });


        ctrl.cargarMaterias = function(carreraSeleccionada) {
          ctrl.selected = [];
          ctrl.selected.push(carreraSeleccionada);
          $scope.estudiante.asignaturas_elegidas= ctrl.selected;
          ctrl.asignaturas = [];

          ctrl.carrera = carreraSeleccionada.Codigo;

          //buscar la carrera en: carrera_elegible
          var parametros = $.param({
            query: "Anio:" + ctrl.periodo.APE_ANO + ",Periodo:" + ctrl.periodo.APE_PER +",CodigoCarrera:"+carreraSeleccionada.Codigo
          });

          poluxRequest.get("carrera_elegible", parametros).then(function(response) {

            //asignaturas elegibles para ser vistas en la modalidad de espacios académicos de posgrado
            var parametros = $.param({
              query: "CarreraElegible:" + response.data[0].Id
            });

            poluxRequest.get("espacios_academicos_elegibles", parametros).then(function(response) {
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

                  ctrl.asignaturas.push(data);

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
            data: ctrl.asignaturas,
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
          } else {

            list.push(item);
            var c = parseInt(item.Creditos, 10);
            ctrl.creditos = ctrl.creditos + c;
          }

          if(ctrl.creditos >= ctrl.creditosMinimos){
                ctrl.minimoCreditos = true;
          }else{
                ctrl.minimoCreditos = false;
          }
          $scope.estudiante.minimoCreditos = ctrl.minimoCreditos;
          console.log(JSON.stringify($scope.estudiante.asignaturas_elegidas))

        };        ///////////fin add()///////////////////

      },
      controllerAs: 'd_solicitarAsignaturas'
    };
  });
