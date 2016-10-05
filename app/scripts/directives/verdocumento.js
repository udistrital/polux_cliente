'use strict';

/**
 * @ngdoc directive
 * @name poluxApp.directive:verDocumento
 * @description
 * # verDocumento
 */
angular.module('poluxApp')
  .directive('verDocumento', function () {
    return {
      restrict: "E",
      scope: {
        documento: '=',
        selectpag: '=',
        loadpag: '='
      },
      templateUrl: "views/directives/ver-documento.html",
      controller: function($scope) {
        var self = this;
        self.paginax=$scope.pageNum;

        $scope.$watch('loadpag', function() {
          $scope.pageNum=$scope.loadpag;
        });

        //$scope.pdfUrl = $scope.documento.enlace;
        $scope.httpHeaders = { Authorization: 'Bearer some-aleatory-token' };
      },
      controllerAs: "vdocumento"
    };
  });
