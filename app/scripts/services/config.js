'use strict';

/**
 * @ngdoc property
 * @name poluxClienteApp.service:CONF.conf_cloud
 * @propertyOf poluxClienteApp.service:CONF
 * @description
 * Variables de configuración de la nube
 */
 var conf_cloud = {

 };

 /**
 * @ngdoc property
 * @name poluxClienteApp.service:CONF.conf_pruebas
 * @propertyOf poluxClienteApp.service:CONF
 * @description
 * Variables de configuración de entorno de pruebas
 */
 var conf_pruebas = {
    ACADEMICA_SERVICE: "http://jbpm.udistritaloas.edu.co:8280/services/academicaProxy",
    POLUX_SERVICE: "http://10.20.0.254/polux_api_crud/v1/",
    POLUX_MID_SERVICE: "http://10.20.0.254/polux_api_mid/v1/",
    CONFIGURACION_SERVICE: "http://10.20.0.254/configuracion_api/v1/",
    NUXEO_SERVICE:"https://documental.udistrital.edu.co/nuxeo/",
    CORE_SERVICE:"http://10.20.0.254/core_api/v1/",
    OIKOS_SERVICE:"http://10.20.0.254/oikos_api/v1/",
    SESIONES_SERVICE:"http://localhost:8081/v1/",
    TOKEN: {
        AUTORIZATION_URL: "https://autenticacion.udistrital.edu.co/oauth2/authorize",
        URL_USER_INFO: "https://autenticacion.udistrital.edu.co/oauth2/userinfo",
        CLIENTE_ID: "pszmROXqfec4pTShgF_fn2DAAX0a",
        REDIRECT_URL: "http://10.20.0.254/polux",
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

 /**
 * @ngdoc property
 * @name poluxClienteApp.service:CONF.conf_local
 * @propertyOf poluxClienteApp.service:CONF
 * @description
 * Variables de configuración de entorno local
 */
var conf_local = {
    ACADEMICA_SERVICE: "http://jbpm.udistritaloas.edu.co:8280/services/academicaProxy",
    POLUX_SERVICE: "http://localhost:8085/v1/",
    POLUX_MID_SERVICE: "http://localhost:8098/v1/",
    CONFIGURACION_SERVICE: "http://10.20.0.254/configuracion_api/v1/",
    NUXEO_SERVICE:"https://documental.udistrital.edu.co/nuxeo/",
    CORE_SERVICE:"http://10.20.0.254/core_api/v1/",
    OIKOS_SERVICE:"http://10.20.0.254/oikos_api/v1/",
    SESIONES_SERVICE:"http://localhost:8081/v1/",
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

/**
 * @ngdoc service
 * @name poluxClienteApp.service:CONF
 * @description
 * Constante que retorna las direcciones en el servicio
 */
angular.module('poluxClienteApp')
    .constant('CONF', {
        GENERAL: conf_local
    });
