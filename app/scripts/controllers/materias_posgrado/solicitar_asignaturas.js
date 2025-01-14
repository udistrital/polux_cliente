'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:MateriasPosgradoSolicitarAsignaturasCtrl
 * @description
 * # MateriasPosgradoSolicitarAsignaturasCtrl
 * Controller of the poluxClienteApp
 * Controlador que permite el manejo de la solicitud de asignaturas para la modalidad de espacios académicos de posgrado
 * @requires $scope
 * @requires services/academicaService.service:academicaRequest
 * @requires services/poluxMidService.service:poluxMidRequest
 * @property {String} codigo Texto que carga el código del estudiante en sesión
 */
angular.module('poluxClienteApp')
  .controller('MateriasPosgradoSolicitarAsignaturasCtrl',
    function($scope, poluxMidRequest, academicaRequest) {
      var ctrl = this;
      $scope.codigo = token_service.getAppPayload().appUserDocument;

      /**
       * @ngdoc method
       * @name watch
       * @methodOf poluxClienteApp.controller:MateriasPosgradoSolicitarAsignaturasCtrl
       * @description 
       * Función de la vista que vigila los cambios en el código del usuario y carga llos datos estudiantiles y académicos correspondientes a la solicitud del estudiante.
       * Efectúa consulta al servicio de {@link services/academicaService.service:academicaRequest academicaRequest}.
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} Función sin retorno
       */
      $scope.$watch("codigo", function() {
        academicaRequest.get("periodo_academico", "P").then(function(periodoAnterior) {
          academicaRequest.get("datos_estudiante", [$scope.codigo]).then(function(response2) {
            if (!angular.isUndefined(response2.data.estudianteCollection.datosEstudiante)) {
              if (response2) {
                ctrl.estudiante = {
                  "Codigo": $scope.codigo,
                  "Nombre": response2.data.estudianteCollection.datosEstudiante[0].nombre,
                  "Modalidad": 2,
                  "Tipo": "POSGRADO",
                  "PorcentajeCursado": response2.data.estudianteCollection.datosEstudiante[0].creditosCollection.datosCreditos[0].porcentaje.porcentaje_cursado[0].porcentaje_cursado,
                  "Promedio": response2.data.estudianteCollection.datosEstudiante[0].promedio,
                  "Rendimiento": response2.data.estudianteCollection.datosEstudiante[0].rendimiento,
                  "Estado": response2.data.estudianteCollection.datosEstudiante[0].estado,
                  "Nivel": response2.data.estudianteCollection.datosEstudiante[0].nivel,
                  "TipoCarrera": response2.data.estudianteCollection.datosEstudiante[0].tipo_carrera,
                };
                
                ctrl.modalidad = "MATERIAS POSGRADO";
                poluxMidRequest.post("verificarRequisitos/Registrar", ctrl.estudiante).then(function(response) {
                  
                  ctrl.validar = response.data.Data.RequisitosModalidades;
                });
              }
            }
          });
        });
      });

    });