'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:subirDocumento
 * @description
 * # subirDocumento
 */


angular.module('poluxClienteApp')
    .directive('subirDocumento', function($q) {
        return {
            restrict: 'E',
            // scope: {
            //   enlaceurl: '=',
            //   newdial: '&'
            // },
            templateUrl: 'views/directives/general/documento/subir-documento.html',
            controller: function(nuxeo, $scope) {
                var ctrl = this;
                ctrl.msg = null;
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
                ctrl.subir_doc_2 = function() {

                    var nuxeoBlob = new Nuxeo.Blob({ content: $scope.fileModel });
                    console.log(nuxeoBlob);
                    nuxeo.batchUpload()
                        .upload(nuxeoBlob)
                        .then(function(res) {
                            return nuxeo.operation('Blob.AttachOnDocument')
                                .param('document', '33f68e5b-014c-4e7b-aa5a-0332e3f6402b')
                                .input(res.blob)
                                .execute();
                        })
                        .then(function() {
                            return nuxeo.repository().fetch('33f68e5b-014c-4e7b-aa5a-0332e3f6402b', { schemas: ['dublincore', 'file'] });
                        })
                        .then(function(doc) {
                            console.log(doc.get('file:content'));
                        })
                        .catch(function(error) {
                            throw error;
                        });

                    $q.when(nuxeo.request('/http://10.20.2.129:8080/nuxeo/api/v1/upload/').get()).then(function(res) {
                        $scope.res = res;
                    });
                    /*nuxeo.operation('Document.Create')
                        .params({
                            username: 'Administrator',
                            type: 'File',
                            name: $scope.fileModel.name,
                            File: $scope.fileModel,
                            properties: 'dc:title=' + $scope.fileModel.name + '\ndc:description=A Simple Folder'
                        })
                        .input('/')
                        .execute()
                        .then(function(doc) {
                            console.log('Created ' + doc.title + ' folder');
                        })
                        .catch(function(error) {
                            throw error;
                        });*/
                };
                ctrl.subir_doc = function() {
                    console.log($scope.fileModel);
                    var nuxeoBlob = new Nuxeo.Blob({ content: $scope.fileModel });
                    console.log(nuxeoBlob);
                    nuxeo.batchUpload()
                        .upload(nuxeoBlob)
                        .then(function(res) {
                            // res.blob instanceof Nuxeo.BatchBlob
                            console.log(res.blob);
                        })
                        .catch(function(error) {
                            throw error;
                        });
                    /*nuxeo.operation('Document.Create')
                        .params({
                            username: 'Administrator',
                            type: 'File',
                            name: $scope.fileModel.name,
                            File: $scope.fileModel,
                            properties: 'dc:title=' + $scope.fileModel.name + '\ndc:description=A Simple Folder'
                        })
                        .input('/')
                        .execute()
                        .then(function(doc) {
                            console.log('Created ' + doc.title + ' folder');
                        })
                        .catch(function(error) {
                            throw error;
                        });*/
                };

            },
            controllerAs: 'd_subirDocumento'
        };
    });