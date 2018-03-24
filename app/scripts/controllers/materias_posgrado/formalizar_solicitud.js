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
    
    $scope.userId = "20112020004";
    
    $scope.solicitudesCargadas = true;
    $scope.msgCargandoSolicitudes = $translate.instant("LOADING.CARGANDO_SOLICITUDES");

    ctrl.propiedadesCuadriculaSolicitudes = {};
    ctrl.propiedadesCuadriculaSolicitudes.columnDefs = [
    	{
        name: 'solicitud',
        displayName: $translate.instant("SOLICITUD"),
        width: '10%'
    	},
    	{
        name: 'estado',
        displayName: $translate.instant("ESTADO"),
        width: '18%'
    	},
    	{
        name: 'descripcion',
        displayName: $translate.instant("DESCRIPCION"),
        width: '18%'
    	},
    	{
        name: 'posgrado',
        displayName: $translate.instant("POSGRADO"),
        width: '18%'
    	},
    	{
        name: 'espaciosAcademicosSolicitados',
        displayName: $translate.instant("ESPACIOS_ACADEMICOS"),
        width: '18%'
    	},
    	{
        name: 'opciones',
        displayName: $translate.instant("OPCIONES"),
        width: '15%',
        cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila)" grupobotones="grid.appScope.opcionesSolicitud" fila="row"></btn-registro>'
    	}
    ];

    // Yo pensaría en validar desde aquí las fechas de formalización
    // Y dependiendo de eso se habilitan las opciones

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
    		/**
				 * El estado de la solicitud que se encuentre en los estados 7 u 8 corresponde a:
				 * 7 - Aprobada exenta de pago
				 * 8 - Aprobada no exenta de pago
				 * Tabla: estado_solicitud
				 */
    		query: "SolicitudTrabajoGrado.Id:" 
				+ idSolicitudTrabajoGrado
				+ ",EstadoSolicitud.Id.in:7|8" 
				+ ",Activo:true",
				limit: 0
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
				limit: 0
        });
    }

    /**
     * [Función que obtiene los espacios académicos por su nombre]
     * @param  {[Array]} detalleSolicitud [Tiene la colección de registros en el formato que se almacenan en la base de datos]
     * @return {[Array]}                  [Devuelve la colección de espacios académicos por nombre]
     */
  	ctrl.obtenerEspaciosAcademicos = function(detalleSolicitud) {
  		// Se prepara una colección que contendrá los espacios académicos
  		var espaciosAcademicos = [];
  		// Se recorre la información de los espacios académicos almacenados
      angular.forEach(detalleSolicitud, function(espacioAcademico) {
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

  	ctrl.getDetalleSolicitud = function(solicitud){
  		var defer = $q.defer();
  		var detalleParams = $.param({
  			query:"DetalleTipoSolicitud.Id:37,SolicitudTrabajoGrado.Id:" + solicitud.Id,
  			limit:1
  		});
  		poluxRequest.get("detalle_solicitud", detalleParams)
  		.then(function(detalleSolicitud) {
  			if (detalleSolicitud.data) {
  				solicitud.detalle = detalleSolicitud.data[0];
					defer.resolve(detalleSolicitud.data);
  			} else {
  				defer.reject(null);
  			}
  		})
  		//.catch()
  		return defer.promise;
  	}

  	ctrl.getRespuestaSolicitud = function(solicitud){
  		var defer = $q.defer();
  		var respuestaParams = $.param({
  			query:"Activo:True,SolicitudTrabajoGrado.Id:"+solicitud.Id,
  			limit:1
  		});
  		poluxRequest.get("respuesta_solicitud",respuestaParams)
  		.then(function(respuesta){
  			solicitud.respuesta = respuesta.data[0];
  			defer.resolve(solicitud);
  		})
  		//.catch()
  		return defer.promise;
  	}

  	ctrl.cargarUsuariosConSolicitudes = function() {
  		// Se trae el diferido desde el servicio para manejar las promesas
  		var deferred = $q.defer();
  		// Se establece un conjunto de procesamiento de solicitudes que reúne los procesos que deben cargarse antes de ofrecer funcionalidades
  		var conjuntoProcesamientoDeSolicitudes = [];
  		// Se establece una colección de solicitudes asociadas al usuario y que traen la información necesaria para formalizar
  		ctrl.solicitudes = [];
    	// Se traen los usuarios con solicitudes
  		poluxRequest.get("usuario_solicitud", ctrl.obtenerParametrosUsuariosConSolicitudes())
  		.then(function(usuariosConSolicitudes) {
	  		// Se comprueba que existen registros
  			if (usuariosConSolicitudes.data) {
	  			// Se recorre la colección de usuarios con solicitudes
  				angular.forEach(usuariosConSolicitudes.data, function(usuarioConSolicitud) {
	  				ctrl.solicitudes.push(usuarioConSolicitud.SolicitudTrabajoGrado);
	  				conjuntoProcesamientoDeSolicitudes.push(ctrl.getRespuestaSolicitud(usuarioConSolicitud.SolicitudTrabajoGrado));
	  				conjuntoProcesamientoDeSolicitudes.push(ctrl.getDetalleSolicitud(usuarioConSolicitud.SolicitudTrabajoGrado));
	  			});
	  			$q.all(conjuntoProcesamientoDeSolicitudes)
	  			.then(function(){
	  				console.log(ctrl.solicitudes);
	  				deferred.resolve(ctrl.solicitudes);
	  			})
	  			.catch(function(excepcionUsuariosConSolicitudes) {
	  				$scope.msgErrorCargandoSolicitudes = $translate.instant("ERROR.CARGA_SOLICITUDES");
	  				deferred.reject(excepcionUsuariosConSolicitudes);
	  			});
  			} else {
  				$scope.msgErrorCargandoSolicitudes = $translate.instant("ERROR.SIN_SOLICITUDES");
  			}
  		})
  		.catch(function(excepcionUsuariosConSolicitudes) {
  			$scope.msgErrorCargandoSolicitudes = $translate.instant("ERROR.CARGA_SOLICITUDES");
  			deferred.reject(excepcionUsuariosConSolicitudes);
  		});
  		return deferred.promise;
  	}

  	ctrl.cargarSolicitudesRespondidas = function() {
  		var deferred = $q.defer();
  		ctrl.coleccionSolicitudesParaFormalizar = [];
  		angular.forEach(ctrl.coleccionUsuariosConSolicitudes, function(usuarioConSolicitud) {
  			poluxRequest.get("respuesta_solicitud", ctrl.obtenerParametrosSolicitudRespondida(usuarioConSolicitud.SolicitudTrabajoGrado.Id))
	  		.then(function(solicitudesRespondidas) {
	  			if (solicitudesRespondidas.data) {
	  				angular.forEach(solicitudesRespondidas.data, function(solicitudRespondida) {
	  					ctrl.cargarDetalleSolicitud(usuarioConSolicitud.SolicitudTrabajoGrado.Id)
		  				.then(function(detalleSolicitud) {
		  					// Se aplica la transformación hacia objeto JSON de la descripción del detalle de la solicitud,
								// para obtener el objeto que contiene la información del posgrado
								var datosDelPosgrado = JSON.parse(detalleSolicitud[0].Descripcion.split("-")[1]);
								ctrl.coleccionSolicitudesParaFormalizar.push({
									"idSolicitud": solicitudRespondida.Id,
									"estadoSolicitud": solicitudRespondida.EstadoSolicitud.Nombre,
									"descripcionSolicitud": solicitudRespondida.EstadoSolicitud.Descripcion,
									"posgrado": datosDelPosgrado.Nombre,
									// Se envía la transformación hacia objeto JSON de la descripción del detalle de la solicitud,
									// para obtener el objeto que contiene la información de los espacios académicos,
									// como argumento de la función que los ordena en un arreglo por el nombre
									"espaciosAcademicosSolicitados": ctrl.obtenerEspaciosAcademicos(detalleSolicitud[0].Descripcion.split("-").slice(2)),
								});
		  				})
		  				.catch(function(excepcionDetalleSolicitud) {
		  					deferred.reject(excepcionDetalleSolicitud);
		  				});
	  				});
	  			}
	  		})
	  		.catch(function(excepcionSolicitudesRespondidas) {
	  			deferred.reject(excepcionSolicitudesRespondidas);
	  		});
  		});
  		deferred.resolve(ctrl.coleccionSolicitudesParaFormalizar);
  		return deferred.promise;
  	}

  	ctrl.cargarDetalleSolicitud = function(idSolicitudTrabajoGrado) {
  		var deferred = $q.defer();
  		poluxRequest.get("detalle_solicitud", ctrl.obtenerParametrosDetalleSolicitud(idSolicitudTrabajoGrado))
  		.then(function(detalleSolicitud) {
  			if (detalleSolicitud.data) {
					deferred.resolve(detalleSolicitud.data);
  			} else {
  				deferred.reject(null);
  			}
  		})
  		.catch(function(excepcionDetalleSolicitud) {
  			deferred.reject(excepcionDetalleSolicitud);
  		});
  		return deferred.promise;
  	}

  	ctrl.cargarSolicitudesFormalizar = function() {
  		
  	}

  	/**
  	 * [Función que carga las solicitudes asociadas al usuario en sesión]
  	 * @return {[type]} [nada por el momento]
  	 */
    ctrl.cargarSolicitudesPendientes = function() {
    	var deferred = $q.defer();
    	ctrl.coleccionSolicitudesParaFormalizar = [];
    	// Se traen los usuarios con solicitudes
	  	poluxRequest.get("usuario_solicitud", ctrl.obtenerParametrosUsuariosConSolicitudes())
	  	.then(function(usuariosConSolicitudes) {
	  		// Se comprueba que existen registros
	  		if (usuariosConSolicitudes.data) {
	  			// Una vez se sabe que existen registros, se detiene la animación de cargando
	  			$scope.solicitudesCargadas = false;
	  			// Se recorre la colección de usuarios con solicitudes
	  			angular.forEach(usuariosConSolicitudes.data, function(usuarioConSolicitud) {
	  				// Se comprueba que el usuario consultado es el usuario en sesión
	  				if (usuarioConSolicitud.Usuario == $scope.userId) {
	  					// Se almacena el id de la solicitud para trabajo de grado que corresponde
	  					var idSolicitudTrabajoGrado = usuarioConSolicitud.SolicitudTrabajoGrado.Id;
	  					// Se traen las solicitudes respondidas de acuerdo al id de la solicitud para trabajo de grado
	  					poluxRequest.get("respuesta_solicitud", ctrl.obtenerParametrosSolicitudRespondida(idSolicitudTrabajoGrado))
	  					.then(function(solicitudesRespondidas) {
	  						// Se comprueba que existen registros
	  						if (solicitudesRespondidas.data) {
	  							// Se recorre la colección de solicitudes respondidas
	  							angular.forEach(solicitudesRespondidas.data, function(solicitudRespondida) {
	  								// Se trae el detalle de la solicitud asociada al id de la solicitud para trabajo de grado
	  								poluxRequest.get("detalle_solicitud", ctrl.obtenerParametrosDetalleSolicitud(idSolicitudTrabajoGrado))
	  								.then(function(detalleSolicitud) {
	  									// Se comprueba que existen registros
	  									if (detalleSolicitud.data) {
	  										// Se aplica la transformación hacia objeto JSON de la descripción del detalle de la solicitud,
	  										// para obtener el objeto que contiene la información del posgrado
	  										var datosDelPosgrado = JSON.parse(detalleSolicitud.data[0].Descripcion.split("-")[1]);
			  								ctrl.coleccionSolicitudesParaFormalizar.push({
			  									"idSolicitud": solicitudRespondida.Id,
			  									"estadoSolicitud": solicitudRespondida.EstadoSolicitud.Nombre,
			  									"descripcionSolicitud": solicitudRespondida.EstadoSolicitud.Descripcion,
			  									"posgrado": datosDelPosgrado.Nombre,
			  									// Se envía la transformación hacia objeto JSON de la descripción del detalle de la solicitud,
			  									// para obtener el objeto que contiene la información de los espacios académicos,
			  									// como argumento de la función que los ordena en un arreglo por el nombre
			  									"espaciosAcademicosSolicitados": ctrl.obtenerEspaciosAcademicos(detalleSolicitud.data[0].Descripcion.split("-").slice(2)),
			  								});
	  									} else {
								  			/**
								  			 * El detalle de la solicitud asociada es nula
								  			 */
								  			$scope.errorCargandoSolicitudes = true;
								    		$scope.msgErrorCargandoSolicitudes = $translate.instant("ERROR.SIN_SOLICITUDES");
	  									}
	  								})
	  								.catch(function(excepcionDetalleSolicitud) {
	  									/**
	  						 				* Error al consultar la tabla respuesta_solicitud
	  						 			*/
	  									$scope.errorCargandoSolicitudes = true;
	    								$scope.msgErrorCargandoSolicitudes = $translate.instant("ERROR.CARGA_SOLICITUDES");
	  								});
	  							});
	  						}
	  					})
	  					.catch(function(excepcionSolicitudesRespondidas) {
	  						/**
	  						 * Error al consultar la tabla respuesta_solicitud
	  						 */
	  						$scope.errorCargandoSolicitudes = true;
	    					$scope.msgErrorCargandoSolicitudes = $translate.instant("ERROR.CARGA_SOLICITUDES");
	  					});
	  				}
	  			});
	  			deferred.resolve(ctrl.coleccionSolicitudesParaFormalizar);
	  			return deferred.promise;
	  		} else {
	  			/**
	  			 * La información de los usuarios consultados es nula
	  			 */
	  			$scope.solicitudesCargadas = false;
	  			$scope.errorCargandoSolicitudes = true;
	    		$scope.msgErrorCargandoSolicitudes = $translate.instant("ERROR.SIN_SOLICITUDES");
	  		}
	  	})
	  	.catch(function(excepcionUsuariosConSolicitudes) {
	  		/**
	  		 * Error al consultar hacia la tabla usuario_solicitud
	  		 */
	  		$scope.solicitudesCargadas = false;
	  		$scope.errorCargandoSolicitudes = true;
	    	$scope.msgErrorCargandoSolicitudes = $translate.instant("ERROR.CARGA_SOLICITUDES");
	  	});
	  	return deferred.promise;
    }
    
    ctrl.mostrarSolicitudesParaFormalizar = function() {
    	ctrl.coleccionSolicitudesParaFormalizar = [];
    	ctrl.cargarUsuariosConSolicitudes()
    	.then(function(usuariosConSolicitudes) {
    		ctrl.cargarSolicitudesRespondidas()
	    	.then(function(solicitudesRespondidas) {
	    		$scope.solicitudesCargadas = false;
	    		ctrl.propiedadesCuadriculaSolicitudes.data = solicitudesRespondidas;
	    		console.log(solicitudesRespondidas);
	    	})
	    	.catch(function(excepcionSolicitudesRespondidas) {
	    		
	    	});
    	})
    	.catch(function(excepcionUsuariosConSolicitudes) {
    		
    	});	
    }

    //ctrl.mostrarSolicitudesParaFormalizar();
    ctrl.cargarUsuariosConSolicitudes().then(function(resolve){
    	console.log("respuesta", resolve);
    	console.log(ctrl.solicitudes)
    });

  });