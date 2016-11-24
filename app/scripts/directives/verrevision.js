  'use strict';

  /**
  * @ngdoc directive
  * @name poluxApp.directive:verRevision
  * @description
  * # verRevision
  */
  angular.module('poluxApp')
  .directive('verRevision', function (revisionRequest) {
    return {
      restrict: "E",
      scope: {
        revisionid: '=',
        paginaset: '='
      },
      templateUrl: "views/directives/ver-revision.html",
      controller: function($scope) {
        var self = this;
        revisionRequest.getRevision($scope.revisionid).success(function(data){
          self.revision=data[0];
        });
        revisionRequest.getAllCorreccionesRevision($scope.revisionid).success(function(data){
          self.correcciones=data;
        });

        self.pruebac={};
        self.comentarCorreccion = function(comentario, idcorreccion){
          var mycomentario={};
          var myidcorreccion={};
          myidcorreccion.Id=idcorreccion;
          mycomentario.IdCorreccion=myidcorreccion;
          mycomentario.Comentario=comentario;
          mycomentario.Fecha= new Date();
          mycomentario.Autor="pepito";
          self.pruebac=mycomentario;
          var comentarios=[];
          revisionRequest.postComentarioCorreccion(mycomentario).success(function(data){
            revisionRequest.getAllComentariosCorreccion(mycomentario.IdCorreccion.Id).success(function(data){
              comentarios.push(data);
            });
          });//.then(function(data){console.log(data);});
          self.coment=null;
          return comentarios;
        };

        self.cargarComentarios=function(correccionid){
          var comentarios=[];
          revisionRequest.getAllComentariosCorreccion(correccionid).success(function(data){
            comentarios.push(data);
          });
          return comentarios;
        };



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

        //self.correcciones=[];
        //self.fecha= new Date();
        //self.agregarpag=false;
        self.verpag= function(pag){
          $scope.paginaset=pag;
        };
      },
      controllerAs: "vrevision"
    };
  });
