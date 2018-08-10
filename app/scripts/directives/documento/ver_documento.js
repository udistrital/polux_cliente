'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:verDocumento
 * @description
 * # verDocumento
 */
angular.module('poluxClienteApp')
    .directive('verDocumento', function(poluxRequest, constantes, nuxeoClient, $q, $sce, $translate) {
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

                $scope.$watch('documento', function() {
                    if($scope.documento != undefined){
                      console.log("documento", $scope.documento);
                      self.getDocumento($scope.documento.Enlace);
                      self.documento = $scope.documento;
                    }
                });


                self.getDocumento = function(docid){
                    $scope.loadDocumento=true;
                    console.log(docid);
                    if(docid!=null){
                        nuxeoClient.getDocument(docid)
                            .then(function(documento){
                               //$window.open(fileURL);
                               $scope.pdfUrl=documento.url;
                               $scope.loadDocumento=false;
                            })
                            .catch(function(error){
                                $scope.errorDocumento = true;
                                $scope.mensajeError = $translate.instant("ERROR.CARGAR_DOCUMENTO"); 
                                $scope.loadDocumento = false;
                            })
                    }

                }

            },
            controllerAs: "d_verDocumento"
        };
    });
