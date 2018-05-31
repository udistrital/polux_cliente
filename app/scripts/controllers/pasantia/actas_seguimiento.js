'use strict';

/**
 * @ngdoc controller
 * @name poluxClienteApp.controller:PasantiaActasSeguimientoCtrl
 * @description
 * # PasantiaActasSeguimientoCtrl
 * Controller of the poluxClienteApp
 * Submodulo de la modalidad de pasantia que permite al director registrar las actas de seguimiento
 * de una pasantia.
 * @requires services/poluxClienteApp.service:tokenService 
 * @requires services/poluxClienteApp.service:nuxeoService
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires services/academicaService.service:academicaRequest
 * @requires services/poluxService.service:poluxRequest
 * @requires $q
 * @requires $scope
 * @property {String} userDocument Documento del usuario que se loguea en el sistema. 
 * @property {boolean} loadingTrabajos Booleano que permite identificar cuando los trabajos de grado esta cargando.
 * @property {boolean} errorCargando Booleano que permite identificar cuando ocurre un error cargando los trabajos de grado de la modalidad de pasantia.
 * @property {String} mensajeCargandoTrabajos Mensaje que se muesrtra mientras se estan cargando los trabajos de la modalidad de pasantia.
 * @property {String} mensajeErrorCargando Mensaje que se muestra cuando ocurre un error cargando los trabajos de grado de la modalidad de pasantia.
 * @property {Array} trabajosPasantia Contiene los trabajos de pasantia asociados a un docente
 * @property {Object} gridOptions Contiene las opciones del ui-grid que muestra los trabajos de grado de pasantia
 */
angular.module('poluxClienteApp')
  .controller('PasantiaActasSeguimientoCtrl', function (token_service,poluxRequest,academicaRequest,$q,$translate,nuxeo,$scope) {
  var ctrl = this;

  ctrl.mensajeCargandoTrabajos = $translate.instant("LOADING.CARGANDO_TRABAJOS_DE_GRADO_PASANTIA");

  token_service.token.documento = "79647592";
  ctrl.userDocument = token_service.token.documento;

  $scope.botones = [
    { clase_color: "ver", clase_css: "fa fa-edit fa-lg  faa-shake animated-hover", titulo: $translate.instant('PASANTIA.REGISTRAR_ACTAS_SEGUIMIENTO'), operacion: 'ver', estado: true },
  ];

  ctrl.gridOptions = {
    paginationPageSizes: [5,10,15, 20, 25],
    paginationPageSize: 10,
    enableFiltering: true,
    enableSorting: true,
    enableSelectAll: false,
    useExternalPagination: false,
  };

  ctrl.gridOptions.columnDefs = [
    {
      name: 'TrabajoGrado.Titulo',
      displayName: $translate.instant('NOMBRE'),
      width:'40%',
    }, {
      name: 'TrabajoGrado.NombresEstudiantes',
      displayName: $translate.instant('Estudiantes'),
      width:'40%',
    }, {
      name: 'Acciones',
      displayName: $translate.instant('ACCIONES'),
      width:'20%',
      type: 'boolean',
      cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>'
    }
  ];

  ctrl.getEstudiantesPasantia = function(trabajoGrado){
    var defer = $q.defer()
    var getDatosEstudiante = function(codigoEstudiante){
      var defer = $q.defer();
      academicaRequest.get("datos_basicos_estudiante",[codigoEstudiante])
      .then(function(responseDatosBasicos){
        if (!angular.isUndefined(responseDatosBasicos.data.datosEstudianteCollection.datosBasicosEstudiante)) {
          defer.resolve(responseDatosBasicos.data.datosEstudianteCollection.datosBasicosEstudiante[0]);
        }else{
          defer.reject("No hay datos del estudiante");
        }
      })
      .catch(function(error){
        defer.reject(error);
      });
      return defer.promise;
    }

    //Consultar los estudiantes asociados al trabajo de grado
    var parametrosEstudiantes = $.param({
      query:"TrabajoGrado:"+trabajoGrado.Id,
      limit:0
    });
    poluxRequest.get("estudiante_trabajo_grado", parametrosEstudiantes)
    .then(function(responseEstudiantes){
      if(responseEstudiantes.data != null){
        var promises = [];
        angular.forEach(responseEstudiantes.data, function(estudiante){
          promises.push(getDatosEstudiante(estudiante.Estudiante));
        });
        $q.all(promises)
        .then(function(estudiantes){
          trabajoGrado.Estudiantes = estudiantes;
          trabajoGrado.NombresEstudiantes = "";
          angular.forEach(trabajoGrado.Estudiantes,function(estudiante){
            trabajoGrado.NombresEstudiantes += " - "+"("+estudiante.codigo+") "+estudiante.nombre
          });
          trabajoGrado.NombresEstudiantes = trabajoGrado.NombresEstudiantes.substring(2)
          defer.resolve();
        })
        .catch(function(error){
          ctrl.mensajeErrorCargando = $translate.instant("ERROR.CARGAR_DATOS_ESTUDIANTES");
          defer.reject(error);
        });
      }else{
        ctrl.mensajeErrorCargando = $translate.instant("ERROR.CARGAR_DATOS_ESTUDIANTES");
        defer.reject("No se encuentran estudiantes en el trabajo");
      }
    })
    .catch(function(error){
      ctrl.mensajeErrorCargando = $translate.instant("");
      defer.reject(error);
    });
    return defer.promise;
  }

  ctrl.getTrabajosGradoPasantia = function(userDocument){
    //Se consultan los trabajos de grado de la modalidad de pasantia de los que el docente es director
    // y que se encuentren en el estado de cursado
    ctrl.loadingTrabajos = true;
    var parametrosDirector = $.param({
      query:"Activo:True,TrabajoGrado.Modalidad.Id:1,TrabajoGrado.EstadoTrabajoGrado.Id:13,RolTrabajoGrado:1,Usuario:"+userDocument,
      limit:0
    });
    poluxRequest.get("vinculacion_trabajo_grado",parametrosDirector)
    .then(function(responsePasantias){
      if(responsePasantias.data != null){
        ctrl.trabajosPasantia = responsePasantias.data;
        var promises = [];
        angular.forEach(ctrl.trabajosPasantia,function(pasantia){
          promises.push(ctrl.getEstudiantesPasantia(pasantia.TrabajoGrado));
        });
        $q.all(promises)
        .then(function(){
          console.log("trabajos", ctrl.trabajosPasantia);
          ctrl.gridOptions.data = ctrl.trabajosPasantia;
          ctrl.loadingTrabajos = false;
        })
        .catch(function(error){
          console.log(error);
          ctrl.errorCargando = true;
          ctrl.loadingTrabajos = false;
        });
      }else{
        console.log("No hay trabajos asociados");
        ctrl.mensajeErrorCargando = $translate.instant("PASANTIA.ERROR.DOCENTE_DIRECTOR_SIN_PASANTIAS");
        ctrl.errorCargando = true;
        ctrl.loadingTrabajos = false;
      } 
    })
    .catch(function(error){
      console.log(error);
      ctrl.mensajeErrorCargando = $translate.instant("PASANTIA.ERROR.CARGANDO_TRABAJOS_PASANTIA");
      ctrl.errorCargando = true;
      ctrl.loadingTrabajos = false;
    });
  }
  //Se cargan trabajos de grado de modalidad de pasantia
  ctrl.getTrabajosGradoPasantia(ctrl.userDocument);

  });
