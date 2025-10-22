'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:subirDocumento
 * @description
 * # subirDocumento
 * Directiva que permite cargar un documento al gestor documental.
 * Actualmente no se utiliza.
 * Controlador: {@link poluxClienteApp.directive:subirDocumento.controller:subirDocumentoCtrl subirDocumentoCtrl}
 * @requires $scope
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @param {string} titulo Titulo del documento que se va a cargar
 * @param {string} descripcion Descripción del documento que se va a cargar.
 * @param {string} enlace Enlace del documento cargado.
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
            /**
             * @ngdoc controller
             * @name poluxClienteApp.directive:subirDocumento.controller:subirDocumentoCtrl
             * @description
             * # subirDocumentoCtrl
             * # Controller of the poluxClienteApp.directive:subirDocumento
             * Controlador de la directiva {@link poluxClienteApp.directive:subirDocumento subirDocumento}.
             * @requires services/poluxService.service:poluxRequest
             * @requires $scope
             * @requires $http
             * @property {Object} fileModel Model del archivo que se cargará.
             */
            controller: function ($scope, $http, $translate, utils) {
                var ctrl = this;
                ctrl.msg = null;

                /**
                 * @ngdoc method
                 * @name limpiar
                 * @methodOf poluxClienteApp.directive:subirDocumento.controller:subirDocumentoCtrl
                 * @param {undefined} undefined No recibe parametros
                 * @returns {undefined} No retorna ningún valor.
                 * @description 
                 * Permite limpiar los valores con los que se sube el documento.
                 */
                ctrl.limpiar = function () {
                    ctrl.titulo = angular.copy("");
                    ctrl.resumen = angular.copy("");
                    ctrl.nuevaArea = [];
                };

                /**
                 * @ngdoc method
                 * @name verificarArchivo
                 * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
                 * @description 
                 * Consulta la función general de utils para verificar si el archivo contiene virus
                 * @param {any} input El campo input file del formulario
                 */
                $scope.verificarArchivo = async function (input) {
                    var file = input.files[0];
                    if (!file) return;

                    var esPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
                    if (!esPDF) {
                    swal(
                        $translate.instant("VALIDACION_ARCHIVO.TITULO_ARCHIVO_PDF"),
                        $translate.instant("VALIDACION_ARCHIVO.ARCHIVO_PDF"),
                        "error"
                        );
                    input.value = "";
                    $scope.$applyAsync(() => { input.value = null; });
                    return;
                    }

                    var resultado = await utils.verificarArchivoGeneral(input);
                    if (!resultado.limpio) {
                        input.value = "";
                        $scope.$applyAsync(() => { input.value = null; });
                    }
                };

            },
            controllerAs: 'd_subirDocumento'
        };
    });
