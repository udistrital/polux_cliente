'use strict';

/**
 * @ngdoc controller
 * @name poluxClienteApp.controller:PasantiaActasSeguimientoCtrl
 * @description
 * # PasantiaActasSeguimientoCtrl
 * Controller of the poluxClienteApp
 * Controlador sobre el submódulo de la modalidad de pasantía que permite al director registrar las actas de seguimiento.
 * @requires $q
 * @requires $scope
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires $window
 * @requires services/academicaService.service:academicaRequest
 * @requires services/poluxClienteApp.service:nuxeoService
 * @requires services/poluxService.service:poluxRequest
 * @requires services/poluxClienteApp.service:tokenService
 * @property {String} userDocument Documento del usuario que se loguea en el sistema
 * @property {boolean} loadingTrabajos Booleano que permite identificar cuando los trabajos de grado esta cargando
 * @property {boolean} loadingDocumento Booleano que permite identificar cuando esta cargando un documento
 * @property {boolean} errorCargando Booleano que permite identificar cuando ocurre un error cargando los trabajos de grado de la modalidad de pasantia
 * @property {String} mensajeCargandoTrabajos Mensaje que se muesrtra mientras se estan cargando los trabajos de la modalidad de pasantia
 * @property {String} mensajeCargandoDocumento Mensaje que se muesrtra mientras se esta cargando un documento
 * @property {String} mensajeErrorCargando Mensaje que se muestra cuando ocurre un error cargando los trabajos de grado de la modalidad de pasantia
 * @property {Array} trabajosPasantia Contiene los trabajos de pasantia asociados a un docente
 * @property {Object} gridOptions Contiene las opciones del ui-grid que muestra los trabajos de grado de pasantia
 * @property {Object} pasantiaSeleccionada Contiene los datos del trabajo seleccionado por el docente
 * @property {Object} actaModel Objeto que carga el documento subido desde la vista y que se cargará a la gestión documental
 * @property {Object} document Objeto que carga el documento a obtener desde la vista en concepto de actas de seguimiento
 */
angular.module('poluxClienteApp')
  .controller('PasantiaActasSeguimientoCtrl',
    function ($q, $scope, $translate, $window, academicaRequest, nuxeoClient, poluxRequest, token_service) {
      var ctrl = this;

      ctrl.mensajeCargandoTrabajos = $translate.instant("LOADING.CARGANDO_TRABAJOS_DE_GRADO_PASANTIA");
      ctrl.mensajeCargandoDocumento = $translate.instant("LOADING.CARGANDO_DOCUMENTO");

      //token_service.token.documento = "80093200";
      //ctrl.userDocument = token_service.token.documento;
      ctrl.userDocument = token_service.getAppPayload().appUserDocument;

      $scope.botones = [{
        clase_color: "ver",
        clase_css: "fa fa-edit fa-lg  faa-shake animated-hover",
        titulo: $translate.instant('PASANTIA.REGISTRAR_ACTAS_SEGUIMIENTO'),
        operacion: 'ver',
        estado: true
      },];

      ctrl.gridOptions = {
        paginationPageSizes: [5, 10, 15, 20, 25],
        paginationPageSize: 10,
        enableFiltering: true,
        enableSorting: true,
        enableSelectAll: false,
        useExternalPagination: false,
      };

      ctrl.gridOptions.columnDefs = [{
        name: 'TrabajoGrado.Titulo',
        displayName: $translate.instant('NOMBRE'),
        width: '30%',
      }, {
        name: 'TrabajoGrado.NombresEstudiantes',
        displayName: $translate.instant('ESTUDIANTES'),
        width: '35%',
      }, {
        name: 'TrabajoGrado.Actas.length',
        displayName: $translate.instant('ACTAS_REGISTRADAS'),
        width: '20%',
      }, {
        name: 'Acciones',
        displayName: $translate.instant('ACCIONES'),
        width: '15%',
        type: 'boolean',
        cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>'
      }];

      /**
       * @ngdoc method
       * @name getEstudiantesPasantia
       * @methodOf poluxClienteApp.controller:PasantiaActasSeguimientoCtrl
       * @param {Object} trabajoGrado Trabajo de grado del cual se quieren consultar las actas asociadas
       * @returns {Promise} Objeto de tipo promesa que indica cuando se cumple la petición, se resuelve sin ningún valor
       * @description 
       * Consulta de {@link services/poluxService.service:poluxRequest poluxRequest} los estudiantes asociados al trabajo de grado 
       * que se recibe y para cada estudiante consulta sus datos básicos en {@link services/academicaService.service:academicaRequest academicaRequest}
       * para mostrarlos al docente, permitiendo la visualización del modulo.
       */
      ctrl.getEstudiantesPasantia = function (trabajoGrado) {
        var defer = $q.defer()
        var getDatosEstudiante = function (codigoEstudiante) {
          var defer = $q.defer();
          academicaRequest.get("datos_basicos_estudiante", [codigoEstudiante])
            .then(function (responseDatosBasicos) {
              if (!angular.isUndefined(responseDatosBasicos.data.datosEstudianteCollection.datosBasicosEstudiante)) {
                defer.resolve(responseDatosBasicos.data.datosEstudianteCollection.datosBasicosEstudiante[0]);
              } else {
                defer.reject("No hay datos del estudiante");
              }
            })
            .catch(function (error) {
              defer.reject(error);
            });
          return defer.promise;
        }

        //Consultar los estudiantes asociados al trabajo de grado
        var parametrosEstudiantes = $.param({
          query: "TrabajoGrado:" + trabajoGrado.Id,
          limit: 0
        });
        poluxRequest.get("estudiante_trabajo_grado", parametrosEstudiantes)
          .then(function (responseEstudiantes) {
            if (Object.keys(responseEstudiantes.data[0]).length > 0) {
              var promises = [];
              angular.forEach(responseEstudiantes.data, function (estudiante) {
                promises.push(getDatosEstudiante(estudiante.Estudiante));
              });
              $q.all(promises)
                .then(function (estudiantes) {
                  trabajoGrado.Estudiantes = estudiantes;
                  trabajoGrado.NombresEstudiantes = "";
                  angular.forEach(trabajoGrado.Estudiantes, function (estudiante) {
                    trabajoGrado.NombresEstudiantes += " - " + "(" + estudiante.codigo + ") " + estudiante.nombre
                  });
                  trabajoGrado.NombresEstudiantes = trabajoGrado.NombresEstudiantes.substring(2)
                  defer.resolve();
                })
                .catch(function (error) {
                  ctrl.mensajeErrorCargando = $translate.instant("ERROR.CARGAR_DATOS_ESTUDIANTES");
                  defer.reject(error);
                });
            } else {
              ctrl.mensajeErrorCargando = $translate.instant("ERROR.CARGANDO_ESTUDIANTE_TRABAJO_GRADO");
              defer.reject("No se encuentran estudiantes en el trabajo");
            }
          })
          .catch(function (error) {
            ctrl.mensajeErrorCargando = $translate.instant("ERROR.CARGAR_DATOS_ESTUDIANTES");
            defer.reject(error);
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name getActas
       * @methodOf poluxClienteApp.controller:PasantiaActasSeguimientoCtrl
       * @param {Object} trabajoGrado Trabajo de grado del cual se quieren consultar las actas asociadas
       * @returns {Promise} Objeto de tipo promesa que indica cuando se cumple la petición, se resuelve sin ningún valor
       * @description 
       * Consulta de {@link services/poluxService.service:poluxRequest Polux} las actas de seguimiento registradas
       * previamente y las guarda en el mismo objeto que recibe como parámetro.
       */
      ctrl.getActas = function (trabajoGrado) {
        //Se buscan los documentos de tipo acta de seguimiento
        var defer = $q.defer();
        var parametrosActas = $.param({
          query: "DocumentoEscrito.TipoDocumentoEscrito:2,TrabajoGrado:" + trabajoGrado.Id,
          limit: 0
        });
        poluxRequest.get("documento_trabajo_grado", parametrosActas)
          .then(function (responseActas) {
            if (Object.keys(responseActas.data[0]).length > 0) {
              trabajoGrado.Actas = responseActas.data;
            } else {
              trabajoGrado.Actas = [];
            }
            defer.resolve();
          })
          .catch(function (error) {
            ctrl.mensajeErrorCargando = $translate.instant("PASANTIA.ERROR.CARGANDO_ACTAS_SEGUIMIENTO");
            defer.reject(error);
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name getTrabajosGradoPasantia
       * @methodOf poluxClienteApp.controller:PasantiaActasSeguimientoCtrl
       * @param {String} userDocument Documento del docente que ingresa a registrar las actas
       * @returns {undefined} No retorna ningún valor
       * @description 
       * Consulta de {@link services/poluxService.service:poluxRequest Polux} los trabajos de grado de la modalidad de pasantia en los que el docente se encuentra vinculado con el rol
       * de director, luego, para cada uno de los trabajos obtenidos consulta los estudiantes asociados y sus actas llamando a las 
       * funciones getEstudiantesPasantia y getActas respectivamente.
       */
      ctrl.getTrabajosGradoPasantia = function (userDocument) {
        //Se consultan los trabajos de grado de la modalidad de pasantia de los que el docente es director
        // y que se encuentren en el estado de cursado
        ctrl.loadingTrabajos = true;
        var parametrosDirector = $.param({
          query: "Activo:True,TrabajoGrado.Modalidad.Id:1,TrabajoGrado.EstadoTrabajoGrado.Id:13,RolTrabajoGrado:1,Usuario:" + userDocument,
          limit: 0
        });
        poluxRequest.get("vinculacion_trabajo_grado", parametrosDirector)
          .then(function (responsePasantias) {
            if (Object.keys(responsePasantias.data[0]).length > 0) {
              ctrl.trabajosPasantia = responsePasantias.data;
              var promises = [];
              angular.forEach(ctrl.trabajosPasantia, function (pasantia) {
                promises.push(ctrl.getEstudiantesPasantia(pasantia.TrabajoGrado));
                promises.push(ctrl.getActas(pasantia.TrabajoGrado));
              });
              $q.all(promises)
                .then(function () {
                  
                  ctrl.gridOptions.data = ctrl.trabajosPasantia;
                  ctrl.loadingTrabajos = false;
                })
                .catch(function (error) {
                  
                  ctrl.errorCargando = true;
                  ctrl.loadingTrabajos = false;
                });
            } else {
              
              ctrl.mensajeErrorCargando = $translate.instant("PASANTIA.ERROR.DOCENTE_DIRECTOR_SIN_PASANTIAS");
              ctrl.errorCargando = true;
              ctrl.loadingTrabajos = false;
            }
          })
          .catch(function (error) {
            
            ctrl.mensajeErrorCargando = $translate.instant("PASANTIA.ERROR.CARGANDO_TRABAJOS_PASANTIA");
            ctrl.errorCargando = true;
            ctrl.loadingTrabajos = false;
          });
      }
      //Se cargan trabajos de grado de modalidad de pasantia
      ctrl.getTrabajosGradoPasantia(ctrl.userDocument);

      /**
       * @ngdoc method
       * @name cargarActa
       * @methodOf poluxClienteApp.controller:PasantiaActasSeguimientoCtrl
       * @param {undefined} Undefined No recibe ningun parametro
       * @returns {undefined} No retorna ningún valor
       * @description 
       * Permite guardar un acta de seguimiento, primero registra el documento en el servicio de {@link services/poluxClienteApp.service:nuxeoService nuxeo}
       * y si este se carga exitosamente entonces lo registra en el servicio de {@link services/poluxService.service:poluxRequest Polux} usando la transacción
       * 'tr_registrar_acta_seguimiento'.
       */
      ctrl.cargarActa = function () {
        ctrl.loadingDocumento = true;
        var nombreDoc = "Acta de seguimiento " + (ctrl.pasantiaSeleccionada.Actas.length + 1);
        //SE carga el documento a nuxeo
        //ctrl.cargarDocumento(nombreDoc, nombreDoc, ctrl.actaModel)
        nuxeoClient.createDocument(nombreDoc, nombreDoc, ctrl.actaModel, 'actas_seguimiento', undefined)
          .then(function (urlDocumento) {
            var dataDocumentoTrabajoGrado = {
              TrabajoGrado: {
                Id: ctrl.pasantiaSeleccionada.Id
              },
              DocumentoEscrito: {
                Titulo: nombreDoc,
                Enlace: urlDocumento,
                Resumen: nombreDoc,
                //Tipo de documento 2, que es el que corresponde a acta de seguimiento
                TipoDocumentoEscrito: 2
              }
            }
            poluxRequest.post("tr_registrar_acta_seguimiento", {
              Acta: dataDocumentoTrabajoGrado
            })
              .then(function (response) {
                if (response.data[0] === "Success") {
                  swal(
                    $translate.instant("PASANTIA.ACTA_REGISTRADA"),
                    $translate.instant("PASANTIA.ACTA_REGISTRADA_CORRECTAMENTE"),
                    'success'
                  );
                  ctrl.pasantiaSeleccionada.Actas.push(dataDocumentoTrabajoGrado);
                } else {
                  swal(
                    $translate.instant("ERROR.SUBIR_DOCUMENTO"),
                    $translate.instant("VERIFICAR_DOCUMENTO"),
                    'warning'
                  );
                }
                ctrl.loadingDocumento = false;
              })
              .catch(function (error) {
                
                swal(
                  $translate.instant("ERROR.SUBIR_DOCUMENTO"),
                  $translate.instant("VERIFICAR_DOCUMENTO"),
                  'warning'
                );
                ctrl.loadingDocumento = false;
              });
          })
          .catch(function (error) {
            swal(
              $translate.instant("ERROR.SUBIR_DOCUMENTO"),
              $translate.instant("VERIFICAR_DOCUMENTO"),
              'warning'
            );
            ctrl.loadingDocumento = false;
          });
      }

      /**
       * @ngdoc method
       * @name getDocumento
       * @methodOf poluxClienteApp.controller:PasantiaActasSeguimientoCtrl
       * @param {Number} docid Identificador del documento en {@link services/poluxClienteApp.service:nuxeoService nuxeo}
       * @returns {undefined} No retorna ningún valor
       * @description 
       * Llama a la función obtenerDoc y obtenerFetch para descargar un documento de nuxeo y msotrarlo en una nueva ventana.
       */
      ctrl.getDocumento = function (docid) {
        nuxeoClient.getDocument(docid)
          .then(function (document) {
            $window.open(document.url);
          })
          .catch(function (error) {
            
            swal(
              $translate.instant("MENSAJE_ERROR"),
              $translate.instant("ERROR.CARGAR_DOCUMENTO"),
              'warning'
            );
          });
      }

      /**
       * @ngdoc method
       * @name loadrow
       * @methodOf poluxClienteApp.controller:PasantiaActasSeguimientoCtrl
       * @description 
       * Ejecuta las funciones específicas de los botones seleccionados en el ui-grid
       * @param {object} row Fila seleccionada en la cuadrícula que contiene los detalles de la solicitud que se quiere consultar
       * @param {string} operacion Operación que se debe ejecutar cuando se selecciona el botón
       * @returns {undefined} No retorna ningún valor
       */
      $scope.loadrow = function (row, operacion) {
        if (operacion == "ver") {
          ctrl.pasantiaSeleccionada = row.entity.TrabajoGrado;
          $('#modalVerPasantia').modal('show');
        }
      };

    });