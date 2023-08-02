'use strict';

/**
 * @ngdoc controller
 * @name poluxClienteApp.controller:SolicitudesListarSolicitudesCtrl
 * @description
 * # SolicitudesListarSolicitudesCtrl
 * Controller of the poluxClienteApp
 * Controlador que permite listar las solicitudes, en caso del estudiante todas las que haya realizado, en caso de un coordinador de pregrado las solicitudes radicadas y aprobadas
 * @requires $filter
 * @requires $location
 * @requires $q 
 * @requires $scope
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires $window
 * @requires services/parametrosService.service:parametrosRequest
 * @requires services/academicaService.service:academicaRequest
 * @requires services/poluxClienteApp.service:nuxeoService
 * @requires services/poluxService.service:nuxeoClient
 * @requires services/poluxService.service:poluxRequest
 * @requires services/poluxClienteApp.service:tokenService 
 * @requires services/poluxService.service:gestorDocumentalMidService
 * @property {Number} userId Documento del usuario que ingresa al módulo
 * @property {Object} userRole Listado de roles que tiene el usuairo que ingresa al módulo
 * @property {Object} gridOptions Opciones del ui-grid que contiene las solicitudes
 * @property {Array} solicitudes Solicitudes que se muuestran en el ui-grid
 * @property {Object} detallesSolicitud Detalles especificos de una solicitud seleccionada en el ui-grid
 * @property {Array} carrerasCoordinador Colección de carreras asociadas al coordinador en sesión
 * @property {Object} detallesSolicitud Objeto que carga la información sobre los detalles de la solicitud
 * @property {Boolean} conSolicitudes Indicador que define si existen solicitudes asociadas a la consulta en curso
 * @property {String} mensajeError Texto que aparece en caso de ocurrir un error al cargar la información
 * @property {Boolean} errorCargarParametros Indicador que maneja la aparición de un error durante la carga de parámetros
 * @property {String} msgCargandoSolicitudes Texto que aparece durante la carga de las solicitudes
 * @property {Boolean} load Indicador que opera la carga de contenidos en la página
 * @property {Array} botones Colección que maneja las propiedades de los botones en pantalla
 */
angular.module('poluxClienteApp')
  .controller('SolicitudesListarSolicitudesCtrl',
    function($filter, $location, $q, $scope, $translate,utils,gestorDocumentalMidRequest, $window, parametrosRequest, academicaRequest, nuxeo, nuxeoClient, poluxRequest, token_service) {
      var ctrl = this;
      $scope.msgCargandoSolicitudes = $translate.instant('LOADING.CARGANDO_SOLICITUDES');
      ctrl.solicitudes = [];
      ctrl.carrerasCoordinador = [];
      //token_service.token.documento = "79647592";
      //token_service.token.role.push("COORDINADOR_PREGRADO");
      //token_service.token.documento = "20131020002";
      //token_service.token.role.push("ESTUDIANTE");
      ctrl.userRole = token_service.getAppPayload().appUserRole;
      $scope.userId = token_service.getAppPayload().appUserDocument;
      ctrl.userId = $scope.userId;
      //$scope.$watch("userId",function() {
      //ctrl.conSolicitudes = false;
      //ctrl.actualizarSolicitudes($scope.userId, ctrl.userRole);
      //$scope.load = true;
      //});
      
       
      /**
       * @ngdoc method
       * @name mostrarResultado
       * @methodOf poluxClienteApp.controller:SolicitudesListarSolicitudesCtrl
       * @description 
       * Función que muestra el resultado de la solicitud, esta función muestra lo sucedido con la solicitud cuando fue aprobada o rechazada, y realiza una pequeña descripción de lo que 
       * sucedió, por ejemplo en el caso de cambio de materias muestra el nombre de la materia que se canceló y el nombre de la que se registró, en el caso de las iniciales muestra si el estudiante
       * puede o no cursar la modalidad solicitada, etc.
       * @param {Object} solicitud Solicitud que se consulta
       * @param {Object} detalles Detalles asociados a la solicitud que se está consultando
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplió la petición y se resuleve con el string resultado
       */
      ctrl.mostrarResultado = function(solicitud, detalles) {
        var defer = $q.defer();
        var promise = defer.promise;
        var resultado = $translate.instant('SOLICITUD_SIN_RESPUESTA');
        var nuevo = "";
        var anterior = "";
        /*
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
            if(Object.keys(responseVinculados.data[0]).length > 0){

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
        */
        if (solicitud.EstadoSolicitud.Id === 2) {
          resultado = $translate.instant('SOLICITUD_RECHAZADA');
          detalles.resultado = resultado;
          defer.resolve(resultado);
        } else if (solicitud.EstadoSolicitud.Id === 3) {
          resultado = $translate.instant('SOLICITUD_ES_APROBADA');
          switch (solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud.Id) {
            //solicitud inicial
            case 2:
              resultado += ". " + $translate.instant('APROBADO.CURSAR_MODALIDAD') + ctrl.detallesSolicitud.modalidad;
              //resultado += response;
              detalles.resultado = resultado;
              defer.resolve(resultado);
              /*getVinculadosIniciales(solicitud)
              .then(function(response){
                resultado += ". " + $translate.instant('APROBADO.CURSAR_MODALIDAD') + ctrl.detallesSolicitud.modalidad;
                resultado += response;
                detalles.resultado = resultado;
                defer.resolve(resultado);
              })
              .catch(function(error){
                defer.reject(error);
              });*/
              break;
              //solicitud de cancelación de modalidad
            case 3:
              resultado += ". " + $translate.instant('APROBADO.CANCELAR_MODALIDAD') + ctrl.detallesSolicitud.modalidad;
              detalles.resultado = resultado;
              defer.resolve(resultado);
              break;
              //solicitud de cambio de director interno
            case 4:
              /*$q.all([getVinculado(solicitud,1,"Fin"),getVinculado(solicitud,1,"Inicio")]).then(function(response){
                nuevo = response[1];
                anterior = response[0];
                resultado += ". " + $translate.instant('APROBADO.DIRECTOR_INTERNO',{nuevo:nuevo,anterior:anterior});
                detalles.resultado = resultado;
                defer.resolve(resultado);
              })
              .catch(function(error){
                defer.reject(error);
              });*/
              resultado += ". " + $translate.instant('APROBADO.DIRECTOR_INTERNO');
              detalles.resultado = resultado;
              defer.resolve(resultado)
              break;
              //solicitud de cambio de director externo
            case 5:
              resultado += ". " + $translate.instant('APROBADO.DIRECTOR_EXTERNO');
              detalles.resultado = resultado;
              defer.resolve(resultado);
              break;
              // solicitud de socialización
            case 6:
              resultado += ". " + $translate.instant('APROBADO.SOCIALIZACION');
              detalles.resultado = resultado;
              defer.resolve(resultado);
              break;
              //solicitud de prorroga
            case 7:
              resultado += ". " + $translate.instant('APROBADO.PRORROGA');
              detalles.resultado = resultado;
              defer.resolve(resultado);
              break;
              //Solicitud de cambio de nombre de trabajo de grado
            case 8:
              angular.forEach(detalles, function(detalle) {
                var id = detalle.DetalleTipoSolicitud.Detalle.Id;
                if (id === 26) {
                  nuevo = detalle.Descripcion;
                }
                if (id === 25) {
                  anterior = detalle.Descripcion;
                }
              });
              resultado += ". " + $translate.instant('APROBADO.CAMBIAR_NOMBRE', {
                nuevo: nuevo,
                anterior: anterior
              });
              detalles.resultado = resultado;
              defer.resolve(resultado);
              break;
              //Solicitd de camibio de materias
            case 9:
              angular.forEach(detalles, function(detalle) {
                var id = detalle.DetalleTipoSolicitud.Detalle.Id;
                if (id === 23) {
                  anterior = detalle.Descripcion.split("-")[1];
                }
                if (id === 24) {
                  nuevo = detalle.Descripcion.split("-")[1];
                }
              });
              resultado += ". " + $translate.instant('APROBADO.CAMBIAR_MATERIA', {
                nuevo: nuevo,
                anterior: anterior
              });
              detalles.resultado = resultado;
              defer.resolve(resultado);
              break;
              //solicitud de cambio de director interno
            case 10:
              /*$q.all([getVinculado(solicitud,3,"Fin"),getVinculado(solicitud,3,"Inicio")]).then(function(response){
                nuevo = response[1];
                anterior = response[0];
                resultado += ". " + $translate.instant('APROBADO.EVALUADOR',{nuevo:nuevo,anterior:anterior});
                detalles.resultado = resultado;
                defer.resolve(resultado);
              })
              .catch(function(error){
                defer.reject(error);
              });*/
              resultado += ". " + $translate.instant('APROBADO.EVALUADOR');
              detalles.resultado = resultado;
              defer.resolve(resultado);
              break;
              //Solicitud de cambio de codirector
            case 12:
              /*$q.all([getVinculado(solicitud,4,"Fin"),getVinculado(solicitud,4,"Inicio")]).then(function(response){
                nuevo = response[1];
                anterior = response[0];
                resultado += ". " + $translate.instant('APROBADO.CODIRECTOR',{nuevo:nuevo,anterior:anterior});
                detalles.resultado = resultado;
                defer.resolve(resultado);
              })
              .catch(function(error){
                defer.reject(error);
              });*/
              resultado += ". " + $translate.instant('APROBADO.CODIRECTOR');
              detalles.resultado = resultado;
              defer.resolve(resultado);
              break;
              // solicitud de revisión
            case 13:
              resultado += ". " + $translate.instant('APROBADO.REVISION');
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
        } else if (solicitud.EstadoSolicitud.Id === 6) {
          resultado = $translate.instant('SOLICITUD_RECHAZADA_CUPOS_INSUFICIENTES');
          detalles.resultado = resultado;
          defer.resolve(resultado);
        } else if (solicitud.EstadoSolicitud.Id === 7) {
          resultado = $translate.instant("SOLICITUD_APROBADA_EXENTA");
          detalles.resultado = resultado;
          defer.resolve(resultado);
        } else if (solicitud.EstadoSolicitud.Id === 8) {
          resultado = $translate.instant("SOLICITUD_RECHAZADA_CUPOS_INSUFICIENTES");
          detalles.resultado = resultado;
          defer.resolve(resultado);
        } else if (solicitud.EstadoSolicitud.Id === 9) {
          resultado = $translate.instant("SOLICITUD_FORMALIZADA_EXENTA_PAGO");
          detalles.resultado = resultado;
          defer.resolve(resultado);
        } else if (solicitud.EstadoSolicitud.Id === 10) {
          resultado = $translate.instant("SOLICITUD_FORMALIZADA_NO_EXENTA_PAGO");
          detalles.resultado = resultado;
          defer.resolve(resultado);
        } else if (solicitud.EstadoSolicitud.Id === 11) {
          resultado = $translate.instant("SOLICITUD_NO_FORMALIZADA");
          detalles.resultado = resultado;
          defer.resolve(resultado);
        } else if (solicitud.EstadoSolicitud.Id === 12) {
          resultado = $translate.instant("SOLICITUD_OFICIALIZADA");
          detalles.resultado = resultado;
          defer.resolve(resultado);
        } else if (solicitud.EstadoSolicitud.Id === 13) {
          resultado = $translate.instant("SOLICITUD_NO_OFICIALIZADA");
          detalles.resultado = resultado;
          defer.resolve(resultado);
        } else if (solicitud.EstadoSolicitud.Id === 14) {
          resultado = $translate.instant("SOLICITUD_CUMPLIDA_PARA_ESPACIOS_ACADEMICOS");
          detalles.resultado = resultado;
          defer.resolve(resultado);
        } else if (solicitud.EstadoSolicitud.Id === 15) {
          resultado = $translate.instant("SOLICITUD_CARTA_APROBADA_PASANTIA");
          detalles.resultado = resultado;
          defer.resolve(resultado);
        } else if (solicitud.EstadoSolicitud.Id === 16) {
          resultado = $translate.instant("SOLICITUD_CARTA_RECHAZADA_PASANTIA");
          detalles.resultado = resultado;
          defer.resolve(resultado);
        } else {
          detalles.resultado = resultado;
          defer.resolve(resultado);
        }
        return promise;
      }

      /**
       * @ngdoc method
       * @name actualizarSolicitudes
       * @methodOf poluxClienteApp.controller:SolicitudesListarSolicitudesCtrl
       * @description 
       * Esta función primero verifica el rol del usuario para luego consultar las solicitudes y sus datos (detalles, estudiantes, respuesta) en el servicio de {@link services/poluxService.service:poluxRequest poluxRequest}. Si el rol es COORDINADOR_PREGRAO se consultan 
       * todas las carreras asociadas a este del servicio de {@link services/academicaService.service:academicaRequest academicaRequest} y luego consulta las solicitudes de los estudiantes que pertenececn a estas carreras.
       * Si el rol es Estudiante consulta las solicitudes asociadas al mismo en la tabla usuario_solicitud.
       * @param {String} identificador Documento del usuario que consultará las solicitudes
       * @param {Object} lista_roles Lista de los roles que tiene el usuario que consulta las solicitudes
       * @returns {undefined} No retorna nigún valor. 
       */
      ctrl.actualizarSolicitudes = function(identificador, lista_roles) {
        $scope.load = true;
        var promiseArr = [];

        ctrl.solicitudes = [];
        var parametrosSolicitudes;

        $scope.botones = [{
          clase_color: "ver",
          clase_css: "fa fa-eye fa-lg  faa-shake animated-hover",
          titulo: $translate.instant('BTN.VER_DETALLES'),
          operacion: 'ver',
          estado: true
        }, ];

        ctrl.gridOptions = {
          paginationPageSizes: [5, 10, 15, 20, 25],
          paginationPageSize: 10,
          enableFiltering: true,
          enableSorting: true,
          enableSelectAll: false,
          useExternalPagination: false,
        };

        ctrl.gridOptions.columnDefs = [{
          name: 'Id',
          displayName: $translate.instant('NUMERO_RADICADO'),
          width: '15%',
        }, {
          name: 'ModalidadTipoSolicitud',
          displayName: $translate.instant('TIPO_SOLICITUD'),
          width: '40%',
        }, {
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
          width: '15%',
          type: 'boolean',
          cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>'
        }];

        if (lista_roles.includes("ESTUDIANTE")) {
          
          parametrosSolicitudes = $.param({
            query: "usuario:" + identificador,
            limit: 0
          });
          poluxRequest.get("usuario_solicitud", parametrosSolicitudes)
            .then(function(responseSolicitudes) {
              if (Object.keys(responseSolicitudes.data[0]).length > 0) {
                ctrl.conSolicitudes = true;
              }
              if (Object.keys(responseSolicitudes.data[0]).length === 0) {
                responseSolicitudes.data = [];
              }
              var getDataSolicitud = function(solicitud) {
                var defer = $q.defer();
                var promise = defer.promise;
                promiseArr.push(promise);
                solicitud.data = {
                  'Id': solicitud.SolicitudTrabajoGrado.Id,
                  'Modalidad': solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.Modalidad.Nombre,
                  'ModalidadTipoSolicitud': solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud.Nombre,
                  'Fecha': solicitud.SolicitudTrabajoGrado.Fecha.toString().substring(0, 10),
                }
                var parametrosRespuesta = $.param({
                  query: "ACTIVO:TRUE,SolicitudTrabajoGrado:" + solicitud.SolicitudTrabajoGrado.Id,
                });
                poluxRequest.get("respuesta_solicitud", parametrosRespuesta).then(function(responseRespuesta) {
                    solicitud.data.Estado = responseRespuesta.data[0].EstadoSolicitud.Nombre;
                    solicitud.data.Respuesta = responseRespuesta.data[0];
                    //solicitud.data.Respuesta.Resultado = ctrl.mostrarResultado(responseRespuesta.data[0]);
                    ctrl.solicitudes.push(solicitud.data);
                    ctrl.gridOptions.data = ctrl.solicitudes;
                    defer.resolve(solicitud.data);
                  })
                  .catch(function(error) {
                    
                    defer.reject(error);
                  })
                return defer.promise;
              }
              angular.forEach(responseSolicitudes.data, function(solicitud) {
                promiseArr.push(getDataSolicitud(solicitud));
              });
              $q.all(promiseArr).then(function() {
                  
                  ctrl.gridOptions.data = ctrl.solicitudes;
                  $scope.load = false;
                })
                .catch(function(error) {
                  
                  ctrl.mensajeError = $translate.instant("ERROR.CARGAR_DATOS_SOLICITUDES");
                  ctrl.errorCargarParametros = true;
                  $scope.load = false;
                });

            })
            .catch(function(error) {
              
              ctrl.mensajeError = $translate.instant('ERROR.CARGAR_DATOS_ESTUDIANTES');
              ctrl.errorCargarParametros = true;
              $scope.load = false;
            });
        } else if (lista_roles.includes("COORDINADOR_PREGRADO")||lista_roles.includes("DOCENTE")) {
          $scope.botones.push({
            clase_color: "ver",
            clase_css: "fa fa-check-square-o fa-lg  faa-shake animated-hover",
            titulo: $translate.instant('BTN.RESPONDER_SOLICITUD'),
            operacion: 'responder',
            estado: true
          });

          parametrosSolicitudes = $.param({
            //query:"usuario:"+identificador+",ESTADOSOLICITUD.ID:1",
            query: "ESTADOSOLICITUD.Id.in:1|17|21,Activo:true",
            // excluye las solicitudes de tipo carta de presentacion
            exclude: "SolicitudTrabajoGrado.ModalidadTipoSolicitud.Id.in:1|70|71|72|73|74|75|76|77|83",
            limit: 0
          });
          academicaRequest.get("coordinador_carrera", [$scope.userId, "PREGRADO"]).then(function(responseCoordinador) {
              ctrl.carrerasCoordinador = [];
              var carreras = [];
              if(lista_roles.includes("DOCENTE"))
              {
                parametrosSolicitudes = $.param({
                  //query:"usuario:"+identificador+",ESTADOSOLICITUD.ID:1",
                 //query: "ESTADOSOLICITUD.ID:1,Activo:true",
                  //Para traer la solicitud inicial del proyecto a ser director
                  query: "ESTADOSOLICITUD.Id.in:1|19,Activo:true,SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud.Id.in:3|4|5|6|8|9|10|12|13|14|15,EnteResponsable:" + ctrl.userId,
                 // exclude: "SolicitudTrabajoGrado.ModalidadTipoSolicitud.Id:1",
                  limit: 0
                });
                poluxRequest.get("respuesta_solicitud", parametrosSolicitudes).then(function(responseSolicitudes) {
                  if (Object.keys(responseSolicitudes.data[0]).length > 0) {
                    ctrl.conSolicitudes = true;
                  }
                  if (Object.keys(responseSolicitudes.data[0]).length === 0) {
                    responseSolicitudes.data = [];

                    ctrl.mensajeError = $translate.instant("Señor/a director/a , no tiene solicitudes pendientes");
                    ctrl.errorCargarParametros = true;
                  }
                  var verificarSolicitud = function(solicitud) {
                    var defer = $q.defer();
                    solicitud.data = {
                      'Id': solicitud.SolicitudTrabajoGrado.Id,
                      'Modalidad': solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.Modalidad.Nombre,
                      'ModalidadTipoSolicitud': solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud.Nombre,
                      'Fecha': solicitud.SolicitudTrabajoGrado.Fecha.toString().substring(0, 10),
                    }

                    var parametrosUsuario = $.param({
                      query: "SolicitudTrabajoGrado:" + solicitud.SolicitudTrabajoGrado.Id,
                      sortby: "Usuario",
                      order: "asc",
                      limit: 1,
                    });
                    poluxRequest.get("usuario_solicitud", parametrosUsuario).then(function(usuario) {
                        ctrl.obtenerEstudiantes(solicitud, usuario).then(function(codigo_estudiante) {
                            academicaRequest.get("datos_basicos_estudiante",[codigo_estudiante]).then(function(response2) {
                                if (!angular.isUndefined(response2.data.datosEstudianteCollection.datosBasicosEstudiante)) {
                                  var carreraEstudiante = response2.data.datosEstudianteCollection.datosBasicosEstudiante[0].carrera;
                                  if(lista_roles.includes("DOCENTE"))
                                  {
                                    solicitud.data.Estado = solicitud.EstadoSolicitud.Nombre;
                                    solicitud.data.Respuesta = solicitud;
                                    // solicitud.data.Respuesta.Resultado = $translate.instant('SOLICITUD_SIN_RESPUESTA');
                                    solicitud.data.Carrera = carreraEstudiante;
                                    ctrl.solicitudes.push(solicitud.data);
                                    defer.resolve(solicitud.data);
                                    ctrl.gridOptions.data = ctrl.solicitudes;
                                  }
                                  if (carreras.includes(carreraEstudiante)) {
                                    solicitud.data.Estado = solicitud.EstadoSolicitud.Nombre;
                                    solicitud.data.Respuesta = solicitud;
                                    // solicitud.data.Respuesta.Resultado = $translate.instant('SOLICITUD_SIN_RESPUESTA');
                                    solicitud.data.Carrera = carreraEstudiante;
                                    ctrl.solicitudes.push(solicitud.data);
                                    defer.resolve(solicitud.data);
                                    ctrl.gridOptions.data = ctrl.solicitudes;
                                  }else {
                                    defer.resolve(carreraEstudiante);
                                  }
                                }
                              })
                              .catch(function(error) {
                                defer.reject(error);
                              });
                          })
                          .catch(function(error) {
                            defer.reject(error);
                          });
                      })
                      .catch(function(error) {
                        defer.reject(error);
                      });
                    return defer.promise;
                  }
                  angular.forEach(responseSolicitudes.data, function(solicitud) {
                    var parametrosDetallesSolicitud = $.param({
                      query: "SolicitudTrabajoGrado.Id:" + solicitud.SolicitudTrabajoGrado.Id,
                      limit: 0
                    });
                    poluxRequest.get("detalle_solicitud", parametrosDetallesSolicitud).then(function(responseDetalles) {
                      if (Object.keys(responseDetalles.data[0]).length === 0) {
                        ctrl.mensajeError = $translate.instant("Señor/a director/a , no hay solicitudes pendientes");
                        ctrl.errorCargarParametros = true;
                      } else {
                        var UserExiste = false;
                        if(solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud.Id==14){
                          for(var i=0;i<responseDetalles.data.length;i++){
                            if(responseDetalles.data[i].Descripcion === ctrl.userId){
                              promiseArr.push(verificarSolicitud(solicitud));
                              UserExiste = true;
                            }
                          }
                        
                        }else{
                          promiseArr.push(verificarSolicitud(solicitud));
                          UserExiste = true;
                        }
                        if(UserExiste == false){
                          ctrl.mensajeError = $translate.instant("Señor/a director/a , no tiene solicitudes pendientes");
                          ctrl.errorCargarParametros = true;
                        }
                      }
                    });
                  });
                  $q.all(promiseArr).then(function() {
                      if (ctrl.solicitudes.length != 0) {
                        ctrl.conSolicitudes = true;
                      }
                      ctrl.gridOptions.data = ctrl.solicitudes;
                      $scope.load = false;
                    })
                    .catch(function(error) {
                      
                      ctrl.mensajeError = $translate.instant("ERROR.CARGAR_DATOS_SOLICITUDES");
                      ctrl.errorCargarParametros = true;
                      $scope.load = false;
                    });
                })
                .catch(function(error) {
                  ctrl.mensajeError = $translate.instant("ERROR.CARGAR_RESPUESTA_SOLICITUD");
                  ctrl.errorCargarParametros = true;
                  $scope.load = false;
                });
              }
              else{
              if (!angular.isUndefined(responseCoordinador.data.coordinadorCollection.coordinador)) {

                ctrl.carrerasCoordinador = responseCoordinador.data.coordinadorCollection.coordinador;
                angular.forEach(responseCoordinador.data.coordinadorCollection.coordinador, function(carrera) {
                  carreras.push(carrera.codigo_proyecto_curricular);
                  //carreras.push('20')
                });

                poluxRequest.get("respuesta_solicitud", parametrosSolicitudes).then(function(responseSolicitudes) {
                  
                    if (Object.keys(responseSolicitudes.data[0]).length > 0) {
                      ctrl.conSolicitudes = true;
                    }
                    if (Object.keys(responseSolicitudes.data[0]).length === 0) {
                      responseSolicitudes.data = [];
                    }
                    var verificarSolicitud = function(solicitud) {
                      var defer = $q.defer();
                      solicitud.data = {
                        'Id': solicitud.SolicitudTrabajoGrado.Id,
                        'Modalidad': solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.Modalidad.Nombre,
                        'ModalidadTipoSolicitud': solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud.Nombre,
                        'Fecha': solicitud.SolicitudTrabajoGrado.Fecha.toString().substring(0, 10),
                      }
                      var parametrosUsuario = $.param({
                        query: "SolicitudTrabajoGrado:" + solicitud.SolicitudTrabajoGrado.Id,
                        sortby: "Usuario",
                        order: "asc",
                        limit: 1,
                      });
                      poluxRequest.get("usuario_solicitud", parametrosUsuario).then(function(usuario) { 
                       
                          ctrl.obtenerEstudiantes(solicitud, usuario).then(function(codigo_estudiante) {
                              academicaRequest.get("datos_basicos_estudiante",[codigo_estudiante]).then(function(response2) {
                                  if (!angular.isUndefined(response2.data.datosEstudianteCollection.datosBasicosEstudiante)) {
                                    var carreraEstudiante = response2.data.datosEstudianteCollection.datosBasicosEstudiante[0].carrera;
                                    if (carreras.includes(carreraEstudiante)) {
                                      solicitud.data.Estado = solicitud.EstadoSolicitud.Nombre;
                                      
                                      solicitud.data.Respuesta = solicitud;
                                      // solicitud.data.Respuesta.Resultado = $translate.instant('SOLICITUD_SIN_RESPUESTA');
                                      solicitud.data.Carrera = carreraEstudiante;
                                      ctrl.solicitudes.push(solicitud.data);
                                      defer.resolve(solicitud.data);
                                      ctrl.gridOptions.data = ctrl.solicitudes;
                                    } else {
                                      defer.resolve(carreraEstudiante);
                                    }
                                  }
                                })
                                .catch(function(error) {
                                  defer.reject(error);
                                });
                            })
                            .catch(function(error) {
                              defer.reject(error);
                            });
                        })
                        .catch(function(error) {
                          defer.reject(error);
                        });
                      return defer.promise;
                    }
                    angular.forEach(responseSolicitudes.data, function(solicitud) {
                      promiseArr.push(verificarSolicitud(solicitud));
                    });
                    $q.all(promiseArr).then(function() {
                        if (ctrl.solicitudes.length != 0) {
                          ctrl.conSolicitudes = true;
                        }
                        ctrl.gridOptions.data = ctrl.solicitudes;
                        $scope.load = false;
                      })
                      .catch(function(error) {
                        
                        ctrl.mensajeError = $translate.instant("ERROR.CARGAR_DATOS_SOLICITUDES");
                        ctrl.errorCargarParametros = true;
                        $scope.load = false;
                      });
                  })
                  .catch(function(error) {
                    
                    ctrl.mensajeError = $translate.instant("ERROR.CARGAR_RESPUESTA_SOLICITUD");
                    ctrl.errorCargarParametros = true;
                    $scope.load = false;
                  });
              } else {
                ctrl.mensajeError = $translate.instant("ERROR.SIN_CARRERAS_PREGRADO");
                ctrl.errorCargarParametros = true;
                $scope.load = false;
              }
            }
            })
            .catch(function(error) {
              
              ctrl.mensajeError = $translate.instant("ERROR.CARGAR_CARRERAS");
              ctrl.errorCargarParametros = true;
              $scope.load = false;
            });
        } else if (lista_roles.includes("EXTENSION_PASANTIAS")){
          //opcion para consultar las solicitudes para la oficina de pasantias
          $scope.botones.push({
            clase_color: "ver",
            clase_css: "fa fa-check-square-o fa-lg  faa-shake animated-hover",
            titulo: $translate.instant('BTN.RESPONDER_SOLICITUD'),
            operacion: 'responder',
            estado: true
          });

          parametrosSolicitudes = $.param({
            query: "ESTADOSOLICITUD.Id.in:20,Activo:true",
            
           // exclude: "SolicitudTrabajoGrado.ModalidadTipoSolicitud.Id:1",
            limit: 0
          });
          poluxRequest.get("respuesta_solicitud", parametrosSolicitudes).then(function(responseSolicitudes) {
            if (Object.keys(responseSolicitudes.data[0]).length > 0) {
              ctrl.conSolicitudes = true;
            }
            if (Object.keys(responseSolicitudes.data[0]).length === 0) {
              responseSolicitudes.data = [];

              ctrl.mensajeError = $translate.instant("No tiene solicitudes pendientes");
              ctrl.errorCargarParametros = true;
            }
            var verificarSolicitud = function(solicitud) {
              var defer = $q.defer();
              solicitud.data = {
                'Id': solicitud.SolicitudTrabajoGrado.Id,
                'Modalidad': solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.Modalidad.Nombre,
                'ModalidadTipoSolicitud': solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud.Nombre,
                'Fecha': solicitud.SolicitudTrabajoGrado.Fecha.toString().substring(0, 10),
              }

              var parametrosUsuario = $.param({
                query: "SolicitudTrabajoGrado:" + solicitud.SolicitudTrabajoGrado.Id,
                sortby: "Usuario",
                order: "asc",
                limit: 1,
              });
              poluxRequest.get("usuario_solicitud", parametrosUsuario).then(function(usuario) {
                  ctrl.obtenerEstudiantes(solicitud, usuario).then(function(codigo_estudiante) {
                      academicaRequest.get("datos_basicos_estudiante",[codigo_estudiante]).then(function(response2) {
                          if (!angular.isUndefined(response2.data.datosEstudianteCollection.datosBasicosEstudiante)) {
                            var carreraEstudiante = response2.data.datosEstudianteCollection.datosBasicosEstudiante[0].carrera;
                            solicitud.data.Estado = solicitud.EstadoSolicitud.Nombre;
                            solicitud.data.Respuesta = solicitud;
                            // solicitud.data.Respuesta.Resultado = $translate.instant('SOLICITUD_SIN_RESPUESTA');
                            solicitud.data.Carrera = carreraEstudiante;
                            ctrl.solicitudes.push(solicitud.data);
                            defer.resolve(solicitud.data);
                            ctrl.gridOptions.data = ctrl.solicitudes;
                          }
                        })
                        .catch(function(error) {
                          defer.reject(error);
                        });
                    })
                    .catch(function(error) {
                      defer.reject(error);
                    });
                })
                .catch(function(error) {
                  defer.reject(error);
                });
              return defer.promise;
            }
            angular.forEach(responseSolicitudes.data, function(solicitud) {
              var parametrosDetallesSolicitud = $.param({
                query: "SolicitudTrabajoGrado.Id:" + solicitud.SolicitudTrabajoGrado.Id,
                limit: 0
              });
              poluxRequest.get("detalle_solicitud", parametrosDetallesSolicitud).then(function(responseDetalles) {
                if (Object.keys(responseDetalles.data[0]).length === 0) {
                  ctrl.mensajeError = $translate.instant("No hay solicitudes pendientes");
                  ctrl.errorCargarParametros = true;
                } else {
                  var UserExiste = false;
                  if(solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud.Id==14){
                    for(var i=0;i<responseDetalles.data.length;i++){
                      if(responseDetalles.data[i].Descripcion === ctrl.userId){
                        promiseArr.push(verificarSolicitud(solicitud));
                        UserExiste = true;
                      }
                    }
                  
                  }else{
                    promiseArr.push(verificarSolicitud(solicitud));
                    UserExiste = true;
                  }
                  if(UserExiste == false){
                    ctrl.mensajeError = $translate.instant("No tiene solicitudes pendientes");
                    ctrl.errorCargarParametros = true;
                  }
                }
              });
            });
            $q.all(promiseArr).then(function() {
                if (ctrl.solicitudes.length != 0) {
                  ctrl.conSolicitudes = true;
                }
                ctrl.gridOptions.data = ctrl.solicitudes;
                $scope.load = false;
              })
              .catch(function(error) {
                
                ctrl.mensajeError = $translate.instant("ERROR.CARGAR_DATOS_SOLICITUDES");
                ctrl.errorCargarParametros = true;
                $scope.load = false;
              });
          })
          .catch(function(error) {
            ctrl.mensajeError = $translate.instant("ERROR.CARGAR_RESPUESTA_SOLICITUD");
            ctrl.errorCargarParametros = true;
            $scope.load = false;
          });
        }
      }

      ctrl.actualizarSolicitudes($scope.userId, ctrl.userRole);

      /**
       * @ngdoc method
       * @name getDocumento
       * @methodOf poluxClienteApp.controller:SolicitudesListarSolicitudesCtrl
       * @param {Number} docid Identificador del documento en {@requires services/poluxService.service:gestorDocumentalMidService gestorDocumentalMidService}
       * @returns {undefined} No retorna ningún valor
       * @description 
       * Llama a la función obtenerDoc y obtenerFetch para descargar un documento de nuxeo y msotrarlo en una nueva ventana
       */
      ctrl.getDocumento = function(docid) {
          /*nuxeoClient.getDocument(docid)
          .then(function(document) {
            $window.open(document.url);
          })
          */
        //Muestra el documento desde el gestor documental
        gestorDocumentalMidRequest.get('/document/'+docid).then(function (response) {     
      
          var varia = utils.base64ToArrayBuffer(response.data.file);   
          var file = new Blob([varia], {type: 'application/pdf'});
					var fileURL = URL.createObjectURL(file);
					$window.open(fileURL, 'resizable=yes,status=no,location=no,toolbar=no,menubar=no,fullscreen=yes,scrollbars=yes,dependent=no,width=700,height=900');
				
						 })
         
          .catch(function(error) {
            
            swal(
              $translate.instant("MENSAJE_ERROR"),
              $translate.instant("ERROR.CARGAR_DOCUMENTO"),
              'warning'
            );
          });

      }

      /**
       * @ngdoc method
       * @name filtrarSolicitudes
       * @methodOf poluxClienteApp.controller:SolicitudesListarSolicitudesCtrl
       * @description 
       * Permite filtrar las solicitudes para cada una de las carreras del coordinador
       * @param {Number} carrera_seleccionada Carrera seleccionada por el coordinador en el filtro
       * @returns {undefined} No retorna ningún valor
       */
      ctrl.filtrarSolicitudes = function(carrera_seleccionada) {
        var solicitudesTemporales = [];
        angular.forEach(ctrl.solicitudes, function(solicitud) {
          if (solicitud.Carrera === carrera_seleccionada) {
            solicitudesTemporales.push(solicitud);
          }
        });
        ctrl.gridOptions.data = solicitudesTemporales;
      }

      /**
       * @ngdoc method
       * @name obtenerEstudiantes
       * @methodOf poluxClienteApp.controller:SolicitudesListarSolicitudesCtrl
       * @description 
       * Consulta los estudiantes asociados a la solicitud
       * @param {Object} solicitud Solicitud que se quiere consultar
       * @param {Object} usuario Usuario que se consultará
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplió la petición y se resuleve con los estudiantes que pertenecen a la solicitud
       */
      ctrl.obtenerEstudiantes = function(solicitud, usuario) {
        var defer = $q.defer();
        if (solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud.Id === 11) { //sols de distincion
          var parametros = $.param({
            query: "SolicitudTrabajoGrado:" + solicitud.SolicitudTrabajoGrado.Id
          });
          poluxRequest.get("detalle_solicitud", parametros).then(function(detalles) {
              
              angular.forEach(detalles.data, function(detalle) {
                
                if (detalle.DetalleTipoSolicitud.Detalle.Id === 50) { //buscar el detalle asociado al TG
                  
                  var parametros = $.param({
                    query: "TrabajoGrado.Id:" + detalle.Descripcion
                  });
                  poluxRequest.get("estudiante_trabajo_grado", parametros).then(function(estudiantes) {
                    defer.resolve(estudiantes.data[0].Estudiante);
                  });

                }
              });
            })
            .catch(function(error) {
              defer.reject(error);
            });
        } else {
          defer.resolve(usuario.data[0].Usuario);
        }
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name cargarDetalles
       * @methodOf poluxClienteApp.controller:SolicitudesListarSolicitudesCtrl
       * @description 
       * Función que se ejecuta cuando un usario desea ver los detalles específicos de una solicitud, se consultan los documentos con los que se aprobó o rechazó la solicitud,
       * y los detalles asociados a la solicitud del servicio {@link services/poluxService.service:poluxRequest poluxRequest}
       * @param {Object} fila Fila seleccionada en el uigrid que contiene los detalles de la solicitud que se quiere consultar
       * @returns {undefined} No retorna ningún valor
       */
      ctrl.cargarDetalles = function(fila) {
        var solicitud = fila.entity.Id;
        var parametrosSolicitud = $.param({
          query: "SolicitudTrabajoGrado.Id:" + solicitud,
          limit: 0
        });

        var getDocumentoRespuesta = function(fila, solicitud) {
          var defer = $q.defer();
          if (fila.entity.Respuesta.EstadoSolicitud.Id !== 1) {
            var parametrosDocumentoSolicitud = $.param({
              query: "SolicitudTrabajoGrado.Id:" + solicitud,
              limit: 0
            });
            poluxRequest.get("documento_solicitud", parametrosDocumentoSolicitud).then(function(documento) {
                if (Object.keys(documento.data[0]).length > 0) {
                  ctrl.detallesSolicitud.documento = documento.data[0].DocumentoEscrito;
                }
                defer.resolve();
              })
              .catch(function(error) {
                defer.reject(error);
              });
          } else {
            defer.resolve();
          }
          return defer.promise;
        }

        poluxRequest.get("detalle_solicitud", parametrosSolicitud).then(function(responseDetalles) {
            poluxRequest.get("usuario_solicitud", parametrosSolicitud).then(function(responseEstudiantes) {
                if (Object.keys(responseDetalles.data[0]).length > 0) {
                  ctrl.detallesSolicitud = responseDetalles.data;
                } else {
                  ctrl.detallesSolicitud = [];
                }
                var promises = [];
                var solicitantes = "";
                
                ctrl.detallesSolicitud.id = fila.entity.Id;
                ctrl.detallesSolicitud.tipoSolicitud = fila.entity.ModalidadTipoSolicitud;
                ctrl.detallesSolicitud.fechaSolicitud = fila.entity.Fecha;
                ctrl.detallesSolicitud.estado = fila.entity.Estado;
                ctrl.detallesSolicitud.modalidad = fila.entity.Modalidad;
                ctrl.detallesSolicitud.PeriodoAcademico = fila.entity.Respuesta.SolicitudTrabajoGrado.PeriodoAcademico;
                ctrl.detallesSolicitud.respuesta = fila.entity.Respuesta.Justificacion;
                //ctrl.mostrarResultado(fila.entity.Respuesta,ctrl.detallesSolicitud).then(function(resultado){
                //ctrl.detallesSolicitud.resultado = resultado;
                //});
                promises.push(ctrl.mostrarResultado(fila.entity.Respuesta, ctrl.detallesSolicitud));
                angular.forEach(responseEstudiantes.data, function(estudiante) {
                  solicitantes += (", " + estudiante.Usuario);
                });

                var getDocente = function(detalle) {
                  var defer = $q.defer();
                  academicaRequest.get("docente_tg", [detalle.Descripcion]).then(function(docente) {
                      if (!angular.isUndefined(docente.data.docenteTg.docente)) {
                        detalle.Descripcion = docente.data.docenteTg.docente[0].nombre;
                        defer.resolve();
                      }
                    })
                    .catch(function(error) {
                      defer.reject(error);
                    });
                  return defer.promise;
                }

                var getDocentes = function(detalle) {
                  var defer = $q.defer();
                  var promesasDocentes = [];
                  var detallesTemporales = [];
                  angular.forEach(detalle.Descripcion.split(","), function(docDocente) {
                    var detalleTemp = {
                      Descripcion: docDocente,
                    }
                    detallesTemporales.push(detalleTemp);
                    promesasDocentes.push(getDocente(detalleTemp));
                  })
                  $q.all(promesasDocentes)
                    .then(function() {
                      detalle.Descripcion = detallesTemporales.map(function(detalleTemp) {
                        return detalleTemp.Descripcion
                      }).join(", ");
                      defer.resolve();
                    })
                    .catch(function(error) {
                      defer.reject(error);
                    });
                  return defer.promise;
                }

                var getExterno = function(detalle) {
                  var defer = $q.defer();
                  var parametrosVinculado = $.param({
                    query: "TrabajoGrado:" + detalle.SolicitudTrabajoGrado.TrabajoGrado.Id,
                    limit: 0
                  });
                  poluxRequest.get("detalle_pasantia", parametrosVinculado)
                    .then(function(dataExterno) {
                      if (Object.keys(dataExterno.data[0]).length > 0) {
                        var temp = dataExterno.data[0].Observaciones.split(" y dirigida por ");
                        temp = temp[1].split(" con número de identificacion ");
                        detalle.Descripcion = temp[0];
                        defer.resolve();
                      } else {
                        defer.reject("No hay datos relacionados al director externo");
                      }
                    })
                    .catch(function(error) {
                      defer.reject(error);
                    });
                  return defer.promise;
                }

                angular.forEach(ctrl.detallesSolicitud, function(detalle) {
                  if(detalle.DetalleTipoSolicitud.Detalle.CodigoAbreviacion == "CR"){
                    var parametrosConsulta = $.param({
                      query:"CodigoAbreviacion.in:A1_PLX|A2_PLX|B_PLX|C_PLX"
                    });

                    parametrosRequest.get("parametro/?", parametrosConsulta).then(function(parametros){
                      angular.forEach(parametros.data.Data, function(parametro){
                        if(detalle.Descripcion == String(parametro.Id)){
                          detalle.Descripcion = parametro.Nombre;
                        }
                      });
                    });
                  }
                  detalle.filas = [];
                  var id = detalle.DetalleTipoSolicitud.Detalle.Id;
                  if (id === 49) {
                    detalle.Descripcion = detalle.Descripcion.split("-")[1];
                  } else if (id === 9 || id === 14 || id === 15 || id === 16 || id === 17 || id === 48 || id === 37 || id === 56 || id === 57 || id === 58) {
                    if (detalle.Descripcion != "No solicita") {
                      promises.push(getDocente(detalle));
                    }
                  } else if (id == 61) {
                    promises.push(getDocentes(detalle));
                  } else if (id == 39) {
                    //detalle de director externo anterior
                    promises.push(getExterno(detalle));
                  } else if (detalle.Descripcion.includes("JSON-")) {
                    if (detalle.DetalleTipoSolicitud.Detalle.Id === 8) {
                      //areas de conocimiento
                      var datosAreas = detalle.Descripcion.split("-");
                      datosAreas.splice(0, 1);
                      detalle.Descripcion = "";
                      angular.forEach(datosAreas, function(area) {
                        
                        detalle.Descripcion = detalle.Descripcion + ", " + JSON.parse(area).Nombre;
                      });
                      detalle.Descripcion = detalle.Descripcion.substring(2);
                    } else if (detalle.DetalleTipoSolicitud.Detalle.Id === 22) {
                      //materias
                      var datosMaterias = detalle.Descripcion.split("-");
                      detalle.carrera = JSON.parse(datosMaterias[1]);
                      datosMaterias.splice(0, 2);
                      angular.forEach(datosMaterias, function(materia) {
                        detalle.filas.push(JSON.parse(materia));
                      });

                      detalle.gridOptions = [];
                      detalle.gridOptions.columnDefs = [{
                        name: 'CodigoAsignatura',
                        displayName: $translate.instant('CODIGO_MATERIA'),
                        width: '30%',
                      }, {
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
                ctrl.detallesSolicitud.solicitantes = solicitantes.substring(2) + ".";
                promises.push(getDocumentoRespuesta(fila, solicitud));
                $q.all(promises).then(function() {
                    $('#modalVerSolicitud').modal('show');
                  })
                  .catch(function(error) {
                    
                    swal(
                      $translate.instant('ERROR'),
                      $translate.instant('ERROR.CARGAR_DETALLES_SOLICITUD'),
                      'warning'
                    );
                  });
              })
              .catch(function(error) {
                
                swal(
                  $translate.instant('ERROR'),
                  $translate.instant('ERROR.CARGAR_DATOS_ESTUDIANTES'),
                  'warning'
                );
              });
          })
          .catch(function(error) {
            
            swal(
              $translate.instant('ERROR'),
              $translate.instant('ERROR.CARGAR_DETALLES_SOLICITUD'),
              'warning'
            );
          });
      }

      /**
       * @ngdoc method
       * @name loadrow
       * @methodOf poluxClienteApp.controller:SolicitudesListarSolicitudesCtrl
       * @description 
       * Ejecuta las funciones específicas de los botones seleccionados en el ui-grid
       * @param {Object} row Fila seleccionada en el uigrid que contiene los detalles de la solicitud que se quiere consultar
       * @param {String} operacion Operación que se debe ejecutar cuando se selecciona el botón
       * @returns {undefined} No retorna ningún valor
       */
      $scope.loadrow = function(row, operacion) {
        switch (operacion) {
          case "ver":
            ctrl.cargarDetalles(row)
            //$('#modalVerSolicitud').modal('show');
            break;
          case "responder":
            //$('#modalEvaluarSolicitud').modal('show');
            $location.path("solicitudes/aprobar_solicitud/" + row.entity.Id);
            break;
          default:
            break;
        }
      };
    });