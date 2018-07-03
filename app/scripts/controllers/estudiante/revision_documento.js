'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
 * @description
 * # EstudianteRevisionDocumentoCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('EstudianteRevisionDocumentoCtrl', function($scope, nuxeo, poluxRequest, token_service, $q, $http, $translate, academicaRequest) {
    var ctrl = this;

    //ctrl.estudiante = $routeParams.idEstudiante;
    token_service.token.documento = "20141020036";
    token_service.token.role.push("ESTUDIANTE");
    ctrl.codigoEstudiante = token_service.token.documento;

    ctrl.mensajeCargandoTrabajoGrado = $translate.instant("LOADING.CARGANDO_DATOS_TRABAJO_GRADO");

    $scope.mindoc = false;

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
     * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
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
     * @name consultarPeriodoAcademicoPrevio
     * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
     * @description
     * Función que obtiene el periodo académico previo dado el parámetro "P" de consulta.
     * Consulta el servicio de {@link services/academicaService.service:academicaRequest academicaRequest} para traer el periodo académico previo al actual.
     * @param {undefined} undefined No requiere parámetros
     * @returns {Promise} El periodo académico previo, o la excepción generada
     */
    ctrl.consultarPeriodoAcademicoPrevio = function() {
      var deferred = $q.defer();
      academicaRequest.get("periodo_academico", "P")
        .then(function(periodoAcademicoPrevio) {
          if (!angular.isUndefined(periodoAcademicoPrevio.data.periodoAcademicoCollection.periodoAcademico)) {
            deferred.resolve(periodoAcademicoPrevio.data.periodoAcademicoCollection.periodoAcademico[0]);
          } else {
            deferred.reject($translate.instant("ERROR.SIN_PERIODO"));
          }
        })
        .catch(function(excepcionPeriodoAcademico) {
          deferred.reject($translate.instant("ERROR.CARGANDO_PERIODO"));
        });
      return deferred.promise;
    }

    /**
     * @ngdoc method
     * @name consultarInformacionAcademicaDelEstudiante
     * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarAnteproyectoCtrl
     * @description
     * Función que según el estudiante asociado, carga la información académica correspondiente.
     * Llama a la función: consultarPeriodoAcademicoPrevio.
     * Consulta el servicio de {@link services/academicaService.service:academicaRequest academicaRequest} para traer la información académica registrada.
     * @param {Object} estudianteAsociado El estudiante al que se le cargará la información académica
     * @returns {Promise} El mensaje en caso de no corresponder la información, o la excepción generada
     */
    ctrl.consultarInformacionAcademicaDelEstudiante = function(codigoEstudiante) {
      var deferred = $q.defer();
      ctrl.consultarPeriodoAcademicoPrevio()
        .then(function(periodoAcademicoPrevio) {
          academicaRequest.get("datos_estudiante", [codigoEstudiante, periodoAcademicoPrevio.anio, periodoAcademicoPrevio.periodo])
            .then(function(estudianteConsultado) {
              if (!angular.isUndefined(estudianteConsultado.data.estudianteCollection.datosEstudiante)) {
                ctrl.informacionAcademica = estudianteConsultado.data.estudianteCollection.datosEstudiante[0];
              }
              deferred.resolve($translate.instant("ERROR.SIN_INFO_ESTUDIANTE"));
            })
            .catch(function(excepcionEstudianteConsultado) {
              deferred.reject($translate.instant("ERROR.CARGANDO_INFO_ESTUDIANTE"));
            });
        })
        .catch(function(excepcionPeriodoAcademico) {
          deferred.reject(excepcionPeriodoAcademico);
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
     * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
     * @description
     * Función que consulta el registro del trabajo de grado asociado al estudiante en sesión.
     * Llama a las funciones: obtenerParametrosEstudianteTrabajoGrado, consultarDocumentoTrabajoGrado y consultarVinculacionTrabajoGrado.
     * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los registros de trabajos de grado según el estudiante en sesión.
     * @param {undefined} undefined No requiere parámetros
     * @returns {Promise} El mensaje en caso de no corresponder la información, o la excepción generada
     */
    ctrl.consultarEstudianteTrabajoGrado = function() {
      var deferred = $q.defer();
      var conjuntoProcesamientoEstudianteTrabajoGrado = [];
      poluxRequest.get("estudiante_trabajo_grado", ctrl.obtenerParametrosEstudianteTrabajoGrado())
        .then(function(estudianteConTrabajoDeGrado) {
          if (estudianteConTrabajoDeGrado.data) {
            conjuntoProcesamientoEstudianteTrabajoGrado.push(ctrl.consultarDocumentoTrabajoGrado(estudianteConTrabajoDeGrado.data[0].TrabajoGrado));
            conjuntoProcesamientoEstudianteTrabajoGrado.push(ctrl.consultarVinculacionTrabajoGrado(estudianteConTrabajoDeGrado.data[0].TrabajoGrado));
            conjuntoProcesamientoEstudianteTrabajoGrado.push(ctrl.consultarInformacionAcademicaDelEstudiante(ctrl.codigoEstudiante));
            $q.all(conjuntoProcesamientoEstudianteTrabajoGrado)
              .then(function(resultadoDelProcesamiento) {
                if (estudianteConTrabajoDeGrado.data[0].TrabajoGrado.documentoEscrito &&
                  estudianteConTrabajoDeGrado.data[0].TrabajoGrado.documentoTrabajoGrado &&
                  estudianteConTrabajoDeGrado.data[0].TrabajoGrado.vinculaciones &&
                  ctrl.informacionAcademica) {
                  deferred.resolve(estudianteConTrabajoDeGrado.data[0].TrabajoGrado);
                } else {
                  deferred.resolve(resultadoDelProcesamiento);
                }
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

    /**
     * @ngdoc method
     * @name actualizarContenidoRevisiones
     * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
     * @description
     * Función que efectúa las consultas iniciales del módulo para cargar el contenido.
     * @param {undefined} undefined No requiere parámetros
     * @returns {undefined} No hace retorno de resultados
     */
    ctrl.actualizarContenidoRevisiones = function() {
      ctrl.cargandoTrabajoGrado = true;
      ctrl.errorCargandoTrabajoGrado = false;
      ctrl.errorRevisionesTrabajoGrado = false;
      ctrl.consultarEstudianteTrabajoGrado()
        .then(function(trabajoDeGradoConsultado) {
          if (trabajoDeGradoConsultado.documentoEscrito &&
            trabajoDeGradoConsultado.documentoTrabajoGrado &&
            trabajoDeGradoConsultado.vinculaciones &&
            ctrl.informacionAcademica) {
            ctrl.cargandoTrabajoGrado = false;
            ctrl.trabajoGrado = trabajoDeGradoConsultado;
            ctrl.consultarRevisionesTrabajoGrado()
              .then(function(respuestaRevisionesTrabajoGrado) {
                ctrl.revisionesTrabajoGrado = respuestaRevisionesTrabajoGrado;
              })
              .catch(function(excepcionRevisionesTrabajoGrado) {
                ctrl.errorRevisionesTrabajoGrado = true;
                ctrl.mensajeErrorRevisionesTrabajoGrado = excepcionRevisionesTrabajoGrado;
              });
          } else {
            ctrl.cargandoTrabajoGrado = false;
            ctrl.errorCargandoTrabajoGrado = true;
            ctrl.mensajeErrorCargandoTrabajoGrado = trabajoDeGradoConsultado[0];
          }
        })
        .catch(function(excepcionEstudianteTrabajoGrado) {
          ctrl.cargandoTrabajoGrado = false;
          ctrl.errorCargandoTrabajoGrado = true;
          ctrl.mensajeErrorCargandoTrabajoGrado = excepcionEstudianteTrabajoGrado;
        });
    }

    /**
     * @ngdoc method
     * @name obtenerParametrosRevisionTrabajoGrado
     * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
     * @description
     * Función que define los parámetros para consultar en la tabla revision_trabajo_grado.
     * @param {undefined} undefined No requiere parámetros
     * @returns {String} La sentencia para la consulta correspondiente
     */
    ctrl.obtenerParametrosRevisionTrabajoGrado = function() {
      return $.param({
        query: "DocumentoTrabajoGrado.Id:" +
          ctrl.trabajoGrado.documentoTrabajoGrado,
        limit: 0
      });
    }

    /**
     * @ngdoc method
     * @name consultarRevisionesTrabajoGrado
     * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
     * @description
     * Función que consulta el registro del trabajo de grado asociado al estudiante en sesión.
     * Llama a la función: obtenerParametrosRevisionTrabajoGrado.
     * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los registros de revisiones al trabajo de grado.
     * @param {undefined} undefined No requiere parámetros
     * @returns {Promise} El mensaje en caso de no corresponder la información, o la excepción generada
     */
    ctrl.consultarRevisionesTrabajoGrado = function() {
      var deferred = $q.defer();
      poluxRequest.get("revision_trabajo_grado", ctrl.obtenerParametrosRevisionTrabajoGrado())
        .then(function(respuestaRevisionesTrabajoGrado) {
          if (respuestaRevisionesTrabajoGrado.data) {
            deferred.resolve(respuestaRevisionesTrabajoGrado.data);
          } else {
            deferred.reject($translate.instant("ERROR.SIN_REVISIONES"));
          }
        })
        .catch(function(excepcionRevisionesTrabajoGrado) {
          deferred.reject($translate.instant("ERROR.CARGANDO_REVISIONES"));
        });
      return deferred.promise;
    }

    /**
     * @ngdoc method
     * @name subirNuevaVersionDocumento
     * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
     * @description
     * Función que consulta el registro del trabajo de grado asociado al estudiante en sesión.
     * @param {undefined} undefined No requiere parámetros
     * @returns {Promise} El mensaje en caso de no corresponder la información, o la excepción generada
     */
    ctrl.subirNuevaVersionDocumento = function() {
      $('#modalSubirNuevaVersion').modal('show');
    }

    /**
     * @ngdoc method
     * @name actualizarTrabajoGrado
     * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
     * @description
     * Función que prepara el contenido de la información para actualizar.
     * Efectúa el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para registrar la actualización del anteproyecto.
     * @param {String} respuestaCargarDocumento El enlace generado luego de subir el documento
     * @returns {Promise} La respuesta de operar el registro en la base de datos
     */
    ctrl.actualizarTrabajoGrado = function(respuestaCargarDocumento) {
      var deferred = $q.defer();
      ctrl.trabajoGrado.documentoEscrito.Enlace = respuestaCargarDocumento;
      poluxRequest
        .put("documento_escrito", ctrl.trabajoGrado.documentoEscrito.Id, ctrl.trabajoGrado.documentoEscrito)
        .then(function(respuestaActualizarAnteproyecto) {
          deferred.resolve(respuestaActualizarAnteproyecto);
        })
        .catch(function(excepcionActualizarAnteproyecto) {
          deferred.reject(excepcionActualizarAnteproyecto);
        });
      return deferred.promise;
    }

    /**
     * @ngdoc method
     * @name cargarDocumento
     * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
     * @description 
     * Permite cargar un documento a {@link services/poluxClienteApp.service:nuxeoService nuxeo}
     * @param {string} nombre Nombre del documento que se cargará
     * @param {string} descripcion Descripcion del documento que se cargará
     * @param {blob} documento Blob del documento que se cargará
     * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplió la petición y se resuleve con la url del objeto cargado.
     */
    ctrl.cargarDocumento = function(nombre, descripcion, documento) {
      var defer = $q.defer();
      var promise = defer.promise;
      nuxeo.operation('Document.Create')
        .params({
          type: 'File',
          name: nombre,
          properties: 'dc:title=' + nombre + ' \ndc:description=' + descripcion
        })
        .input('/default-domain/workspaces/Proyectos de Grado POLUX/Versiones TG')
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
              //callback(url);
              defer.resolve(url);
            })
            .catch(function(error) {
              throw error;
              defer.reject(error)
            });
        })
        .catch(function(error) {
          throw error;
          defer.reject(error)
        });
      return promise;
    }

    /**
     * @ngdoc method
     * @name subirDocumento
     * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
     * @description 
     * Maneja la operación de subir el documento luego de que el usuario selecciona y efectúa click sobre el botón dentro del modal
     * @param {undefined} undefined No requiere parámetros
     * @returns {undefined} No hace retorno de resultados
     */
    ctrl.subirDocumento = function() {
      swal({
          title: $translate.instant("CORREGIR_ANTEPROYECTO.CONFIRMACION"),
          text: $translate.instant("CORREGIR_ANTEPROYECTO.MENSAJE_CONFIRMACION"),
          type: "info",
          confirmButtonText: $translate.instant("ACEPTAR"),
          cancelButtonText: $translate.instant("CANCELAR"),
          showCancelButton: true
        })
        .then(function(confirmacionDelUsuario) {
          if (confirmacionDelUsuario.value) {
            ctrl.cargandoTrabajoGrado = true;
            ctrl.cargarDocumento(ctrl.trabajoGrado.Titulo, "Versión nueva del trabajo de grado", ctrl.nuevaVersionTrabajoGrado)
              .then(function(respuestaCargarDocumento) {
                ctrl.actualizarTrabajoGrado(respuestaCargarDocumento)
                  .then(function(respuestaActualizarTg) {
                    if (respuestaActualizarTg.statusText === "OK") {
                      ctrl.cargandoTrabajoGrado = false;
                      swal(
                        $translate.instant("CORREGIR_ANTEPROYECTO.CONFIRMACION"),
                        $translate.instant("CORREGIR_ANTEPROYECTO.ANTEPROYECTO_ACTUALIZADO"),
                        'success'
                      );
                      ctrl.actualizarContenidoRevisiones();
                      $('#modalSubirNuevaVersion').modal('hide');
                    } else {
                      ctrl.cargandoTrabajoGrado = false;
                      swal(
                        $translate.instant("CORREGIR_ANTEPROYECTO.CONFIRMACION"),
                        $translate.instant(respuestaActualizarTg.data[1]),
                        'warning'
                      );
                    }
                  })
                  .catch(function(excepcionActualizarTg) {
                    ctrl.cargandoTrabajoGrado = false;
                    swal(
                      $translate.instant("CORREGIR_ANTEPROYECTO.CONFIRMACION"),
                      $translate.instant("ERROR.MODIFICANDO_TG"),
                      'warning'
                    );
                  });
              })
              .catch(function(excepcionCargarDocumento) {
                ctrl.cargandoTrabajoGrado = false;
                swal(
                  $translate.instant("ERROR.SUBIR_DOCUMENTO"),
                  $translate.instant("VERIFICAR_DOCUMENTO"),
                  'warning'
                );
              });
          }
        });
    }

    ctrl.actualizarContenidoRevisiones();

  });
