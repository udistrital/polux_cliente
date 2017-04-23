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
          if (newValue !== oldValue) {
            scope.refresh_format_view(newValue);
          }
        }, true);
      },
      templateUrl: 'views/pdfgen.html',
      controller: function() {
        var ctrl = this;
        var docDefinition = { content: 'This is an sample PDF printed with pdfMake' };
        ctrl.view_pdf = function(){
            pdfMake.createPdf(docDefinition).open();
        };
        ctrl.save_pdf = function(){
            pdfMake.createPdf(docDefinition).download('name.pdf');
        };
        ctrl.print_pdf = function(){
            pdfMake.createPdf(docDefinition).print();
        };

      },
      controllerAs: 'pdfgen'
    };
  });
