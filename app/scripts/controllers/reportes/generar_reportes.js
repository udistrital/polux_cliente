'use strict';

/**
 * @ngdoc controller
 * @name poluxClienteApp.controller:GenerarReporteCtrl
 * @description
 * # GenerarReporteCtrl
 * Controller of the poluxClienteApp
 * Controlador que permite al coordinador generar reportes generales y de solicitudes

 * @requires $scope
 * @requires $window
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires services/poluxMidService.service:poluxMidRequest
 */

angular.module('poluxClienteApp').controller('GenerarReporteCtrl',
    function ($scope, $window, poluxMidRequest) {
        var ctrl = this;

        /**
         * @ngdoc method
         * @name generar_reporte_general
         * @methodOf poluxClienteApp.controller:GenerarReporteCtrl
         * @description 
         * Esta función llama al endpoint de POLUX_MID correspondiente de generar y descargar el Reporte General en un archivo Excel.
         * @returns {undefined} No retorna nigún valor. 
         */
        ctrl.generar_reporte_general = function() {   
            poluxMidRequest.post("reporte_general").then(function(response) {
                //Decodificar el Base64 del archivo
                var byteCharacters = atob(response.data.Data);
                var byteNumbers = new Array(byteCharacters.length);
                
                for (var i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                
                var byteArray = new Uint8Array(byteNumbers);
                var blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                
                // Crear un enlace temporal y simular el clic para la descarga
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = "ReporteGeneral.xlsx";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }).catch(function(error) {
                console.error('Error al generar el Reporte General: ', error);
            });
        }

        /**
         * @ngdoc method
         * @name generar_reporte_solicitud
         * @methodOf poluxClienteApp.controller:GenerarReporteCtrl
         * @description 
         * Esta función llama al endpoint de POLUX_MID correspondiente de generar y descargar el Reporte Solicitud en un archivo Excel.
         * @returns {undefined} No retorna nigún valor. 
         */
        ctrl.generar_reporte_solicitud = function() {   
            poluxMidRequest.post("reporte_solicitud").then(function(response) {
                // Decodificar el Base64 del archivo
                var byteCharacters = atob(response.data.Data);
                var byteNumbers = new Array(byteCharacters.length);
                
                for (var i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                
                var byteArray = new Uint8Array(byteNumbers);
                var blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                
                // Crear un enlace temporal y simular el clic para la descarga
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = "ReporteSolicitud.xlsx";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }).catch(function(error) {
                console.error('Error al generar el reporte de solicitudes: ', error);
            });
        }
    }
);