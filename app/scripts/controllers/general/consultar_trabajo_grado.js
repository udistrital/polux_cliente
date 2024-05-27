'use strict';

/**
 * @ngdoc controller
 * @name poluxClienteApp.controller:GeneralConsultarTrabajoGradoCtrl
 * @description
 * # GeneralConsultarTrabajoGradoCtrl
 * Controller of the poluxClienteApp
 * Controlador para consultar un trabajo de grado
 * @requires $q
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires $window
 * @requires services/academicaService.service:academicaRequest
 * @requires services/poluxService.service:nuxeoClient
 * @requires services/poluxService.service:poluxRequest
 * @requires services/poluxService.service:gestorDocumentalMidService
 * @requires services/poluxClienteApp.service:tokenService
 * @requires services/parametrosService.service:parametrosRequest
 * @requires services/documentoService.service:documentoRequest
 * @property {Number} userId Documento del usuario que ingresa al módulo
 * @property {Object} userRole Listado de roles que tiene el usuairo que ingresa al módulo
 * @property {String} mensajeCargandoTrabajoGrado Mensaje que aparece durante la carga del trabajo de grado
 * @property {String} mensajeCargandoActualizarTg Mensaje que aparece durante la carga de la actualización del trabajo de grado
 * @property {Boolean} trabajoCargado Indicador que opera durante la carga del trabajo de grado
 * @property {String} mensajeError Mensaje que aparece en caso de ocurrir un error durante la carga de información
 * @property {Object} trabajoGrado Contiene toda la información del trabajo de grado
 * @property {Object} estudiante Contiene la información del estudiante
 * @property {Object} gridOptionsEspacios Grid options para los espacios academicos
 * @property {Object} gridOptionsAsignaturas Grid options para las asignatruas de trabajo de grado
 * @property {Object} gridOptionsVinculaciones Grid options para las vinculaciones del trabajo de grado
 * @property {Boolean} errorCargandoTrabajoGrado Indicador que opera sobre la aparición de un error durante la carga del trabajo de grado
 * @property {Boolean} loadTrabajoGrado Indicador que opera durante la carga del trabajo de grado
 * @property {String} codigoEstudiante Texto que carga el código del estudiante del trabajo de grado
 * @property {Boolean} esAnteproyectoModificable Indicador que define si el proyecto de grado se trata de un anteproyecto modificable
 * @property {Boolean} esPrimeraVersioj Indicador que define si el proyecto de grado se trata de una primera versión
 * @property {Boolean} esProyectoModificable Indicador que define si el proyecto de grado se trata de un proyecto modificable
 */
angular.module('poluxClienteApp')
  .controller('GeneralConsultarTrabajoGradoCtrl',
    function($q, $translate, $window, academicaRequest,utils,gestorDocumentalMidRequest, nuxeoClient, poluxRequest, token_service, parametrosRequest, documentoRequest) {
      var ctrl = this;

      //token_service.token.documento = "79647592";
      //token_service.token.role.push("COORDINADOR_PREGRADO");
      //token_service.token.documento = "20131020002";
      //token_service.token.role.push("ESTUDIANTE");
      //ctrl.userRole = token_service.token.role;
      //ctrl.userId = token_service.token.documento;

      ctrl.userRole = token_service.getAppPayload().appUserRole;
      ctrl.userId = token_service.getAppPayload().appUserDocument;

      ctrl.mensajeCargandoTrabajoGrado = $translate.instant('LOADING.CARGANDO_DATOS_TRABAJO_GRADO');
      ctrl.mensajeCargandoActualizarTg = $translate.instant('LOADING.CARGANDO_DATOS_TRABAJO_GRADO');
      ctrl.trabajoCargado = false;

      ctrl.gridOptionsAsignaturas = [];
      ctrl.gridOptionsAsignaturas.columnDefs = [{
        name: 'CodigoAsignatura',
        displayName: $translate.instant('ASIGNATURA'),
        width: '15%',
      }, {
        name: 'Anio',
        displayName: $translate.instant('ANO'),
        width: '15%',
      }, {
        name: 'Periodo',
        displayName: $translate.instant('PERIODO'),
        width: '15%',
      }, {
        name: 'Calificacion',
        displayName: $translate.instant('NOTA'),
        width: '15%',
      }, {
        name: 'EstadoAsignaturaTrabajoGrado.Nombre',
        displayName: $translate.instant('ESTADO'),
        width: '20%',
      }, {
        name: 'Aprobacion',
        displayName: $translate.instant('APROBACION'),
        width: '20%',
      }];

      ctrl.gridOptionsEspacios = [];
      ctrl.gridOptionsEspacios.columnDefs = [{
        name: 'EspaciosAcademicosElegibles.CodigoAsignatura',
        displayName: $translate.instant('CODIGO'),
        width: '20%',
      }, {
        name: 'NombreEspacio',
        displayName: $translate.instant('NOMBRE'),
        width: '40%',
      }, {
        name: 'EstadoEspacioAcademicoInscrito.Nombre',
        displayName: $translate.instant('ESTADO'),
        width: '20%',
      }, {
        name: 'Nota',
        displayName: $translate.instant('NOTA'),
        width: '20%',
      }];

      ctrl.gridOptionsVinculaciones = [];
      ctrl.gridOptionsVinculaciones.columnDefs = [{
        name: 'Nombre',
        displayName: $translate.instant('NOMBRE'),
        width: '45%',
      },{
        name: 'RolTrabajoGrado.Nombre',
        displayName: $translate.instant('ROL'),
        width: '25%',
      }, {
        name: 'notaRegistrada',
        displayName: $translate.instant('NOTA'),
        width: '30%',
      }];

      //SE CONSULTAN LOS PARAMETROS USADOS
      /**
       * @ngdoc method
       * @name getconsultarParametros
       * @methodOf poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
       * @description 
       * Consulta el servicio de {@link services/poluxService.service:parametrosRequest parametrosRequest} para extraer los datos necesarios
       * @param {undefined} undefined No requiere parámetros
       */
      async function getconsultarParametros(){
        return new Promise (async (resolve, reject) => {
          var parametrosConsulta = $.param({
            query: "TipoParametroId__CodigoAbreviacion:ROL_TRG",
            limit: 0,
          });

          await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (responseRolesTrabajoGrado){
            ctrl.RolesTrabajoGrado = responseRolesTrabajoGrado.data.Data;
          });

          parametrosConsulta = $.param({
            query: "TipoParametroId__CodigoAbreviacion:EST_ESTU_TRG",
            limit: 0,
          });

          await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (responseEstadosEstudianteTrabajoGrado){
            ctrl.EstadosEstudianteTrabajoGrado = responseEstadosEstudianteTrabajoGrado.data.Data;
          });

          parametrosConsulta = $.param({
            query: "TipoParametroId__CodigoAbreviacion:EST_TRG",
            limit: 0,
          });

          await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (responseEstadosTrabajoGrado){
            ctrl.EstadosTrabajoGrado = responseEstadosTrabajoGrado.data.Data;
          });

          parametrosConsulta = $.param({
            query: "TipoParametroId__CodigoAbreviacion:MOD_TRG",
            limit: 0,
          });

          await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (responseModalidades){
            ctrl.Modalidades = responseModalidades.data.Data;
          });

          parametrosConsulta = $.param({
            query: "DominioTipoDocumento__CodigoAbreviacion:DOC_PLX",
            limit: 0,
          });

          await documentoRequest.get("tipo_documento", parametrosConsulta).then(function (responseTiposDocumento){
            ctrl.TiposDocumento = responseTiposDocumento.data;
          });

          parametrosConsulta = $.param({
            query: "TipoParametroId__CodigoAbreviacion:EST_ASIG_TRG",
            limit: 0,
          });

          await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (responseEstadosAsignaturaGrado){
            ctrl.EstadosAsignaturaGrado = responseEstadosAsignaturaGrado.data.Data;
          });

          parametrosConsulta = $.param({
            query: "TipoParametroId__CodigoAbreviacion:AC",
            limit: 0,
          });

          await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (responseAreasConocimiento){
            ctrl.AreasConocimiento = responseAreasConocimiento.data.Data;
          });

          resolve();
        });
      }

      /**
       * @ngdoc method
       * @name cargarEstudiante
       * @methodOf poluxClienteApp.controller:GeneralConsultarTrabajoGradoCtrl
       * @description 
       * Consulta los datos basicos de un estudiante desde {@link services/academicaService.service:academicaRequest academicaRequest}.
       * @param {Object} estudiante Estudiante que se va a consultar
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplió la petición o la excepción generada
       */
      ctrl.cargarEstudiante = function(estudiante) {
        var defer = $q.defer();
        //consultar datos básicos del estudiante
        academicaRequest.get("datos_basicos_estudiante", [estudiante.Estudiante])
          .then(function(responseDatosBasicos) {
            if (!angular.isUndefined(responseDatosBasicos.data.datosEstudianteCollection.datosBasicosEstudiante)) {
              estudiante.datos = responseDatosBasicos.data.datosEstudianteCollection.datosBasicosEstudiante[0];
              ctrl.datos_basicos_estudiante = responseDatosBasicos.data.datosEstudianteCollection.datosBasicosEstudiante[0];
              //consultar nombre carrera
              academicaRequest.get("carrera", [estudiante.datos.carrera])
                .then(function(responseCarrera) {
                  estudiante.datos.proyecto = estudiante.datos.carrera + " - " + responseCarrera.data.carrerasCollection.carrera[0].nombre;
                  defer.resolve();
                })
                .catch(function(error) {
                  ctrl.mensajeError = $translate.instant('ERROR.CARGAR_CARRERA_ESTUDIANTE');
                  defer.reject(error);
                });
            } else {
              ctrl.mensajeError = $translate.instant('ERROR.ESTUDIANTE_NO_ENCONTRADO');
              defer.reject(error);
            }
          })
          .catch(function(error) {
            ctrl.mensajeError = $translate.instant('ERROR.CARGAR_DATOS_ESTUDIANTE');
            defer.reject(error);
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name cargarAsignaturasTrabajoGrado
       * @methodOf poluxClienteApp.controller:GeneralConsultarTrabajoGradoCtrl
       * @description
       * Consulta las asingaturas 'Trabajo de grado 1' y 'Trabajo de grado 2' de un trabajo de grado usando el servicio de {@link services/poluxService.service:poluxRequest poluxRequest}.
       * @param {undefined} undefined no requiere parametros
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplió la petición o la excepción generada
       */
      ctrl.cargarAsignaturasTrabajoGrado = function() {
        var defer = $q.defer();
        var parametrosAsignaturasTrabajoGrado = $.param({
          query: "TrabajoGrado:" + ctrl.trabajoGrado.Id,
          limit: 2,
        });
        poluxRequest.get("asignatura_trabajo_grado", parametrosAsignaturasTrabajoGrado)
          .then(function(responseAsignaturaTrabajoGrado) {
            if (Object.keys(responseAsignaturaTrabajoGrado.data[0]).length > 0) {
              ctrl.trabajoGrado.asignaturas = responseAsignaturaTrabajoGrado.data;
              defer.resolve();
            } else {
              ctrl.mensajeError = $translate.instant("ERROR.SIN_ASIGNATURAS_TRABAJO_GRADO");
              defer.reject(error);
            }
          })
          .catch(function(error) {
            ctrl.mensajeError = $translate.instant("ERROR.CARGANDO_ASIGNATURAS_TRABAJO_GRADO");
            defer.reject(error);
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name cargarAreasConocimiento
       * @methodOf poluxClienteApp.controller:GeneralConsultarTrabajoGradoCtrl
       * @description
       * Consulta las asingaturas áreas de conocimiento de un trabajo de grado usando el servicio de {@link services/poluxService.service:poluxRequest poluxRequest}.
       * @param {undefined} undefined no requiere parametros
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplio la petición o la excepción generada
       */
      ctrl.cargarAreasConocimiento = function() {
        ctrl.trabajoGrado.areas = "";
        var defer = $q.defer();
        var parametrosAreasConocimiento = $.param({
          query: "TrabajoGrado:" + ctrl.trabajoGrado.Id,
          limit: 0,
        });
        poluxRequest.get("areas_trabajo_grado", parametrosAreasConocimiento).then(function(responseAreasConocimiento) {
            if (Object.keys(responseAreasConocimiento.data).length > 0) {
              angular.forEach(responseAreasConocimiento.data, function(area){
                let AreaConocimientoTemp = ctrl.AreasConocimiento.find(data => {
                  return data.Id == area.AreaConocimiento;
                });
                ctrl.trabajoGrado.areas = ctrl.trabajoGrado.areas + " - " + AreaConocimientoTemp.Nombre;
              });
              ctrl.trabajoGrado.areas = ctrl.trabajoGrado.areas.substring(1);
              defer.resolve();
            } else {
              ctrl.mensajeError = $translate.instant("SIN_AREAS");
              defer.reject(error);
            }
          })
          .catch(function(error) {
            ctrl.mensajeError = $translate.instant("ERROR.CARGAR_AREAS");
            defer.reject(error);
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name cargarActaSocializacion
       * @methodOf poluxClienteApp.controller:GeneralConsultarTrabajoGradoCtrl
       * @description 
       * Consulta el acta de socialización de un trabajo de grado el servicio de {@link services/poluxService.service:poluxRequest poluxRequest}.
       * @param {undefined} undefined no requiere parametros
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplio la petición y se resuleve sin retornar ningún objeto
       */
      ctrl.cargarActaSocializacion = function() {
        var defer = $q.defer();
        //Se consulta el tipo de documento 6 que es acta de socialización
        let TipoDocumentoTemp = ctrl.TiposDocumento.find(data => {
          return data.CodigoAbreviacion == "ACT_PLX"
        });

        var parametrosActaSocializacion = $.param({
          query: "DocumentoEscrito.TipoDocumentoEscrito:" + TipoDocumentoTemp.Id + ",TrabajoGrado:" + ctrl.trabajoGrado.Id,
          limit: 1,
        });
        poluxRequest.get("documento_trabajo_grado", parametrosActaSocializacion)
          .then(function(responseActaSocializacion) {
            if (Object.keys(responseActaSocializacion.data[0]).length > 0) {
              ctrl.trabajoGrado.actaSocializacion = responseActaSocializacion.data[0];
            }
            defer.resolve();
          })
          .catch(function(error) {
            ctrl.mensajeError = $translate.instant("ERROR.CARGAR_ACTA_SOCIALIZACION");
            defer.reject(error);
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name cargarCertificadoARL
       * @methodOf poluxClienteApp.controller:GeneralConsultarTrabajoGradoCtrl
       * @description 
       * Consulta el certificado de afiliación de ARL de un trabajo de grado de la modalidad de pasantia del servicio de {@link services/poluxService.service:poluxRequest poluxRequest}.
       * @param {undefined} undefined no requiere parametros
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplio la petición y se resuleve sin retornar ningún objeto
       */
      ctrl.cargarCertificadoARL = function() {
        var defer = $q.defer();

        let TipoDocumentoTemp = ctrl.TiposDocumento.find(data => {
          return data.CodigoAbreviacion == "DPAS_PLX"
        });
        //Se consulta el tipo de documento 6 que es acta de socialización
        var parametrosActaSocializacion = $.param({
          query: "DocumentoEscrito.TipoDocumentoEscrito:" + TipoDocumentoTemp.Id + ",TrabajoGrado:" + ctrl.trabajoGrado.Id,
          limit: 1,
        });
        poluxRequest.get("documento_trabajo_grado", parametrosActaSocializacion)
          .then(function(responseCertificadoARL) {
            if (Object.keys(responseCertificadoARL.data[0]).length > 0) {
              ctrl.trabajoGrado.certificadoARL = responseCertificadoARL.data[0];
            }
            defer.resolve();
          })
          .catch(function(error) {
            ctrl.mensajeError = $translate.instant("ERROR.CARGAR_CERTIFICADO_ARL");
            defer.reject(error);
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name getEspaciosAcademicosInscritos
       * @methodOf poluxClienteApp.controller:GeneralConsultarTrabajoGradoCtrl
       * @description 
       * Consulta los espacios academicos inscritos en modalidad de materias de posgrado del servicio de {@link services/poluxService.service:poluxRequest poluxRequest},
       * Consulta el nombre desde el servicio de {@link services/academicaService.service:academicaRequest academicaRequest}.
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplio la petición o la excepción generada
       */
      ctrl.getEspaciosAcademicosInscritos = function() {
        var defer = $q.defer();
        var parametrosEspaciosAcademicosInscritos = $.param({
          query: "TrabajoGrado:" + ctrl.trabajoGrado.Id,
          limit: 0,
        });

        var getDataEspacio = function(espacio) {
          var defer = $q.defer();
          academicaRequest.get("asignatura_pensum", [espacio.EspaciosAcademicosElegibles.CodigoAsignatura, espacio.EspaciosAcademicosElegibles.CarreraElegible.CodigoPensum])
            .then(function(responseEspacio) {
              if (responseEspacio.data.asignatura.datosAsignatura) {
                espacio.NombreEspacio = responseEspacio.data.asignatura.datosAsignatura[0].nombre;
                defer.resolve();
              } else {
                // Se rechaza la petición en caso de no encontrar datos
                defer.reject("No se encuentran datos de la materia");
              }
            }).catch(function(error) {
              defer.reject(error);
            });
          return defer.promise;
        }

        poluxRequest.get("espacio_academico_inscrito", parametrosEspaciosAcademicosInscritos)
          .then(function(responseEspacios) {
            if (Object.keys(responseEspacios.data[0]).length > 0) {
              ctrl.trabajoGrado.espacios = responseEspacios.data;
              var promises = [];
              //Consultar nombres de los espacios
              angular.forEach(ctrl.trabajoGrado.espacios, function(espacio) {
                promises.push(getDataEspacio(espacio));
              });
              $q.all(promises)
                .then(function() {
                  defer.resolve();
                })
                .catch(function(error) {
                  ctrl.mensajeError = $translate.instant("ERROR.CARGAR_DATOS_ASIGNATURAS");
                  defer.reject(error);
                });
            } else {
              ctrl.mensajeError = $translate.instant("ERROR.SIN_ESPACIOS_ACADEMICOS_INSCRITOS");
              defer.reject("sin espacios académicos inscritos");
            }
          })
          .catch(function(error) {
            ctrl.mensajeError = $translate.instant("ERROR.CARGANDO_ESPACIOS_ACADEMICOS_INSCRITOS");
            defer.reject(error);
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name getDetallePasantia
       * @methodOf poluxClienteApp.controller:GeneralConsultarTrabajoGradoCtrl
       * @param {undefined} undefined No recibe ningún parámetro
       * @returns {Promise} Objeto de tipo promesa que indica cuando se cumple la petición o la excepción generada
       * @description 
       * Consulta desde {@link services/poluxService.service:poluxRequest poluxRequest} los detalles de la pasantía.
       */
      ctrl.getDetallePasantia = function() {
        var defer = $q.defer();
        var parametrosPasantia = $.param({
          query: "TrabajoGrado:" + ctrl.trabajoGrado.Id,
          limit: 1
        });
        poluxRequest.get("detalle_pasantia", parametrosPasantia)
          .then(function(responsePasantia) {
            if (Object.keys(responsePasantia.data[0]).length > 0) {
              ctrl.trabajoGrado.DetallePasantia = responsePasantia.data[0].Observaciones;
              defer.resolve();
            } else {
              ctrl.mensajeError = $translate.instant("PASANTIA.ERROR.SIN_DETALLES");
              defer.reject("No hay detalle de la pasantia");
            }
          })
          .catch(function(error) {
            ctrl.mensajeError = $translate.instant("PASANTIA.ERROR.CARGANDO_DETALLES");
            defer.reject(error);
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name getActas
       * @methodOf poluxClienteApp.controller:GeneralConsultarTrabajoGradoCtrl
       * @param {undefined} undefined No recibe ningún parámetro
       * @returns {Promise} Objeto de tipo promesa que indica cuando se cumple la petición o la excepción generada
       * @description 
       * Consulta de {@link services/poluxService.service:poluxRequest Polux} las actas de seguimiento registradas
       * previamente y las guarda en el mismo objeto que recibe como parámetro.
       */
      ctrl.getActas = function() {
        //Se buscan los documentos de tipo acta de seguimiento
        var defer = $q.defer();

        let TipoDocumentoTemp = ctrl.TiposDocumento.find(data => {
          return data.CodigoAbreviacion == "ACT_PLX"
        });

        var parametrosActas = $.param({
          query: "DocumentoEscrito.TipoDocumentoEscrito:" + TipoDocumentoTemp.Id + ",TrabajoGrado:" + ctrl.trabajoGrado.Id,
          limit: 0
        });
        poluxRequest.get("documento_trabajo_grado", parametrosActas)
          .then(function(responseActas) {
            if (Object.keys(responseActas.data[0]).length > 0) {
              ctrl.trabajoGrado.Actas = responseActas.data;
            } else {
              ctrl.trabajoGrado.Actas = [];
            }
            defer.resolve();
          })
          .catch(function(error) {
            ctrl.mensajeError = $translate.instant("PASANTIA.ERROR.CARGANDO_ACTAS_SEGUIMIENTO");
            defer.reject(error);
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name getvinculaciones
       * @methodOf poluxClienteApp.controller:GeneralConsultarTrabajoGradoCtrl
       * @param {undefined} undefined No recibe ningún parámetro
       * @returns {Promise} Objeto de tipo promesa que indica cuando se cumple la petición o la excepción generada
       * @description 
       * Consulta desde {@link services/poluxService.service:poluxRequest poluxRequest} las personas vinculadas al trabajo
       * que se está consultando
       */
      ctrl.getVinculaciones = function() {
        var getExterno = function(vinculado) {
          var defer = $q.defer();
          var parametrosVinculado = $.param({
            query: "TrabajoGrado:" + ctrl.trabajoGrado.Id,
            limit: 0
          });
          poluxRequest.get("detalle_pasantia", parametrosVinculado)
            .then(function(dataExterno) {
              if (Object.keys(dataExterno.data[0]).length > 0) {
                var temp = dataExterno.data[0].Observaciones.split(" y dirigida por ");
                temp = temp[1].split(" con número de identificacion ");
                vinculado.Nombre = temp[0];
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
        var getInterno = function(vinculado) {
          var defer = $q.defer();
          academicaRequest.get("docente_tg", [vinculado.Usuario])
            .then(function(docente) {
              if (!angular.isUndefined(docente.data.docenteTg.docente)) {
                vinculado.Nombre = docente.data.docenteTg.docente[0].nombre;
                defer.resolve();
              } else {
                defer.reject("No hay datos relacionados al docente");
              }
            })
            .catch(function(error) {
              defer.reject(error);
            });
          return defer.promise;
        }
        var getNota = function(vinculado) {
          var defer = $q.defer();
          //SI es director externo o codirector
          let RolTrabajoGradoTemp = ctrl.RolesTrabajoGrado.find(data => {
            return data.Id == vinculado.RolTrabajoGrado
          });

          if (RolTrabajoGradoTemp.CodigoAbreviacion == "DIR_EXTERNO_PLX" || RolTrabajoGradoTemp.CodigoAbreviacion  == "CODIRECTOR_PLX") {
            vinculado.notaRegistrada = $translate.instant("ERROR.VINCULADO_NO_PUEDE_NOTA");
            defer.resolve();
          }
          //Si es director interno o evaluador
          if (RolTrabajoGradoTemp.CodigoAbreviacion  == "DIRECTOR_PLX" || RolTrabajoGradoTemp.CodigoAbreviacion  == "EVALUADOR_PLX") {
            var parametrosEvaluaciones = $.param({
              limit: 1,
              query: "VinculacionTrabajoGrado:" + vinculado.Id,
            });
            poluxRequest.get("evaluacion_trabajo_grado", parametrosEvaluaciones)
              .then(function(responseEvaluacion) {
                if (Object.keys(responseEvaluacion.data[0]).length > 0) {
                  //Si ya registro la nota
                  vinculado.notaRegistrada = responseEvaluacion.data[0].Nota;
                } else {
                  //Si no ha registrado ninguna nota
                  vinculado.notaRegistrada = $translate.instant("ERROR.VINCULADO_NO_NOTA");
                  //NOTIFICA QUE EL TRABAJO DE GRADO ESTÁ SIN CALIFICAR
                  angular.forEach(ctrl.trabajoGrado.asignaturas, function(asignatura){
                    asignatura.Aprobacion = $translate.instant("ERROR.SIN_CALIFICACION");
                  })
                }
                defer.resolve();
              })
              .catch(function(error) {
                defer.reject(error);
              });
          }
          return defer.promise;
        }
        //Se buscan los vinculados 
        var defer = $q.defer();
        var parametrosVinculados = $.param({
          query: "Activo:True,TrabajoGrado:" + ctrl.trabajoGrado.Id,
          limit: 0
        });
        poluxRequest.get("vinculacion_trabajo_grado", parametrosVinculados).then(function(responseVinculados) {
            if (Object.keys(responseVinculados.data[0]).length > 0) {
              ctrl.trabajoGrado.Vinculados = responseVinculados.data;
              var promises = [];
              angular.forEach(ctrl.trabajoGrado.Vinculados, function(vinculado) {
                let RolTrabajoGradoTemp = ctrl.RolesTrabajoGrado.find(data => {
                  return data.Id == vinculado.RolTrabajoGrado
                });
                if (RolTrabajoGradoTemp.CodigoAbreviacion  === "DIR_EXTERNO_PLX") {
                  //director externo
                  promises.push(getExterno(vinculado));
                } else {
                  //Director interno y evaluadores
                  promises.push(getInterno(vinculado));
                }
                promises.push(getNota(vinculado));
              });
              $q.all(promises)
                .then(function() {
                  ctrl.gridOptionsVinculaciones.data = ctrl.trabajoGrado.Vinculados;

                  angular.forEach(ctrl.gridOptionsVinculaciones.data, function(vinculacion){
                    let RolTrabajoGradoTemp = ctrl.RolesTrabajoGrado.find(data => {
                      return data.Id == vinculacion.RolTrabajoGrado;
                    });

                    vinculacion.RolTrabajoGrado = RolTrabajoGradoTemp;
                  });

                  defer.resolve();
                })
                .catch(function(error) {
                  ctrl.mensajeError = $translate.instant("ERROR.CARGAR_VINCULADOS_TRABAJO_GRADO");
                  defer.reject(error);
                });
            } else {
              ctrl.trabajoGrado.Vinculados = [];
              defer.resolve();
            }
          })
          .catch(function(error) {
            ctrl.mensajeError = $translate.instant("ERROR.CARGAR_VINCULADOS_TRABAJO_GRADO");
            defer.reject(error);
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name getDocumento
       * @methodOf poluxClienteApp.controller:GeneralConsultarTrabajoGradoCtrl
       * @param {number} docid Identificador del documento en {@link services/poluxClienteApp.service:nuxeoClient nuxeoClient}
       * @returns {undefined} No retorna ningún valor
       * @description 
       * Se obtiene el documento alojado en nuxeo para mostrarse en una nueva ventana.
       */
      ctrl.getDocumento = function(docid) {
        /*nuxeoClient.getDocument(docid)
          .then(function(document) {
            $window.open(document.url);
          })*/


          // Muestra de documento con gestor documental
          gestorDocumentalMidRequest.get('/document/'+docid).then(function (response) {
            var file = new Blob([utils.base64ToArrayBuffer(response.data.file)], {type: 'application/pdf'});
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
       * @name getEstudiantesTg
       * @methodOf poluxClienteApp.controller:GeneralConsultarTrabajoGradoCtrl
       * @param {undefined} undefined No recibe ningún parámetro
       * @returns {Promise} Objeto de tipo promesa que indica cuando se cumple la petición o la excepción generada
       * @description 
       * Consulta desde {@link services/poluxService.service:poluxRequest poluxRequest} los estudiantes asociados a un trabajo de grado y sus datos
       */
      ctrl.getEstudiantesTg = function() {
        var defer = $q.defer();
        //Se buscan los estuidiantes activos
        let EstadoEstudianteTrabajoGradoTemp = ctrl.EstadosEstudianteTrabajoGrado.find(data => {
          return data.CodigoAbreviacion == "EST_ACT_PLX"
        });
        var parametrosEstudiantes = $.param({
          query: "EstadoEstudianteTrabajoGrado:" + EstadoEstudianteTrabajoGradoTemp.Id + ",TrabajoGrado:" + ctrl.trabajoGrado.Id,
          limit: 0
        });
        poluxRequest.get("estudiante_trabajo_grado", parametrosEstudiantes)
          .then(function(responseEstudiantes) {
            if (Object.keys(responseEstudiantes.data[0]).length > 0) {
              var promesasEstudiantes = [];
              angular.forEach(responseEstudiantes.data, function(estudiante) {
                promesasEstudiantes.push(ctrl.cargarEstudiante(estudiante));
              });
              $q.all(promesasEstudiantes)
                .then(function() {
                  ctrl.trabajoGrado.estudiantes = responseEstudiantes.data.map(function(estudiante) {
                    return estudiante.datos.codigo + " - " + estudiante.datos.nombre;
                  }).join(', ');
                  defer.resolve();
                })
                .catch(function(error) {
                  defer.reject(error);
                });
            } else {
              ctrl.mensajeError = $translate.instant("ERROR.SIN_ESTUDIANTE_TRABAJO_GRADO");
              defer.reject("sin estudiantes");
            }
          })
          .catch(function(error) {
            ctrl.mensajeError = $translate.instant("ERROR.CARGANDO_ESTUDIANTE_TRABAJO_GRADO");
            defer.reject(error);
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name consultarTrabajoGrado
       * @methodOf poluxClienteApp.controller:GeneralConsultarTrabajoGradoCtrl
       * @description 
       * Consulta el trabajo de grado de un estudiatne del servicio de {@link services/poluxService.service:poluxRequest poluxRequest}, llama a las funciones
       * cargarEstudiante, cargar AsignaturasTrabajoGrado y si el trabajo esta en la modalidad 2 o 3 llama a la funcón getEspaciosAcademicosInscritos.
       * @param {undefined} undefined no requiere parametros
       * @returns {undefined} No retorna ningún parámetro
       */
      ctrl.consultarTrabajoGrado = async function() {
        await getconsultarParametros();
        ctrl.errorCargandoTrabajoGrado = false;
        //Verifica que lo ingresado sea un codigo
        if (/^\d+$/.test(ctrl.codigoEstudiante)) {
          //consultar trabajo de grado del estudiante
          ctrl.loadTrabajoGrado = true;
          let EstadoEstudianteTrabajoGradoTemp = ctrl.EstadosEstudianteTrabajoGrado.find(data => {
            return data.CodigoAbreviacion == "EST_ACT_PLX"
          });
          var parametrosTrabajoGrado = $.param({
            query: "EstadoEstudianteTrabajoGrado:" + EstadoEstudianteTrabajoGradoTemp.Id + ",Estudiante:" + ctrl.codigoEstudiante,
            limit: 1,
          });
          poluxRequest.get('estudiante_trabajo_grado', parametrosTrabajoGrado).then(function(response_trabajoGrado) {
              if (Object.keys(response_trabajoGrado.data[0]).length > 0) {
                ctrl.trabajoGrado = response_trabajoGrado.data[0].TrabajoGrado;
                let EstadoTrabajoGradoTemp = ctrl.EstadosTrabajoGrado.find(data => {
                  return data.Id == ctrl.trabajoGrado.EstadoTrabajoGrado
                });
                if ((EstadoTrabajoGradoTemp.CodigoAbreviacion == "AMO_PLX" || EstadoTrabajoGradoTemp.CodigoAbreviacion == "ASMO_PLX") && ctrl.userRole.includes('ESTUDIANTE')) {
                  ctrl.esAnteproyectoModificable = true;
                }
                //Si el anteproyecto es viable se puede subir la primera versión del proyecto
                if ((EstadoTrabajoGradoTemp.CodigoAbreviacion == "AVI_PLX" || EstadoTrabajoGradoTemp.CodigoAbreviacion == "ASVI_PLX") && ctrl.userRole.includes('ESTUDIANTE')) {
                  ctrl.esPrimeraVersion = true;
                }
                //Si el proyecto es modificable
                if (EstadoTrabajoGradoTemp.CodigoAbreviacion == "MOD_PLX" && ctrl.userRole.includes('ESTUDIANTE')) {
                  ctrl.esProyectoModificable = true;
                }
                //Si es pasantia y esta en espera de ARL
                if (EstadoTrabajoGradoTemp.CodigoAbreviacion == "PAEA_PLX" && ctrl.userRole.includes('ESTUDIANTE')) {
                  ctrl.pasantiaEnEsperaArl = true;
                }
                var promises = [];
                ctrl.trabajoGrado.estudiante = {
                  "Estudiante": ctrl.codigoEstudiante
                }
                ctrl.trabajoGrado.EstadoTrabajoGrado = EstadoTrabajoGradoTemp;
                promises.push(ctrl.cargarEstudiante(ctrl.trabajoGrado.estudiante));
                promises.push(ctrl.cargarAsignaturasTrabajoGrado());
                promises.push(ctrl.cargarActaSocializacion());
                promises.push(ctrl.cargarCertificadoARL());
                promises.push(ctrl.getEstudiantesTg());

                //Consulta las vinculaciones y las áreas de conocimiento
                let ModalidadTemp = ctrl.Modalidades.find(data => {
                  return data.Id == ctrl.trabajoGrado.Modalidad
                });

                ctrl.trabajoGrado.Modalidad = ModalidadTemp;

                if (ModalidadTemp.CodigoAbreviacion != "EAPOS_PLX" && ModalidadTemp.CodigoAbreviacion != "EAPRO_PLX") {
                  promises.push(ctrl.getVinculaciones());
                  promises.push(ctrl.cargarAreasConocimiento());
                }

                //si la modalidad es 2 trae los espacios academicos
                if (ModalidadTemp.CodigoAbreviacion === "EAPOS_PLX" || ModalidadTemp.CodigoAbreviacion === "EAPRO_PLX") {
                  promises.push(ctrl.getEspaciosAcademicosInscritos());
                }
                //Si la modalidad es 1 (Pasantia) se consultan las actas de seguimiento
                // y el detalel de la pasantia
                if (ModalidadTemp.CodigoAbreviacion === "PASEX_PLX" || ModalidadTemp.CodigoAbreviacion === "PASIN_PLX") {
                  promises.push(ctrl.getActas());
                  promises.push(ctrl.getDetallePasantia());
                }

                $q.all(promises).then(function() {
                    //COMPRUEBA SI EL USUARIO APROBÓ O NO
                    angular.forEach(ctrl.trabajoGrado.asignaturas, function (asignatura) {
                      if (asignatura.Aprobacion == undefined) {
                        //CONSULTA EL PERIODO ACADEMICO ANTERIOR
                        academicaRequest.get("periodo_academico", "P").then(function (Periodo) {
                          var P = Periodo.data.periodoAcademicoCollection.periodoAcademico[0];
                          //CONSULTA LOS DATOS DEL ESTUDIANTE
                          academicaRequest.get("datos_estudiante", [ctrl.datos_basicos_estudiante.codigo, P.anio, P.periodo]).then(function (data_estudiante) {
                            if (data_estudiante.data.estudianteCollection.datosEstudiante[0].nivel == "PREGRADO") {
                              //VALIDACIÓN PARA LA MODADLIDAD DE MATERIAS DE PROFUNDIZACIÓN EN PREGRADO
                              if(ctrl.trabajoGrado.Modalidad.CodigoAbreviacion == "EAPOS"){
                                if (asignatura.Calificacion >= 3.5) {
                                  asignatura.Aprobacion = $translate.instant("APROBADO.ASIGNATURA");
                                } else {
                                  asignatura.Aprobacion = $translate.instant("REPROBADO");
                                }
                              }else{
                                if (asignatura.Calificacion >= 3.0) {
                                  asignatura.Aprobacion = $translate.instant("APROBADO.ASIGNATURA");
                                } else {
                                  asignatura.Aprobacion = $translate.instant("REPROBADO");
                                }
                              }
                            } else if (data_estudiante.data.estudianteCollection.datosEstudiante[0].nivel == "POSGRADO") {
                              if (asignatura.Calificacion >= 3.5) {
                                asignatura.Aprobacion = $translate.instant("APROBADO.ASIGNATURA");
                              } else {
                                asignatura.Aprobacion = $translate.instant("REPROBADO");
                              }
                            }
                          });
                        });
                      }
                    });
                    ctrl.gridOptionsAsignaturas.data = ctrl.trabajoGrado.asignaturas;
                    angular.forEach(ctrl.gridOptionsAsignaturas.data, function(asignatura){
                      let EstadoAsignaturaTrabajoGradoTemp = ctrl.EstadosAsignaturaGrado.find(data => {
                        return data.Id == asignatura.EstadoAsignaturaTrabajoGrado
                      });
                      asignatura.EstadoAsignaturaTrabajoGrado = EstadoAsignaturaTrabajoGradoTemp;
                    });
                    ctrl.gridOptionsEspacios.data = ctrl.trabajoGrado.espacios;
                    ctrl.trabajoCargado = true;
                    ctrl.loadTrabajoGrado = false;
                  })
                  .catch(function(error) {
                    
                    ctrl.errorCargandoTrabajoGrado = true;
                    ctrl.loadTrabajoGrado = false;
                  });
              } else {
                ctrl.mensajeError = $translate.instant('ERROR.ESTUDIANTE_SIN_TRABAJO');
                ctrl.errorCargandoTrabajoGrado = true;
                ctrl.loadTrabajoGrado = false;
              }
            })
            .catch(function(error) {
              
              ctrl.mensajeError = $translate.instant('ERROR.CARGAR_TRABAJO_GRADO');
              ctrl.errorCargandoTrabajoGrado = true;
              ctrl.loadTrabajoGrado = false;
            });
        } else {
          ctrl.mensajeError = $translate.instant('ERROR.CODIGO_NO_VALIDO');
          ctrl.errorCargandoTrabajoGrado = true;
        }
      }

      if (ctrl.userRole.includes("ESTUDIANTE")) {
        ctrl.codigoEstudiante = ctrl.userId;
        ctrl.consultarTrabajoGrado();
      }

      /**
       * @ngdoc method
       * @name obtenerParametrosDocumentoTrabajoGrado
       * @methodOf poluxClienteApp.controller:GeneralConsultarTrabajoGradoCtrl
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
       * @returns {Promise} El mensaje en caso de no corresponder la información, o la excepción generada
       */
      ctrl.consultarDocumentoTrabajoGrado = function(trabajoGrado) {
        var deferred = $q.defer();
        poluxRequest.get("documento_trabajo_grado", ctrl.obtenerParametrosDocumentoTrabajoGrado(trabajoGrado.Id))
          .then(function(documentoAsociado) {
            if (Object.keys(documentoAsociado.data[0]).length > 0) {
              trabajoGrado.documentoTrabajoGrado = documentoAsociado.data[0].Id;
              trabajoGrado.documentoEscrito = documentoAsociado.data[0].DocumentoEscrito;
            }
            deferred.resolve($translate.instant("ERROR.SIN_ESTUDIANTE_TRABAJO_GRADO"));
          })
          .catch(function(excepcionVinculacionTrabajoGrado) {
            deferred.reject($translate.instant("ERROR.CARGANDO_ESTUDIANTE_TRABAJO_GRADO"));
          });
        return deferred.promise;
      }

    });