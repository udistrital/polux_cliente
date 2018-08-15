'use strict';

/**
  * @ngdoc overview
  * @name nuxeoService
  * @description Modulo para servicio de nuxeoClient, provee los servicios descritos en {@link poluxService.service:nuxeoClient nuxeoClient}
  */
angular.module('nuxeoService',[])
  /**
   * @ngdoc service
   * @name poluxService.service:nuxeoClient
   * @requires $q
   * @requires services/poluxClienteApp.service:nuxeoService
   * @param {injector} $q componente de promesas de angular
   * @param {injector} nuxeo componente de gestión documental de nuxeo
   * @description
   * # nuxeoClient
   * Fabrica sobre la cual se consumen los servicios proveidos por el API de nuxeo sobre los metodos GET, POST, PUT y DELETE
   */
  .factory('nuxeoClient', function ($q,nuxeo) {
    return {
      /**
       * @ngdoc method
       * @name createDocument
       * @methodOf poluxService.service:nuxeoClient
       * @param {string} nombre Nombre del documento que se cargara
       * @param {string} descripcion Descripcion del documento que se cargara
       * @param {blob} documento Blob del documento que se cargara
       * @param {string} dominio Dominio de Polux en donde se almacenara el documento 
       * @param {function} callback Función que se ejecuta luego de que se resuelve la promesa 
       * @returns {Promise} bjeto de tipo promesa que indica si ya se cumplio la petición y se resuleve con la url del objeto cargado. 
       * @description 
       * Permite cargar un documento a {@link services/poluxClienteApp.service:nuxeoService nuxeo}
       */
      createDocument : function(nombre, descripcion, documento,dominio, callback) {
        var defer = $q.defer();
        nuxeo.connect().then(function(client) {
          nuxeo.operation('Document.Create')
          .params({
            type: 'File',
            name: nombre,
            properties: 'dc:title=' +  nombre + ' \ndc:description=' + descripcion
          })
          .input('/default-domain/workspaces/Proyectos de Grado POLUX/'+dominio)
          .execute()
          .then(function(doc) {
            var nuxeoBlob = new Nuxeo.Blob({
              content: documento
            });
            nuxeo.batchUpload()
              .upload(nuxeoBlob)
              .then(function(res) {
                return doc.set({'file:content': res.blob})
                .save({
                  headers: {'X-Versioning-Option': 'major'}
                })
              })
              .then(function() {
                return nuxeo.repository().fetch(doc.uid, {
                  schemas: ['dublincore', 'file']
                });
              })
              .then(function(doc) {
                if(!angular.isUndefined(callback)){
                  callback(doc.uid)
                }
                defer.resolve(doc.uid);
              })
              .catch(function(error) {
                defer.reject(error)
              });
          })
          .catch(function(error) {
            defer.reject(error)
          });
        })
        .catch(function(error){
          // cannot connect
          defer.reject(error);
        });
        return defer.promise;
      },

      /**
       * @ngdoc method
       * @name getDocumento
       * @methodOf poluxService.service:nuxeoClient
       * @param {uid} uid Uid del documento que se cargara
       * @returns {Promise} bjeto de tipo promesa que indica si ya se cumplio la petición y se resuleve con el objeto cargado.
       * @description 
       * Permite obtener un documento de {@link services/poluxClienteApp.service:nuxeoService nuxeo}
       */
      getDocument : function(uid){
        var defer = $q.defer();
        nuxeo.operation('Document.GetBlob')
          .input(uid)
          .execute()
          .then(function(responseBlob){
            return responseBlob.blob()
          })
          .then(function(blob){
            var document = {
              url : URL.createObjectURL(blob),
              blob : blob,
            }
            defer.resolve(document);
          })
          .catch(function(error){
              defer.reject(error)
          });
        return defer.promise;
      },

      /**
       * @ngdoc method
       * @name getVersions
       * @methodOf poluxService.service:nuxeoClient
       * @param {uid} uid Uid del documento del que se cargaran las versiones
       * @returns {Promise} bjeto de tipo promesa que indica si ya se cumplio la petición y se resuleve con la url del objeto cargado. 
       * @description 
       * Permite cargar un documento a {@link services/poluxClienteApp.service:nuxeoService nuxeo}
       */
      getVersions : function(uid){
        var defer = $q.defer();
        nuxeo.header('X-NXDocumentProperties', '*');
        nuxeo.operation('Document.GetVersions')
          .input(uid)
          .execute()
          .then(function(doc) {
            var getDocument = function(document){
              var defer = $q.defer();
              nuxeo.request('/id/'+document.uid)
              .get()
              .then(function(responseDocument) {
                defer.resolve(responseDocument);
              })
              .catch(function(error){
                defer.reject(error);
              });
              return defer.promise;
            }

            var promises = [];
            angular.forEach(doc.entries, function(document){
              promises.push(getDocument(document));
            });
            $q.all(promises)
              .then(function(documents){
                defer.resolve(documents);
              })
              .catch(function(error){
                defer.reject(error);
              });
          })
          .catch(function(error){
            defer.reject(error);
          });
        return defer.promise;
      },

      /**
       * @ngdoc method
       * @name uploadNewVersion
       * @methodOf poluxService.service:nuxeoClient
       * @param {uid} uid Uid del documento del que se cargaran las versiones
       * @param {blob} documento Blob del documento que se cargara como nueva versión
       * @returns {Promise} bjeto de tipo promesa que indica si ya se cumplio la petición y se resuleve con la url del objeto cargado. 
       * @description 
       * Permite cargar una nueva versión de un documento a {@link services/poluxClienteApp.service:nuxeoService nuxeo}
       */
      uploadNewVersion : function(uid,newVersion){
        var defer = $q.defer();
        var nuxeoBlob = new Nuxeo.Blob({
          content: newVersion,
        });
        nuxeo.batchUpload()
        .upload(nuxeoBlob)
        .then(function(res) {
          return nuxeo.repository().fetch(uid, {
            schemas: ['dublincore', 'file']
          })
          .then(function(doc){
            return doc.set({'file:content': res.blob})
            .save({
              headers: {'X-Versioning-Option': 'major'}
            })
          })
          .then(function() {
            return nuxeo.repository().fetch(uid, {
              schemas: ['dublincore', 'file']
            });
          })
          .then(function(doc) {
            defer.resolve(doc.uid);
          })
          .catch(function(error){
            defer.reject(error);
          });
        })
        .then(function(docResponse){
          //console.log(docResponse);
          //ctrl.getVersionesDocumento(uid);
          defer.resolve();
        })
        .catch(function(error) {
          defer.reject(error);
        });
        return defer.promise;
      },

    };
  });
