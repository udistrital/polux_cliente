'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:asignarArea
 * @description
 * # asignarArea
 */
angular.module('poluxClienteApp')
  .directive('asignarArea', function (poluxRequest,cadenaRequest) {
    return {
      restrict: 'E',
      scope: {
        setareas: '=',
        idarea:'=',
        newarea:'='
        },
      templateUrl: 'views/directives/areas/asignar_area.html',
      controller:function($scope){
        var self = this;
        self.removable=false;
        self.nuevaArea = [];

        //Watch necesario luego de confirmar algun registro para el api
        $scope.$watch('newarea',function(){
          if ($scope.newarea=="") {
            self.nuevaArea=[];
          }
        });
        /**/
        self.asignarArea=function(){
          self.Nombre=cadenaRequest.cambiarTipoTitulo(self.Nombre);
          //verifica que el Nombre sea el mismo y asigna el Id(necesario para tablas con llave compuesta)

          angular.forEach($scope.setareas,function(value){
            if (value.Nombre==self.Nombre) {
              self.Id=value.Id;
                if(self.nuevaArea.indexOf(value) === -1){
                  self.nuevaArea.push(
                  /*  { "Id":self.Id,
                    "Nombre": self.Nombre
                  }*/
                  value
                );
                }
            }

          });

/*        document.getElementById("formAsignar").reset();*/
         $scope.newarea=self.nuevaArea;
        };
        /**/
        self.verificarAreas=function(nombreArea){
          nombreArea=cadenaRequest.cambiarTipoTitulo(nombreArea);
          if ($scope.setareas==null) {
            return true;
          }
          else {
            var result=true;
            for (var i = 0; i < $scope.setareas.length; i++) {
              if ($scope.setareas[i].Nombre==nombreArea) {
                result= false;
              }
            }
            return result;
          }
          if (nombreArea==null ) {
            return false;
          }
          else {
            return true;
          }
        };
      },
      controllerAs:'d_asignarArea'
    };
  });
