'use strict';

/**
* @ngdoc directive
* @name poluxClienteApp.directive:verRevision
* @description
* # verRevision
*/
angular.module('poluxClienteApp')
.directive('verRevision', function (poluxRequest) {
  return {
    restrict: "E",
    scope: {
      revisionid: '=',
      paginaset: '='
    },
    templateUrl: "views/directives/documento/ver_revision.html",
    controller: function($scope) {
      var self = this;

      poluxRequest.get("revision",$.param({
        query:"Id:"+$scope.revisionid
      })).then(function(response){
        self.revision=response.data[0];
      });

      poluxRequest.get("correccion",$.param({
        query:"IdRevision:"+$scope.revisionid,
        sortby:"Id",
        order:"asc"
      })).then(function(response){
        self.correcciones=response.data;
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
        poluxRequest.post("comentario",mycomentario).then(function(response){
          poluxRequest.get("comentario",$.param({
            query:"IdCorreccion:"+mycomentario.IdCorreccion.Id,
            sortby:"Id",
            order:"asc"
          })).then(function(response){
            comentarios.push(response.data);
          });
        });//.then(function(data){console.log(data);});
        self.coment=null;
        return comentarios;
      };

      self.cargarComentarios=function(correccionid){
        var comentarios=[];
        poluxRequest.get("comentario",$.param({
          query:"IdCorreccion:"+correccionid,
          sortby:"Id",
          order:"asc"
        })).then(function(response){
          comentarios.push(response.data);
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
        poluxRequest.postRevision(revisionp);

      };*/

      //self.correcciones=[];
      //self.fecha= new Date();
      //self.agregarpag=false;
      self.verpag= function(pag){
        $scope.paginaset=pag;
      };
    },
    controllerAs: "d_verRevision"
  };
});
