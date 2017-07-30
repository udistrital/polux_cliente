'use strict';

/**
 * @ngdoc service
 * @name poluxClienteApp.nuxeo
 * @description
 * # nuxeo
 * Service in the poluxClienteApp.
 */
var nuxeo = new Nuxeo({
    baseURL: 'http://10.20.2.129:8080/nuxeo/',
    auth: {
        method: 'basic',
        username: 'Administrator',
        password: 'Administrator'
    }
});
angular.module('poluxClienteApp')
    .service('nuxeo', function($q) {
        Nuxeo.promiseLibrary($q);
        return nuxeo;
    });