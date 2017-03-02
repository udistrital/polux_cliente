'use strict';

/**
 * @ngdoc directive
 * @name poluxApp.directive:verDocumento
 * @description
 * # verDocumento
 */
angular.module('poluxApp')
  .directive('verDocumento', function (poluxRequest) {
    return {
      restrict: "E",
      scope: {
        documentoid: '=',
        selectpag: '=?',
        loadpag: '=?'
      },
      templateUrl: "views/directives/documento/ver_documento.html",
      controller: function($scope) {
        var self = this;

        poluxRequest.get("documento",$.param({
          query: "Id:"+$scope.documentoid
        })).then(function(response){
          self.documento=response.data[0];
        });

        //self.paginax=$scope.pageNum;

        $scope.$watch('loadpag', function() {
          $scope.pageNum=$scope.loadpag;
        });

        $scope.httpHeaders = { Authorization: 'Bearer some-aleatory-token' };
      },
      controllerAs: "d_verDocumento"
    };
  });
