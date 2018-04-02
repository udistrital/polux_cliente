'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:MateriasPosgradoFormalizarSolicitudCtrl
 * @description
 * # MateriasPosgradoFormalizarSolicitudCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('MateriasPosgradoFormalizarSolicitudCtrl', function ($q, $location, $translate, $scope, academicaRequest, poluxRequest) {
    var ctrl = this;
    
    // El Id del usuario depende de la sesión
    $scope.userId = "20112020004";
    
    // En el inicio de la página, se están cargando las solicitudes
    $scope.cargandoSolicitudes = true;
    $scope.mensajeCargandoSolicitudes = $translate.instant("LOADING.CARGANDO_SOLICITUDES");

    // Se define el objeto que carga las solicitudes para formalizar y que serán visualizadas
    ctrl.cuadriculaSolicitudesParaFormalizar = {};

    // Se configura el botón por el cual el usuario podrá formalizar la solicitud
    $scope.botonFormalizarSolicitud = [
      {
        clase_color: "ver",
        clase_css: "fa fa-eye fa-lg  faa-shake animated-hover",
        titulo: $translate.instant('BTN.VER_DETALLES'),
        operacion: 'verDetallesSolicitud',
        estado: true
      }
    ];

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
        name: 'espaciosAcademicosSolicitados',
        displayName: $translate.instant("ESPACIOS_ACADEMICOS"),
        width: '31%',
        cellTemplate: '<div style="margin-top: 5px;"><div ng-repeat="espacioAcademico in row.entity[col.field]">{{espacioAcademico.nombre}}</div></div>'
    	},
    	{
        name: 'formalizarSolicitud',
        displayName: $translate.instant("FORMALIZAR_SOLICITUD"),
        width: '15%',
        cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila)" grupobotones="grid.appScope.botonFormalizarSolicitud" fila="row"></btn-registro>'
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
				 * El estado de la solicitud que se encuentre en los estados 7 u 8 corresponde a:
				 * 7 - Aprobada exenta de pago
				 * 8 - Aprobada no exenta de pago
				 * Tabla: estado_solicitud
				 */
				+ ",EstadoSolicitud.Id.in:7|8" 
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
    		query: "DetalleTipoSolicitud.Id:37" 
    		+ ",SolicitudTrabajoGrado.Id:" + idSolicitudTrabajoGrado,
				limit: 1
        });
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
  				$scope.mensajeErrorCargandoSolicitudes = $translate.instant("ERROR.SIN_SOLICITUDES");
  			}
  		})
  		.catch(function(excepcionRespuestaSolicitud) {
  			// Se establece el mensaje de error con la excepción al cargar la respuesta de la solicitud
  			$scope.mensajeErrorCargandoSolicitudes = $translate.instant("ERROR.CARGA_SOLICITUDES");
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
  				$scope.mensajeErrorCargandoSolicitudes = $translate.instant("ERROR.SIN_SOLICITUDES");
  			}
  		})
  		.catch(function(excepcionDetalleSolicitud) {
  			// Se establece el mensaje de error con la excepción al cargar el detalle de la solicitud
  			$scope.mensajeErrorCargandoSolicitudes = $translate.instant("ERROR.CARGA_SOLICITUDES");
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
  	ctrl.cargarUsuariosConSolicitudes = function() {
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
	  				$scope.mensajeErrorCargandoSolicitudes = $translate.instant("ERROR.CARGA_SOLICITUDES");
	  				// Se rechaza la carga con la excepción generada
	  				deferred.reject(excepcionUsuariosConSolicitudes);
	  			});
  			} else {
  				// Se establece el mensaje de error con la nula existencia de datos
  				$scope.mensajeErrorCargandoSolicitudes = $translate.instant("ERROR.SIN_SOLICITUDES");
  			}
  		})
  		.catch(function(excepcionUsuariosConSolicitudes) {
  			// Se establece el mensaje de error con la excepción durante la consulta de usuarios con solicitudes
	  		$scope.mensajeErrorCargandoSolicitudes = $translate.instant("ERROR.CARGA_SOLICITUDES");
	  		// Se rechaza la carga con la excepción generada
  			deferred.reject(excepcionUsuariosConSolicitudes);
  		});
  		return deferred.promise;
  	}

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
  	 * Se lanza la función para que puedan visualizarse las solicitudes para formalizar,
  	 * una vez el estudiante en sesión esté en este escenario.
  	 */
    ctrl.cargarUsuariosConSolicitudes()
    .then(function(coleccionSolicitudesParaFormalizar){
    	$scope.cargandoSolicitudes = false;
    	if (coleccionSolicitudesParaFormalizar.length > 0) {
    		var solicitudesParaFormalizarRegistradas = [];
        angular.forEach(coleccionSolicitudesParaFormalizar, function(solicitudParaFormalizar) {
          solicitudesParaFormalizarRegistradas.push({
            "idSolicitud": solicitudParaFormalizar.Id,
            "estadoSolicitud": solicitudParaFormalizar.respuestaSolicitud.EstadoSolicitud.Nombre,
            "descripcionSolicitud": solicitudParaFormalizar.respuestaSolicitud.EstadoSolicitud.Descripcion,
            "posgrado": ctrl.obtenerDatosDelPosgrado(solicitudParaFormalizar.detalleSolicitud).Nombre,
            // Se envía la transformación hacia objeto JSON de la descripción del detalle de la solicitud,
            // para obtener el objeto que contiene la información de los espacios académicos,
            // como argumento de la función que los ordena en un arreglo por el nombre
            "espaciosAcademicosSolicitados": ctrl.obtenerEspaciosAcademicos(solicitudParaFormalizar.detalleSolicitud),
          });
        });
        ctrl.cuadriculaSolicitudesParaFormalizar.data = solicitudesParaFormalizarRegistradas;
    	} else {
    		$scope.mensajeErrorCargandoSolicitudes = $translate.instant("ERROR.SIN_SOLICITUDES_PARA_FORMALIZAR");
    	}
    }).catch(function(excepcionCargandoUsuariosConSolicitudes) {
    	$scope.cargandoSolicitudes = false;
    	$scope.mensajeErrorCargandoSolicitudes = $translate.instant("ERROR.CARGA_SOLICITUDES");
    });

  });