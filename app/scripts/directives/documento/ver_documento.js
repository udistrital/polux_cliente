'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:verDocumento
 * @description
 * # verDocumento
 */
angular.module('poluxClienteApp')
    .directive('verDocumento', function(poluxRequest, constantes, nuxeo) {
        return {
            restrict: "E",
            scope: {
                documentoid: '=',
                selectpag: '=?',
                loadpag: '=?',
                minified: '=?'
            },
            templateUrl: "views/directives/documento/ver_documento.html",
            controller: function($scope) {
                var self = this;

                poluxRequest.get("documento", $.param({
                    query: "Id:" + $scope.documentoid
                })).then(function(response) {
                    self.documento = response.data[0];
                    self.nuxeo = nuxeo;
                    self.nuxeo.repository().fetch(self.documento.Enlace)
                        .then(function(doc) {
                            console.log(doc)
                            doc.fetchBlob()
                                .then(function(res) {
                                    self.documento.Enlace = res.url;
                                    // in Node.js, use res.body
                                })
                                .catch(function(error) {
                                    throw error;
                                });
                        })
                        .catch(function(error) {
                            throw error;
                        });

                    console.log(self.documento.Enlace);
                });

                //self.paginax=$scope.pageNum;

                $scope.$watch('loadpag', function() {
                    $scope.pageNum = $scope.loadpag;
                });

                $scope.httpHeaders = { Authorization: 'Bearer some-aleatory-token' };
            },
            controllerAs: "d_verDocumento"
        };
    });