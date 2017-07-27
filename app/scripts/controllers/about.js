'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
    .controller('AboutCtrl', function(nuxeo, $scope) {
        var ctrl = this;


        ctrl.nuxeo = nuxeo;
        nuxeo.connect().then(function(client) {
            // OK, the returned client is connected
            console.log('Client is connected: ' + client.connected);
        }, function(err) {
            // cannot connect
            console.log('Client is not connected: ' + err);
        });

        nuxeo.operation('Document.')
            .input('5ab59292-0c0e-4326-ba62-3f81eae24aac')
            .execute()
            .then(function(docs) {
                console.log(docs);
            })
            .catch(function(error) {
                // something went wrong
                throw error;
            });


    });