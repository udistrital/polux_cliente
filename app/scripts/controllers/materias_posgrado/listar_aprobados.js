'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:MateriasPosgradoListarAprobadosCtrl
 * @description
 * # MateriasPosgradoListarAprobadosCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
    .controller('MateriasPosgradoListarAprobadosCtrl', function ($q, $translate, $scope, academicaRequest, poluxRequest) {
        var ctrl = this;

        $scope.posgradosCargados = true;
        $scope.admitidosCargados = true;
        $scope.msgCargandoPosgrados = $translate.instant("LOADING.CARGANDO_INFO_ACADEMICA");
        $scope.msgCargandoAdmitidos = $translate.instant("LOADING.CARGANDO_DETALLES_SOLICITUD");
        $scope.msgErrorConsultaAdmitidos = "";
        $scope.opcionesSolicitud = [
            {
                clase_color: "ver",
                clase_css: "fa fa-eye fa-lg  faa-shake animated-hover",
                titulo: $translate.instant('BTN.VER_DETALLES'),
                operacion: 'verDetallesSolicitud',
                estado: true
            }
        ];
        $scope.userId = "12237136";

        ctrl.posgrados = [];
        ctrl.mostrarPeriodo = false;
        ctrl.infoAcademicaCargada = true;
        ctrl.solicitudesPosgradoAprobadas = [];
        ctrl.propiedadesCuadricula = {};
        ctrl.propiedadesCuadricula.columnDefs = [
            {
                name: 'solicitud',
                displayName: $translate.instant("SOLICITUD"),
                width: '10%'
            },
            {
                name: 'fecha',
                displayName: $translate.instant("FECHA"),
                type: 'date',
                cellFilter: 'date:\'yyyy-MM-dd\'',
                width: '8%'
            },
            {
                name: 'estudiante',
                displayName: $translate.instant("CODIGO"),
                width: '12%'
            },
            {
                name: 'nombre',
                displayName: $translate.instant("NOMBRE"),
                width: '27%'
            },
            {
                name: 'promedio',
                displayName: $translate.instant("PROMEDIO"),
                width: '10%'
            },
            {
                name: 'estado.Nombre',
                displayName: $translate.instant("ESTADO"),
                width: '18%'
            },
            {
                name: 'modificar',
                displayName: $translate.instant("OPCIONES"),
                width: '15%',
                cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila)" grupobotones="grid.appScope.opcionesSolicitud" fila="row"></btn-registro>'
            }
        ];
        ctrl.cuadriculaEspaciosAcademicos = {};
        ctrl.cuadriculaEspaciosAcademicos.columnDefs = [
            {
                name: 'codigo',
                displayName: $translate.instant("CODIGO_ESP_ACADEMICO"),
                width: '35%'
            },
            {
                name: 'nombre',
                displayName: $translate.instant("NOMBRE_ESP_ACADEMICO"),
                width: '50%'
            },
            {
                name: 'creditos',
                displayName: $translate.instant("CREDITOS"),
                width: '15%'
            }
        ];

        ctrl.obtenerPosgradosCoordinador = function() {
            var defered = $q.defer(); 
            academicaRequest.get("coordinador_carrera", [$scope.userId, "POSGRADO"])
            .then(function(response){
                if (!angular.isUndefined(response.data.coordinadorCollection.coordinador)) {
                    ctrl.posgrados = response.data.coordinadorCollection.coordinador;
                    defered.resolve(ctrl.posgrados);
                }
            })
            .catch(function() {
                defered.reject(false);
            });
            return defered.promise;
        }

        ctrl.obtenerPeriodos = function() {
            var defered = $q.defer();
            academicaRequest.get("periodos")
            .then(function(response){
                if (!angular.isUndefined(response.data.periodosCollection.datosPeriodos)) {
                    ctrl.periodos = response.data.periodosCollection.datosPeriodos;
                    defered.resolve(ctrl.periodos);
                }
            })
            .catch(function() {
                defered.reject(false);
            });
            return defered.promise;
        }
        
        $q.all([ctrl.obtenerPosgradosCoordinador(), ctrl.obtenerPeriodos()]).then(function(response) {
            $scope.posgradosCargados = false;
        }).catch(function(exception) {
            ctrl.infoAcademicaCargada = exception;
            $scope.posgradosCargados = false;
        });

        ctrl.definirPosgrado = function() {
            if (!ctrl.mostrarPeriodo) {
                ctrl.mostrarPeriodo = true;
            }
            if (ctrl.infoAcademicaCargada && ctrl.periodoSeleccionado) {
                ctrl.consultarAprobados();
            }
        }

        ctrl.consultarAprobados = function() {
            $scope.cargandoSolicitudesPosgradoAprobadas = true;
            $scope.sinResultados = false;
            $scope.resultadosConsulta = [];
            ctrl.cargarAprobados()
            .then(function(sinResultados) {
                $scope.cargandoSolicitudesPosgradoAprobadas = false;
                ctrl.propiedadesCuadricula.data = $scope.resultadosConsulta;
            })
            .catch(function(sinResultados) {
                $scope.cargandoSolicitudesPosgradoAprobadas = false;
                $scope.sinResultados = sinResultados;
            });
        }

        ctrl.cargarAprobados = function() {
            var defered = $q.defer();
            if (ctrl.posgradoSeleccionado) {
                var parametrosAdmitidosPosgrado = $.param({
                    query: "EstadoSolicitud.Id.in:7|8|9|10",
                    limit: 0
                });
                poluxRequest.get("respuesta_solicitud", parametrosAdmitidosPosgrado)
                .then(function(solicitudesPosgradoAprobadas) {
                    angular.forEach(solicitudesPosgradoAprobadas.data, function(solicitudPosgradoAprobada) {
                        if (solicitudPosgradoAprobada) {
                            var parametrosDetalleSolicitudAprobada = $.param({
                                query: "DetalleTipoSolicitud:37,SolicitudTrabajoGrado:" + solicitudPosgradoAprobada.SolicitudTrabajoGrado.Id
                            });
                            poluxRequest.get("detalle_solicitud", parametrosDetalleSolicitudAprobada)
                            .then(function(detalleSolicitudPosgradoAprobada) {
                                if (detalleSolicitudPosgradoAprobada.data) {
                                    var posgradoConsultado = JSON.parse(detalleSolicitudPosgradoAprobada.data[0].Descripcion.split("-")[1]);
                                    if (ctrl.posgradoSeleccionado == posgradoConsultado.Codigo) {
                                        var parametrosSolicitudUsuario = $.param({
                                            query: "SolicitudTrabajoGrado:" + solicitudPosgradoAprobada.SolicitudTrabajoGrado.Id
                                        });
                                        poluxRequest.get("usuario_solicitud", parametrosSolicitudUsuario)
                                        .then(function(usuarioSolicitudPosgradoAprobada) {
                                            academicaRequest.get("datos_estudiante", [usuarioSolicitudPosgradoAprobada.data[0].Usuario, ctrl.periodoSeleccionado.anio, ctrl.periodoSeleccionado.periodo])
                                            .then(function(admitidoConsultado){
                                                if (!angular.isUndefined(admitidoConsultado.data.estudianteCollection.datosEstudiante)) {
                                                    var solicitud = {
                                                        "solicitud": solicitudPosgradoAprobada.SolicitudTrabajoGrado.Id,
                                                        "fecha": solicitudPosgradoAprobada.Fecha,
                                                        "estudiante": usuarioSolicitudPosgradoAprobada.data[0].Usuario,
                                                        "nombre": admitidoConsultado.data.estudianteCollection.datosEstudiante[0].nombre,
                                                        "promedio": admitidoConsultado.data.estudianteCollection.datosEstudiante[0].promedio,
                                                        "estado": solicitudPosgradoAprobada.EstadoSolicitud,
                                                        "rendimiento": admitidoConsultado.data.estudianteCollection.datosEstudiante[0].rendimiento,
                                                        "posgradoAspirado": posgradoConsultado,
                                                        "detalleSolicitudPosgradoAprobada": detalleSolicitudPosgradoAprobada.data[0].Descripcion,
                                                        "admitidoConsultado": admitidoConsultado,
                                                        "usuarioSolicitudPosgradoAprobada": usuarioSolicitudPosgradoAprobada
                                                    };
                                                    $scope.resultadosConsulta.push(solicitud);
                                                    defered.resolve(false);
                                                } else {
                                                    /**
                                                     * No existe registro de estudiantes con dichas características
                                                     */
                                                    $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.NO_EXISTE_ESTUDIANTE_POSGRADO");
                                                    defered.reject(true);
                                                }
                                            })
                                            .catch(function(errorRespuestaEstudiante) {
                                                /**
                                                 * Ocurrió al traer la información desde la petición académica
                                                 */
                                                $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.SIN_INFO_ESTUDIANTE");
                                                defered.reject(true);
                                            });
                                        })
                                        .catch(function(errorRespuestaUsuario) {
                                            /**
                                             * Ocurrió al traer la información del estudiante desde la petición polux
                                             */
                                            $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.SIN_INFO_ESTUDIANTE");
                                            defered.reject(true);
                                        });
                                    } else {
                                        /**
                                         * El posgrado consultado no coincide con el posgrado obtenido desde la base de datos
                                         */
                                        $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.SIN_RESULTADOS");
                                        defered.reject(true);
                                    }
                                } else {
                                    /**
                                     * La información sobre el detalle de la solicitud de posgrado aprobada es nula
                                     */
                                    $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.SIN_RESULTADOS");
                                    defered.reject(true);
                                }
                            })
                            .catch(function(errorRespuestaDetalle) {
                                /**
                                 * No fue posible obtener la información sobre el detalle de las solicitudes de posgrado aprobadas durante la consulta a la base de datos
                                 */
                                $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.SIN_INFO_ESTUDIANTE");
                                defered.reject(true);
                            });
                        } else {
                            /**
                             * Ocurrió un error al iterar sobre la colección de solicitudes de posgrado aprobadas
                             * Podría deberse a un cambio en el formato de las mismas
                             */
                            $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.SIN_RESULTADOS");
                            defered.reject(true);
                        }
                    });
                })
                .catch(function(errorRespuestaSolicitud) {
                    /**
                     * No fue posible obtener la información sobre las solicitudes de posgrado aprobadas desde la base de datos
                     */
                    $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.SIN_RESULTADOS");
                    defered.reject(true);
                });
            } else {
                /**
                 * No hay posgrado seleccionado
                 */
                $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.SIN_RESULTADOS");
                defered.reject(true);
            }
            return defered.promise;
        }

        ctrl.verDetallesSolicitud = function(filaSolicitud) {
            ctrl.numeroSolicitud = filaSolicitud.entity.solicitud;
            var fechaCompletaSolicitud = new Date(filaSolicitud.entity.fecha);
            ctrl.fechaSolicitud = ctrl.obtenerFechaGeneral(fechaCompletaSolicitud);
            ctrl.horaSolicitud = ctrl.obtenerHoraRegistrada(fechaCompletaSolicitud);
            ctrl.estadoSolicitud = filaSolicitud.entity.estado;
            ctrl.nombreEstudianteSolicitante = filaSolicitud.entity.nombre;
            ctrl.codigoEstudianteSolicitante = filaSolicitud.entity.estudiante;
            ctrl.promedioEstudianteSolicitante = filaSolicitud.entity.promedio;
            ctrl.rendimientoEstudianteSolicitante = filaSolicitud.entity.rendimiento;
            ctrl.codigoPosgrado = filaSolicitud.entity.posgradoAspirado.Codigo;
            ctrl.nombrePosgrado = filaSolicitud.entity.posgradoAspirado.Nombre;
            ctrl.pensumPosgrado = filaSolicitud.entity.posgradoAspirado.Pensum;
            ctrl.cuadriculaEspaciosAcademicos.data = ctrl.obtenerEspaciosAcademicos(filaSolicitud.entity.detalleSolicitudPosgradoAprobada.split("-").slice(2));
            $('#modalVerSolicitud').modal('show');
        }

        ctrl.cambiarEstadoPago = function() {
            /**
             * Cambiar el estado del pago según el estudiante asociado
             */
            console.log("cambiar el estado del pago");
        }

        $scope.loadrow = function(filaSolicitud) {
            ctrl.verDetallesSolicitud(filaSolicitud);
        };

        ctrl.obtenerFechaGeneral = function(fechaCompleta) {
            return fechaCompleta.getFullYear() 
            + "-" + fechaCompleta.getMonth() + 1 
            + "-" + fechaCompleta.getDate();
        }

        ctrl.obtenerHoraRegistrada = function(fechaCompleta) {
            var horaDelDia = fechaCompleta.getHours();
            var minutoDelDia = fechaCompleta.getMinutes();
            var segundoDelDia = fechaCompleta.getSeconds();
            if (horaDelDia < 10) {
                horaDelDia = "0" + horaDelDia;
            }
            if (minutoDelDia < 10) {
                minutoDelDia = "0" + minutoDelDia;
            }
            if (segundoDelDia < 10) {
                segundoDelDia = "0" + segundoDelDia;
            }
            if (horaDelDia > 11) {
                return (horaDelDia - 12 + ":" + minutoDelDia + ":" + segundoDelDia + " PM");
            } else {
                return (horaDelDia + ":" + minutoDelDia + ":" + segundoDelDia + " AM");
            }
        }

        ctrl.obtenerEspaciosAcademicos = function(descripcionSolicitud) {
            var espaciosAcademicos = [];
            angular.forEach(descripcionSolicitud, function(espacioAcademico) {
                var objetoEspacioAcademico = JSON.parse(espacioAcademico);
                var informacionEspacioAcademico = {
                    "codigo": objetoEspacioAcademico.CodigoAsignatura,
                    "nombre": objetoEspacioAcademico.Nombre,
                    "creditos": objetoEspacioAcademico.Creditos
                };
                espaciosAcademicos.push(informacionEspacioAcademico);
            });
            return espaciosAcademicos;
        }

    });