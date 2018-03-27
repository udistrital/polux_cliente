'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:MateriasPosgradoListarSolicitudesCtrl
 * @description
 * # MateriasPosgradoListarSolicitudesCtrl
 * Controller of the poluxClienteApp
 */
 angular.module('poluxClienteApp')
 .controller('MateriasPosgradoListarSolicitudesCtrl', function (sesionesRequest, $translate, $q, uiGridConstants, poluxMidRequest, poluxRequest, academicaRequest, $scope, $mdDialog, $timeout, $window) {
  $scope.$ = $;

  $scope.loadParametros = true;
  $scope.cargandoParametros = $translate.instant("LOADING.CARGANDO_PARAMETROS");
  $scope.cargandoSolicitudes = $translate.instant("LOADING.CARGANDO_SOLICITUDES");

  var ctrl = this;


  ctrl.periodo = [];
  ctrl.carreras = [];
  ctrl.otro = [];
    //cedula coordinador
    $scope.userId = "12237136";
    //uigrid
    ctrl.gridOptions = {
      enableSorting: false,
    };

    ctrl.gridOptions.columnDefs = [{
      name: 'solicitud',
      displayName: 'Solicitud',
      width: "8%"
    },
    {
      name: 'fecha',
      displayName: 'Fecha',
      type: 'date',
      cellFilter: 'date:\'yyyy-MM-dd\'',
      width: "8%"
    },
    {
      name: 'estudiante',
      displayName: 'Código',
      width: "10%"
    },
    {
      name: 'nombre',
      displayName: 'Nombre',
      width: "23%"
    },
    {
      name: 'promedio',
      displayName: 'Promedio',
      width: "10%",
      sort: {
        direction: uiGridConstants.DESC,
        priority: 0
      }
    },
    {
      name: 'rendimiento',
      displayName: 'Rendimiento Académico',
      width: "15%",
      sort: {
        direction: uiGridConstants.DESC,
        priority: 1
      }
    },
    {
      name: 'estado.Nombre',
      displayName: 'Estado',
      width: "16%"
    },
    {
      name: 'aprobar',
      displayName: 'Admitir',
      width: "10%",
      cellTemplate: '<center><md-checkbox class="blue" ng-model="row.entity.aprobado" aria-label="checkbox" ng-if="row.entity.permitirAprobar" > </md-checkbox> <div ng-if="!row.entity.permitirAprobar">{{"SOLICITUD_NO_PUEDE_APROBARSE"| translate}}</div><center>',
    }
    ];


    /*
    poluxMidRequest.get("fechas/ObtenerFechas").then(function (response) {
      var momentDate = null;

      $scope.fechaActual = new Date();
      momentDate = moment($scope.fechaActual);
      $scope.fechaActual = momentDate.format("YYYY-MM-DD");

      $scope.fecha_inicio = new Date(response.data['inicio_proceso'].replace(/'/g, ""));
      momentDate = moment($scope.fecha_inicio);
      $scope.fecha_inicio = momentDate.format("YYYY-MM-DD");

      $scope.fecha_fin = new Date(response.data['fecha_fin'].replace(/'/g, ""));
      momentDate = moment($scope.fecha_fin);
      $scope.fecha_fin = momentDate.format("YYYY-MM-DD");

      $scope.segunda_fecha = new Date(response.data['segunda_fecha'].replace(/'/g, ""));
      momentDate = moment($scope.segunda_fecha);
      $scope.segunda_fecha = momentDate.format("YYYY-MM-DD");

      $scope.cupos_excelencia_ingresado = null;
      $scope.cupos_adicionales_ingresado = null;
      //Consultar cupos
      poluxMidRequest.get("cupos/Obtener").then(function (response) {
        console.log(response.data);
        $scope.cupos_excelencia = response.data.Cupos_excelencia;
        $scope.cupos_adicionales = response.data.Cupos_adicionales;
      });

    }).catch(function (rta) {
      console.log(rta);
    });
    */
    ctrl.getPeriodo  = function(){
      var defer =  $q.defer()
      academicaRequest.get("periodo_academico", "X")
      .then(function (responsePeriodo) {
        if (!angular.isUndefined(responsePeriodo.data.periodoAcademicoCollection.periodoAcademico)) {
          ctrl.periodo = responsePeriodo.data.periodoAcademicoCollection.periodoAcademico[0];
          defer.resolve(ctrl.periodo);
        }else{
          ctrl.mensajeError = $translate.instant("ERROR.SIN_PERIODO");
          defer.reject("sin periodo");
        }        
      })
      .catch(function(){
        ctrl.mensajeError = $translate.instant("ERROR.CARGAR_PERIODO");
        defer.reject("no se pudo cargar periodo");
      }); 
      return defer.promise;
    }
    
    ctrl.getCarrerasCoordinador = function(){
      var defer =  $q.defer()
      academicaRequest.get("coordinador_carrera", [$scope.userId, "POSGRADO"])
      .then(function (responseCarreras) {
        console.log(responseCarreras);
        if (!angular.isUndefined(responseCarreras.data.coordinadorCollection.coordinador)) {
          ctrl.carreras = responseCarreras.data.coordinadorCollection.coordinador;
          defer.resolve(ctrl.carreras);
        }else{
          ctrl.mensajeError = $translate.instant("ERROR.SIN_CARRERAS_POSGRADO");
          defer.reject("no hay carreras");
        }
      })
      .catch(function(){
        ctrl.mensajeError = $translate.instant("ERROR.CARGAR_CARRERAS");
        defer.reject("no se pudo cargar carreras")
      });
      return defer.promise
    }


    ctrl.getFechas = function(periodo){
      var defer =  $q.defer()
      var momentDate = null;
      $scope.fechaActual = moment(new Date()).format("YYYY-MM-DD HH:mm");
      //traer fechas
      var parametrosSesiones = $.param({
        query:"SesionPadre.periodo:"+periodo.anio+periodo.periodo,
        limit:0
      });
      sesionesRequest.get("relacion_sesiones",parametrosSesiones).then(function(responseFechas){
        if(responseFechas.data !== null){
          ctrl.fechas = responseFechas.data;
          angular.forEach(ctrl.fechas, function(fecha){
            //console.log(fecha.SesionHijo);
            var fechaInicio = new Date(fecha.SesionHijo.FechaInicio);
            fechaInicio.setTime( fechaInicio.getTime() + fechaInicio.getTimezoneOffset()*60*1000 );;
            var fechaFin = new Date(fecha.SesionHijo.FechaFin);
            fechaFin.setTime( fechaFin.getTime() + fechaFin.getTimezoneOffset()*60*1000 );
            fecha.inicio = moment(fechaInicio).format("YYYY-MM-DD HH:mm");
            fecha.fin = moment(fechaFin).format("YYYY-MM-DD HH:mm");
            //fecha.inicio = moment(new Date(fecha.SesionHijo.FechaInicio)).format("YYYY-MM-DD HH:MM");
            //fecha.fin = moment(new Date(fecha.SesionHijo.FechaFin)).format("YYYY-MM-DD HH:MM");           
            if(fecha.SesionHijo.TipoSesion.Id===4){
              //primera fecha de selección de admitidos
              ctrl.primeraFecha = fecha;
              //console.log(fecha.inicio, ctrl.primeraFecha.inicio<=$scope.fechaActual && ctrl.primeraFecha.fin>=$scope.fechaActual);
            } else if(fecha.SesionHijo.TipoSesion.Id===6){
              //segunda fecha de selección de admitidos
              ctrl.segundaFecha = fecha;
            }
          });
          defer.resolve(ctrl.fechas);
        }else{
          ctrl.mensajeError = $translate.instant("ERROR.SIN_FECHAS_MODALIDAD_POSGRADO");
          defer.reject("no hay fechas registradas");
        }
      })
      .catch(function(){
        ctrl.mensajeError = $translate.instant("ERROR.CARGAR_FECHAS_MODALIDAD_POSGRADO");
        defer.reject("no se pudo cargar fechas")
      });
      return defer.promise
    }
    
    ctrl.cargarParametros = function(){
      ctrl.getPeriodo()
      .then(function(periodo){
        console.log(periodo)
        if(!angular.isUndefined(periodo)){
          $q.all([ctrl.getFechas(periodo),ctrl.getCarrerasCoordinador()])
          .then(function(){
            console.log(periodo)
            console.log(ctrl.fechas);
            console.log(ctrl.carreras);
            console.log("success");
            $scope.loadParametros = false;
          })
          .catch(function(error){
            console.log(ctrl.mensajeError);
            ctrl.errorCargarParametros = true;
            $scope.loadParametros = false;
          });
        }else{
          console.log(ctrl.mensajeError);
          ctrl.errorCargarParametros = true;
          $scope.loadParametros = false;
        }
      })
      .catch(function(error){
        console.log(ctrl.mensajeError);
        ctrl.errorCargarParametros = true;
        $scope.loadParametros = false;
      });
    }

    ctrl.cargarParametros();

    ctrl.cargarParametrosSolicitud = function(value){
      var defer = $q.defer();
      //buscar detalle_tipo_solicitud=37->detalle de Espacios academicos
      var parametros = $.param({
        query: "DetalleTipoSolicitud:37" + ",SolicitudTrabajoGrado:" + value.SolicitudTrabajoGrado.Id
      });
      poluxRequest.get("detalle_solicitud", parametros).then(function (detalleSolicitud) {
        if (detalleSolicitud.data !== null) {
          var carreraSolicitud = JSON.parse(detalleSolicitud.data[0].Descripcion.split("-")[1]);

          if (ctrl.carrera == carreraSolicitud.Codigo) {
            var parametros = $.param({
              query: "SolicitudTrabajoGrado:" + value.SolicitudTrabajoGrado.Id
            });
            poluxRequest.get("usuario_solicitud", parametros).then(function (usuarioSolicitud) {

              academicaRequest.get("periodo_academico", "P").then(function (periodoAnterior) {

                academicaRequest.get("datos_estudiante", [usuarioSolicitud.data[0].Usuario, periodoAnterior.data.periodoAcademicoCollection.periodoAcademico[0].anio, periodoAnterior.data.periodoAcademicoCollection.periodoAcademico[0].periodo]).then(function (response2) {
                  if (!angular.isUndefined(response2.data.estudianteCollection.datosEstudiante)) {
                    var solicitud = {
                      "solicitud": value.SolicitudTrabajoGrado.Id,
                      "fecha": value.Fecha,
                      "estudiante": usuarioSolicitud.data[0].Usuario,
                      "nombre": response2.data.estudianteCollection.datosEstudiante[0].nombre,
                      "promedio": response2.data.estudianteCollection.datosEstudiante[0].promedio,
                      "rendimiento": response2.data.estudianteCollection.datosEstudiante[0].rendimiento,
                      "estado": value.EstadoSolicitud,
                      "aprobado": false,
                              //"respuesta": ""+value.Id,
                              "respuestaSolicitud": value
                    };
                    console.log(solicitud.estado);
                    if(solicitud.estado.Id==3 || solicitud.estado.Id==5){
                      solicitud.permitirAprobar = true;
                    }else{
                      solicitud.permitirAprobar = false;
                    }
                    $scope.sols.push(solicitud);
                            
                  }
                  defer.resolve();
                });

              });

            });
          }else{
            defer.resolve();
          }
        }else{
          defer.resolve();
        }
      });
      return defer.promise;
    }

    //solicitudes iniciales de la modalidad de materias de posgrado
    ctrl.buscarSolicitudes = function (carrera) {

      $scope.loadSolicitudes = true;
      ctrl.carrera = carrera;
      $scope.carrera = carrera;
      if (carrera) {
        $scope.sols = [];

        var parametros = $.param({
          query: "Activo:true,EstadoSolicitud.Id.in:3|5|7|8,SolicitudTrabajoGrado.ModalidadTipoSolicitud.Id:13",
          limit: 0
        });
        poluxRequest.get("respuesta_solicitud", parametros).then(function (respuestaSolicitud) {
          var promises = [];
          angular.forEach(respuestaSolicitud.data, function (value) {
            if (value != null) {
              promises.push(ctrl.cargarParametrosSolicitud(value));
            }
          });
          $q.all(promises).then(function(){
            $scope.loadSolicitudes = false;
          })
        });

        ctrl.gridOptions.data = $scope.sols;

      }
    }

    ctrl.seleccionAdmitidos = function (sols, rta) {
      //Enviar las solicitudes y # Admitidos
      $scope.rta3 = {
        'Usuario': $scope.userId,
        'Fecha': new Date(),
        'NumAdmitidos': rta,
        'Solicitudes': sols
      };
      console.log($scope.rta3);

      poluxMidRequest.post("seleccion/Seleccionar", $scope.rta3).then(function (response) {
        swal(
          'Solicitudes aprobadas',
          'Las solicitudes en la modalidad de espacios académicos de posgrado han sido aprobadas',
          'success'
          )
        //recargar datos
        ctrl.buscarSolicitudes($scope.carrera);
      });

    }

    ctrl.buscarEstudianteTg = function (tg) {
      var parametros = $.param({
        query: "IdTrabajoGrado:" + tg.IdTrabajoGrado.Id,
        fields: "CodigoEstudiante"
      });
      //buscar la solicitudes

      academicaRequest.get("periodo_academico", "P").then(function (periodoAnterior) {
        poluxRequest.get("estudiante_tg", parametros).then(function (response) {
          academicaRequest.get("datos_estudiante", [usuarioSolicitud.data[0].CodigoEstudiante, periodoAnterior.data.periodoAcademicoCollection.periodoAcademico[0].anio, periodoAnterior.data.periodoAcademicoCollection.periodoAcademico[0].periodo]).then(function (response2) {
            if (!angular.isUndefined(response2.data.estudianteCollection.datosEstudiante)) {
              var solicitud = {
                "solicitud": tg.Id,
                "fecha": tg.Fecha,
                "estudiante": response.data[0].CodigoEstudiante.toString(),
                "nombre": response2.data.estudianteCollection.datosEstudiante[0].nombre,
                "promedio": response2.data.estudianteCollection.datosEstudiante[0].promedio,
                "rendimiento": response2.data.estudianteCollection.datosEstudiante[0].rendimiento,
                "estado": tg.Estado,
                "formalizacion": tg.Formalizacion
              };
              $scope.sols.push(solicitud);
            }
          });

        });
      });

    }

    ctrl.gridOptions.onRegisterApi = function (gridApi) {
      ctrl.gridApi = gridApi
    };

    ctrl.solicitudes2 = function () {

      if ($scope.carrera) {
        $scope.aprobadas = [];
        $scope.aprobadas2 = [];
        ctrl.aprobadasPago = [];
        ctrl.solsBase = [];

        /*Solicitudes aprobadas y con formalizacion pendiente (7) quedan en estado rechazado (5)
        Se deben cancelar las Solicitudes aprobadas con formalizacion:pendiente*/
        var parametros = $.param({
          query: "EstadoSolicitud.Id:7",
          limit: 0
        });
        poluxRequest.get("respuesta_solicitud", parametros).then(function (respuestaSolicitud) {
          angular.forEach(respuestaSolicitud.data, function (value) {
            //verificar carrera solicitada por el estudiante corresponda con carrera del coordinador
            if (value != null) {
              var parametros = $.param({
                query: "DetalleTipoSolicitud:37" + ",SolicitudTrabajoGrado:" + value.SolicitudTrabajoGrado.Id
              });
              poluxRequest.get("detalle_solicitud", parametros).then(function (detalleSolicitud) {
                if (detalleSolicitud.data != null) {
                  console.log(detalleSolicitud.data[0].Descripcion);
                  var res = detalleSolicitud.data[0].Descripcion.split(",");
                  //carrera solicitada
                  var carreraSolicitud = JSON.parse(detalleSolicitud.data[0].Descripcion.split("-")[1]);
                  if ($scope.carrera == carreraSolicitud.Codigo) {
                    value.EstadoSolicitud.Id = 5;
                    poluxRequest.put("respuesta_solicitud", value.Id, value).then(function (response) {
                      console.log("response.data confirmado: " + response.data);
                    });
                  }
                }
              });
            }
          });
        });

        /* Se deben cancelar las Solicitudes aprobadas con pago y que tengan formalizacion:pendiente */
        var parametros = $.param({
          query: "EstadoSolicitud.Id:8",
          limit: 0
        });
        poluxRequest.get("respuesta_solicitud", parametros).then(function (respuestaSolicitud) {
          angular.forEach(respuestaSolicitud.data, function (value) {
            //verificar carrera solicitada por el estudiante corresponda con carrera del coordinador
            if (value != null) {
              var parametros = $.param({
                query: "DetalleTipoSolicitud:37" + ",SolicitudTrabajoGrado:" + value.SolicitudTrabajoGrado.Id
              });
              poluxRequest.get("detalle_solicitud", parametros).then(function (detalleSolicitud) {
                if (detalleSolicitud.data != null) {
                  var res = detalleSolicitud.data[0].Descripcion.split(",");
                  //carrera solicitada
                  var carreraSolicitud = JSON.parse(detalleSolicitud.data[0].Descripcion.split("-")[1]);
                  if ($scope.carrera == carreraSolicitud.Codigo) {
                    value.EstadoSolicitud.Id = 5;
                    poluxRequest.put("respuesta_solicitud", value.Id, value).then(function (response) {
                      console.log("response.data confirmado: " + response.data);
                    });
                  }
                }
              });
            }
          });
        });

        //obtener # de cupos
        var parametros = $.param({
          query: "CodigoCarrera:" + ctrl.carrera + ",Anio:" + ctrl.periodo.anio + ",Periodo:" + ctrl.periodo.periodo
        });

        poluxRequest.get("carrera_elegible", parametros).then(function (response) {

          if (response.data[0].CuposExcelencia > 0 && response.data[0].CuposAdicionales > 0) {
            $scope.cupos_excelencia_ingresado = response.data[0].CuposExcelencia;
            $scope.cupos_adicionales_ingresado = response.data[0].CuposAdicionales;

            //sols aprobadas y con formalizacion:confirmado
            ctrl.totalSols = 0;

            var parametros = $.param({
              query: "EstadoSolicitud.Id:9",
              limit: 0
            });

            poluxRequest.get("respuesta_solicitud", parametros).then(function (response) {
              var arrayPromise = [];

              if (response.data != null) {
                angular.forEach(response.data, function (value) {
                  var defered = $q.defer();
                  var promise = defered.promise;

                  //verificar carrera solicitada por el estudiante corresponda con carrera del coordinador
                  if (value != null) {
                    var parametros = $.param({
                      query: "DetalleTipoSolicitud:37" + ",SolicitudTrabajoGrado:" + value.SolicitudTrabajoGrado.Id
                    });
                    poluxRequest.get("detalle_solicitud", parametros).then(function (detalleSolicitud) {
                      if (detalleSolicitud.data != null) {
                        var res = detalleSolicitud.data[0].Descripcion.split(",");
                        var carreraSolicitud = JSON.parse(detalleSolicitud.data[0].Descripcion.split("-")[1]);

                        defered.resolve(value);
                        if (ctrl.carrera == carreraSolicitud.Codigo) {
                          $scope.aprobadas.push(value);
                        }
                      }
                    });
                    arrayPromise.push(promise);
                  }
                });

              }

              var cuposDisponibles = 0;
              $q.all(arrayPromise).then(function () {
                console.log($scope.aprobadas);
                console.log($scope.aprobadas.length);
                if ($scope.aprobadas != null) {
                  ctrl.totalSols = $scope.aprobadas.length;
                  console.log(ctrl.totalSols);

                  if ($scope.cupos_excelencia_ingresado != ctrl.totalSols) {
                    cuposDisponibles = $scope.cupos_excelencia_ingresado - ctrl.totalSols;
                    console.log("HAY más cupos, Total:" + cuposDisponibles);
                  } else {
                    console.log("No hay más cupos");
                  }
                }
              }).catch(function (error) {
                console.log(error);
              });

              //sols aprobadas con pago y con formalizacion:confirmado
              var totalSolsPago = 0;
              var parametros = $.param({
                query: "EstadoSolicitud.Id:10",
                limit: 0
              });
              poluxRequest.get("respuesta_solicitud", parametros).then(function (response) {
                var arrayPromise = [];
                angular.forEach(response.data, function (value) {
                  var defered = $q.defer();
                  var promise = defered.promise;
                  //verificar carrera solicitada por el estudiante corresponda con carrera del coordinador
                  if (value != null) {
                    var parametros = $.param({
                      query: "DetalleTipoSolicitud:37" + ",SolicitudTrabajoGrado:" + value.SolicitudTrabajoGrado.Id
                    });
                    poluxRequest.get("detalle_solicitud", parametros).then(function (detalleSolicitud) {
                      if (detalleSolicitud.data != null) {
                        var res = detalleSolicitud.data[0].Descripcion.split(",");
                        //carrera solicitada
                        var carreraSolicitud = JSON.parse(detalleSolicitud.data[0].Descripcion.split("-")[1]);
                        defered.resolve(value);
                        if ($scope.carrera == carreraSolicitud.Codigo) {
                          ctrl.aprobadasPago.push(value.SolicitudTrabajoGrado);
                        }
                      }
                    });
                    arrayPromise.push(promise);
                  }
                });

                var cuposDisponiblesPago = 0;
                $q.all(arrayPromise).then(function () {
                  if (ctrl.aprobadasPago != null) {
                    totalSolsPago = ctrl.aprobadasPago.length;

                    if ($scope.cupos_adicionales_ingresado != totalSolsPago) {
                      cuposDisponiblesPago = $scope.cupos_adicionales_ingresado - totalSolsPago;
                      console.log("HAY más cupos, Total:" + cuposDisponiblesPago);
                    } else {
                      console.log("No hay más cupos");
                    }
                  }
                }).catch(function (error) {
                  console.log(error);
                });

                //buscar las solicitudes con estado:opcionado
                if ($scope.carrera) {

                  var parametros = $.param({
                    query: "EstadoSolicitud.Id:6",
                    limit: 0
                  });
                  //buscar las solicitudes
                  $scope.solsOpcionados = [];
                  poluxRequest.get("respuesta_solicitud", parametros).then(function (responseSolicitudes) {

                    angular.forEach(responseSolicitudes.data, function (value) {
                      console.log(value);
                      if (value != null) {
                        //buscar detalle_tipo_solicitud=37->detalle de Espacios academicos
                        var parametros = $.param({
                          query: "DetalleTipoSolicitud:37" + ",SolicitudTrabajoGrado:" + value.SolicitudTrabajoGrado.Id
                        });
                        poluxRequest.get("detalle_solicitud", parametros).then(function (detalleSolicitud) {
                          if (detalleSolicitud.data != null) {
                            var res = detalleSolicitud.data[0].Descripcion.split(",");
                            //código la carrera solicitada
                            var carreraSolicitud = JSON.parse(detalleSolicitud.data[0].Descripcion.split("-")[1]);

                            if (ctrl.carrera == carreraSolicitud.Codigo) {
                              var parametros = $.param({
                                query: "SolicitudTrabajoGrado:" + value.SolicitudTrabajoGrado.Id
                              });
                              poluxRequest.get("usuario_solicitud", parametros).then(function (usuarioSolicitud) {

                                academicaRequest.get("periodo_academico", "P").then(function (periodoAnterior) {
                                  academicaRequest.get("datos_estudiante", [usuarioSolicitud.data[0].Usuario, periodoAnterior.data.periodoAcademicoCollection.periodoAcademico[0].anio, periodoAnterior.data.periodoAcademicoCollection.periodoAcademico[0].periodo]).then(function (response2) {
                                    if (!angular.isUndefined(response2.data.estudianteCollection.datosEstudiante)) {

                                      var solicitud = {
                                        "solicitud": value.Id,
                                        "fecha": value.Fecha,
                                        "estudiante": usuarioSolicitud.data[0].Usuario,
                                        "nombre": response2.data.estudianteCollection.datosEstudiante[0].nombre,
                                        "promedio": response2.data.estudianteCollection.datosEstudiante[0].promedio,
                                        "rendimiento": response2.data.estudianteCollection.datosEstudiante[0].rendimiento,
                                        "estado": value.EstadoSolicitud,
                                        "respuesta": "" + value.Id
                                      };
                                      console.log(solicitud);
                                      ctrl.agregar($scope.solsOpcionados, solicitud);
                                      if ($scope.solsOpcionados.length == responseSolicitudes.data.length) {
                                        ctrl.rta = {
                                          'cupos_excelencia': cuposDisponibles,
                                          'cupos_adicionales': cuposDisponiblesPago
                                        };
                                        ctrl.seleccionAdmitidos($scope.solsOpcionados, ctrl.rta);
                                      }
                                    }
                                  });

                                });

                              });
                            }
                          }
                        });
                      }
                    });


                  });

                }

              });
});
}
});

}

}

ctrl.agregar = function (arreglo, solicitud) {
  arreglo.push(solicitud);
  console.log(arreglo);
}

ctrl.solicitudes3 = function () {
  console.log("Selección de admitidos 3");
      //Solicitudes aprobadas y con formalizacion pendiente quedan en estado rechazado
      //Se deben cancelar las Solicitudes aprobadas con formalizacion:pendiente
      var parametros = $.param({
        query: "EstadoSolicitud.Id:7",
        limit: 0
      });
      poluxRequest.get("respuesta_solicitud", parametros).then(function (response) {
        angular.forEach(response.data, function (value) {
          value.EstadoSolicitud.Id = 5;
          poluxRequest.put("respuesta_solicitud", value.Id, value).then(function (response) {
            console.log("response.data confirmado: " + response.data);
          });
        });
      });

      /* Se deben cancelar las Solicitudes aprobadas con pago y que tengan formalizacion:pendiente */
      var parametros = $.param({
        query: "EstadoSolicitud.Id:8",
        limit: 0
      });

      poluxRequest.get("respuesta_solicitud", parametros).then(function (response) {
        angular.forEach(response.data, function (value) {
          value.EstadoSolicitud.Id = 5;
          poluxRequest.put("respuesta_solicitud", value.Id, value).then(function (response) {
            console.log("response.data confirmado: " + response.data);
            swal(
              'Solicitudes aprobadas',
              'Las solicitudes en la modalidad de espacios académicos de posgrado han sido aprobadas',
              'success'
              )
            //recargar datos
            ctrl.buscarSolicitudes($scope.carrera);
          });
        });
      });

      swal(
        'Solicitudes aprobadas',
        'Se cancelan las solicitudes aprobadas/aprobadas con pago que no estén formalizadas',
        'success'
        )
      //recargar datos
      ctrl.buscarSolicitudes($scope.carrera);

    }

    ctrl.allsQ = [];
    ctrl.rendimiento = 0;
    ctrl.economicas = 0;

    ctrl.openDialog = function ($event) {
      $mdDialog.show({
        controller: function ($timeout, $q, $scope, $mdDialog) {


          var parametros = $.param({
            query: "CodigoCarrera:" + ctrl.carrera + ",Anio:" + ctrl.periodo.anio + ",Periodo:" + ctrl.periodo.periodo
          });
          poluxRequest.get("carrera_elegible", parametros).then(function (response) {
            console.log(response.data);
            if (response.data[0].CuposExcelencia > 0 && response.data[0].CuposAdicionales > 0) {
              $scope.cupos_excelencia_ingresado = response.data[0].CuposExcelencia;
              $scope.cupos_adicionales_ingresado = response.data[0].CuposAdicionales;
            }

          });

          var questList = this;
          $scope.cancel = function ($event) {
            $mdDialog.cancel();
          };
          $scope.finish = function ($event) {
            $mdDialog.hide();
          };
          $scope.answer = function (answer) {
            $mdDialog.hide(answer);
          };
        },

        controllerAs: 'self',
        templateUrl: 'dialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: $event,
        clickOutsideToClose: true,
        locals: {
          parent: $scope
        },
          //bindToController: true,


          scope: $scope,
          preserveScope: true,

        })
      .then(function (answer) {
        ctrl.status = answer;
        ctrl.rendimiento = $scope.cupos_excelencia_ingresado;
        ctrl.economicas = $scope.cupos_adicionales_ingresado;

        ctrl.rta = {
          'cupos_excelencia': ctrl.rendimiento,
          'cupos_adicionales': ctrl.economicas
        };

        ctrl.rta2 = {
          'NumAdmitidos': ctrl.rta,
          'Solicitudes': $scope.sols
        };
        console.log($scope.sols);

          //Guardar el # de cupos ingresados
          /* buscar carrera en carrera_elegible*/
          var parametros = $.param({
            query: "CodigoCarrera:" + $scope.carrera + ",Anio:" + ctrl.periodo.anio + ",Periodo:" + ctrl.periodo.periodo
          });
          poluxRequest.get("carrera_elegible", parametros).then(function (response) {

            if (response.data[0].CuposExcelencia == 0 && response.data[0].CuposAdicionales == 0) {
              response.data[0].CuposExcelencia = ctrl.rendimiento;
              response.data[0].CuposAdicionales = ctrl.economicas;

              poluxRequest.put("carrera_elegible", response.data[0].Id, response.data[0]).then(function (response) {
                console.log(response.data);
              });
            }

          });

          //Enviar las solicitudes y # Admitidos
          poluxMidRequest.post("seleccion/Seleccionar", ctrl.rta2).then(function (response) {
            swal(
              'Solicitudes aprobadas',
              'Las solicitudes en la modalidad de espacios académicos de posgrado han sido aprobadas',
              'success'
              )
            console.log(response);
            //recargar datos
            ctrl.buscarSolicitudes($scope.carrera);
          });
        }, function () {
          ctrl.status = 'You cancelled the dialog.';
        });
    };


    ctrl.admitidos1 = function () {
      ctrl.rendimiento = $scope.cupos_excelencia_ingresado;
      ctrl.economicas = $scope.cupos_adicionales_ingresado;

      ctrl.rta = {
        'cupos_excelencia': ctrl.rendimiento,
        'cupos_adicionales': ctrl.economicas
      };

      ctrl.rta2 = {
        'NumAdmitidos': ctrl.rta,
        'Solicitudes': $scope.sols
      };
      console.log($scope.sols);

      //Guardar el # de cupos ingresados
      /* buscar carrera en carrera_elegible*/
      var parametros = $.param({
        query: "CodigoCarrera:" + $scope.carrera + ",Anio:" + ctrl.periodo.anio + ",Periodo:" + ctrl.periodo.periodo
      });
      poluxRequest.get("carrera_elegible", parametros).then(function (response) {

        if (response.data[0].CuposExcelencia == 0 && response.data[0].CuposAdicionales == 0) {
          response.data[0].CuposExcelencia = ctrl.rendimiento;
          response.data[0].CuposAdicionales = ctrl.economicas;

          poluxRequest.put("carrera_elegible", response.data[0].Id, response.data[0]).then(function (response) {
            console.log(response.data);
          });
        }

      });

      //Enviar las solicitudes y # Admitidos
      poluxMidRequest.post("seleccion/Seleccionar", ctrl.rta2).then(function (response) {
        swal(
          'Solicitudes aprobadas',
          'Las solicitudes en la modalidad de espacios académicos de posgrado han sido aprobadas',
          'success'
          )
        console.log(response);
        //recargar datos
        ctrl.buscarSolicitudes($scope.carrera);
        $('#modalCupos').modal('hide');
        $scope.cupos_excelencia_ingresado = "";
        $scope.cupos_adicionales_ingresado = "";

      });
    }


    ///////////////////////////////////
    ctrl.admitidos = function () {
      ctrl.status = answer;
      ctrl.rendimiento = $scope.cupos_excelencia_ingresado;
      ctrl.economicas = $scope.cupos_adicionales_ingresado;

      ctrl.rta = {
        'cupos_excelencia': ctrl.rendimiento,
        'cupos_adicionales': ctrl.economicas
      };

      ctrl.rta2 = {
        'NumAdmitidos': ctrl.rta,
        'Solicitudes': $scope.sols
      };
      console.log($scope.sols);

      //Guardar el # de cupos ingresados
      /* buscar carrera en carrera_elegible*/
      var parametros = $.param({
        query: "CodigoCarrera:" + $scope.carrera + ",Anio:" + ctrl.periodo.anio + ",Periodo:" + ctrl.periodo.periodo
      });
      poluxRequest.get("carrera_elegible", parametros).then(function (response) {

        if (response.data[0].CuposExcelencia == 0 && response.data[0].CuposAdicionales == 0) {
          response.data[0].CuposExcelencia = ctrl.rendimiento;
          response.data[0].CuposAdicionales = ctrl.economicas;

          poluxRequest.put("carrera_elegible", response.data[0].Id, response.data[0]).then(function (response) {
            console.log(response.data);
          });
        }

      });

      //Enviar las solicitudes y # Admitidos
      poluxMidRequest.post("seleccion/Seleccionar", ctrl.rta2).then(function (response) {
        swal(
          'Solicitudes aprobadas',
          'Las solicitudes en la modalidad de espacios académicos de posgrado han sido aprobadas',
          'success'
          )
        console.log(response);
        //recargar datos
        ctrl.buscarSolicitudes($scope.carrera);
      });
    };

    ///////////////////////////////////

  });

