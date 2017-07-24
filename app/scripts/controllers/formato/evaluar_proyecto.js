'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:EvaluarProyectoCtrl
 * @description
 * # EvaluarProyectoCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
    .controller('EvaluarProyectoCtrl', function($scope, poluxRequest) {
        var ctrl = this;
        ctrl.formato = [];
        ctrl.get_all_format = function() {
            poluxRequest.get("formato", $.param({

                limit: "0"
            })).then(function(response) {
                ctrl.formatos = response.data;
                console.log(ctrl.formatos);
            });
        };
        ctrl.get_all_format();
    });