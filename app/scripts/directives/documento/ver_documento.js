'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:verDocumento
 * @description
 * # verDocumento
 */
angular.module('poluxClienteApp')
    .directive('verDocumento', function(poluxRequest, constantes) {
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
                    self.documento.Enlace = constantes.NUXEO_DOC + self.documento.Enlace;
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