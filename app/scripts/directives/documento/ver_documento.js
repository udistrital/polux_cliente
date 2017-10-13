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
                  console.log($scope.documentoid);
                    poluxRequest.get("documento_trabajo_grado", $.param({
                        limit: -1,
                        sortby: "Id",
                        order: "asc",
                        query: "Id:" + $scope.documentoid
                    })).then(function(response) {
                        self.documento = response.data[0];
                        self.documento.Enlace = constantes.DOWNLOAD_FILE + self.documento.Enlace;
                      //  self.documento.Enlace='blob:http://localhost:9008/0e974a19-639b-494a-8759-470704ce0076';
                        console.log(self.documento.Enlace);
                        $scope.selectpag = $scope.pageNum;
                        $scope.pdfUrl = self.documento.Enlace;
                      //  $scope.pdfUrl = 'blob:http://localhost:9008/0e974a19-639b-494a-8759-470704ce0076';

                      //cargar documento obteniendolo de NUXEO
                        $scope.pdfUrl="documentos/dibujo.pdf";
                    });
                });

            },
            controllerAs: "d_verDocumento"
        };
    });
