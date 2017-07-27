'use strict';

/**
 * @ngdoc service
 * @name poluxClienteApp.nuxeo
 * @description
 * # nuxeo
 * Service in the poluxClienteApp.
 */
angular.module('poluxClienteApp')
    .service('nuxeo', function() {
        return new Nuxeo({
            baseURL: 'http://localhost:8080/nuxeo/',
            auth: {
                method: 'basic',
                username: 'Administrator',
                password: 'Administrator'
            }
        });
    });