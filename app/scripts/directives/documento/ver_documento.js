'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:verDocumento
 * @description
 * # verDocumento
 */
angular.module('poluxClienteApp')
    .directive('verDocumento', function(poluxRequest, constantes, nuxeo, $q, $sce) {
        return {
            restrict: "E",
            scope: {
                documentoid: '=?',
                selectpag: '=?',
                loadpag: '=?',
                minified: '=?'
            },
            templateUrl: "views/directives/documento/ver_documento.html",
            controller: function($scope) {
                var self = this;

                $scope.$watch('selectpag', function() {
                    if($scope.selectpag){
                      $scope.pageNum = $scope.selectpag;
                    }
                });

                $scope.$watch('pageNum', function() {
                    $scope.loadpag = $scope.pageNum;
                });

                $scope.$watch('documentoid', function() {
                  console.log($scope.documentoid);
                  if($scope.documentoid){
                    poluxRequest.get("documento_escrito", $.param({
                        limit: -1,
                        sortby: "Id",
                        order: "asc",
                        query: "Id:"+$scope.documentoid
                    })).then(function(response) {
                      console.log(response);
                      console.log(response.data[0].Enlace);
                        self.documento = response.data[0];
                        self.documento.Enlace = constantes.DOWNLOAD_FILE + self.documento.Enlace;
                      //  self.documento.Enlace='blob:http://localhost:9008/0e974a19-639b-494a-8759-470704ce0076';
                      //  console.log(self.documento.Enlace);
                        $scope.selectpag = $scope.pageNum;
                      //  $scope.pdfUrl = self.documento.Enlace;
                      //  $scope.pdfUrl = 'blob:http://localhost:9008/0e974a19-639b-494a-8759-470704ce0076';

                      //cargar documento obteniendolo de NUXEO
                      var docid=response.data[0].Enlace;
                      self.getDocumento(docid);
                      //$scope.pdfUrl="documentos/dibujo.pdf";

                    });
                  }
                });

                self.getDocumento = function(docid){
                    if(docid!=null){

                      nuxeo.header('X-NXDocumentProperties', '*');

                      self.obtenerDoc = function () {
                        var defered = $q.defer();

                        nuxeo.request('/id/'+docid)
                            .get()
                            .then(function(response) {
                              self.doc=response;
                              var aux=response.get('file:content');
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
                            });
                        });

                    }

                }

            },
            controllerAs: "d_verDocumento"
        };
    });
