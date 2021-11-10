'use strict';

/**
 * @ngdoc controller
 * @name poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
 * @description
 * # SolicitudesCrearSolicitudCtrl
 * Controller of the poluxClienteApp
 * Controlador que permite al estudiante crear una solicitud, en caso de que cuente con un trabajo de grado muestra los tipos de solicitudes
 * asociadas a esa modalidad (cancelación, cambio de nombre, cambio de director, entre otros), en caso contrario, muestra una lista de las solicitudes
 * iniciales de cada modalidad.
 * @requires $location
 * @requires $q
 * @requires $routeParams
 * @requires $sce
 * @requires $scope
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires $window
 * @requires services/academicaService.service:academicaRequest
 * @requires services/cidcRequest.service:cidcService
 * @requires services/poluxClienteApp.service:coreAmazonCrudService
 * @requires services/poluxMidService.service:poluxMidRequest
 * @requires services/poluxService.service:poluxRequest
 * @requires services/poluxService.service:nuxeoClient
 * @requires services/poluxClienteApp.service:sesionesService
 * @requires services/poluxClienteApp.service:tokenService
 * @property {Array} modalidades Modalidades disponibles para la elección del estudiante.
 * @property {Object} estudiante Datos del estudiante que esta realizando la solicitud.
 * @property {Object} periodoAnterior Periodo academico anterior.
 * @property {Object} periodoActual Periodo academico actual.
 * @property {Object} periodoSiguiente Periodo academico siguiente.
 * @property {Array} solicitudes Solicitudes realizadas por el estudiante anteriormente
 * @property {Array} detalles Detalles cargados para mostrar en el formulario que se asocian con la modalidad y el tipo de solicitud escogidas por el solicitante.
 * @property {Array} areas Areas del conocimiento.
 * @property {Array} espaciosElegidos Objeto que contiene los espacios elegidos por el estudiante en la solicitud inicial.
 * @property {Boolean} detallesCargados Flag que indica que los detalles terminaron de cargarse..
 * @property {Boolean} siPuede Flag que permite identificar si se puede realizar la solicitud (el estudiante cumple con los requisitos y se encuentra en las fechas para hacerlo)
 * @property {Boolean} restringirModalidadesPosgrado Flag que permite identificar si se deben restringir las demas modalidades debido a que el estudiante ya realizo una solicitud inicial de materias de posgrado.
 * @property {Array} estudiantesTg Estudiantes asociados al tranajo de grado.
 * @property {Array} estudiantes Estudiantes que se agregan a la solicitud inicial.
 * @property {Object} Trabajo Datos del trabajo de grado que cursa el estudiante que esta realizando la solicitud.
 * @property {Boolean} siModalidad Indicador que maneja la habilitación de una modalidad
 * @property {Boolean} modalidad_select Indicador que maneja la selección de una modalidad
 * @property {Boolean} solicitudConDetalles Indicador que maneja el contenido de los detalles dentro de una solicitud
 * @property {Boolean} restringirModalidadesProfundizacion Indicador que maneja la restricción de modalidades para crear solicitud y solo habilita la modalidad de profundización
 * @property {Array} detallesConDocumento Colección que maneja los detalles con documento de una solicitud
 * @property {Boolean} tieneProrrogas Indicador que maneja si existen prórrogas registradas para el estudiante que realiza la solicitud
 * @property {String} codigo Texto que carga el código del estudiante en sesión
 * @property {String} mensajeErrorCarga Texto que aparece en caso de haber un error durante la carga de información
 * @property {Object} modalidad Objeto que carga el contenido de la modalidad seleccionada
 * @property {Object} Trabajo Objeto que carga la información del estudiante con trabajo de grado registrado
 * @property {Object} carreraElegida Objeto que carga la información sobre la carrera elegida por el estudiante
 * @property {Object} trabajo_grado_completo Objeto que carga la información del trabajo de grado en curso
 * @property {Number} trabajo_grado Valor que carga el identificador del trabajo de grado
 * @property {Object} trabajoGrado Objeto que carga la información del trabajo de grado en curso
 * @property {Boolean} errorCarga Indicador que maneja la aparición de un error durante la carga de información
 * @property {String} mensajeError Texto que aparece en caso de haber un error al cargar los datos del estudiante con solicitud de trabajo de grado
 * @property {Object} periodo Objeto que carga la información del periodo académico en curso
 * @property {Object} fechaActual Objeto que carga la información de la fecha actual
 * @property {Object} fechaInicio Objeto que carga la fecha de inicio para un periodo de solicitudes
 * @property {Object} fechaFin Objeto que carga la fecha de finalización para un periodo de solicitudes
 * @property {Boolean} errorParametros Indicador que maneja la aparición de un error durante la carga de parámetros
 * @property {Object} TipoSolicitud Objeto que carga la información del tipo de solicitud seleccionada
 * @property {Number} ModalidadTipoSolicitud Valor que carga el identificador del tipo de solicitud asociada a una modalidad
 * @property {Boolean} erroresFormulario Indicador que maneja la aparición de errores durante el diligenciamiento del formulario
 * @property {Object} solicitud Contenido que va a registrarse en la base de datos sobre la solicitud
 * @property {Object} doc Objeto que carga la información sobre el documento que se obtiene
 * @property {Object} document Objeto que carga la información sobre el documento que se obtiene
 * @property {Object} blob Objeto que carga la información sobre el Blob del documento en carga
 * @property {Object} content Objeto que define las propiedades de visualización para el documento en carga
 * @property {Boolean} cargandoParametros Texto que aparece durante la carga de parámetros en la vista
 * @property {Boolean} enviandoFormulario Texto que aparece durante el envío del formulario
 * @property {Boolean} cargandoDetalles Texto que aparece durante la carga de detalles en el módulo
 * @property {Boolean} loadParametros Indicador que define el periodo de carga para los parámetros
 * @property {Object} infiniteScroll Objeto que configura las propiedades para la barra de desplazamiento en la visualización
 * @property {Boolean} loadDetalles Indicador que define el periodo de carga para los detalles de la solicitud
 * @property {Boolean} loadFormulario Indicador que define el periodo de carga para el formulario
 */
angular.module('poluxClienteApp')
  .controller('SolicitudesCrearSolicitudCtrl',
    function($location, $q, $routeParams, $sce, $scope, $translate, $window, academicaRequest, cidcRequest, coreAmazonCrudService, poluxMidRequest, poluxRequest, nuxeoClient, sesionesRequest, token_service) {
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


      //ctrl.codigo = $routeParams.idEstudiante;
      //token_service.token.documento = "20131020002";
      //ctrl.codigo = token_service.token.documento;
      ctrl.codigo = token_service.getAppPayload().appUserDocument;
      
      /**
       * @ngdoc method
       * @name getProrroga
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
       * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para saber si al trabajo de grado
       * ya se le concedió una prórroga previamente
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplió la petición y se resuelve con el objeto tieneProrrogas
       */
      ctrl.getProrroga = function() {
        var defer = $q.defer();

        var parametrosTrabajoGrado = $.param({
          query: "TrabajoGrado.EstadoTrabajoGrado.Id:1,Estudiante:" + ctrl.codigo,
          limit: 1,
        });
        //se consulta el trabajo de grado actual
        poluxRequest.get("estudiante_trabajo_grado", parametrosTrabajoGrado).then(function(responseTrabajoGrado) {
          if (Object.keys(responseTrabajoGrado.data[0]).length > 0) {
            //se consulta si el trabajo tiene solicitudes de proroga aprobadas
            var parametrosProrroga = $.param({
              query: "EstadoSolicitud:6,activo:TRUE,SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud.Id:7,SolicitudTrabajoGrado.TrabajoGrado.Id:" + responseTrabajoGrado.data[0].Id,
              limit: 1,
            });
            poluxRequest.get("respuesta_solicitud", parametrosProrroga).then(function(responseProrroga) {
              if (Object.keys(responseProrroga.data[0]).length > 0) {
                ctrl.tieneProrrogas = true;
              }
              defer.resolve(ctrl.tieneProrrogas);
            });
          } else {
            defer.resolve(ctrl.tieneProrrogas);
          }
        });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name verificarSolicitudes
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
       * Función que permite consultar las solicitudes pendientes por respuesta que tenga el estudiante
       * en el serivicio que provee {@link services/poluxService.service:poluxRequest poluxRequest}.
       * Si las solicitudes pendientes son de tipo inicial y pertenecen a la modalidad de materias de posgrado se permite que el estudiante
       * siga solicitando carreras, en cambio si la solicitud es de cualquier otro tipo se bloquea solicitar una solicitud nueva.
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplió la petición y se resuleve con el objeto solicitudesActuales
       */
      ctrl.verificarSolicitudes = function() {
        var defer = $q.defer();
        var parametrosUser = $.param({
          query: "usuario:" + ctrl.codigo,
          limit: 0,
        });
        var actuales = [];

        var requestRespuesta = function(solicitudesActuales, id) {
          var defer = $q.defer();

          var parametrosSolicitudesActuales = $.param({
            query: "EstadoSolicitud.in:1,activo:TRUE,SolicitudTrabajoGrado:" + id,
            limit: 1,
          });
          poluxRequest.get("respuesta_solicitud", parametrosSolicitudesActuales).then(function(responseSolicitudesActuales) {
              if (Object.keys(responseSolicitudesActuales.data[0]).length > 0) {
                solicitudesActuales.push(responseSolicitudesActuales.data[0]);
                defer.resolve(responseSolicitudesActuales.data);
              } else {
                defer.resolve(responseSolicitudesActuales.data);
              }
            })
            .catch(function(error) {
              ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_RESPUESTA_SOLICITUD");
              defer.reject(error);
            });
          return defer.promise;
        }

        var requestRespuestaMateriasPosgrado = function(solicitudesActuales, id) {
          var defer = $q.defer();

          var parametrosSolicitudesActuales = $.param({
            query: "EstadoSolicitud.in:1|3|4|5|7|9|10,activo:TRUE,SolicitudTrabajoGrado:" + id,
            limit: 1,
          });
          poluxRequest.get("respuesta_solicitud", parametrosSolicitudesActuales).then(function(responseSolicitudesActuales) {
              if (Object.keys(responseSolicitudesActuales.data[0]).length > 0) {
                solicitudesActuales.push(responseSolicitudesActuales.data[0]);
                defer.resolve(responseSolicitudesActuales.data);
              } else {
                defer.resolve(responseSolicitudesActuales.data);
              }
            })
            .catch(function(error) {
              ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_RESPUESTA_SOLICITUD");
              defer.reject(error);
            });
          return defer.promise;
        }

        poluxRequest.get("usuario_solicitud", parametrosUser).then(function(responseUser) {
            if (Object.keys(responseUser.data[0]).length == 0) {
              responseUser.data = [];
            }
            var solicitudesUsuario = responseUser.data;
            var promesas = [];
            //solicitud de prorogga
            promesas.push(ctrl.getProrroga());
            //otras solicitudes
            angular.forEach(solicitudesUsuario, function(solicitud) {
              if (solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.Id != 13) {
                promesas.push(requestRespuesta(actuales, solicitud.SolicitudTrabajoGrado.Id));
              } else {
                promesas.push(requestRespuestaMateriasPosgrado(actuales, solicitud.SolicitudTrabajoGrado.Id));
              }
            });
            $q.all(promesas).then(function() {
                //
                if (actuales.length == 0) {
                  //
                  defer.resolve(true);
                  //}else if(actuales.length == 1 && actuales[0].SolicitudTrabajoGrado.ModalidadTipoSolicitud.Id === 13 ){
                } else if (actuales[0].SolicitudTrabajoGrado.ModalidadTipoSolicitud.Id === 13) {
                  //
                  //
                  ctrl.restringirModalidadesPosgrado = true;
                  defer.resolve(true);
                } else if (actuales[0].SolicitudTrabajoGrado.ModalidadTipoSolicitud.Id === 16) {
                  //
                  ctrl.restringirModalidadesProfundizacion = true;
                  defer.resolve(true);
                } else {
                  //
                  defer.resolve(false);
                }
              })
              .catch(function(error) {
                defer.reject(error);
              });
          })
          .catch(function(error) {
            ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGA_SOLICITUDES");
            defer.reject(error);
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name obtenerDatosEstudiante
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
       * Permite buscar los datos del estudiante que realiza la solicitud en el servicio de {@link services/academicaService.service:academicaRequest academicaRequest}
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplió la petición y se resuleve con el objeto estudiannte
       */
      ctrl.obtenerDatosEstudiante = function() {
        var defer = $q.defer();
        academicaRequest.get("datos_estudiante", [ctrl.codigo, ctrl.periodoAnterior.anio, ctrl.periodoAnterior.periodo]).then(function(response2) {
            if (!angular.isUndefined(response2.data.estudianteCollection.datosEstudiante)) {
              ctrl.estudiante = {
                "Codigo": ctrl.codigo,
                "Nombre": response2.data.estudianteCollection.datosEstudiante[0].nombre,
                "Modalidad": ctrl.modalidad,
                "Tipo": "POSGRADO",
                "PorcentajeCursado": response2.data.estudianteCollection.datosEstudiante[0].porcentaje_cursado,
                // "PorcentajeCursado": response2.data.estudianteCollection.datosEstudiante[0].creditosCollection.datosCreditos[0].porcentaje.porcentaje_cursado[0].porcentaje_cursado,
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

      /**
       * @ngdoc method
       * @name getPeriodoAnterior
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
       * Consulta el periodo académico previo en el servicio de {@link services/academicaService.service:academicaRequest academicaRequest}.
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplió la petición y se resuleve sin retornar ningún objeto
       */
      ctrl.getPeriodoAnterior = function() {
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
            ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGANDO_PERIODO");
            defer.reject(error);
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name getPeriodoSiguiente
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
       * Consulta el periodo académico siguiente en el servicio de {@link services/academicaService.service:academicaRequest academicaRequest}.
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplió la petición y se resuleve sin retornar ningún objeto
       */
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
            ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGANDO_PERIODO");
            defer.reject(error);
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name getPeriodoActual
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
       * Consulta el periodo académico actual en el servicio de {@link services/academicaService.service:academicaRequest academicaRequest}.
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplió la petición y se resuleve sin retornar ningún objeto
       */
      ctrl.getPeriodoActual = function() {
        var defer = $q.defer()
        academicaRequest.get("periodo_academico", "A")
          .then(function(responsePeriodo) {
            if (!angular.isUndefined(responsePeriodo.data.periodoAcademicoCollection.periodoAcademico)) {
              ctrl.periodoActual = responsePeriodo.data.periodoAcademicoCollection.periodoAcademico[0];
              ctrl.periodo = ctrl.periodoActual.anio + "-" + ctrl.periodoActual.periodo;
              defer.resolve();
            } else {
              ctrl.mensajeErrorCarga = $translate.instant("ERROR.SIN_PERIODO");
              defer.reject("sin periodo");
            }
          })
          .catch(function(error) {
            ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGANDO_PERIODO");
            defer.reject(error);
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name obtenerAreas
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
       * Consulta las áreas de conocimiento del servicio de {@link services/poluxService.service:poluxRequest poluxRequest} y las 
       * áreas asociadas del snies en el servicio de {@link services/poluxClienteApp.service:coreAmazonCrudService coreAmazonCrudService}.
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplió la petición y se resuleve sin retornar ningún objeto
       */
      ctrl.obtenerAreas = function() {
        var defer = $q.defer();
        var parametrosAreas = $.param({
          query: "Activo:TRUE",
          limit: 0,
        });
        poluxRequest.get("area_conocimiento", parametrosAreas).then(function(responseAreas) {
            ctrl.areas = responseAreas.data;
            if (Object.keys(ctrl.areas[0]).length > 0) {
              var areasSnies = [
                {Id:1,estado:true,Nombre:'AGRONOMIA VETERINARIA Y AFINES'},
                {Id:2,estado:true,Nombre:'BELLAS ARTES'},
                {Id:3,estado:true,Nombre:'CIENCIAS DE LA EDUCACION'},
                {Id:4,estado:true,Nombre:'CIENCIAS DE LA SALUD'},
                {Id:5,estado:true,Nombre:'CIENCIAS SOCIALES Y HUMANAS'},
                {Id:6,estado:true,Nombre:'ECONOMIA, ADMINISTRACION, CONTADURIA Y AFINES'},
                {Id:7,estado:true,Nombre:'INGENIERIA, ARQUITECTURA, URBANISMO Y AFINES'},
                {Id:8,estado:true,Nombre:'MATEMATICAS Y CIENCIAS NATURALES'},      
                {Id:9,estado:true,Nombre:'SIN CLASIFICAR'}
                ];
            //  coreAmazonCrudService.get("snies_area").then(function(responseAreas) {
            //      var areasSnies = responseAreas.data;
                  if (Object.keys(areasSnies[0]).length > 0) {
                    angular.forEach(ctrl.areas, function(area) {
                      angular.forEach(areasSnies, function(areaSnies) {
                        if (area.SniesArea === areaSnies.Id) {
                          area.Snies = areaSnies.Nombre;
                        }
                      });
                    });
                    //
                    defer.resolve();
                  } else {
                    ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_AREAS");
                    defer.reject("no hay areas");
                  }
              /*  })
                .catch(function(error) {
                  ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_AREAS");
                  defer.reject(error);
                });
                */
            } else {
              ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_AREAS");
              defer.reject("no hay areas");
            }
          })
          .catch(function(error) {
            ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_AREAS");
            defer.reject(error);
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name cargarTipoSolicitud
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
       * Consulta los diferentes tipos de solicitudes del servicio {@link services/poluxService.service:poluxRequest poluxRequest} 
       * asociadas a la modalidad que recibe como parámetro.
       * @param {Number} modalidad Modalidad asociada al trabajo
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplió la petición y se resuelve con el objeto solicitudes
       */
      ctrl.cargarTipoSolicitud = function(modalidad) {
        var defer = $q.defer();
        ctrl.solicitudes = [];
        var parametrosTiposSolicitudes = $.param({
          query: "Modalidad:" + modalidad + ",TipoSolicitud.Activo:TRUE",
          limit: 0,
        });
        poluxRequest.get("modalidad_tipo_solicitud", parametrosTiposSolicitudes).then(function(responseTiposSolicitudes) {
            //ctrl.solicitudes = responseTiposSolicitudes.data;
            //
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


      /**
       * @ngdoc method
       * @name getTrabajoGrado
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
       * Función que consulta los datos del trabajo de grado asociado al estudiante que realiza la solicitud.
       * Consulta todos los estudiantes asociados al trabajo de grado, los docentes vinculados, los espacios inscritos.
       * Llama a la función para consultar las solicitudes anteriores y verificar si no tiene ninguna pendiente
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplió la petición y se resuelve sin ningún objeto
       */
      ctrl.getTrabajoGrado = function() {
        var defer = $q.defer();

        var getEstudiantesTg = function(idTrabajoGrado) {
          var defer = $q.defer();
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
            .catch(function(error) {
              ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_DATOS_TRABAJOS");
              defer.reject(error);
            });
          return defer.promise;
        }

        var getVinculadosTg = function(idTrabajoGrado) {
          var defer = $q.defer();
          var parametrosVinculacion = $.param({
            query: "TrabajoGrado:" + idTrabajoGrado + ",Activo:true",
            limit: 0
          });
          poluxRequest.get("vinculacion_trabajo_grado", parametrosVinculacion).then(function(responseVinculacion) {
              ctrl.Trabajo.evaluadores = [];
              if (Object.keys(responseVinculacion.data[0]).length === 0) {
                responseVinculacion.data = [];
              }
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
                if (vinculado.RolTrabajoGrado.Id == 4) {
                  ctrl.Trabajo.codirector = vinculado;
                }
              });
              //
              //
              //
              //
              defer.resolve();
            })
            .catch(function(error) {
              ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_DATOS_TRABAJOS");
              defer.reject(error);
            });
          return defer.promise;
        }

        var getEspaciosInscritos = function(idTrabajoGrado) {
          var defer = $q.defer();
          var parametrosEspacios = $.param({
            //query: "EstadoEspacioAcademicoInscrito:1,trabajo_grado:" + idTrabajoGrado,
            query: "trabajo_grado:" + idTrabajoGrado,
            limit: 0
          });
          poluxRequest.get("espacio_academico_inscrito", parametrosEspacios).then(function(responseEspacios) {
              if (Object.keys(responseEspacios.data[0]).length > 0) {
                angular.forEach(responseEspacios.data, function(espacio) {
                  ctrl.espaciosElegidos.push(espacio.EspaciosAcademicosElegibles);
                });
                //
                ctrl.carreraElegida = responseEspacios.data[0].EspaciosAcademicosElegibles.CarreraElegible.Id;
              }
              defer.resolve();
            })
            .catch(function(error) {
              ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_DATOS_TRABAJOS");
              defer.reject(error);
            });
          return defer.promise;
        }

        var getModalidades = function() {
          var defer = $q.defer();
          poluxRequest.get("modalidad")
            .then(function(responseModalidad) {
              if (Object.keys(responseModalidad.data[0]).length > 0) {
                ctrl.modalidades = [];
                if (ctrl.restringirModalidadesPosgrado) {
                  angular.forEach(responseModalidad.data, function(modalidad) {
                    if (modalidad.Id == 2) {
                      ctrl.modalidades.push(modalidad);
                    }
                  });
                } else if (ctrl.restringirModalidadesProfundizacion) {
                  angular.forEach(responseModalidad.data, function(modalidad) {
                    if (modalidad.Id == 3) {
                      ctrl.modalidades.push(modalidad);
                    }
                  });
                } else {
                  ctrl.modalidades = responseModalidad.data;
                }
                defer.resolve();
              } else {
                ctrl.mensajeErrorCarga = $translate.instant("ERROR.SIN_MODALIDADES");
                defer.reject("No hay modalidades registradas");
              }
            })
            .catch(function(error) {
              ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_TIPOS_SOLICITUD");
              defer.reject(error);
            });
          return defer.promise;
        }

        var getSolicitudesAnteriores = function() {
          var defer = $q.defer();
          //Se consultan modalidad tipo solicitud:
          //13: para modalidades de materias de posgrado, detalles con id 37 para tener la carrera solicitada
          //17: Para modalidad de materias de profundizacion, detalles con id 44 para tener las carrearas solicitadas
          var parametrosSolicitudes = $.param({
            query: "Usuario:" + ctrl.codigo + ",SolicitudTrabajoGrado.ModalidadTipoSolicitud.Id.in:13|16",
            limit: 0,
          });
          poluxRequest.get("usuario_solicitud", parametrosSolicitudes).then(function(responseSolicitudes) {
            
              if (Object.keys(responseSolicitudes.data[0]).length > 0) {
                //
                //si ha hecho una solicitud se obtienen las materias por el detalle
                var getSolicitud = function(solicitud) {
                  //
                  var defer = $q.defer();
                  var parametrosSolicitud = $.param({
                    query: "SolicitudTrabajoGrado:" + solicitud.SolicitudTrabajoGrado.Id + ",DetalleTipoSolicitud.in:37|44",
                    limit: 1,
                  });
                  poluxRequest.get("detalle_solicitud", parametrosSolicitud).then(function(responseSolicitud) {
                      //se obtiene guarda la carrera que ya eligio
                      ctrl.carrerasElegidas.push(JSON.parse(responseSolicitud.data[0].Descripcion.split("-")[1]).Codigo);
                      defer.resolve();
                    })
                    .catch(function(error) {
                      defer.reject(error);
                    });
                  return defer.promise;
                }

                var promises = [];
                ctrl.carrerasElegidas = [];
                angular.forEach(responseSolicitudes.data, function(solicitud) {
                  promises.push(getSolicitud(solicitud));
                });
                $q.all(promises).then(function() {
                    //
                    defer.resolve();
                  })
                  .catch(function(error) {
                    ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_DATOS_TRABAJOS");
                    defer.reject(error);
                  });
              } else {
                defer.resolve();
              }
            })
            .catch(function(error) {
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
            if (Object.keys(responseTrabajoEstudiante.data[0]).length > 0) {
              ctrl.Trabajo = responseTrabajoEstudiante.data[0];
              ctrl.modalidad = responseTrabajoEstudiante.data[0].TrabajoGrado.Modalidad.Id;
              ctrl.trabajo_grado_completo = responseTrabajoEstudiante.data[0].TrabajoGrado;
              ctrl.trabajo_grado = responseTrabajoEstudiante.data[0].TrabajoGrado.Id;
              ctrl.trabajoGrado = responseTrabajoEstudiante.data[0].TrabajoGrado;
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

            $q.all(promises).then(function() {
                defer.resolve();
              })
              .catch(function(error) {
                defer.reject(error);
              });
          })
          .catch(function(error) {
            ctrl.mensajeErrorCarga = $translate.instant("ERROR.CARGAR_DATOS_TRABAJOS");
            defer.reject(error);
          });
        return defer.promise;
      }

      ctrl.verificarSolicitudes().then(function(puede) {
          if (puede) {
            var promises = [];
            promises.push(ctrl.getPeriodoActual());
            promises.push(ctrl.getPeriodoAnterior());
            promises.push(ctrl.getPeriodoSiguiente());
            promises.push(ctrl.obtenerAreas());
            promises.push(ctrl.getTrabajoGrado());
            $q.all(promises).then(function() {
                ctrl.obtenerDatosEstudiante().then(function() {
                    $scope.loadParametros = false;
                  })
                  .catch(function(error) {
                    
                    ctrl.errorCarga = true;
                    $scope.loadParametros = false
                  });
              })
              .catch(function(error) {
                
                ctrl.errorCarga = true;
                $scope.loadParametros = false
              });
          } else {
            ctrl.mensajeErrorCarga = $translate.instant("ERROR.HAY_SOLICITUD_PENDIENTE");
            ctrl.errorCarga = true;
            $scope.loadParametros = false;
          }
        })
        .catch(function(error) {
          
          ctrl.errorCarga = true;
          $scope.loadParametros = false;
        });


      /**
       * @ngdoc method
       * @name verificarRequisitos
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
       * Con los datos del estudiante y el tipo de solicitud verifica por medio del servicio {@link services/poluxMidService.service:poluxMidRequest poluxMidRequest} si el estudiante cumple o no con los requisitos para realizar la solicitud,
       * en caso de que la solicitud sea de tipo inicial en la modalidad de materias de posgrado consulta en el servicio {@link services/poluxClienteApp.service:sesionesService sesionesService} si las fechas coinciden con las fechas del proceso
       * de modalidad de materias de posgrado para el periodo correspondiente.
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplió la petición y se resuelve con un valor True o False que indica si el estudiante puede o no realizar la solicitud
       */
      ctrl.verificarRequisitos = function(tipoSolicitud, modalidad) {
        var defer = $q.defer();

        var verificarRequisitosModalidad = function() {
          var defer = $q.defer();
          poluxMidRequest.post("verificarRequisitos/Registrar", ctrl.estudiante).then(function(responseModalidad) {
              if (responseModalidad.data.RequisitosModalidades) {
                
                defer.resolve(true);
              } else {
                ctrl.mensajeError = $translate.instant("ESTUDIANTE_NO_REQUISITOS");
                defer.reject('No cumple con los requisitos');
              }
            })
            .catch(function() {
              ctrl.mensajeError = $translate.instant("ERROR.VALIDAR_REQUISITOS");
              defer.reject("no se pudo cargar requisitos");
            });
          //
          return defer.promise;
        }

        var verificarFechas = function(tipoSolicitud, modalidad, periodo) {
          var defer = $q.defer();
          //si la solicitud es de materias de posgrado e inicial
          if (tipoSolicitud === 2 && (modalidad === 2 || modalidad === 3 )) {
            ctrl.periodo = ctrl.periodoSiguiente.anio + "-" + ctrl.periodoSiguiente.periodo;
            ctrl.fechaActual = moment(new Date()).format("YYYY-MM-DD HH:mm");
            var tipoSesionPadre = 0;
            if (modalidad === 2) {
              // modalidad == 'POSGRADO'
              tipoSesionPadre = 1;
            } else {
              // modalidad === 3, modalidad === 'PREGRADO'
              tipoSesionPadre = 9;
            }
            var parametrosSesiones = $.param({
              query: "SesionPadre.TipoSesion.Id:"+tipoSesionPadre+",SesionHijo.TipoSesion.Id:3,SesionPadre.periodo:"+ctrl.periodoSiguiente.anio+ ctrl.periodoSiguiente.periodo,
              limit: 1
            });
            sesionesRequest.get("relacion_sesiones", parametrosSesiones)
              .then(function(responseFechas) {
                
                if (Object.keys(responseFechas.data[0]).length > 0) {
                  //
                  var sesion = responseFechas.data[0];
                  var fechaHijoInicio = new Date(sesion.SesionHijo.FechaInicio);
                  fechaHijoInicio.setTime(fechaHijoInicio.getTime() + fechaHijoInicio.getTimezoneOffset() * 60 * 1000);
                  ctrl.fechaInicio = moment(fechaHijoInicio).format("YYYY-MM-DD HH:mm");
                  var fechaHijoFin = new Date(sesion.SesionHijo.FechaFin);
                  fechaHijoFin.setTime(fechaHijoFin.getTime() + fechaHijoFin.getTimezoneOffset() * 60 * 1000);
                  ctrl.fechaInicio = moment(fechaHijoInicio).format("YYYY-MM-DD HH:mm");
                  ctrl.fechaFin = moment(fechaHijoFin).format("YYYY-MM-DD HH:mm");
                  //
                  //
                  if (ctrl.fechaInicio <= ctrl.fechaActual && ctrl.fechaActual <= ctrl.fechaFin) {
                    defer.resolve(true);
                  } else {
                    ctrl.mensajeError = $translate.instant('ERROR.NO_EN_FECHAS_INSCRIPCION');
                    defer.reject(false);
                  }
                  

                } else {
                  ctrl.mensajeError = $translate.instant('ERROR.SIN_FECHAS_MODALIDAD');
                  defer.reject(false);
                }
              })
              .catch(function() {
                ctrl.mensajeError = $translate.instant("ERROR.CARGAR_FECHAS_MODALIDAD");
                defer.reject("no se pudo cargar fechas");
              });
          } else {
            defer.resolve(true);
          }
          return defer.promise;
        }

        var verificarTipoSolicitud = function(tipoSolicitud) {
          var defer = $q.defer();
          
          if (tipoSolicitud.TipoSolicitud.Id === 6) {
            // solicitud de socialización
            // el estado del trabajo de grado debe ser Listo para sustentar Id 17
            if (ctrl.trabajoGrado.EstadoTrabajoGrado.Id === 17) {
              defer.resolve(true);
            } else {
              ctrl.mensajeError = $translate.instant("ERROR.ESTADO_TRABAJO_GRADO_NO_PERMITE", {
                estado_tg: ctrl.trabajoGrado.EstadoTrabajoGrado.Nombre,
                tipoSolicitud: tipoSolicitud.TipoSolicitud.Nombre,
              });
              defer.reject(false);
            }
          } else if (tipoSolicitud.TipoSolicitud.Id === 13) {
            // solicitud de revisión de jurado 
            // el estado del trabajo de grado debe ser en curso Id 13 o en Modificable 16
            if (ctrl.trabajoGrado.EstadoTrabajoGrado.Id === 13 || ctrl.trabajoGrado.EstadoTrabajoGrado.Id === 16) {
              defer.resolve(true);
            } else {
              ctrl.mensajeError = $translate.instant("ERROR.ESTADO_TRABAJO_GRADO_NO_PERMITE", {
                estado_tg: ctrl.trabajoGrado.EstadoTrabajoGrado.Nombre,
                tipoSolicitud: tipoSolicitud.TipoSolicitud.Nombre,
              });
              defer.reject(false);
            }
          } else {
            defer.resolve(true);
          }
          return defer.promise;
        }
        var promesas = [];
        promesas.push(verificarRequisitosModalidad());
        promesas.push(verificarFechas(tipoSolicitud, modalidad, ctrl.periodoSiguiente));
        if (!angular.isUndefined(tipoSolicitud.TipoSolicitud)) {
          promesas.push(verificarTipoSolicitud(tipoSolicitud));
        }
        $q.all(promesas)
          .then(function() {
            //var puede = responseRequisitos[0] && responseRequisitos[1];
            defer.resolve(true)
          })
          .catch(function(error) {
            defer.reject(error);
          });

        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name docenteVinculado
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
       * Verifica si un docente se encuentra vinculado o no a un trabajo de grado, compara el documento con la lista de docentes del objeto Trabajo
       * @param {Number} docente Documento del docente que se verificará
       * @returns {boolean} Objeto de tipo promesa que indica si ya se cumplió la petición y se resuelve con un valor True o False que indica si el estudiante puede o no realizar la solicitud.
       */
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
          if (ctrl.Trabajo.codirector !== undefined) {
            if (ctrl.Trabajo.codirector.Usuario == docente) {
              return true;
            }
          }
        }
        //
        //
        //
        //
        return false;
      }

      /**
       * @ngdoc method
       * @name cargarDetalles
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
       * Llama la función verificar requisitos para validar que el estudiante cumpla los requisitos para el tipo de solicitud que seleccionó, si los cumple carga los detalles asociados a
       * la modaliad y al tipo de solicitud correspondientes.
       * Se realiza la internacionalización de los mensajes que se muestran en los labels, en caso de que el detalle tenga una lista consulta los parámetros correspondientes y se ejecutan las consultas necesarias
       * con los servicios y parámetros descritos en la descripción del detalle.
       * La descripción de los detalles contiene el valor no_service si no requiere nigún tipo de consulta, el valor estático si los valores no se consultan (valores separados por coma), nombre de algún servicio
       * separado por punto y coma con la tabla que debe consultar y con comas los parametros que este requiere, por último en valor mensaje si se queire mostrar un mensaje al usuario y contiene la variable de internacinalización a que tiene el texto a mostrar.
       * @param {Number} tipoSolicitudSeleccionada Tipo de solicitud seleccionada por el estudiante
       * @param {Number} modalidad_seleccionada Modalidad seleccionada por el estudiante
       * @returns {undefined} No retorna ningún valor
       */
      ctrl.cargarDetalles = function(tipoSolicitudSeleccionada, modalidad_seleccionada) {
        $scope.loadDetalles = true;
        ctrl.errorParametros = false;
        ctrl.siPuede = false;
        ctrl.detallesCargados = false;
        ctrl.estudiantes = [];
        ctrl.TipoSolicitud = tipoSolicitudSeleccionada;
        var tipoSolicitud = tipoSolicitudSeleccionada.Id;
        ctrl.ModalidadTipoSolicitud = tipoSolicitud;
        
        if (modalidad_seleccionada !== undefined) {
          ctrl.estudiante.Modalidad = modalidad_seleccionada;
          ctrl.modalidad = modalidad_seleccionada;
        }
        //poluxMidRequest.post("verificarRequisitos/Registrar", ctrl.estudiante).then(function(puede){
        //if(puede.data==="true"){
        ctrl.verificarRequisitos(tipoSolicitudSeleccionada, modalidad_seleccionada).then(function() {
          //if (puede) {
          ctrl.soliciudConDetalles = true;
          ctrl.detalles = [];
          var promises = []
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
            var getModalidadTipoSolicitud = function(modalidad_seleccionada) {
              var defer = $q.defer();
              var parametrosModalidadTipoSolicitud = $.param({
                query: "TipoSolicitud.Activo:TRUE,TipoSolicitud.Id:2,Modalidad.Id:" + modalidad_seleccionada,
                limit: 1,
              });
              poluxRequest.get("modalidad_tipo_solicitud", parametrosModalidadTipoSolicitud).then(function(responseModalidadTipoSolicitud) {
                  ctrl.ModalidadTipoSolicitud = responseModalidadTipoSolicitud.data[0].Id;
                  defer.resolve();
                })
                .catch(function(error) {
                  defer.reject(error);
                });
              return defer.promise;
            }
            promises.push(getModalidadTipoSolicitud(modalidad_seleccionada));
          }
          poluxRequest.get("detalle_tipo_solicitud", parametrosDetalles)
            .then(function(responseDetalles) {
              if (Object.keys(responseDetalles.data[0]).length > 0) {
                ctrl.detalles = responseDetalles.data;
                
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
                      var getOpcionesPolux = function(parametrosServicio) {
                        var defer = $q.defer()
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
                              /* //Si el parametro es activo se deja tal y como esta en la bd
                              if (parametro == "activo") {
                                parametro = parametro;
                              }*/
                              if (parametro == "id") {
                                parametro = parametro + ":" + ctrl.trabajo_grado;
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
                        poluxRequest.get(parametrosServicio[1], detalle.parametros).then(function(responseOpciones) {
                            if (detalle.Detalle.Nombre.includes("Nombre actual de la propuesta")) {
                              detalle.opciones.push({
                                "NOMBRE": responseOpciones.data[0].Titulo,
                                "bd": responseOpciones.data[0].Titulo,
                              });
                              defer.resolve();
                            } else if (detalle.Detalle.Nombre.includes("Actual resumen de la propuesta")) {
                              detalle.opciones.push({
                                "NOMBRE": responseOpciones.data[0].DocumentoEscrito.Resumen,
                                "bd": responseOpciones.data[0].DocumentoEscrito.Resumen
                              });
                              defer.resolve();
                            } else if (detalle.Detalle.Nombre.includes("Propuesta actual")) {
                              detalle.respuesta = responseOpciones.data[0].DocumentoEscrito.Enlace;
                              //
                              defer.resolve();
                            } else if (detalle.Detalle.Nombre.includes("Areas de conocimiento actuales")) {
                              //
                              var areasString = "";
                              angular.forEach(responseOpciones.data, function(area) {
                                areasString = areasString + ", " + area.AreaConocimiento.Nombre;
                              });
                              detalle.opciones.push({
                                "NOMBRE": areasString.substring(2),
                                "bd": areasString.substring(2)
                              });
                              defer.resolve();
                            } else if (detalle.Detalle.Nombre.includes("Nombre Empresa")) {
                              angular.forEach(responseOpciones.data, function(empresa) {
                                detalle.opciones.push({
                                  "NOMBRE": empresa.Identificacion + "",
                                  "bd": empresa.Identificacion + "",
                                });
                              });
                              defer.resolve();
                            } else if (detalle.Detalle.Nombre.includes("Espacio Academico Anterior")) {
                              var getEspacioAnterior = function(detalle, espacio) {
                                var defer = $q.defer();
                                academicaRequest.get("asignatura_pensum", [espacio.EspaciosAcademicosElegibles.CodigoAsignatura, espacio.EspaciosAcademicosElegibles.CarreraElegible.CodigoPensum]).then(function(asignatura) {
                                    detalle.asignatura = asignatura.data.asignatura.datosAsignatura[0];
                                    detalle.opciones.push({
                                      "NOMBRE": asignatura.data.asignatura.datosAsignatura[0].nombre + ", creditos: " + asignatura.data.asignatura.datosAsignatura[0].creditos,
                                      "bd": espacio.EspaciosAcademicosElegibles.CodigoAsignatura + '-' + asignatura.data.asignatura.datosAsignatura[0].nombre,
                                    });
                                    defer.resolve();
                                  })
                                  .catch(function(error) {
                                    defer.reject(error);
                                  });
                                return defer.promise;
                              }
                              var promisesEspacio = [];
                              angular.forEach(responseOpciones.data, function(espacio) {
                                promisesEspacio.push(getEspacioAnterior(detalle, espacio));
                              });
                              $q.all(promisesEspacio).then(function() {
                                  defer.resolve()
                                })
                                .catch(function(error) {
                                  defer.reject(error);
                                });
                            } else if (detalle.Detalle.Nombre.includes("Evaluador Actual")) {
                              var promisesDocente = []
                              var getDocente = function(evaluador, detalle) {
                                var defer = $q.defer();
                                academicaRequest.get("docente_tg", [evaluador.Usuario]).then(function(docente) {
                                    if (!angular.isUndefined(docente.data.docenteTg.docente)) {
                                      detalle.opciones.push({
                                        "NOMBRE": docente.data.docenteTg.docente[0].nombre,
                                        "bd": docente.bd = docente.data.docenteTg.docente[0].id
                                      });
                                    }
                                    defer.resolve();
                                  })
                                  .catch(function(error) {
                                    defer.reject(error);
                                  });
                                return defer.promise;
                              }
                              angular.forEach(responseOpciones.data, function(evaluador) {
                                promisesDocente.push(getDocente(evaluador, detalle));
                              });
                              $q.all(promisesDocente).then(function() {
                                  defer.resolve();
                                })
                                .catch(function(error) {
                                  defer.reject(error);
                                });
                            } else if (detalle.Detalle.Nombre.includes("Director Actual")) {
                              academicaRequest.get("docente_tg", [ctrl.Trabajo.directorInterno.Usuario]).then(function(docente) {
                                  if (!angular.isUndefined(docente.data.docenteTg.docente)) {
                                    //
                                    detalle.opciones.push({
                                      "NOMBRE": docente.data.docenteTg.docente[0].nombre,
                                      //"bd":  docente.bd = docente[0].DIR_NRO_IDEN+"-"+docente[0].NOMBRE,
                                      "bd": docente.bd = docente.data.docenteTg.docente[0].id
                                    });
                                    //
                                  }
                                  defer.resolve();
                                })
                                .catch(function(error) {
                                  defer.reject(error);
                                });
                            } else if (detalle.Detalle.Nombre.includes("Codirector Actual")) {
                              if (!angular.isUndefined(ctrl.Trabajo.codirector)) {
                                academicaRequest.get("docente_tg", [ctrl.Trabajo.codirector.Usuario]).then(function(docente) {
                                    if (!angular.isUndefined(docente.data.docenteTg.docente)) {
                                      //
                                      detalle.opciones.push({
                                        "NOMBRE": docente.data.docenteTg.docente[0].nombre,
                                        //"bd":  docente.bd = docente[0].DIR_NRO_IDEN+"-"+docente[0].NOMBRE,
                                        "bd": docente.bd = docente.data.docenteTg.docente[0].id
                                      });
                                      //
                                    }
                                    defer.resolve();
                                  })
                                  .catch(function(error) {
                                    defer.reject(error);
                                  });
                              } else {
                                defer.reject("Sin codirector");
                              }
                            } else if (detalle.Detalle.Nombre.includes("Espacio Academico Nuevo")) {
                              var promises = [];
                              var getEspacio = function(detalle, espacio) {
                                var defer = $q.defer();
                                academicaRequest.get("asignatura_pensum", [espacio.CodigoAsignatura, espacio.CarreraElegible.CodigoPensum]).then(function(asignatura) {
                                    detalle.asignatura = asignatura.data.asignatura.datosAsignatura[0];
                                    detalle.opciones.push({
                                      "NOMBRE": asignatura.data.asignatura.datosAsignatura[0].nombre + ", creditos: " + asignatura.data.asignatura.datosAsignatura[0].creditos,
                                      "bd": espacio.CodigoAsignatura + '-' + asignatura.data.asignatura.datosAsignatura[0].nombre
                                    });
                                    defer.resolve();
                                  })
                                  .catch(function(error) {
                                    defer.reject(error);
                                  });
                                return defer.promise;
                              }
                              angular.forEach(responseOpciones.data, function(espacio) {
                                var esta = false;
                                angular.forEach(ctrl.espaciosElegidos, function(asignatura) {
                                  if (espacio.CodigoAsignatura == asignatura.CodigoAsignatura) {
                                    esta = true;
                                  }
                                });
                                if (!esta) {
                                  promises.push(getEspacio(detalle, espacio));
                                }
                              });
                              $q.all(promises).then(function() {
                                  defer.resolve();
                                })
                                .catch(function(error) {
                                  defer.reject(error);
                                });
                            } else if (detalle.Detalle.Nombre.includes("Nombre del anterior director externo")) {
                              var temp = responseOpciones.data[0].Observaciones.split(" y dirigida por ");
                              temp = temp[1].split(" con número de identificacion ");
                              detalle.opciones.push({
                                "NOMBRE": temp[1] + " - " + temp[0],
                                "bd": temp[1]
                              });
                              defer.resolve();
                            } else if (detalle.Detalle.Nombre.includes("Nombre de evaluador(es) actuales")) {
                              var promisasDocente = []
                              var obtenerDocente = function(evaluador, detalle) {
                                var defer = $q.defer();
                                academicaRequest.get("docente_tg", [evaluador.Usuario]).then(function(docente) {
                                    var evaluador = {
                                      nombre: "",
                                      id: "",
                                    }
                                    if (!angular.isUndefined(docente.data.docenteTg.docente)) {
                                      evaluador.nombre = docente.data.docenteTg.docente[0].nombre;
                                      evaluador.id = docente.data.docenteTg.docente[0].id;
                                    }
                                    defer.resolve(evaluador);
                                  })
                                  .catch(function(error) {
                                    defer.reject(error);
                                  });
                                return defer.promise;
                              }
                              angular.forEach(responseOpciones.data, function(evaluador) {
                                promisasDocente.push(obtenerDocente(evaluador, detalle));
                              });
                              $q.all(promisasDocente).then(function(evaluadores) {
                                  detalle.opciones.push({
                                    "NOMBRE": evaluadores.map(function(evaluador) {
                                      return evaluador.nombre
                                    }).join(", "),
                                    "bd": evaluadores.map(function(evaluador) {
                                      return evaluador.id
                                    }).join(",")
                                  });
                                  defer.resolve();
                                })
                                .catch(function(error) {
                                  defer.reject(error);
                                });
                              //Resolve promesa
                            } else {
                              detalle.opciones = responseOpciones.data;
                              defer.resolve();
                            }
                          })
                          .catch(function(error) {
                            defer.reject(error);
                          });
                        return defer.promise;
                      }
                      promises.push(getOpcionesPolux(parametrosServicio));
                    }
                    if (parametrosServicio[0] === "academica") {
                      var getOpcionesAcademica = function(parametrosServicio) {
                        var defer = $q.defer();
                        if (parametrosServicio[1] === "docente") {
                          academicaRequest.get("docentes_tg").then(function(response) {
                              if (!angular.isUndefined(response.data.docentesTg.docente)) {
                                var docentes = response.data.docentesTg.docente;
                                var vinculados = [];
                                angular.forEach(docentes, function(docente) {
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
                                detalle.opciones = docentes;
                                defer.resolve();
                              }
                            })
                            .catch(function(error) {
                              defer.reject(error);
                            });
                        } else {
                          defer.resolve();
                        }
                        return defer.promise
                      }
                      promises.push(getOpcionesAcademica(parametrosServicio));
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
                  }
                });
                $q.all(promises).then(function() {
                    $scope.loadDetalles = false;
                    ctrl.detallesCargados = true;
                    if (ctrl.detalles == null) {
                      ctrl.soliciudConDetalles = false;
                    }
                  })
                  .catch(function(error) {
                    ctrl.mensajeError = $translate.instant("ERROR.CARGAR_OPCIONES_DETALLES_SOLICITUD");
                    if (error === "Sin codirector") {
                      ctrl.mensajeError = $translate.instant("ERROR.SIN_CODIRECTOR");
                    }
                    ctrl.errorParametros = true;
                    $scope.loadDetalles = false;
                    ctrl.detalles = [];
                    
                  });
              } else {
                ctrl.mensajeError = $translate.instant("ERROR.SIN_DETALLE_SOLICITUD");
                ctrl.errorParametros = true;
                $scope.loadDetalles = false;
                ctrl.detalles = [];
              }
            })
            .catch(function(error) {
              ctrl.mensajeError = $translate.instant("ERROR.CARGAR_DETALLES_SOLICITUD");
              ctrl.errorParametros = true;
              $scope.loadDetalles = false;
              ctrl.detalles = [];
              
            });
          //}else {
          //$scope.loadDetalles = false;
          //ctrl.siPuede=true;
          //ctrl.detalles = [];
          //}
        }).catch(function(error) {
          ctrl.errorParametros = true;
          $scope.loadDetalles = false;
          ctrl.detalles = [];
          
        });
      };

      /**
       * @ngdoc method
       * @name validarFormularioSolicitud
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
       * Valida que el formulario se haya diligenciado correctamente, con cada tipo de detalle y los campos requeridos,
       * si el detalle es de tipo lista verifica que el valor seleccionado se encuentre entre la lista de opciones del detalle, también si el tipo es una directiva
       * verifica que los valores necesarios para la directiva estén bien. Si no se encuentran errores en el formulario llama a la función cargarDocumentos.
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No retorna ningún valor
       */
      ctrl.validarFormularioSolicitud = function() {
        //

        ctrl.detallesConDocumento = [];

        angular.forEach(ctrl.detalles, function(detalle) {
          if (detalle.Detalle.TipoDetalle.Nombre === 'Numerico') {
            detalle.respuesta = detalle.respuestaNumerica + "";
          }
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
            //
            ctrl.erroresFormulario = true;
          }
          if (detalle.respuesta === "" && detalle.Detalle.TipoDetalle.Nombre !== "Directiva" && detalle.Detalle.TipoDetalle.Nombre !== "Selector") {
            swal(
              'Validación del formulario',
              "Debe completar todos los campos del formulario.",
              'warning'
            );
            //
            ctrl.erroresFormulario = true;
          }
          if (ctrl.estudiante.areas_elegidas.length === 0 && detalle.Detalle.Descripcion == 'asignar-area') {
            swal(
              'Validación del formulario',
              "Debe ingresar al menos un área de conocimiento.",
              'warning'
            );
            //
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
            //
            angular.forEach(detalle.opciones, function(opcion) {
              if (opcion.bd == detalle.respuesta) {
                contiene = true;
              }
            });
            //Si el detalle es de docente co-director se puede dejar vacio
            if (detalle.Detalle.Id == 56 && (detalle.respuesta == "" || detalle.respuesta == "No solicita")) {
              detalle.respuesta = "No solicita";
              contiene = true;
            }
            if (!contiene) {
              swal(
                'Validación del formulario',
                "Error ingrese una opcion valida.",
                'warning'
              );
              
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
              
              ctrl.erroresFormulario = true;
            }
          }
        });
        if (!ctrl.erroresFormulario) {
          //ctrl.cargarSolicitudes();
          ctrl.cargarDocumentos();
        }
      }

      /**
       * @ngdoc method
       * @name cargarDocumentos
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
       * Si los detalles de la solicitud tienen asociados documentos conecta el cliente de nuxeoClient y llama a la función cargarDocumento para cargar todos 
       * los documentos a {@link services/poluxService.service:nuxeoClient nuxeoClient}, en caso de que no los tenga o que haya terminado de cargarlos llama a la función cargarSolicitudes.
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No retorna nigún valor
       */
      ctrl.cargarDocumentos = function(callFunction) {
        if (ctrl.detallesConDocumento.length > 0) {
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
              var anHttpPromise = nuxeoClient.createDocument(detalle.Detalle.Nombre + ":" + ctrl.codigo, detalle.Detalle.Nombre + ":" + ctrl.codigo, detalle.fileModel, 'solicitudes', function(url) {
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
        } else {
          //agregar validación de error
          $scope.loadFormulario = true;
          ctrl.cargarSolicitudes();
        }
      };

      /**
       * @ngdoc method
       * @name cargarSolicitudes
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
       * Crea la data necesaria para registrar la solicitud (detalles, respuesta, usuarios y solicitud) y la envía a {@link services/poluxService.service:poluxRequest poluxRequest}
       * para registrarla.
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No retorna nigún valor
       */
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
            "PeriodoAcademico": ctrl.periodo
          };
        } else {
          data_solicitud = {
            "Fecha": fecha,
            "ModalidadTipoSolicitud": {
              "Id": ctrl.ModalidadTipoSolicitud
            },
            "PeriodoAcademico": ctrl.periodo
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

        

        poluxRequest.post("tr_solicitud", ctrl.solicitud).then(function(response) {
          
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
          var defer = $q.defer();

          nuxeo.request('/id/' + docid)
            .get()
            .then(function(response) {
              ctrl.doc = response;
              //var aux = response.get('file:content');
              ctrl.document = response;
              defer.resolve(response);
            })
            .catch(function(error) {
              defer.reject(error)
            });
          return defer.promise;
        };

        ctrl.obtenerFetch = function(doc) {
          var defer = $q.defer();

          doc.fetchBlob()
            .then(function(res) {
              defer.resolve(res.blob());

            })
            .catch(function(error) {
              defer.reject(error)
            });
          return defer.promise;
        };

        ctrl.obtenerDoc().then(function() {

          ctrl.obtenerFetch(ctrl.document).then(function(r) {
            ctrl.blob = r;
            var fileURL = URL.createObjectURL(ctrl.blob);
            //
            ctrl.content = $sce.trustAsResourceUrl(fileURL);
            $window.open(fileURL);
          });
        });

      }

    });