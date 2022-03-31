"use strict";


/**
 * @ngdoc service
 * @name poluxClienteApp.config
 * @description
 * # config
 * Constant in the poluxClienteApp.
 */

angular.module("poluxClienteApp").constant("CONF", {
  APP: "poluxClienteApp", // Nombre de la app, esto cargará el logo.
  APP_MENU: "Polux", // Ingrese valor de la aplicación asociado al menú registrado en wso2
  GENERAL: {
    ACADEMICA_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/academica_jbpm/v1",
    POLUX_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/polux_crud/v1/",
    POLUX_MID_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/polux_mid/v1/",
    SESIONES_SERVICE:"https://autenticacion.portaloas.udistrital.edu.co/apioas/sesiones_crud/v2/",
    CONFIGURACION_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/configuracion_crud_api/v1/",
    NUXEO_SERVICE:"https://documental.udistrital.edu.co/nuxeo/",
    CORE_SERVICE:"https://autenticacion.portaloas.udistrital.edu.co/apioas/core_api/v1/",
    CORE_AMAZON_CRUD_SERVICE:"https://autenticacion.portaloas.udistrital.edu.co/apioas/core_amazon_crud/v1/",
    OIKOS_SERVICE:"https://autenticacion.portaloas.udistrital.edu.co/apioas/oikos_crud_api/v2/",
    DOCUMENTO_CRUD_SERVICE:"https://autenticacion.portaloas.udistrital.edu.co/apioas/documento_crud/v2/",
    GESTION_DOCUMENTAL_SERVICE:" https://autenticacion.portaloas.udistrital.edu.co/apioas/gestor_documental_mid/v1",
    AUTENTICATION_MID_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/autenticacion_mid/v1/",
    NOTIFICACION_WS:
      "https://autenticacion.portaloas.udistrital.edu.co/apioas/notificacion_mid/v1/",
    ARM_AWS_NOTIFICACIONES:"arn:aws:sns:us-east-1:699001025740:production-Cumplidos",
    TOKEN: {
        AUTORIZATION_URL: "https://autenticacion.portaloas.udistrital.edu.co/oauth2/authorize",
        URL_USER_INFO: "https://autenticacion.portaloas.udistrital.edu.co/oauth2/userinfo",
        CLIENTE_ID: "gGPLCpLkFUfTXAciOLJyTwJfviUa",
        REDIRECT_URL: "https://polux.portaloas.udistrital.edu.co",
        RESPONSE_TYPE: "id_token token",
        SCOPE: "openid email documento",
        BUTTON_CLASS: "btn btn-warning btn-sm",
        SIGN_OUT_URL: "https://autenticacion.portaloas.udistrital.edu.co/oidc/logout",
        SIGN_OUT_REDIRECT_URL: "https://polux.portaloas.udistrital.edu.co",
        SIGN_OUT_APPEND_TOKEN: "true",
    },
    AUTENTICATION_MID_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/autenticacion_mid/v1/",
    AUTENTICACION_MID : 'https://autenticacion.portaloas.udistrital.edu.co/apioas/autenticacion_mid/v1/token/userRol' ,
    LOGOUT_REDIRECT : "https://pruebascatalogo.portaloas.udistrital.edu.co"
  }
});