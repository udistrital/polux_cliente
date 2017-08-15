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
                documentoid: '=?',
                selectpag: '=?',
                loadpag: '=?',
                minified: '=?'
            },
            templateUrl: "views/directives/documento/ver_documento.html",
            controller: function($scope) {
                var self = this;

                $scope.$watch('selectpag', function() {
                    $scope.pageNum = $scope.selectpag;
                });

                $scope.$watch('pageNum', function() {
                    $scope.loadpag = $scope.pageNum;
                });

                $scope.$watch('documentoid', function() {
                    poluxRequest.get("documento", $.param({
                        limit: -1,
                        sortby: "Id",
                        order: "asc",
                        query: "Id:" + $scope.documentoid
                    })).then(function(response) {
                        self.documento = response.data[0];
                        console.log(self.documento);
                        self.documento.Enlace = constantes.DOWNLOAD_FILE + self.documento.Enlace;
                        console.log(self.documento.Enlace);
                        $scope.selectpag = $scope.pageNum;
                        $scope.pdfUrl = self.documento.Enlace;
                    });
                });

            },
            controllerAs: "d_verDocumento"
        };
    });