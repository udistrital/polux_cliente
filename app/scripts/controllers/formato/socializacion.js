'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:SocializacionCtrl
 * @description
 * # SocializacionCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
    .controller('SocializacionCtrl', function(poluxRequest, oikosRequest) {
        var ctrl = this;
        ctrl.get_trabajos_grado = function() {
            poluxRequest.get("trabajo_grado", $.param({
                limit: "-1"
            })).then(function(response) {
                ctrl.trabajos_grado = response.data;
            });
        };
        ctrl.get_lugares = function() {
            oikosRequest.get("espacio_fisico", $.param({
                limit: "-1"
            })).then(function(response) {
                ctrl.lugares = response.data;
            });
        };
        ctrl.get_trabajos_grado();
        ctrl.get_lugares();
    });