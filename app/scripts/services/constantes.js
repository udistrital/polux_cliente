'use strict';

/**
 * @ngdoc service
 * @name poluxClienteApp.constantes
 * @description
 * # constantes
 * Constant in the poluxClienteApp.
 */
var HOST_NUXEO = "10.20.2.129:8080/nuxeo/";
angular.module('poluxClienteApp')
    .constant('constantes', {
        NUXEO_DOC: HOST_NUXEO + "nxfile/",
        NUXEO_LOGIN: HOST_NUXEO + "api/v1/automation/login",
        NUXEO_DOCUMENT: HOST_NUXEO + "api/v1/Document.Create",
        NUXEO_UPLOAD: HOST_NUXEO + "api/v1/upload"
    });