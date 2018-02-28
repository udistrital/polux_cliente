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
    NUXEO_SERVICE:"https://athento.udistritaloas.edu.co/nuxeo/",
    CORE_SERVICE:"http://10.20.0.254/core_api/v1/",
    OIKOS_SERVICE:"http://10.20.0.254/oikos_api/v1/",
    TOKEN: {
        AUTORIZATION_URL: "https://autenticacion.udistrital.edu.co/oauth2/authorize",
        URL_USER_INFO: "https://autenticacion.udistrital.edu.co/oauth2/userinfo",
        CLIENTE_ID: "pszmROXqfec4pTShgF_fn2DAAX0a",
        REDIRECT_URL: "http://localhost:9000/",
        RESPONSE_TYPE: "code",
        SCOPE: "openid email",
        BUTTON_CLASS: "btn btn-warning btn-sm",
        SIGN_OUT_URL: "https://autenticacion.udistrital.edu.co/oidc/logout",
        SIGN_OUT_REDIRECT_URL: "http://localhost:9000/",
        SIGN_OUT_APPEND_TOKEN: "true",
        REFRESH_TOKEN: "https://autenticacion.udistrital.edu.co/oauth2/token",
        CLIENT_SECRET: "2crHq2IRkFHEVTBfpznLhKHyKVIa"
    },
};

var conf_local = {
    ACADEMICA_SERVICE: "http://jbpm.udistritaloas.edu.co:8280/services/academicaProxy",
    POLUX_SERVICE: "http://localhost:8085/v1/",
    POLUX_MID_SERVICE: "http://localhost:8098/v1/",
    CONFIGURACION_SERVICE: "http://10.20.0.254/configuracion_api/v1/",
    NUXEO_SERVICE:"https://athento.udistritaloas.edu.co/nuxeo/",
    CORE_SERVICE:"http://10.20.0.254/core_api/v1/",
    OIKOS_SERVICE:"http://10.20.0.254/oikos_api/v1/",
    TOKEN: {
        AUTORIZATION_URL: "https://autenticacion.udistrital.edu.co/oauth2/authorize",
        URL_USER_INFO: "https://autenticacion.udistrital.edu.co/oauth2/userinfo",
        CLIENTE_ID: "pszmROXqfec4pTShgF_fn2DAAX0a",
        REDIRECT_URL: "http://localhost:9000/",
        RESPONSE_TYPE: "code",
        SCOPE: "openid email",
        BUTTON_CLASS: "btn btn-warning btn-sm",
        SIGN_OUT_URL: "https://autenticacion.udistrital.edu.co/oidc/logout",
        SIGN_OUT_REDIRECT_URL: "http://localhost:9000/",
        SIGN_OUT_APPEND_TOKEN: "true",
        REFRESH_TOKEN: "https://autenticacion.udistrital.edu.co/oauth2/token",
        CLIENT_SECRET: "2crHq2IRkFHEVTBfpznLhKHyKVIa"
    },
};

angular.module('poluxClienteApp')
  .constant('CONF', {
      GENERAL: conf_pruebas
  });
