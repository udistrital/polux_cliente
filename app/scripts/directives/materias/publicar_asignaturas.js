'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:publicarAsignaturas
 * @description
 * # materias/publicarAsignaturas
 * Directiva que permite a un coordinador de posgrado publicar las asignaturas que se ofertaran en el periodo en la modalidad de espacios academicos de posgrado
 * Controlador: {@link poluxClienteApp.directive:publicarAsignaturas.controller:publicarAsignaturasCtrl publicarAsignaturasCtrl}
 * @param {number} anio Año del periodo siguiente
 * @param {number} periodo Perioodo siguiente
 * @param {number} carrera Codigo de la carrera escogida por el coordinador de posgrado
 * @param {number} pensum Número del pensum de la carrera escogido
 * @param {number} modalidad Identificador de la modalidad
 */
angular.module('poluxClienteApp')
  .directive('publicarAsignaturas', function(poluxMidRequest, poluxRequest, academicaRequest, $q, sesionesRequest) {
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
      /**
       * @ngdoc controller
       * @name poluxClienteApp.directive:publicarAsignaturas.controller:publicarAsignaturasCtrl
       * @description
       * # PublicarAsignatirasCtrl
       * Controller of the poluxClienteApp.directive:publicarAsignaturas
       * Controlador de la directiva {@link poluxClienteApp.directive:publicarAsignaturas publicarAsignaturas}
       * @requires $route
       * @requires decorators/poluxClienteApp.decorator:TextTranslate
       * @requires $scope
       * @requires services/poluxMidService.service:poluxMidRequest
       * @requires services/poluxService.service:poluxRequest
       * @requires services/academicaService.service:academicaRequest
       * @requires $q
       * @requires services/poluxClienteApp.service:sesionesService
       * @property {number} creditosMinimos Minimo de creditos que pueden ofertarse
       * @property {object} selected Lista de las materias elegidas por el coordinador
       * @property {number} totalCreditos Total de creditos publicados
       * @property {boolean} habilitar Flag para habilitar el botón de modificar publicación-
       * @property {boolean} habilitar2 Flag para habilitar el botón de guardar cambios
       * @property {object} gridOptions Opciones del ui-grid donde se listan las asignaturas , los creditos y se da la opción de elegir
       * @property {object} fechaInicio Fecha de fin del proceso se publicación de asignaturas de la modalidad de materias de posgrado
       * @property {object} fechaFin Fecha de inicio del proceso se publicación de asignaturas de la modalidad de materias de posgrado
       */
      controller: function($scope, $route, $translate) {
        $scope.msgCargandoSolicitudes = $translate.instant('LOADING.CARGANDO_ASIGNATURAS');
        $scope.load = true;
        var ctrl = this;
        ctrl.creditosMinimos = 0;
        ctrl.selected = [];
        ctrl.creditos = 0;
        ctrl.totalCreditos = 0;
        ctrl.habilitar = true;
        ctrl.habilitar2 = true;

        ctrl.gridOptions = {
          paginationPageSizes: [5, 10, 15, 20, 25],
          paginationPageSize: 10,
          enableFiltering: true,
          enableSorting: true,
          enableSelectAll: false,
          useExternalPagination: false,
        };

        /**
         * @ngdoc method
         * @name watchPensum
         * @methodOf poluxClienteApp.directive:publicarAsignaturas.controller:publicarAsignaturasCtrl
         * @param {undefined} undefined No recibe parametros
         * @returns {undefined} No retorna ningún valor
         * @description 
         * Cada vez que el valor de pensum cambia se consultan las asignaturas elegibles
         * llamando la función buscarAsignaturasElegibles, los nombres de las materias se consultan de {@link services/academicaService.service:academicaRequest academicaRequest}.
         */
        $scope.$watch("pensum", function() {
          $scope.load = true;
          var promiseArr = [];
          ctrl.pensum = $scope.pensum;
          ctrl.asignaturas = [];
          ctrl.mostrar = [];
          ctrl.gridOptions.data = [];

          if ($scope.carrera && $scope.pensum) {

            academicaRequest.get("asignaturas_carrera_pensum", [$scope.carrera, $scope.pensum]).then(function(response) {
                if (!angular.isUndefined(response.data.asignaturaCollection.asignatura)) {
                  ctrl.asignaturas = response.data.asignaturaCollection.asignatura;
                }
                ctrl.habilitar = false;
                ctrl.habilitar2 = true;
                ctrl.totalCreditos = 0;
                angular.forEach(ctrl.asignaturas, function(value) {
                  promiseArr.push(ctrl.buscarAsignaturasElegibles($scope.anio, $scope.periodo, $scope.carrera, $scope.pensum, value));
                });

                //traer fechas para habilitar botones
                promiseArr.push(ctrl.verificarFechas($scope.periodo, $scope.anio));

                $q.all(promiseArr).then(function() {
                  ctrl.gridOptions.data = ctrl.mostrar;
                  $scope.load = false;
                  ctrl.gridOptions.columnDefs = [{
                    name: 'asignatura',
                    displayName: $translate.instant('CODIGO'),
                    width: "10%"
                  }, {
                    name: 'nombre',
                    displayName: $translate.instant('NOMBRE'),
                    width: "55%"
                  }, {
                    name: 'creditos',
                    displayName: $translate.instant('CREDITOS'),
                    width: "10%"
                  }, {
                    name: 'semestre',
                    displayName: $translate.instant('SEMESTRE'),
                    width: "10%"
                  }, {
                    name: 'check',
                    displayName: $translate.instant('SELECCIONAR'),
                    type: 'boolean',
                    width: "15%",
                    //cellTemplate: '<center><input type="checkbox" ng-model="row.entity.check" ng-click="grid.appScope.d_publicarAsignaturas.toggle(row.entity, grid.appScope.d_publicarAsignaturas.selected)" ng-disabled="grid.appScope.d_publicarAsignaturas.habilitar" ></center>'
                    cellTemplate: '<center><md-checkbox ng-model="row.entity.check" aria-label="checkbox" ng-click="grid.appScope.d_publicarAsignaturas.toggle(row.entity, grid.appScope.d_publicarAsignaturas.selected)" ng-disabled="grid.appScope.d_publicarAsignaturas.habilitar" ></md-checkbox><center>'
                  }];
                }).catch(function(error) {
                  
                  ctrl.errorCargar = true;
                  $scope.load = false;
                });
              })
              .catch(function(error) {
                
                ctrl.mensajeError = $translate.instant('ERROR.CARGAR_ASIGNATURAS_SOLICITUD');
                ctrl.errorCargar = true;
                $scope.load = false;
              });
          }
        });

        /**
         * @ngdoc method
         * @name cambiar
         * @methodOf poluxClienteApp.directive:publicarAsignaturas.controller:publicarAsignaturasCtrl
         * @param {undefined} undefined No recibe parametros
         * @returns {undefined} No retorna ningún valor
         * @description 
         * Permite habilitar los botones de configuracion y guardar configuración.
         */
        ctrl.cambiar = function() {
          if (ctrl.habilitar == true) {
            ctrl.habilitar = false;
            ctrl.habilitar2 = true;
          } else {
            ctrl.habilitar = true;
            ctrl.habilitar2 = false;
          }
        };

        /**
         * @ngdoc method
         * @name verificarFechas
         * @methodOf poluxClienteApp.directive:publicarAsignaturas.controller:publicarAsignaturasCtrl
         * @param {number} anio Año siguiente
         * @param {number} periodo Periodo siguiente
         * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplio la petición y se resuleve con el objeto
         * @description 
         * Permite consultar las fechas del proceso de publicación de asignaturas y validar si las fechas estan dentro del rango permitido
         * se consultan las fechas del servicio {@link @requires services/poluxClienteApp.service:sesionesService sesionesService}.
         */
        ctrl.verificarFechas = function(periodo, anio) {
          var deferFechas = $q.defer();
          ctrl.fechaActual = moment(new Date()).format("YYYY-MM-DD HH:mm");
          var tipoSesionPadre = 0;
          if ($scope.modalidad === 'POSGRADO') {
            tipoSesionPadre = 1;
          } else {
            //$scope.modalidad === 'PREGRADO'
            tipoSesionPadre = 9;
          }
          var parametrosSesiones = $.param({
            query: "SesionPadre.TipoSesion.Id:"+tipoSesionPadre+",SesionHijo.TipoSesion.Id:2,SesionPadre.periodo:" + 2020 + 1,
            limit: 1
          });
          //traer fechas
          sesionesRequest.get("relacion_sesiones", parametrosSesiones)
         
            .then(function(responseFechas) {
              if (Object.keys(responseFechas.data[0]).length > 0) {
                
                var sesion = responseFechas.data[0];
                var fechaHijoInicio = new Date(sesion.SesionHijo.FechaInicio);
                fechaHijoInicio.setTime(fechaHijoInicio.getTime() + fechaHijoInicio.getTimezoneOffset() * 60 * 1000);
                ctrl.fechaInicio = moment(fechaHijoInicio).format("YYYY-MM-DD HH:mm");
                var fechaHijoFin = new Date(sesion.SesionHijo.FechaFin);
                fechaHijoFin.setTime(fechaHijoFin.getTime() + fechaHijoFin.getTimezoneOffset() * 60 * 1000);
                ctrl.fechaInicio = moment(fechaHijoInicio).format("YYYY-MM-DD HH:mm");
                ctrl.fechaFin = moment(fechaHijoFin).format("YYYY-MM-DD HH:mm");
                
                //
                //
                if (ctrl.fechaInicio <= ctrl.fechaActual && ctrl.fechaActual <= ctrl.fechaFin) {
                  ctrl.mostrarBotones = false;
                  deferFechas.resolve();
                } else {
                  ctrl.mostrarBotones = true;
                  deferFechas.resolve();
                }
              } else {
                ctrl.mensajeError = $translate.instant('ERROR.SIN_FECHAS_MODALIDAD');
                deferFechas.reject(false);
              }
            })
            .catch(function(error) {
              ctrl.mensajeError = $translate.instant("ERROR.CARGAR_FECHAS_MODALIDAD");
              deferFechas.reject(error);
            });
          return deferFechas.promise;
        }

        /**
         * @ngdoc method
         * @name buscarAsignaturasElegibles
         * @methodOf poluxClienteApp.directive:publicarAsignaturas.controller:publicarAsignaturasCtrl
         * @param {number} anio Año siguiente
         * @param {number} periodo Periodo siguiente
         * @param {number} carrera Carrera seleccionada por el coordinador
         * @param {number} pensum Pensum elegio or el coordinador, correponde a la lista de pensums elegibles
         * @param {number} asignatura Codigo de la asignatura elegible.
         * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplio la petición y se resuleve con el objeto
         * @description 
         * Consulta al servicio {@link services/poluxService.service:poluxRequest poluxRequest} para consultar si ya se seleccionaron alguans asignaturas como elegibles y mostrarlas para permitir hacer cambios.
         */
        ctrl.buscarAsignaturasElegibles = function(anio, periodo, carrera, pensum, asignatura) {
          var defer = $q.defer();
          ctrl.anio = anio;
          ctrl.periodo = periodo;
          ctrl.carrera = carrera;
          ctrl.pensum = pensum;

          /*Buscar carreras en carrera_elegible*/
          var parametros = $.param({
            query: "CodigoCarrera:" + carrera + ",Anio:" + anio + ",Periodo:" + periodo + ",CodigoPensum:" + pensum
          });
          poluxRequest.get("carrera_elegible", parametros).then(function(response) {
              if (Object.keys(response.data.Data[0]).length > 0) {
                ctrl.id = response.data.Data[0].Id
                parametros = $.param({
                  query: "CarreraElegible:" + ctrl.id + ",CodigoAsignatura:" + asignatura.codigo
                });
                var asignaturaActiva = false;
                poluxRequest.get("espacios_academicos_elegibles", parametros)
                  .then(function(responseEspacios) {
                    if (Object.keys(responseEspacios.data.Data[0]).length > 0) {
                      ctrl.habilitar = true;
                      ctrl.habilitar2 = false;
                      asignaturaActiva = responseEspacios.data.Data[0].Activo
                      //si la materia esta activa se suman los creditos
                      if (responseEspacios.data.Data[0].Activo) {
                        var c = parseInt(asignatura.creditos, 10);
                        ctrl.totalCreditos = ctrl.totalCreditos + c;
                      }
                    }
                    nuevo = {
                      carrera: carrera,
                      año: anio,
                      periodo: periodo,
                      pensum: pensum,
                      asignatura: asignatura.codigo,
                      nombre: asignatura.nombre,
                      creditos: asignatura.creditos,
                      semestre: asignatura.semestre,
                      check: asignaturaActiva
                    };
                    ctrl.mostrar.push(nuevo);
                    defer.resolve();
                  })
                  .catch(function(error) {
                    ctrl.mensajeError = $translate.instant('ERROR.CARGAR_ASIGNATURAS_SOLICITUD');
                    defer.reject(error);
                  });
              }
              //si la carrera no está en la tabla: carrera_elegible
              else {

                var nuevo = {
                  carrera: carrera,
                  año: anio,
                  periodo: periodo,
                  pensum: pensum,
                  asignatura: asignatura.codigo,
                  nombre: asignatura.nombre,
                  creditos: asignatura.creditos,
                  semestre: asignatura.semestre,
                  check: false
                };
                ctrl.mostrar.push(nuevo);
                defer.resolve();
              }
            })
            .catch(function(error) {
              ctrl.mensajeError = $translate.instant('ERROR.CARGAR_ASIGNATURAS_SOLICITUD');
              defer.reject(error);
            });
          return defer.promise;
        };

        /**
         * @ngdoc method
         * @name toggle
         * @methodOf poluxClienteApp.directive:publicarAsignaturas.controller:publicarAsignaturasCtrl
         * @param {object} item Asignatura que se agregará a la lista
         * @param {object} list Lista de asignaturas
         * @returns {undefined} No retorna ningún valor.
         * @description 
         * Agrega y elimina de la lista las materias seleccionadas por el cooridnador, también se encarga de controlar el número de creditos
         * seleccionados.
         */
        ctrl.toggle = function(item, list) {
          var idx = list.indexOf(item);
          var c;
          if (idx > -1) {
            list.splice(idx, 1);
            if (item.creditos) {
              c = parseInt(item.creditos, 10);
            } else {
              c = 0;
            }
          } else {
            list.push(item);
            if (item.creditos) {
              c = parseInt(item.creditos, 10);
            } else {
              c = 0;
            }
          }
          if (item.check === false) {
            ctrl.totalCreditos = ctrl.totalCreditos + c;
            
          } else {
            ctrl.totalCreditos = ctrl.totalCreditos - c;
            
          }
        };

        /**
         * @ngdoc method
         * @name add
         * @methodOf poluxClienteApp.directive:publicarAsignaturas.controller:publicarAsignaturasCtrl
         * @param {undefined} undefined No requiere parametros
         * @returns {undefined} No retorna ningún valor.
         * @description 
         * Esta función consulta el número minimo de creditos a {@link ervices/poluxMidService.service:poluxMidRequest poluxMidRequest}
         * y valida que el número de creditos elegidos no sea menor, si estos e cumple
         * se crea la data para enviar y registrar las aginaturas elegibles en {@link services/poluxService.service:poluxRequest poluxRequest}.
         */
        ctrl.add = function() {
          poluxMidRequest.get('creditos/ObtenerMinimo').then(function(response) {
              
              $scope.creditosMinimosPosgrado = response.data.Data['minimo_creditos_posgrado'];
              $scope.creditosMinimosProfundizacion = response.data.Data['minimo_creditos_profundizacion'];
              if ($scope.modalidad == 'POSGRADO') {
                /*     ctrl.creditosMinimos=8;
                 */
                ctrl.creditosMinimos = parseInt($scope.creditosMinimosPosgrado);
                
              } else {
                /*ctrl.creditosMinimos=6;*/
                ctrl.creditosMinimos = parseInt($scope.creditosMinimosProfundizacion);
                
              }
              

              

              if (ctrl.totalCreditos >= ctrl.creditosMinimos) {
                ctrl.cambiar();

                //Crear data para la transacción
                var dataCarreraElegible = {
                  "CodigoCarrera": parseInt(ctrl.carrera, 10),
                  "Periodo": parseInt(ctrl.periodo, 10),
                  "Anio": parseInt(ctrl.anio, 10),
                  "CodigoPensum": parseInt(ctrl.pensum, 10),
                  "Nivel":$scope.modalidad,
                };
                var dataEspacios = [];
                angular.forEach(ctrl.selected, function(espacio) {
                  dataEspacios.push({
                    "CodigoAsignatura": parseInt(espacio.asignatura, 10),
                    "Activo": true,
                    "CarreraElegible": dataCarreraElegible,
                  });
                });
                var dataPublicarAsignaturas = {
                  "CarreraElegible": dataCarreraElegible,
                  "EspaciosAcademicosElegibles": dataEspacios,
                }
                poluxRequest.post("tr_publicar_asignaturas", dataPublicarAsignaturas)
                  .then(function() {
                    swal(
                      $translate.instant('ESPACIOS_ACADEMICOS_GUARDADOS'),
                      $translate.instant('MENSAJE_ESPACIOS_ACADEMICOS_GUARDADOS'),
                      'success'
                    );
                    $route.reload();
                  })
                  .catch(function(error) {
                    
                    swal(
                      $translate.instant('ERROR'),
                      $translate.instant('ERROR.GUARDANDO_ESPACIOS_ACADEMICOS_ELEGIBLES'),
                      'warning'
                    );
                  });
              } else {
                swal(
                  $translate.instant('MAS_ESPACIOS_ACADEMICOS'),
                  $translate.instant('CREDITOS_ESPACIOS_ACADEMICOS_INSUFICIENTES', {
                    creditos: ctrl.creditosMinimos
                  }),
                  'warning'
                );
                ctrl.habilitar = false;
                ctrl.habilitar2 = true;
              }

            })
            .catch(function(error) {
              
              swal(
                $translate.instant('ERROR'),
                $translate.instant('ERROR.CARGAR_MINIMO_CREDITOS'),
                'warning'
              );
            });


        };

      },
      controllerAs: 'd_publicarAsignaturas'
    };
  });