'use strict';

/**
 * @ngdoc service
 * @name poluxClienteApp.config.js
 * @description
 * # config.js
 * Service in the poluxClienteApp.
 */

 var conf_cloud = {

 };

 var conf_pruebas = {
    ACADEMICA_SERVICE: "http://jbpm.udistritaloas.edu.co:8280/services/academicaProxy",
    POLUX_SERVICE: "http://10.20.0.254/polux_api_crud/v1/",
    POLUX_MID_SERVICE: "http://10.20.0.254/polux_api_mid/v1/",
    CONFIGURACION_SERVICE: "http://10.20.0.254/configuracion_api/v1/",
    TOKEN: {
        AUTORIZATION_URL: "https://10.20.0.162:9443/oauth2/authorize",
        CLIENTE_ID: "bfPMflsiPVN6WFjJZIpzjsLdlx8a",
        REDIRECT_URL: "http://localhost:9000/",
        RESPONSE_TYPE: "id_token token",
        SCOPE: "openid email",
        BUTTON_CLASS: "btn btn-warning btn-sm",
        SIGN_OUT_URL: "https://10.20.0.162:9443/oidc/logout",
        SIGN_OUT_REDIRECT_URL: "http://localhost:9000/",
        SIGN_OUT_APPEND_TOKEN: "true"
    }
};

var conf_local = {
    ACADEMICA_SERVICE: "http://jbpm.udistritaloas.edu.co:8280/services/academicaProxy",
    POLUX_SERVICE: "http://localhost:8085/v1/",
    POLUX_MID_SERVICE: "http://localhost:8098/v1/",
    CONFIGURACION_SERVICE: "http://10.20.0.254/configuracion_api/v1/",
    TOKEN: {
      AUTORIZATION_URL: "https://10.20.0.162:9443/oauth2/authorize",
      CLIENTE_ID: "NCM5qVWim6MeTGB4Ag4lyLBOlv0a",
      REDIRECT_URL: "http://localhost:9000/",
      RESPONSE_TYPE: "id_token token",
      SCOPE: "openid email",
      BUTTON_CLASS: "btn btn-warning btn-sm",
      SIGN_OUT_URL: "https://10.20.0.162:9443/oidc/logout",
      SIGN_OUT_REDIRECT_URL: "http://localhost:9000/",
      SIGN_OUT_APPEND_TOKEN: "true"
    }
};

angular.module('poluxClienteApp')
  .constant('CONF', {
      GENERAL: conf_pruebas
  });
