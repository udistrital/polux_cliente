'use strict';

/**
 * @ngdoc controller
 * @name poluxClienteApp.controller:GeneralRegistrarNotaCtrl
 * @description
 * # GeneralRegistrarNotaCtrl
 * Controller of the poluxClienteApp
 * Controlador donde el docente puede registrar la nota de un trabajo de grado luego de que este ha sido sustentado.
 * @requires services/poluxClienteApp.service:tokenService
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires services/academicaService.service:academicaRequest
 * @requires services/poluxService.service:poluxRequest
 * @requires $q
 * @requires $scope
 * @property {String} documento Documento del docente que entra al modulo y que va a registrar las notas
 * @property {Boolean} cargandoTrabajos Bandera que muestra el loading y permite identificar cuando se cargaron todos los trabajos
 * @property {String} mensajeTrabajos Mensaje que se muestra mientras se cargan lso trabajos
 * @property {Boolean} errorCargando Bandera que indica que ocurrió un error y permite mostrarlo
 * @property {String} mensajeError Mensaje que se muestra cuando ocurre un error
 * @property {Object} gridOptions Opciones del ui-grid que muestra los trabajos de grado a los cuales se vincula el usuario
 * @property {Boolean} registrarNota Bandera que permite identificar la acción que se quiere realizar
 * @property {Object} trabajoSeleccionado Trabajo seleccionado en un ui-grid
 * 
 */
angular.module('poluxClienteApp')
  .controller('GeneralRegistrarNotaCtrl', function (token_service, $translate, $q,$scope, poluxRequest) {
    var ctrl = this;

    token_service.token.documento = "79647592";
    //token_service.token.documento = "12237136";
    ctrl.documento = token_service.token.documento;

    ctrl.mensajeTrabajos = $translate.instant('LOADING.CARGANDO_TRABAJOS_DE_GRADO_ASOCIADOS');
    ctrl.cargandoTrabajos = true;

    $scope.botonesNota = [
      { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER_DETALLES'), operacion: 'ver', estado: true },
      { clase_color: "ver", clase_css: "fa fa-pencil-square-o fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.REGISTRAR_NOTA'), operacion: 'registrarNota', estado: true },
    ];

    $scope.botonesVer = [
      { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER_DETALLES'), operacion: 'ver', estado: true },
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
        width:'35%',
      },{
        name: 'TrabajoGrado.Modalidad.Nombre',
        displayName: $translate.instant('MODALIDAD'),
        width: '20%',
      },{
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
        width:'15%',
        type: 'boolean',
        cellTemplate: '<div ng-if="row.entity.permitirRegistrar">'
          + '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botonesNota" fila="row"></btn-registro>'
          + '</div>'
          + '<div ng-if="!row.entity.permitirRegistrar">'
          + '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botonesVer" fila="row"></btn-registro>'
          + '</div>'
      }
    ];

    /**
       * @ngdoc method
       * @name cargarTrabajos
       * @methodOf poluxClienteApp.controller:GeneralRegistrarNotaCtrl
       * @description
       * Función que permite cargar los trabajos en los que el docente se encuentra actualmente activo
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} Retorna una promesa que se soluciona sin regresar ningún parametro.
       */
    ctrl.cargarTrabajos = function(){
      var defer = $q.defer();
      ctrl.cargandoTrabajos = true;
      var parametrosTrabajoGrado = $.param({
        limit:0,
        query:"Activo:True,Usuario:"+ctrl.documento,
      });
      poluxRequest.get("vinculacion_trabajo_grado", parametrosTrabajoGrado)
      .then(function(dataTrabajos){
        if(dataTrabajos.data != null){
          ctrl.trabajosGrado = dataTrabajos.data;
          //Se decide que trabajos puede ver y en cuales puede registrar nota
          angular.forEach(ctrl.trabajosGrado, function(trabajo){
            //Por defecto de false
            trabajo.permitirRegistrar = false;
            //Si el rol es director
            var rol = trabajo.RolTrabajoGrado.Id;
            var modalidad = trabajo.TrabajoGrado.Modalidad.Id;
            if( rol === 1 ){
              //Si la modalidad es pasantia o articulo se permite sino no
              if( modalidad === 1 || modalidad === 8){
                trabajo.permitirRegistrar = true;
              } 
            }
            //Si el rol es evaluador puede registrar la nota sin importar la modalidad
            if( rol === 3 ){
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
          ctrl.mensajeError = $translate.instant('ERROR.CARGANDO_TRABAJOS_DE_GRADO_ASOCIADOS');
          defer.reject("no hay trabajos de grado asociados");
        }
      })
      .catch(function(error){
        ctrl.mensajeError = $translate.instant('ERROR.CARGANDO_TRABAJOS_DE_GRADO_ASOCIADOS');
        defer.reject(error);
      });
      return defer.promise;
    }

    ctrl.cargarTrabajos()
    .then(function(){
      ctrl.cargandoTrabajos = false;
    })
    .catch(function(error){
      console.log(error);
      ctrl.errorCargando = true;
      ctrl.cargandoTrabajos = false;
    })

    /**
       * @ngdoc method
       * @name cargarTrabajo
       * @methodOf poluxClienteApp.controller:GeneralRegistrarNotaCtrl
       * @description
       * Función que permite cargar los datos de un trabajo de grado especifico
       * @param {Object} fila Fila que se selecciona
       * @returns {undefined} No retorna ningún parametro
       */
    ctrl.cargarTrabajo = function(fila){
      ctrl.trabajoSeleccionado = fila.entity;
      //console.log(ctrl.registrarNota);
      //console.log(ctrl.trabajoSeleccionado);
    }
    

    /**
     * @ngdoc method
     * @name loadrow
     * @methodOf poluxClienteApp.controller:GeneralRegistrarNotaCtrl
     * @description 
     * Ejecuta las funciones especificas de los botones seleccionados en el ui-grid
     * @param {object} row Fila seleccionada en el uigrid que contiene los detalles de la solicitud que se quiere consultar
     * @param {string} operacion Operación que se debe ejecutar cuando se selecciona el botón
     * @returns {undefined} No retorna ningún valor
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
