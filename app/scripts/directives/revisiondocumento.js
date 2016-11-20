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
      paginaset: '=',
      revisionestado: '='
    },
    templateUrl: "views/directives/revision-documento.html",
    controller: function($scope) {
      var self = this;
      revisionRequest.getRevision($scope.revisionid).success(function(data){
        self.revision=data[0];
      });
      revisionRequest.getAllCorreccionesRevision($scope.revisionid).success(function(data){
        self.correcciones=data;
      });

      self.copyObject=function(Obj){
      /* //Opcion recursiva
      if ( obj === null || typeof obj  !== 'object' ) {
            return obj;
        }
        var temp = obj.constructor();
        for ( var key in obj ) {
            temp[ key ] = clone( obj[ key ] );
        }
        return temp;*/
        //Opcion Json
        return JSON.parse( JSON.stringify( Obj ) );
      };

      self.editar=function(correc, temp){
        for ( var key in correc ) {
            correc[ key ] =  temp[ key ];
        }
        if (temp.agregarpag) {
          correc.Pagina=$scope.paginadoc;
        }
        if(correc.Cambio!="nuevo"){
          correc.Cambio="editado";
        }
        /*correc.Observacion = temp.Observacion;
        correc.Justificacion = temp.Justificacion;*/
      };

      self.correccion={};
      self.correcciones_eliminadas=[];
      self.fecha= new Date();
      self.agregarpag=false;
      self.verpag= function(pag){
        $scope.paginaset=pag;
      };

      self.agregar_correccion= function(correcion) {
        if (self.agregarpag) {
          correcion.Pagina=$scope.paginadoc;
        }
        var idrev={};
        idrev.Id = $scope.revisionid;
        correcion.IdRevision=idrev;
        correcion.Cambio="nuevo";
        self.correcciones.push(correcion);
        self.correccion={};
      };

      self.eliminar_correccion= function(correcion) {
        if (correcion.Id!=null) {
          self.correcciones_eliminadas.push(correcion);
        }
        self.correcciones.splice(self.correcciones.indexOf(correcion),1);
      };

      self.cancelar_revisado= function() {
        revisionRequest.getAllCorreccionesRevision($scope.revisionid).success(function(data){
          self.correcciones=data;
        });
        self.correcciones_eliminadas=[];
      };

      self.guardar_revision= function(accion) {
        switch(accion) {
            case "borrador":
                if (self.revision.Estado!="borrador") {
                  self.revision.Estado="borrador";
                  revisionRequest.updateRevision(self.revision);
                }
                break;
            case "finalizar":
                self.revision.Estado="finalizada";
                self.revision.FechaRevision=new Date();
                revisionRequest.updateRevision(self.revision);
                $scope.revisionestado=self.revision.Estado;
                break;
        }
        for (var i = 0; i < self.correcciones.length; i++) {
          if (self.correcciones[i].Cambio=="nuevo") {
            revisionRequest.postCorreccionRevision(self.correcciones[i]);
          }
          if (self.correcciones[i].Cambio=="editado") {
            revisionRequest.updateCorreccion(self.correcciones[i]);
          }
        }
        for (var i = 0; i < self.correcciones_eliminadas.length; i++) {
          revisionRequest.deleteCorreccion(self.correcciones_eliminadas[i].Id);
        }
      };

    },
    controllerAs: "rdocumento"
  };
});
