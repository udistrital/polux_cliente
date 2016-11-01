'use strict';

/**
* @ngdoc directive
* @name poluxApp.directive:revisionDocumento
* @description
* # revisionDocumento
*/
angular.module('poluxApp')
.directive('revisionDocumento', function (revisionRequest) {
  return {
    restrict: "E",
    scope: {
      revisionid: '=',
      paginadoc: '=',
      paginaset: '='
    },
    templateUrl: "views/directives/revision-documento.html",
    controller: function($scope) {
      var self = this;
      self.test = "esto es una directiva revision";

      revisionRequest.getRevision(1).success(function(data){
        self.revision=data[0];
      });
      revisionRequest.getAllCorreccionesRevision(1).success(function(data){
        self.correcciones=data;
      });

      /*self.postrev=function(){
        var revisionp ={
          "IdDocumentoTg": {Id: 1},
          "IdVinculacionDocente":{Id: 2},
          "NumeroRevision": 2,
          "Estado": "pendiente",
          "FechaRecepcion": "2016-10-17T19:00:00-05:00",
          "FechaRevision": "0001-01-01T00:00:00Z"
        };
        revisionRequest.postRevision(revisionp);

      };*/
      self.correccion={};
      //self.correcciones=[];
      self.fecha= new Date();
      self.agregarpag=false;
      self.verpag= function(pag){
        $scope.paginaset=pag;
      };
      self.agregar_correccion= function(data) {
        if (self.agregarpag) {
          data.pagina=$scope.paginadoc;
        }
        self.correcciones.push(data);
        self.correccion={};
      };
    },
    controllerAs: "rdocumento"
  };
});
