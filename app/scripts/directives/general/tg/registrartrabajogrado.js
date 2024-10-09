'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:registrarTrabajoGrado
 * @description
 * # registrarTrabajoGrado
 * Directiva que permite a un estudiante registrar su trabajo de grado.
 * Actualmente no se utiliza.
 * Controlador: {@link poluxClienteApp.directive:registrarTrabajoGrado.controller:registrarTrabajoGradoCtrl registrarTrabajoGradoCtrl}
 * @param {object} tgparam Parametro del trabajo de grado que se va a registrar.
 * @param {object} estparam Estudiante que está registrando el trabajo de grado.
 */
angular.module('poluxClienteApp')
  .directive('registrarTrabajoGrado', function (poluxRequest) {
    return {
      restrict: 'E',
      scope: {
        tgparam: '=',
        estparam: '='
      },
      templateUrl: 'views/directives/general/tg/registrar-trabajo-grado.html',
      /**
       * @ngdoc controller
       * @name poluxClienteApp.directive:registrarTrabajoGrado.controller:registrarTrabajoGradoCtrl
       * @description
       * # registrarTrabajoGradoCtrl
       * # Controller of the poluxClienteApp.directive:registrarTrabajoGrado
       * Controlador de la directiva {@link poluxClienteApp.directive:registrarTrabajoGrado registrarTrabajoGrado}.
       * @requires services/poluxService.service:poluxRequest
       * @requires $scope
       * @property {array} modalidad Arreglo de modalidades a las que puede aplicar el estudiante
       * @property {object} data Data que se envia para registrar el trabajo de grado a un estudiante.
       */
      controller: function ($scope) {
        var self = this;
        /**
         * @ngdoc method
         * @name cargarModalidades
         * @methodOf poluxClienteApp.directive:registrarTrabajoGrado.controller:registrarTrabajoGradoCtrl
         * @param {undefined} undefined No recibe parametros
         * @returns {undefined} No retorna ningún valor.
         * @description 
         * Permite cargar las modalidades disponibles del serivicio de {@link services/poluxService.service:poluxRequest poluxService}.
         */
        poluxRequest.get("modalidad", "").then(function (response) {
          self.modalidad = response.data.Data;
        });
        /**
         * @ngdoc method
         * @name agregarRegistroEstudiante
         * @methodOf poluxClienteApp.directive:registrarTrabajoGrado.controller:registrarTrabajoGradoCtrl
         * @param {object} tg Trabajo de grado que se va a asocial con el estudiante.
         * @param {number} codEstudiante Código del estudiante que se va a asocial al trabajo de grado.
         * @returns {undefined} No retorna ningún valor.
         * @description 
         * Función para asociar un estudiante con un trabajo de grado en  el serivicio de {@link services/poluxService.service:poluxRequest poluxService}.
         */
        self.agregarRegistroEstudiante = function (tg, codEstudiante) {
          codEstudiante = parseInt(codEstudiante);
          
          var data = {
            CodigoEstudiante: codEstudiante,
            Estado: "activo",   //cambiar consultado el estado real: activo,retirado o inactivo
            IdTrabajoGrado: { Id: tg.Id }
          }
          poluxRequest.post("estudiante_tg", data).then(function (response) {
            poluxRequest.get("estudiante_tg", $.param({
              query: "CodigoEstudiante:" + response.data.Data.CodigoEstudiante
            }));
          });
          var nick = token_service.getAppPayload().email.split("@").slice(0);
          notificacionRequest.enviarNotificacion('Se registro el trabajo de grado '+nick[0],'PoluxCola','/solicitudes/listar_solicitudes');           
        
          swal({
            title: 'Ok',
            text: "Registro de trabajo de grado agregado a estudiante: " + codEstudiante,
            type: 'success',
          })
        };
        /**
         * @ngdoc method
         * @name agregarRegistro
         * @methodOf poluxClienteApp.directive:registrarTrabajoGrado.controller:registrarTrabajoGradoCtrl
         * @param {object} estudiante Estudiante que registra el trabajo de grado.
         * @param {number} mod Modalidad en la que se registra un trabajo de grado.
         * @param {string} title Titulo del trabajo de grado que se va a registrar.
         * @returns {undefined} No retorna ningún valor.
         * @description 
         * Función para asociar un estudiante con un trabajo de grado en  el serivicio de {@link services/poluxService.service:poluxRequest poluxService}, 
         * esta función llama a agregarRegistrosEstudiante para agregar a los estudiantes asociados al trabajo de grado.
         */
        self.agregarRegistro = function (estudiante, mod, title) {
          mod = parseInt(mod);
          var data = {
            Distincion: "ninguno", //modificar base de datos para agregar check de "ninguno"
            Etapa: "solicitud tg",
            IdModalidad: { Id: mod },
            Titulo: title
          };
          poluxRequest.post("trabajo_grado", data).then(function (response) {
            poluxRequest.get("trabajo_grado", $.param({
              query: "Id:" + response.data.Data.Id
            })).then(function (response) {
              $scope.tgparam = response.data.Data;
              
              self.agregarRegistroEstudiante($scope.tgparam[0], estudiante);
            });
          });
        };

      },
      controllerAs: 'd_regTG'
    };
  });
