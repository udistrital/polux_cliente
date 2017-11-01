'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:cargarDocumento
 * @description
 * # cargarDocumento
 */
angular.module('poluxClienteApp')
  .directive('cargarDocumento', function () {
    return {
      restrict: 'E',
      scope:{
          name: '@',
          carrera: '=',
      },
      templateUrl: 'views/directives/cargar_documento.html',
      controller:function($translate,$filter,$scope,$q,nuxeo){
        var ctrl = this;
        ctrl.documento = [];
        $scope.msgCargandoDocumento = $translate.instant("LOADING.CARGANDO_DOCUMENTO");

        ctrl.cargarDocumento = function(){
          var defered = $q.defer();
          var promise = defered.promise;
          nuxeo.operation('Document.Create')
            .params({
              type: 'File',
              name: ctrl.documento.nombre,
              properties: 'dc:title=' + ctrl.documento.nombre + ' \ndc:description=' + ctrl.documento.descripcion
            })
            .input('/default-domain/workspaces/Proyectos de Grado POLUX/Actas')
            .execute()
            .then(function(doc) {
                var nuxeoBlob = new Nuxeo.Blob({ content: ctrl.documento.fileModel });
                nuxeo.batchUpload()
                .upload(nuxeoBlob)
                .then(function(res) {
                  return nuxeo.operation('Blob.AttachOnDocument')
                      .param('document', doc.uid)
                      .input(res.blob)
                      .execute();
                })
                .then(function() {
                  return nuxeo.repository().fetch(doc.uid, { schemas: ['dublincore', 'file'] });
                })
                .then(function(doc) {
                  defered.resolve(doc);
                })
                .catch(function(error) {
                  throw error;
                  defered.reject(error)
                });
            })
            .catch(function(error) {
                throw error;
                defered.reject(error)
            });
            return promise;
        }

        ctrl.enviarDocumento = function(){
            $scope.loadDocumento = true;
            if($scope.name!==undefined && $scope.carrera!==undefined){
                var date = $filter('date')(new Date(), 'dd-MM-yyyy');
                ctrl.documento.nombre = $scope.name+"-"+$scope.carrera+"-"+date;
                console.log(ctrl.documento.nombre);
            }
            ctrl.cargarDocumento().then(function(){
              $('#modalSeleccionarDocumento').modal('hide');
              swal(
                $translate.instant("DOCUMENTO.CARGADO"),
                '',
                'success'
              );
              ctrl.documento = [];
              $scope.loadDocumento = false;
            });
        }

      },
      controllerAs:'d_cargarDocumento'
    };
  });
