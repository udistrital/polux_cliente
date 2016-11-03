'use strict';

/**
 * @ngdoc service
 * @name poluxApp.revisionService
 * @description
 * # revisionService
 * Factory in the poluxApp.
 */
angular.module('revisionService',[])
  .factory('revisionRequest', function ($http) {
    // Service logic
    // ...

    var path = "http://127.0.0.1:8080/v1/";

    // Public API here
    return {

      getRevision: function (id) {
        return $http.get(path+"revision/?query=Id%3A"+id+"&sortby=Id&order=asc");
      },
      getRevisionByVinculacionDocumentoTg: function (idVinculacion, idDocumento) {
        return $http.get(path+"revision/?query=IdDocumentoTg%3A"+idDocumento+"%2CIdVinculacionDocente%3A"+idVinculacion+"&sortby=Id&order=asc");
      },
      getAllDocenteRevision: function (id_vinculacion_docente) {
        return $http.get(path+"revision/?query=IdVinculacionDocente%3A"+id_vinculacion_docente+"&sortby=Id&order=asc");
      },
      getAllCorreccionesRevision: function (idrevision) {
        return $http.get(path+"correccion/?query=IdRevision%3A"+idrevision+"&sortby=Id&order=asc");
      },
      getAllComentariosCorreccion: function (idcorreccion) {
        return $http.get(path+"comentario/?query=IdCorreccion%3A"+idcorreccion+"&sortby=Id&order=asc");
      },
      postRevision: function (revision) {
        return $http.post(path+"revision",revision);
      },
      postCorreccionRevision: function (correccion) {
        return $http.post(path+"correccion",correccion);
      },
      postComentarioCorreccion: function(comentario){
        return $http.post(path+"comentario",comentario);
      }
    };
  });
