'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:pdfGen
 * @description
 * # pdfGen
 * Directiva que permite manipular pdfMake.
 * Controlador: {@link poluxClienteApp.directive:pdfGen.controller:pdfGenCtrl pdfGenCtrl}
 * @param {Object} pdfjson Json de las propiedades del pdf que se va a generar, también tiene el contenido del pdf.
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
      /**
       * @ngdoc controller
       * @name poluxClienteApp.directive:pdfGen.controller:pdfGenCtrl
       * @description
       * # pdfGenCtrl
       * # Controller of the poluxClienteApp.directive:pdfGen
       * Controlador de la directiva {@link poluxClienteApp.directive:pdfGen pdfGen}.
       * @requires $scope
       * @property {string} name Nombre del documento que se manipula.
       * @property {Object} docDefinition Definición de configuración del pdf para liberia pdfMake.
       */
      controller: function($scope) {
        var ctrl = this;
        ctrl.name = $scope.pdfjson.name;
        ctrl.docDefinition = $scope.pdfjson.pdfgen;
        /**
         * @ngdoc method
         * @name refresh_format_view
         * @methodOf poluxClienteApp.directive:pdfGen.controller:pdfGenCtrl
         * @param {Object} pdfjson configuraciones del pdf que se muestra y manipula.
         * @returns {undefined} No retorna ningún valor.
         * @description 
         * Permite refrescar la vista del pdf que se esta visualizando.
         */
        $scope.refresh_format_view = function(pdfjson){
            ctrl.name = pdfjson.name;
            ctrl.docDefinition = pdfjson.pdfgen;
        };

        /**
         * @ngdoc method
         * @name pdfGen
         * @methodOf poluxClienteApp.directive:pdfGen.controller:pdfGenCtrl
         * @param {undefined} undefined No recibe parametros
         * @returns {undefined} No retorna ningún valor.
         * @description 
         * Permite crear un pdf y mostrarlo.
         */
        ctrl.view_pdf = function(){
            pdfMake.createPdf(ctrl.docDefinition).open();
        };

         /**
         * @ngdoc method
         * @name pdfGen
         * @methodOf poluxClienteApp.directive:pdfGen.controller:pdfGenCtrl
         * @param {undefined} undefined No recibe parametros
         * @returns {undefined} No retorna ningún valor.
         * @description 
         * Permite crear un pdf y descargar lo.
         */
        ctrl.save_pdf = function(){
            pdfMake.createPdf(ctrl.docDefinition).download(ctrl.name);
        };

         /**
         * @ngdoc method
         * @name pdfGen
         * @methodOf poluxClienteApp.directive:pdfGen.controller:pdfGenCtrl
         * @param {undefined} undefined No recibe parametros
         * @returns {undefined} No retorna ningún valor.
         * @description 
         * Permite crear un pdf e imprimir lo.
         */
        ctrl.print_pdf = function(){
            pdfMake.createPdf(ctrl.docDefinition).print();
        };

      },
      controllerAs: 'pdfgen'
    };
  });
