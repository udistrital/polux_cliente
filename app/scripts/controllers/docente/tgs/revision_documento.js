'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:DocenteTgsRevisionDocumentoCtrl
 * @description
 * # DocenteTgsRevisionDocumentoCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('DocenteTgsRevisionDocumentoCtrl', function($scope, nuxeo, poluxRequest, token_service, $q, $http, $translate, academicaRequest) {
    var ctrl = this;

    //ctrl.docente = $routeParams.idDocente;
    token_service.token.documento = "80093200";
    token_service.token.role.push("DOCENTE");
    ctrl.documentoDocente = token_service.token.documento;

    ctrl.mensajeCargandoProyectos = $translate.instant("LOADING.CARGANDO_PROYECTOS");

    ctrl.ver_seleccion = function(item, model) {
      console.log(item);
      console.log("MODEL:", model);
      ctrl.tgId = item.TrabajoGrado.Id;
      ctrl.doctgId = item.DocumentoTrabajoGrado[0].Id;
      ctrl.doc = item.DocumentoTrabajoGrado[0].Id;
      ctrl.documento = true;
      ctrl.vncdocId = item.Id;
      ctrl.refrescar();
    };

    /**
     * @ngdoc method
     * @name consultarDocenteTrabajoGrado
     * @methodOf poluxClienteApp.controller:DocenteTgsRevisionDocumentoCtrl
     * @description
     * Función que recorre la base de datos de acuerdo a la vinculación del trabajo de grado y trae los datos del docente asociado.
     * Consulta el servicio de {@link services/academicaService.service:academicaRequest academicaRequest} para traer la información académica
     * @param {Number} idTrabajoGrado El identificador del trabajo de grado a consultar
     * @returns {String} La sentencia para la consulta correspondiente
     */
    ctrl.consultarDocenteTrabajoGrado = function() {
      var deferred = $q.defer();
      academicaRequest.get("docente_tg", [ctrl.documentoDocente])
        .then(function(docenteDirector) {
          if (!angular.isUndefined(docenteDirector.data.docenteTg.docente)) {
            deferred.resolve(docenteDirector.data.docenteTg.docente[0].nombre);
          } else {
            deferred.reject($translate.instant("ERROR.SIN_DOCENTE"));
          }
        })
        .catch(function(excepcionDocenteDirector) {
          deferred.reject($translate.instant("ERROR.CARGANDO_DOCENTE"));
        })
      return deferred.promise;
    }

    /**
     * @ngdoc method
     * @name efectuarConsultasIniciales
     * @methodOf poluxClienteApp.controller:DocenteTgsRevisionDocumentoCtrl
     * @description
     * Función que efectúa la consulta del nombre del docente en sesión, al igual que sus proyectos relacionados
     * @param {Number} idTrabajoGrado El identificador del trabajo de grado a consultar
     * @returns {String} La sentencia para la consulta correspondiente
     */
    ctrl.efectuarConsultasIniciales = function() {
      ctrl.cargandoProyectos = true;
      ctrl.errorCargandoProyectos = false;
      ctrl.consultarDocenteTrabajoGrado()
        .then(function(nombreDelDocente) {
          ctrl.nombreDelDocente = nombreDelDocente;
          ctrl.consultarVinculacionTrabajoGrado()
            .then(function(respuestaVinculaciones) {
              ctrl.cargandoProyectos = false;
              ctrl.vinculaciones = respuestaVinculaciones;
            })
            .catch(function(excepcionVinculaciones) {
              ctrl.cargandoProyectos = false;
              ctrl.errorCargandoProyectos = true;
              ctrl.mensajeErrorCargandoProyectos = excepcionVinculaciones;
            });
        })
        .catch(function(excepcionNombreDelDocente) {
          ctrl.cargandoProyectos = false;
          ctrl.errorCargandoProyectos = true;
          ctrl.mensajeErrorCargandoProyectos = excepcionNombreDelDocente;
        });
    }

    /**
     * @ngdoc method
     * @name obtenerParametrosVinculacionTrabajoGrado
     * @methodOf poluxClienteApp.controller:DocenteTgsRevisionDocumentoCtrl
     * @description
     * Función que define los parámetros para consultar en la tabla vinculacion_trabajo_grado.
     * @param {undefined} undefined No requiere parámetros
     * @returns {String} La sentencia para la consulta correspondiente
     */
    ctrl.obtenerParametrosVinculacionTrabajoGrado = function() {
      return $.param({
        query: "Activo:True,Usuario:" +
          ctrl.documentoDocente,
        limit: 0
      });
    }

    /**
     * @ngdoc method
     * @name consultarVinculacionTrabajoGrado
     * @methodOf poluxClienteApp.controller:DocenteTgsRevisionDocumentoCtrl
     * @description
     * Función que recorre la base de datos de acuerdo al trabajo de grado y trae sus vinculaciones asociadas.
     * Llama a la función: obtenerParametrosVinculacionTrabajoGrado.
     * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los datos de la base del aplicativo.
     * @param {Object} trabajoGrado El trabajo de grado para cargar la información del documento
     * @returns {Promise} La información sobre el documento, el mensaje en caso de no corresponder la información, o la excepción generada
     */
    ctrl.consultarVinculacionTrabajoGrado = function(trabajoGrado) {
      var deferred = $q.defer();
      //var conjuntoProcesamientoDocentes = [];
      poluxRequest.get("vinculacion_trabajo_grado", ctrl.obtenerParametrosVinculacionTrabajoGrado())
        .then(function(respuestaVinculaciones) {
          if (respuestaVinculaciones.data) {
            deferred.resolve(respuestaVinculaciones.data);
          } else {
            deferred.reject($translate.instant("ERROR.SIN_TRABAJO_GRADO"));
          }
        })
        .catch(function(excepcionVinculacionTrabajoGrado) {
          deferred.reject($translate.instant("ERROR.CARGANDO_TRABAJO_GRADO"));
        });
      return deferred.promise;
    }

    /**
     * @ngdoc method
     * @name consultarVinculacionTrabajoGrado
     * @methodOf poluxClienteApp.controller:DocenteTgsRevisionDocumentoCtrl
     * @description
     * Función que recorre actualiza la información que se muestra en el módulo de revisiones
     * @param {undefined} undefined No requiere parámetros
     * @returns {undefined} No hace retorno de resultados
     */
    ctrl.actualizarContenidoRevisiones = function() {
      ctrl.cargandoProyectos = true;
      ctrl.errorCargandoProyectos = false;
      ctrl.consultarVinculacionTrabajoGrado()
        .then(function(respuestaVinculaciones) {
          ctrl.cargandoProyectos = false;
          ctrl.vinculaciones = respuestaVinculaciones;
        })
        .catch(function(excepcionVinculaciones) {
          ctrl.cargandoProyectos = false;
          ctrl.errorCargandoProyectos = true;
          ctrl.mensajeErrorCargandoProyectos = excepcionVinculaciones;
        });
    }


    ctrl.seleccionarProyecto = function() {
      console.log(ctrl.proyectoSeleccionado);
      console.log(ctrl.nombreDelDocente);
    }

    poluxRequest.get("vinculacion_trabajo_grado", $.param({
      query: "Usuario:" + ctrl.documentoDocente,
      limit: -1,
      sortby: "Id",
      order: "asc"
    })).then(function(response) {
      ctrl.vinculacion_docente = response.data;
      angular.forEach(ctrl.vinculacion_docente, function(vd) {
        poluxRequest.get("documento_trabajo_grado", $.param({
          query: "TrabajoGrado:" + vd.TrabajoGrado.Id,
          limit: -1,
          sortby: "Id",
          order: "asc"
        })).then(function(response) {
          vd.DocumentoTrabajoGrado = response.data;
        });
        // $http.get("http://10.20.0.127/polux/index.php?data=sj7574MlJOsg4LjjeAOJP5CBi1dRh84M-gX_Z-i_0OmWhton7vEvfcvwRdSGHCTl2WlcEunFl-15PLUWhzSwdnO0c9_4iv7A6ODAQz8nzk3-L-wp9KXARJdYvqggsPUb&identificacion=" + vd.Usuario)
        //   .then(function(response) {
        //     vd.Docente = response.data[0];
        //   });
      });
    });
    ctrl.refrescar = function() {
      poluxRequest.get("revision_trabajo_grado", $.param({
        query: "DocumentoTrabajoGrado:" + ctrl.doctgId + ",VinculacionTrabajoGrado:" + ctrl.vncdocId,
        sortby: "Id",
        order: "asc",
        limit: 0
      })).then(function(response) {
        console.log(response);
        ctrl.revisionesd = response.data;
        if (ctrl.revisionesd != null) {
          ctrl.numRevisiones = ctrl.revisionesd.length;
        }
        poluxRequest.get("vinculacion_trabajo_grado", $.param({
          query: "Id:" + ctrl.vncdocId
        })).then(function(response) {
          console.log(ctrl.vncdocId);
          console.log(response.data[0]);
          ctrl.vinculacion_info = response.data[0];
        });
      });
    };

    ctrl.efectuarConsultasIniciales();
  });