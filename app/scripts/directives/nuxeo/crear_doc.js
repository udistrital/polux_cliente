'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:nuxeo/crearDoc
 * @description
 * # nuxeo/crearDoc
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

            controller: function($scope, nuxeo, $q) {
                var ctrl = this;
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