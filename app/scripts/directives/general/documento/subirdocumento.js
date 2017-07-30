'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:subirDocumento
 * @description
 * # subirDocumento
 */


angular.module('poluxClienteApp')
    .directive('subirDocumento', function ($q) {
        return {
            restrict: 'E',
            scope: {
                titulo: '=',
                descripcion: '=',
                enlace: '='
            },
            templateUrl: 'views/directives/general/documento/subir-documento.html',
            controller: function (nuxeo, $scope) {
                var ctrl = this;
                ctrl.msg = null;

                nuxeo.connect().then(function (client) {
                    // OK, the returned client is connected
                    console.log('Client is connected: ' + client.connected);
                }, function (err) {
                    // cannot connect
                    console.log('Client is not connected: ' + err);
                });

                ctrl.construir_propuesta = function () {
                    nuxeo.operation('Document.Create')
                        .params({
                            type: 'File',
                            name: ctrl.titulo,
                            properties: 'dc:title=' + ctrl.titulo + ' \ndc:description=' + ctrl.resumen
                        })
                        .input('/default-domain/workspaces/Proyectos')
                        .execute()
                        .then(function (doc) {
                            console.log(doc);
                            var nuxeoBlob = new Nuxeo.Blob({ content: $scope.fileModel });
                            console.log(nuxeoBlob);
                            nuxeo.batchUpload()
                                .upload(nuxeoBlob)
                                .then(function (res) {
                                    return nuxeo.operation('Blob.AttachOnDocument')
                                        .param('document', doc.uid)
                                        .input(res.blob)
                                        .execute();
                                })
                                .then(function () {
                                    return nuxeo.repository().fetch(doc.uid, { schemas: ['dublincore', 'file'] });
                                })
                                .then(function (doc) {
                                    console.log(doc.get('file:content'));
                                    $scope.enlace = doc.repository + '/' + doc.uid + '/' +'file:content' + '/' + doc.get('file:content').name;
                                    $scope.titulo = doc.get('dc:title');
                                    $scope.descripcion = doc.get('dc:description');
                                    console.log($scope.enlace);
                                    console.log($scope.titulo);
                                    console.log($scope.descripcion);
                                })
                                .catch(function (error) {
                                    throw error;
                                });
                        })
                        .catch(function (error) {
                            throw error;
                        });
                };
                ctrl.subir_archivo = function (uid) {
                    var nuxeoBlob = new Nuxeo.Blob({ content: $scope.fileModel });
                    console.log(nuxeoBlob);
                    nuxeo.batchUpload()
                        .upload(nuxeoBlob)
                        .then(function (res) {
                            return nuxeo.operation('Blob.AttachOnDocument')
                                .param('document', uid)
                                .input(res.blob)
                                .execute();
                        })
                        .then(function () {
                            return nuxeo.repository().fetch(uid, { schemas: ['dublincore', 'file'] });
                        })
                        .then(function (doc) {
                            console.log(doc.get('file:content'));
                        })
                        .catch(function (error) {
                            throw error;
                        });
                };
                /**
                 * @ngdoc method
                 * @name limpiar
                 * @methodOf poluxClienteApp.registrarPropuesta
                 * @description
                 * Limpia el formulario basico mediante un evento click
                 */

                ctrl.limpiar = function () {
                    ctrl.titulo = angular.copy("");
                    ctrl.resumen = angular.copy("");
                    ctrl.nuevaArea = [];
                };
            },
            controllerAs: 'd_subirDocumento'
        };
    });