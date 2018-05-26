'use strict';

/**
 * @ngdoc controller
 * @name poluxClienteApp.controller:PasantiaAprobarCartaCtrl
 * @description
 * # PasantiaAprobarCartaCtrl
 * Controller of the poluxClienteApp
 * Controlador que permite al encargado de la oficina de pasantias aprobar
 * las solicitudes de carta de presentación ante las empresas.
 * @requires @requires services/poluxClienteApp.service:tokenService 
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires services/academicaService.service:academicaRequest
 * @requires services/poluxService.service:poluxRequest
 * @requires $q
 * @requires $translate
 * @requires $scope
 * @property {String} documento Documento de la persona que ingresa al módulo.
 * @property {Array} solicitudes Solicitudes de carta de presentación
 * @property {boolean} cargandoSolicitudes Bandera que muestra el loading de cargando solicitudes
 * @property {boolean} errorCargandoSolicitudes Booleano que permite identificar si ocurrio un error cargando las solicitudes
 * @property {String} mensajeError Error que se muestra al usuario sobre un error ocurrido al cargar las solicitudes
 * @property {Object} gridOptions Opciones del ui-grid que muestra las solicitudes de carta de presentación
 */
angular.module('poluxClienteApp')
  .controller('PasantiaAprobarCartaCtrl', function (token_service,poluxRequest,$translate,$q,$scope,academicaRequest) {
    var ctrl = this;
    
    ctrl.mensajeCargandoSolicitudes = $translate.instant("LOADING.CARGANDO_SOLICITUDES");
    
    //Documento de la persona que aprueba la solicitud
    ctrl.documento = "1018494294"

    //Botones de las acciones que se pueden ejecutar con la solicitud
    $scope.botonesAprobar = [
      { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER_DETALLES'), operacion: 'ver', estado: true },
      { clase_color: "ver", clase_css: "fa fa fa-check fa-lg  faa-shake animated-hover", titulo: $translate.instant('APROBAR_SOLICITUD'), operacion: 'aprobar', estado: true },
      { clase_color: "ver", clase_css: "fa fa fa-close fa-lg  faa-shake animated-hover", titulo: $translate.instant('RECHAZAR_SOLICITUD'), operacion: 'rechazar', estado: true },
    ];

    //Grid options de las solicitudes que se muestran
    ctrl.gridOptions = {
      paginationPageSizes: [5,10,15, 20, 25],
      paginationPageSize: 10,
      enableFiltering: true,
      enableSorting: true,
      enableSelectAll: false,
      useExternalPagination: false,
    }
    ctrl.gridOptions.columnDefs = [{
        name: 'Id',
        displayName: $translate.instant('NUMERO_RADICADO'),
        width:'15%',
      }, {
        name: 'EstadoSolicitud.Nombre',
        displayName: $translate.instant('ESTADO_SOLICITUD'),
        width: '15%',
      }, {
        name: 'Estudiante.Codigo',
        displayName: $translate.instant('ESTUDIANTE'),
        width: '20%',
      }, {
        name: 'Estudiante.Nombre',
        displayName: $translate.instant('NOMBRE'),
        width: '20%',
      }, {
        name: 'Fecha',
        displayName: $translate.instant('FECHA'),
        width: '15%',
      }, {
        name: 'Acciones',
        displayName: $translate.instant('ACCIONES'),
        width:'15%',
        type: 'boolean',
        cellTemplate: '<div ng-if="row.entity.EstadoSolicitud.Id === 1">'
                        +'<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botonesAprobar" fila="row"></btn-registro>'
                      +'</div>'
    }];

    /**
     * @ngdoc method
     * @name cargarEstudiante
     * @methodOf poluxClienteApp.controller:PasantiaAprobarCartaCtrl
     * @description 
     * Función que permite consultar el solicitante de la solicitud en el servicio de
     * {@link services/poluxService.service:poluxRequest poluxRequest}, luego de saber el responsable se consultan
     * sus datos en {@link services/academicaService.service:academicaRequest academicaRequest}.
     * @param {object} respuestaSolicitud Objeto que contiene la información de la solicitud.
     * @returns {Promise} Objeto de tipo promesa que indica cuando finaliza la función, se resuelve sin retornar ningún parametro.
     */
    ctrl.cargarEstudiante = function(respuestaSolicitud){
      var defer = $q.defer();
      var parametrosEstudiante  = $.param({
        query:"SolicitudTrabajoGrado.Id:"+respuestaSolicitud.SolicitudTrabajoGrado.Id,
        limit:1
      });
      poluxRequest.get("usuario_solicitud",parametrosEstudiante)
      .then(function(responseEstudiante){
        if(responseEstudiante.data != null){
          //Consultar datos del estudiante
          academicaRequest.get("periodo_academico","P").then(function(periodoAnterior){
            academicaRequest.get("datos_estudiante",[ responseEstudiante.data[0].Usuario, periodoAnterior.data.periodoAcademicoCollection.periodoAcademico[0].anio,periodoAnterior.data.periodoAcademicoCollection.periodoAcademico[0].periodo ]).then(function(response2){
              if (!angular.isUndefined(response2.data.estudianteCollection.datosEstudiante)) {
                respuestaSolicitud.Estudiante={
                  "Codigo": responseEstudiante.data[0].Usuario,
                  "Nombre": response2.data.estudianteCollection.datosEstudiante[0].nombre,
                  "Modalidad": 1, //id modalidad de pasantia
                  "Tipo": "POSGRADO",
                  "PorcentajeCursado": response2.data.estudianteCollection.datosEstudiante[0].creditosCollection.datosCreditos[0].porcentaje.porcentaje_cursado[0].porcentaje_cursado,
                  "Promedio": response2.data.estudianteCollection.datosEstudiante[0].promedio,
                  "Rendimiento": response2.data.estudianteCollection.datosEstudiante[0].rendimiento,
                  "Estado": response2.data.estudianteCollection.datosEstudiante[0].estado,
                  "Nivel": response2.data.estudianteCollection.datosEstudiante[0].nivel,
                  "TipoCarrera": response2.data.estudianteCollection.datosEstudiante[0].nombre_tipo_carrera,
                  "Carrera":response2.data.estudianteCollection.datosEstudiante[0].carrera
                };
                defer.resolve();
              }else{
                ctrl.mensajeError  = $translate.instant("ERROR.CARGAR_DATOS_ESTUDIANTE");
                defer.reject(error);
              }
            })
            .catch(function(error){
              ctrl.mensajeError  = $translate.instant("ERROR.CARGAR_DATOS_ESTUDIANTE");
              defer.reject(error);
            });
          })
          .catch(function(error){
            ctrl.mensajeError  = $translate.instant("ERROR.CARGAR_DATOS_ESTUDIANTE");
            defer.reject(error);
          });
        }else{
          ctrl.mensajeError  = $translate.instant("ERROR.CARGAR_DATOS_ESTUDIANTE");
          defer.reject("No se encuentran datos del estudiante");
        }
      })
      .catch(function(error){
        ctrl.mensajeError  = $translate.instant("ERROR.CARGAR_DATOS_ESTUDIANTE");
        defer.reject(error);
      });
      return defer.promise;
    }

    /**
     * @ngdoc method
     * @name cargarDetalles
     * @methodOf poluxClienteApp.controller:PasantiaAprobarCartaCtrl
     * @description 
     * Función que permite consultar los detalles asociados a una solicitud en el servicio de
     * {@link services/poluxService.service:poluxRequest poluxRequest}.
     * @param {object} respuestaSolicitud Objeto que contiene la información de la solicitud.
     * @returns {Promise} Objeto de tipo promesa que indica cuando finaliza la función, se resuelve sin retornar ningún parametro.
     */
    ctrl.cargarDetalles = function(respuestaSolicitud){
      var defer = $q.defer();
      var parametrosDetalles  = $.param({
        query:"SolicitudTrabajoGrado.Id:"+respuestaSolicitud.SolicitudTrabajoGrado.Id,
        limit:0
      });
      poluxRequest.get("detalle_solicitud",parametrosDetalles)
      .then(function(responseDetalles){
        if(responseDetalles.data != null){
          angular.forEach(responseDetalles.data,function(detalle){
            if(detalle.DetalleTipoSolicitud.Id === 1 ){
              //Nombre del receptor de la carta
              respuestaSolicitud.nombreEmpresa = detalle.Descripcion;
            }
            if(detalle.DetalleTipoSolicitud.Id === 2 ){
              //Nombre del receptor de la carta
              respuestaSolicitud.nombreReceptor = detalle.Descripcion;
            }
            if(detalle.DetalleTipoSolicitud.Id === 3 ){
              //Cargo del receptor de la carta
              respuestaSolicitud.cargoReceptor = detalle.Descripcion;
            }
          });
          defer.resolve();
        }else{
          ctrl.mensajeError  = $translate.instant("ERROR.CARGAR_DETALLES_SOLICITUD");
          defer.reject("No se encuentran detalles de la solicitud");
        }
      })
      .catch(function(error){
        ctrl.mensajeError  = $translate.instant("ERROR.CARGAR_DETALLES_SOLICITUD");
        defer.reject(error);
      });
      return defer.promise;
    }

    /**
     * @ngdoc method
     * @name cargarSolicitudes
     * @methodOf poluxClienteApp.controller:PasantiaAprobarCartaCtrl
     * @description 
     * Función que permite consultar las solicitudes de carta de presentación que se hayan realizado de
     * {@link services/poluxService.service:poluxRequest poluxRequest}.
     * @param {undefined} Undefined La función no requiere ningún parametro.
     * @returns {undefined} La función no retorna ningún dato.
     */
    ctrl.cargarSolicitudes = function(){
      ctrl.cargandoSolicitudes = true;
      var parametrosSolicitudesCarta  = $.param({
        //Solicitudes de tipo 1 carta de presentación
        query:"SolicitudTrabajoGrado.ModalidadTipoSolicitud.Id:1,Activo:True",
        limit:0
      });
      poluxRequest.get("respuesta_solicitud", parametrosSolicitudesCarta)
      .then(function(responseSolicitudes){
        ctrl.solicitudes = responseSolicitudes.data;
        if(ctrl.solicitudes != null){
          //Si hay solicitudes
          var promises = [];
          angular.forEach(ctrl.solicitudes,function(solicitud){
            //Fecha de la solicitud formateada
            solicitud.Fecha = solicitud.SolicitudTrabajoGrado.Fecha.toString().substring(0, 10);
            //Se consultan datos del estudiante
            promises.push(ctrl.cargarEstudiante(solicitud));
            //Se consultan detalles de la solicitud
            promises.push(ctrl.cargarDetalles(solicitud));
          });
          $q.all(promises)
          .then(function(){
            console.log(ctrl.solicitudes);
            ctrl.gridOptions.data = ctrl.solicitudes;
            ctrl.cargandoSolicitudes = false;
          })
          .catch(function(error){
            console.log(error);
            ctrl.errorCargandoSolicitudes = true;
            ctrl.cargandoSolicitudes = false;
          });
        }else{
          //Si no hay solicitudes
          console.log("No hay solicitudes por aprobación");
          ctrl.mensajeError  = $translate.instant("PASANTIA.ERROR.SIN_SOLICITUDES_CARTA");
          ctrl.errorCargandoSolicitudes = true;
          ctrl.cargandoSolicitudes = false;
        }
      })
      .catch(function(error){
        console.log(error);
        ctrl.mensajeError  = $translate.instant("ERROR.CARGAR_SOLICITUDES");
        ctrl.errorCargandoSolicitudes = true;
        ctrl.cargandoSolicitudes = false;
      });
    }

    ctrl.cargarSolicitudes();


    /**
     * @ngdoc method
     * @name loadrow
     * @methodOf poluxClienteApp.controller:PasantiaAprobarCartaCtrl
     * @description 
     * Ejecuta las funciones especificas de los botones seleccionados en el ui-grid
     * @param {object} row Fila seleccionada en el uigrid que contiene los detalles de la solicitud que se quiere consultar
     * @param {string} operacion Operación que se debe ejecutar cuando se selecciona el botón
     * @returns {undefined} No retorna ningún valor
     */
    $scope.loadrow = function(row, operacion) {
      switch (operacion) {
        case "ver":
          $('#modalVerSolicitud').modal('show');
          break;
        default:
          break;
      }
    };
  });
