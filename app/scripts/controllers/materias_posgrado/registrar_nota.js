'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:MateriasPosgradoListarAprobadosCtrl
 * @description
 * # MateriasPosgradoListarAprobadosCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
    .controller('MateriasPosgradoRegistrarNotaCtrl', function ($q, $location, $translate, $scope, academicaRequest, poluxRequest) {
        var ctrl = this;

        $scope.cargandoPosgrados = true;
        $scope.msgCargandoTrabajosGrado = $translate.instant("LOADING.CARGANDO_INFO_ACADEMICA");
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

        ctrl.solicitudesPosgradoAprobadas = [];
        ctrl.propiedadesCuadricula = {};
        ctrl.propiedadesCuadricula.columnDefs = [
            {
                name: 'trabajoGrado',
                displayName: $translate.instant("TRABAJO_GRADO"),
                width: '10%'
            },
            {
                name: 'codigo',
                displayName: $translate.instant("CODIGO"),
                width: '12%'
            },
            {
                name: 'nombre',
                displayName: $translate.instant("NOMBRE"),
                width: '27%'
            },
            {
                name: 'modalidad',
                displayName: $translate.instant("MODALIDAD"),
                width: '10%'
            },
            {
                name: 'estado',
                displayName: $translate.instant("ESTADO_SIN_DOSPUNTOS"),
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

        ctrl.obtenerPosgradosSegunCoordinador = function() {
            var defered = $q.defer(); 
        	ctrl.posgradosDelCoordinador = [];
            academicaRequest.get("coordinador_carrera", [$scope.userId, "POSGRADO"])
            .then(function(posgradosObtenidos) {
                if (!angular.isUndefined(posgradosObtenidos.data.coordinadorCollection.coordinador)) {
                    ctrl.posgradosDelCoordinador = posgradosObtenidos.data.coordinadorCollection.coordinador;
                    defered.resolve(ctrl.posgradosDelCoordinador);
                }
            })
            .catch(function() {
                defered.reject(null);
            });
            return defered.promise;
        }

        ctrl.obtenerPeriodosAcademicos = function() {
            var defered = $q.defer();
            ctrl.periodosAcademicos = [];
            academicaRequest.get("periodos")
            .then(function(periodosObtenidos){
                if (!angular.isUndefined(periodosObtenidos.data.periodosCollection.datosPeriodos)) {
                    ctrl.periodosAcademicos = periodosObtenidos.data.periodosCollection.datosPeriodos;
                    defered.resolve(ctrl.periodosAcademicos);
                }
            })
            .catch(function() {
                defered.reject(null);
            });
            return defered.promise;
        }
        
        $q.all([ctrl.obtenerPosgradosSegunCoordinador(), ctrl.obtenerPeriodosAcademicos()])
        .then(function(respuestaPosgradoPeriodo) {
            $scope.cargandoPosgrados = false;
            $scope.parametrosCargados = true;
        }).catch(function(errorPosgradoPeriodo) {
            $scope.cargandoPosgrados = false;
            $scope.parametrosCargados = false;
            $scope.errorCargandoParametros = true;
        });

        ctrl.seleccionarPosgrado = function() {
            if ($scope.parametrosCargados && ctrl.periodoSeleccionado) {
                ctrl.consultarAprobados();
            }
        }

        ctrl.consultarAprobados = function() {
            $scope.cargandoTrabajosGradoEnCurso = true;
            $scope.sinResultados = false;
            ctrl.coleccionEstudiantesCursandoMaterias = [];
            ctrl.cargarAprobados()
            .then(function(respuesta) {
                $scope.resultadosConsulta = respuesta;
                ctrl.propiedadesCuadricula.data = respuesta;
                $scope.cargandoTrabajosGradoEnCurso = false;
            })
            .catch(function(error) {
                $scope.resultadosConsulta = error;
                ctrl.propiedadesCuadricula.data = error;
                $scope.cargandoTrabajosGradoEnCurso = false;
                $scope.sinResultados = true;
                $scope.sinDatosConsulta = true;
            });
        }

        ctrl.cargarAprobados = function() {
            var defered = $q.defer();
            if (ctrl.posgradoSeleccionado) {
                var parametrosAdmitidosPosgrado = $.param({
                    //query: "Modalidad.Id:2,EstadoTrabajoGrado.Id:4",
                    query: "Modalidad.Id:4",
                    limit: 0
                });
                poluxRequest.get("trabajo_grado", parametrosAdmitidosPosgrado)
                .then(function(trabajosGradoEnCurso) {
                    if (trabajosGradoEnCurso.data) {
                        angular.forEach(trabajosGradoEnCurso.data, function(trabajoGradoEnCurso) {
                            var parametrosEstudianteAsociado = $.param({
                                query: "TrabajoGrado:" + trabajoGradoEnCurso.Id
                            });
                            poluxRequest.get("estudiante_trabajo_grado", parametrosEstudianteAsociado)
                            .then(function(estudianteCursandoMateriasPosgrado) {
                                if (estudianteCursandoMateriasPosgrado.data) {
                                    academicaRequest.get("datos_estudiante", [estudianteCursandoMateriasPosgrado.data[0].Estudiante, ctrl.periodoSeleccionado.anio, ctrl.periodoSeleccionado.periodo])
                                    .then(function(estudianteConsultado){
                                        if (!angular.isUndefined(estudianteConsultado.data.estudianteCollection.datosEstudiante)) {
                                            var registro = {
                                                "trabajoGrado": trabajoGradoEnCurso.Id,
                                                "codigo": estudianteConsultado.data.estudianteCollection.datosEstudiante.codigo,
                                                "nombre": estudianteConsultado.data.estudianteCollection.datosEstudiante.nombre,
                                                "modalidad": trabajoGradoEnCurso.Modalidad.Nombre,
                                                "estado": estudianteCursandoMateriasPosgrado.EstadoEstudianteTrabajoGrado.Nombre,
                                            };
                                            ctrl.coleccionEstudiantesCursandoMaterias.push(registro);
                                            defered.resolve(ctrl.coleccionEstudiantesCursandoMaterias);
                                        } else {
                                            /**
                                             * No existe registro de estudiantes con dichas características
                                             */
                                            $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.NO_EXISTE_ESTUDIANTE_POSGRADO");
                                            defered.reject(ctrl.coleccionEstudiantesCursandoMaterias);
                                        }
                                    })
                                    .catch(function(errorRespuestaEstudiante) {
                                        /**
                                         * Ocurrió al traer la información desde la petición académica
                                         */
                                        $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.SIN_INFO_ESTUDIANTE");
                                        defered.reject(ctrl.coleccionEstudiantesCursandoMaterias);
                                    });
                                } else {
                                    /**
                                     * La información sobre el detalle de la solicitud de posgrado aprobada es nula
                                     */
                                    $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.SIN_RESULTADOS");
                                    defered.reject(ctrl.coleccionEstudiantesCursandoMaterias);
                                }
                            })
                            .catch(function(errorRespuestaDetalle) {
                                /**
                                 * No fue posible obtener la información sobre el detalle de las solicitudes de posgrado aprobadas durante la consulta a la base de datos
                                 */
                                $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.SIN_INFO_ESTUDIANTE");
                                defered.reject(ctrl.coleccionEstudiantesCursandoMaterias);
                            });
                        });
                    } else {
                        /**
                         * La colección de trabajos de grado es nula
                         * Por lo tanto no se toma en cuenta en la iteración
                         */
                        $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.SIN_RESULTADOS");
                        defered.reject(ctrl.coleccionEstudiantesCursandoMaterias);
                    }                    
                })
                .catch(function(errorTrabajosGradoCurso) {
                    /**
                     * No fue posible obtener la información sobre los trabajos de grado de cursar materias en posgrado desde la base de datos
                     */
                    $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.SIN_RESULTADOS");
                    defered.reject(ctrl.coleccionEstudiantesCursandoMaterias);
                });
            } else {
                /**
                 * No hay posgrado seleccionado
                 */
                $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.SIN_RESULTADOS");
                defered.reject(ctrl.coleccionEstudiantesCursandoMaterias);
            }
            return defered.promise;
        }

        ctrl.verDetallesSolicitud = function(filaSolicitud) {
            ctrl.entity = filaSolicitud.entity;
            ctrl.numeroSolicitud = filaSolicitud.entity.solicitud;
            var fechaCompletaSolicitud = new Date(filaSolicitud.entity.fecha);
            ctrl.fechaSolicitud = ctrl.obtenerFechaGeneral(fechaCompletaSolicitud);
            ctrl.estadoSolicitud = filaSolicitud.entity.estado;
            ctrl.nombreEstudianteSolicitante = filaSolicitud.entity.nombre;
            ctrl.codigoEstudianteSolicitante = filaSolicitud.entity.estudiante;
            ctrl.promedioEstudianteSolicitante = filaSolicitud.entity.promedio;
            ctrl.rendimientoEstudianteSolicitante = filaSolicitud.entity.rendimiento;
            ctrl.codigoPosgrado = filaSolicitud.entity.posgradoAspirado.Codigo;
            ctrl.nombrePosgrado = filaSolicitud.entity.posgradoAspirado.Nombre;
            ctrl.pensumPosgrado = filaSolicitud.entity.posgradoAspirado.Pensum;
            ctrl.respuesta = filaSolicitud.entity.respuesta;
            ctrl.cuadriculaEspaciosAcademicos.data = ctrl.obtenerEspaciosAcademicos(filaSolicitud.trabajoGrado);
            $('#modalVerSolicitud').modal('show');
        }

        ctrl.registrarNotaIngresada = function() {
            swal({
                title: $translate.instant("INFORMACION_SOLICITUD"),
                text: $translate.instant("REGISTRAR_NOTA_POSGRADO", {
                        nombre: ctrl.nombreEstudianteSolicitante,
                        codigo: ctrl.codigoEstudianteSolicitante
                    }),
                type: "warning",
                confirmButtonText: $translate.instant("ACEPTAR"),
                cancelButtonText: $translate.instant("CANCELAR"),
                showCancelButton: true
            })
            .then(function(responseSwal) {
                if (responseSwal.value) {
                    $scope.cargandoRegistroPago = true;
                    $scope.loadFormulario = true;
                    ctrl.solicitarRegistroPago()
                    .then(function(response) {
                        if (response.data[0] === "Success") {
                            $scope.cargandoRegistroPago = false;
                            swal(
                                $translate.instant("REGISTRO_NOTA"),
                                $translate.instant("NOTA_REGISTRADA"),
                                'success'
                            );
                            $scope.cargandoSolicitudesPosgradoAprobadas = true;
                            ctrl.consultarAprobados();
                            $('#modalVerSolicitud').modal('hide');
                        } else {
                            $scope.cargandoRegistroPago = false;
                            swal(
                                $translate.instant("REGISTRO_NOTA"),
                                $translate.instant(response.data[1]),
                                'warning'
                            );
                        }
                    })
                    .catch(function(error) {
                        $scope.cargandoRegistroPago = false;
                        swal(
                            $translate.instant("REGISTRO_NOTA"),
                            $translate.instant("ERROR.REGISTRAR_NOTA"),
                            'warning'
                        );
                    })
                }
            });
        }

        $scope.loadrow = function(filaSolicitud) {
            ctrl.verDetallesSolicitud(filaSolicitud);
        };

        ctrl.obtenerFechaGeneral = function(fechaCompleta) {
            return fechaCompleta.getFullYear() 
            + "-" + fechaCompleta.getMonth() + 1 
            + "-" + fechaCompleta.getDate();
        }

        ctrl.obtenerEspaciosAcademicosInscritos = function(idTrabajoGrado) {
            var espaciosAcademicosInscritos = [];
            var parametrosEspaciosAcademicos = $.param({
                query: "TrabajoGrado.Id:" + idTrabajoGrado,
                limit: 0
            });
            poluxRequest.get("espacio_academico_inscrito", parametrosEspaciosAcademicos)
            .then(function(espaciosAcademicosConsultados) {
                if (espaciosAcademicosConsultados) {
                    angular.forEach(espaciosAcademicosConsultados, function(espacioAcademicoConsultado) {
                        espaciosAcademicosInscritos.push(espacioAcademicoRegistrado);
                    });
                }
            });
            return espaciosAcademicosInscritos;
        }

        ctrl.solicitarRegistroPago = function() {
            var defered = $q.defer();

            angular.forEach(ctrl.cuadriculaEspaciosAcademicos.data, function(espacioAcademico) {
                ctrl.espaciosAcademicosCalificados.push({
                    Nota: espacioAcademico.Nota,
                    EspaciosAcademicosElegibles: {
                        Id: espacioAcademico.Id
                    },
                    EstadoEspacioAcademicoInscrito: {
                        // El espacio académico inscrito ha sido cursado, pues la nota se está registrando
                        Id: 3
                    },
                    TrabajoGrado: {
                        Id: espacioAcademico.TrabajoGrado
                    }
                });
            });

            ctrl.dataRegistrarNota = {
                "EspaciosAcademicosCalificados": ctrl.espaciosAcademicosCalificados
            };

            poluxRequest
            .post("tr_registrar_nota", ctrl.dataRegistrarNota)
            .then(function(respuesta) {
                defered.resolve(respuesta);
            })
            .catch(function(error){
                defered.reject(error);
            });
            return defered.promise;
        }

    });