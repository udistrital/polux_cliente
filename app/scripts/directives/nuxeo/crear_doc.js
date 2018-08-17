'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:crearDoc
 * @description
 * # crearDoc
 * Directiva que permite crear un documento.
 * Actualmente no se utiliza.
 * Controlador: {@link poluxClienteApp.directive:crearDoc.controller:crearDocCtrl crearDocCtrl}
 * @param {string} titulo titulo del documento que se va a crear.
 * @param {string} resumen Resumen del documento que se va a crear.
 * @param {object} tipo Tipo de documento que se va a crear.
 * @param {string} ubicacion Nombre del workspace donde se guardará el documento.
 * @param {string} path Path del documento cuando se cargo.
 */
angular.module('poluxClienteApp')
    .directive('nuxeo/crearDoc', function() {
        return {
            restrict: 'E',
            scope: {
                titulo: '=?',
                resumen: '=?',
                tipo: '=?',
                ubicacion: '=?',
                path: '=?'
            },
            /**
             * @ngdoc controller
             * @name poluxClienteApp.directive:crearDoc.controller:crearDocCtrl
             * @description
             * # crearDocCtrl
             * # Controller of the poluxClienteApp.directive:crearDoc
             * Controlador de la directiva {@link poluxClienteApp.directive:crearDoc crearDoc}.
             * @requires $scope
             * @requires $q
             * @requires services/poluxClienteApp.service:nuxeoService
             * @property {string} titulo titulo del documento que se va a crear.
             * @property {string} resumen Resumen del documento que se va a crear.
             * @property {object} tipo Tipo de documento que se va a crear.
             * @property {string} ubicacion Nombre del workspace donde se guardará el documento.
             * @property {string} path Path del documento cuando se cargo.
             */
            controller: function($scope, nuxeo, $q) {
                var ctrl = this;
                /**
                 * @ngdoc method
                 * @name watchSol
                 * @methodOf poluxClienteApp.directive:crearDoc.controller:crearDocCtrl
                 * @param {undefined} undefined No recibe parametros
                 * @returns {undefined} No retorna ningún valor.
                 * @description 
                 * Vigila los cambios del objeto sol y los carga en el controlador.
                 */
                $scope.$watch('sol', function() {
                    ctrl.path = $scope.path;
                    ctrl.titulo = $scope.titulo;
                    ctrl.resumen = $scope.resumen;
                    ctrl.tipo = $scope.tipo;
                    ctrl.ubicacion = $scope.ubicacion;
                });
                $q.when(nuxeo.request('/path/').get()).then(function(res) {
                    $scope.res = res;
                });

            },
            controllerAs: 'd_nuxeo'
        };
    });