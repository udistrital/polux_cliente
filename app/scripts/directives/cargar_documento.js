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
          carreras: '=',
          acta: '=',
      },
      templateUrl: 'views/directives/cargar_documento.html',
      controller:function(poluxRequest,$translate,$filter,$scope,$q,nuxeo){
        var ctrl = this;
        ctrl.documento = [];
        $scope.msgCargandoDocumento = $translate.instant("LOADING.CARGANDO_DOCUMENTO");

        if($scope.carreras !== []){
            console.log($scope.carreras);
            if($scope.carreras.length===1){
                $scope.carrera = $scope.carreras[0];
            }
        }

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
                ctrl.documento.resumen = ctrl.documento.fileModel.name;
                ctrl.documento.url = doc.uid;
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
          console.log("consecutivo",ctrl.consecutivo);
          if($scope.carreras.length===1){
            ctrl.carrera = $scope.carreras[0].CODIGO_CARRERA;
          }
          if(ctrl.carrera!==undefined){
            $scope.loadDocumento = true;
            var date = $filter('date')(new Date(), 'dd-MM-yyyy');
            ctrl.documento.nombre = $scope.name+" "+ctrl.consecutivo+" Codigo de carrera:"+ctrl.carrera+" Fecha:"+date;
            ctrl.cargarDocumento().then(function(){
              var documento = {
                "Titulo":ctrl.documento.nombre,
                "Enlace":ctrl.documento.url,
                "Resumen":ctrl.documento.resumen,
                "TipoDocumentoEscrito":1,
              }
              $scope.acta = [];
              $scope.acta.nombre = ctrl.documento.nombre;
              $scope.acta.url = ctrl.documento.url;

              poluxRequest.post("documento_escrito",documento).then(function(){
                $('#modalSeleccionarDocumento').modal('hide');
                swal(
                  $translate.instant("DOCUMENTO.CARGADO"),
                  '',
                  'success'
                );
              });

              ctrl.documento = [];
              $scope.loadDocumento = false;
            });
          }else{
            swal(
              $translate.instant("SELECT.SIN_CARRERA"),
              '',
              'warning'
            );
          }


        }

      },
      controllerAs:'d_cargarDocumento'
    };
  });
