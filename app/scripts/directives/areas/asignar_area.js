'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:asignarArea
 * @description
 * # asignarArea
 * Directiva que sirve para asignar áreas a un trabajo de grado
 * Controlador: {@link poluxClienteApp.directive:asignarArea.controller:asignarAreaCtrl asignarAreaCtrl}
 * @param {string} setareas Arreglo de áreas existentes
 * @param {object} idarea Id del área que se asignará
 * @param {number} newarea Área que se va a asignar
 */
angular.module('poluxClienteApp')
  .directive('asignarArea', function (poluxRequest) {
    return {
      restrict: 'E',
      scope: {
        setareas: '=',
        idarea: '=',
        newarea: '='
      },
      templateUrl: 'views/directives/areas/asignar_area.html',
      /**
       * @ngdoc controller
       * @name poluxClienteApp.directive:asignarArea.controller:asignarAreaCtrl
       * @description
       * # AsignarAreaCtrl
       * # Controller of the poluxClienteApp.directive:asignarArea
       * Controlador de la directiva asignar_area.
       * @requires $scope
       * @property {object} nuevaArea Área que se va a agregar
       * @property {String} Nombre Nombre del área que se agrega
       */
      controller: function ($scope) {
        var self = this;
        self.removable = false;
        self.nuevaArea = [];

        //Watch necesario luego de confirmar algun registro para el api
        $scope.$watch('newarea', function () {
          if ($scope.newarea == "") {
            self.nuevaArea = [];
          }
        });
        /**
         * @ngdoc method
         * @name asignarArea
         * @methodOf poluxClienteApp.directive:asignarArea.controller:asignarAreaCtrl
         * @param {undefined} undefined No recibe parametros
         * @returns {undefined} No retorna ningún valor
         * @description 
         * Permite guardar el área en el arreglo de áreas del $scope.
         */
        self.asignarArea = function () {
          //self.Nombre=cadenaRequest.cambiarTipoTitulo(self.Nombre);
          //verifica que el Nombre sea el mismo y asigna el Id(necesario para tablas con llave compuesta)
          angular.forEach($scope.setareas, function (value) {
            if (value.Nombre + " - " + value.Snies == self.Nombre) {
              self.Id = value.Id;
              if (self.nuevaArea.indexOf(value) === -1) {
                self.nuevaArea.push(
                  /*  { "Id":self.Id,
                    "Nombre": self.Nombre
                  }*/
                  value
                );
              }
              self.Nombre = "";
            }

          });

          /*        document.getElementById("formAsignar").reset();*/
          $scope.newarea = self.nuevaArea;
        };
        
        /**
         * @ngdoc method
         * @name verificarAreas
         * @methodOf poluxClienteApp.directive:asignarArea.controller:asignarAreaCtrl
         * @param {String} nombreArea No recibe parametros
         * @returns {Boolean} Booleano que identifica si el nombre del área que se agrega no existe ya.
         * @description 
         * Permite verificar que el nombre de un área es valido.
         */
        self.verificarAreas = function (nombreArea) {
          //nombreArea=cadenaRequest.cambiarTipoTitulo(nombreArea);
          if ($scope.setareas == null) {
            return true;
          } else {
            var result = true;
            for (var i = 0; i < $scope.setareas.length; i++) {
              if ($scope.setareas[i].Nombre + " - " + $scope.setareas[i].Snies == nombreArea) {
                result = false;
              }
            }
            return result;
          }
          /*if (nombreArea==null ) {
            return false;
          }
          else {
            return true;
          }*/
        };
      },
      controllerAs: 'd_asignarArea'
    };
  });
