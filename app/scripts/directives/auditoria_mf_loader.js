'use strict';

angular.module('poluxClienteApp')
  .directive('auditoriaMfLoader', function (CONF, $location, $timeout) {
    return {
      restrict: 'E',
      link: function (scope, element) {
        var clienteId = CONF.GENERAL.TOKEN.CLIENTE_ID; // usar var en lugar de let

        window.__AUDITORIA_CLIENTE_ID__ = clienteId;

        if (!element[0].hasChildNodes() && window.auditoriaMf && window.auditoriaMf.mount) {
          window.auditoriaMf.mount({ domElement: element[0] });

          if ($location.path().indexOf('/auditoria') === 0) { // usar indexOf en vez de startsWith
            $timeout(function () {
              window.dispatchEvent(new CustomEvent('infoRoot', {
                detail: {
                  clienteId: clienteId,
                  appName: '@udistrital/auditoria-mf'
                }
              }));
            }, 2000);
          }
        }
      }
    };
  });
