'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:verDocumento
 * @description
 * # verDocumento
 */
angular.module('poluxClienteApp')
    .directive('verDocumento', function(poluxRequest, constantes, nuxeo, $q, $sce, $translate) {
        return {
            restrict: "E",
            scope: {
                documento: '=?',
                minified: '=?',
            },
            templateUrl: "views/directives/documento/ver_documento.html",
            controller: function($scope) {
                var self = this;
                $scope.msgCargandoDocumento=$translate.instant('LOADING.CARGANDO_DOCUMENTO');
                $scope.load=true;

                $scope.$watch('documento', function() {
                    if($scope.documento != undefined){
                      console.log("documento", $scope.documento);
                      self.getDocumento($scope.documento.Enlace);
                      self.documento = $scope.documento;
                    }
                });


                self.getDocumento = function(docid){
                  console.log(docid);
                    if(docid!=null){

                      nuxeo.header('X-NXDocumentProperties', '*');

                      self.obtenerDoc = function () {
                        var defered = $q.defer();

                        nuxeo.request('/id/'+docid)
                            .get()
                            .then(function(response) {
                              console.log(response);
                              self.doc=response;
                              //var aux=response.get('file:content');
                              self.document=response;
                              defered.resolve(response);
                            })
                            .catch(function(error){
                                defered.reject(error)
                            });
                        return defered.promise;
                      };

                      self.obtenerFetch = function (doc) {
                        var defered = $q.defer();

                        doc.fetchBlob()
                          .then(function(res) {
                            console.log(res);
                            defered.resolve(res.blob());

                          })
                          .catch(function(error){
                                defered.reject(error)
                            });
                        return defered.promise;
                      };

                        self.obtenerDoc().then(function(){

                           self.obtenerFetch(self.document).then(function(r){
                               self.blob=r;
                               var fileURL = URL.createObjectURL(self.blob);
                               console.log(fileURL);
                               self.content = $sce.trustAsResourceUrl(fileURL);
                               //$window.open(fileURL);
                               $scope.pdfUrl=fileURL;
                               $scope.load=false;
                            });
                        });

                    }

                }

            },
            controllerAs: "d_verDocumento"
        };
    });
