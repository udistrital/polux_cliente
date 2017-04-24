'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:pdfgen
 * @description
 * # pdfgen
 */
angular.module('poluxClienteApp')
  .directive('pdfgen', function() {
    return {
      scope: {
        pdfjson: '='
      },
      link: function(scope) {
        scope.$watch('pdfjson', function(newValue, oldValue) {
            console.log(oldValue);
          if (newValue !== oldValue) {
            scope.refresh_format_view(newValue);
          }
        }, true);
      },
      templateUrl: 'views/pdfgen.html',
      controller: function($scope) {
        var ctrl = this;
        console.log($scope.pdfjson);
        ctrl.name = $scope.pdfjson.name;
        ctrl.docDefinition = $scope.pdfjson.pdfgen;
        $scope.refresh_format_view = function(pdfjson){
            ctrl.name = pdfjson.name;
            ctrl.name = pdfjson.pdfgen;
        };
        ctrl.view_pdf = function(){
            pdfMake.createPdf(ctrl.docDefinition).open();
        };
        ctrl.save_pdf = function(){
            pdfMake.createPdf(ctrl.docDefinition).download(ctrl.name);
        };
        ctrl.print_pdf = function(){
            pdfMake.createPdf(ctrl.docDefinition).print();
        };

      },
      controllerAs: 'pdfgen'
    };
  });
