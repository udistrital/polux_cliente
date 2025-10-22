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
 * @requires services/poluxService.service:poluxRequest
 * @requires services/poluxClienteApp.service:tokenService
 * @requires services/poluxService.service:gestorDocumentalMidService
 * @requires services/poluxService.service:documentoService
 * @requires services/poluxService.service:parametrosService
 * @requires services/poluxMidService.service:poluxMidRequest
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
 * @property {Object} docTrabajoGrado Enlace del documento de trabajo de grado
 * @property {Array} anexosTrabajoGrado Enlaces de los anexos de trabajo de grado
 * @property {Object} trabajosGrado Objeto que carga la información de los trabajos de grado asociados
 * @property {Object} registrandoNotaTG Indicador que opera durante el registro de la nota hacia el trabajo de grado
 * @property {Array} botonesNota Colección que maneja la configuración de los botones para registrar la nota
 * @property {Array} botonesVer Colección que maneja la configuración de los botones para ver los detalles
 * @property {Array} botonesDevolver Colección de la configuración del botón para devolver el trabajo de grado
 * @property {String} observaciones Cambios solicitados por el revisor
 */
angular.module('poluxClienteApp')
  .controller('GeneralRegistrarNotaCtrl',
    function($scope, $q, $translate,notificacionRequest, academicaRequest,utils,gestorDocumentalMidRequest, $window ,poluxRequest, token_service, documentoRequest, parametrosRequest, poluxMidRequest,autenticacionMidRequest) {
      var ctrl = this;
      $scope.roles= token_service.getAppPayload().role;
      //token_service.token.documento = "80093200";
      //token_service.token.documento = "79777053";
      //token_service.token.documento = "12237136";
      //ctrl.documento = token_service.token.documento;

      ctrl.documento = token_service.getAppPayload().appUserDocument;

      if($scope.roles.includes('COORDINADOR')){
        ctrl.isCoordinador = true
      } else {
        ctrl.isCoordinador = false
      }

      ctrl.mensajeTrabajos = $translate.instant('LOADING.CARGANDO_TRABAJOS_DE_GRADO_ASOCIADOS');
      ctrl.mensajeTrabajo = $translate.instant('LOADING.CARGANDO_DATOS_TRABAJO_GRADO');
      ctrl.mensajeRegistrandoNota = $translate.instant('LOADING.REGISTRANDO_NOTA');
      ctrl.cargandoTrabajos = true;

      var Atributos={
        rol:'ESTUDIANTE',
    }
    notificacionRequest.enviarCorreo('Mensaje de registro de nota de TRABAJO DE GRADO Prueba funcional notificaciones',Atributos,['101850341'],'','','Se ha registrado la nota de parte de '+token_service.getAppPayload().email+' para el trabajo de grado asociado. .Cuando se desee observar el msj se puede copiar el siguiente link para acceder https://polux.portaloas.udistrital.edu.co/');              

      $scope.botonesNota = [{
        clase_color: "ver",
        clase_css: "fa fa-pencil-square-o fa-lg  faa-shake animated-hover",
        titulo: $translate.instant('BTN.REGISTRAR_NOTA'),
        operacion: 'registrarNota',
        estado: true
      }, ];

      $scope.botonesDevolver = [{
        clase_color: "ver",
        clase_css: "fa fa-ban fa-lg  faa-shake animated-hover",
        titulo: $translate.instant('BTN.DEVOLVER'),
        operacion: 'devolver',
        estado: true
      },];

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
        width: '25%',
      }, {
        name: 'Estudiante',
        displayName: $translate.instant('CODIGO_ESTUDIANTE'),
        width: '15%',
      }, {
        name: 'TrabajoGrado.Modalidad.Nombre',
        displayName: $translate.instant('MODALIDAD'),
        width: '20%',
      }, {
        name: 'TrabajoGrado.EstadoTrabajoGrado.Nombre',
        displayName: $translate.instant('ESTADO'),
        width: '20%',
      }, {
        name: 'RolTrabajoGrado.Nombre',
        displayName: $translate.instant('TIPO_VINCULACION'),
        width: '10%',
      }, {
        name: 'Acciones',
        displayName: $translate.instant('ACCIONES'),
        width: '10%',
        type: 'boolean',
        cellTemplate: `
          <div>
            <btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botonesVer" fila="row"></btn-registro>
            <btn-registro ng-if="row.entity.permitirRegistrar" funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botonesNota" fila="row"></btn-registro>
            <btn-registro ng-if="row.entity.permitirDevolver" funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botonesDevolver" fila="row"></btn-registro>
          </div>`
      }];

            /**
       * @ngdoc method
       * @name verificarArchivo
       * @methodOf poluxClienteApp.controller:GeneralRegistrarNotaCtrl
       * @description 
       * Consulta la función general de utils para verificar si el archivo contiene virus
       * @param {any} input El campo input file del formulario
       */
      $scope.verificarArchivo = async function (input) {
        var file = input.files[0];
        if (!file) return;

        var esPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
        if (!esPDF) {
          swal(
              $translate.instant("VALIDACION_ARCHIVO.TITULO_ARCHIVO_PDF"),
              $translate.instant("VALIDACION_ARCHIVO.ARCHIVO_PDF"),
              "error"
            );
          input.value = "";
          $scope.$applyAsync(() => { input.value = null; });
          return;
        }

        var resultado = await utils.verificarArchivoGeneral(input);
        if (!resultado.limpio) {
            input.value = "";
            $scope.$applyAsync(() => { input.value = null; });
        }
      };

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
            query: "DominioTipoDocumento__CodigoAbreviacion:DOC_PLX",
            limit: 0,
          });

          await documentoRequest.get("tipo_documento", parametrosConsulta).then(function (responseTiposDocumento){
            ctrl.TiposDocumento = responseTiposDocumento.data;
          });

          parametrosConsulta = $.param({
            query: "TipoParametroId__CodigoAbreviacion:MOD_TRG",
            limit: 0,
          });

          await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (responseModalidades){
            ctrl.Modalidades = responseModalidades.data.Data;
          });

          parametrosConsulta = $.param({
            query: "TipoParametroId__CodigoAbreviacion:EST_TRG",
            limit: 0,
          });

          await parametrosRequest.get("parametro/?", parametrosConsulta).then(function (responseEstadosTrabajoGrado){
            ctrl.EstadosTrabajoGrado = responseEstadosTrabajoGrado.data.Data;
          });

          parametrosConsulta = $.param({
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

          resolve();
        });
      }

      
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
      ctrl.cargarTrabajos = async function() {
        await getconsultarParametros();
        var defer = $q.defer();
        ctrl.cargandoTrabajos = true;

        var parametrosTrabajoGrado;
        var proyectos = "";

        //Si es Contratista traer los proyectos curriculares a cargo y enviarlos como parámetro
        if($scope.roles.includes('CONTRATISTA')) {
          //Consulta para traer todos los proyectos curriculares del Contratista
          await academicaRequest.get("asistente_proyecto", [ctrl.documento]).then(function(responseAsistente) {
            if (Object.keys(responseAsistente.data.asistente.proyectos).length > 0) {
              angular.forEach(responseAsistente.data.asistente.proyectos, function(carrera) {
                //Concatenar los proyectos curriculares de la consulta en un solo string
                proyectos += carrera.proyecto + ",";
              });
                //Eliminar la última coma
                proyectos = proyectos.slice(0, -1);
            }
          }).catch(function(error) {
            ctrl.mensajeError = 'ERROR CARGANDO PROYECTOS CURRICULARES';
            defer.reject(error);
          });

          parametrosTrabajoGrado = $.param({
            proyectos: proyectos,
          });
        } else {
          parametrosTrabajoGrado = $.param({
            usuario: ctrl.documento,
          });
        }

        console.log("parametrosTrabajoGrado", parametrosTrabajoGrado);

        poluxRequest.get("estudiante_vinculacion_trabajo_grado", parametrosTrabajoGrado)
          .then(function(dataTrabajos) {
            if (Object.keys(dataTrabajos.data.Data[0]).length > 0) {
              ctrl.trabajosGrado = dataTrabajos.data.Data;
              var trabajosPosgrado = []
              // Se decide qué trabajos puede ver y en cuales puede registrar nota
              angular.forEach(ctrl.trabajosGrado, function(trabajo) {
                let ModalidadTemp = ctrl.Modalidades.find(data => {
                  return data.Id == trabajo.TrabajoGrado.Modalidad;
                });
                trabajo.TrabajoGrado.Modalidad = ModalidadTemp;
                //console.log("Modalidad", ModalidadTemp);

                let EstadoTrabajoGradoTemp = ctrl.EstadosTrabajoGrado.find(data => {
                  return data.Id == trabajo.TrabajoGrado.EstadoTrabajoGrado;
                });
                trabajo.TrabajoGrado.EstadoTrabajoGrado = EstadoTrabajoGradoTemp;

                let RolTrabajoGradoTemp = ctrl.RolesTrabajoGrado.find(data => {
                  return data.Id == trabajo.RolTrabajoGrado;
                });
                trabajo.RolTrabajoGrado = RolTrabajoGradoTemp;

                // Si el rol es director o evaluador
                // Por ahora se ignora la modalidad
                trabajo.permitirRegistrar = false;
                trabajo.permitirDevolver = false;
                var rol = trabajo.RolTrabajoGrado.CodigoAbreviacion;
                var estado = trabajo.TrabajoGrado.EstadoTrabajoGrado.CodigoAbreviacion;
                if (rol == "EVALUADOR_PLX") {
                  trabajo.permitirDevolver = estado == "RDE_PLX";
                  if (estado == "RDE_PLX" || estado == "EC_PLX") {
                    trabajo.permitirRegistrar = true;
                  }
                } else if (estado == "STN_PLX" && rol.includes("DIRECTOR_PLX") && !rol.includes("CODIRECTOR_PLX")) {
                  trabajo.permitirRegistrar = true;
                } else if (estado == "LPS_PLX" && rol.includes("DIRECTOR_PLX") && !rol.includes("CODIRECTOR_PLX")) {
                  trabajo.permitirRegistrar = true;
                } else if (rol.includes("COR_POSGRADO_PLX")){
                  if(estado == "EC_PLX"){
                    trabajo.permitirRegistrar = true;
                    trabajosPosgrado.push(trabajo)
                  } 
                }
                // var modalidad = trabajo.TrabajoGrado.Modalidad.Id; ***Aún no se usa esta variable
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
                // if (rol == 1 || rol == 3) {
                //   trabajo.permitirRegistrar = true;
                // }
                //Si es otro rol
                // codirector o externo
                /*if( rol === 4 || rol === 2){
                  //No se permite registrar
                }
                */
              });
              
              //si el rol del usuario el coordinador
              if($scope.roles.includes('COORDINADOR')){
                //si no se han encontrado trabajos asociados
                if (trabajosPosgrado.length <= 0){
                  //se muestra el mensaje de error
                  ctrl.mensajeError = $translate.instant('ERROR.SIN_TRABAJOS_ASOCIADOS');
                  defer.reject("no hay trabajos de grado asociados");
                } else {
                  //si encontro trabajos, entonces los lista
                  ctrl.trabajosGrado = trabajosPosgrado
                }
              } 
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
                if (!angular.isUndefined(responseCarrera.carrerasCollection.carrera[0].nombre)) {
                  estudiante.datos.proyecto = estudiante.datos.carrera + " - " + responseCarrera.data.carrerasCollection.carrera[0].nombre;
                  defer.resolve();
                } else {
                  defer.reject("Error consultando la carrera");
                }
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
        let EstadoEstudianteTrabajoGradoTemp = ctrl.EstadosEstudianteTrabajoGrado.find(data => {
          return data.CodigoAbreviacion == "EST_ACT_PLX";
        });
        var parametrosEstudiantes = $.param({
          limit: 0,
          query: "EstadoEstudianteTrabajoGrado:" + EstadoEstudianteTrabajoGradoTemp.Id + ",TrabajoGrado.Id:" + trabajoGrado.Id,
        });
        poluxRequest.get("estudiante_trabajo_grado", parametrosEstudiantes)
          .then(function(responseEstudiantes) {
            if (Object.keys(responseEstudiantes.data.Data[0]).length > 0) {
              trabajoGrado.estudiantes = responseEstudiantes.data.Data;
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
            if (Object.keys(responseEvaluacion.data.Data[0]).length > 0) {
              //Si no ha registrado ninguna nota
              trabajoGrado.notaRegistrada = true;
              trabajoGrado.evaluacion = responseEvaluacion.data.Data[0];
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
       * @name getDocumento
       * @methodOf poluxClienteApp.controller:GeneralRegistrarNotaCtrl
       * @param {number} docid Identificador del documento en {@link services/poluxService.service:gestorDocumentalMidService gestorDocumentalMidRequest}
       * @returns {undefined} No retorna ningún valor
       * @description 
       * Se obtiene el documento alojado en el gestor documental para mostrarse en una nueva ventana.
       */
    ctrl.getDocumento = function() {
        // Muestra de documento con gestor documental
      gestorDocumentalMidRequest.get('/document/' + ctrl.docTrabajoGrado.DocumentoEscrito.Enlace).then(function (response) {
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
       * @name getDocAnyFormat
       * @methodOf poluxClienteApp.controller:GeneralRegistrarNotaCtrl
       * @param {number} docid Id del documento en {@link services/poluxClienteApp.service:gestorDocumentalMidService gestorDocumentalMidService}
       * @returns {undefined} No retorna ningún valor
       * @description 
       * Llama a la función obtenerDoc y obtenerFetch para descargar un archivo con cualquier extensión.
       */
      ctrl.getDocAnyFormat = function (docid) {
        gestorDocumentalMidRequest.get('/document/' + docid).then(function (response) {
          console.log("Response GET", response);
          var file = new Blob([utils.base64ToArrayBuffer(response.data.file)]);
          var fileURL = URL.createObjectURL(file);
          
          var a = document.createElement('a');
          a.href = fileURL;
          a.download = response.data["dc:title"]; // Nombre del archivo a descargar
          document.body.appendChild(a);
          a.click();
          
          // Limpieza
          setTimeout(function() {
            document.body.removeChild(a);
            URL.revokeObjectURL(fileURL);
          }, 100);
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
       * @name obtenerParametrosDocumentoTrabajoGrado
       * @methodOf poluxClienteApp.controller:GeneralRegistrarNotaCtrl
       * @description
       * Función que define los parámetros para consultar en la tabla documento_trabajo_grado.
       * @param {Number} idTrabajoGrado El identificador del trabajo de grado a consultar
       * @returns {String} La sentencia para la consulta correspondiente
       */
      ctrl.obtenerParametrosDocumentoTrabajoGrado = function(idTrabajoGrado, tipoDocumentoId, limit) {
        return $.param({
          query: "DocumentoEscrito.TipoDocumentoEscrito:" + tipoDocumentoId + "," + "TrabajoGrado.Id:" + idTrabajoGrado + ",Activo:true",
          sortby: 'id',  // Ordenar por id
          order: 'desc', // Orden descendente
          limit: limit // Ajusta el límite según el código de abreviación
        });
      }

      /**
      * @ngdoc method
      * @name consultarDocTrabajoGrado
      * @methodOf poluxClienteApp.controller:GeneralRegistrarNotaCtrl
      * @description
      * Función que recorre la base de datos de acuerdo al trabajo de grado vinculado y trae el documento asociado.
      * Llama a la función: obtenerParametrosDocumentoTrabajoGrado.
      * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para operar sobre la base de datos del proyecto.
      * @param {Object} vinculacionTrabajoGrado La vinculación hacia el trabajo de grado seleccionado
      * @returns {Promise} La información sobre el documento, el mensaje en caso de no corresponder la información, o la excepción generada
      */
      ctrl.consultarDocTrabajoGrado = function(vinculacionTrabajoGrado) {
        var deferred = $q.defer();

        // Filtrar el tipo de documento con el código de abreviación "DGRREV_PLX"
        // DGRREV_PLX: Documentos de grado revision
        let tipoDocumentoDGRREV = ctrl.TiposDocumento.find(data => data.CodigoAbreviacion === "DGRREV_PLX");

        // Consultar el documento con el limit 1
        poluxRequest.get("documento_trabajo_grado", ctrl.obtenerParametrosDocumentoTrabajoGrado(vinculacionTrabajoGrado.TrabajoGrado.Id, tipoDocumentoDGRREV.Id, 1))
        .then(function(respuestaDocumento) {
          if (Object.keys(respuestaDocumento.data.Data[0]).length > 0) {
            deferred.resolve(respuestaDocumento.data.Data[0]); // Devuelve el documento
          } else {
            deferred.reject($translate.instant("ERROR.SIN_TRABAJO_GRADO"));
          }
        })
        .catch(function(excepcionDocumento) {
          deferred.reject($translate.instant("ERROR.CARGANDO_TRABAJO_GRADO"));
        });

        return deferred.promise;
      }

      /**
      * @ngdoc method
      * @name consultarAnexosTrabajoGrado
      * @methodOf poluxClienteApp.controller:GeneralRegistrarNotaCtrl
      * @description
      * Función que consulta los documentos con el código de abreviación "ANX_PLX" (Anexos).
      * @param {Object} vinculacionTrabajoGrado La vinculación hacia el trabajo de grado seleccionado
      * @returns {Promise} La información sobre los anexos, el mensaje en caso de no corresponder la información, o la excepción generada
      */
      ctrl.consultarAnexosTrabajoGrado = function(vinculacionTrabajoGrado) {
        var deferred = $q.defer();
        
        // Filtrar el tipo de documento con el código de abreviación "ANX_PLX"
        // ANX_PLX: Anexos
        let tipoDocumentoANX = ctrl.TiposDocumento.find(data => data.CodigoAbreviacion === "ANX_PLX");

        // Consultar el documento con el limit 3
        poluxRequest.get("documento_trabajo_grado", ctrl.obtenerParametrosDocumentoTrabajoGrado(vinculacionTrabajoGrado.TrabajoGrado.Id, tipoDocumentoANX.Id, 3))
        .then(function(respuestaDocumento) {
          if (respuestaDocumento.data.Success && respuestaDocumento.data.Data.length > 0) {
            deferred.resolve(respuestaDocumento.data.Data); // Devuelve los anexos
          } else {
            deferred.reject($translate.instant("ERROR.SIN_TRABAJO_GRADO"));
          }
        })
        .catch(function(excepcionDocumento) {
          deferred.reject($translate.instant("ERROR.CARGANDO_TRABAJO_GRADO"));
        });

        return deferred.promise;
      };

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
        ctrl.consultarDocTrabajoGrado(fila.entity).then(function(resultadoDocTrabajoGrado) {
          ctrl.docTrabajoGrado = resultadoDocTrabajoGrado;
        })

        ctrl.consultarAnexosTrabajoGrado(fila.entity).then(function(resultadoAnexosTrabajoGrado) {
          ctrl.anexosTrabajoGrado = resultadoAnexosTrabajoGrado;
        })

        //Se guarda la vinculación al tg
        ctrl.trabajoSeleccionado.vinculacion = {
          Id: fila.entity.Id,
          Usuario: fila.entity.Usuario,
          TrabajoGrado: {
            Id: fila.entity.TrabajoGrado.Id,
          },
          RolTrabajoGrado: fila.entity.RolTrabajoGrado,
        };

        let RolTrabajoGradoTemp = ctrl.RolesTrabajoGrado.find(data => {
          return data.Id == ctrl.trabajoSeleccionado.vinculacion.RolTrabajoGrado.Id;
        });

        console.log("ROL TRABAJO Grado", RolTrabajoGradoTemp.CodigoAbreviacion);

        //Se verifica si se tiene que pedir acta segun el tipo de vinculación, solo se pide si es el director
        ctrl.trabajoSeleccionado.pedirActaSustentacion = (RolTrabajoGradoTemp.CodigoAbreviacion == "DIRECTOR_PLX");
        //Se verifica si se tiene que pedir reporte de notas de modalidad de posgrado segun el tipo de vinculación, para este caso si el rol es coordinador
        ctrl.trabajoSeleccionado.pedirReporteNotasPosgrado = (RolTrabajoGradoTemp.CodigoAbreviacion == "COR_POSGRADO_PLX");
        //Promesas del tg
        var promesasTrabajo = [];
        promesasTrabajo.push(ctrl.getEstudiantes(ctrl.trabajoSeleccionado));
        promesasTrabajo.push(ctrl.getEvaluacionesRegistradas(ctrl.trabajoSeleccionado));
        //Se muestra el modal
        $('#modalRegistrarNota').modal('show');
        $q.all(promesasTrabajo)
          .then(function() {
            ctrl.cargandoTrabajo = false;
          })
          .catch(function(error) {

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
       * Efectúa el servicio de {@link services/poluxService.service:gestorDocumentalMidService gestorDocumentalMidRequest} para hacer gestión documental.
       * @param {undefined} undefined No recibe ningún parametro
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.registrarNotaTG = function () {

        var crearData = function () {
          var defer = $q.defer()

          let ModalidadTemp = ctrl.Modalidades.find(dataModalidad => {
            return dataModalidad.Id == ctrl.trabajoSeleccionado.Modalidad.Id;
          });

          ctrl.trabajoSeleccionado.Modalidad = ModalidadTemp.Id;

          let EstadoTrabajoGradoTemp = ctrl.EstadosTrabajoGrado.find(dataEstados => {
            return dataEstados.Id == ctrl.trabajoSeleccionado.EstadoTrabajoGrado.Id;
          });

          ctrl.trabajoSeleccionado.EstadoTrabajoGrado = EstadoTrabajoGradoTemp.Id;

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
          let RolTrabajoGradoTemp = ctrl.RolesTrabajoGrado.find(dataRol => {
            return dataRol.Id == ctrl.trabajoSeleccionado.vinculacion.RolTrabajoGrado.Id;
          });
          if (RolTrabajoGradoTemp.CodigoAbreviacion == "DIRECTOR_PLX") {
            var nombreDocumento = "Acta de sustentación de trabajo id: " + ctrl.trabajoSeleccionado.Id;
            var descripcionDocumento = "Acta de sustentación de el trabajo con id: " + ctrl.trabajoSeleccionado.Id + ", nombre:" + ctrl.trabajoSeleccionado.Titulo + ".";
            //Se carga el documento
            // Se carga el documento por medio del gestor documental
            var descripcion;
            var fileBase64;
            var data = [];
            var URL = "";
            descripcion = descripcionDocumento;
            utils.getBase64(ctrl.trabajoSeleccionado.actaSustentacion).then(function (base64) {
              fileBase64 = base64;
              let TipoDocumentoTemp = ctrl.TiposDocumento.find(dataTipoDoc => {
                return dataTipoDoc.CodigoAbreviacion == "ACT_PLX";
              });
              data = [{
                IdTipoDocumento: TipoDocumentoTemp.Id, //id tipo documento de documentos_crud
                nombre: nombreDocumento,// nombre formado por el acta del trabajo y el id de trabajo

                metadatos: {
                  NombreArchivo: nombreDocumento,
                  Tipo: "Archivo",
                  Observaciones: "actas_sustentacion"
                },
                descripcion: descripcion,
                file: fileBase64,
              }]

              gestorDocumentalMidRequest.post('/document/upload', data).then(function (response) {
                URL = response.data.res.Enlace
                dataRegistrarNota.DocumentoEscrito = {
                  Id: 0,
                  Titulo: nombreDocumento,
                  Resumen: descripcionDocumento,
                  Enlace: URL,
                  TipoDocumentoEscrito: TipoDocumentoTemp.Id, //Para acta de sustentación
                };
                defer.resolve(dataRegistrarNota);
                
              })

            })
              .catch(function (error) {
                defer.reject(error);
              });

          } else if (RolTrabajoGradoTemp.CodigoAbreviacion == "COR_POSGRADO_PLX") {
            var nombreDocumento = "Reporte de Notas: " + ctrl.trabajoSeleccionado.Id;
            var descripcionDocumento = "Reporte de notas de modalidad de espacios académicos de posgrado: " + ctrl.trabajoSeleccionado.Id + ", nombre:" + ctrl.trabajoSeleccionado.Titulo + ".";
            //Se carga el documento
            // Se carga el documento por medio del gestor documental
            var descripcion;
            var fileBase64;
            var data = [];
            var URL = "";
            descripcion = descripcionDocumento;
            utils.getBase64(ctrl.trabajoSeleccionado.reporteNotasPosgrado).then(function (base64) {
              fileBase64 = base64;
              let TipoDocumentoTemp = ctrl.TiposDocumento.find(dataTipoDoc => {
                return dataTipoDoc.CodigoAbreviacion == "RNP_PLX";
              });
              data = [{
                IdTipoDocumento: TipoDocumentoTemp.Id, //id tipo documento de documentos_crud
                nombre: nombreDocumento,// nombre formado por el acta del trabajo y el id de trabajo

                metadatos: {
                  NombreArchivo: nombreDocumento,
                  Tipo: "Archivo",
                  Observaciones: "reporte_notas_posgrado"
                },
                descripcion: descripcion,
                file: fileBase64,
              }]

              gestorDocumentalMidRequest.post('/document/upload', data).then(function (response) {
                URL = response.data.res.Enlace
                dataRegistrarNota.DocumentoEscrito = {
                  Id: 0,
                  Titulo: nombreDocumento,
                  Resumen: descripcionDocumento,
                  Enlace: URL,
                  TipoDocumentoEscrito: TipoDocumentoTemp.Id, //Para acta de sustentación
                };
                defer.resolve(dataRegistrarNota);
                
              })

            })
              .catch(function (error) {
                defer.reject(error);
              });         

          } else if (RolTrabajoGradoTemp.CodigoAbreviacion == "EVALUADOR_PLX" || RolTrabajoGradoTemp.CodigoAbreviacion == "COR_POSGRADO_PLX") {
            //Si no es director se registra la nota
            defer.resolve(dataRegistrarNota);
          } 

          let RolTemp = ctrl.RolesTrabajoGrado.find(dataRol => {
            return dataRol.Id == dataRegistrarNota.EvaluacionTrabajoGrado.VinculacionTrabajoGrado.RolTrabajoGrado.Id;
          });

          dataRegistrarNota.EvaluacionTrabajoGrado.VinculacionTrabajoGrado.RolTrabajoGrado = RolTemp.Id;
          dataRegistrarNota.VinculacionTrabajoGrado.RolTrabajoGrado = RolTemp.Id;

          return defer.promise;
        }
        ctrl.registrandoNotaTG = true;
        crearData()
          .then(function (dataRegistrarNota) {
            swal({
              title: $translate.instant("REGISTRAR_NOTA.CONFIRMAR_NOTA",{
                nota: ctrl.trabajoSeleccionado.nota
              }),
              type: "info",
              confirmButtonText: $translate.instant("ACEPTAR"),
              cancelButtonText: $translate.instant("CANCELAR"),
              showCancelButton: true
            }).then(function (confirmacionDocente) {
              if (confirmacionDocente) {
                //Se ejecuta la transacción
                poluxMidRequest.post("tr_vinculado_registrar_nota", dataRegistrarNota).then(async function (response) {
                  if (response.data.Success) {

                    var CodigoAbreviacionRol, Modalidad, RolDirectorTemp, correos = []

                    angular.forEach(ctrl.RolesTrabajoGrado, function (rol) {
                      if (rol.Id == ctrl.trabajoSeleccionado.vinculacion.RolTrabajoGrado) {
                        CodigoAbreviacionRol = rol.CodigoAbreviacion
                      }
                    })

                    //se busca el nombre de la modalidad
                    angular.forEach(ctrl.Modalidades, function (modalidad) {
                      if (modalidad.Id == ctrl.trabajoSeleccionado.Modalidad) {
                        Modalidad = modalidad.Nombre
                      }
                    })

                    if (CodigoAbreviacionRol == "EVALUADOR_PLX") {
                      //se debe enviar al docente director
                      angular.forEach(ctrl.RolesTrabajoGrado, function (rol) {
                        if (rol.CodigoAbreviacion == "DIRECTOR_PLX") {
                          RolDirectorTemp = rol
                        }
                      })

                      var parametros = $.param({
                        query: "TrabajoGrado:" + ctrl.trabajoSeleccionado.Id + ",rolTrabajoGrado:" + RolDirectorTemp.Id + ",Activo:True",
                        limit: 0,
                      });

                      poluxRequest.get("vinculacion_trabajo_grado", parametros).then(async function (vinculado) {//Se busca al Docente Director
                        data_auth_mid = {
                          numero: vinculado.data.Data[0].Usuario.toString()
                        }

                        await autenticacionMidRequest.post("token/documentoToken", data_auth_mid).then(function (responseCorreo) {//se busca el correo con el documento
                          correos.push(responseCorreo.data.email)//se agrega a los correos destinatarios
                        })

                        data_correo = {
                          "Source": "notificacionPolux@udistrital.edu.co",
                          "Template": "POLUX_PLANTILLA_REGISTRO_NOTA",
                          "Destinations": [
                            {
                              "Destination": {
                                "ToAddresses": correos
                              },
                              "ReplacementTemplateData": {
                                "nombre_estudiante": ctrl.trabajoSeleccionado.estudiantes[0].datos.nombre,
                                "codigo_estudiante": ctrl.trabajoSeleccionado.estudiantes[0].datos.codigo,
                                "titulo_tg": ctrl.trabajoSeleccionado.Titulo,
                                "modalidad": Modalidad
                              }
                            }
                          ]
                        }

                        //console.log(correos)

                        //DESCOMENTAR AL SUBIR A PRODUCCIÓN
                        notificacionRequest.post("email/enviar_templated_email", data_correo).then(function (response) {
                          console.log("Envia el correo: ", response)
                        }).catch(function (error) {
                          console.log("Error: ", error)
                        });
                      })

                    } else if (CodigoAbreviacionRol == "DIRECTOR_PLX") {

                      var data_auth_mid = {
                        numero: ctrl.trabajoSeleccionado.estudiantes[0].datos.codigo.toString()
                      }

                      await autenticacionMidRequest.post("token/documentoToken", data_auth_mid).then(function (responseCorreoEst) {//se busca el correo con el documento
                        correos.push(responseCorreoEst.data.email)//se agrega a los correos destinatarios
                      })

                      await academicaRequest.get("datos_basicos_estudiante", [ctrl.trabajoSeleccionado.estudiantes[0].datos.codigo]).then(async function (estudiante) {
                        console.log("estudiante:", estudiante)
                        await academicaRequest.get("consulta_carrera_condor", [estudiante.data.datosEstudianteCollection.datosBasicosEstudiante[0].carrera]).then(async function (carrera) {
                          console.log("carrera:", carrera)

                          data_auth_mid = {
                            numero: carrera.data.carreraCondorCollection.carreraCondor[0].numero_documento_coordinador
                          }

                          await autenticacionMidRequest.post("token/documentoToken", data_auth_mid).then(function (responseCorreoCoord) {//se busca el correo del estudiante con el documento
                            correos.push(responseCorreoCoord.data.email)//se almacena en los correos destinatarios
                          })
                        })

                        await academicaRequest.get("obtener_asistente", [estudiante.data.datosEstudianteCollection.datosBasicosEstudiante[0].carrera]).then(async function (asistente) {

                          data_auth_mid = {
                            numero: asistente.data.asistente.proyectos[0].documento_asistente
                          }

                          await autenticacionMidRequest.post("token/documentoToken", data_auth_mid).then(function (responseCorreoAsis) {//se busca el correo del estudiante con el documento
                            correos.push(responseCorreoAsis.data.email)//se almacena en los correos destinatarios
                          })
                        })
                      })

                      var data_correo = {
                        "Source": "notificacionPolux@udistrital.edu.co",
                        "Template": "POLUX_PLANTILLA_REGISTRO_NOTA",
                        "Destinations": [
                          {
                            "Destination": {
                              "ToAddresses": correos
                            },
                            "ReplacementTemplateData": {
                              "nombre_estudiante": ctrl.trabajoSeleccionado.estudiantes[0].datos.nombre,
                              "codigo_estudiante": ctrl.trabajoSeleccionado.estudiantes[0].datos.codigo,
                              "titulo_tg": ctrl.trabajoSeleccionado.Titulo,
                              "modalidad": Modalidad
                            }
                          }
                        ]
                      }
                      //console.log(correos)

                      //DESCOMENTAR AL SUBIR A PRODUCCIÓN
                      notificacionRequest.post("email/enviar_templated_email", data_correo).then(function (response) {
                        console.log("Envia el correo: ", response)
                      }).catch(function (error) {
                        console.log("Error: ", error)
                      });
                    }
                    swal(
                      $translate.instant("REGISTRAR_NOTA.AVISO"),
                      $translate.instant("REGISTRAR_NOTA.NOTA_REGISTRADA"),
                      'success'
                    );
                    $('#modalRegistrarNota').modal('hide');
                    ctrl.registrandoNotaTG = false;
                    ctrl.cargarTrabajos()
                      .then(function () {
                        ctrl.cargandoTrabajos = false;
                      })
                      .catch(function (error) {
                        ctrl.errorCargando = true;
                        ctrl.cargandoTrabajos = false;
                      })
                  } else {
                    swal(
                      $translate.instant("REGISTRAR_NOTA.AVISO"),
                      $translate.instant(response.data.Data[1]),
                      'warning'
                    );
                  }
                  ctrl.registrandoNotaTG = false;
                })
                  .catch(function (error) {
                    swal(
                      $translate.instant("REGISTRAR_NOTA.AVISO"),
                      $translate.instant("REGISTRAR_NOTA.ERROR.REGISTRANDO_NOTA"),
                      'warning'
                    );
                    ctrl.registrandoNotaTG = false;
                  })
              }
            }).catch(function (error) {
              location.reload();
            });
          })
          .catch(function (error) {
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
       * @name registrarCorrecciones
       * @methodOf poluxClienteApp.controller:GeneralRegistrarNotaCtrl
       * @description
       * Función que permite guardar la nota que se registra en un trabajo de grado, guarda el acta de sustentación y la asocia a un documento escrito.
       * Efectúa el servicio de {@link services/poluxService.service:gestorDocumentalMidService gestorDocumentalMidRequest} para hacer gestión documental.
       * @param {undefined} undefined No recibe ningún parametro
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.registrarCorrecciones = function () {
        // Crear una copia del objeto VinculacionTrabajoGrado para modificar su campo RolTrabajoGrado y que solo se envié el Id, para luego asignarlo al campo RolTrabajoGrado del modelo VinculacionTrabajoGrado de polux_mid
        var vinculacionModificada = Object.assign({}, ctrl.trabajoSeleccionado.vinculacion)

        // Extraer el campo Id de RolTrabajoGrado y asignarlo a la copia del objeto original
        vinculacionModificada.RolTrabajoGrado = ctrl.trabajoSeleccionado.vinculacion.RolTrabajoGrado.Id;

        // Extraer el subobjeto TrabajoGrado de DocumentoTrabajoGrado y asignarlo a la copia del objeto original VinculacionTrabajoGrado en su campo TrabajoGrado
        vinculacionModificada.TrabajoGrado = ctrl.docTrabajoGrado.TrabajoGrado;

        // Envía transacción para rechazar
        var transaccionRechazo = {
          Comentarios: [
            {
              Comentario: ctrl.observaciones,
            }
          ],
          RevisionTrabajoGrado: {
            DocumentoTrabajoGrado: ctrl.docTrabajoGrado,
            VinculacionTrabajoGrado: vinculacionModificada,
          },
        };

        poluxMidRequest.post("tr_registrar_revision_tg", transaccionRechazo)
          .then(async function (response) {
            console.log("Comparación Success")
            if (response.data.Success === true) {

              var correos = [], usuario = []

              //se busca el correo del estudiante
              var data_auth_mid = {
                numero: ctrl.trabajoSeleccionado.estudiantes[0].Estudiante
              }

              await autenticacionMidRequest.post("token/documentoToken", data_auth_mid).then(function (responseEmail) {
                correos.push(responseEmail.data.email)
              })

              //Se busca el nombre del docente que realiza el comentario
              await academicaRequest.get("docente_tg", [ctrl.documento]).then(function(docente){
                if (!angular.isUndefined(docente.data.docenteTg.docente)) {
                  usuario = docente.data.docenteTg.docente[0].nombre
                }
              })

              var data_correo = {
                "Source": "notificacionPolux@udistrital.edu.co",
                "Template": "POLUX_PLANTILLA_REVISION_DOC",
                "Destinations": [
                  {
                    "Destination": {
                      "ToAddresses": correos
                    },
                    "ReplacementTemplateData": {
                      "nombre_usuario": usuario,
                      "titulo_tg": ctrl.trabajoSeleccionado.Titulo,
                      "comentario": ctrl.observaciones
                    }
                  }
                ]
              }

              //console.log(correos)
              
              notificacionRequest.post("email/enviar_templated_email", data_correo).then(function (response) {
                console.log("Envia el correo", response)
              }).catch(function (error) {
                console.log("Error: ", error)
              });
              swal(
                $translate.instant("SOLICITAR_CORRECCIONES.AVISO"),
                $translate.instant("SOLICITAR_CORRECCIONES.CORRECCION_REGISTRADA"),
                'success'
              );
              $('#modalRegistrarNota').modal('hide');
              ctrl.registrandoNotaTG = false;
              ctrl.cargarTrabajos()
                .then(function () {
                  ctrl.cargandoTrabajos = false;
                })
                .catch(function (error) {
                  ctrl.errorCargando = true;
                  ctrl.cargandoTrabajos = false;
                })
            } else {
              swal(
                $translate.instant("SOLICITAR_CORRECCIONES.AVISO"),
                $translate.instant(response.data.Data[1]),
                'warning'
              );
            }
            ctrl.registrandoNotaTG = false;
          })
          .catch(function (error) {
            swal(
              $translate.instant("SOLICITAR_CORRECCIONES.AVISO"),
              $translate.instant("SOLICITAR_CORRECCIONES.ERROR.REGISTRANDO_CORRECCION"),
              'warning'
            );
            ctrl.registrandoNotaTG = false;
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
            ctrl.devolver = false;
            ctrl.cargarTrabajo(row)
            //$('#modalVerSolicitud').modal('show');
            break;
          case "registrarNota":
            ctrl.devolver = false;
            if (row.entity.TrabajoGrado.EstadoTrabajoGrado.CodigoAbreviacion !== 'EC') {
              ctrl.registrarNota = true;
              ctrl.cargarTrabajo(row);
              break;
            }

            // Varifica si pesar de haber solicitado correcciones, puede registrar la nota
            var parametrosCheckCorreccion = $.param({
              limit: 0,
              query: 'VinculacionTrabajoGrado__Id:' + row.entity.Id,
            });
            poluxRequest.get('revision_trabajo_grado', parametrosCheckCorreccion)
              .then(function (responseRevisiones) {
                if (Object.keys(responseRevisiones.data.Data[0]).length > 0) {
                  ctrl.registrarNota = true;
                  ctrl.cargarTrabajo(row);
                } else {
                  ctrl.registrarNota = false;
                  swal(
                    $translate.instant('ERROR.ESTADO_TRABAJO_GRADO_NO_PERMITE_REGISTRAR_NOTA'),
                    '',
                    'warning'
                  );
                }
              })
              .catch(function(error) {
                ctrl.mensajeErrorTrabajo = $translate.instant('ERROR.CARGAR_TRABAJO_GRADO');
                ctrl.errorCargandoTrabajo = true;
                ctrl.cargandoTrabajo = false;
              });
            break;
          case 'devolver':
            ctrl.registrarNota = false;
            ctrl.devolver = true;
            ctrl.cargarTrabajo(row);
            break;
          default:
            break;
        }
      };

    });
