'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:formato/vistaPreviaFormato
 * @description
 * # formato/vistaPreviaFormato
 */
angular.module('poluxClienteApp')
  .directive('vistaPreviaFormato', function() {
    return {
      restrict: 'E',
      scope: {
        formato: '='
      },
      link: function(scope, elm, attr) {
        scope.$watch('formato', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            scope.refresh_format_view(newValue);
          }
        }, true);
      },
      templateUrl: 'views/directives/formato/vista_previa_formato.html',
      controller: function(poluxRequest, $scope) {
        var ctrl = this;

        $scope.formato_vista = {};
        $scope.refresh_format_view = function(id) {
          $scope.respuestas_vista = [];
          poluxRequest.get("tr_formato/" + id, '')
            .then(function(response) {
              $scope.formato_vista = response.data;
            });
        };
        $scope.pdfgen_all = {
          name: "Formato Evaluación",
          pdfgen: {
            content: [{
                text: ['UNIVERSIDAD DISTRITAL FRANCISCO JOSÉ DE CALDAS\n',
                  'Formato de Evaluación \n\n'
                ],
                style: 'header',
                alignment: 'center'
              }, {
                text: "Introducción \n\n",
                style: 'subheader',
                alignment: 'center'
              }, {
                text: "\n1. Pregunta Abierta\n\n",
                style: 'subheader',
                alignment: 'justify'
              }, {
                text: ["_______________________________________________________________________________________________\n",
                  "_______________________________________________________________________________________________\n"
                ],
                alignment: 'center'
              }, {
                text: '\n2. Pregunta Cerrada \n',
                style: 'subheader'
              },
              {
                type: 'circle',
                ul: [
                  'item 1',
                  'item 2',
                  'item 3'
                ]
              }, {
                text: "\n3. Pregunta Numérica \n",
                style: 'subheader',
                alignment: 'justify'
              },
              {
                text: "_______________________________________________________________________________________________\n",
                alignment: 'center'
              }
            ]
          },
        };
      },
      controllerAs: 'vistaPrevia'
    };
  });
