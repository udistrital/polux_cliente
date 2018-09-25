'use strict';
/**
 * @ngdoc service
 * @name poluxClienteApp.service:notificacionService
 * @requires $websocket
 * @param {injector} $websocket componente websocket de angular
 * @description
 * # notificacionService
 * Fabrica sobre la cual se consumen los servicios de notificacion
 */
angular.module('poluxClienteApp')
  .factory('notificacion', function($websocket) {
    var dataStream = $websocket(); // $websocket("ws://localhost:8080/register?id=2&profile=admin");
    var log = [];
    dataStream.onMessage(function(message) {
      log.unshift(JSON.parse(message.data));
    });

    var methods = {
      id : -1,
      log: log,
      get: function() {
        dataStream.send(JSON.stringify({
          action: 'get'
        }));
      },
      no_vistos: function() {
        var j = 0;
        angular.forEach(methods.log, function(notificiacion) {
          if (!notificiacion.viewed) {
            j += 1;
          }
        });
        return j;
    }

    };
    return methods;
  });
