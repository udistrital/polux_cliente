'use strict';

/**
     * @ngdoc service
     * @name poluxClienteApp.service:nuxeoService
     * @requires $q
     * @requires CONF
     * @param {injector} $q componente para promesas de angular
     * @param {injector} CONF compenente de configuración
     * @description
     * # nuxeo
     * Fabrica sobre la cual se consumen los servicios proveidos por el API de nuxeo
     */
angular.module('poluxClienteApp')
    .service('nuxeo', function($q,CONF) {
        Nuxeo.promiseLibrary($q);
        return new Nuxeo({
            baseURL: CONF.GENERAL.NUXEO_SERVICE,
            auth: {
                method: 'basic',
                username: 'desarrollooas',
                password: 'desarrollooas2019'
            }
        });
    });
