'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:subirDocumento
 * @description
 * # subirDocumento
 * Directiva que permite cargar un documento al gestor documental.
 * Actualmente no se utiliza.
 * Controlador: {@link poluxClienteApp.directive:subirDocumento.controller:subirDocumentoCtrl subirDocumentoCtrl}
 * @param {string} titulo Titulo del documento que se va a cargar
 * @param {string} descripcion Descripción del documento que se va a cargar.
 * @param {string} enlace Enlace del documento cargado.
 */
angular.module('poluxClienteApp')
    .directive('subirDocumento', function ($q) {
        return {
            restrict: 'E',
            scope: {
                titulo: '=',
                descripcion: '=',
                enlace: '='
            },
            templateUrl: 'views/directives/general/documento/subir-documento.html',
            /**
             * @ngdoc controller
             * @name poluxClienteApp.directive:subirDocumento.controller:subirDocumentoCtrl
             * @description
             * # subirDocumentoCtrl
             * # Controller of the poluxClienteApp.directive:subirDocumento
             * Controlador de la directiva {@link poluxClienteApp.directive:subirDocumento subirDocumento}.
             * @requires services/poluxService.service:poluxRequest
             * @requires $scope
             * @requires $http
             * @property {Object} fileModel Model del archivo que se cargará.
             */
            controller: function ($scope, $http) {
                var ctrl = this;
                ctrl.msg = null;

                /**
                 * @ngdoc method
                 * @name limpiar
                 * @methodOf poluxClienteApp.directive:subirDocumento.controller:subirDocumentoCtrl
                 * @param {undefined} undefined No recibe parametros
                 * @returns {undefined} No retorna ningún valor.
                 * @description 
                 * Permite limpiar los valores con los que se sube el documento.
                 */
                ctrl.limpiar = function () {
                    ctrl.titulo = angular.copy("");
                    ctrl.resumen = angular.copy("");
                    ctrl.nuevaArea = [];
                };
            },
            controllerAs: 'd_subirDocumento'
        };
    });
