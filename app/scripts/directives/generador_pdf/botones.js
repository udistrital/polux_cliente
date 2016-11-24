'use strict';

/**
 * @ngdoc directive
 * @name poluxApp.directive:vistaPreviaEvaluacion
 * @description
 * # vistaPreviaEvaluacion
 */
angular.module('poluxApp')
.directive('gePdf', function () {

    return {
        templateUrl: "views/directives/generador_pdf/botones.html",
        restrict: 'E',
        scope : {
          datos:'@',
          archivo:'@'
        },
        controller: function ($scope) {
            $scope.imprimir = function () {
                console.log(datos);
                console.log(nombre_archivo);
                pdfMake.createPdf(datos).print(nombre_archivo);
            },
            $scope.ver      = function () {
                console.log('ver');
                pdfMake.createPdf(datos).open(nombre_archivo);
            },
            $scope.guardar  = function () {
                console.log('guardar');
                pdfMake.createPdf(datos).download(nombre_archivo);
            }
        },
        controllerAs: "generadorCtrl"
    };
});
