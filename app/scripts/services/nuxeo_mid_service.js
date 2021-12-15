'use strict';

/**
 * @ngdoc service
 * @name poluxClienteApp.nuxeoMidRequest
 * @description
 * # nuxeoMidService
 * Factory in the contractualClienteApp.
 */
angular.module('nuxeoMidService', [])
    .factory('nuxeoMidRequest', function($http, $q, token_service, CONF) {
        // Service logic
        // ...
        var path = CONF.GENERAL.NUXEO_MID;
        // Public API here
        var cancelSearch; //defer object

        return {
            get: function(tabla, params) {
                cancelSearch = $q.defer(); //create new defer for new request
                if(angular.isUndefined(params)){
                    return $http.get(path + tabla, token_service.getHeader());
                }else{
                    return $http.get(path + tabla + "?" + params,  token_service.getHeader());
                }
            },
            post: function(tabla, elemento) {
                return $http.post(path + tabla, elemento, token_service.getHeader());
            },
            put: function(tabla, id, elemento) {
                return $http.put(path + tabla + "/" + id, elemento, token_service.getHeader());
            },
            delete: function(tabla, id) {
                return $http.delete(path + tabla + "/" + id, token_service.getHeader());
            },
            cancel: function() {
                return cancelSearch.resolve('search aborted');
            }
        };
    });