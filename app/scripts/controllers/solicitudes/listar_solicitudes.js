'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:SolicitudesListarSolicitudesCtrl
 * @description
 * # SolicitudesListarSolicitudesCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
.controller('SolicitudesListarSolicitudesCtrl', function ($filter,$location, $q, $sce,$window,nuxeo,$translate, academicaRequest,poluxRequest,$scope) {
  var ctrl = this;
  $scope.msgCargandoSolicitudes = $translate.instant('LOADING.CARGANDO_SOLICITUDES');
  ctrl.solicitudes = [];
  ctrl.carrerasCoordinador = [];
  //$scope.userId = "60261576";
  //ctrl.userRole = "coordinador";
  $scope.userId = "20131020002";
  ctrl.userRole = "estudiante";
  ctrl.userId = $scope.userId;

  $scope.$watch("userId",function() {
      ctrl.conSolicitudes = false;
      ctrl.actualizarSolicitudes($scope.userId, ctrl.userRole);
      $scope.load = true;
    });


  ctrl.mostrarResultado = function(solicitud,detalles){
    var defered = $q.defer();
    var promise = defered.promise;
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
            var parametrosDocentesUD = {
              "identificacion":docente.Usuario
            };
            academicaRequest.obtenerDocentes(parametrosDocentesUD).then(function(responseDocente){
                docente.nombre =  responseDocente[0].NOMBRE;
                defer.resolve(docente);
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
          });
        }else{
          defer.resolve(docentes);
        }
      });

      return defer.promise;
    }

    var getVinculado = function(solicitud,rol,finInicio){
      var defered = $q.defer();
      var promise = defered.promise;
      var d = new Date(solicitud.Fecha);
      d.setTime( d.getTime() + d.getTimezoneOffset()*60*1000 );
      //alert(d);
      //alert("TrabajoGrado:"+solicitud.SolicitudTrabajoGrado.TrabajoGrado.Id+",RolTrabajoGrado.Id:"+rol+",Fecha"+finInicio+".contains:"+($filter('date')(d, "yyyy-MM-dd HH:mm:ss")));
      var parametrosVinculado= $.param({
        query:"TrabajoGrado:"+solicitud.SolicitudTrabajoGrado.TrabajoGrado.Id+",RolTrabajoGrado.Id:"+rol+",Fecha"+finInicio+".contains:"+($filter('date')(d, "yyyy-MM-dd HH:mm:ss.")),
        limit:1
      });
      poluxRequest.get("vinculacion_trabajo_grado",parametrosVinculado).then(function(responseVinculado){
        var parametrosDocentesUD = {
          "identificacion":responseVinculado.data[0].Usuario
        };
        academicaRequest.obtenerDocentes(parametrosDocentesUD).then(function(docente){
            docente = docente[0].NOMBRE;
            defered.resolve(docente);
          //ctrl.detallesSolicitud.resultado = ctrl.mostrarResultado(fila.entity.Respuesta,ctrl.detallesSolicitud);
        });

      });
      return promise;
    }
    if(solicitud.EstadoSolicitud.Nombre === 'Rechazada'){
      resultado = $translate.instant('SOLICITUD_RECHAZADA');
      defered.resolve(resultado);
    } else if(solicitud.EstadoSolicitud.Nombre === 'Aprobada por consejo de carrera'){
      resultado = $translate.instant('SOLICITUD_ES_APROBADA');
      switch(solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud.Id){
        //solicitud inicial
        case 2:
          getVinculadosIniciales(solicitud)
          .then(function(response){
            resultado += ". " + $translate.instant('APROBADO.CURSAR_MODALIDAD') + ctrl.detallesSolicitud.modalidad;
            resultado += response;
            defered.resolve(resultado);
          });
          break;
        //solicitud de cancelación de modalidad
        case 3:
          resultado += ". " + $translate.instant('APROBADO.CANCELAR_MODALIDAD') + ctrl.detallesSolicitud.modalidad;
          defered.resolve(resultado);
          break;
        //solicitud de cambio de director interno
        case 4:
          $q.all([getVinculado(solicitud,1,"Fin"),getVinculado(solicitud,1,"Inicio")]).then(function(response){
            nuevo = response[1];
            anterior = response[0];
            resultado += ". " + $translate.instant('APROBADO.DIRECTOR_INTERNO',{nuevo:nuevo,anterior:anterior});
            defered.resolve(resultado);
          });
          break;
        //solicitud de cambio de director interno
        case 10:
          $q.all([getVinculado(solicitud,3,"Fin"),getVinculado(solicitud,3,"Inicio")]).then(function(response){
            nuevo = response[1];
            anterior = response[0];
            resultado += ". " + $translate.instant('APROBADO.EVALUADOR',{nuevo:nuevo,anterior:anterior});
            defered.resolve(resultado);
          });
          break;
        //solicitud de prorroga
        case 7:
          resultado += ". " + $translate.instant('APROBADO.PRORROGA');
          defered.resolve(resultado);
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
          defered.resolve(resultado);
          break;
        //default
        default:
          defered.resolve(resultado);
          break;          
      }

    }else{
      defered.resolve(resultado);
    }
    return promise;
  }

  ctrl.actualizarSolicitudes = function (identificador, rol){
    var promiseArr = [];

      ctrl.solicitudes = [];
      var parametrosSolicitudes;
      var tablaConsulta ;

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

      if(rol === "estudiante"){
        tablaConsulta = "usuario_solicitud";
        parametrosSolicitudes = $.param({
            query:"usuario:"+identificador,
            limit:0
        });
        poluxRequest.get(tablaConsulta, parametrosSolicitudes).then(function(responseSolicitudes){
              angular.forEach(responseSolicitudes.data, function(solicitud){
                var defered = $q.defer();
                var promise = defered.promise;
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
                      defered.resolve(solicitud.data);
                 });
              });
              $q.all(promiseArr).then(function(){
                  if(responseSolicitudes.data !== null){
                    ctrl.conSolicitudes = true;
                  }
                  ctrl.gridOptions.data = ctrl.solicitudes;
                  $scope.load = false;
              }).catch(function(error){
                  console.log(error);
              });
        });
      }
      if(rol === "coordinador"){
        $scope.botones.push({ clase_color: "ver", clase_css: "fa fa-cog fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.RESPONDER_SOLICITUD'), operacion: 'responder', estado: true });

        var parametrosCoordinador = {
          "identificacion":$scope.userId,
        };

        tablaConsulta = "respuesta_solicitud";

        parametrosSolicitudes = $.param({
            //query:"usuario:"+identificador+",ESTADOSOLICITUD.ID:1",
            query:"ESTADOSOLICITUD.ID:1,Activo:true",
            limit:0
        });

      academicaRequest.obtenerCoordinador(parametrosCoordinador).then(function(responseCoordinador){
              ctrl.carrerasCoordinador = [];
              var carreras  = [];
              if(responseCoordinador!=="null"){
              ctrl.carrerasCoordinador = responseCoordinador;
              angular.forEach(responseCoordinador, function(carrera){
                  carreras.push(carrera.CODIGO_CARRERA);
              });

              poluxRequest.get(tablaConsulta, parametrosSolicitudes).then(function(responseSolicitudes){

                angular.forEach(responseSolicitudes.data, function(solicitud){
                  var defered = $q.defer();
                  var promise = defered.promise;
                  promiseArr.push(promise);
                    solicitud.data = {
                    'Id':solicitud.SolicitudTrabajoGrado.Id,
                    'Modalidad':solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.Modalidad.Nombre,
                    'ModalidadTipoSolicitud':solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud.Nombre,
                    'Fecha': solicitud.SolicitudTrabajoGrado.Fecha.toString().substring(0, 10),
                  }

                  if(responseSolicitudes.data !== null){
                    ctrl.conSolicitudes = true;
                  }
                    var parametrosUsuario=$.param({
                      query:"SolicitudTrabajoGrado:"+solicitud.SolicitudTrabajoGrado.Id,
                      sortby:"Usuario",
                      order:"asc",
                      limit:1,
                    });

                    poluxRequest.get("usuario_solicitud",parametrosUsuario).then(function(usuario){

                      if(solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud.Id===11){//sols de distincion

                        var parametros=$.param({
                          query:"SolicitudTrabajoGrado:"+solicitud.SolicitudTrabajoGrado.Id
                        });
                        ctrl.obtenerEstudiantes(parametros);
                      }else{
                        ctrl.est=usuario.data[0].Usuario;
                      }

                      var parametrosEstudiante = {
                        "codigo":ctrl.est,
                      };
                      academicaRequest.obtenerEstudiantes(parametrosEstudiante).then(function(responseEstudiante){
                        console.log(responseEstudiante);
                        var carreraEstudiante = responseEstudiante[0].CARRERA;
                        if(carreras.includes(carreraEstudiante)){
                          solicitud.data.Estado = solicitud.EstadoSolicitud.Nombre;
                          solicitud.data.Respuesta = solicitud;
                         // solicitud.data.Respuesta.Resultado = $translate.instant('SOLICITUD_SIN_RESPUESTA');
                          solicitud.data.Carrera = carreraEstudiante;
                          ctrl.solicitudes.push(solicitud.data);
                          defered.resolve(solicitud.data);
                          ctrl.gridOptions.data = ctrl.solicitudes;
                        }else{
                          defered.resolve(carreraEstudiante);
                        }
                      });

                    });
                  });
                  $q.all(promiseArr).then(function(){
                      if(ctrl.solicitudes.length != 0){
                        ctrl.conSolicitudes = true;
                      }
                      ctrl.gridOptions.data = ctrl.solicitudes;
                      $scope.load = false;
                  }).catch(function(error){
                      console.log(error);
                  });
                });
              }else{
                $scope.load = false;
              }
        });
    }
  }

  ctrl.getDocumento = function(docid){
      nuxeo.header('X-NXDocumentProperties', '*');

      ctrl.obtenerDoc = function () {
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

        ctrl.obtenerDoc().then(function(){

           ctrl.obtenerFetch(ctrl.document).then(function(r){
               ctrl.blob=r;
               var fileURL = URL.createObjectURL(ctrl.blob);
               console.log(fileURL);
               ctrl.content = $sce.trustAsResourceUrl(fileURL);
               $window.open(fileURL);
            });
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

  ctrl.obtenerEstudiantes = function(parametros){
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
              console.log(estudiantes.data[0].Estudiante);
              ctrl.est=estudiantes.data[0].Estudiante;
            });

          }
        });

    });

  }

  ctrl.cargarDetalles = function(fila){
      var solicitud = fila.entity.Id;
      var parametrosSolicitud = $.param({
          query:"SolicitudTrabajoGrado.Id:"+solicitud,
          limit:0
      });

      var getDocumento = function(fila,solicitud){
        var defer = $q.defer();
        if(fila.entity.Respuesta.EstadoSolicitud.Id!==1 && fila.entity.Respuesta.EstadoSolicitud.Id!==2){
          var parametrosDocumentoSolicitud = $.param({
            query:"SolicitudTrabajoGrado.Id:"+solicitud,
            limit:0
          });
          poluxRequest.get("documento_solicitud",parametrosDocumentoSolicitud).then(function(documento){
            ctrl.detallesSolicitud.documento = documento.data[0].DocumentoEscrito;
            defer.resolve(documento);
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
              var solicitantes = "";
              console.log("respuesta",fila.entity.Respuesta);
              ctrl.detallesSolicitud.id = fila.entity.Id;
              ctrl.detallesSolicitud.tipoSolicitud = fila.entity.ModalidadTipoSolicitud;
              ctrl.detallesSolicitud.fechaSolicitud = fila.entity.Fecha;
              ctrl.detallesSolicitud.estado = fila.entity.Estado;
              ctrl.detallesSolicitud.modalidad = fila.entity.Modalidad;
              ctrl.detallesSolicitud.respuesta= fila.entity.Respuesta.Justificacion;
              ctrl.mostrarResultado(fila.entity.Respuesta,ctrl.detallesSolicitud).then(function(resultado){
                ctrl.detallesSolicitud.resultado = resultado;
              });

              angular.forEach(responseEstudiantes.data,function(estudiante){
                  solicitantes += (", "+estudiante.Usuario) ;
              });
              angular.forEach(ctrl.detallesSolicitud,function(detalle){
                    detalle.filas = [];
                    var id = detalle.DetalleTipoSolicitud.Detalle.Id;
                    console.log(detalle);
                    if(id===49){
                      detalle.Descripcion = detalle.Descripcion.split("-")[1];
                    } else if( id === 9 || id === 14 || id===15 || id === 16 || id === 17 || id===48){
                      var parametrosDocentesUD = {
                        "identificacion":detalle.Descripcion
                      };
                      academicaRequest.obtenerDocentes(parametrosDocentesUD).then(function(docente){
                        detalle.Descripcion = docente[0].NOMBRE;
                        //ctrl.detallesSolicitud.resultado = ctrl.mostrarResultado(fila.entity.Respuesta,ctrl.detallesSolicitud);
                      });

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
              ctrl.detallesSolicitud.solicitantes = solicitantes.substring(2)+".";
              getDocumento(fila,solicitud).then(function(){
                $('#modalVerSolicitud').modal('show');
              });
          });
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
