'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:NotificacionesCtrl
 * @description
 * # NotificacionesCtrl
 * Controller of the poluxClienteApp.
 * Controlador de la opción de notificaciones. Actualmente no se utiliza.
 */
angular.module('poluxClienteApp')
  .controller('NotificacionesCtrl', function($scope, notificacion) {
    $scope.imagePath = 'images/yeoman.png';
    $scope.notificacion = notificacion;
  });
