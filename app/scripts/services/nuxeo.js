'use strict';

/**
 * @ngdoc service
 * @name poluxClienteApp.nuxeo
 * @description
 * # nuxeo
 * Service in the poluxClienteApp.
 */
angular.module('poluxClienteApp')
    .service('nuxeo', function($q) {
        Nuxeo.promiseLibrary($q);
        return new Nuxeo({

            baseURL: 'http://athento.udistritaloas.edu.co:8080/nuxeo/',
            auth: {
                method: 'basic',
                username: 'Administrator',
                password: 'S1st3m4s04S=Fr331P4'
            }
        });
    });
