'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
 * @description
 * # SolicitudesAprobarSolicitudCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('SolicitudesAprobarSolicitudCtrl', function (poluxMidRequest,academicaRequest,$window,$sce,$q,nuxeo,poluxRequest,$routeParams,$translate,$scope,$location) {
    var ctrl = this;

    ctrl.respuestaSolicitud="";
    ctrl.justificacion="";
    ctrl.solicitud = $routeParams.idSolicitud;

    $scope.msgCargandoSolicitud = $translate.instant("LOADING.CARGANDO_DETALLES_SOLICITUD");
    $scope.msgEnviandFormulario = $translate.instant('LOADING.ENVIANDO_FORLMULARIO');
    $scope.loadSolicitud = true;
    $scope.loadFormulario = false;

    ctrl.isInicial = false;
    ctrl.isCambio = false;
    ctrl.isPasantia = false;
    ctrl.hasRevisor = false;

    //datos para el acta
    ctrl.acta = [];
    ctrl.acta.nombre = $translate.instant('DOCUMENTO.SIN_DOCUMENTO');
    ctrl.acta.url = "";

    ctrl.docentesVinculadosTg = [];

    //datos para infinite SolicitudesAprobarSolicitudCtrl//Infinite Scroll Magic
    $scope.infiniteScroll = {};
    $scope.infiniteScroll.numToAdd = 20;
    $scope.infiniteScroll.currentItems = 20;
    $scope.reloadScroll = function(){
       $scope.infiniteScrollcurrentItems = $scope.infiniteScroll.numToAdd;
    };
    $scope.addMoreItems = function(){
       $scope.infiniteScroll.currentItems += $scope.infiniteScroll.numToAdd;
    };

    //carreras del coordinador
  /*  var parametrosCoordinador = {
      "identificacion":19451396,
      "tipo":"PREGRADO",
    };*/

    //documento del coordinador
    $scope.userId=19451396;

    ctrl.carrerasCoordinador = [];
    /**
     * @ngdoc method
     * @name poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl#getCarrerasCoordinador
     * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
     * @param {undefined} undefined no recibe ningún parametro
     * @requires $q 
     * @requires $translate
     * @returns {Promise} Retorna promesa que dice cuando se cuando se cumple la petición
     * @description 
     * Consulta las carreras del coordinado
     * se consueme el servicio {@link academicaService.service:academicaRequest academicaRequest}
     */
    //obtener las carreras asociadas al coordinador
    ctrl.getCarrerasCoordinador = function(){
      var defer = $q.defer();
      academicaRequest.get("coordinador_carrera",[$scope.userId, "PREGRADO"]).then(function(response){
        //console.log(response);
        if (!angular.isUndefined(response.data.coordinadorCollection.coordinador)) {
          ctrl.carrerasCoordinador=response.data.coordinadorCollection.coordinador;
          defer.resolve();
        }else{
          ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGARCARRERAS");
          defer.reject("Carreras no definidas");
        }
      })
      .catch(function(error){
        ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_CARRERAS");
        defer.reject(error);
      });
      return defer.promise;
    }

    ctrl.getRespuestaSolicitud = function(){
      var defer = $q.defer();
      var parametros = $.param({
        query:"SolicitudTrabajoGrado.Id:"+ctrl.solicitud+",Activo:TRUE"
      });
      poluxRequest.get("respuesta_solicitud",parametros).then(function(responseRespuesta){
          if(responseRespuesta.data != null){
            ctrl.respuestaActual = responseRespuesta.data[0];
            defer.resolve();
          }else{
            ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_RESPUESTA_SOLICITUD");
            defer.reject("no hay respuesta");
          }
      })
      .catch(function(error){
        ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_RESPUESTA_SOLICITUD");
        defer.reject(error);
      });
      return defer.promise;
    }


    ctrl.getDetallesSolicitud = function(parametrosDetallesSolicitud){
      var defered = $q.defer();
      var promise = defered.promise;
      poluxRequest.get("detalle_solicitud",parametrosDetallesSolicitud).then(function(responseDetalles){
          poluxRequest.get("usuario_solicitud",parametrosDetallesSolicitud).then(function(responseEstudiantes){
              if(responseDetalles.data===null){
                ctrl.detallesSolicitud = [];
              }else{
                ctrl.detallesSolicitud = responseDetalles.data;
              }

              var solicitantes = "";
              ctrl.detallesSolicitud.id = ctrl.solicitud;
              ctrl.detallesSolicitud.tipoSolicitud = ctrl.dataSolicitud.ModalidadTipoSolicitud;
              ctrl.detallesSolicitud.fechaSolicitud = ctrl.dataSolicitud.Fecha.toString().substring(0, 10);
              ctrl.detallesSolicitud.PeriodoAcademico = ctrl.dataSolicitud.PeriodoAcademico;
              angular.forEach(responseEstudiantes.data,function(estudiante){
                  solicitantes += (", "+estudiante.Usuario) ;
              });
              ctrl.todoDetalles=[];
              var promises = [];
              var getDocente = function(id,detalle){
                var defer = $q.defer();
                academicaRequest.get("docente_tg", [detalle.Descripcion]).then(function(docente){
                  if (!angular.isUndefined(docente.data.docenteTg.docente)) {
                    console.log(docente.data.docenteTg.docente[0]);
                    detalle.Descripcion=docente.data.docenteTg.docente[0].id+" "+docente.data.docenteTg.docente[0].nombre;
                    if(id === 9){
                      ctrl.docenteDirector = {
                        "NOMBRE":docente.data.docenteTg.docente[0].nombre,
                        "DIR_NRO_IDEN":docente.data.docenteTg.docente[0].id,
                      };
                      //console.log(ctrl.docenteDirector);
                    }

                    //docente solicitado para el cambio
                    if(id === 15 || id===17){
                      ctrl.docenteCambio = {
                        "NOMBRE":docente.data.docenteTg.docente[0].nombre,
                        "DIR_NRO_IDEN":docente.data.docenteTg.docente[0].id,
                      };
                    //  console.log("docente cambio", ctrl.docenteCambio);
                    }
                    defer.resolve();
                  }else{
                    ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_VINCULADOS_TRABAJO_GRADO");
                    defer.reject(error);
                  }
                })
                .catch(function(error){
                  ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_VINCULADOS_TRABAJO_GRADO");
                  defer.reject(error);
                });
                return defer.promise;
              }
              angular.forEach(ctrl.detallesSolicitud,function(detalle){
                    ctrl.todoDetalles.push(detalle);
                    console.log("detalle",detalle);
                    detalle.filas = [];
                    var id = detalle.DetalleTipoSolicitud.Detalle.Id
                    if(id===49){
                       detalle.Descripcion = detalle.Descripcion.split("-")[1];
                    } else if(id === 9 || id===14 || id===15 || id === 16 || id === 17 || id===48){
                      promises.push(getDocente(id,detalle));
                    }else if(detalle.Descripcion.includes("JSON-")){
                        if(detalle.DetalleTipoSolicitud.Detalle.Id===8){
                          //areas de conocimiento
                          ctrl.areas=[];
                          var datosAreas = detalle.Descripcion.split("-");
                          datosAreas.splice(0,1);
                          detalle.Descripcion = "";
                          angular.forEach(datosAreas, function(area){
                              ctrl.areas.push(JSON.parse(area).Id);
                              detalle.Descripcion = detalle.Descripcion+", "+JSON.parse(area).Nombre;
                          });
                          detalle.Descripcion = detalle.Descripcion.substring(2);
                        }else if(detalle.DetalleTipoSolicitud.Detalle.Id===22){
                          //materias
                          var datosMaterias = detalle.Descripcion.split("-");
                          detalle.carrera = JSON.parse(datosMaterias[1]);
                          datosMaterias.splice(0, 2);
                          angular.forEach(datosMaterias, function(materia){
                              detalle.filas.push(JSON.parse(materia));
                              console.log(materia);
                          });

                          detalle.gridOptions = [];
                          detalle.gridOptions.columnDefs = [{
                            name: 'CodigoAsignatura',
                            displayName: $translate.instant('CODIGO_MATERIA'),
                            width:'30%',
                          },{
                            name: 'Nombre',
                            displayName: $translate.instant('NOMBRE'),
                            width: '50%',
                          }, {
                            name: 'Creditos',
                            displayName: $translate.instant('CREDITOS'),
                            width: '20%',
                          }];
                          detalle.gridOptions.data = detalle.filas;
                        }
                    }
              });
              $q.all(promises).then(function(){
                console.log(ctrl.todoDetalles);
                ctrl.detallesSolicitud.solicitantes = solicitantes.substring(2);
                defered.resolve(ctrl.detallesSolicitud);
              })
              .catch(function(error){
                defered.reject(error);
              });
          })
          .catch(function(error){
            ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_DATOS_ESTUDIANTES");
            defered.reject(error);
          });
      })
      .catch(function(error){
        ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_DETALLES_SOLICITUD");
        defered.reject(error);
      });
      return promise;
    };

    ctrl.evaluarSolicitud = function(){
      var defered = $q.defer();
      var promise = defered.promise;
      ctrl.dataSolicitud.TipoSolicitud = ctrl.dataSolicitud.ModalidadTipoSolicitud.TipoSolicitud.Id;
      ctrl.dataSolicitud.NombreTipoSolicitud = ctrl.dataSolicitud.ModalidadTipoSolicitud.TipoSolicitud.Nombre;
      ctrl.dataSolicitud.NombreModalidad = ctrl.dataSolicitud.ModalidadTipoSolicitud.Modalidad.Nombre;
      ctrl.dataSolicitud.modalidad = ctrl.dataSolicitud.ModalidadTipoSolicitud.Modalidad.Id;
      console.log(ctrl.dataSolicitud.ModalidadTipoSolicitud.TipoSolicitud.Id );
      if(ctrl.dataSolicitud.ModalidadTipoSolicitud.TipoSolicitud.Id === 2){
            if(ctrl.dataSolicitud.modalidad !== 2 && ctrl.dataSolicitud.modalidad !== 3){
                ctrl.isInicial = true;
                //Si no es de materias de posgrado y profundización trae los docentes
                academicaRequest.get("docentes_tg").then(function(docentes){
                  if (!angular.isUndefined(docentes.data.docentesTg.docente)) {
                      ctrl.docentes=docentes.data.docentesTg.docente;
                      defered.resolve(ctrl.docentes);
                  }
                })
                .catch(function(error){
                  ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_DOCENTES");
                  defer.reject(error);
                });
                if(ctrl.dataSolicitud.modalidad === 1){
                  ctrl.isPasantia = true;
                }
            }else{
              defered.resolve(ctrl.dataSolicitud.modalidad);
            }
      }else if(ctrl.dataSolicitud.ModalidadTipoSolicitud.TipoSolicitud.Id ===  4 || ctrl.dataSolicitud.ModalidadTipoSolicitud.TipoSolicitud.Id ===  10 ){
        ctrl.isCambio = true;
        academicaRequest.get("docentes_tg").then(function(docentes){
          if (!angular.isUndefined(docentes.data.docentesTg.docente)) {
            ctrl.docentes=docentes.data.docentesTg.docente;
            defered.resolve(ctrl.docentes);
          }
        })
        .catch(function(error){
          ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_DOCENTES");
          defer.reject(error);
        });
      }else{
        defered.resolve(ctrl.dataSolicitud.modalidad);
      }
      return promise;
    };

    ctrl.getEvaluadores = function(solicitud){
      var defer = $q.defer();
      poluxMidRequest.post("evaluadores/ObtenerEvaluadores",solicitud).then(function(response){
        ctrl.evaluadoresInicial = new Array(parseInt(response.data.cantidad_evaluadores));
        for(var i = 0; i<ctrl.evaluadoresInicial.length;i++){
          var label = (ctrl.evaluadoresInicial.length>1)?$translate.instant('SELECT.EVALUADOR_NUMERO',{numero:(i+1)}):$translate.instant('SELECT.DOCENTE_REVISOR');
          ctrl.evaluadoresInicial[i] = {
            indice:i+1,
            label: label,
          };
        }
        ctrl.hasRevisor = ctrl.evaluadoresInicial.length>0;
        defer.resolve(ctrl.evaluadoresInicial);
      })
      .catch(function(error){
        ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_EVALUADORES");
        defer.reject(error);
      });
      return defer.promise;
    };

    ctrl.docenteVinculado = function(vinculados,  docente){
        var esta = false;
        angular.forEach(vinculados, function(vinculado){
            if(vinculado.Usuario == docente){
              esta = true;
            }
        });
        return esta;
    };

    var parametrosSolicitud = $.param({
        query:"Id:"+ctrl.solicitud,
        limit:1
    });
    poluxRequest.get("solicitud_trabajo_grado",parametrosSolicitud).then(function(responseSolicitud){
      if(responseSolicitud.data != null){
        var parametrosDetallesSolicitud = $.param({
            query:"SolicitudTrabajoGrado.Id:"+ctrl.solicitud,
            limit:0
        });
        ctrl.dataSolicitud = responseSolicitud.data[0];
        var promises = [];
        promises.push(ctrl.getDetallesSolicitud(parametrosDetallesSolicitud));
        promises.push(ctrl.evaluarSolicitud());
        promises.push(ctrl.getEvaluadores(ctrl.dataSolicitud.ModalidadTipoSolicitud.Modalidad.Id));
        promises.push(ctrl.getCarrerasCoordinador());
        promises.push(ctrl.getRespuestaSolicitud());
        $q.all(promises).then(function(){
          if(ctrl.dataSolicitud.TrabajoGrado !== null){
            var parametrosVinculacion = $.param({
                query:"Activo:true,TrabajoGrado:"+ctrl.dataSolicitud.TrabajoGrado.Id,
                limit:0
            });
            poluxRequest.get("vinculacion_trabajo_grado",parametrosVinculacion).then(function(docentesVinculados){
                if(docentesVinculados.data !== null){
                  var vinculados = [];
                  console.log("docentes", ctrl.docentes);
                  ctrl.docentesVinculadosTg = docentesVinculados.data;
                  angular.forEach(ctrl.docentes, function(docente){
                      if(ctrl.docenteVinculado(docentesVinculados.data, docente.DIR_NRO_IDEN)){
                        console.log("vinculado", docente);
                        vinculados.push(docente);
                      }
                  });
                  angular.forEach(vinculados, function(docente){
                      var index = ctrl.docentes.indexOf(docente);
                      ctrl.docentes.splice(index, 1);
                  });
                  $scope.loadSolicitud = false;
                }else{
                  $scope.loadSolicitud = false;
                }
            })
            .catch(function(error){
              console.log(error);
              ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_VINCULADOS_TRABAJO_GRADO");
              ctrl.errorCargarSolicitud = true;
              $scope.loadSolicitud = false;
            });
          }else{
            $scope.loadSolicitud = false;
          }
        })
        .catch(function(error){
          console.log(error);
          ctrl.errorCargarSolicitud = true;
          $scope.loadSolicitud = false;
        });
      }else{
        ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.SOLICITUD_NO_ENCONTRADA");
        ctrl.errorCargarSolicitud = true;
        $scope.loadSolicitud = false;
      }
    })
    .catch(function(error){
      console.log(error);
      ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.SOLICITUD_NO_ENCONTRADA");
      ctrl.errorCargarSolicitud = true;
      $scope.loadSolicitud = false;
    });

    ctrl.responder = function() {
        var fechaRespuesta = new Date();
        var errorDocente = false;
        //se desactiva respuesta anterior
        var objRtaAnterior = ctrl.respuestaActual;
        objRtaAnterior.Activo = false;
        //data respuesta nueva
        var objRtaNueva = {
          "Id": null,
          "Fecha": fechaRespuesta,
          "Justificacion": ctrl.justificacion,
          "EnteResponsable":0,
          "Usuario":$scope.userId,
          "Activo": true,
          "EstadoSolicitud":{
            "Id":Number(ctrl.respuestaSolicitud),
          },
          "SolicitudTrabajoGrado":{
            "Id": Number(ctrl.solicitud)
          }
        }

        if (ctrl.acta.id != null) {
            var data_documento = {
              "DocumentoEscrito":{
                "Id":ctrl.acta.id,
              },
              "SolicitudTrabajoGrado":{
                "Id": Number(ctrl.solicitud)
              }
            }

            ctrl.dataRespuesta = {
                RespuestaAnterior: objRtaAnterior,
                RespuestaNueva: objRtaNueva,
                DocumentoSolicitud: data_documento,
                TipoSolicitud: ctrl.respuestaActual.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud,
                Vinculaciones: null,
                EstudianteTrabajoGrado: null,
                VinculacionesCancelacion: null,
                TrTrabajoGrado: null,
                ModalidadTipoSolicitud: ctrl.detallesSolicitud.tipoSolicitud,
                TrabajoGrado: null,
                SolicitudTrabajoGrado: null,
                EspaciosAcademicos: null,
            };
            //solicitud aprobada
            if(ctrl.respuestaSolicitud == 3){
                //solicitud aprobada
                //se recorren los detalles y se obtienen los nombres de las nuevas vinculaciones
                angular.forEach(ctrl.todoDetalles, function(detalle) {
                    if (detalle.DetalleTipoSolicitud.Detalle.Nombre == "Director Actual") {
                        var aux = detalle.Descripcion.split(" ");
                        ctrl.directorActual = Number(aux[0]);
                    } else if (detalle.DetalleTipoSolicitud.Detalle.Nombre == "Director Nuevo") {
                        var aux = detalle.Descripcion.split(" ");
                        ctrl.directorNuevo = Number(aux[0]);
                    } else if (detalle.DetalleTipoSolicitud.Detalle.Nombre == "Evaluador Actual") {
                        var aux = detalle.Descripcion.split(" ");
                        ctrl.evaluadorActual = Number(aux[0]);
                    } else if (detalle.DetalleTipoSolicitud.Detalle.Nombre == "Evaluador Nuevo") {
                        var aux = detalle.Descripcion.split(" ");
                        ctrl.evaluadorNuevo = Number(aux[0]);
                    } else if(detalle.DetalleTipoSolicitud.Detalle.Enunciado=="ESCRIBA_NOMBRE_NUEVO_PROPUESTA"){
                        ctrl.tituloNuevo = detalle.Descripcion;
                    }  else if (detalle.DetalleTipoSolicitud.Detalle.Id == 23){
                        //Para obtener la asignatura Actual
                        ctrl.asignaturaActual = Number(detalle.Descripcion.split("-")[0]);
                    } else if (detalle.DetalleTipoSolicitud.Detalle.Id == 24){
                        //Para obtener la asignatura Nueva
                        ctrl.asignaturaNueva = Number(detalle.Descripcion.split("-")[0]);
                    }
                });
                //Se verifica por tipo de solicitud
                if (ctrl.dataSolicitud.TipoSolicitud == 2) {
                   //solicitud inicial
                    //solicitud espacios académicos de posgrado o solicitud espacios académicos de profundización
                    if (ctrl.dataSolicitud.ModalidadTipoSolicitud.Id == 13 || ctrl.dataSolicitud.ModalidadTipoSolicitud.Id == 16) {
                       //La solicitud solo se aprueba para que siga el curso
                        /*var data_trabajo_grado = {};
                        var data_estudiantes = [];
                        var otro = {};
                        var estudiante = {};
                        var solicitudInicial = {};
                        angular.forEach(ctrl.detallesSolicitud, function(detalle) {
                            if (detalle.DetalleTipoSolicitud.Detalle.Nombre == "Estudiantes") {
                                otro.Estudiantes = detalle.Descripcion;
                            }
                        });
                        data_trabajo_grado = {
                            "Titulo": ctrl.detallesSolicitud.tipoSolicitud.Modalidad.Nombre,
                            "Modalidad": {
                                "Id": ctrl.detallesSolicitud.tipoSolicitud.Modalidad.Id
                            },
                            "EstadoTrabajoGrado": {
                                "Id": 1
                            },
                            "DistincionTrabajoGrado": null
                        }
                        estudiante = {
                            "Estudiante": otro.Estudiantes,
                            "TrabajoGrado": {
                                "Id": 0
                            },
                            "EstadoEstudianteTrabajoGrado": {
                                "Id": 1
                            }
                        }
                        console.log(estudiante);
                        data_estudiantes.push(estudiante);
                        console.log(data_estudiantes);

                        ctrl.trabajo_grado = {
                            TrabajoGrado: data_trabajo_grado,
                            EstudianteTrabajoGrado: data_estudiantes,
                            DocumentoEscrito: null,
                            DocumentoTrabajoGrado: null,
                            AreasTrabajoGrado: null,
                            VinculacionTrabajoGrado: null
                        }
                        console.log(ctrl.trabajo_grado);

                        ctrl.rtaSol = {
                            RespuestaAnterior: objRtaAnterior,
                            RespuestaNueva: objRtaNueva,
                            DocumentoSolicitud: data_documento,
                            TipoSolicitud: ctrl.respuestaActual.data[0].SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud,
                            Vinculaciones: null,
                            EstudianteTrabajoGrado: null,
                            TrTrabajoGrado: ctrl.trabajo_grado,
                            ModalidadTipoSolicitud: ctrl.detallesSolicitud.tipoSolicitud
                        };
                        */
                    } else if (ctrl.dataSolicitud.ModalidadTipoSolicitud.Id == 20 || ctrl.dataSolicitud.ModalidadTipoSolicitud.Id == 46 || ctrl.dataSolicitud.ModalidadTipoSolicitud.Id == 38 || ctrl.dataSolicitud.ModalidadTipoSolicitud.Id == 55) {
                        //Monografia, Proyecto de emprendimento, Creación e Interpretación, Producción académica
                        //se obtienen datos para crear el trabajo
                        var tempTrabajo ={};
                        angular.forEach(ctrl.detallesSolicitud, function(detalle) {
                            if (detalle.DetalleTipoSolicitud.Detalle.Nombre == "Nombre propuesta") {
                                tempTrabajo.Titulo = detalle.Descripcion;
                            } else if (detalle.DetalleTipoSolicitud.Detalle.Nombre == "Estudiantes") {
                                tempTrabajo.Estudiantes = detalle.Descripcion.split(',');
                            } else if (detalle.DetalleTipoSolicitud.Detalle.Nombre == "Propuesta") {
                                tempTrabajo.Enlace = detalle.Descripcion;
                            } else if (detalle.DetalleTipoSolicitud.Detalle.Nombre == "Resumen propuesta") {
                                tempTrabajo.Resumen = detalle.Descripcion;
                            } else if (detalle.DetalleTipoSolicitud.Detalle.Nombre == "Áreas de conocimiento") {
                                tempTrabajo.Areas = ctrl.areas;
                            }
                        });
                        //data para crear el trabajo de grado
                        var data_trabajo_grado = {
                            "Titulo": tempTrabajo.Titulo,
                            "Modalidad": {
                                "Id": ctrl.detallesSolicitud.tipoSolicitud.Modalidad.Id
                            },
                            "EstadoTrabajoGrado": {
                                "Id": 1
                            },
                            "DistincionTrabajoGrado": null
                        }
                        //se agregan estudiantes
                        var estudiante = {};
                        var data_estudiantes = [];
                        angular.forEach(tempTrabajo.Estudiantes, function(est) {
                            estudiante = {
                                "Estudiante": est,
                                "TrabajoGrado": {
                                    "Id": 0
                                },
                                "EstadoEstudianteTrabajoGrado": {
                                    "Id": 1
                                }
                            }
                            data_estudiantes.push(estudiante);
                        });
                        //Se crea la data para el documento de propuesta
                        var data_propuesta = {
                            "Titulo": tempTrabajo.Titulo,
                            "Enlace": tempTrabajo.Enlace,
                            "Resumen": tempTrabajo.Resumen,
                            "TipoDocumentoEscrito": 1
                        }
                        var data_documento_tg = {
                            "TrabajoGrado": {
                                "Id": 0
                            },
                            "DocumentoEscrito": {
                                "Id": 0
                            }
                        }
                        //se agregan las areaSnies
                        var area = {};
                        var data_areas = [];
                        angular.forEach(otro.Areas, function(area) {
                            area = {
                                "AreaConocimiento": {
                                    "Id": Number(area)
                                },
                                "TrabajoGrado": {
                                    "Id": 0
                                },
                                "Activo": true,
                            }
                            data_areas.push(area);
                        });
                        // se agregan las vinculaciones del tg
                        var vinculacion = {};
                        var data_vinculacion = [];
                        // docente director
                        vinculacion = {
                            "Usuario": Number(ctrl.docenteDirector.DIR_NRO_IDEN),
                            "Activo": true,
                            "FechaInicio": fechaRespuesta,
                            //"FechaFin": null,
                            "RolTrabajoGrado": {
                                "Id": 1
                            },
                            "TrabajoGrado": {
                                "Id": 0
                            }
                        }
                        data_vinculacion.push(vinculacion);
                        //verificar que el docente no este repetido
                        var vinculados = [];
                        vinculados.push(ctrl.docenteDirector.DIR_NRO_IDEN);
                        // evaluadores
                        angular.forEach(ctrl.evaluadoresInicial, function(docente) {
                            vinculacion = {
                                "Usuario": Number(docente.docente.DIR_NRO_IDEN),
                                "Activo": true,
                                "FechaInicio": fechaRespuesta,
                                //"FechaFin": null,
                                "RolTrabajoGrado": {
                                    "Id": 3
                                },
                                "TrabajoGrado": {
                                    "Id": 0
                                }
                            }
                            data_vinculacion.push(vinculacion);
                            if (vinculados.includes(docente.docente.DIR_NRO_IDEN)) {
                                errorDocente = true;
                            } else {
                                vinculados.push(docente.docente.DIR_NRO_IDEN);
                            }
                        });
                        ctrl.trabajo_grado = {
                            TrabajoGrado: data_trabajo_grado,
                            EstudianteTrabajoGrado: data_estudiantes,
                            DocumentoEscrito: data_propuesta,
                            DocumentoTrabajoGrado: data_documento_tg,
                            AreasTrabajoGrado: data_areas,
                            VinculacionTrabajoGrado: data_vinculacion
                        }
                        solicitudInicial = ctrl.respuestaActual.SolicitudTrabajoGrado;
                        solicitudInicial.TrabajoGrado = {
                            "Id": 0
                        }
                        //se guarda data de la respuesta
                        ctrl.dataRespuesta.TrTrabajoGrado = ctrl.trabajo_grado;
                        ctrl.dataRespuesta.SolicitudTrabajoGrado = solicitudInicial;
                    }
                } else if(ctrl.dataSolicitud.TipoSolicitud == 4 || ctrl.dataSolicitud.TipoSolicitud == 10){
                  //cambio de director interno o evaluadores
                  var vinculaciones = [];
                  var vinculacionActual =  [];
                  angular.forEach(ctrl.docentesVinculadosTg, function(docenteVinculado){
                    if(docenteVinculado.Usuario === ctrl.directorActual){
                      vinculacionActual = docenteVinculado;
                    }else if(docenteVinculado.Usuario === ctrl.evaluadorActual){
                      vinculacionActual = docenteVinculado;
                    }
                  });
                  var nuevaVinculacion = angular.copy(vinculacionActual);
                  //actualizar vinculacion actual
                  vinculacionActual.Activo=false;
                  vinculacionActual.FechaFin=fechaRespuesta;
                  //nueva vinculacion
                  nuevaVinculacion.Id=null;
                  nuevaVinculacion.Usuario=Number(ctrl.docenteCambio.DIR_NRO_IDEN);
                  nuevaVinculacion.FechaInicio=fechaRespuesta;
                  //nuevaVinculacion.FechaFin=null;
                  vinculaciones.push(vinculacionActual);
                  vinculaciones.push(nuevaVinculacion);
                  //Esperar a que se cumplan las promesas
                  console.log(vinculaciones);
                  //Se escribe la data de las vinculaciones
                  ctrl.dataRespuesta.Vinculaciones = vinculaciones;
                } else if(ctrl.dataSolicitud.TipoSolicitud == 3){
                  //solicitud de cancelacion de modalidad
                  //se crea data del estudiante
                  var dataEstudianteTg = {
                    "Estudiante": ctrl.detallesSolicitud.solicitantes,
                    "TrabajoGrado" : ctrl.respuestaActual.SolicitudTrabajoGrado.TrabajoGrado,
                    "EstadoEstudianteTrabajoGrado" : {
                      "Id": 2,
                    },
                  }
                  //Se cambia la fecha de finalización de los vinculados
                  angular.forEach(ctrl.docentesVinculadosTg, function(docente){
                    docente.FechaFin = fechaRespuesta;
                  });
                  console.log(ctrl.docentesVinculadosTg);
                  ctrl.dataRespuesta.VinculacionesCancelacion = ctrl.docentesVinculadosTg;
                  ctrl.dataRespuesta.EstudianteTrabajoGrado = dataEstudianteTg;
                } else if(ctrl.dataSolicitud.TipoSolicitud == 8){
                  //solicitud de cambio titulo de trabajo de grado
                  var tgTemp = ctrl.respuestaActual.SolicitudTrabajoGrado.TrabajoGrado;
                  //Se cambia el titulo
                  tgTemp.Titulo = ctrl.tituloNuevo;
                  ctrl.dataRespuesta.TrabajoGrado = tgTemp;
                } else if(ctrl.dataSolicitud.TipoSolicitud == 9){
                  //solicitud de cambio de materia
                  var espacios = [];
                  //Asignatura vieja
                  espacios.push({
                    "Nota": 0,
                    "EspaciosAcademicosElegibles":{
                      "Id": 0,
                      "CodigoAsignatura": ctrl.asignaturaActual,
                    },
                    "EstadoEspacioAcademicoInscrito":{
                      "Id": 2
                    },
                    "TrabajoGrado": ctrl.respuestaActual.SolicitudTrabajoGrado.TrabajoGrado,
                  });
                  //Asignatura Nueva
                  espacios.push({
                    "Nota": 0,
                    "EspaciosAcademicosElegibles":{
                      "Id": 0,
                      "CodigoAsignatura": ctrl.asignaturaNueva,
                    },
                    "EstadoEspacioAcademicoInscrito":{
                      "Id": 1
                    },
                    "TrabajoGrado": ctrl.respuestaActual.SolicitudTrabajoGrado.TrabajoGrado,
                  });
                  ctrl.dataRespuesta.EspaciosAcademicos = espacios;
                  console.log("Espacios", ctrl.dataRespuesta.EspaciosAcademicos);
                }
            }

            if (!errorDocente) {
                poluxRequest.post("tr_respuesta_solicitud", ctrl.dataRespuesta).then(function(response) {
                    ctrl.mostrarRespuesta(response);
                })
                .catch(function(error){
                  console.log(error);
                  swal(
                      $translate.instant("ERROR"),
                      $translate.instant("ERROR.ENVIO_SOLICITUD"),
                      'warning'
                  );
                });
            } else {
                swal(
                    $translate.instant("ERROR"),
                    $translate.instant("ERROR.DOCENTE_DUPLICADO"),
                    'warning'
                );
            }
        } else {
            ctrl.mostrarRespuesta("SELECCIONE_ACTA");
        }
    }

    ctrl.mostrarRespuesta = function(response){
      if(response.data!== undefined){
          if(response.data[0]=='Success'){
              swal(
                $translate.instant("RESPUESTA_SOLICITUD"),
                $translate.instant("SOLICITUD_APROBADA"),
                'success'
              );
              $location.path("/solicitudes/listar_solicitudes");
            }else{
              if(Array.isArray(response.data)){
                    swal(
                      $translate.instant("RESPUESTA_SOLICITUD"),
                      $translate.instant(response.data[1]),
                      'warning'
                    );
                }else{
                    swal(
                      $translate.instant("RESPUESTA_SOLICITUD"),
                      response.data,
                      'warning'
                    );
                }
            }
        }
        else{
          swal(
            $translate.instant("RESPUESTA_SOLICITUD"),
            $translate.instant(response),
            'warning'
          );
        }
    }

    ctrl.cargarDocumento = function(nombre, descripcion, documento ,callback){
            var defered = $q.defer();
            var promise = defered.promise;
            nuxeo.operation('Document.Create')
              .params({
                type: 'File',
                name: nombre,
                properties: 'dc:title=' + nombre + ' \ndc:description=' + descripcion
              })
              .input('/default-domain/workspaces/Proyectos de Grado POLUX/Actas')
              .execute()
              .then(function(doc) {
                  var nuxeoBlob = new Nuxeo.Blob({ content: documento });
                  nuxeo.batchUpload()
                  .upload(nuxeoBlob)
                  .then(function(res) {
                    return nuxeo.operation('Blob.AttachOnDocument')
                        .param('document', doc.uid)
                        .input(res.blob)
                        .execute();
                  })
                  .then(function() {
                    return nuxeo.repository().fetch(doc.uid, { schemas: ['dublincore', 'file'] });
                  })
                  .then(function(doc) {
                    var url = doc.uid;
                    callback(url);
                    defered.resolve(url);
                  })
                  .catch(function(error) {
                    throw error;
                    ctrl.swalError();
                    $scope.loadFormulario = false;
                    defered.reject(error);
                  });
              })
              .catch(function(error) {
                  throw error;
                  ctrl.swalError();
                  $scope.loadFormulario = false;
                  defered.reject(error);
              });

              return promise;
    };

    ctrl.cargarJustificacion = function(callFunction){
          nuxeo.connect().then(function(client) {
          // OK, the returned client is connected
              console.log("CONECTADO");
              var tam=2000;
              $scope.loadFormulario = true;
              var documento = ctrl.acta;
              if(documento.type !== "application/pdf" || documento.size>tam){
                ctrl.cargarDocumento("ActaSolicitud"+ctrl.solicitud, "Acta de evaluación de la solicitud "+ctrl.solicitud,documento, function(url){
                  ctrl.urlActa = url;
                })
                .then(function(){
                    ctrl.cargarRespuesta();
                }).catch(function(error){
                    ctrl.swalError();
                    $scope.loadFormulario = false;
                });
              }else{
                ctrl.swalError();
                $scope.loadFormulario = false;
              }
          }, function(err) {
          // cannot connect
            ctrl.swalError();
          });

    };

    ctrl.swalError = function(){
      swal(
        $translate.instant("ERROR.SUBIR_DOCUMENTO"),
        $translate.instant("VERIFICAR_DOCUMENTO"),
        'warning'
      );
      $scope.loadFormulario = false;
    };

    ctrl.cargarRespuesta= function(){

      swal(
        $translate.instant("ERROR.SUBIR_DOCUMENTO"),
        $translate.instant("VERIFICAR_DOCUMENTO"),
        'success'
      );
      $scope.loadFormulario = false;
    };

    ctrl.validarFormularioAprobacion = function(){
        if(!ctrl.isInicial){
          ctrl.cargarJustificacion();
        }

    };

    ctrl.obtenerDoc = function (docid) {
      var defered = $q.defer();

      nuxeo.request('/id/'+docid)
          .get()
          .then(function(response) {
            ctrl.doc=response;
            var aux=response.get('file:content');
            ctrl.document=response;
            defered.resolve(response);
          })
          .catch(function(error){
              defered.reject(error)
          });
      return defered.promise;
    };

    ctrl.obtenerFetch = function (doc) {
      var defered = $q.defer();

      doc.fetchBlob()
        .then(function(res) {
          defered.resolve(res.blob());

        })
        .catch(function(error){
              defered.reject(error)
          });
      return defered.promise;
    };

    ctrl.getDocumento = function(docid){
        if(docid!== undefined && docid!==""){
          $scope.loadDocumento = true;
        nuxeo.header('X-NXDocumentProperties', '*');
          ctrl.obtenerDoc(docid).then(function(){
             ctrl.obtenerFetch(ctrl.document).then(function(r){
                 ctrl.blob=r;
                 var fileURL = URL.createObjectURL(ctrl.blob);
                 console.log(fileURL);
                 ctrl.content = $sce.trustAsResourceUrl(fileURL);
                 $window.open(fileURL);
                 $scope.loadDocumento = false;
              })
              .catch(function(error){
                console.log("error",error);
                $scope.loadDocumento = false;
                swal(
                  $translate.instant("ERROR"),
                  $translate.instant("ERROR.CARGAR_DOCUMENTO"),
                  'warning'
                );
              });
          })
          .catch(function(error){
            console.log("error",error);
            $scope.loadDocumento = false;
            swal(
              $translate.instant("ERROR"),
              $translate.instant("ERROR.CARGAR_DOCUMENTO"),
              'warning'
            );
          });
        }else{
          swal(
            $translate.instant("ERROR"),
            $translate.instant("DOCUMENTO.SIN_DOCUMENTO"),
            'warning'
          );
        }
    }


    ctrl.getDocumentos = function(){
      // codigo para ejecutar consulta en nuxeo

      /*
      nuxeo.header('X-NXDocumentProperties', '*');
      nuxeo.operation('Document.Query')
          .params({
            query:"SELECT * FROM Document WHERE dc:title like 'ActasSolicitudes-20-%'",
          })
          .execute()
          .then(function(doc) {
              angular.forEach(doc.entries, function(documento){
                  ctrl.obtenerDoc(documento.uid).then(function(doc){
                      var tempDoc = {
                        "nombre":doc.get("file:content").name,
                        "url": doc.uid,
                        "documento":doc,
                      }
                      ctrl.documentos.push(tempDoc);
                  });
              });
          });
        */
        var sql = "";
        angular.forEach(ctrl.carrerasCoordinador, function(carrera){
            sql = sql+",Titulo.contains:Codigo de carrera:"+carrera.codigo_proyecto_curricular;

            var parametrosDocumentos = $.param({
              query:"TipoDocumentoEscrito:1"+sql,
              //query:"TipoDocumentoEscrito:1,Titulo.contains:Acta 12,Titulo.contains:Acta undefined",
              limit:0
            });
            $scope.loadDocumento = true;
            poluxRequest.get("documento_escrito",parametrosDocumentos).then(function(responseDocumentos){

              console.log(responseDocumentos);

                  angular.forEach(responseDocumentos.data, function(documento){
                    console.log("documentos", documento);
                      var tempDoc = {
                        "id": documento.Id,
                        "nombre":documento.Titulo,
                        "url": documento.Enlace,
                      }
                      ctrl.documentos.push(tempDoc);
                    });
                  $scope.loadDocumento = false;
            })
            .catch(function(error){
              console.log(error);
              ctrl.errorCargarDocumento = true;
              $scope.loadDocumento = false;
            });
        });

    }



    ctrl.seleccionarDocumento = function(){
      if(ctrl.acta.url!==undefined){
        $('#modalSeleccionarDocumento').modal('hide');
      }else{
        swal(
          $translate.instant("DOCUMENTO.SIN_DOCUMENTO"),
          ' ',
          'warning'
        );
      }
    }

    ctrl.modalDocumento = function(){
      ctrl.documentos = [];
      ctrl.getDocumentos();
      $('#modalSeleccionarDocumento').modal('show');
    }


  });
