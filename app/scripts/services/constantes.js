'use strict';

/**
 * @ngdoc service
 * @name poluxClienteApp.constantes
 * @description
 * # constantes
 * Constant in the poluxClienteApp.
 */
var HOST_NUXEO = "10.20.2.129:8080/nuxeo/api/v1/";
angular.module('poluxClienteApp')
    .constant('constantes', {
        NUXEO_LOGIN: HOST_NUXEO + "automation/login",
        NUXEO_DOCUMENT: HOST_NUXEO + "Document.Create",
        NUXEO_UPLOAD: HOST_NUXEO + "upload"
    });