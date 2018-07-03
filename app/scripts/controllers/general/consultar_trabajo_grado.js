'use strict';

/**
 * @ngdoc controller
 * @name poluxClienteApp.controller:GeneralConsultarTrabajoGradoCtrl
 * @description
 * # GeneralConsultarTrabajoGradoCtrl
 * Controller of the poluxClienteApp
 * Controlador para consultar un trabajo de grado
 * @requires services/poluxClienteApp.service:tokenService
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires services/poluxService.service:poluxRequest
 * @requires services/academicaService.service:academicaRequest
 * @requires services/poluxClienteApp.service:nuxeoService
 * @requires $window
 * @requires $q
 * @property {number} userId Documento del usuario que ingresa al módulo.
 * @property {number} codigoEstudiante Documento del estudiante que se va a consultar
 * @property {object} userRole Listado de roles que tiene el usuairo que ingresa al módulo
 * @property {object} trabajoGrado Contiene toda la información del trabajo de grado
 * @property {object} estudiante Contiene la información del estudiante
 * @property {object} gridOptionsEspacios Grid options para los espacios academicos
 * @property {object} gridOptionsAsignatura Grid options para las asignatruas de TG
 */
angular.module('poluxClienteApp')
  .controller('GeneralConsultarTrabajoGradoCtrl', function (token_service,$translate,poluxRequest,academicaRequest,$q,nuxeo,$window) {
    var ctrl = this;

    //token_service.token.documento = "79647592";
    //token_service.token.role.push("COORDINADOR_PREGRADO");
    token_service.token.documento = "20141020036";
    token_service.token.role.push("ESTUDIANTE");
    ctrl.userRole = token_service.token.role;
    ctrl.userId = token_service.token.documento;

    ctrl.mensajeCargandoTrabajoGrado = $translate.instant('LOADING.CARGANDO_DATOS_TRABAJO_GRADO');
    ctrl.mensajeCargandoActualizarTg = $translate.instant('LOADING.CARGANDO_DATOS_TRABAJO_GRADO');
    ctrl.trabajoCargado = false;

    ctrl.gridOptionsAsignaturas = [];
    ctrl.gridOptionsAsignaturas.columnDefs = [{
      name: 'CodigoAsignatura',
      displayName: $translate.instant('ASIGNATURA'),
      width: '20%',
    }, {
      name: 'Anio',
      displayName: $translate.instant('ANIO'),
      width: '20%',
    }, {
      name: 'Periodo',
      displayName: $translate.instant('PERIODO'),
      width: '20%',
    }, {
      name: 'Calificacion',
      displayName: $translate.instant('NOTA'),
      width: '20%',
    }, {
      name: 'EstadoAsignaturaTrabajoGrado.Nombre',
      displayName: $translate.instant('ESTADO'),
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

    /**
     * @ngdoc method
     * @name cargarEstudiante
     * @methodOf poluxClienteApp.controller:GeneralConsultarTrabajoGradoCtrl
     * @description 
     * Consulta los datos basicos de un estudiante {@link services/academicaService.service:academicaRequest academicaRequest}
     * @param {object} estudiante Estudiante que se va a consultar
     * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplio la petición y se resuleve sin retornar ningún objeto
     */
    ctrl.cargarEstudiante = function(estudiante) {
      var defer = $q.defer();
      //consultar datos básicos del estudiante
      academicaRequest.get("datos_basicos_estudiante", [estudiante.codigo])
        .then(function(responseDatosBasicos) {
          if (!angular.isUndefined(responseDatosBasicos.data.datosEstudianteCollection.datosBasicosEstudiante)) {
            estudiante.datos = responseDatosBasicos.data.datosEstudianteCollection.datosBasicosEstudiante[0];
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
     * Consulta las asingaturas TGI y TGII de un trabajo de grado el servicio de {@link services/poluxService.service:poluxRequest poluxRequest}.
     * @param {undefined} undefined no requiere parametros
     * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplio la petición y se resuleve sin retornar ningún objeto
     */
    ctrl.cargarAsignaturasTrabajoGrado = function() {
      var defer = $q.defer();
      var parametrosAsignaturasTrabajoGrado = $.param({
        query: "TrabajoGrado:" + ctrl.trabajoGrado.Id,
        limit: 2,
      });
      poluxRequest.get("asignatura_trabajo_grado", parametrosAsignaturasTrabajoGrado)
        .then(function(responseAsignaturaTrabajoGrado) {
          if (responseAsignaturaTrabajoGrado.data != null) {
            ctrl.trabajoGrado.asignaturas = responseAsignaturaTrabajoGrado.data;
            angular.forEach(ctrl.trabajoGrado.asignaturas, function(asignatura) {
              asignatura.Estado = asignatura.EstadoAsignaturaTrabajoGrado.Nombre;
            });
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
     * @name getEspaciosAcademicosInscritos
     * @methodOf poluxClienteApp.controller:GeneralConsultarTrabajoGradoCtrl
     * @description 
     * Consulta los espacios academicos inscritos en modalidad de materias de posgrado del servicio de {@link services/poluxService.service:poluxRequest poluxRequest},
     * consulta el nombre de {@link services/academicaService.service:academicaRequest academicaRequest}.
     * @param {undefined} undefined no requiere parametros
     * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplio la petición y se resuleve sin retornar ningún objeto
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
          if (responseEspacios.data != null) {
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
     * @param {undefined} undefined No recibe ningún parametro
     * @returns {Promise} Objeto de tipo promesa que indica cuando se cumple la petición, se resuelve sin ningún valor.
     * @description 
     * Consulta de {@link services/poluxService.service:poluxRequest Polux} los detalles de la pasantia
     */
    ctrl.getDetallePasantia = function(){
      var defer = $q.defer();
      var parametrosPasantia = $.param({
        query:"TrabajoGrado:"+ctrl.trabajoGrado.Id,
        limit:1
      });
      poluxRequest.get("detalle_pasantia",parametrosPasantia)
      .then(function(responsePasantia){
        if(responsePasantia.data != null){
          ctrl.trabajoGrado.DetallePasantia = responsePasantia.data[0].Observaciones;
          defer.resolve();
        }else{
          ctrl.mensajeError = $translate.instant("PASANTIA.ERROR.SIN_DETALLES");
          defer.reject("No hay detalle de la pasantia");
        }
      })
      .catch(function(error){
        ctrl.mensajeError = $translate.instant("PASANTIA.ERROR.CARGANDO_DETALLES");
        defer.reject(error);
      });
      return defer.promise;
    }

    
    /**
     * @ngdoc method
     * @name getActas
     * @methodOf poluxClienteApp.controller:GeneralConsultarTrabajoGradoCtrl
     * @param {undefined} undefined No recibe ningún parametro
     * @returns {Promise} Objeto de tipo promesa que indica cuando se cumple la petición, se resuelve sin ningún valor.
     * @description 
     * Consulta de {@link services/poluxService.service:poluxRequest Polux} las actas de seguimiento registradas
     * previamente y las guarda en el mismo objeto qeu recibe como parámetro.
     */
    ctrl.getActas = function(){
      //Se buscan los documentos de tipo acta de seguimiento
      var defer = $q.defer();
      var parametrosActas = $.param({
        query:"DocumentoEscrito.TipoDocumentoEscrito:2,TrabajoGrado:"+ctrl.trabajoGrado.Id,
        limit:0
      });
      poluxRequest.get("documento_trabajo_grado",parametrosActas)
      .then(function(responseActas){
        if(responseActas.data != null){
          ctrl.trabajoGrado.Actas = responseActas.data;
        }else{
          ctrl.trabajoGrado.Actas = [];
        }
        defer.resolve();
      })
      .catch(function(error){
        ctrl.mensajeError = $translate.instant("PASANTIA.ERROR.CARGANDO_ACTAS_SEGUIMIENTO");
        defer.reject(error);
      });
      return defer.promise;
    }

    /**
     * @ngdoc method
     * @name getvinculaciones
     * @methodOf poluxClienteApp.controller:GeneralConsultarTrabajoGradoCtrl
     * @param {undefined} undefined No recibe ningún parametro
     * @returns {Promise} Objeto de tipo promesa que indica cuando se cumple la petición, se resuelve sin ningún valor.
     * @description 
     * Consulta de {@link services/poluxService.service:poluxRequest Polux} las personas vinculadas al trabajo
     * que se esta consultando
     */
    ctrl.getVinculaciones = function(){
      var getExterno = function(vinculado){
        var defer = $q.defer();
        var parametrosVinculado = $.param({
          query:"TrabajoGrado:"+ctrl.trabajoGrado.Id,
          limit:0
        });
        poluxRequest.get("detalle_pasantia",parametrosVinculado)
        .then(function(dataExterno){
          if(dataExterno.data != null){
            var temp = dataExterno.data[0].Observaciones.split(" y dirigida por ");
            temp = temp[1].split(" con número de identificacion ");
            vinculado.Nombre = temp[0];
            defer.resolve();
          }else{
            defer.reject("No hay datos relacionados al director externo");
          }
        })
        .catch(function(error){
          defer.reject(error);
        });
        return defer.promise;
      }
      var getInterno = function(vinculado){
        var defer = $q.defer();
        academicaRequest.get("docente_tg",[vinculado.Usuario])
        .then(function(docente){
          if (!angular.isUndefined(docente.data.docenteTg.docente)) {
            vinculado.Nombre =  docente.data.docenteTg.docente[0].nombre;
            defer.resolve();
          }else{
            defer.reject("No hay datos relacionados al docente");
          }
        })
        .catch(function(error){
          defer.reject(error);
        });
        return defer.promise;
      }
      //Se buscan los vinculados 
      var defer = $q.defer();
      var parametrosVinculados = $.param({
        query:"Activo:True,TrabajoGrado:"+ctrl.trabajoGrado.Id,
        limit:0
      });
      poluxRequest.get("vinculacion_trabajo_grado",parametrosVinculados)
      .then(function(responseVinculados){
        if(responseVinculados.data != null){
          ctrl.trabajoGrado.Vinculados = responseVinculados.data;
          var promises = [];
          angular.forEach(ctrl.trabajoGrado.Vinculados,function(vinculado){
            if(vinculado.RolTrabajoGrado.Id === 2){
              //director externo
              promises.push(getExterno(vinculado));
            } else {
              //Director interno y evaluadores
              promises.push(getInterno(vinculado));
            }
          });
          $q.all(promises)
          .then(function(){
            defer.resolve();
          })
          .catch(function(error){
            ctrl.mensajeError = $translate.instant("ERROR.CARGAR_VINCULADOS_TRABAJO_GRADO");
            defer.reject(error);
          });
        }else{
          ctrl.trabajoGrado.Vinculados = [];
          defer.resolve();
        }
      })
      .catch(function(error){
        ctrl.mensajeError = $translate.instant("ERROR.CARGAR_VINCULADOS_TRABAJO_GRADO");
        defer.reject(error);
      });
      return defer.promise;
    }

      /**
     * @ngdoc method
     * @name getDocumento
     * @methodOf poluxClienteApp.controller:GeneralConsultarTrabajoGradoCtrl
     * @param {number} docid Id del documento en {@link services/poluxClienteApp.service:nuxeoService nuxeo}
     * @returns {undefined} No retorna ningún valor
     * @description 
     * Llama a la función obtenerDoc y obtenerFetch para descargar un documento de nuxeo y msotrarlo en una nueva ventana.
     */
    ctrl.getDocumento = function(docid){
      nuxeo.header('X-NXDocumentProperties', '*');

      /**
     * @ngdoc method
     * @name obtenerDoc
     * @methodOf poluxClienteApp.controller:GeneralConsultarTrabajoGradoCtrl
     * @param {number} docid Id del documento en {@link services/poluxClienteApp.service:nuxeoService nuxeo}
     * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplio la petición y se resuleve con el objeto Periodo anterior
     * @description 
     * Consulta un documento a {@link services/poluxClienteApp.service:nuxeoService nuxeo} y responde con el contenido
     */
      ctrl.obtenerDoc = function () {
        var defer = $q.defer();

        nuxeo.request('/id/'+docid)
            .get()
            .then(function(response) {
              ctrl.doc=response;
              //var aux=response.get('file:content');
              ctrl.document=response;
              defer.resolve(response);
            })
            .catch(function(error){
                defer.reject(error)
            });
        return defer.promise;
      };

      /**
     * @ngdoc method
     * @name obtenerFetch
     * @methodOf poluxClienteApp.controller:GeneralConsultarTrabajoGradoCtrl
     * @param {object} doc Documento de nuxeo al cual se le obtendra el Blob
     * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplio la petición y se resuleve con el objeto Periodo anterior
     * @description 
     * Obtiene el blob de un documento
     */
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
    
    /**
     * @ngdoc method
     * @name consultarTrabajoGrado
     * @methodOf poluxClienteApp.controller:GeneralConsultarTrabajoGradoCtrl
     * @description 
     * Consulta el trabajo de grado de un estudiatne del servicio de {@link services/poluxService.service:poluxRequest poluxRequest}, llama a las funciones
     * cargarEstudiante, cargar AsignaturasTrabajoGrado y si el trabajo esta en la modalidad 2 llama a la funcón 
     * getEspaciosAcademicosInscritos.
     * @param {undefined} undefined no requiere parametros
     * @returns {undefined} No retorna ningún parametro
     */
    ctrl.consultarTrabajoGrado = function() {
      ctrl.errorCargandoTrabajoGrado = false;
      //Verifica que lo ingresado sea un codigo
      if (/^\d+$/.test(ctrl.codigoEstudiante)) {
        //consultar trabajo de grado del estudiante
        ctrl.loadTrabajoGrado = true;
        var parametrosTrabajoGrago = $.param({
          query: "EstadoEstudianteTrabajoGrado.Id:1,Estudiante:" + ctrl.codigoEstudiante,
          limit: 1,
        });
        poluxRequest.get('estudiante_trabajo_grado', parametrosTrabajoGrago)
          .then(function(response_trabajoGrado) {
            if (response_trabajoGrado.data != null) {
              ctrl.trabajoGrado = response_trabajoGrado.data[0].TrabajoGrado;
              if ((ctrl.trabajoGrado.EstadoTrabajoGrado.Id == 6 ||
                  ctrl.trabajoGrado.EstadoTrabajoGrado.Id == 11) &&
                ctrl.userRole.includes('ESTUDIANTE')) {
                ctrl.esAnteproyectoModificable = true;
              }
              //Si el anteproyecto es viable se puede subir la primera versión del proyecto
              if ((ctrl.trabajoGrado.EstadoTrabajoGrado.Id == 5 ||
                  ctrl.trabajoGrado.EstadoTrabajoGrado.Id == 10) &&
                ctrl.userRole.includes('ESTUDIANTE')) {
                ctrl.esPrimeraVersion = true;
              }
              var promises = [];
              ctrl.trabajoGrado.estudiante = {
                "codigo": ctrl.codigoEstudiante
              }
              promises.push(ctrl.cargarEstudiante(ctrl.trabajoGrado.estudiante));
              promises.push(ctrl.cargarAsignaturasTrabajoGrado());

            //Consulta las vinculaciones 
            if(ctrl.trabajoGrado.Modalidad.Id != 2 && ctrl.trabajoGrado.Modalidad.Id != 3){
              promises.push(ctrl.getVinculaciones());
            }

            //si la modalidad es 2 trae los espacios academicos
            if(ctrl.trabajoGrado.Modalidad.Id === 2){
              promises.push(ctrl.getEspaciosAcademicosInscritos());
            }
            //Si la modalidad es 1 (Pasantia) se consultan las actas de seguimiento
            // y el detalel de la pasantia
            if(ctrl.trabajoGrado.Modalidad.Id === 1){
              promises.push(ctrl.getActas());
              promises.push(ctrl.getDetallePasantia());
            }

              $q.all(promises)
                .then(function() {
                  console.log(ctrl.trabajoGrado);
                  console.log(ctrl.trabajoGrado.estudiante);
                  ctrl.gridOptionsAsignaturas.data = ctrl.trabajoGrado.asignaturas;
                  ctrl.gridOptionsEspacios.data = ctrl.trabajoGrado.espacios;
                  ctrl.trabajoCargado = true;
                  ctrl.loadTrabajoGrado = false;
                })
                .catch(function(error) {
                  console.log(error);
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
            console.log(error);
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
          if (documentoAsociado.data) {
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

    /**
     * @ngdoc method
     * @name actualizarTg
     * @methodOf poluxClienteApp.controller:GeneralConsultarTrabajoGradoCtrl
     * @description 
     * Permite mostrar el contenido del modal que habilita subir el documento nuevo y actualizar el tg
     * @param {undefined} undefined No requiere parámetros
     * @returns {undefined} No hace retorno de resultados
     */
    ctrl.actualizarTg = function() {
      ctrl.cargandoActualizarTg = true;
      $('#modalActualizarTg').modal('show');
      ctrl.consultarDocumentoTrabajoGrado(ctrl.trabajoGrado)
        .then(function(respuestaDocumentoTrabajoGrado) {
          ctrl.cargandoActualizarTg = false;
        })
        .catch(function(excepcionDocumentoTrabajoGrado) {
          ctrl.cargandoActualizarTg = false;
          swal(
            $translate.instant("MODIFICAR_TG"),
            $translate.instant("ERROR.MODIFICANDO_TG"),
            'warning'
          );
        });
    }

    /**
     * @ngdoc method
     * @name cargarDocumento
     * @methodOf poluxClienteApp.controller:GeneralConsultarTrabajoGradoCtrl
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
        .input('/default-domain/workspaces/Proyectos de Grado POLUX/Anteproyectos')
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
     * @name actualizarDocumentoTrabajoGrado
     * @methodOf poluxClienteApp.controller:GeneralConsultarTrabajoGradoCtrl
     * @description
     * Función que prepara el contenido de la información para actualizar.
     * Efectúa el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para registrar la actualización del anteproyecto.
     * @param {String} respuestaCargarDocumento El enlace generado luego de subir el documento
     * @returns {Promise} La respuesta de operar el registro en la base de datos
     */
    ctrl.actualizarDocumentoTrabajoGrado = function(respuestaCargarDocumento) {
      var deferred = $q.defer();
      if (ctrl.esAnteproyectoModificable) {
        ctrl.trabajoGrado.EstadoTrabajoGrado = {
          Id: 4
        };
        ctrl.trabajoGrado.documentoEscrito.TipoDocumentoEscrito = 3;
      }
      if (ctrl.esPrimeraVersion) {
        ctrl.trabajoGrado.EstadoTrabajoGrado = {
          Id: 13
        };
        ctrl.trabajoGrado.documentoEscrito.TipoDocumentoEscrito = 4;
      }
      delete ctrl.trabajoGrado.documentoEscrito.Id
      ctrl.trabajoGrado.documentoEscrito.Enlace = respuestaCargarDocumento;
      var documentoTrabajoGrado = {
        Id: ctrl.trabajoGrado.documentoTrabajoGrado,
        TrabajoGrado: {
          Id: ctrl.trabajoGrado.Id
        },
        DocumentoEscrito: {
          Id: 0,
        }
      }
      var informacionParaActualizar = {
        "DocumentoEscrito": ctrl.trabajoGrado.documentoEscrito,
        "DocumentoTrabajoGrado": documentoTrabajoGrado,
        "TrabajoGrado": ctrl.trabajoGrado
      };
      poluxRequest
        .post("tr_actualizar_documento_tg", informacionParaActualizar)
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
     * @name subirDocumento
     * @methodOf poluxClienteApp.controller:GeneralConsultarTrabajoGradoCtrl
     * @description 
     * Maneja la operación de subir el documento luego de que el usuario selecciona y efectúa click sobre el botón dentro del modal
     * @param {undefined} undefined No requiere parámetros
     * @returns {undefined} No hace retorno de resultados
     */
    ctrl.subirDocumento = function() {
      var descripcionDocumento;
      var titleConfirmacion;
      var mensajeConfirmacion;
      var mensajeSuccess;
      var mensajeError;
      if (ctrl.esAnteproyectoModificable) {
        descripcionDocumento = "Versión nueva del anteproyecto";
        titleConfirmacion = "CORREGIR_ANTEPROYECTO.CONFIRMACION";
        mensajeConfirmacion = "CORREGIR_ANTEPROYECTO.MENSAJE_CONFIRMACION";
        mensajeSuccess = "CORREGIR_ANTEPROYECTO.ANTEPROYECTO_ACTUALIZADO";
      }
      if (ctrl.esPrimeraVersion) {
        descripcionDocumento = "Primera versión del trabajo de grado";
        titleConfirmacion = "PRIMERA_VERSION.CONFIRMACION";
        mensajeConfirmacion = "PRIMERA_VERSION.MENSAJE_CONFIRMACION";
        mensajeSuccess = "PRIMERA_VERSION.TG_ACTUALIZADO";
      }
      swal({
          title: $translate.instant(titleConfirmacion),
          text: $translate.instant(mensajeConfirmacion),
          type: "info",
          confirmButtonText: $translate.instant("ACEPTAR"),
          cancelButtonText: $translate.instant("CANCELAR"),
          showCancelButton: true
        })
        .then(function(confirmacionDelUsuario) {
          if (confirmacionDelUsuario.value) {
            ctrl.loadTrabajoGrado = true;
            ctrl.cargandoActualizarTg = true;
            ctrl.cargarDocumento(ctrl.trabajoGrado.Titulo, descripcionDocumento, ctrl.nuevaVersion)
              .then(function(respuestaCargarDocumento) {
                ctrl.actualizarDocumentoTrabajoGrado(respuestaCargarDocumento)
                  .then(function(respuestaActualizarTG) {
                    if (respuestaActualizarTG.data[0] === "Success") {
                      ctrl.loadTrabajoGrado = false;
                      ctrl.cargandoActualizarTg = false;
                      swal(
                        $translate.instant(titleConfirmacion),
                        $translate.instant(mensajeSuccess),
                        'success'
                      );
                      ctrl.consultarTrabajoGrado();
                      if (ctrl.esAnteproyectoModificable) {
                        ctrl.esAnteproyectoModificable = false
                      }
                      if (ctrl.esPrimeraVersion) {
                        ctrl.esPrimeraVersion = false
                      }
                      $('#modalActualizarTg').modal('hide');
                    } else {
                      ctrl.loadTrabajoGrado = false;
                      ctrl.cargandoActualizarTg = false;
                      swal(
                        $translate.instant(titleConfirmacion),
                        $translate.instant(respuestaActualizarTG.data[1]),
                        'warning'
                      );
                    }
                  })
                  .catch(function(excepcionActualizarAnteproyecto) {
                    console.log(excepcionActualizarAnteproyecto);
                    ctrl.loadTrabajoGrado = false;
                    ctrl.cargandoActualizarTg = false;
                    swal(
                      $translate.instant(titleConfirmacion),
                      $translate.instant("ERROR.MODIFICANDO_TG"),
                      'warning'
                    );
                  });
              })
              .catch(function(excepcionCargarDocumento) {
                swal(
                  $translate.instant("ERROR.SUBIR_DOCUMENTO"),
                  $translate.instant("VERIFICAR_DOCUMENTO"),
                  'warning'
                );
                ctrl.loadTrabajoGrado = false;
                ctrl.cargandoActualizarAnteproyecto = false;
              });
          }
        });

    }

  });