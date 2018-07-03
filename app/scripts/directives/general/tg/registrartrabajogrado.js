'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:registrarTrabajoGrado
 * @description
 * # registrarTrabajoGrado
 */
angular.module('poluxClienteApp')
  .directive('registrarTrabajoGrado', function (poluxRequest) {
    return {
      restrict: 'E',
      scope: {
          tgparam:'=',
          estparam: '='
        },

      templateUrl: 'views/directives/general/tg/registrar-trabajo-grado.html',
      controller:function($scope){
        var self = this;

        poluxRequest.get("modalidad","").then(function(response){
          self.modalidad=response.data;
        });

        self.agregarRegistroEstudiante=function(tg,codEstudiante){
          codEstudiante=parseInt(codEstudiante);
          console.log(tg.Id);
          var data={
            CodigoEstudiante: codEstudiante,
            Estado: "activo",   //cambiar consultado el estado real: activo,retirado o inactivo
            IdTrabajoGrado: { Id: tg.Id }
          }
          poluxRequest.post("estudiante_tg",data).then(function(response){
            poluxRequest.get("estudiante_tg",$.param({
              query: "CodigoEstudiante:" + response.data.CodigoEstudiante
            }));
          });
          swal({
            title: 'Ok',
            text: "Registro de trabajo de grado agregado a estudiante: "+ codEstudiante,
            type: 'success',
          })
        };
        self.agregarRegistro=function(estudiante,mod,title){
          mod=parseInt(mod);
          var data= {
            Distincion: "ninguno", //modificar base de datos para agregar check de "ninguno"
            Etapa: "solicitud tg",
            IdModalidad: {Id: mod},
            Titulo: title
          };
          poluxRequest.post("trabajo_grado",data).then(function(response){
            poluxRequest.get("trabajo_grado",$.param({
              query:"Id:"+response.data.Id
            })).then(function(response){
              $scope.tgparam=response.data;
              console.log($scope.tgparam);
              self.agregarRegistroEstudiante($scope.tgparam[0],estudiante);
            });
          });
        };

      },
      controllerAs:'d_regTG'
    };
  });
