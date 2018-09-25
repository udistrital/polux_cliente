'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:vistaPreviaFormato
 * @description
 * # vistaPreviaFormato
 * Directiva que muestra la vista previa de un formato de evaluación de un proyecto.
 * Actualmente no se utiliza.
 * Controlador: {@link poluxClienteApp.directive:vistaPreviaFormato.controller:vistaPreviaFormatoCtrl vistaPreviaFormatoCtrl}
 * @param {object} formato Formato del que se muestra la vista previa.
 */
angular.module('poluxClienteApp')
    .directive('vistaPreviaFormato', function () {
        return {
            restrict: 'E',
            scope: {
                formato: '='
            },
            link: function (scope, elm, attr) {
                /**
                 * @ngdoc method
                 * @name watchFormato
                 * @methodOf poluxClienteApp.directive:vistaPreviaFormato.controller:vistaPreviaFormatoCtrl
                 * @param {undefined} undefined No recibe parametros.
                 * @returns {undefined} no retorna ningún valor.
                 * @description 
                 * Observa los cambios en el formato seleccionado y llama a la función que refresca la vista.
                 */
                scope.$watch('formato', function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        scope.refresh_format_view(newValue);
                    }
                }, true);
            },
            templateUrl: 'views/directives/formato/vista_previa_formato.html',
            /**
             * @ngdoc controller
             * @name poluxClienteApp.directive:vistaPreviaFormato.controller:vistaPreviaFormatoCtrl
             * @description
             * # vistaPreviaFormatoCtrl
             * # Controller of the poluxClienteApp.directive:vistaPreviaFormato
             * Controlador de la directiva {@link poluxClienteApp.directive:vistaPreviaFormato vistaPreviaFormato}.
             * @requires services/poluxService.service:poluxRequest
             * @requires $scope
             * @requires $http
             * @property {object} imagen_ud Logo de la universidad para generación del pdf.
             * @property {object} pdfgen_all Propiedades de configuación para generación de pdf.
             */
            controller: function (poluxRequest, $scope, $http) {

                /**
                 * @ngdoc method
                 * @name obtenerLogo
                 * @methodOf poluxClienteApp.directive:vistaPreviaFormato.controller:vistaPreviaFormatoCtrl
                 * @param {undefined} undefined No recibe parametros
                 * @returns {undefined} no retorna ningún valor.
                 * @description 
                 * Obtiene el logo de la universidad para incluir lo en el pdf.
                 */
                $http.get("scripts/models/imagen_ud.json")
                    .then(function (response) {
                        $scope.imagen_ud = response.data;
                    });


                $scope.pdfgen_all = {
                    name: "",
                    pdfgen: {
                        content: [],
                        styles: {
                            header: {
                                fontSize: 14,
                                bold: true
                            },
                            subheader: {
                                fontSize: 12,
                                bold: true
                            },
                            quote: {
                                italics: true
                            },
                            small: {
                                fontSize: 8
                            }
                        }
                    }
                };
                $scope.formato_vista = {};
                /**
                 * @ngdoc method
                 * @name generar_pdf
                 * @methodOf poluxClienteApp.directive:vistaPreviaFormato.controller:vistaPreviaFormatoCtrl
                 * @param {undefined} undefined No recibe parametros
                 * @returns {undefined} no retorna ningún valor.
                 * @description 
                 * Permite generar el pdf que se muestra en la vista.
                 */
                $scope.generar_pdf = function (formato) {
                    $scope.pdfgen_all.name = formato.Formato.Nombre;
                    $scope.pdfgen_all.pdfgen.content = [];

                    $scope.pdfgen_all.pdfgen.content.push({
                        // if you specify both width and height - image will be stretched
                        image: $scope.imagen_ud.imagen,
                        width: 100,
                        margin: [200, 0, 0, 0],
                    });
                    $scope.pdfgen_all.pdfgen.content.push({
                        text: ['UNIVERSIDAD DISTRITAL FRANCISCO JOSÉ DE CALDAS\n',
                            formato.Formato.Nombre + '\n\n'
                        ],
                        style: 'header',
                        alignment: 'center'
                    });
                    $scope.pdfgen_all.pdfgen.content.push({
                        text: formato.Formato.Introduccion + "\n\n",
                        style: 'subheader',
                        alignment: 'center'
                    });
                    angular.forEach(formato.TrPreguntas, function (d) {
                        switch (d.Pregunta.Tipo) {
                            case "cerrado_unico":

                                $scope.pdfgen_all.pdfgen.content.push({
                                    text: "\n" + d.Pregunta.Orden + ". " + d.Pregunta.IdPregunta.Enunciado + "\n\n",
                                    style: 'subheader',
                                    alignment: 'justify'
                                });

                                var ul = [];
                                console.log(d.Respuestas);
                                angular.forEach(d.Respuestas, function (r) {
                                    console.log(r.IdRespuesta.Descripcion);
                                    ul.push(r.IdRespuesta.Descripcion);
                                });
                                $scope.pdfgen_all.pdfgen.content.push({
                                    type: 'circle',
                                    ul: ul
                                });
                                break;

                            case "cerrado_multiple":

                                $scope.pdfgen_all.pdfgen.content.push({
                                    text: "\n" + d.Pregunta.Orden + ". " + d.Pregunta.IdPregunta.Enunciado + "\n\n",
                                    style: 'subheader',
                                    alignment: 'justify'
                                });

                                var ul = [];
                                console.log(d.Respuestas);
                                angular.forEach(d.Respuestas, function (r) {
                                    console.log(r.IdRespuesta.Descripcion);
                                    ul.push(r.IdRespuesta.Descripcion);
                                });
                                $scope.pdfgen_all.pdfgen.content.push({
                                    type: 'circle',
                                    ul: ul
                                });
                                break;
                            case "abierto":

                                $scope.pdfgen_all.pdfgen.content.push({
                                    text: "\n" + d.Pregunta.Orden + ". " + d.Pregunta.IdPregunta.Enunciado + "\n\n",
                                    style: 'subheader',
                                    alignment: 'justify'
                                });
                                $scope.pdfgen_all.pdfgen.content.push({
                                    text: ["_______________________________________________________________________________________\n",
                                        "_______________________________________________________________________________________\n"
                                    ],
                                    alignment: 'center'
                                });
                                break;
                            case "calificado":

                                $scope.pdfgen_all.pdfgen.content.push({
                                    text: "\n" + d.Pregunta.Orden + ". " + d.Pregunta.IdPregunta.Enunciado + "\n\n",
                                    style: 'subheader',
                                    alignment: 'justify'
                                });
                                $scope.pdfgen_all.pdfgen.content.push({
                                    text: ["_______________________________________________________________________________________\n"],
                                    alignment: 'center'
                                });
                                break;
                            default:
                        }
                    });

                };

                /**
                 * @ngdoc method
                 * @name refresh_format_view
                 * @methodOf poluxClienteApp.directive:vistaPreviaFormato.controller:vistaPreviaFormatoCtrl
                 * @param {number} id Id del formato que se cargará en la vista.
                 * @returns {undefined} no retorna ningún valor.
                 * @description 
                 * Permite cargar la data del formato de {@link services/poluxClienteApp.service:poluxService poluxService}
                 */
                $scope.refresh_format_view = function (id) {
                    $scope.respuestas_vista = [];
                    poluxRequest.get("tr_formato/" + id, '')
                        .then(function (response) {
                            $scope.formato_vista = response.data;
                            $scope.generar_pdf($scope.formato_vista);
                        });
                };
            },
            controllerAs: 'vistaPrevia'
        };
    });