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
    function ($scope, $window, poluxMidRequest, academicaRequest, token_service, $translate) {
        var ctrl = this;
        ctrl.carrerasFacultad = []

        var documento = token_service.getAppPayload().appUserDocument;

        //se recupera el código de la facultad por medio del documento de coordinador
        academicaRequest.get("coordinador_carrera", [documento, "PREGRADO"]).then(function (responseCoordinador) {

            var cod_facultad = responseCoordinador.data.coordinadorCollection.coordinador[0].codigo_facultad

            //se recuperan los proyectos curriculares de la facultad por medio del código de la facultad
            academicaRequest.get("proyectos_facultad", [cod_facultad, "PREGRADO"]).then(function (responseProyectos) {

                //se almacenan los proyectos para mostrarlos en el formulario
                responseProyectos.data.proyectos.proyecto.forEach(proyecto => {
                    ctrl.carrerasFacultad.push(
                        {
                            codigo : proyecto.codigo_proyecto_curricular,
                            nombre : proyecto.nombre_proyecto_curricular
                        })
                });
            })
        })

        ctrl.EstadosFiltro = [
            {
                codigo : 1,
                nombre : "TODOS"
            },
            {
                codigo : 2,
                nombre : "ACTIVOS"
            },
            {
                codigo : 3,
                nombre : "CULMINADOS"
            },
        ]

        /**
         * @ngdoc method
         * @name generar_reporte_general
         * @methodOf poluxClienteApp.controller:GenerarReporteCtrl
         * @description 
         * Esta función llama al endpoint de POLUX_MID correspondiente de generar y descargar el Reporte General en un archivo Excel.
         * @returns {undefined} No retorna nigún valor. 
         */
        ctrl.generar_reporte_general = function() {
    
            var data_filtro = {
                ProyectoCurricular: $scope.carrera_seleccionada,
                Estado: $scope.estado_seleccionado,
                FechaInicio: $scope.f_inicial,
                FechaFin: $scope.f_final
            }

            poluxMidRequest.post("reporte_general", data_filtro).then(function(response) {

                if(response.data.Success){
                    swal(
                        $translate.instant("DESCARGA_COMPLETA"),
                        $translate.instant("REPORTE_CORRECTO"),
                        'success'
                    )

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
                }    
            }).catch(function() {
                swal(
                    $translate.instant("MENSAJE_ERROR"),
                    $translate.instant("REPORTE_INCORRECTO"),
                    'warning'
                );
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
            
            var data_filtro = {
                ProyectoCurricular: $scope.carrera_seleccionada,
                Estado: $scope.estado_seleccionado,
                FechaInicio: $scope.f_inicial,
                FechaFin: $scope.f_final
            }

            poluxMidRequest.post("reporte_solicitud", data_filtro).then(function(response) {

                if (response.data.Success) {

                    swal(
                        $translate.instant("DESCARGA_COMPLETA"),
                        $translate.instant("REPORTE_CORRECTO"),
                        'success'
                    )
                    
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
                }
            }).catch(function() {
                swal(
                    $translate.instant("MENSAJE_ERROR"),
                    $translate.instant("REPORTE_INCORRECTO"),
                    'warning'
                );
            });
        }
    }
);