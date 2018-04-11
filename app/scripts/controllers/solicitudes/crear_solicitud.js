'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
 * @descriptioni
 * # SolicitudesCrearSolicitudCtrl
 * Controller of the poluxClienteApp
 */
 angular.module('poluxClienteApp')
.controller('SolicitudesCrearSolicitudCtrl', function(sesionesRequest, coreService, $window, $sce, $scope, nuxeo, $q, $translate, poluxMidRequest, poluxRequest, $routeParams, academicaRequest, cidcRequest, $location) {
  $scope.cargandoParametros = $translate.instant('LOADING.CARGANDO_PARAMETROS');
  $scope.enviandoFormulario = $translate.instant('LOADING.ENVIANDO_FORLMULARIO');
  $scope.cargandoDetalles = $translate.instant('LOADING.CARGANDO_DETALLES');
  $scope.loadParametros = true;

  //opciones infinite scroll
  $scope.infiniteScroll = {};
  $scope.infiniteScroll.numToAdd = 20;
  $scope.infiniteScroll.currentItems = 20;
  $scope.reloadScroll = function() {
    $scope.infiniteScrollcurrentItems = $scope.infiniteScroll.numToAdd;
  };
  $scope.addMoreItems = function() {
    $scope.infiniteScroll.currentItems += $scope.infiniteScroll.numToAdd;
  };

  var ctrl = this;
  ctrl.modalidades = [];
  ctrl.solicitudes = [];
  ctrl.detalles = [];
  ctrl.areas = [];
  ctrl.espaciosElegidos = [];
  ctrl.siModalidad = false;
  ctrl.modalidad_select = false;
  ctrl.detallesCargados = false;
  ctrl.soliciudConDetalles = true;
  //modalidad restringida ninguna
  ctrl.restringirModalidades = false;
  //estudiantes que estan en el tg
  ctrl.estudiantesTg = [];
  //estudiantes que se agregan a la solicitud inicial
  ctrl.estudiantes = [];
  ctrl.detallesConDocumento = [];
  ctrl.siPuede = false;
  ctrl.tieneProrrogas = false;
  ctrl.codigo = $routeParams.idEstudiante;

  //buscar prorrogas anteriores
  ctrl.getProrroga = function() {
    var defered = $q.defer();

    var parametrosTrabajoGrado = $.param({
      query: "TrabajoGrado.EstadoTrabajoGrado.Id:1,Estudiante:" + ctrl.codigo,
      limit: 1,
    });
    //se consulta el trabajo de grado actual
    poluxRequest.get("estudiante_trabajo_grado", parametrosTrabajoGrado).then(function(responseTrabajoGrado) {
      if (responseTrabajoGrado.data !== null) {
        //se consulta si el trabajo tiene solicitudes de proroga aprobadas
        var parametrosProrroga = $.param({
          query: "EstadoSolicitud:6,activo:TRUE,SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud.Id:7,SolicitudTrabajoGrado.TrabajoGrado.Id:" + responseTrabajoGrado.data[0].Id,
          limit: 1,
        });
        poluxRequest.get("respuesta_solicitud", parametrosProrroga).then(function(responseProrroga) {
          if (responseProrroga.data != null) {
            ctrl.tieneProrrogas = true;
          }
          defered.resolve(ctrl.tieneProrrogas);
        });
      } else {
        defered.resolve(ctrl.tieneProrrogas);
      }
    });
    return defered.promise;
  }

  ctrl.verificarSolicitudes = function() {
    var defered = $q.defer();
    var parametrosUser = $.param({
      query: "usuario:" + ctrl.codigo,
      limit: 0,
    });
    var actuales = [];

    var requestRespuesta = function(solicitudesActuales, id) {
      var defered = $q.defer();

      var parametrosSolicitudesActuales = $.param({
        query: "EstadoSolicitud.in:1,activo:TRUE,SolicitudTrabajoGrado:" + id,
        limit: 1,
      });
      poluxRequest.get("respuesta_solicitud", parametrosSolicitudesActuales).then(function(responseSolicitudesActuales) {
        if (responseSolicitudesActuales.data != null) {
          solicitudesActuales.push(responseSolicitudesActuales.data[0]);
          defered.resolve(responseSolicitudesActuales.data);
        } else {
          defered.resolve(responseSolicitudesActuales.data);
        }
      })
      .catch(function(error){
        ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_RESPUESTA_SOLICITUD");
        defered.reject(error);
      });
      return defered.promise;
    }

    var requestRespuestaMateriasPosgrado = function(solicitudesActuales, id) {
      var defered = $q.defer();

      var parametrosSolicitudesActuales = $.param({
        query: "EstadoSolicitud.in:1|3|4|5|7|9|10,activo:TRUE,SolicitudTrabajoGrado:" + id,
        limit: 1,
      });
      poluxRequest.get("respuesta_solicitud", parametrosSolicitudesActuales).then(function(responseSolicitudesActuales) {
        if (responseSolicitudesActuales.data != null) {
          solidcitudesActuales.push(responseSolicitudesActuales.data[0]);
          defered.resolve(responseSolicitudesActuales.data);
        } else {
          defered.resolve(responseSolicitudesActuales.data);
        }
      })
      .catch(function(error){
        ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_RESPUESTA_SOLICITUD");
        defer.reject(error);
      });
      return defered.promise;
    }

    poluxRequest.get("usuario_solicitud", parametrosUser).then(function(responseUser) {
      var solicitudesUsuario = responseUser.data;
      var promesas = [];
      //solicitud de prorogga
      promesas.push(ctrl.getProrroga());
      //otras solicitudes
      angular.forEach(solicitudesUsuario, function(solicitud) {
        //console.log(solicitud.SolicitudTrabajoGrado.Id);
        if (solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.Id != 13) {
          promesas.push(requestRespuesta(actuales, solicitud.SolicitudTrabajoGrado.Id));
        } else {
          promesas.push(requestRespuestaMateriasPosgrado(actuales, solicitud.SolicitudTrabajoGrado.Id));
        }
      });
      $q.all(promesas).then(function() {
        console.log("actuales", actuales);
        if (actuales.length == 0) {
          console.log("si se puede");
          defered.resolve(true);
          //}else if(actuales.length == 1 && actuales[0].SolicitudTrabajoGrado.ModalidadTipoSolicitud.Id === 13 ){
        } else if (actuales[0].SolicitudTrabajoGrado.ModalidadTipoSolicitud.Id === 13) {
          console.log(actuales);
          console.log("es inicial y se deben restringir las demás");
          ctrl.restringirModalidades = true;
          defered.resolve(true);
        } else {
          console.log("No puedes");
          defered.resolve(false);
        }
      })
      .catch(function(error){
        defered.reject(error);
      });
    })
    .catch(function(error){
      ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGA_SOLICITUDES");
      defered.reject(error);
    });
    return defered.promise;
  }

  ctrl.obtenerDatosEstudiante = function() {
    var defer = $q.defer();
    academicaRequest.get("datos_estudiante", [ctrl.codigo, ctrl.periodoAnterior.anio, ctrl.periodoAnterior.periodo]).then(function(response2) {
      if (!angular.isUndefined(response2.data.estudianteCollection.datosEstudiante)) {
        ctrl.estudiante = {
          "Codigo": ctrl.codigo,
          "Nombre": response2.data.estudianteCollection.datosEstudiante[0].nombre,
          "Modalidad": ctrl.modalidad,
          "Tipo": "POSGRADO",
          "PorcentajeCursado": response2.data.estudianteCollection.datosEstudiante[0].creditosCollection.datosCreditos[0].porcentaje.porcentaje_cursado[0].porcentaje_cursado,
          "Promedio": response2.data.estudianteCollection.datosEstudiante[0].promedio,
          "Rendimiento": response2.data.estudianteCollection.datosEstudiante[0].rendimiento,
          "Estado": response2.data.estudianteCollection.datosEstudiante[0].estado,
          "Nivel": response2.data.estudianteCollection.datosEstudiante[0].nivel,
          "TipoCarrera": response2.data.estudianteCollection.datosEstudiante[0].nombre_tipo_carrera,
          "Carrera": response2.data.estudianteCollection.datosEstudiante[0].carrera
        };
        if (ctrl.estudiante.Nombre === undefined) {
          ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_DATOS_ESTUDIANTE");
          defer.reject("datos del estudiante invalidos");
        } else {
          ctrl.estudiante.asignaturas_elegidas = [];
          ctrl.estudiante.areas_elegidas = [];
          ctrl.estudiante.minimoCreditos = false;
          defer.resolve(ctrl.estudiante);
        }
      } else {
        ctrl.mensajeErrorCarga = $translate.instant("ERROR.ESTUDIANTE_NO_ENCONTRADO");
        defer.reject("no se encuentran datos estudiante");
      }
    })
    .catch(function(error) {
      ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_DATOS_ESTUDIANTE");
      defer.reject(error);
    });
    return defer.promise;
  }

  ctrl.getPeriodoAnterior= function() {
    var defer = $q.defer()
    academicaRequest.get("periodo_academico", "P")
      .then(function(responsePeriodo) {
        if (!angular.isUndefined(responsePeriodo.data.periodoAcademicoCollection.periodoAcademico)) {
          ctrl.periodoAnterior = responsePeriodo.data.periodoAcademicoCollection.periodoAcademico[0];
          defer.resolve();
        } else {
          ctrl.mensajeErrorCarga = $translate.instant("ERROR.SIN_PERIODO");
          defer.reject("sin periodo");
        }
      })
      .catch(function(error) {
        ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_PERIODO");
        defer.reject(error);
      });
    return defer.promise;
  }

  ctrl.getPeriodoSiguiente = function() {
    var defer = $q.defer()
    academicaRequest.get("periodo_academico", "X")
      .then(function(responsePeriodo) {
        if (!angular.isUndefined(responsePeriodo.data.periodoAcademicoCollection.periodoAcademico)) {
          ctrl.periodoSiguiente = responsePeriodo.data.periodoAcademicoCollection.periodoAcademico[0];
          defer.resolve();
        } else {
          ctrl.mensajeErrorCarga = $translate.instant("ERROR.SIN_PERIODO");
          defer.reject("sin periodo");
        }
      })
      .catch(function(error) {
        ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_PERIODO");
        defer.reject(error);
      });
    return defer.promise;
  }

  ctrl.getPeriodoActual = function() {
    var defer = $q.defer()
    academicaRequest.get("periodo_academico", "A")
      .then(function(responsePeriodo) {
        if (!angular.isUndefined(responsePeriodo.data.periodoAcademicoCollection.periodoAcademico)) {
          ctrl.periodoActual = responsePeriodo.data.periodoAcademicoCollection.periodoAcademico[0];
          ctrl.periodo = ctrl.periodoActual.anio + ctrl.periodoActual.periodo;
          defer.resolve();
        } else {
          ctrl.mensajeErrorCarga = $translate.instant("ERROR.SIN_PERIODO");
          defer.reject("sin periodo");
        }
      })
      .catch(function(error) {
        ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_PERIODO");
        defer.reject(error);
      });
    return defer.promise;
  }

  ctrl.obtenerAreas = function() {
    var defer = $q.defer();
    var parametrosAreas = $.param({
      query: "Activo:TRUE",
      limit: 0,
    });
    poluxRequest.get("area_conocimiento", parametrosAreas).then(function(responseAreas) {
      ctrl.areas = responseAreas.data;
      coreService.get("snies_area").then(function(responseAreas) {
        var areasSnies = responseAreas.data;
        angular.forEach(ctrl.areas, function(area) {
          angular.forEach(areasSnies, function(areaSnies) {
            if (area.SniesArea === areaSnies.Id) {
              area.Snies = areaSnies.Nombre;
            }
          });
        });
        console.log("areas", ctrl.areas);
        defer.resolve();
      })
      .catch(function(error) {
        ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_AREAS");
        defer.reject(error);
      });
    })
    .catch(function(error) {
      ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_AREAS");
      defer.reject(error);
    });
    return defer.promise;
  }

  ctrl.cargarTipoSolicitud = function(modalidad) {
    var defer = $q.defer();
    ctrl.solicitudes = [];
    var parametrosTiposSolicitudes = $.param({
      query: "Modalidad:" + modalidad + ",TipoSolicitud.Activo:TRUE",
      limit: 0,
    });
    poluxRequest.get("modalidad_tipo_solicitud", parametrosTiposSolicitudes).then(function(responseTiposSolicitudes) {
      //ctrl.solicitudes = responseTiposSolicitudes.data;
      console.log("Prorrogas", ctrl.tieneProrrogas);
      if (ctrl.tieneProrrogas) {
        angular.forEach(responseTiposSolicitudes.data, function(solicitud) {
          //si la solicitud es diferente de una de prorroga
          if (solicitud.TipoSolicitud.Id !== 7) {
            ctrl.solicitudes.push(solicitud);
          }
        });
      } else {
        ctrl.solicitudes = responseTiposSolicitudes.data;
      }
      defer.resolve(ctrl.solicitudes);
    })
    .catch(function(error) {
      ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_TIPOS_SOLICITUD");
      defer.reject(error);
    });
    return defer.promise;
  };


  ctrl.getTrabajoGrado = function(){
    var defer = $q.defer();

    var getEstudiantesTg = function(idTrabajoGrado){
      var defer =  $q.defer();
      var parametros = $.param({
        query: "EstadoEstudianteTrabajoGrado.Id:1,TrabajoGrado:" + idTrabajoGrado,
        limit: 0,
      });
      poluxRequest.get("estudiante_trabajo_grado", parametros).then(function(autoresTg) {
        angular.forEach(autoresTg.data, function(estudiante) {
          if (estudiante.Estudiante !== ctrl.codigo) {
            ctrl.estudiantesTg.push(estudiante.Estudiante);
          }
        });
        defer.resolve();
      })
      .catch(function(error){
        ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_DATOS_TRABAJOS");
        defer.reject(error);
      });
      return defer.promise;
    }

    var getVinculadosTg = function(idTrabajoGrado){
      var defer =  $q.defer();
      var parametrosVinculacion = $.param({
          query: "TrabajoGrado:" + idTrabajoGrado + ",Activo:true",
          limit: 0
      });
      poluxRequest.get("vinculacion_trabajo_grado", parametrosVinculacion).then(function(responseVinculacion) {
        ctrl.Trabajo.evaluadores = [];
        angular.forEach(responseVinculacion.data, function(vinculado) {
          if (vinculado.RolTrabajoGrado.Id == 1) {
            ctrl.Trabajo.directorInterno = vinculado;
          }
          if (vinculado.RolTrabajoGrado.Id == 2) {
            ctrl.Trabajo.directorExterno = vinculado;
          }
          if (vinculado.RolTrabajoGrado.Id == 3) {
            ctrl.Trabajo.evaluadores.push(vinculado);
          }
        });
        console.log("directorInterno", ctrl.Trabajo.directorInterno);
        console.log("directorExterno", ctrl.Trabajo.directorExterno);
        console.log("evaluadores", ctrl.Trabajo.evaluadores);
        defer.resolve();
      })
      .catch(function(error){
        ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_DATOS_TRABAJOS");
        defer.reject(error);
      });
      return defer.promise;
    }

    var getEspaciosInscritos = function(idTrabajoGrado){
      var defer = $q.defer();
      var parametrosEspacios = $.param({
        query: "trabajo_grado:" + idTrabajoGrado,
        limit: 0
      });
      poluxRequest.get("espacio_academico_inscrito", parametrosEspacios).then(function(responseEspacios) {
        if (responseEspacios.data != null) {
          angular.forEach(responseEspacios.data, function(espacio) {
            ctrl.espaciosElegidos.push(espacio.EspaciosAcademicosElegibles);
          });
          console.log("espacios", ctrl.espaciosElegidos);
          ctrl.carreraElegida = responseEspacios.data[0].EspaciosAcademicosElegibles.CarreraElegible.Id;
        }
        defer.resolve();
      })
      .catch(function(error){
        ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_DATOS_TRABAJOS");
        defer.reject(error);
      });
      return defer.promise;
    }

    var getModalidades = function(){
      var defer = $q.defer();
      poluxRequest.get("modalidad").then(function(responseModalidad) {
        ctrl.modalidades = [];
        if (ctrl.restringirModalidades) {
          angular.forEach(responseModalidad.data, function(modalidad) {
            if (modalidad.Id == 2) {
              ctrl.modalidades.push(modalidad);
            }
          });
        } else {
          ctrl.modalidades = responseModalidad.data;
        }
        defer.resolve();
      })
      .catch(function(error){
        ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_TIPOS_SOLICITUD");
        defer.reject(error);
      });
      return defer.promise;
    }

    var getSolicitudesAnteriores = function(){
      var defer = $q.defer();
      var parametrosSolicitudes = $.param({
        query: "Usuario:" + ctrl.codigo + ",SolicitudTrabajoGrado.ModalidadTipoSolicitud.Id:13",
        limit: 1,
      });
      poluxRequest.get("usuario_solicitud", parametrosSolicitudes).then(function(responseSolicitudes) {
        if (responseSolicitudes.data !== null) {
          //si ha hecho una solicitud se obtienen las materias por el detalle
          var idSolicitud = responseSolicitudes.data[0].SolicitudTrabajoGrado.Id;
          var parametrosSolicitud = $.param({
            query: "SolicitudTrabajoGrado:" + idSolicitud + ",DetalleTipoSolicitud:37",
            limit: 1,
          });
          poluxRequest.get("detalle_solicitud", parametrosSolicitud).then(function(responseSolicitud) {
            //se obtiene guarda la carrera que ya eligio
            ctrl.carreraElegida = JSON.parse(responseSolicitud.data[0].Descripcion.split("-")[1]);
            defer.resolve();
          })
          .catch(function(error){
            ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_DATOS_TRABAJOS");
            defer.reject(error);
          });
        }else{
          defer.resolve();
        }
      })
      .catch(function(error){
        ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_DATOS_TRABAJOS");
        defer.reject(error);
      });
      return defer.promise;
    }

    var parametrosTrabajoEstudiante = $.param({
      query: "Estudiante:" + ctrl.codigo + ",EstadoEstudianteTrabajoGrado:1",
      limit: 1
    });
    poluxRequest.get("estudiante_trabajo_grado", parametrosTrabajoEstudiante).then(function(responseTrabajoEstudiante) {
      var promises = [];
      if (responseTrabajoEstudiante.data != null) {
        ctrl.Trabajo = responseTrabajoEstudiante.data[0];
        ctrl.modalidad = responseTrabajoEstudiante.data[0].TrabajoGrado.Modalidad.Id;
        ctrl.trabajo_grado_completo = responseTrabajoEstudiante.data[0].TrabajoGrado;
        ctrl.trabajo_grado = responseTrabajoEstudiante.data[0].TrabajoGrado.Id;
        ctrl.siModalidad = true;
        ctrl.modalidad_select = true;
        //buscar # de autores del tg
        promises.push(getEstudiantesTg(ctrl.trabajo_grado));
        promises.push(ctrl.cargarTipoSolicitud(ctrl.modalidad));
        promises.push(getVinculadosTg(ctrl.trabajo_grado));
        if (ctrl.modalidad == 2 || ctrl.modalidad == 3) {
          promises.push(getEspaciosInscritos(ctrl.trabajo_grado));
        }
      } else {
        promises.push(getModalidades());
        //obtener solicitudes iniciales anteriores hechas por el usuario modalidad de posgrado
        promises.push(getSolicitudesAnteriores());
      }

      $q.all(promises).then(function(){
        defer.resolve();
      })
      .catch(function(error){
        defer.reject(error);
      });
    })
    .catch(function(error){
      ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_DATOS_TRABAJOS");
      defer.reject(error);
    });
    return defer.promise;
  }

  ctrl.verificarSolicitudes().then(function(puede) {
    if(puede){
      var promises = [];
      promises.push(ctrl.getPeriodoActual());
      promises.push(ctrl.getPeriodoAnterior());
      promises.push(ctrl.getPeriodoSiguiente());
      promises.push(ctrl.obtenerAreas());
      promises.push(ctrl.getTrabajoGrado());
      $q.all(promises).then(function(){
        ctrl.obtenerDatosEstudiante().then(function(){
          $scope.loadParametros = false;
        })
        .catch(function(error){
          console.log(error)
          ctrl.errorCarga = true;
          $scope.loadParametros = false
        });
      })
      .catch(function(error){
        console.log(error)
        ctrl.errorCarga = true;
        $scope.loadParametros = false
      });
    }else{
      ctrl.mensajeErrorCarga = $translate.instant("ERROR.HAY_SOLICITUD_PENDIENTE");
      ctrl.errorCarga = true;
      $scope.loadParametros = false;
    }
  })
  .catch(function(error){
    console.log(error)
    ctrl.errorCarga = true;
    $scope.loadParametros = false;
  });

  ctrl.verificarRequisitos = function(tipoSolicitud, modalidad) {
    var defer = $q.defer();

    var obtenerPeriodo = function() {
      var defer = $q.defer()
      academicaRequest.get("periodo_academico", "X")
        .then(function(responsePeriodo) {
          if (!angular.isUndefined(responsePeriodo.data.periodoAcademicoCollection.periodoAcademico)) {
            ctrl.periodo = responsePeriodo.data.periodoAcademicoCollection.periodoAcademico[0];
            defer.resolve(ctrl.periodo);
          } else {
            ctrl.mensajeError = $translate.instant("ERROR.SIN_PERIODO");
            defer.reject("sin periodo");
          }
        })
        .catch(function() {
          ctrl.mensajeError = $translate.instant("ERROR.CARGAR_PERIODO");
          defer.reject("no se pudo cargar periodo");
        });
      return defer.promise;
    }

    var verificarRequisitosModalidad = function() {
      var deferModalidad = $q.defer();
      poluxMidRequest.post("verificarRequisitos/Registrar", ctrl.estudiante).then(function(responseModalidad) {
          var cumpleRequisitosModalidad = false;
          if (responseModalidad.data === "true") {
            cumpleRequisitosModalidad = true;
          }
          deferModalidad.resolve(cumpleRequisitosModalidad);
        })
        .catch(function() {
          ctrl.mensajeError = $translate.instant("ERROR.VALIDAR_REQUISITOS");
          defer.reject("no se pudo cargar requisitos");
        });
      return deferModalidad.promise;
    }

    var verificarFechas = function(tipoSolicitud, modalidad, periodo) {
      var deferFechas = $q.defer();
      //si la solicitud es de materias de posgrado e inicial
      if (tipoSolicitud === 2 && modalidad === 2) {
        ctrl.periodo = ctrl.periodoSiguiente.anio + ctrl.periodoSiguiente.periodo;
        ctrl.fechaActual = moment(new Date()).format("YYYY-MM-DD HH:mm");
        //traer fechas
        var parametrosSesiones = $.param({
          query: "SesionHijo.TipoSesion.Id:3,SesionPadre.periodo:" + periodo.anio + periodo.periodo,
          limit: 1
        });
        sesionesRequest.get("relacion_sesiones", parametrosSesiones).then(function(responseFechas) {
            if (responseFechas.data !== null) {
              console.log(responseFechas.data[0]);
              var sesion = responseFechas.data[0];
              var fechaHijoInicio = new Date(sesion.SesionHijo.FechaInicio);
              fechaHijoInicio.setTime(fechaHijoInicio.getTime() + fechaHijoInicio.getTimezoneOffset() * 60 * 1000);
              ctrl.fechaInicio = moment(fechaHijoInicio).format("YYYY-MM-DD HH:mm");
              var fechaHijoFin = new Date(sesion.SesionHijo.FechaFin);
              fechaHijoFin.setTime(fechaHijoFin.getTime() + fechaHijoFin.getTimezoneOffset() * 60 * 1000);
              ctrl.fechaInicio = moment(fechaHijoInicio).format("YYYY-MM-DD HH:mm");
              ctrl.fechaFin = moment(fechaHijoFin).format("YYYY-MM-DD HH:mm");
              //console.log("fechas", ctrl.fechaInicio);
              //console.log("fechas", ctrl.fechaFin);
              if (ctrl.fechaInicio <= ctrl.fechaActual && ctrl.fechaActual <= ctrl.fechaFin) {
                deferFechas.resolve(true);
              } else {
                ctrl.textoErrorFechas = $translate.instant('ERROR.NO_EN_FECHAS_INSCRIPCION_POSGRADO');
                deferFechas.resolve(false);
              }
              console.log(ctrl.fechaFin);

            } else {
              ctrl.textoErrorFechas = $translate.instant('ERROR.SIN_FECHAS_MODALIDAD_POSGRADO');
              deferFechas.resolve(false);
            }
          })
          .catch(function() {
            ctrl.mensajeError = $translate.instant("ERROR.CARGAR_FECHAS_MODALIDAD_POSGRADO");
            defer.reject("no se pudo cargar fechas");
          });
      } else {
        deferFechas.resolve(true);
      }
      return deferFechas.promise;
    }

    obtenerPeriodo().then(function(periodo) {
      console.log("Periodo", ctrl.periodo)
      $q.all([verificarRequisitosModalidad(), verificarFechas(tipoSolicitud, modalidad, periodo)])
        .then(function(responseRequisitos) {
          var puede = responseRequisitos[0] && responseRequisitos[1];
          if (!responseRequisitos[0]) {
            ctrl.siPuede = true;
          } else if (!responseRequisitos[1]) {
            ctrl.puedeFechas = true;
          }
          defer.resolve(puede)
        })
        .catch(function(error) {
          defer.reject(error);
        });
    });

    return defer.promise;
  }

  ctrl.cargarDetalles = function(tipoSolicitudSeleccionada, modalidad_seleccionada) {
    $scope.loadDetalles = true;
    ctrl.siPuede = false;
    ctrl.detallesCargados = false;
    ctrl.estudiantes = [];
    ctrl.TipoSolicitud = tipoSolicitudSeleccionada;
    var tipoSolicitud = tipoSolicitudSeleccionada.Id;
    ctrl.ModalidadTipoSolicitud = tipoSolicitud;
    console.log(tipoSolicitudSeleccionada);
    if (modalidad_seleccionada !== undefined) {
      ctrl.estudiante.Modalidad = modalidad_seleccionada;
      ctrl.modalidad = modalidad_seleccionada;
    }
    console.log(ctrl.estudiante);
    //poluxMidRequest.post("verificarRequisitos/Registrar", ctrl.estudiante).then(function(puede){
    //if(puede.data==="true"){
    ctrl.verificarRequisitos(tipoSolicitudSeleccionada, modalidad_seleccionada).then(function(puede) {
      if (puede) {
        console.log("no hay solicitudes pendietnes");
        console.log(ctrl.estudiante);
        ctrl.soliciudConDetalles = true;
        ctrl.detalles = [];
        var parametrosDetalles;
        if (modalidad_seleccionada === undefined) {
          parametrosDetalles = $.param({
            query: "Activo:TRUE,ModalidadTipoSolicitud:" + tipoSolicitud,
            limit: 0,
            sortby: "NumeroOrden",
            order: "asc"
          });
        } else {
          parametrosDetalles = $.param({
            query: "Activo:TRUE,ModalidadTipoSolicitud.TipoSolicitud.Id:2,ModalidadTipoSolicitud.Modalidad.Id:" + modalidad_seleccionada,
            limit: 0,
            sortby: "NumeroOrden",
            order: "asc"
          });
          var parametrosModalidadTipoSolicitud = $.param({
            query: "TipoSolicitud.Activo:TRUE,TipoSolicitud.Id:2,Modalidad.Id:" + modalidad_seleccionada,
            limit: 1,

          });
          poluxRequest.get("modalidad_tipo_solicitud", parametrosModalidadTipoSolicitud).then(function(responseModalidadTipoSolicitud) {
            ctrl.ModalidadTipoSolicitud = responseModalidadTipoSolicitud.data[0].Id;
          });
        }
        poluxRequest.get("detalle_tipo_solicitud", parametrosDetalles).then(function(responseDetalles) {
          $scope.loadDetalles = false;
          ctrl.detalles = responseDetalles.data;
          console.log(ctrl.detalles);
          //Se cargan opciones de los detalles
          angular.forEach(ctrl.detalles, function(detalle) {
            //Se internacionalizan variables y se crean labels de los detalles
            detalle.label = $translate.instant(detalle.Detalle.Enunciado);
            detalle.respuesta = "";
            detalle.fileModel = null;
            detalle.opciones = [];
            //Se evalua si el detalle necesita cargar datos
            if (!detalle.Detalle.Descripcion.includes('no_service') && detalle.Detalle.TipoDetalle.Id !== 8) {
              //Se separa el strig
              var parametrosServicio = detalle.Detalle.Descripcion.split(";");
              var sql = "";
              var parametrosConsulta = [];
              //servicio de academiaca
              if (parametrosServicio[0] === "polux") {
                var parametros = $.param({
                  limit: 0
                });
                if (parametrosServicio[2] !== undefined) {
                  parametrosConsulta = parametrosServicio[2].split(",");
                  angular.forEach(parametrosConsulta, function(parametro) {
                    if (!parametro.includes(":")) {
                      if (parametro == "trabajo_grado") {
                        parametro = parametro + ":" + ctrl.trabajo_grado;
                      }
                      if (parametro == "carrera_elegible") {
                        parametro = parametro + ":" + ctrl.carreraElegida;
                      }
                      if (parametro == "activo") {
                        parametro = parametro;
                      }
                    }
                    if (sql === "") {
                      sql = parametro;
                    } else {
                      sql = sql + "," + parametro;
                    }
                  });
                  detalle.parametros = $.param({
                    query: sql,
                    limit: 0
                  });
                }
                console.log(detalle.parametros);
                poluxRequest.get(parametrosServicio[1], detalle.parametros).then(function(responseOpciones) {
                  if (detalle.Detalle.Nombre.includes("Nombre actual de la propuesta")) {
                    detalle.opciones.push({
                      "NOMBRE": responseOpciones.data[0].DocumentoEscrito.Titulo,
                      "bd": responseOpciones.data[0].DocumentoEscrito.Titulo,
                    });
                  } else if (detalle.Detalle.Nombre.includes("Actual resumen de la propuesta")) {
                    detalle.opciones.push({
                      "NOMBRE": responseOpciones.data[0].DocumentoEscrito.Resumen,
                      "bd": responseOpciones.data[0].DocumentoEscrito.Resumen
                    });
                  } else if (detalle.Detalle.Nombre.includes("Propuesta actual")) {
                    detalle.respuesta = responseOpciones.data[0].DocumentoEscrito.Enlace;

                    console.log("Documento", detalle.respuesta);
                  } else if (detalle.Detalle.Nombre.includes("Areas de conocimiento actuales")) {
                    console.log("Opciones", responseOpciones);
                    var areasString = "";
                    angular.forEach(responseOpciones.data, function(area) {
                      areasString = areasString + ", " + area.AreaConocimiento.Nombre;
                    });
                    detalle.opciones.push({
                      "NOMBRE": areasString.substring(2),
                      "bd": areasString.substring(2)
                    });
                  } else if (detalle.Detalle.Nombre.includes("Nombre Empresa")) {
                    angular.forEach(responseOpciones.data, function(empresa) {
                      detalle.opciones.push({
                        "NOMBRE": empresa.Identificacion + "",
                        "bd": empresa.Identificacion + "",
                      });
                    });
                  } else if (detalle.Detalle.Nombre.includes("Espacio Academico Anterior")) {
                    angular.forEach(responseOpciones.data, function(espacio) {
                      academicaRequest.get("asignatura_pensum",[espacio.EspaciosAcademicosElegibles.CodigoAsignatura,espacio.EspaciosAcademicosElegibles.CarreraElegible.CodigoPensum]).then(function(asignatura){
                          detalle.opciones.push({
                            "NOMBRE": asignatura.data.asignatura.datosAsignatura[0].nombre,
                            "bd": espacio.EspaciosAcademicosElegibles.CodigoAsignatura + '-' + asignatura.data.asignatura.datosAsignatura[0].nombre,
                          });
                        });
                    });
                  } else if (detalle.Detalle.Nombre.includes("Evaluador Actual")) {
                    console.log(responseOpciones.data);
                    angular.forEach(responseOpciones.data, function(evaluador) {

                      academicaRequest.get("docente_tg", [evaluador.Usuario]).then(function(docente) {
                        if (!angular.isUndefined(docente.data.docenteTg.docente)) {
                          detalle.opciones.push({
                            "NOMBRE": docente.data.docenteTg.docente[0].nombre,
                            "bd": docente.bd = docente.data.docenteTg.docente[0].id
                          });
                          console.log(detalle.opciones);
                        }
                      });
                    });
                  } else if (detalle.Detalle.Nombre.includes("Director Actual")) {
                    var parametrosDocentesUD = {
                      "identificacion": ctrl.Trabajo.directorInterno.Usuario
                    };
                    console.log("parametrosDocentesUD", parametrosDocentesUD);

                    academicaRequest.get("docente_tg", [ctrl.Trabajo.directorInterno.Usuario]).then(function(docente) {
                      if (!angular.isUndefined(docente.data.docenteTg.docente)) {
                        console.log("Respuesta docente", docente.data.docenteTg.docente);
                        detalle.opciones.push({
                          "NOMBRE": docente.data.docenteTg.docente[0].nombre,
                          //"bd":  docente.bd = docente[0].DIR_NRO_IDEN+"-"+docente[0].NOMBRE,
                          "bd": docente.bd = docente.data.docenteTg.docente[0].id
                        });
                        console.log(detalle.opciones);
                      }
                    });

                  } else if (detalle.Detalle.Nombre.includes("Espacio Academico Nuevo")) {
                    angular.forEach(responseOpciones.data, function(espacio) {
                      var esta = false;
                      angular.forEach(ctrl.espaciosElegidos, function(asignatura) {
                        if (espacio.CodigoAsignatura == asignatura.CodigoAsignatura) {
                          esta = true;
                        }
                      });
                      if (!esta) {
                        academicaRequest.get("asignatura_pensum",[espacio.CodigoAsignatura,espacio.CarreraElegible.CodigoPensum]).then(function(asignatura){
                          detalle.opciones.push({
                            "NOMBRE": asignatura.data.asignatura.datosAsignatura[0].nombre,
                            "bd": espacio.CodigoAsignatura + '-' + asignatura.data.asignatura.datosAsignatura[0].nombre
                          });
                        });
                      }
                    });
                  } else {
                    detalle.opciones = responseOpciones.data;
                  }
                });
              }
              if (parametrosServicio[0] === "academica") {
                if (parametrosServicio[1] === "docente") {
                  academicaRequest.get("docentes_tg").then(function(response) {
                    if (!angular.isUndefined(response.data.docentesTg.docente)) {
                      var vinculados = [];
                      angular.forEach(response.data.docentesTg.docente, function(docente) {
                        if (ctrl.docenteVinculado(docente.id)) {
                          vinculados.push(docente);
                        } else {
                          docente.bd = docente.id;
                        }
                      });
                      angular.forEach(vinculados, function(docente) {
                        var index = docentes.indexOf(docente);
                        docentes.splice(index, 1);
                      });
                      detalle.opciones = response.data.docentesTg.docente;
                    }
                  });
                }
              }
              if (parametrosServicio[0] === "cidc") {
                if (parametrosServicio[1] === "estructura_investigacion") {
                  detalle.opciones = cidcRequest.obtenerEntidades();
                }
                if (parametrosServicio[1] === "docentes") {
                  detalle.opciones = cidcRequest.obtenerDoncentes();
                }
              }
              if (parametrosServicio[0] === "estatico") {
                parametrosConsulta = parametrosServicio[2].split(",");
                angular.forEach(parametrosConsulta, function(opcion) {
                  detalle.opciones.push({
                    "NOMBRE": opcion,
                    "bd": opcion
                  });
                });
              }
              if (parametrosServicio[0] === "mensaje") {
                detalle.opciones.push({
                  "NOMBRE": $translate.instant(parametrosServicio[1]),
                  "bd": $translate.instant(parametrosServicio[1])
                });
              }
            };
          });
          ctrl.detallesCargados = true;
          if (ctrl.detalles == null) {
            ctrl.soliciudConDetalles = false;
          }
        });
      } else {
        $scope.loadDetalles = false;
        //ctrl.siPuede=true;
        ctrl.detalles = [];
      }
    }).catch(function() {
      ctrl.errorParametros = true;
      $scope.loadDetalles = false;
      //ctrl.siPuede=true;
      ctrl.detalles = [];
    });
  };

  ctrl.docenteVinculado = function(docente) {
    if (ctrl.Trabajo != undefined) {
      if (ctrl.Trabajo.directorInterno !== undefined) {
        if (ctrl.Trabajo.directorInterno.Usuario == docente) {
          return true;
        }
      }
      if (ctrl.Trabajo.directorExterno !== undefined) {
        if (ctrl.Trabajo.directorInterno.Usuario == docente) {
          return true;
        }
      }
      if (ctrl.Trabajo.evaluadores != undefined) {
        var esta = false;
        angular.forEach(ctrl.Trabajo.evaluadores, function(evaluador) {
          if (evaluador.Usuario == docente) {
            esta = true;
          }
        });
        if (esta) {
          return true;
        }
      }
    }
    //console.log("directorInterno",ctrl.Trabajo.directorInterno);
    //console.log("directorExterno",ctrl.Trabajo.directorExterno);
    //console.log("evaluadores",ctrl.Trabajo.evaluadores);
    return false;
  }

  ctrl.validarFormularioSolicitud = function() {
    console.log("detalles");

    ctrl.detallesConDocumento = [];

    angular.forEach(ctrl.detalles, function(detalle) {
      if (detalle.Detalle.TipoDetalle.Nombre === 'Label') {
        detalle.respuesta = detalle.opciones[0].bd;
      }
      if (detalle.Detalle.TipoDetalle.Nombre === 'Documento') {
        detalle.respuesta = "urlDocumento";
        ctrl.detallesConDocumento.push(detalle);
      }
      if (detalle.Detalle.TipoDetalle.Nombre === 'Directiva') {
        if (detalle.Detalle.Descripcion == 'solicitar-asignaturas') {
          detalle.respuesta = "JSON";
          angular.forEach(ctrl.estudiante.asignaturas_elegidas, function(asignatura) {
            asignatura.$$hashKey = undefined;
            detalle.respuesta = detalle.respuesta + "-" + JSON.stringify(asignatura);
          });
          //detalle.respuesta = detalle.respuesta.substring(1);
        }
        if (detalle.Detalle.Descripcion == 'asignar-estudiantes') {
          detalle.respuesta = (ctrl.estudiantes.length === 0) ? ctrl.codigo : ctrl.codigo + "," + ctrl.estudiantes.toString();
        }
        if (detalle.Detalle.Descripcion == 'asignar-area') {
          detalle.respuesta = "JSON";
          angular.forEach(ctrl.estudiante.areas_elegidas, function(area) {
            area.$$hashKey = undefined;
            detalle.respuesta = detalle.respuesta + "-" + JSON.stringify(area);
            //detalle.respuesta = detalle.respuesta +"," + (area.Id+"-"+area.Nombre);
          });
          //detalle.respuesta = detalle.respuesta.substring(1);
        }
      }
      if (detalle.Detalle.TipoDetalle.Nombre === 'Checkbox' || detalle.Detalle.TipoDetalle.Nombre === 'Radio') {

        if (detalle.bool === undefined) {
          detalle.bool = false;
        }
        if (detalle.bool) {
          detalle.respuesta = "SI";
        } else {
          detalle.respuesta = "NO";
        }

        //detalle.respuesta = detalle.bool.toString();
      }
    });
    //Realizar validaciones
    ctrl.erroresFormulario = false;
    angular.forEach(ctrl.detalles, function(detalle) {
      if (typeof(detalle.respuesta) !== "string") {
        swal(
          'Validación del formulario',
          "Diligencie correctamente el formulario por favor.",
          'warning'
        );
        //console.log("Diligencie correctamente el formulario por favor.");
        ctrl.erroresFormulario = true;
      }
      if (detalle.respuesta === "" && detalle.Detalle.TipoDetalle.Nombre !== "Directiva") {
        swal(
          'Validación del formulario',
          "Debe completar todos los campos del formulario.",
          'warning'
        );
        //console.log("Debe completar todos los campos del formulario.");
        ctrl.erroresFormulario = true;
      }
      if (ctrl.estudiante.areas_elegidas.length === 0 && detalle.Detalle.Descripcion == 'asignar-area') {
        swal(
          'Validación del formulario',
          "Debe ingresar al menos un área de conocimiento.",
          'warning'
        );
        //console.log("Debe ingresar al menos un area.");
        ctrl.erroresFormulario = true;
      }
      if (detalle.Detalle.Descripcion == 'solicitar-asignaturas' && !ctrl.estudiante.minimoCreditos) {
        swal(
          'Validación del formulario',
          "Debe cumplir con el minimo de creditos.",
          'warning'
        );
        ctrl.erroresFormulario = true;
      }
      if (detalle.Detalle.TipoDetalle.Nombre === "Selector" || detalle.Detalle.TipoDetalle.Nombre === "Lista") {
        var contiene = false;
        console.log(detalle.opciones, detalle.respuesta, typeof(detalle.respuesta));
        angular.forEach(detalle.opciones, function(opcion) {
          if (opcion.bd == detalle.respuesta) {
            contiene = true;
          };
        });
        if (!contiene) {
          swal(
            'Validación del formulario',
            "Error ingrese una opcion valida.",
            'warning'
          );
          console.log("Error ingrese una opcion valida")
          ctrl.erroresFormulario = true;
        }
      }
      if (detalle.Detalle.TipoDetalle.Nombre === 'Documento') {
        if (detalle.fileModel == null) {
          swal(
            'Validación del formulario',
            "Error ingrese una opcion valida. (Documento)",
            'warning'
          );
          console.log("Error con el documento")
          ctrl.erroresFormulario = true;
        }
      }
    });
    if (!ctrl.erroresFormulario) {
      //ctrl.cargarSolicitudes();
      ctrl.cargarDocumentos();
    }
  }

  ctrl.cargarDocumento = function(nombre, descripcion, documento, callback) {
    var defered = $q.defer();
    var promise = defered.promise;
    nuxeo.operation('Document.Create')
      .params({
        type: 'File',
        name: nombre,
        properties: 'dc:title=' + nombre + ' \ndc:description=' + descripcion
      })
      .input('/default-domain/workspaces/Proyectos de Grado POLUX/Solicitudes')
      .execute()
      .then(function(doc) {
        var nuxeoBlob = new Nuxeo.Blob({
          content: documento
        });
        nuxeo.batchUpload()
          .upload(nuxeoBlob)
          .then(function(res) {
            return nuxeo.operation('Blob.AttachOnDocument')
              .param('document', doc.uid)
              .input(res.blob)
              .execute();
          })
          .then(function() {
            return nuxeo.repository().fetch(doc.uid, {
              schemas: ['dublincore', 'file']
            });
          })
          .then(function(doc) {
            var url = doc.uid;
            callback(url);
            defered.resolve(url);
          })
          .catch(function(error) {
            throw error;
            defered.reject(error)
          });
      })
      .catch(function(error) {
        throw error;
        defered.reject(error)
      });

    return promise;
  }

  ctrl.cargarDocumentos = function(callFunction) {
    if (ctrl.detallesConDocumento.length > 0) {
      nuxeo.connect().then(function(client) {
        // OK, the returned client is connected
        var fileTypeError = false;
        angular.forEach(ctrl.detallesConDocumento, function(detalle) {
          var documento = detalle.fileModel;
          var tam = parseInt(detalle.Detalle.Descripcion.split(";")[1] + "000");
          if (documento.type !== "application/pdf" || documento.size > tam) {
            fileTypeError = true;
          }
        });
        $scope.loadFormulario = true;
        if (!fileTypeError) {
          var promiseArr = [];
          angular.forEach(ctrl.detallesConDocumento, function(detalle) {
            var anHttpPromise = ctrl.cargarDocumento(detalle.Detalle.Nombre + ":" + ctrl.codigo, detalle.Detalle.Nombre + ":" + ctrl.codigo, detalle.fileModel, function(url) {
              detalle.respuesta = url;
            });
            promiseArr.push(anHttpPromise);
          });
          $q.all(promiseArr).then(function() {
            ctrl.cargarSolicitudes();
          }).catch(function(error) {
            swal(
              $translate.instant("ERROR.CARGA_SOLICITUDES"),
              $translate.instant("ERROR.ENVIO_SOLICITUD"),
              'warning'
            );
            $scope.loadFormulario = false;
          });
        } else {
          swal(
            $translate.instant("ERROR.SUBIR_DOCUMENTO"),
            $translate.instant("VERIFICAR_DOCUMENTO"),
            'warning'
          );
          $scope.loadFormulario = false;
        }
      }, function(err) {
        // cannot connect
        swal(
          $translate.instant("ERROR.SUBIR_DOCUMENTO"),
          $translate.instant("VERIFICAR_DOCUMENTO"),
          'warning'
        );
        $scope.loadFormulario = false;
      });
    } else {
      //agregar validación de error
      $scope.loadFormulario = true;
      ctrl.cargarSolicitudes();
    }
  };


  ctrl.cargarSolicitudes = function() {
    //var data_solicitud = [];
    var data_solicitud = {};
    var data_detalles = [];
    var data_usuarios = [];
    var data_respuesta = {};
    var fecha = new Date();

    if (ctrl.trabajo_grado !== undefined) {
      data_solicitud = {
        "Fecha": fecha,
        "ModalidadTipoSolicitud": {
          "Id": ctrl.ModalidadTipoSolicitud
        },
        "TrabajoGrado": {
          "Id": ctrl.trabajo_grado
        },
        "PeriodoAcademico": parseInt(ctrl.periodo)
      };
    } else {
      data_solicitud = {
        "Fecha": fecha,
        "ModalidadTipoSolicitud": {
          "Id": ctrl.ModalidadTipoSolicitud
        },
        "PeriodoAcademico": parseInt(ctrl.periodo)
      };
    }
    angular.forEach(ctrl.detalles, function(detalle) {
      data_detalles.push({
        "Descripcion": detalle.respuesta,
        "SolicitudTrabajoGrado": {
          "Id": 0
        },
        "DetalleTipoSolicitud": {
          "Id": detalle.Id
        }
      });

    });

    //Se agrega solicitud al estudiante
    data_usuarios.push({
      "Usuario": ctrl.codigo,
      "SolicitudTrabajoGrado": {
        "Id": 0
      }
    });
    //estudiantes que ya pertenecian al tg
    //si es diferente a una solicitud de cancelación
    if (ctrl.TipoSolicitud.TipoSolicitud !== undefined) {
      if (ctrl.TipoSolicitud.TipoSolicitud.Id !== 3) {
        angular.forEach(ctrl.estudiantesTg, function(estudiante) {
          data_usuarios.push({
            "Usuario": estudiante,
            "SolicitudTrabajoGrado": {
              "Id": 0
            }
          });
        });
      }
    }
    //estudiantes agregados en la solicitud inicial
    angular.forEach(ctrl.estudiantes, function(estudiante) {
      data_usuarios.push({
        "Usuario": estudiante,
        "SolicitudTrabajoGrado": {
          "Id": 0
        }
      });
    });

    //Respuesta de la solicitud
    data_respuesta = {
      "Fecha": fecha,
      "Justificacion": "Su solicitud fue radicada",
      "EnteResponsable": 0,
      "Usuario": 0,
      "EstadoSolicitud": {
        "Id": 1
      },
      "SolicitudTrabajoGrado": {
        "Id": 0
      },
      "Activo": true
    }

    //se crea objeto con las solicitudes
    ctrl.solicitud = {
      Solicitud: data_solicitud,
      Respuesta: data_respuesta,
      DetallesSolicitud: data_detalles,
      UsuariosSolicitud: data_usuarios
    }

    console.log(ctrl.solicitud);

    poluxRequest.post("tr_solicitud", ctrl.solicitud).then(function(response) {
      console.log(response.data);
      if (response.data[0] === "Success") {
        swal(
          $translate.instant("FORMULARIO_SOLICITUD"),
          $translate.instant("SOLICITUD_REGISTRADA"),
          'success'
        );
        $location.path("/solicitudes/listar_solicitudes");
      } else {
        swal(
          $translate.instant("FORMULARIO_SOLICITUD"),
          $translate.instant(response.data[1]),
          'warning'
        );
      }
      $scope.loadFormulario = false;
    });

  }

  ctrl.getDocumento = function(docid) {
    nuxeo.header('X-NXDocumentProperties', '*');

    ctrl.obtenerDoc = function() {
      var defered = $q.defer();

      nuxeo.request('/id/' + docid)
        .get()
        .then(function(response) {
          ctrl.doc = response;
          var aux = response.get('file:content');
          ctrl.document = response;
          defered.resolve(response);
        })
        .catch(function(error) {
          defered.reject(error)
        });
      return defered.promise;
    };

    ctrl.obtenerFetch = function(doc) {
      var defered = $q.defer();

      doc.fetchBlob()
        .then(function(res) {
          defered.resolve(res.blob());

        })
        .catch(function(error) {
          defered.reject(error)
        });
      return defered.promise;
    };

    ctrl.obtenerDoc().then(function() {

      ctrl.obtenerFetch(ctrl.document).then(function(r) {
        ctrl.blob = r;
        var fileURL = URL.createObjectURL(ctrl.blob);
        console.log(fileURL);
        ctrl.content = $sce.trustAsResourceUrl(fileURL);
        $window.open(fileURL);
      });
    });

  }

});