/*
'use strict';

angular.module('poluxClienteApp')
  .directive('auditoriaMfLoader', function (CONF, $location, $timeout) {
    return {
      restrict: 'E',
      link: function (scope, element) {
        let clienteId = CONF.GENERAL.TOKEN.CLIENTE_ID;

        window.__AUDITORIA_CLIENTE_ID__ = clienteId;

        if (!element[0].hasChildNodes() && window.auditoriaMf?.mount) {
          window.auditoriaMf.mount({ domElement: element[0] });

          if ($location.path().startsWith('/auditoria')) {
            $timeout(function () {
              window.dispatchEvent(new CustomEvent('infoRoot', {
                detail: {
                  clienteId,
                  appName: '@udistrital/auditoria-mf'
                }
              }));
            }, 2000); 
          }
        } else {

        }
      }
    };
  });
*/

'use strict';

angular.module('poluxClienteApp')
  .directive('auditoriaMfLoader', function (CONF, $location, $timeout) {
    return {
      restrict: 'E',
      link: function (scope, element) {
        var clienteId = CONF.GENERAL.TOKEN.CLIENTE_ID;

        window.__AUDITORIA_CLIENTE_ID__ = clienteId;

        if (!element[0].hasChildNodes() && window.auditoriaMf && window.auditoriaMf.mount) {
          window.auditoriaMf.mount({ domElement: element[0] });

          if ($location.path().indexOf('/auditoria') === 0) {
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
