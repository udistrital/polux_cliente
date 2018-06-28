'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
 * @description
 * # EstudianteRevisionDocumentoCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('EstudianteRevisionDocumentoCtrl', function($scope, poluxRequest, token_service, $q, $http, $translate, academicaRequest) {
    var ctrl = this;

    //ctrl.estudiante = $routeParams.idEstudiante;
    token_service.token.documento = "20141020036";
    token_service.token.role.push("ESTUDIANTE");
    ctrl.codigoEstudiante = token_service.token.documento;

    ctrl.cargandoTrabajoGrado = true;
    ctrl.mensajeCargandoTrabajoGrado = $translate.instant("LOADING.CARGANDO_DATOS_TRABAJO_GRADO");

    $scope.mindoc = false;

    ctrl.ver_seleccion = function(item, model) {
      console.log(item);
      ctrl.tgId = item.TrabajoGrado.Id;
      ctrl.doctgId = item.DocumentoTrabajoGrado[0].Id;
      ctrl.doc = item.DocumentoTrabajoGrado[0].Id;
      ctrl.documento = true;
      ctrl.vncdocId = item.Id;
      ctrl.refrescar();
    };

    /**
     * @ngdoc method
     * @name obtenerParametrosDirectorExterno
     * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
     * @description
     * Función que define los parámetros para consultar en la tabla detalle_pasantia.
     * @param {Number} idTrabajoGrado El identificador del trabajo de grado a consultar
     * @returns {String} La sentencia para la consulta correspondiente
     */
    ctrl.obtenerParametrosDirectorExterno = function(idTrabajoGrado) {
      return $.param({
        query: "TrabajoGrado.Id:" +
          idTrabajoGrado,
        limit: 1
      });
    }

    /**
     * @ngdoc method
     * @name consultarDirectorExterno
     * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
     * @description
     * Función que recorre la base de datos de acuerdo al trabajo de grado y trae su director externo en caso de existir.
     * Llama a la función: obtenerParametrosDirectorExterno
     * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los datos de la base del aplicativo.
     * @param {Number} idTrabajoGrado El identificador del trabajo de grado a consultar
     * @returns {String} La sentencia para la consulta correspondiente
     */
    ctrl.consultarDirectorExterno = function(vinculacionTrabajoGrado) {
      var deferred = $q.defer();
      poluxRequest.get("detalle_pasantia", ctrl.obtenerParametrosDirectorExterno(vinculacionTrabajoGrado.TrabajoGrado.Id))
        .then(function(docenteExterno) {
          if (docenteExterno.data) {
            var resultadoDocenteExterno = docenteExterno.data[0].Observaciones.split(" y dirigida por ");
            resultadoDocenteExterno = resultadoDocenteExterno[1].split(" con número de identificacion ");
            vinculacionTrabajoGrado.Nombre = resultadoDocenteExterno[0];
          }
          deferred.resolve($translate.instant("ERROR.SIN_DOCENTE"));
        })
        .catch(function(excepcionDocenteExterno) {
          deferred.reject($translate.instant("ERROR.CARGANDO_DOCENTE"));
        });
      return deferred.promise;
    }

    /**
     * @ngdoc method
     * @name consultarDocenteTrabajoGrado
     * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
     * @description
     * Función que recorre la base de datos de acuerdo a la vinculación del trabajo de grado y trae los datos del docente asociado.
     * Consulta el servicio de {@link services/academicaService.service:academicaRequest academicaRequest} para traer la información académica
     * @param {Number} idTrabajoGrado El identificador del trabajo de grado a consultar
     * @returns {String} La sentencia para la consulta correspondiente
     */
    ctrl.consultarDocenteTrabajoGrado = function(vinculacionTrabajoGrado) {
      var deferred = $q.defer();
      academicaRequest.get("docente_tg", [vinculacionTrabajoGrado.Usuario])
        .then(function(docenteDirector) {
          if (!angular.isUndefined(docenteDirector.data.docenteTg.docente)) {
            vinculacionTrabajoGrado.Nombre = docenteDirector.data.docenteTg.docente[0].nombre;
          }
          deferred.resolve($translate.instant("ERROR.SIN_DOCENTE"));
        })
        .catch(function(excepcionDocenteDirector) {
          deferred.reject($translate.instant("ERROR.CARGANDO_DOCENTE"));
        })
      return deferred.promise;
    }

    /**
     * @ngdoc method
     * @name obtenerParametrosVinculacionTrabajoGrado
     * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
     * @description
     * Función que define los parámetros para consultar en la tabla vinculacion_trabajo_grado.
     * @param {Number} idTrabajoGrado El identificador del trabajo de grado a consultar
     * @returns {String} La sentencia para la consulta correspondiente
     */
    ctrl.obtenerParametrosVinculacionTrabajoGrado = function(idTrabajoGrado) {
      return $.param({
        query: "Activo:True,TrabajoGrado.Id:" +
          idTrabajoGrado,
        limit: 0
      });
    }

    /**
     * @ngdoc method
     * @name consultarVinculacionTrabajoGrado
     * @methodOf poluxClienteApp.controller:GeneralConsultarTrabajoGradoCtrl
     * @description
     * Función que recorre la base de datos de acuerdo al trabajo de grado y trae sus vinculaciones asociadas.
     * Llama a la función: obtenerParametrosVinculacionTrabajoGrado.
     * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los datos de la base del aplicativo.
     * @param {Object} trabajoGrado El trabajo de grado para cargar la información del documento
     * @returns {Promise} La información sobre el documento, el mensaje en caso de no corresponder la información, o la excepción generada
     */
    ctrl.consultarVinculacionTrabajoGrado = function(trabajoGrado) {
      var deferred = $q.defer();
      var conjuntoProcesamientoDocentes = [];
      poluxRequest.get("vinculacion_trabajo_grado", ctrl.obtenerParametrosVinculacionTrabajoGrado(trabajoGrado.Id))
        .then(function(respuestaVinculaciones) {
          if (respuestaVinculaciones.data) {
            angular.forEach(respuestaVinculaciones.data, function(vinculacionTrabajoGrado) {
              if (vinculacionTrabajoGrado.RolTrabajoGrado.Id == 2) {
                conjuntoProcesamientoDocentes.push(ctrl.consultarDirectorExterno(vinculacionTrabajoGrado));
              } else {
                conjuntoProcesamientoDocentes.push(ctrl.consultarDocenteTrabajoGrado(vinculacionTrabajoGrado));
              }
            });
            $q.all(conjuntoProcesamientoDocentes)
              .then(function(resultadoDelProcesamiento) {
                trabajoGrado.vinculaciones = respuestaVinculaciones.data.filter(vinculacion => vinculacion.Nombre);
                deferred.resolve(resultadoDelProcesamiento);
              })
              .catch(function(excepcionDelProcesamiento) {
                deferred.reject(excepcionDelProcesamiento);
              });
          }
          deferred.resolve($translate.instant("ERROR.SIN_TRABAJO_GRADO"));
        })
        .catch(function(excepcionVinculacionTrabajoGrado) {
          deferred.reject($translate.instant("ERROR.CARGANDO_TRABAJO_GRADO"));
        });
      return deferred.promise;
    }

    /**
     * @ngdoc method
     * @name obtenerParametrosDocumentoTrabajoGrado
     * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
     * @description
     * Función que define los parámetros para consultar en la tabla documento_trabajo_grado.
     * @param {Number} idTrabajoGrado El identificador del trabajo de grado a consultar
     * @returns {String} La sentencia para la consulta correspondiente
     */
    ctrl.obtenerParametrosDocumentoTrabajoGrado = function(idTrabajoGrado) {
      return $.param({
        query: "TrabajoGrado.Id:" +
          idTrabajoGrado,
        limit: 1
      });
    }

    /**
     * @ngdoc method
     * @name consultarDocumentoTrabajoGrado
     * @methodOf poluxClienteApp.controller:GeneralConsultarTrabajoGradoCtrl
     * @description
     * Función que recorre la base de datos de acuerdo al trabajo de grado vinculado y trae el documento asociado.
     * Llama a la función: obtenerParametrosDocumentoTrabajoGrado.
     * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los datos de la base del aplicativo.
     * @param {Object} trabajoGrado El trabajo de grado para cargar la información del documento
     * @returns {Promise} La información sobre el documento, el mensaje en caso de no corresponder la información, o la excepción generada
     */
    ctrl.consultarDocumentoTrabajoGrado = function(trabajoGrado) {
      var deferred = $q.defer();
      poluxRequest.get("documento_trabajo_grado", ctrl.obtenerParametrosDocumentoTrabajoGrado(trabajoGrado.Id))
        .then(function(respuestaDocumentoTrabajoGrado) {
          if (respuestaDocumentoTrabajoGrado.data) {
            trabajoGrado.documentoTrabajoGrado = respuestaDocumentoTrabajoGrado.data[0].Id;
            trabajoGrado.documentoEscrito = respuestaDocumentoTrabajoGrado.data[0].DocumentoEscrito;
          }
          deferred.resolve($translate.instant("ERROR.SIN_TRABAJO_GRADO"));
        })
        .catch(function(excepcionDocumentoTrabajoGrado) {
          deferred.reject($translate.instant("ERROR.CARGANDO_TRABAJO_GRADO"));
        });
      return deferred.promise;
    }

    /**
     * @ngdoc method
     * @name obtenerParametrosEstudianteTrabajoGrado
     * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
     * @description
     * Función que define los parámetros para consultar en la tabla estudiante_trabajo_grado.
     * El estado del trabajo de grado 13 corresponde a los trabajos de grado en curso
     * El estado del estudiante asociado al trabajo de grado 1 es el activo.
     * @param {undefined} undefined No requiere parámetros
     * @returns {String} La sentencia para la consulta correspondiente
     */
    ctrl.obtenerParametrosEstudianteTrabajoGrado = function() {
      return $.param({
        query: "TrabajoGrado.EstadoTrabajoGrado.Id:13," +
          "EstadoEstudianteTrabajoGrado.Id:1," +
          "Estudiante:" + ctrl.codigoEstudiante,
        limit: 1
      });
    }

    /**
     * @ngdoc method
     * @name consultarTrabajosDeGradoCursados
     * @methodOf poluxClienteApp.controller:MateriasPosgradoRegistrarNotaCtrl
     * @description
     * Función que consulta el registro del trabajo de grado asociado al estudiante en sesión.
     * Llama a las funciones: obtenerParametrosEstudianteTrabajoGrado, consultarInformacionAcademicaDelEstudiante y consultarEspaciosAcademicosInscritos.
     * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los registros de trabajos de grado según el estudiante en sesión.
     * @param {undefined} undefined No requiere parámetros
     * @returns {Promise} El mensaje en caso de no corresponder la información, o la excepción generada
     */
    ctrl.consultarEstudianteTrabajoGrado = function() {
      var deferred = $q.defer();
      var conjuntoProcesamientoEstudianteTrabajoGrado = [];
      poluxRequest.get("|estudiante_trabajo_grado", ctrl.obtenerParametrosEstudianteTrabajoGrado())
        .then(function(estudianteConTrabajoDeGrado) {
          if (estudianteConTrabajoDeGrado.data) {
            conjuntoProcesamientoEstudianteTrabajoGrado.push(ctrl.consultarDocumentoTrabajoGrado(estudianteConTrabajoDeGrado.data[0].TrabajoGrado));
            conjuntoProcesamientoEstudianteTrabajoGrado.push(ctrl.consultarVinculacionTrabajoGrado(estudianteConTrabajoDeGrado.data[0].TrabajoGrado));
            $q.all(conjuntoProcesamientoEstudianteTrabajoGrado)
              .then(function(resultadoDelProcesamiento) {
                deferred.resolve(estudianteConTrabajoDeGrado.data[0].TrabajoGrado);
              })
              .catch(function(excepcionDelProcesamiento) {
                deferred.reject(excepcionDelProcesamiento);
              });
          } else {
            deferred.reject($translate.instant("ERROR.SIN_ESTUDIANTE_TRABAJO_GRADO"));
          }
        })
        .catch(function(excepcionTrabajosDeGrado) {
          deferred.reject($translate.instant("ERROR.CARGANDO_ESTUDIANTE_TRABAJO_GRADO"));
        });
      return deferred.promise;
    }

    ctrl.consultarEstudianteTrabajoGrado()
      .then(function(trabajoDeGradoConsultado) {
        ctrl.cargandoTrabajoGrado = false;
        console.log("ETG", trabajoDeGradoConsultado);
        ctrl.trabajoGrado = trabajoDeGradoConsultado;
      })
      .catch(function(excepcionEstudianteTrabajoGrado) {
        ctrl.cargandoTrabajoGrado = false;
        ctrl.errorCargandoTrabajoGrado = true;
        ctrl.mensajeErrorCargandoTrabajoGrado = excepcionEstudianteTrabajoGrado;
      });

    ctrl.refrescar = function() {
      poluxRequest.get("revision_trabajo_grado", $.param({
        query: "documento_trabajo_grado:" + ctrl.doctgId + ",vinculacion_trabajo_grado:" + ctrl.vncdocId,
        sortby: "Id",
        order: "asc",
        limit: 0
      })).then(function(response) {
        ctrl.revisionesd = response.data;
        if (ctrl.revisionesd != null) {
          ctrl.numRevisiones = ctrl.revisionesd.length;
        }

      });

      poluxRequest.get("vinculacion_trabajo_grado", $.param({
        query: "Id:" + ctrl.vncdocId
      })).then(function(response) {
        console.log(ctrl.vncdocId);
        console.log(response.data[0]);
        ctrl.vinculacion_info = response.data[0];
      });
    };

    /*ctrl.solicitar_revision = function() {
      var docente = {};
      $http.get("http://10.20.0.127/polux/index.php?data=sj7574MlJOsg4LjjeAOJP5CBi1dRh84M-gX_Z-i_0OmWhton7vEvfcvwRdSGHCTl2WlcEunFl-15PLUWhzSwdnO0c9_4iv7A6ODAQz8nzk3-L-wp9KXARJdYvqggsPUb&identificacion=" + ctrl.vinculacion_info.Usuario)
        .then(function(response) {
          docente = response.data[0];
          swal({
            title: 'Solicitud de Revisión?',
            html: "Desea realizar la solicitud de revisión para <b>" + ctrl.vinculacion_info.TrabajoGrado.Titulo + "</b> al docente " + response.data[0].NOMBRE,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar'
          }).then(function() {
            var numero_revision = 0;
            if (ctrl.revisionesd == null) {
              numero_revision = 1;
            } else {
              numero_revision = ctrl.revisionesd[ctrl.numRevisiones - 1].NumeroRevision + 1;
            }
            var revision = {
              DocumentoTrabajoGrado: {
                Id: ctrl.doctgId
              },
              VinculacionTrabajoGrado: {
                Id: ctrl.vncdocId
              },
              NumeroRevision: numero_revision,
              EstadoRevisionTrabajoGrado: {
                Id: 1
              },
              FechaRecepcion: new Date()
            };

            ctrl.solicitarev = true;
            if (ctrl.revisionesd != null) {
              for (var i = 0; i < ctrl.revisionesd.length; i++) {
                if (ctrl.revisionesd[i].EstadoRevisionTrabajoGrado.Nombre === "pendiente" || ctrl.revisionesd[i].EstadoRevisionTrabajoGrado.Nombre === "borrador") {
                  ctrl.solicitarev = false;
                  break;
                }
              }
            }
            if (ctrl.solicitarev) {
              console.log(revision);
              poluxRequest.post("revision_trabajo_grado", revision).then(function(response) {
                console.log(response.data);
                swal(
                  'Revisión Solicitada',
                  'La revisión No ' + response.data.NumeroRevision + " fue solicitada exitosamente",
                  'success'
                );
                $route.reload();
              });
            } else {
              swal(
                'Revisión No Solicitada',
                'La revisión ya se encuentra solicitada',
                'warning'
              );
            }

          });
        });
    };*/

  });