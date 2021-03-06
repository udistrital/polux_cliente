'use strict';

/**
 * @ngdoc controller
 * @name poluxClienteApp.controller:GeneralRegistrarNotaCtrl
 * @description
 * # GeneralRegistrarNotaCtrl
 * Controller of the poluxClienteApp
 * Controlador donde el docente puede registrar la nota de un trabajo de grado luego de que este ha sido sustentado.
 * @requires $scope
 * @requires $q
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires services/academicaService.service:academicaRequest
 * @requires services/poluxService.service:nuxeoClient
 * @requires services/poluxService.service:poluxRequest
 * @requires services/poluxClienteApp.service:tokenService
 * @property {String} documento Documento del docente que entra al modulo y que va a registrar las notas
 * @property {Boolean} cargandoTrabajos Bandera que muestra el loading y permite identificar cuando se cargaron todos los trabajos
 * @property {String} mensajeTrabajos Mensaje que se muestra mientras se cargan lso trabajos
 * @property {Boolean} cargandoTrabajo Bandera que muestra el loading y permite identificar cuando se cargo el trabajo en especifigo
 * @property {String} mensajeTrabajo Mensaje que se muestra mientras se carga un trabajo de grado
 * @property {Boolean} errorCargando Bandera que indica que ocurrió un error y permite mostrarlo
 * @property {Boolean} errorCargandoTrabajo Bandera que indica que ocurrió un error cargando un trabajo de grado especifico y permite mostrarlo
 * @property {String} mensajeError Mensaje que se muestra cuando ocurre un error
 * @property {String} mensajeErrorTrabajo Mensaje que se muestra cuando ocurre un error cargando un trabajo especifico
 * @property {String} mensajeRegistrandoNota Mensaje que se muestra mientras se registra una nota
 * @property {Object} gridOptions Opciones del ui-grid que muestra los trabajos de grado a los cuales se vincula el usuario
 * @property {Boolean} registrarNota Bandera que permite identificar la acción que se quiere realizar
 * @property {Object} trabajoSeleccionado Trabajo seleccionado en un ui-grid
 * @property {Object} trabajosGrado Objeto que carga la información de los trabajos de grado asociados
 * @property {Object} registrandoNotaTG Indicador que opera durante el registro de la nota hacia el trabajo de grado
 * @property {Array} botonesNota Colección que maneja la configuración de los botones para registrar la nota
 * @property {Array} botonesVer Colección que maneja la configuración de los botones para ver los detalles
 */
angular.module('poluxClienteApp')
  .controller('GeneralRegistrarNotaCtrl',
    function($scope, $q, $translate, academicaRequest, nuxeoClient, poluxRequest, token_service) {
      var ctrl = this;

      token_service.token.documento = "80093200";
      //token_service.token.documento = "79777053";
      //token_service.token.documento = "12237136";
      ctrl.documento = token_service.token.documento;

      ctrl.mensajeTrabajos = $translate.instant('LOADING.CARGANDO_TRABAJOS_DE_GRADO_ASOCIADOS');
      ctrl.mensajeTrabajo = $translate.instant('LOADING.CARGANDO_DATOS_TRABAJO_GRADO');
      ctrl.mensajeRegistrandoNota = $translate.instant('LOADING.REGISTRANDO_NOTA');
      ctrl.cargandoTrabajos = true;

      $scope.botonesNota = [{
        clase_color: "ver",
        clase_css: "fa fa-eye fa-lg  faa-shake animated-hover",
        titulo: $translate.instant('BTN.VER_DETALLES'),
        operacion: 'ver',
        estado: true
      }, {
        clase_color: "ver",
        clase_css: "fa fa-pencil-square-o fa-lg  faa-shake animated-hover",
        titulo: $translate.instant('BTN.REGISTRAR_NOTA'),
        operacion: 'registrarNota',
        estado: true
      }, ];

      $scope.botonesVer = [{
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
        name: 'TrabajoGrado.Titulo',
        displayName: $translate.instant('NOMBRE'),
        width: '35%',
      }, {
        name: 'TrabajoGrado.Modalidad.Nombre',
        displayName: $translate.instant('MODALIDAD'),
        width: '20%',
      }, {
        name: 'TrabajoGrado.EstadoTrabajoGrado.Nombre',
        displayName: $translate.instant('ESTADO'),
        width: '15%',
      }, {
        name: 'RolTrabajoGrado.Nombre',
        displayName: $translate.instant('TIPO_VINCULACION'),
        width: '15%',
      }, {
        name: 'Acciones',
        displayName: $translate.instant('ACCIONES'),
        width: '15%',
        type: 'boolean',
        cellTemplate: '<div ng-if="row.entity.permitirRegistrar">' +
          '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botonesNota" fila="row"></btn-registro>' +
          '</div>' +
          '<div ng-if="!row.entity.permitirRegistrar">' +
          '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botonesVer" fila="row"></btn-registro>' +
          '</div>'
      }];

      /**
       * @ngdoc method
       * @name cargarTrabajos
       * @methodOf poluxClienteApp.controller:GeneralRegistrarNotaCtrl
       * @description
       * Función que permite cargar los trabajos en los que el docente se encuentra actualmente activo.
       * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los datos de la base del aplicativo.
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} Retorna una promesa que se soluciona sin regresar ningún parametro
       */
      ctrl.cargarTrabajos = function() {
        var defer = $q.defer();
        ctrl.cargandoTrabajos = true;
        var parametrosTrabajoGrado = $.param({
          limit: 0,
          query: "Activo:True,Usuario:" + ctrl.documento,
        });
        poluxRequest.get("vinculacion_trabajo_grado", parametrosTrabajoGrado)
          .then(function(dataTrabajos) {
            if (dataTrabajos.data != null) {
              ctrl.trabajosGrado = dataTrabajos.data;
              //Se decide que trabajos puede ver y en cuales puede registrar nota
              angular.forEach(ctrl.trabajosGrado, function(trabajo) {
                //Por defecto de false
                trabajo.permitirRegistrar = false;
                //Si el rol es director
                var rol = trabajo.RolTrabajoGrado.Id;
                var modalidad = trabajo.TrabajoGrado.Modalidad.Id;
                /*if( rol === 1 ){
                  //Si la modalidad es pasantia o articulo se permite sino no
                  if( modalidad === 1 || modalidad === 8){
                    trabajo.permitirRegistrar = true;
                  } 
                }
                //Si el rol es evaluador puede registrar la nota sin importar la modalidad
                if( rol === 3 ){
                  trabajo.permitirRegistrar = true;
                }*/
                //Si el rol es evaluador o director puede registrar la nota sin importar la modalidad
                if (rol == 1 || rol == 3) {
                  trabajo.permitirRegistrar = true;
                }
                //Si es otro rol
                // codirector o externo
                /*if( rol === 4 || rol === 2){
                  //No se permite registrar
                }
                console.log(trabajo);*/
              });
              ctrl.gridOptions.data = ctrl.trabajosGrado;
              defer.resolve();
            } else {
              ctrl.mensajeError = $translate.instant('ERROR.SIN_TRABAJOS_ASOCIADOS');
              defer.reject("no hay trabajos de grado asociados");
            }
          })
          .catch(function(error) {
            ctrl.mensajeError = $translate.instant('ERROR.CARGANDO_TRABAJOS_DE_GRADO_ASOCIADOS');
            defer.reject(error);
          });
        return defer.promise;
      }

      ctrl.cargarTrabajos()
        .then(function() {
          ctrl.cargandoTrabajos = false;
        })
        .catch(function(error) {
          console.log(error);
          ctrl.errorCargando = true;
          ctrl.cargandoTrabajos = false;
        })

      /**
       * @ngdoc method
       * @name getEstudiante
       * @methodOf poluxClienteApp.controller:GeneralRegistrarNotaCtrl
       * @description
       * Función que permite cargar los datos básicos de un estudiante.
       * Consulta el servicio de {@link services/academicaService.service:academicaRequest academicaRequest} para traer la información académica.
       * @param {Object} estudiante Estudiante que se consulta
       * @returns {Promise} Retorna una promesa que se soluciona sin regresar ningún parametro.
       */
      ctrl.getEstudiante = function(estudiante) {
        var defer = $q.defer();
        //consultar datos básicos del estudiante
        academicaRequest.get("datos_basicos_estudiante", [estudiante.Estudiante])
          .then(function(responseDatosBasicos) {
            if (!angular.isUndefined(responseDatosBasicos.data.datosEstudianteCollection.datosBasicosEstudiante)) {
              estudiante.datos = responseDatosBasicos.data.datosEstudianteCollection.datosBasicosEstudiante[0];
              defer.resolve();
              //consultar nombre carrera
              /*academicaRequest.get("carrera",[estudiante.datos.carrera])
              .then(function(responseCarrera){
                estudiante.datos.proyecto = estudiante.datos.carrera + " - " + responseCarrera.data.carrerasCollection.carrera[0].nombre;
                defer.resolve();
              })
              .catch(function(error){
                defer.reject(error);
              });*/
            } else {
              defer.reject(error);
            }
          })
          .catch(function(error) {
            defer.reject(error);
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name getEstudiantes
       * @methodOf poluxClienteApp.controller:GeneralRegistrarNotaCtrl
       * @description
       * Función que permite cargar los estudiantes que realizan un trabajo de grado.
       * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los datos de la base del aplicativo.
       * @param {Object} trabajoGrado Trabajo de grado que se consulta
       * @returns {Promise} Retorna una promesa que se soluciona sin regresar ningún parametro.
       */
      ctrl.getEstudiantes = function(trabajoGrado) {
        var defer = $q.defer();
        //Se consultan los estudiantes activos en el trabajo de grado y sus datos
        var parametrosEstudiantes = $.param({
          limit: 0,
          query: "EstadoEstudianteTrabajoGrado.Id:1,TrabajoGrado.Id:" + trabajoGrado.Id,
        });
        poluxRequest.get("estudiante_trabajo_grado", parametrosEstudiantes)
          .then(function(responseEstudiantes) {
            if (responseEstudiantes.data != null) {
              trabajoGrado.estudiantes = responseEstudiantes.data;
              var promesasEstudiante = [];
              angular.forEach(trabajoGrado.estudiantes, function(estudiante) {
                promesasEstudiante.push(ctrl.getEstudiante(estudiante));
              });
              $q.all(promesasEstudiante)
                .then(function() {
                  defer.resolve();
                })
                .catch(function(error) {
                  defer.reject(error);
                });
            } else {
              defer.reject("Sin estudiantes");
            }
          })
          .catch(function(error) {
            defer.reject(error);
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name getEvaluacionesRegistradas
       * @methodOf poluxClienteApp.controller:GeneralRegistrarNotaCtrl
       * @description
       * Función que permite evaluar si el docente ya registró una nota para el trabajo seleccionado
       * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los datos de la base del aplicativo.
       * @param {Object} trabajoGrado Trabajo de grado que se consulta
       * @returns {Promise} Retorna una promesa que se soluciona sin regresar ningún parametro.
       */
      ctrl.getEvaluacionesRegistradas = function(trabajoGrado) {
        var defer = $q.defer();
        //Se consulatan las evaluaciones
        var parametrosEvaluaciones = $.param({
          limit: 1,
          query: "VinculacionTrabajoGrado:" + trabajoGrado.vinculacion.Id,
        });
        poluxRequest.get("evaluacion_trabajo_grado", parametrosEvaluaciones)
          .then(function(responseEvaluacion) {
            if (responseEvaluacion.data != null) {
              //Si no ha registrado ninguna nota
              trabajoGrado.notaRegistrada = true;
              trabajoGrado.evaluacion = responseEvaluacion.data[0];
            } else {
              //Si ya registro la nota
              trabajoGrado.notaRegistrada = false;
            }
            defer.resolve();
          })
          .catch(function(error) {
            defer.reject(error);
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name cargarTrabajo
       * @methodOf poluxClienteApp.controller:GeneralRegistrarNotaCtrl
       * @description
       * Función que permite cargar los datos de un trabajo de grado específico
       * @param {Object} fila Fila que se selecciona
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.cargarTrabajo = function(fila) {
        ctrl.cargandoTrabajo = true;
        ctrl.trabajoSeleccionado = fila.entity.TrabajoGrado;
        //Se guarda la vinculación al tg
        ctrl.trabajoSeleccionado.vinculacion = {
          Id: fila.entity.Id,
          Usuario: fila.entity.Usuario,
          TrabajoGrado: {
            Id: fila.entity.TrabajoGrado.Id,
          },
          RolTrabajoGrado: fila.entity.RolTrabajoGrado,
        };
        //Se verifica que el estado del trabajo de grado sea listo para sustentar 17 o sustentado 18
        if (ctrl.trabajoSeleccionado.EstadoTrabajoGrado.Id === 17 || ctrl.trabajoSeleccionado.EstadoTrabajoGrado.Id === 18) {
          ctrl.trabajoSeleccionado.estadoValido = true;
        }
        //Se verifica si se tiene que pedir acta segun el tipo de vinculación, solo se pide si es el director
        ctrl.trabajoSeleccionado.pedirActaSustentacion = (ctrl.trabajoSeleccionado.vinculacion.RolTrabajoGrado.Id === 1);
        //console.log(ctrl.registrarNota);
        //console.log(ctrl.trabajoSeleccionado);
        //Promesas del tg
        var promesasTrabajo = [];
        promesasTrabajo.push(ctrl.getEstudiantes(ctrl.trabajoSeleccionado));
        promesasTrabajo.push(ctrl.getEvaluacionesRegistradas(ctrl.trabajoSeleccionado));
        //Se muestra el modal
        $('#modalRegistrarNota').modal('show');
        $q.all(promesasTrabajo)
          .then(function() {
            ctrl.cargandoTrabajo = false;
            console.log(ctrl.trabajoSeleccionado);
          })
          .catch(function(error) {
            console.log(error);
            ctrl.mensajeErrorTrabajo = $translate.instant('ERROR.CARGAR_TRABAJO_GRADO');
            ctrl.errorCargandoTrabajo = true;
            ctrl.cargandoTrabajo = false;
          });
      }

      /**
       * @ngdoc method
       * @name registrarNota
       * @methodOf poluxClienteApp.controller:GeneralRegistrarNotaCtrl
       * @description
       * Función que permite guardar la nota que se registra en un trabajo de grado, guarda el acta de sustentación y la asocia a un documento escrito.
       * Efectúa el servicio de {@link services/poluxService.service:nuxeoClient nuxeoClient} para hacer gestión documental.
       * @param {undefined} undefined No recibe ningún parametro
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.registrarNotaTG = function() {

        var crearData = function() {
          var defer = $q.defer()
          //Se crea la data para la transacción
          var dataRegistrarNota = {
            TrabajoGrado: ctrl.trabajoSeleccionado,
            DocumentoEscrito: null,
            VinculacionTrabajoGrado: ctrl.trabajoSeleccionado.vinculacion,
            EvaluacionTrabajoGrado: {
              Id: 0,
              Nota: ctrl.trabajoSeleccionado.nota,
              VinculacionTrabajoGrado: ctrl.trabajoSeleccionado.vinculacion,
            }
          }
          //Si es director se debe subir el acta
          if (ctrl.trabajoSeleccionado.vinculacion.RolTrabajoGrado.Id === 1) {
            var nombreDocumento = "Acta de sustentación de trabajo id: " + ctrl.trabajoSeleccionado.Id;
            var descripcionDocumento = "Acta de sustentación de el trabajo con id: " + ctrl.trabajoSeleccionado.Id + ", nombre:" + ctrl.trabajoSeleccionado.Titulo + ".";
            //Se carga el documento
            nuxeoClient.createDocument(nombreDocumento, descripcionDocumento, ctrl.trabajoSeleccionado.actaSustentacion, 'Actas de sustentacion', undefined)
              .then(function(urlActa) {
                console.log("acta", urlActa);
                console.log("nota", ctrl.trabajoSeleccionado.nota);
                console.log("trabajo", ctrl.trabajoSeleccionado);
                dataRegistrarNota.DocumentoEscrito = {
                  Id: 0,
                  Titulo: nombreDocumento,
                  Resumen: descripcionDocumento,
                  Enlace: urlActa,
                  TipoDocumentoEscrito: 6, //Para acta de sustentación
                };
                defer.resolve(dataRegistrarNota);
              })
              .catch(function(error) {
                defer.reject(error);
              });

          } else if (ctrl.trabajoSeleccionado.vinculacion.RolTrabajoGrado.Id === 3) {
            //Si no es director se registra la nota
            defer.resolve(dataRegistrarNota);
          }
          return defer.promise;
        }
        ctrl.registrandoNotaTG = true;
        crearData()
          .then(function(dataRegistrarNota) {
            //Se ejecuta la transacción
            poluxRequest.post("tr_vinculado_registrar_nota", dataRegistrarNota).then(function(response) {
                console.log(response);
                if (response.data[0] === "Success") {
                  swal(
                    $translate.instant("REGISTRAR_NOTA.AVISO"),
                    $translate.instant("REGISTRAR_NOTA.NOTA_REGISTRADA"),
                    'success'
                  );
                  $('#modalRegistrarNota').modal('hide');
                  ctrl.registrandoNotaTG = false;
                  ctrl.cargarTrabajos()
                    .then(function() {
                      ctrl.cargandoTrabajos = false;
                    })
                    .catch(function(error) {
                      console.log(error);
                      ctrl.errorCargando = true;
                      ctrl.cargandoTrabajos = false;
                    })
                } else {
                  swal(
                    $translate.instant("REGISTRAR_NOTA.AVISO"),
                    $translate.instant(response.data[1]),
                    'warning'
                  );
                }
                ctrl.registrandoNotaTG = false;
              })
              .catch(function(error) {
                console.log(error);
                swal(
                  $translate.instant("REGISTRAR_NOTA.AVISO"),
                  $translate.instant("REGISTRAR_NOTA.ERROR.REGISTRANDO_NOTA"),
                  'warning'
                );
                ctrl.registrandoNotaTG = false;
              });
          })
          .catch(function(error) {
            console.log(error);
            ctrl.registrandoNotaTG = false;
            swal(
              $translate.instant("ERROR.SUBIR_DOCUMENTO"),
              $translate.instant("VERIFICAR_DOCUMENTO"),
              'warning'
            );
          });
      }

      /**
       * @ngdoc method
       * @name loadrow
       * @methodOf poluxClienteApp.controller:GeneralRegistrarNotaCtrl
       * @description 
       * Ejecuta las funciones especificas de los botones seleccionados en el ui-grid decidiendo si se opera el registro de la nota.
       * @param {Object} row Fila seleccionada en el uigrid que contiene los detalles de la solicitud que se quiere consultar
       * @param {String} operacion Operación que se debe ejecutar cuando se selecciona el botón
       * @returns {undefined} No hace retorno de resultados
       */
      $scope.loadrow = function(row, operacion) {
        switch (operacion) {
          case "ver":
            ctrl.registrarNota = false;
            ctrl.cargarTrabajo(row)
            //$('#modalVerSolicitud').modal('show');
            break;
          case "registrarNota":
            ctrl.registrarNota = true;
            ctrl.cargarTrabajo(row);
            //ctrl.cargarDetalles(row)
            //$('#modalVerSolicitud').modal('show');
            break;
          default:
            break;
        }
      };


    });