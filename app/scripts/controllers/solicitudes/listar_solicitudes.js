'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:SolicitudesListarSolicitudesCtrl
 * @description
 * # SolicitudesListarSolicitudesCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
.controller('SolicitudesListarSolicitudesCtrl', function ($filter,$location, $q, $sce,$window,nuxeo,$translate, academicaRequest,poluxRequest,$scope,token_service) {
  var ctrl = this;
  $scope.msgCargandoSolicitudes = $translate.instant('LOADING.CARGANDO_SOLICITUDES');
  ctrl.solicitudes = [];
  ctrl.carrerasCoordinador = [];
  //token_service.token.documento = "79647592";
  //token_service.token.role.push("COORDINADOR_PREGRADO");
  token_service.token.documento = "20131020039";
  token_service.token.role.push("ESTUDIANTE");
  ctrl.userRole = token_service.token.role;
  $scope.userId = token_service.token.documento;
  ctrl.userId = $scope.userId;

  //$scope.$watch("userId",function() {
      //ctrl.conSolicitudes = false;
      //ctrl.actualizarSolicitudes($scope.userId, ctrl.userRole);
      //$scope.load = true;
  //});


  ctrl.mostrarResultado = function(solicitud,detalles){
    var defer = $q.defer();
    var promise = defer.promise;
    var resultado = $translate.instant('SOLICITUD_SIN_RESPUESTA');
    var nuevo = "";
    var anterior = "";

    var getVinculadosIniciales = function(solicitud){
      var defer = $q.defer();
      var docentes = "";
      var d = new Date(solicitud.Fecha);
      d.setTime( d.getTime() + d.getTimezoneOffset()*60*1000 );
      var parametrosVinculadoInicial= $.param({
        query:"FechaInicio.contains:"+($filter('date')(d, "yyyy-MM-dd HH:mm:ss.")),
        limit:0,
        sortby:"RolTrabajoGRado",
        order:"asc"
      });
      poluxRequest.get("vinculacion_trabajo_grado",parametrosVinculadoInicial).then(function(responseVinculados){
        if(responseVinculados.data!==null){

          var getNombreDocente = function(docente){
            var defer = $q.defer();
            academicaRequest.get("docente_tg", [docente.Usuario]).then(function(responseDocente){
                if (!angular.isUndefined(responseDocente.data.docenteTg.docente)) {
                  docente.nombre =  responseDocente.data.docenteTg.docente[0].nombre;
                  defer.resolve(docente);
                }else{
                  defer.reject("no se pudo cargar datos de los docentes");
                }
            })
            .catch(function(error){
              defer.reject(error);
            });
            return defer.promise;
          }

          var promises = [];
          angular.forEach(responseVinculados.data, function(vinculado){
            promises.push(getNombreDocente(vinculado));
          });
          $q.all(promises).then(function(){
            var directorInterno = $translate.instant("DIRECTOR_INTERNO");
            var evaluador = $translate.instant("EVALUADOR");
            angular.forEach(responseVinculados.data, function(vinculado){
               if(vinculado.RolTrabajoGrado.Id===1){
                directorInterno += ": "+vinculado.nombre;
               }
               if(vinculado.RolTrabajoGrado.Id===3){
                if(evaluador===$translate.instant("EVALUADOR")){
                  evaluador += ": "+vinculado.nombre;
                }else{
                  evaluador += ", "+vinculado.nombre
                }
               }
            });
            docentes = (directorInterno!==$translate.instant("DIRECTOR_INTERNO"))?docentes+". "+directorInterno:docentes;
            docentes = (evaluador!==$translate.instant("EVALUADOR"))?docentes+". "+evaluador:docentes;
            defer.resolve(docentes);
          })
          .catch(function(error){
            defer.reject(error);
          });
        }else{
          defer.resolve(docentes);
        }
      });
      return defer.promise;
    }

    var getVinculado = function(solicitud,rol,finInicio){
      var defer = $q.defer();
      var promise = defer.promise;
      var d = new Date(solicitud.Fecha);
      d.setTime( d.getTime() + d.getTimezoneOffset()*60*1000 );
      //alert(d);
      //alert("TrabajoGrado:"+solicitud.SolicitudTrabajoGrado.TrabajoGrado.Id+",RolTrabajoGrado.Id:"+rol+",Fecha"+finInicio+".contains:"+($filter('date')(d, "yyyy-MM-dd HH:mm:ss")));
      var parametrosVinculado= $.param({
        query:"TrabajoGrado:"+solicitud.SolicitudTrabajoGrado.TrabajoGrado.Id+",RolTrabajoGrado.Id:"+rol+",Fecha"+finInicio+".contains:"+($filter('date')(d, "yyyy-MM-dd HH:mm:ss.")),
        limit:1
      });
      poluxRequest.get("vinculacion_trabajo_grado",parametrosVinculado).then(function(responseVinculado){

        academicaRequest.get("docente_tg", [responseVinculado.data[0].Usuario]).then(function(docente){
            if (!angular.isUndefined(docente.data.docenteTg.docente)) {

            docente = docente.data.docenteTg.docente[0].nombre;
            defer.resolve(docente);
          //ctrl.detallesSolicitud.resultado = ctrl.mostrarResultado(fila.entity.Respuesta,ctrl.detallesSolicitud);
            }else{
              defer.reject("no se encuentran datos del docente");
            }
        })
        .catch(function(error){
          defer.reject(error);
        });
      })
      .catch(function(error){
        defer.reject(error);
      });
      return promise;
    }

    if(solicitud.EstadoSolicitud.Id === 2){
      resultado = $translate.instant('SOLICITUD_RECHAZADA');
      detalles.resultado = resultado;
      defer.resolve(resultado);
    } else if(solicitud.EstadoSolicitud.Id === 3){
      resultado = $translate.instant('SOLICITUD_ES_APROBADA');
      switch(solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud.Id){
        //solicitud inicial
        case 2:
          getVinculadosIniciales(solicitud)
          .then(function(response){
            resultado += ". " + $translate.instant('APROBADO.CURSAR_MODALIDAD') + ctrl.detallesSolicitud.modalidad;
            resultado += response;
            detalles.resultado = resultado;
            defer.resolve(resultado);
          })
          .catch(function(error){
            defer.reject(error);
          });
          break;
        //solicitud de cancelación de modalidad
        case 3:
          resultado += ". " + $translate.instant('APROBADO.CANCELAR_MODALIDAD') + ctrl.detallesSolicitud.modalidad;
          detalles.resultado = resultado;
          defer.resolve(resultado);
          break;
        //solicitud de cambio de director interno
        case 4:
          $q.all([getVinculado(solicitud,1,"Fin"),getVinculado(solicitud,1,"Inicio")]).then(function(response){
            nuevo = response[1];
            anterior = response[0];
            resultado += ". " + $translate.instant('APROBADO.DIRECTOR_INTERNO',{nuevo:nuevo,anterior:anterior});
            detalles.resultado = resultado;
            defer.resolve(resultado);
          })
          .catch(function(error){
            defer.reject(error);
          });
          break;
        //solicitud de cambio de director interno
        case 10:
          $q.all([getVinculado(solicitud,3,"Fin"),getVinculado(solicitud,3,"Inicio")]).then(function(response){
            nuevo = response[1];
            anterior = response[0];
            resultado += ". " + $translate.instant('APROBADO.EVALUADOR',{nuevo:nuevo,anterior:anterior});
            detalles.resultado = resultado;
            defer.resolve(resultado);
          })
          .catch(function(error){
            defer.reject(error);
          });
          break;
        //solicitud de prorroga
        case 7:
          resultado += ". " + $translate.instant('APROBADO.PRORROGA');
          detalles.resultado = resultado;
          defer.resolve(resultado);
          break;
        //Solicitud de cambio de nombre de trabajo de grado
        case 8:
          angular.forEach(detalles, function(detalle){
            var id = detalle.DetalleTipoSolicitud.Detalle.Id;
            if(id===26){
              nuevo = detalle.Descripcion;
            }
            if(id===25){
              anterior = detalle.Descripcion;
            }
          });
          resultado += ". " + $translate.instant('APROBADO.CAMBIAR_NOMBRE',{nuevo:nuevo,anterior:anterior});
          detalles.resultado = resultado;
          defer.resolve(resultado);
          break;
        //Solicitd de camibio de materias
        case 9:
          angular.forEach(detalles, function(detalle){
            var id = detalle.DetalleTipoSolicitud.Detalle.Id;
            if (id===23) {
              anterior = detalle.Descripcion.split("-")[1];
            }
            if (id===24) {
              nuevo = detalle.Descripcion.split("-")[1];
            }
          });
          resultado += ". " + $translate.instant('APROBADO.CAMBIAR_MATERIA',{nuevo:nuevo,anterior:anterior});
          detalles.resultado = resultado;
          defer.resolve(resultado);
          break;
        //default
        default:
          detalles.resultado = resultado;
          defer.resolve(resultado);
          break;
      }

    } else if (solicitud.EstadoSolicitud.Id === 5) {
      resultado = $translate.instant('SOLICITUD_OPCIONADA_SEGUNDA_CONVOCATORIA');
      detalles.resultado = resultado;
      defer.resolve(resultado);
    } else if(solicitud.EstadoSolicitud.Id === 6) {
      resultado = $translate.instant('SOLICITUD_RECHAZADA_CUPOS_INSUFICIENTES');
      detalles.resultado = resultado;
      defer.resolve(resultado);
    } else if(solicitud.EstadoSolicitud.Id === 7) {
      resultado = $translate.instant("SOLICITUD_APROBADA_EXENTA");
<<<<<<< HEAD
      defered.resolve(resultado);
    } else if (solicitud.EstadoSolicitud.Id === 11) {
      resultado = "asdf";
      defered.resolve(resultado);
=======
      detalles.resultado = resultado;
      defer.resolve(resultado);
>>>>>>> 3df43bb95c196eda2140146d50297c4d365e0fe3
    } else {
      detalles.resultado = resultado;
      defer.resolve(resultado);
    }
    return promise;
  }

  ctrl.actualizarSolicitudes = function (identificador, lista_roles){
      $scope.load = true;
      var promiseArr = [];

      ctrl.solicitudes = [];
      var parametrosSolicitudes;

      $scope.botones = [
              { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER_DETALLES'), operacion: 'ver', estado: true },
      ];

      ctrl.gridOptions = {
          paginationPageSizes: [5,10,15, 20, 25],
          paginationPageSize: 10,
          enableFiltering: true,
          enableSorting: true,
          enableSelectAll: false,
          useExternalPagination: false,
      };

      ctrl.gridOptions.columnDefs = [{
        name: 'Id',
        displayName: $translate.instant('NUMERO_RADICADO'),
        width:'15%',
      },{
        name: 'ModalidadTipoSolicitud',
        displayName: $translate.instant('TIPO_SOLICITUD'),
        width:'40%',
      },{
        name: 'Estado',
        displayName: $translate.instant('ESTADO_SOLICITUD'),
        width: '15%',
      }, {
        name: 'Fecha',
        displayName: $translate.instant('FECHA'),
        width: '15%',
      }, {
        name: 'Detalle',
        displayName: $translate.instant('DETALLE'),
        width:'15%',
        type: 'boolean',
        cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>'
      }];

      if(lista_roles.includes("ESTUDIANTE")){
        parametrosSolicitudes = $.param({
            query:"usuario:"+identificador,
            limit:0
        });
        poluxRequest.get("usuario_solicitud", parametrosSolicitudes).then(function(responseSolicitudes){
          if(responseSolicitudes.data !== null){
            ctrl.conSolicitudes = true;
          }
          var getDataSolicitud = function(solicitud){
            var defer = $q.defer();
            var promise = defer.promise;
            promiseArr.push(promise);
            solicitud.data = {
              'Id':solicitud.SolicitudTrabajoGrado.Id,
              'Modalidad':solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.Modalidad.Nombre,
              'ModalidadTipoSolicitud':solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud.Nombre,
              'Fecha': solicitud.SolicitudTrabajoGrado.Fecha.toString().substring(0, 10),
            }
            var parametrosRespuesta=$.param({
              query:"ACTIVO:TRUE,SolicitudTrabajoGrado:"+solicitud.SolicitudTrabajoGrado.Id,
            });
            poluxRequest.get("respuesta_solicitud",parametrosRespuesta).then(function(responseRespuesta){
                solicitud.data.Estado = responseRespuesta.data[0].EstadoSolicitud.Nombre;
                solicitud.data.Respuesta = responseRespuesta.data[0];
                //solicitud.data.Respuesta.Resultado = ctrl.mostrarResultado(responseRespuesta.data[0]);
                ctrl.solicitudes.push(solicitud.data);
                ctrl.gridOptions.data = ctrl.solicitudes;
                defer.resolve(solicitud.data);
            })
            .catch(function(error){
              console.log(error);
              defer.reject(error);
            })
            return defer.promise;
          }
          angular.forEach(responseSolicitudes.data, function(solicitud){
            promiseArr.push(getDataSolicitud(solicitud));
          });
          $q.all(promiseArr).then(function(){
              ctrl.gridOptions.data = ctrl.solicitudes;
              console.log(ctrl.solicitudes)
              $scope.load = false;
          })
          .catch(function(error){
              console.log(error);
              ctrl.mensajeError = $translate.instant("ERROR.CARGAR_DATOS_SOLICITUDES");
              ctrl.errorCargarParametros = true;
              $scope.load = false;
          });

        })
        .catch(function(error){
          console.log(error);
          ctrl.mensajeError = $translate.instant('ERROR.CARGAR_DATOS_ESTUDIANTES');
          ctrl.errorCargarParametros = true;
          $scope.load = false;
        });
      } else if(lista_roles.includes("COORDINADOR_PREGRADO")){
        $scope.botones.push({ clase_color: "ver", clase_css: "fa fa-check-square-o fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.RESPONDER_SOLICITUD'), operacion: 'responder', estado: true });

        var parametrosCoordinador = {
          "identificacion":$scope.userId,
          "tipo": "PREGRADO"
        };

        parametrosSolicitudes = $.param({
            //query:"usuario:"+identificador+",ESTADOSOLICITUD.ID:1",
            query:"ESTADOSOLICITUD.ID:1,Activo:true",
            // excluye las solicitudes de tipo carta de presentacion
            exclude:"SolicitudTrabajoGrado.ModalidadTipoSolicitud.Id:1",
            limit:0
        });

        academicaRequest.get("coordinador_carrera",[$scope.userId, "PREGRADO"]).then(function(responseCoordinador){
              ctrl.carrerasCoordinador = [];
              var carreras  = [];
              if (!angular.isUndefined(responseCoordinador.data.coordinadorCollection.coordinador)) {   
              ctrl.carrerasCoordinador = responseCoordinador.data.coordinadorCollection.coordinador;
              angular.forEach(responseCoordinador.data.coordinadorCollection.coordinador, function(carrera){
                  carreras.push(carrera.codigo_proyecto_curricular);
              });

              poluxRequest.get("respuesta_solicitud", parametrosSolicitudes).then(function(responseSolicitudes){
                  if(responseSolicitudes.data !== null){
                    ctrl.conSolicitudes = true;
                  }
                  var verificarSolicitud = function(solicitud){
                    var defer = $q.defer();
                    var promise = defer.promise;
                    solicitud.data = {
                      'Id':solicitud.SolicitudTrabajoGrado.Id,
                      'Modalidad':solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.Modalidad.Nombre,
                      'ModalidadTipoSolicitud':solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud.Nombre,
                      'Fecha': solicitud.SolicitudTrabajoGrado.Fecha.toString().substring(0, 10),
                    }                  
                    var parametrosUsuario=$.param({
                      query:"SolicitudTrabajoGrado:"+solicitud.SolicitudTrabajoGrado.Id,
                      sortby:"Usuario",
                      order:"asc",
                      limit:1,
                    });

                    poluxRequest.get("usuario_solicitud",parametrosUsuario).then(function(usuario){
                      ctrl.obtenerEstudiantes(solicitud,usuario).then(function(codigo_estudiante){
                        academicaRequest.get("datos_basicos_estudiante",[codigo_estudiante]).then(function(response2){
                          if (!angular.isUndefined(response2.data.datosEstudianteCollection.datosBasicosEstudiante)) {
                            var carreraEstudiante = response2.data.datosEstudianteCollection.datosBasicosEstudiante[0].carrera;
                            if(carreras.includes(carreraEstudiante)){
                              solicitud.data.Estado = solicitud.EstadoSolicitud.Nombre;
                              solicitud.data.Respuesta = solicitud;
                             // solicitud.data.Respuesta.Resultado = $translate.instant('SOLICITUD_SIN_RESPUESTA');
                              solicitud.data.Carrera = carreraEstudiante;
                              ctrl.solicitudes.push(solicitud.data);
                              defer.resolve(solicitud.data);
                              ctrl.gridOptions.data = ctrl.solicitudes;
                            }else{
                              defer.resolve(carreraEstudiante);
                            }
                          }
                        })
                        .catch(function(error){
                          defer.reject(error);
                        });
                      })
                      .catch(function(error){
                        defer.reject(error);
                      });
                    })
                    .catch(function(error){
                      defer.reject(error);
                    });
                    return defer.promise;
                  }
                  angular.forEach(responseSolicitudes.data, function(solicitud){
                    promiseArr.push(verificarSolicitud(solicitud));
                  });
                  $q.all(promiseArr).then(function(){
                      if(ctrl.solicitudes.length != 0){
                        ctrl.conSolicitudes = true;
                      }
                      ctrl.gridOptions.data = ctrl.solicitudes;
                      $scope.load = false;
                  })
                  .catch(function(error){
                    console.log(error);
                    ctrl.mensajeError = $translate.instant("ERROR.CARGAR_DATOS_SOLICITUDES");
                    ctrl.errorCargarParametros = true;
                    $scope.load = false;
                  });
                })
                .catch(function(error){
                  console.log(error);
                  ctrl.mensajeError = $translate.instant("ERROR.CARGAR_RESPUESTA_SOLICITUD");
                  ctrl.errorCargarParametros = true;
                  $scope.load = false;
                });
              }else{
                ctrl.mensajeError = $translate.instant("ERROR.SIN_CARRERAS_POSGRADO");
                ctrl.errorCargarParametros = true;
                $scope.load = false;
              }
        })
        .catch(function(error){
          console.log(error);
          ctrl.mensajeError = $translate.instant("ERROR.CARGAR_CARRERAS");
          ctrl.errorCargarParametros = true;
          $scope.load = false;
        });
    }
  }

  ctrl.actualizarSolicitudes($scope.userId, ctrl.userRole);

  ctrl.getDocumento = function(docid){
      nuxeo.header('X-NXDocumentProperties', '*');

      ctrl.obtenerDoc = function () {
        var defer = $q.defer();

        nuxeo.request('/id/'+docid)
            .get()
            .then(function(response) {
              ctrl.doc=response;
              var aux=response.get('file:content');
              ctrl.document=response;
              defer.resolve(response);
            })
            .catch(function(error){
                defer.reject(error)
            });
        return defer.promise;
      };

      ctrl.obtenerFetch = function (doc) {
        var defer = $q.defer();

        doc.fetchBlob()
          .then(function(res) {
            defer.resolve(res.blob());

          })
          .catch(function(error){
                defer.reject(error)
            });
        return defer.promise;
      };

        ctrl.obtenerDoc().then(function(){

           ctrl.obtenerFetch(ctrl.document).then(function(r){
               ctrl.blob=r;
               var fileURL = URL.createObjectURL(ctrl.blob);
               console.log(fileURL);
               ctrl.content = $sce.trustAsResourceUrl(fileURL);
               $window.open(fileURL);
            })
            .catch(function(error){
              console.log("error",error);
              swal(
                $translate.instant("ERROR"),
                $translate.instant("ERROR.CARGAR_DOCUMENTO"),
                'warning'
              );
            });

        })
        .catch(function(error){
          console.log("error",error);
          swal(
            $translate.instant("ERROR"),
            $translate.instant("ERROR.CARGAR_DOCUMENTO"),
            'warning'
          );
        });

  }

  ctrl.filtrarSolicitudes = function(carrera_seleccionada){
      var solicitudesTemporales = [];
      angular.forEach(ctrl.solicitudes, function(solicitud){
            if(solicitud.Carrera===carrera_seleccionada){
                solicitudesTemporales.push(solicitud);
            }
      });
      ctrl.gridOptions.data = solicitudesTemporales;
  }

  ctrl.obtenerEstudiantes = function(solicitud, usuario){
    var defer = $q.defer();
    if(solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud.Id===11){//sols de distincion
      var parametros=$.param({
        query:"SolicitudTrabajoGrado:"+solicitud.SolicitudTrabajoGrado.Id
      });
      poluxRequest.get("detalle_solicitud",parametros).then(function(detalles){
        console.log(detalles);
          angular.forEach(detalles.data, function(detalle){
            console.log(detalle.DetalleTipoSolicitud.Detalle.Id);
            if(detalle.DetalleTipoSolicitud.Detalle.Id===50){//buscar el detalle asociado al TG
              console.log(detalle.Descripcion);
              var parametros=$.param({
                query:"TrabajoGrado.Id:"+detalle.Descripcion
              });
              poluxRequest.get("estudiante_trabajo_grado",parametros).then(function(estudiantes){
                defer.resolve(estudiantes.data[0].Estudiante);
              });

            }
          });
      })
      .catch(function(error){
        defer.reject(error);
      });
    }else{
      defer.resolve(usuario.data[0].Usuario);
    }
    return defer.promise;
  }

  ctrl.cargarDetalles = function(fila){
      var solicitud = fila.entity.Id;
      var parametrosSolicitud = $.param({
          query:"SolicitudTrabajoGrado.Id:"+solicitud,
          limit:0
      });

      var getDocumentoRespuesta = function(fila,solicitud){
        var defer = $q.defer();
        if(fila.entity.Respuesta.EstadoSolicitud.Id!==1){
          var parametrosDocumentoSolicitud = $.param({
            query:"SolicitudTrabajoGrado.Id:"+solicitud,
            limit:0
          });
          poluxRequest.get("documento_solicitud",parametrosDocumentoSolicitud).then(function(documento){
            if(documento.data !== null){
              ctrl.detallesSolicitud.documento = documento.data[0].DocumentoEscrito;
            }
            defer.resolve();
          })
          .catch(function(error){
            defer.reject(error);
          });
        }else{
          defer.resolve();
        }
        return defer.promise;
      }

      poluxRequest.get("detalle_solicitud",parametrosSolicitud).then(function(responseDetalles){
          poluxRequest.get("usuario_solicitud",parametrosSolicitud).then(function(responseEstudiantes){
            if(responseDetalles.data===null){
              ctrl.detallesSolicitud = [];
            }else{
              ctrl.detallesSolicitud = responseDetalles.data;
            } 
              var promises = [];
              var solicitantes = "";
              console.log("respuesta",fila.entity.Respuesta);
              ctrl.detallesSolicitud.id = fila.entity.Id;
              ctrl.detallesSolicitud.tipoSolicitud = fila.entity.ModalidadTipoSolicitud;
              ctrl.detallesSolicitud.fechaSolicitud = fila.entity.Fecha;
              ctrl.detallesSolicitud.estado = fila.entity.Estado;
              ctrl.detallesSolicitud.modalidad = fila.entity.Modalidad;
              ctrl.detallesSolicitud.PeriodoAcademico = fila.entity.Respuesta.SolicitudTrabajoGrado.PeriodoAcademico;
              ctrl.detallesSolicitud.respuesta= fila.entity.Respuesta.Justificacion;
              //ctrl.mostrarResultado(fila.entity.Respuesta,ctrl.detallesSolicitud).then(function(resultado){
                //ctrl.detallesSolicitud.resultado = resultado;
              //});
              promises.push(ctrl.mostrarResultado(fila.entity.Respuesta,ctrl.detallesSolicitud));
              angular.forEach(responseEstudiantes.data,function(estudiante){
                  solicitantes += (", "+estudiante.Usuario) ;
              });
              angular.forEach(ctrl.detallesSolicitud,function(detalle){
                    detalle.filas = [];
                    var id = detalle.DetalleTipoSolicitud.Detalle.Id;

                    var getDocente = function(detalle){
                      var defer = $q.defer();
                      academicaRequest.get("docente_tg", [detalle.Descripcion]).then(function(docente){
                        if (!angular.isUndefined(docente.data.docenteTg.docente)) {
                          detalle.Descripcion = docente.data.docenteTg.docente[0].nombre;
                          defer.resolve();
                        }
                      })
                      .catch(function(error){
                        defer.reject(error);
                      });
                      return defer.promise;
                    }
                    if(id===49){
                      detalle.Descripcion = detalle.Descripcion.split("-")[1];
                    } else if( id === 9 || id === 14 || id===15 || id === 16 || id === 17 || id===48){
                      promses.push(getDocente(detalle));
                    }else if(detalle.Descripcion.includes("JSON-")){
                        if(detalle.DetalleTipoSolicitud.Detalle.Id===8){
                          //areas de conocimiento
                          var datosAreas = detalle.Descripcion.split("-");
                          datosAreas.splice(0,1);
                          detalle.Descripcion = "";
                          angular.forEach(datosAreas, function(area){
                              console.log(JSON.parse(area));
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
              ctrl.detallesSolicitud.solicitantes = solicitantes.substring(2)+".";
              promises.push(getDocumentoRespuesta(fila,solicitud));
              $q.all(promises).then(function(){
                $('#modalVerSolicitud').modal('show');
              })
              .catch(function(error){
                console.log(error);
                swal(
                  $translate.instant('ERROR'),
                  $translate.instant('ERROR.CARGAR_DETALLES_SOLICITUD'),
                  'warning'
                );
              });
          })
          .catch(function(error){
            console.log(error);
            swal(
              $translate.instant('ERROR'),
              $translate.instant('ERROR.CARGAR_DATOS_ESTUDIANTES'),
              'warning'
            );
          });
      })
      .catch(function(error){
        console.log(error);
        swal(
          $translate.instant('ERROR'),
          $translate.instant('ERROR.CARGAR_DETALLES_SOLICITUD'),
          'warning'
        );
      });
  }

  $scope.loadrow = function(row, operacion) {
            switch (operacion) {
                case "ver":
                    ctrl.cargarDetalles(row)
                    //$('#modalVerSolicitud').modal('show');
                    break;
                case "responder":
                    //$('#modalEvaluarSolicitud').modal('show');
                    $location.path("solicitudes/aprobar_solicitud/"+row.entity.Id);
                    break;
                default:
                    break;
            }
        };



});
