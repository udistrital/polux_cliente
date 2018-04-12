'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:MateriasPosgradoFormalizarSolicitudCtrl
 * @description
 * # MateriasPosgradoFormalizarSolicitudCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('MateriasPosgradoFormalizarSolicitudCtrl',
    function ($location, $q, $scope, $translate, academicaRequest, poluxRequest, sesionesRequest) {
      var ctrl = this;
      
      // El Id del usuario depende de la sesión
      $scope.userId = "20112020004";

      // En el inicio de la página, se están cargando las solicitudes
      $scope.cargandoSolicitudes = true;
      $scope.mensajeCargandoSolicitudes = $translate.instant("LOADING.CARGANDO_SOLICITUDES");

      // Se define el objeto que carga las solicitudes para formalizar y que serán visualizadas
      ctrl.cuadriculaSolicitudesParaFormalizar = {};

      // Se configura el botón por el cual el usuario podrá formalizar la solicitud
      $scope.botonFormalizarSolicitud = [{
          clase_color: "ver",
          clase_css: "fa fa-check fa-lg  faa-shake animated-hover",
          titulo: $translate.instant('BTN.VER_DETALLES'),
          operacion: 'formalizarSolicitudSeleccionada',
          estado: true
        }];

      // Se definen los espacios a mostrar por cada solicitud
      ctrl.cuadriculaSolicitudesParaFormalizar.columnDefs = [
        {
          name: 'idSolicitud',
          displayName: $translate.instant("SOLICITUD"),
          width: '12%'
        },
        {
          name: 'estadoSolicitud',
          displayName: $translate.instant("ESTADO_SIN_DOSPUNTOS"),
          width: '12%'
        },
        {
          name: 'descripcionSolicitud',
          displayName: $translate.instant("DESCRIPCION"),
          width: '15%'
        },
        {
          name: 'posgrado',
          displayName: $translate.instant("POSGRADO"),
          width: '15%'
        },
        {
          name: 'espaciosStr',
          displayName: $translate.instant("ESPACIOS_ACADEMICOS"),
          width: '31%',
          //cellTemplate: '<div ng-repeat="espacioAcademico in row.entity[col.field]">{{espacioAcademico.nombre}}</div>'
        },
        {
          name: 'formalizarSolicitud',
          displayName: $translate.instant("FORMALIZAR_SOLICITUD"),
          width: '15%',
          cellTemplate: '<btn-registro funcion="grid.appScope.cargarFila(row)" grupobotones="grid.appScope.botonFormalizarSolicitud"></btn-registro>'
        }
      ];

      /**
       * [Función que define los parámetros para consultar en la tabla usuario_solicitud]
       * @return {[param]} [Se retorna la sentencia para la consulta]
       */
      ctrl.obtenerParametrosUsuariosConSolicitudes = function() {
        return $.param({
          /**
           * La modalidad asociada al tipo de solicitud 13 es la que relaciona solicitud inicial con espacios académicos de posgrado
           * Tabla: modalidad_tipo_solicitud
           * Tablas asociadas: tipo_solicitud (2) y modalidad (2)
           */
          query: "SolicitudTrabajoGrado.ModalidadTipoSolicitud.Id:13"
          + ",Usuario:" + $scope.userId,
          limit: 0
          });
      }

      /**
       * [Función que define los parámetros para consultar en la tabla respuesta_solicitud]
       * @param  {[integer]} idSolicitudTrabajoGrado [Se recibe el id de la solicitud de trabajo de grado asociada al usuario]
       * @return {[param]}                         [Se retorna la sentencia para la consulta]
       */
      ctrl.obtenerParametrosSolicitudRespondida = function(idSolicitudTrabajoGrado) {
        return $.param({
          query: "SolicitudTrabajoGrado.Id:"
          + idSolicitudTrabajoGrado
          /**
           * El estado de la solicitud que se encuentre en los estados 5, 7 u 8 corresponde a:
           * 5 - Opcionada para segunda convocatoria
           * 7 - Aprobada exenta de pago
           * 8 - Aprobada no exenta de pago
           * Tabla: estado_solicitud
           */
          + ",EstadoSolicitud.Id.in:5|7|8"
          + ",Activo:true",
          limit: 1
          });
      }

      /**
       * [Función que define los parámetros para consultar en la tabla detalle_solicitud]
       * @param  {[integer]} idSolicitudTrabajoGrado [Se recibe el id de la solicitud de trabajo de grado asociada al usuario]
       * @return {[param]}                         [Se retorna la sentencia para la consulta]
       */
      ctrl.obtenerParametrosDetalleSolicitud = function(idSolicitudTrabajoGrado) {
        return $.param({
          /**
           * El detalle tipo solicitud 37 relaciona el detalle y la modalidad de espacios académicos de posgrado 
           * Tabla: detalle_solicitud
           * Tablas asociadas: detalle (22) y modalidad_tipo_solicitud (13)
           */
          query: "DetalleTipoSolicitud.Id:37"
          + ",SolicitudTrabajoGrado.Id:" + idSolicitudTrabajoGrado,
          limit: 1
          });
      }

      /**
       * [Función que obtiene el periodo académico según los parámetros de consulta]
       * @return {[Promise]} [El periodo académico, o la excepción generada]
       */
      ctrl.obtenerPeriodo = function() {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();
        // Se consulta hacia el periodo académico con el servicio de academicaRequest
        // El parámetro "X" consulta el siguiente periodo académico al actual
        academicaRequest.get("periodo_academico", "X")
        .then(function(periodoAcademicoConsultado) {
          // Se verifica que la respuesta está definida
          if (!angular.isUndefined(periodoAcademicoConsultado.data.periodoAcademicoCollection.periodoAcademico)) {
            // Se resuelve el periodo académico correspondiente
            deferred.resolve(periodoAcademicoConsultado.data.periodoAcademicoCollection.periodoAcademico[0]);
          } else {
            // En caso de error se prepara el mensaje y se rechaza con nulo
            ctrl.mensajeErrorCargandoSolicitudes = $translate.instant("ERROR.SIN_PERIODO");
            // Se rechaza nulamente la consulta
            deferred.reject(null);
          }
        })
        .catch(function(excepcionPeriodoAcademicoConsultado) {
          // En caso de excepción se prepara el mensaje y se rechaza con nulo
          ctrl.mensajeErrorCargandoSolicitudes = $translate.instant("ERROR.CARGAR_PERIODO");
          // Se rechaza nulamente la consulta
          deferred.reject(null);
        });
        // Se devuelve el diferido que maneja la promesa
        return deferred.promise;
      }

      /**
       * [Función que consulta las sesiones almacenadas en la base de datos]
       * @return {[Promise]} [La colección de sesiones consultadas, o la excepción generada]
       */
      ctrl.consultarSesiones = function() {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();

        ctrl.obtenerPeriodo()
        .then(function(periodoAcademicoCorrespondiente) {
          var parametrosSesiones = $.param({
            //query: "SesionHijo.TipoSesion.Id.in:5|7,SesionPadre.periodo:" 
            //+ periodoAcademicoCorrespondiente.anio 
            //+ periodoAcademicoCorrespondiente.periodo,
            limit: 0
          });
          sesionesRequest.get("relacion_sesiones", parametrosSesiones)
          .then(function(sesionesDeFormalizacion) {
            if (sesionesDeFormalizacion.data) {
              deferred.resolve(sesionesDeFormalizacion.data);
            } else {
              deferred.reject(null);
            }
          }).catch(function(excepcionSesionesDeFormalizacion) {
            deferred.reject(excepcionSesionesDeFormalizacion);
          });
        })
        .catch(function(excepcionPeriodoAcademicoConsultado) {
          deferred.reject(excepcionPeriodoAcademicoConsultado);
        });
        // Se devuelve el diferido que maneja la promesa
        return deferred.promise;
      }

      /**
       * [Función que comprueba que la sesión permite la formalización de solicitudes]
       * @return {[type]} [description]
       */
      ctrl.comprobarPeriodoFormalizacion = function() {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();
        ctrl.consultarSesiones()
        .then(function(sesionesDeFormalizacion) {
          // Se define una colección que trabaje las fechas de formalización
          ctrl.coleccionFechasFormalizacion = [];
          // Se define la fecha actual de sesión
          var fechaActual = moment(new Date()).format("YYYY-MM-DD HH:mm");
          angular.forEach(sesionesDeFormalizacion, function(sesionDeFormalizacion) {
            if (sesionDeFormalizacion.SesionHijo.TipoSesion.Id == 5 || sesionDeFormalizacion.SesionHijo.TipoSesion.Id == 7) {
              var registroInicioDeFormalizacion = new Date(sesionDeFormalizacion.SesionHijo.FechaInicio);
              registroInicioDeFormalizacion.setTime(
                registroInicioDeFormalizacion.getTime()
                + registroInicioDeFormalizacion.getTimezoneOffset() * 60 * 1000
                );
              var fechaInicioDeFormalizacion = moment(registroInicioDeFormalizacion).format("YYYY-MM-DD HH:mm");
              var registroFinDeFormalizacion = new Date(sesionDeFormalizacion.SesionHijo.FechaFin);
              registroFinDeFormalizacion.setTime(
                registroFinDeFormalizacion.getTime()
                + registroFinDeFormalizacion.getTimezoneOffset() * 60 * 1000
                );
              var fechaFinDeFormalizacion = moment(registroFinDeFormalizacion).format("YYYY-MM-DD HH:mm");
              ctrl.coleccionFechasFormalizacion.push({
                fechaInicioDeFormalizacion: fechaInicioDeFormalizacion,
                fechaFinDeFormalizacion: fechaFinDeFormalizacion
              });
              if (fechaInicioDeFormalizacion <= fechaActual && fechaActual <= fechaFinDeFormalizacion) {
                deferred.resolve(true);
              }
            }
          });
          deferred.reject(false);
        })
        .catch(function(excepcionSesionesDeFormalizacion) {
          deferred.reject(false);
        });
        // Se devuelve el diferido que maneja la promesa
        return deferred.promise;
      }

      /**
       * [Función que autoriza la formalización del lado del usuario, dependiendo de si se encuentra en el periodo correspondiente]
       * @return {[void]} [El procedimiento de comprobar el periodo de formalización, o mostrar el mensaje de error]
       */
      ctrl.autorizarFormalizacionDeSolicitudes = function() {
        ctrl.comprobarPeriodoFormalizacion()
        .then(function(autorizacionPeriodoFormalizacion) {
          ctrl.actualizarCuadriculaSolicitudesParaFormalizar();
        })
        .catch(function(excepcionAutorizacionPeriodoFormalizacion) {
          // Se establece el mensaje de error porque no se encuentra en el periodo correspondiente
          angular.forEach(ctrl.coleccionFechasFormalizacion, function(intervaloDeFormalizacion) {
            console.log("fecha inicio formalización:", intervaloDeFormalizacion.fechaInicioDeFormalizacion);
            console.log("fecha fin formalización:", intervaloDeFormalizacion.fechaFinDeFormalizacion);
          });
          $scope.mensajeErrorCargandoSolicitudes = $translate.instant("ERROR.NO_PERIODO_FORMALIZACION");
          // Se apaga el mensaje de carga
          $scope.cargandoSolicitudes = false;
          // Se habilita el mensaje de error
          $scope.errorCargandoSolicitudes = true;
        });
      }

      /**
       * Se lanza la función que, una vez autorizada la formalización por periodo, actualiza el contenido de la cuadrícula
       */
      ctrl.autorizarFormalizacionDeSolicitudes();

      /**
       * [Función que de acuerdo al detalle de la solicitud, obtiene los datos del posgrado]
       * @param  {[type]} detalleSolicitud [El detalle de la solicitud con el formato de almacenado en la base de datos]
       * @return {[type]}                  [El objeto con los datos del posgrado]
       */
      ctrl.obtenerDatosDelPosgrado = function(detalleSolicitud) {
        return JSON.parse(detalleSolicitud.Descripcion.split("-")[1]);
      }

      /**
       * [Función que obtiene los espacios académicos por su nombre]
       * @param  {[Array]} detalleSolicitud [Tiene la colección de registros en el formato que se almacenan en la base de datos]
       * @return {[Array]}                  [Devuelve la colección de espacios académicos por nombre]
       */
      ctrl.obtenerEspaciosAcademicos = function(detalleSolicitud) {
        // Se prepara una colección que contendrá los espacios académicos
        var espaciosAcademicos = [];
        // Se define una variable que interprete el formato del detalle de la solicitud recibida
        // de modo que se obtenga la información de los espacios académicos (estos inician desde el índice 2)
        var detallePosgrado = detalleSolicitud.Descripcion.split("-").slice(2);
        // Se recorre la información de los espacios académicos almacenados
        angular.forEach(detallePosgrado, function(espacioAcademico) {
          // Como el formato de almacenado guarda en cada posición el objeto de espacio académico,
          // se pasa a formato JSON para obtener su contenido
          var objetoEspacioAcademico = JSON.parse(espacioAcademico);
          var informacionEspacioAcademico = {
            "id": objetoEspacioAcademico.Id,
            "codigo": objetoEspacioAcademico.CodigoAsignatura,
            "nombre": objetoEspacioAcademico.Nombre,
            "creditos": objetoEspacioAcademico.Creditos
          };
          // Se registra el espacio académico en la colección a modo de objeto
          espaciosAcademicos.push(informacionEspacioAcademico);
        });
        return espaciosAcademicos;
      }

      /**
       * [Función que según la solicitud, carga la información correspondiente a la respuesta de la misma]
       * @param  {[Object]} solicitudAsociada [La solicitud para obtener el identificador y cargar la información correspondiente a la respuesta]
       * @return {[Promise]}                   [La solicitud con la respuesta asociada dentro, o la excepción generada]
       */
      ctrl.consultarRespuestaSolicitud = function(solicitudAsociada) {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();
        // Se traen los datos de la respuesta respecto a la solicitud asociada, por medio del Id.
        poluxRequest.get("respuesta_solicitud", ctrl.obtenerParametrosSolicitudRespondida(solicitudAsociada.Id))
        .then(function(respuestaSolicitud) {
          // Se comprueba que se trajeron datos no vacíos
          if (respuestaSolicitud.data) {
            // Se adquieren los datos de la respuesta de la solicitud dentro de la misma solicitud
            solicitudAsociada.respuestaSolicitud = respuestaSolicitud.data[0];
            // Se resuelve la solicitud con los datos de la respuesta cargados
            deferred.resolve(solicitudAsociada);
          } else {
            // Se establece el mensaje de error con la nula existencia de datos
            $scope.mensajeErrorCargandoSolicitudes = $translate.instant("ERROR.SIN_SOLICITUDES_PARA_FORMALIZAR");
            ctrl.coleccionSolicitudesParaFormalizar.pop();
            deferred.resolve(null);
          }
        })
        .catch(function(excepcionRespuestaSolicitud) {
          // Se establece el mensaje de error con la excepción al cargar la respuesta de la solicitud
          $scope.mensajeErrorCargandoSolicitudes = $translate.instant("ERROR.CARGANDO_SOLICITUDES_PARA_FORMALIZAR");
          // Se rechaza la consulta con la excepción generada al momento de traer los datos
          deferred.reject(excepcionRespuestaSolicitud);
        });
        // Se devuelve el diferido que maneja la promesa
        return deferred.promise;
      }

      /**
       * [Función que según la solicitud, carga la información correspondiente al detalle de la misma]
       * @param  {[Object]} solicitudAsociada [La solicitud para obtener el identificador y cargar la información correspondiente al detalle]
       * @return {[Promise]}                   [La solicitud con el detalle asociado dentro, o la excepción generada]
       */
      ctrl.consultarDetalleSolicitud = function(solicitudAsociada) {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();
        // Se traen los datos del detalle respecto a la solicitud asociada, por medio del Id.
        poluxRequest.get("detalle_solicitud", ctrl.obtenerParametrosDetalleSolicitud(solicitudAsociada.Id))
        .then(function(detalleSolicitud) {
          // Se comprueba que se trajeron datos no vacíos
          if (detalleSolicitud.data) {
            // Se adquieren los datos del detalle de la solicitud dentro de la misma solicitud
            solicitudAsociada.detalleSolicitud = detalleSolicitud.data[0];
            // Se resuelve la solicitud con los datos de la respuesta cargados
            deferred.resolve(solicitudAsociada);
          } else {
            // Se establece el mensaje de error con la nula existencia de datos
            $scope.mensajeErrorCargandoSolicitudes = $translate.instant("ERROR.SIN_SOLICITUDES_PARA_FORMALIZAR");
            ctrl.coleccionSolicitudesParaFormalizar.pop();
            deferred.resolve(null);
          }
        })
        .catch(function(excepcionDetalleSolicitud) {
          // Se establece el mensaje de error con la excepción al cargar el detalle de la solicitud
          $scope.mensajeErrorCargandoSolicitudes = $translate.instant("ERROR.CARGANDO_SOLICITUDES_PARA_FORMALIZAR");
          // Se rechaza la consulta con la excepción generada al momento de traer los datos
          deferred.reject(excepcionDetalleSolicitud);
        });
        // Se devuelve el diferido que maneja la promesa
        return deferred.promise;
      }

      /**
       * [Función que recorre la base de datos de acuerdo al usuario en sesión y sus solicitudes en espera de ser formalizadas]
       * @return {[Promise]} [La colección de solicitudes para formalizar, o la excepción generada]
       */
      ctrl.consultarUsuariosConSolicitudes = function() {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();
        // Se establece un conjunto de procesamiento de solicitudes que reúne los procesos que deben cargarse antes de ofrecer funcionalidades
        var conjuntoProcesamientoDeSolicitudes = [];
        // Se establece una colección de solicitudes asociadas al usuario y que traen la información necesaria para formalizar
        ctrl.coleccionSolicitudesParaFormalizar = [];
        // Se traen los usuarios con solicitudes
        poluxRequest.get("usuario_solicitud", ctrl.obtenerParametrosUsuariosConSolicitudes())
        .then(function(usuariosConSolicitudes) {
          // Se comprueba que existen registros
          if (usuariosConSolicitudes.data) {
            // Se recorre la colección de usuarios con solicitudes
            angular.forEach(usuariosConSolicitudes.data, function(usuarioConSolicitud) {
              // Se agrega la solicitud asociada al usuario a la colección de solicitudes para formalizar
              ctrl.coleccionSolicitudesParaFormalizar.push(usuarioConSolicitud.SolicitudTrabajoGrado);
              // Se agrega el proceso de consulta hacia la respuesta de la solicitud
              conjuntoProcesamientoDeSolicitudes.push(ctrl.consultarRespuestaSolicitud(usuarioConSolicitud.SolicitudTrabajoGrado));
              // Se agrega el proceso de consulta hacia el detalle de la solicitud
              conjuntoProcesamientoDeSolicitudes.push(ctrl.consultarDetalleSolicitud(usuarioConSolicitud.SolicitudTrabajoGrado));
            });
            // Se garantiza que se cumplan todos los procesos agregados
            $q.all(conjuntoProcesamientoDeSolicitudes)
            .then(function(resultadoDelProcesamiento) {
              // Se resuelve la colección de solicitudes para formalizar
              deferred.resolve(ctrl.coleccionSolicitudesParaFormalizar);
            })
            .catch(function(excepcionDuranteProcesamiento) {
              // Se establece el mensaje de error con la excepción durante el procesamiento de las promesas
              $scope.mensajeErrorCargandoSolicitudes = $translate.instant("ERROR.CARGANDO_SOLICITUDES_PARA_FORMALIZAR");
              // Se rechaza la carga con la excepción generada
              deferred.reject(excepcionDuranteProcesamiento);
            });
          } else {
            // Se establece el mensaje de error con la nula existencia de datos
            $scope.mensajeErrorCargandoSolicitudes = $translate.instant("ERROR.SIN_SOLICITUDES_PARA_FORMALIZAR");
          }
        })
        .catch(function(excepcionUsuariosConSolicitudes) {
          // Se establece el mensaje de error con la excepción durante la consulta de usuarios con solicitudes
          $scope.mensajeErrorCargandoSolicitudes = $translate.instant("ERROR.CARGANDO_SOLICITUDES_PARA_FORMALIZAR");
          // Se rechaza la carga con la excepción generada
          deferred.reject(excepcionUsuariosConSolicitudes);
        });
        // Se devuelve el diferido que maneja la promesa
        return deferred.promise;
      }

      /**
       * [Función que carga el contenido de las funciones para formalizar]
       * @return {[Promise]} [La colección de solicitudes para formalizar, o la excepción generada]
       */
      ctrl.cargarSolicitudesParaFormalizar = function() {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();
        // Se llama a la función que consulta las solicitudes para formalizar del usuario
        ctrl.consultarUsuariosConSolicitudes()
        .then(function(coleccionSolicitudesParaFormalizar) {
          // Se comprueba que el resultado de la consulta contenga elementos
          if (coleccionSolicitudesParaFormalizar.length > 0) {
            // Se prepara una colección para manejar las solicitudes para formalizar que están registradas
            var solicitudesParaFormalizarRegistradas = [];
            // Se recorre el resultado de la consulta
            angular.forEach(coleccionSolicitudesParaFormalizar, function(solicitudParaFormalizar) {
              var espacios = "";
              angular.forEach(ctrl.obtenerEspaciosAcademicos(solicitudParaFormalizar.detalleSolicitud), function(espacio) {
                espacios += espacio.nombre + ", ";
              });
              espacios = espacios.substring(0, espacios.length - 2);
              // Se agregan los datos de cada item a la colección de solicitudes
              solicitudesParaFormalizarRegistradas.push({
                "idSolicitud": solicitudParaFormalizar.Id,
                "estadoSolicitud": solicitudParaFormalizar.respuestaSolicitud.EstadoSolicitud.Nombre,
                "descripcionSolicitud": solicitudParaFormalizar.respuestaSolicitud.EstadoSolicitud.Descripcion,
                "posgrado": ctrl.obtenerDatosDelPosgrado(solicitudParaFormalizar.detalleSolicitud).Nombre,
                // Se envía la transformación hacia objeto JSON de la descripción del detalle de la solicitud,
                // para obtener el objeto que contiene la información de los espacios académicos,
                // como argumento de la función que los ordena en un arreglo por el nombre
                "espaciosAcademicosSolicitados": ctrl.obtenerEspaciosAcademicos(solicitudParaFormalizar.detalleSolicitud),
                "espaciosStr": espacios
              });
            });
            // La promesa se resuelve con la colección de información lista para cargar
            deferred.resolve(solicitudesParaFormalizarRegistradas);
          } else {
            // Se entiende que no hay solicitudes para formalizar
            deferred.reject(null);
            $scope.mensajeErrorCargandoSolicitudes = $translate.instant("ERROR.SIN_SOLICITUDES_PARA_FORMALIZAR");
          }
        }).catch(function(excepcionCargandoUsuariosConSolicitudes) {
          // Ocurre cuando hay un error durante la consulta
          deferred.reject(null);
          $scope.mensajeErrorCargandoSolicitudes = $translate.instant("ERROR.CARGANDO_SOLICITUDES_PARA_FORMALIZAR");
        });
        // Se devuelve el diferido que maneja la promesa
        return deferred.promise;
      }

      /**
       * [Función que lanza la carga de las solicitudes para formalizar]
       * @return {[void]} [El procedimiento de actualización de la cuadrícula]
       */
      ctrl.actualizarCuadriculaSolicitudesParaFormalizar = function() {
        ctrl.cargarSolicitudesParaFormalizar()
        .then(function(solicitudesParaFormalizarRegistradas) {
          // Se apaga el mensaje de carga
          $scope.cargandoSolicitudes = false;
          // Se carga la información a la cuadrícula
          ctrl.cuadriculaSolicitudesParaFormalizar.data = solicitudesParaFormalizarRegistradas;
        })
        .catch(function(excepcionCargandoSolicitudesParaFormalizar) {
          // Se apaga el mensaje de carga
          $scope.cargandoSolicitudes = false;
          // Se habilita el mensaje de error
          $scope.errorCargandoSolicitudes = true;
        });
      }

      /**
       * [Función que carga la fila asociada según la selección del usuario]
       * @param  {[row]} filaAsociada [Es la solicitud que el usuario seleccionó]
       */
      $scope.cargarFila = function(filaAsociada) {
        ctrl.formalizarSolicitudSeleccionada(filaAsociada.entity);
      };

      /**
       * [Función que formaliza la solicitud a petición del usuario]
       * @param  {[row]} solicitudSeleccionada [La solicitud que el usuario desea formalizar]
       */
      ctrl.formalizarSolicitudSeleccionada = function(solicitudSeleccionada) {
        swal({
          title: $translate.instant("CONFORMACION_FORMALIZAR_SOLICITUD"),
          text: $translate.instant("INFORMACION_FORMALIZACION", {
            // Se cargan datos de la solicitud para que el usuario pueda verificar antes de confirmar
            idSolicitud: solicitudSeleccionada.idSolicitud,
            nombreEstado: solicitudSeleccionada.estadoSolicitud,
            nombrePosgrado: solicitudSeleccionada.posgrado
          }),
          type: "info",
          confirmButtonText: $translate.instant("ACEPTAR"),
          cancelButtonText: $translate.instant("CANCELAR"),
          showCancelButton: true
        })
        .then(function(confirmacionDelUsuario) {
          // Se valida que el usuario haya confirmado la formalización
          if (confirmacionDelUsuario.value) {
            // Se detiene la visualización de solicitudes mientras se formaliza
            ctrl.cuadriculaSolicitudesParaFormalizar.data = [];
            // Se inicia la carga del formulario mientras se formaliza
            $scope.cargandoSolicitudes = true;
            // Se lanza la transacción
            ctrl.registrarFormalizacion(solicitudSeleccionada)
            .then(function(respuestaFormalizarSolicitud) {
              // Se detiene la carga
              $scope.cargandoSolicitudes = false;
              // Se verifica que la respuesta es exitosa
              if (respuestaFormalizarSolicitud.data[0] === "Success") {
                // Se despliega el mensaje que confirma el registro de la formalización
                swal(
                  $translate.instant("FORMALIZAR_SOLICITUD"),
                  $translate.instant("SOLICITUD_FORMALIZADA"),
                  'success'
                );
              } else {
                // Se despliega el mensaje que muestra el error traído desde la transacción
                swal(
                  $translate.instant("FORMALIZAR_SOLICITUD"),
                  $translate.instant(response.data[1]),
                  'warning'
                );
              }
              // Se actualiza la información de la cuadrícula
              ctrl.actualizarCuadriculaSolicitudesParaFormalizar();
            })
            .catch(function(excepcionFormalizarSolicitud) {
              // Se detiene la carga
              $scope.cargandoSolicitudes = false;
              // Se despliega el mensaje de error durante la transacción
              swal(
                $translate.instant("FORMALIZAR_SOLICITUD"),
                $translate.instant("ERROR.FORMALIZAR_SOLICITUD"),
                'warning'
              );
              // Se actualiza la información de la cuadrícula
              ctrl.actualizarCuadriculaSolicitudesParaFormalizar();
            });
          }
        });
      }

      /**
       * [Función que realiza la transacción de registro de la formalización]
       * @return {[promise]} [El resultado de efectuar la transacción]
       */
      ctrl.registrarFormalizacion = function(solicitudSeleccionada) {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();
        // Se prepara una colección que cargue las solicitudes actualizadas
        ctrl.coleccionSolicitudesActualizadas = [];
        // Se recorre la colección de solicitudes para formalizar
        angular.forEach(ctrl.coleccionSolicitudesParaFormalizar, function(solicitudParaFormalizar) {
          // Se utiliza la respuesta de la solicitud que fue cargada a la colección de solicitudes para formalizar,
          // Se actualizan sus campos y se envían para registrarse
          // Se verifica si la solicitud es la seleccionada
          if (solicitudParaFormalizar.Id == solicitudSeleccionada.idSolicitud) {
            // Se estudia el estado de la solicitud
            // Se verifica si la solicitud está aprobada exenta de pago (7)
            if (solicitudParaFormalizar.respuestaSolicitud.EstadoSolicitud.Id == 7) {
              // Entonces su nuevo estado será formalizada exenta de pago (9)
              solicitudParaFormalizar.respuestaSolicitud.Justificacion = "Su solicitud ha sido formalizada con exención de pago";
              solicitudParaFormalizar.respuestaSolicitud.EstadoSolicitud.Id = 9;
            // En caso contrario, la solicitud está aprobada no exenta de pago (8)
            } else {
              // Entonces su nuevo estado será formalizada no exenta de pago (10)
              solicitudParaFormalizar.respuestaSolicitud.Justificacion = "Su solicitud ha sido formalizada con condiciones económicas";
              solicitudParaFormalizar.respuestaSolicitud.EstadoSolicitud.Id = 10;
            }
            solicitudParaFormalizar.respuestaSolicitud.Activo = true;
          } else {
            solicitudParaFormalizar.respuestaSolicitud.Justificacion = "Su solicitud ha quedado sin formalizar debido a que ya formalizó una solicitud";
            solicitudParaFormalizar.respuestaSolicitud.EstadoSolicitud.Id = 11;
            solicitudParaFormalizar.respuestaSolicitud.Activo = false;
          }
          ctrl.coleccionSolicitudesActualizadas.push(solicitudParaFormalizar.respuestaSolicitud);
        });

        // Se define el objeto para enviar como información para actualizar
        ctrl.informacionParaActualizar = {
          "SolicitudesActualizadas": ctrl.coleccionSolicitudesActualizadas
        };

        // Se realiza la petición post hacia la transacción con la información para formalizar la solicitud
        poluxRequest.post("tr_formalizar_solicitud", ctrl.informacionParaActualizar)
        .then(function(respuestaFormalizarSolicitud) {
          // Se resuelve la respuesta de realizar la formalización de la solicitud
          deferred.resolve(respuestaFormalizarSolicitud);
        })
        .catch(function(excepcionFormalizarSolicitud) {
          // Se rechaza la excepción que ocurrió durante la transacción
          deferred.reject(excepcionFormalizarSolicitud);
        });
        // Se devuelve el diferido que maneja la promesa
        return deferred.promise;
      }

    });