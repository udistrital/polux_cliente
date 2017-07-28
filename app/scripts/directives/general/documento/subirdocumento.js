'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:subirDocumento
 * @description
 * # subirDocumento
 */


angular.module('poluxClienteApp')
    .directive('subirDocumento', function() {
        return {
            restrict: 'E',
            // scope: {
            //   enlaceurl: '=',
            //   newdial: '&'
            // },
            templateUrl: 'views/directives/general/documento/subir-documento.html',
            controller: function(nuxeo, $scope) {
                var ctrl = this;
                nuxeo.connect().then(function(client) {
                    // OK, the returned client is connected
                    console.log('Client is connected: ' + client.connected);
                }, function(err) {
                    // cannot connect
                    console.log('Client is not connected: ' + err);
                });

                /* $("#fileupload2").fileinput({
                    language: 'es',
                    uploadUrl: 'http://10.20.2.129:8080/nuxeo/api/v1/',
                    uploadAsync: true,
                    maxFileCount: 5,
                    showBrowse: true,
                    browseOnZoneClick: true,
                    showAjaxErrorDetails: true,
                    elErrorContainer: '#errorBlock'
                });

                $('#fileupload2').on('fileuploaderror', function(event, data, previewId, index) {
                    var form = data.form,
                        files = data.files,
                        extra = data.extra,
                        response = data.response,
                        reader = data.reader;
                });

                $('#fileupload2').on('fileuploaded', function(event, data, previewId, index) {
                    console.log(data);
                    ctrl.archivo = data;
                });*/

                ctrl.subir_doc = function() {
                    console.log($scope.fileModel);
                    nuxeo.operation('Document.Create')
                        .params({
                            username: 'Administrator',
                            type: 'File',
                            name: ctrl.nombre,
                            properties: 'dc:title=My Folder \ndc:description=A Simple Folder'
                        })
                        .input('/')
                        .execute()
                        .then(function(doc) {
                            console.log('Created ' + doc.title + ' folder');
                        })
                        .catch(function(error) {
                            throw error;
                        });
                };

            },
            controllerAs: 'd_subirDocumento'
        };
    });