'use strict';

/**
 * @ngdoc service
 * @name poluxClienteApp.constantes
 * @description
 * # constantes
 * Constant in the poluxClienteApp.
 */
var HOST_NUXEO = "https://athento.udistritaloas.edu.co/nuxeo/";
angular.module('poluxClienteApp')
    .constant('constantes', {
        NUXEO_DOC: HOST_NUXEO + "nxfile/",
        NUXEO_LOGIN: HOST_NUXEO + "api/v1/automation/login",
        NUXEO_DOCUMENT: HOST_NUXEO + "api/v1/Document.Create",
        NUXEO_UPLOAD: HOST_NUXEO + "api/v1/upload",
        DOWNLOAD_FILE: "https://athento.udistritaloas.edu.co/nuxeo/"
    });
