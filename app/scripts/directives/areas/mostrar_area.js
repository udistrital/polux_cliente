'use strict';

/**
* @ngdoc directive
* @name poluxClienteApp.directive:areas/mostrarArea
* @description
* # areas/mostrarArea
*/
angular.module('poluxClienteApp')
.directive('mostrarArea', function (poluxRequest,academicaRequest) {
  return {
    restrict: 'E',
    scope: {
      docenteParam: '=doc',
      idareaParam: '=setid',
      docactual: '=',
      ardocente: '='
    },

    templateUrl: 'views/directives/areas/mostrar_area.html',
    controller:function($scope){
      var self = this;
      self.removable=false;
      self.idareas=[];

      $scope.$watch('ardocente',function(){
        $scope.idareaParam=self.generarIdAreas($scope.ardocente);
      })
      /*
        Función que muestra el area por docente
        docenteSeleccionado value:"p.coddocente":
        recibe  la información del codigo del docente
        */
      self.mostrarAreasDocente= function(Id){
          self.parametros=$.param({
            query: "IdentificacionDocente:"+Id,
            sortby: "IdAreaConocimiento",
            order: "asc",
            limit: 0,
            related: "IdAreaConocimiento"
          });
          poluxRequest.get("areas_docente",self.parametros)
          .then(function(response){
            self.areas_docente=response.data;
            $scope.idareaParam=self.generarIdAreas(self.areas_docente);
            console.log("parametro id areaparam: "+$scope.idareaParam);
            self.codDocenteActual=Id;
            $scope.docactual=self.codDocenteActual;
            $scope.ardocente=self.areas_docente;
          });
      };
      /*
        Función que recibe arreglo de areasDocente y envia arreglo
        de areas necesario para comparar las areas disponibles para
        agregar.
        */
      self.generarIdAreas=function(areasDocenteParam){
          self.idareas=[];
          angular.forEach(areasDocenteParam,function(value){
              self.idareas.push(value.IdAreaConocimiento.Id);
          });
          return self.idareas;
      }
      /**/
      self.eliminarAreaDocente=function(IdAreaDocente){
        self.parametros=$.param({
          query: "Id:"+IdAreaDocente
        });
        poluxRequest.get("areas_docente",self.parametros).then(function(response){
          self.codDocenteActual=response.data[0].IdentificacionDocente;
          console.log("self.codDocenteActual: "+ self.codDocenteActual);
          poluxRequest.delete("areas_docente",IdAreaDocente)
          .then(function(response){
            self.mostrarAreasDocente(self.codDocenteActual);
          });
        });

      };


    },
    controllerAs:'d_mostrarArea'
  };
});
