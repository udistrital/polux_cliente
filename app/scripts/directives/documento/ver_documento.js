'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:verDocumento
 * @description
 * # verDocumento
 * Directiva que permite cargar un documento al gestor documental.
 * Controlador: {@link poluxClienteApp.directive:verDocumento.controller:verDocumentoCtrl verDocumentoCtrl}
 * @param {boolean} minified Booleano que indica si el documento esta minimizado.
 * @param {object} documento Documento que se va a mostrar
 */
angular.module('poluxClienteApp')
    .directive('verDocumento', function (poluxRequest,utils,gestorDocumentalMidRequest, $q, $sce, $translate) {
        return {
            restrict: "E",
            scope: {
                documento: '=?',
                minified: '=?',
            },
            templateUrl: "views/directives/documento/ver_documento.html",
            /**
             * @ngdoc controller
             * @name poluxClienteApp.directive:verDocumento.controller:verDocumentoCtrl
             * @description
             * # verDocumentoCtrl
             * # Controller of the poluxClienteApp.directive:verDocumento
             * Controlador de la directiva {@link poluxClienteApp.directive:verDocumento verDocumento}.
             * @requires decorators/poluxClienteApp.decorator:TextTranslate
             * @requires $scope
             * @requires services/poluxService.service:gestorDocumentalMidService
             * @property {string} msgCargandoDocumento Mensaje que se muestra mientras se esta cargando el documento.
             * @property {string} mensajeError Error que se muestra cuando ocurre un error cargando el documento.
             * @property {boolean} loadDocumento Load que indica que se esta cargando el documento.
             * @property {boolean} errorDocumento Error que indica que ocuerrio un error mientras se esta cargando el documento.
             * @property {object} pdfUrl Pdf del documento que se muestra en la vista.
             */
            controller: function ($scope) {
                var self = this;
                $scope.msgCargandoDocumento = $translate.instant('LOADING.CARGANDO_DOCUMENTO');

                /**
                 * @ngdoc watch
                 * @name verDocumento
                 * @methodOf poluxClienteApp.directive:verDocumento.controller:verDocumentoCtrl
                 * @param {undefined} undefined No recibe parametros
                 * @returns {undefined} No retorna ningún valor.
                 * @description 
                 * vigila cambios en documento y llama la función que carga los documentos.
                 */
                $scope.$watch('documento', function () {
                    if ($scope.documento != undefined) {
                        
                        self.getDocumento($scope.documento.Enlace);
                        self.documento = $scope.documento;
                    }
                });

                /**
                 * @ngdoc method
                 * @name verDocumento
                 * @methodOf poluxClienteApp.directive:verDocumento.controller:verDocumentoCtrl
                 * @param {number} docid Uid del documento que se va a traer del gestor documental.
                 * @returns {undefined} No retorna ningún valor.
                 * @description 
                 * Permite cargar un documento de {@link services/poluxClienteApp.service:gestorDocumentalMidService gestorDocumentalMidService} para mostrarlo.
                 */
                self.getDocumento = function (docid) {
                    $scope.loadDocumento = true;
                    
                    if (docid != null) {
                        //  obtener un documento por la id 
                        gestorDocumentalMidRequest.get('/document/' + docid).then(function (response) {
                            //$window.open(fileURL);
                            //})
                            var file = new Blob([utils.base64ToArrayBuffer(response.data.file)], { type: 'application/pdf' });
                            var fileURL = URL.createObjectURL(file);
                            $scope.pdfUrl = fileURL;
                            $scope.loadDocumento = false;
                        })
                            .catch(function (error) {
                                $scope.errorDocumento = true;
                                $scope.mensajeError = $translate.instant("ERROR.CARGAR_DOCUMENTO");
                                $scope.loadDocumento = false;
                            })
                    }

                }

            },
            controllerAs: "d_verDocumento"
        };
    });
