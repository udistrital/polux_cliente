'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:llenarEvaluacion
 * @description
 * # llenarEvaluacion
 * Directiva que permite llenar una evaluación de un trabajo de grado.
 * Actualmente no se utiliza.
 * Controlador: {@link poluxClienteApp.directive:llenarEvaluacion.controller:llenarEvaluacionCtrl llenarEvaluacionCtrl}
 * @param {object} formato Formato que se va a llenar para evaluar el trabajo de grado.
 */
angular.module('poluxClienteApp')
    /**
       * @ngdoc controller
       * @name poluxClienteApp.directive:llenarEvaluacion.controller:llenarEvaluacionCtrl
       * @description
       * # llenarEvaluacionCtrl
       * # Controller of the poluxClienteApp.directive:llenarEvaluacion
       * Controlador de la directiva {@link poluxClienteApp.directive:llenarEvaluacion llenarEvaluacion}.
       * @requires services/poluxService.service:poluxRequest
       * @requires $scope
       * @property {array} enviar Respuestas que da el usuario al formato y que se enviarán para registrar.
       * @property {object} formato Formato que se llenará, contiene los campos que deben ser llenados.
       */
    .directive('llenarEvaluacion', function() {
        return {
            restrict: 'E',
            scope: {
                formato: '=?'
            },
            templateUrl: 'views/directives/formato/llenar_evaluacion.html',
            controller: function(poluxRequest, $scope) {

                var ctrl = this;
                $scope.selected = [];
                ctrl.enviar = [];

                /**
                 * @ngdoc method
                 * @name enviar_evaluacion
                 * @methodOf poluxClienteApp.directive:llenarEvaluacion.controller:llenarEvaluacionCtrl
                 * @param {undefined} undefined No recibe parametros
                 * @returns {undefined} No retorna ningún valor.
                 * @description 
                 * Permite añadir las respuestas dadas por el usuario al arreglo de respuestas que se envian.
                 */
                ctrl.enviar_evaluacion = function() {
                    angular.forEach($scope.selected, function(data) {
                        ctrl.enviar.push({
                            RespuestaFormato: data
                        });
                    });
                };

                /**
                 * @ngdoc method
                 * @name cargarFormato
                 * @methodOf poluxClienteApp.directive:llenarEvaluacion.controller:llenarEvaluacionCtrl
                 * @param {undefined} undefined No recibe parametros
                 * @returns {undefined} No retorna ningún valor.
                 * @description 
                 * Permite cargar el formato y la data asociada a este.
                 */
                poluxRequest.get("tr_formato/" + $scope.formato, "")
                    .then(function(response) {
                        ctrl.Formato = response.data.Data;
                        angular.forEach(ctrl.Formato.TrPreguntas, function(data) {
                            if (data.Tipo == "cerrado_multiple") {
                                data.Respuestas = [];
                            }
                        });
                    });

                
                /**
                 * @ngdoc method
                 * @name toggle
                 * @methodOf poluxClienteApp.directive:llenarEvaluacion.controller:llenarEvaluacionCtrl
                 * @param {object} item Item que se va a agragar o eliminar
                 * @param {array} list Lista de elementos de la que se elimina o agrega el objeto.
                 * @returns {undefined} No retorna ningún valor.
                 * @description 
                 * Permite agregar o eliminar objetos de una lista.
                 */
                $scope.toggle = function(item, list) {
                    var idx = list.indexOf(item);
                    if (idx > -1) {
                        list.splice(idx, 1);
                    } else {
                        list.push(item);
                    }
                };

                /**
                 * @ngdoc method
                 * @name exists
                 * @methodOf poluxClienteApp.directive:llenarEvaluacion.controller:llenarEvaluacionCtrl
                 * @param {object} item Item que se busca
                 * @param {array} list Lista de elementos en la que se debe realizar la busqueda
                 * @returns {boolean} Booleano que indica si el elemento se encontro o no.
                 * @description 
                 * Permite buscar objetos en una lista.
                 */
                $scope.exists = function(item, list) {
                    return list.indexOf(item) > -1;
                };

            },
            controllerAs: 'd_llenar_evaluacion'
        };
    });