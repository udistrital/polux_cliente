'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:EvaluarProyectoCtrl
 * @description
 * # EvaluarProyectoCtrl
 * Controller of the poluxClienteApp
 * Controlador que permite evaluar un proyecto de trabajo de grado, este controlador no se utiliza debido a que se 
 * hace esta función con ayuda del modulo de revisiones por parte de director, evaluadores y estudiantes.
 * @requires services/poluxService.service:poluxRequest
 */
angular.module('poluxClienteApp')
    .controller('EvaluarProyectoCtrl', function ($scope, poluxRequest) {
        var ctrl = this;
        ctrl.formato = [];
        ctrl.get_all_format = function () {
            poluxRequest.get("formato", $.param({
                limit: "0"
            })).then(function (response) {
                ctrl.formatos = response.data;
                console.log(ctrl.formatos);
            });
        };
        ctrl.get_all_format();
    });