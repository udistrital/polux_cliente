'use strict';

/**
 * @ngdoc controller
 * @name poluxClienteApp.controller:PasantiaAprobarCartaCtrl
 * @description
 * # PasantiaAprobarCartaCtrl
 * Controller of the poluxClienteApp
 * Controlador que permite al encargado de la oficina de pasantias aprobar las solicitudes de carta de presentación ante las empresas.
 * @requires $q
 * @requires $route
 * @requires $scope
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires services/academicaService.service:academicaRequest
 * @requires services/poluxService.service:poluxRequest
 * @requires services/poluxClienteApp.service:tokenService
 * @property {String} mensajeCargandoSolicitudes Texto que aparece durante la carga de las solicitudes
 * @property {String} documento Documento de la persona que ingresa al módulo.
 * @property {Array} botonesAprobar Colección de propiedades para los botones de aprobación
 * @property {Array} botonesNoAprobar Colección de propiedades para los botones de rechazo
 * @property {Array} solicitudes Solicitudes de carta de presentación
 * @property {Boolean} cargandoSolicitudes Bandera que muestra el loading de cargando solicitudes
 * @property {Boolean} errorCargandoSolicitudes Booleano que permite identificar si ocurrio un error cargando las solicitudes
 * @property {String} mensajeError Error que se muestra al usuario sobre un error ocurrido al cargar las solicitudes
 * @property {Object} gridOptions Opciones del ui-grid que muestra las solicitudes de carta de presentación
 * @property {Object} solicitud Objeto que carga la solicitud que se selecciona desde la vista
 */
angular.module('poluxClienteApp')
  .controller('PasantiaAprobarCartaCtrl',
    function($q, $route, $scope, $translate, academicaRequest, poluxRequest, token_service) {
      var ctrl = this;

      ctrl.mensajeCargandoSolicitudes = $translate.instant("LOADING.CARGANDO_SOLICITUDES");

      //Documento de la persona que aprueba la solicitud
      //token_service.token.documento = "1018494294";
      //ctrl.documento = token_service.token.documento;
      ctrl.documento = token_service.getAppPayload().appUserDocument;

      //Botones de las acciones que se pueden ejecutar con la solicitud
      $scope.botonesAprobar = [{
        clase_color: "ver",
        clase_css: "fa fa-eye fa-lg  faa-shake animated-hover",
        titulo: $translate.instant('BTN.VER_DETALLES'),
        operacion: 'ver',
        estado: true
      }, {
        clase_color: "ver",
        clase_css: "fa fa fa-check fa-lg  faa-shake animated-hover",
        titulo: $translate.instant('APROBAR_SOLICITUD'),
        operacion: 'aprobar',
        estado: true
      }, {
        clase_color: "ver",
        clase_css: "fa fa fa-close fa-lg  faa-shake animated-hover",
        titulo: $translate.instant('RECHAZAR_SOLICITUD'),
        operacion: 'rechazar',
        estado: true
      }, ];
      $scope.botonesNoAprobar = [{
        clase_color: "ver",
        clase_css: "fa fa-eye fa-lg  faa-shake animated-hover",
        titulo: $translate.instant('BTN.VER_DETALLES'),
        operacion: 'ver',
        estado: true
      }, ];
      //Grid options de las solicitudes que se muestran
      ctrl.gridOptions = {
        paginationPageSizes: [5, 10, 15, 20, 25],
        paginationPageSize: 10,
        enableFiltering: true,
        enableSorting: true,
        enableSelectAll: false,
        useExternalPagination: false,
      }
      ctrl.gridOptions.columnDefs = [{
        name: 'Id',
        displayName: $translate.instant('NUMERO_RADICADO'),
        width: '15%',
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
        name: 'FechaFormateada',
        displayName: $translate.instant('FECHA'),
        width: '15%',
      }, {
        name: 'Acciones',
        displayName: $translate.instant('ACCIONES'),
        width: '15%',
        type: 'boolean',
        cellTemplate: '<div ng-if="row.entity.EstadoSolicitud.Id === 1">' +
          '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botonesAprobar" fila="row"></btn-registro>' +
          '</div>' +
          '<div ng-if="row.entity.EstadoSolicitud.Id != 1">' +
          '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botonesNoAprobar" fila="row"></btn-registro>' +
          '</div>'
      }];

      /**
       * @ngdoc method
       * @name cargarEstudiante
       * @methodOf poluxClienteApp.controller:PasantiaAprobarCartaCtrl
       * @description 
       * Función que permite consultar el solicitante de la solicitud en el servicio de {@link services/poluxService.service:poluxRequest poluxRequest}, luego se consultan sus datos en {@link services/academicaService.service:academicaRequest academicaRequest}.
       * @param {Object} respuestaSolicitud Objeto que contiene la información de la solicitud
       * @returns {Promise} Objeto de tipo promesa que indica cuando finaliza la función, se resuelve sin retornar ningún parametro
       */
      ctrl.cargarEstudiante = function(respuestaSolicitud) {
        var defer = $q.defer();
        var parametrosEstudiante = $.param({
          query: "SolicitudTrabajoGrado.Id:" + respuestaSolicitud.SolicitudTrabajoGrado.Id,
          limit: 1
        });
        poluxRequest.get("usuario_solicitud", parametrosEstudiante)
          .then(function(responseEstudiante) {
            if (Object.keys(responseEstudiante.data[0]).length > 0) {
              //Consultar datos del estudiante
              academicaRequest.get("periodo_academico", "P").then(function(periodoAnterior) {
                  academicaRequest.get("datos_estudiante", [responseEstudiante.data[0].Usuario, periodoAnterior.data.periodoAcademicoCollection.periodoAcademico[0].anio, periodoAnterior.data.periodoAcademicoCollection.periodoAcademico[0].periodo]).then(function(response2) {
                      if (!angular.isUndefined(response2.data.estudianteCollection.datosEstudiante)) {
                        respuestaSolicitud.Estudiante = {
                          "Codigo": responseEstudiante.data[0].Usuario,
                          "Nombre": response2.data.estudianteCollection.datosEstudiante[0].nombre,
                          "Modalidad": 1, //id modalidad de pasantia
                          "Tipo": "POSGRADO",
                          "PorcentajeCursado": parseFloat(response2.data.estudianteCollection.datosEstudiante[0].creditosCollection.datosCreditos[0].porcentaje.porcentaje_cursado[0].porcentaje_cursado).toFixed(2),
                          "Promedio": response2.data.estudianteCollection.datosEstudiante[0].promedio,
                          "Rendimiento": response2.data.estudianteCollection.datosEstudiante[0].rendimiento,
                          "Estado": response2.data.estudianteCollection.datosEstudiante[0].estado,
                          "Nivel": response2.data.estudianteCollection.datosEstudiante[0].nivel,
                          "TipoCarrera": response2.data.estudianteCollection.datosEstudiante[0].nombre_tipo_carrera,
                          "Carrera": response2.data.estudianteCollection.datosEstudiante[0].carrera
                        };
                        defer.resolve();
                      } else {
                        ctrl.mensajeError = $translate.instant("ERROR.CARGAR_DATOS_ESTUDIANTE");
                        defer.reject(error);
                      }
                    })
                    .catch(function(error) {
                      ctrl.mensajeError = $translate.instant("ERROR.CARGAR_DATOS_ESTUDIANTE");
                      defer.reject(error);
                    });
                })
                .catch(function(error) {
                  ctrl.mensajeError = $translate.instant("ERROR.CARGAR_DATOS_ESTUDIANTE");
                  defer.reject(error);
                });
            } else {
              ctrl.mensajeError = $translate.instant("ERROR.CARGAR_DATOS_ESTUDIANTE");
              defer.reject("No se encuentran datos del estudiante");
            }
          })
          .catch(function(error) {
            ctrl.mensajeError = $translate.instant("ERROR.CARGAR_DATOS_ESTUDIANTE");
            defer.reject(error);
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name cargarDetalles
       * @methodOf poluxClienteApp.controller:PasantiaAprobarCartaCtrl
       * @description 
       * Función que permite consultar los detalles asociados a una solicitud en el servicio de {@link services/poluxService.service:poluxRequest poluxRequest}.
       * @param {Object} respuestaSolicitud Objeto que contiene la información de la solicitud
       * @returns {Promise} Objeto de tipo promesa que indica cuando finaliza la función, se resuelve sin retornar ningún dato
       */
      ctrl.cargarDetalles = function(respuestaSolicitud) {
        var defer = $q.defer();
        var parametrosDetalles = $.param({
          query: "SolicitudTrabajoGrado.Id:" + respuestaSolicitud.SolicitudTrabajoGrado.Id,
          limit: 0
        });
        poluxRequest.get("detalle_solicitud", parametrosDetalles)
          .then(function(responseDetalles) {
            if (Object.keys(responseDetalles.data[0]).length > 0) {
              angular.forEach(responseDetalles.data, function(detalle) {
                if (detalle.DetalleTipoSolicitud.Id === 1) {
                  //Nombre del receptor de la carta
                  respuestaSolicitud.NombreEmpresa = detalle.Descripcion;
                }
                if (detalle.DetalleTipoSolicitud.Id === 2) {
                  //Nombre del receptor de la carta
                  respuestaSolicitud.NombreReceptor = detalle.Descripcion;
                }
                if (detalle.DetalleTipoSolicitud.Id === 3) {
                  //Cargo del receptor de la carta
                  respuestaSolicitud.CargoReceptor = detalle.Descripcion;
                }
              });
              defer.resolve();
            } else {
              ctrl.mensajeError = $translate.instant("ERROR.CARGAR_DETALLES_SOLICITUD");
              defer.reject("No se encuentran detalles de la solicitud");
            }
          })
          .catch(function(error) {
            ctrl.mensajeError = $translate.instant("ERROR.CARGAR_DETALLES_SOLICITUD");
            defer.reject(error);
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name cargarSolicitudes
       * @methodOf poluxClienteApp.controller:PasantiaAprobarCartaCtrl
       * @description 
       * Función que permite consultar las solicitudes de carta de presentación que se hayan realizado de {@link services/poluxService.service:poluxRequest poluxRequest}.
       * @param {undefined} undefined La función no requiere ningún parámetro
       * @returns {undefined} La función no retorna ningún dato
       */
      ctrl.cargarSolicitudes = function() {
        ctrl.cargandoSolicitudes = true;
        var parametrosSolicitudesCarta = $.param({
          //Solicitudes de tipo 1 carta de presentación
          query: "SolicitudTrabajoGrado.ModalidadTipoSolicitud.Id:1,Activo:True",
          limit: 0
        });
        poluxRequest.get("respuesta_solicitud", parametrosSolicitudesCarta)
          .then(function(responseSolicitudes) {
            ctrl.solicitudes = responseSolicitudes.data;
            if (Object.keys(ctrl.solicitudes[0]).length > 0) {
              //Si hay solicitudes
              var promises = [];
              angular.forEach(ctrl.solicitudes, function(solicitud) {
                //Fecha de la solicitud formateada
                solicitud.FechaFormateada = solicitud.SolicitudTrabajoGrado.Fecha.toString().substring(0, 10);
                //Se consultan datos del estudiante
                promises.push(ctrl.cargarEstudiante(solicitud));
                //Se consultan detalles de la solicitud
                promises.push(ctrl.cargarDetalles(solicitud));
              });
              $q.all(promises)
                .then(function() {
                  
                  ctrl.gridOptions.data = ctrl.solicitudes;
                  ctrl.cargandoSolicitudes = false;
                })
                .catch(function(error) {
                  
                  ctrl.errorCargandoSolicitudes = true;
                  ctrl.cargandoSolicitudes = false;
                });
            } else {
              //Si no hay solicitudes
              
              ctrl.mensajeError = $translate.instant("PASANTIA.ERROR.SIN_SOLICITUDES_CARTA");
              ctrl.errorCargandoSolicitudes = true;
              ctrl.cargandoSolicitudes = false;
            }
          })
          .catch(function(error) {
            
            ctrl.mensajeError = $translate.instant("ERROR.CARGAR_SOLICITUDES");
            ctrl.errorCargandoSolicitudes = true;
            ctrl.cargandoSolicitudes = false;
          });
      }

      ctrl.cargarSolicitudes();

      /**
       * @ngdoc method
       * @name postRespuesta
       * @methodOf poluxClienteApp.controller:PasantiaAprobarCartaCtrl
       * @description 
       * Función que permite registrar la nueva respuesta de uan solicitud, dependiendo si esta fue rechazada o no, si es rechazada asigna el estado 16 y si es aprobada asigna el 15, 
       * se envia luego la petición al servicio de {@link services/poluxService.service:poluxRequest poluxRequest}.
       * @param {undefined} undefined La función no requiere ningún parámetro
       * @returns {undefined} La función no retorna ningún dato
       */
      ctrl.postRespuesta = function(respuestaSolicitud, aprobada, justificacion) {
        ctrl.cargandoSolicitudes = true;
        var respuestaNueva = {
          "Id": null,
          "Fecha": new Date(),
          "Justificacion": justificacion,
          "EnteResponsable": 0,
          "Usuario": parseInt(ctrl.documento, 10),
          "Activo": true,
          "EstadoSolicitud": {
            //Aprobada el estado nuevo es 15 y rechazada es 16
            "Id": (aprobada) ? 15 : 16,
          },
          "SolicitudTrabajoGrado": {
            "Id": respuestaSolicitud.SolicitudTrabajoGrado.Id
          }
        }
        //SE cambia el estado de la solicitud antigua
        respuestaSolicitud.Activo = false;
        var dataRegistrarRespuesta = {
          RespuestasNuevas: [respuestaNueva],
          RespuestasAntiguas: [respuestaSolicitud]
        }
        
        poluxRequest.post("tr_registrar_respuestas_solicitudes", dataRegistrarRespuesta)
          .then(function(responseRespuesta) {
            
            if (responseRespuesta.data[0] === "Success") {
              swal(
                $translate.instant("RESPUESTA_SOLICITUD"),
                $translate.instant("SOLICITUD_APROBADA"),
                'success'
              );
              $route.reload();
            } else {
              ctrl.cargandoSolicitudes = false;
              swal(
                $translate.instant("MENSAJE_ERROR"),
                $translate.instant(responseRespuesta.data[1]),
                'warning'
              );
            }
          })
          .catch(function(error) {
            ctrl.cargandoSolicitudes = false;
            
            swal(
              $translate.instant("MENSAJE_ERROR"),
              $translate.instant("ERROR_SOLICITUDES_3"),
              'warning'
            );
          });
      }

      /**
       * @ngdoc method
       * @name loadrow
       * @methodOf poluxClienteApp.controller:PasantiaAprobarCartaCtrl
       * @description 
       * Ejecuta las funciones específicas de los botones seleccionados en el ui-grid.
       * @param {Object} row Fila seleccionada en el uigrid que contiene los detalles de la solicitud que se quiere consultar
       * @param {String} operacion Operación que se debe ejecutar cuando se selecciona el botón
       * @returns {undefined} No retorna ningún valor
       */
      $scope.loadrow = function(row, operacion) {
        if (operacion == "ver") {
          ctrl.solicitud = row.entity;
          
          $('#modalVerSolicitud').modal('show');
        } else if (operacion == "aprobar") {
          swal({
              title: $translate.instant("PASANTIA.CARTA.CONFIRMACION"),
              text: $translate.instant("PASANTIA.CARTA.MENSAJE_APROBACION"),
              type: "info",
              confirmButtonText: $translate.instant("ACEPTAR"),
              cancelButtonText: $translate.instant("CANCELAR"),
              showCancelButton: true
            })
            .then(function(response) {
              // Se valida que el usuario haya confirmado la formalización
              if (response) {
                ctrl.postRespuesta(row.entity, true, "La solicitud ha sido aprobada");
              }
            });
        } else if (operacion == "rechazar") {
          swal({
              title: $translate.instant("PASANTIA.CARTA.CONFIRMACION"),
              text: $translate.instant("PASANTIA.CARTA.MENSAJE_RECHAZO"),
              type: "info",
              confirmButtonText: $translate.instant("ACEPTAR"),
              cancelButtonText: $translate.instant("CANCELAR"),
              showCancelButton: true
            })
            .then(function(response) {
              // Se valida que el usuario haya confirmado la formalización
              if (response) {
                ctrl.postRespuesta(row.entity, false, "La solicitud fue rechazada, para cualquier inquietud acerquese a la oficina de pasantias.");
              }
            });
        }
      };
    });