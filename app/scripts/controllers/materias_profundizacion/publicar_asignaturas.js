'use strict';

/**
 * @ngdoc controller
 * @name poluxClienteApp.controller:MateriasProfundizacionPublicarAsignaturasCtrl
 * @description
 * # MateriasProfundizacionPublicarAsignaturasCtrl
 * Controller of the poluxClienteApp
 * Controlador de la vista publicar asignaturas que permite al cooridnador de pregrado publicar las asignaturas que se ofertarán en el periodo académico siguiente.
 * @requires $scope 
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires services/academicaService.service:academicaRequest
 * @requires services/poluxClienteApp.service:tokenService
 * @property {Object} periodo Almacena el periodo académico actual
 * @property {String} modalidad Texto que carga el tipo de modalidad asociada a la publicación de asignaturas
 * @property {Object} carreras Contiene las carreras asociadas al coorinador
 * @property {Object} carrera Carrera seleccionada por el coordinador
 * @property {Object} pensums Pensums asociados a la carrera escogidas
 * @property {String} mensajeErrorCarga Texto que aparece cuando ocurre un error al cargar los parámetros
 * @property {Boolean} errorCargarParametros Indicador que maneja la aparición de un error al cargar los parámetros
 */
angular.module('poluxClienteApp')
  .controller('MateriasProfundizacionPublicarAsignaturasCtrl',
    function($scope, $translate, academicaRequest, token_service) {
      var ctrl = this;
      //token_service.token.documento = "12237136";
      //$scope.userId = token_service.token.documento;
      $scope.userId = token_service.getAppPayload().appUserDocument;
      ctrl.periodo = [];
      ctrl.modalidad = "PREGRADO";
      $scope.msgCargandoSolicitudes = $translate.instant('LOADING.CARGANDO_ASIGNATURAS');

      /**
       * @ngdoc method
       * @name watch
       * @methodOf poluxClienteApp.controller:MateriasPosgradoPublicarAsignaturasCtrl
       * @description 
       * Función de la vista que vigila los cambios en el userId y carga las asignaturas y el periodo académico consumiendo los servicios correspodientes a coordinador_carrera y periodo_academico de {@link services/academicaService.service:academicaRequest academicaRequest}.
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} Función sin retorno
       */
      $scope.$watch("userId", function() {
        $scope.load = true;
        ctrl.carreras = [];
        academicaRequest.get("coordinador_carrera", [$scope.userId, "PREGRADO"]).then(function(response) {
            
            if (!angular.isUndefined(response.data.coordinadorCollection.coordinador)) {
              ctrl.carreras = response.data.coordinadorCollection.coordinador;
              academicaRequest.get("periodo_academico", "X").then(function(perAca) {
                  if (!angular.isUndefined(perAca.data.periodoAcademicoCollection.periodoAcademico)) {
                    ctrl.periodo = perAca.data.periodoAcademicoCollection.periodoAcademico[0];
                  } else {
                    ctrl.mensajeErrorCarga = $translate.instant('ERROR.CARGANDO_PERIODO');
                    ctrl.errorCargarParametros = true;
                  }
                  $scope.load = false;
                })
                .catch(function(error) {
                  
                  ctrl.mensajeErrorCarga = $translate.instant('ERROR.CARGANDO_PERIODO');
                  ctrl.errorCargarParametros = true;
                  $scope.load = false;
                });
            } else {
              ctrl.mensajeErrorCarga = $translate.instant('ERROR.NO_CARRERAS_PREGADO');
              ctrl.errorCargarParametros = true;
              $scope.load = false;
            }
          })
          .catch(function(error) {
            
            ctrl.mensajeErrorCarga = $translate.instant('ERROR.CARGAR_CARRERAS');
            ctrl.errorCargarParametros = true;
            $scope.load = false;
          });
      });

      /**
       * @ngdoc method
       * @name getPensums
       * @methodOf poluxClienteApp.controller:MateriasPosgradoPublicarAsignaturasCtrl
       * @description 
       * Función que es llamada cuando se selecciona una carrera en la vista, consulta los pensums de la carrera consulando el servicio pensums de {@link services/academicaService.service:academicaRequest academicaRequest}.
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} Función sin retorno
       */
      ctrl.getPensums = function(carreraSeleccionada) {
        $scope.load = true;
        $scope.pensumSeleccionado = null;
        $scope.msgCargandoPensums = $translate.instant('LOADING.CARGANDO_PENSUMS');
        ctrl.pensums = [];
        academicaRequest.get("pensums", [carreraSeleccionada]).then(function(response) {
            if (!angular.isUndefined(response.data.pensums.pensum)) {
              ctrl.carrera = carreraSeleccionada;
              ctrl.pensums = response.data.pensums.pensum;
              ctrl.pensumSeleccionado = null;
              $scope.load = false;
            } else {
              ctrl.mensajeCargaPensum = $translate.instant('NO_PENSUMS');
              ctrl.errorCargarPensum = true;
              $scope.load = false;
            }
          })
          .catch(function(error) {
            
            ctrl.mensajeCargaPensum = $translate.instant('ERROR.CARGAR_CARRERAS');
            ctrl.errorCargarPensum = true;
            $scope.load = false;
          });
      };

    });