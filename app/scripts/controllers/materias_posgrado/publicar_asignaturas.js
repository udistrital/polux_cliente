'use strict';

/**
 * @ngdoc controller
 * @name poluxClienteApp.controller:MateriasPosgradoPublicarAsignaturasCtrl
 * @description
 * # MateriasPosgradoPublicarAsignaturasCtrl
 * Controller of the poluxClienteApp
 * Controlador de la vistar publicar asignaturas que permite al cooridnador de posgrado publicar las asignaturas que se ofertaran en el periodo academico siguiente.
 * Usa la directiva materias/publicar_asignaturas
 * @requires services/academicaService.service:academicaRequest
 * @requires $scope 
 * @requires $translate
 * @requires services/poluxClienteApp.service:tokenService
 * @property {object} periodo Almacena el periodo academico actual
 * @property {object} carreras Contiene las carreras asociadas al coorinador
 * @property {object} carrera Carrera seleccionada por el coordinador
 * @property {object} pensums Pensums asociados a la carrera escogidas
 */
angular.module('poluxClienteApp')
  .controller('MateriasPosgradoPublicarAsignaturasCtrl', function (academicaRequest, $scope, $translate,token_service) {
    var ctrl = this;
    token_service.token.documento = "12237136";
    $scope.userId = token_service.token.documento;
    ctrl.periodo=[];
    ctrl.modalidad="POSGRADO";

    /**
     * @ngdoc method
     * @name watch
     * @methodOf poluxClienteApp.controller:MateriasPosgradoPublicarAsignaturasCtrl
     * @description 
     * Función del $scope que vigila los cambios en el userId y carga las asignaturas y el periodo academico consumiendo
     * los servicios correspodientes a coordinador_carrera y periodo_academico de {@link services/academicaService.service:academicaRequest academicaRequest}
     * @param {undefined} undefined no requiere parametros
     * @returns {undefined} Función sin retorno
     */
    $scope.$watch("userId",function() {
        $scope.msgCargandoSolicitudes = $translate.instant('LOADING.CARGANDO_ASIGNATURAS');
        $scope.load = true;
        ctrl.carreras = [];
        academicaRequest.get("coordinador_carrera", [$scope.userId, "POSGRADO"]).then(function(response){
          console.log(response);
        	if (!angular.isUndefined(response.data.coordinadorCollection.coordinador)) {
                ctrl.carreras=response.data.coordinadorCollection.coordinador;
                academicaRequest.get("periodo_academico","X").then(function(response){
                    if (!angular.isUndefined(response.data.periodoAcademicoCollection.periodoAcademico)) {
                        ctrl.periodo=response.data.periodoAcademicoCollection.periodoAcademico[0];
                    }else{
                        ctrl.mensajeErrorCarga = $translate.instant('ERROR.CARGANDO_PERIODO');
                        ctrl.errorCargarParametros = true;
                    }
                    $scope.load = false;
                })
                .catch(function(error){
                    console.log(error);
                    ctrl.mensajeErrorCarga = $translate.instant('ERROR.CARGANDO_PERIODO');
                    ctrl.errorCargarParametros = true;
                    $scope.load = false;
                });
        	} else{
                ctrl.mensajeErrorCarga = $translate.instant('NO_CARRERAS_POSGRADO');
                ctrl.errorCargarParametros = true;
                $scope.load = false;
            }
          })
          .catch(function(error){
              console.log(error);
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
     * Función que es llamada cuando se selecciona una carrera en la vista, consulta los pensums de la carrera consulando
     * el servicio pensums de {@link services/academicaService.service:academicaRequest academicaRequest}
     * @param {undefined} undefined no requiere parametros
     * @returns {undefined} Función sin retorno
     */
    ctrl.myFunc = function(carreraSeleccionada) {
      $scope.load = true;
      $scope.pensumSeleccionado=null;
      $scope.msgCargandoPensums = $translate.instant('LOADING.CARGANDO_PENSUMS');
      ctrl.pensums=[];
      academicaRequest.get("pensums",[carreraSeleccionada]).then(function(response){
          if (!angular.isUndefined(response.data.pensums.pensum)) {
              ctrl.carrera=carreraSeleccionada;
              ctrl.pensums=response.data.pensums.pensum;
              ctrl.pensumSeleccionado=null;
              $scope.load = false;
          } else{
            ctrl.mensajeCargaPensum = $translate.instant('NO_PENSUMS');
            ctrl.errorCargarPensum = true;
            $scope.load = false;
            }
      })
      .catch(function(error){
        console.log(error);
        ctrl.mensajeCargaPensum = $translate.instant('ERROR.CARGAR_CARRERAS');
        ctrl.errorCargarPensum = true;
        $scope.load = false;
    });
    };

  });
