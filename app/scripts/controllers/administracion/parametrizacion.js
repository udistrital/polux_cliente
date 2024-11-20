'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:AdministrarTablasCTRL
 * @description
 * # AdministracionTablasCtrl
 * Controller of the poluxClienteApp.
 * Controlador que regula las operaciones de administración sobre las tablas parametricas.
 * Se realiza una consulta a las tablas parametricas para su insersión y edición.
 * @requires $scope
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires services/poluxClienteApp.service:coreAmazonCrudService
 * @requires services/poluxService.service:poluxRequest
 * @property {Array} TablasParametricas Colección de tablas a las cuales serán validadas para la vista
 * @property {Array} TablasColeccion Colección de informacion de tablas parametricas
 * @property {String} nombreTabla Variable que guardara el nombre de la tabal usada
 * @property {Object} gridOptions2 Objeto que maneja las opciones de la cuadrícula que muestra las tablas parametricas sin enunciado
 * @property {Boolean} TablaError Indicador que maneja la aparición de error durante la consulta
 * @property {Boolean} TablasColeccionError Indicador que maneja la aparición de error durante la consulta de tablas
 * @property {String} nombreValorTabla Texto que manipula el nombre ingresado en la tabla
 * @property {String} nombreEnunciadoTabla Texto que manipula el enunciado ingresado en la tabla
 * @property {String} descripcionTabla Texto que manipula la descripción en la tabla
 * @property {String} abreviacionTabla Texto que manipula la abreviación en la tabla
 * @property {String} msgCargandotablas Mensaje que aparece durante la carga de áreas consultadas
 * @property {String} msgRegistrandoTabla Mensaje que aparece durante el registro del área ingresada
 * @property {Boolean} loadTablas Indicador que maneja la carga de las tablas de la BD 
 * @property {Boolean} loadCargandoTabla Indicador que maneja el periodo de consulta de las áreas de conocimiento
 * @property {Boolean} loadATablasColeccion Indicador que maneja la carga de las tablas
 */
angular.module('poluxClienteApp')
  .controller('AdministrarTablasCTRL',
    function($scope, $translate, coreAmazonCrudService, poluxRequest) {
      var ctrl = this;
      $scope.msgCargandotablas = $translate.instant('LOADING.CARGANDO_TABLAS');
      $scope.msgRegistrandotablas = $translate.instant('LOADING.CREACION_DATOS_TABLAS');
      $scope.loadAreas = true;
      $scope.loadCargandoTabla = false;

      ctrl.TablasParametricas = [];
      ctrl.TablasColeccion = [];

      $scope.botonesActivo = [{
        clase_color: "ver",
        clase_css: "fa fa-ban fa-lg  faa-shake animated-hover",
        titulo: $translate.instant('BTN.DESACTIVAR'),
        operacion: 'desactivar',
        estado: true
      }, ];

      $scope.botonesNoActivo = [{
        clase_color: "ver",
        clase_css: "fa fa-check-square-o fa-lg  faa-shake animated-hover",
        titulo: $translate.instant('BTN.ACTIVAR'),
        operacion: 'activar',
        estado: true
      }];
      ctrl.gridOptions2 = {
        paginationPageSizes: [5, 10, 15, 20, 25],
        paginationPageSize: 10,
        enableFiltering: true,
        enableSorting: true,
        enableSelectAll: false,
        useExternalPagination: false,
      };

      ctrl.gridOptions2.columnDefs = [{
        name: 'Nombre',
        displayName: $translate.instant('NOMBRE'),
        width: '30%',
      }, 
      {
        name: 'Descripcion',
        displayName: $translate.instant('DESCRIPCION'),
        width: '40%',
      },
      {
        name: 'Activo',
        displayName: $translate.instant('ESTADO'),
        width: '15%',
        cellTemplate: '<div ng-if="row.entity.Activo">Activo</div><div ng-if="!row.entity.Activo">No activo</div>'
      },         
      {
        name: 'Acciones',
        displayName: $translate.instant('ACCIONES'),
        width: '15%',
        type: 'boolean',
        cellTemplate: '<div ng-if="row.entity.Activo"><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botonesActivo" fila="row"></btn-registro></div>' +
          '<div ng-if="!row.entity.Activo"><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botonesNoActivo" fila="row"></btn-registro></div>'
      }];

      ctrl.TablasParametricas = [
        {name:'estado_asignatura_trabajo_grado',id:1},
        {name:'estado_espacio_academico_inscrito',id:2},
        {name:'estado_estudiante_trabajo_grado',id:3},
        {name:'estado_revision_trabajo_grado',id:4},
        {name:'estado_solicitud',id:5},
        {name:'estado_trabajo_grado',id:6},
        {name:'modalidad',id:7},
        {name:'pregunta',id:8},
        {name:'respuesta',id:9},
        {name:'rol_trabajo_grado',id:10},
        {name:'tipo_detalle',id:11},
        {name:'tipo_pregunta',id:12},
        {name:'tipo_solicitud',id:13},
        ];
      /**
       * @ngdoc method
       * @name cargarTabla
       * @methodOf poluxClienteApp.controller:AdministrarTablasCTRL
       * @description
       * Función que carga las tablas
       * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para operar sobre la base de datos del proyecto.
       * @param {Object} tabla La tabla
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.cargarTabla = function(tabla) {  
        ctrl.TablasColeccion = [];
        ctrl.gridOptions2.data = ctrl.TablasColeccion;
        $scope.loadATablasColección = true;
        poluxRequest.get(tabla.name,'limit=100')
          .then(function(responsetabla) {
            if (Object.keys(responsetabla.data.Data[0]).length > 0) {
                  ctrl.nombretabla = "";           
                  ctrl.TablasColeccion = responsetabla.data.Data;
                  ctrl.gridOptions2.data = ctrl.TablasColeccion;
                  ctrl.nombretabla = tabla.name;                            
            }
            $scope.loadATablasColeccion = false;
          })
          .catch(function(error) {
            ctrl.TablasColeccionError = true;
            $scope.loadATablasColeccion = false;
          });
      }
      
      /**
       * @ngdoc method
       * @name insertarvariable
       * @methodOf poluxClienteApp.controller:AdministrarTablasCTRL
       * @description
       * Función que muestra la ventaja emergente para la opción de inserción en la tabla
       * @param {Object} tabla La tabla para redirigir el boton
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.insertarvariable = function(tabla) {

        switch (tabla.id){
          case 1:
           $('#modalAgregarestadoasignatura').modal('show');
          break; 
          case 2:
           $('#modalAgregarestadoacademico').modal('show'); 
          break; 
          case 3:
            $('#modalAgregarestadoestudiante').modal('show');
          break; 
          case 4:
            $('#modalAgregarestadorevision').modal('show');
          break; 
          case 5:
            $('#modalAgregarestadosolicitud').modal('show');
          break; 
          case 6:
            $('#modalAgregarestadotrabajogrado').modal('show');
          break; 
          case 7:
            $('#modalAgregarmodalidad').modal('show');
          break; 
          case 8:
            $('#modalAgregarpregunta').modal('show');
          break; 
          case 9:
            $('#modalAgregarrespuesta').modal('show');
          break; 
          case 10:
            $('#modalAgregarroltrabajogrado').modal('show');
          break; 
          case 11:
            $('#modalAgregartipodetalle').modal('show');
          break; 
          case 12:
            $('#modalAgregartipopregunta').modal('show');
          break; 
          case 13:
            $('#modalAgregartiposolicitud').modal('show');
          break; 
        }

      }
      /**
       * @ngdoc method
       * @name insertartabla
       * @methodOf poluxClienteApp.controller:AdministrarTablasCTRL
       * @description
       * Función que verifica la información existente de las áreas de conocimiento y registra el área ingresada desde la vista.
       * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para operar sobre la base de datos del proyecto.
       * @param {undefined} undefined No requiere parámetros
       * @param {Object} tabla 
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.insertartabla = function() {      
       var verificarParametro = false;
       var quitarAcentos = function(text) {
        var r = text.toString().toLowerCase();
        r = r.replace(new RegExp(/\s/g), "");
        r = r.replace(new RegExp(/[àáâãäå]/g), "a");
        r = r.replace(new RegExp(/[èéêë]/g), "e");
        r = r.replace(new RegExp(/[ìíîï]/g), "i");
        r = r.replace(new RegExp(/ñ/g), "n");
        r = r.replace(new RegExp(/[òóôõö]/g), "o");
        r = r.replace(new RegExp(/[ùúûü]/g), "u");
        return r;
      }
      var cambiarFormato = function(texto) {
        return quitarAcentos(texto).toUpperCase().replace(" ", "");
      }
      if(ctrl.tablaSeleccionada.name=="pregunta")
      {
        var nuevoparam = cambiarFormato(ctrl.nombreEnunciadoTabla);
        angular.forEach(ctrl.TablasColeccion ,function(tabla) {     
          $scope.loadTablas = true; 
          if (nuevoparam === cambiarFormato(tabla.Enunciado)) {
            verificarParametro = true;
        }});
      }else{
      nuevoparam = cambiarFormato(ctrl.nombreValorTabla);
      angular.forEach(ctrl.TablasColeccion ,function(tabla) {     
        $scope.loadTablas = true; 
        if (nuevoparam === cambiarFormato(tabla.Nombre)) {
          verificarParametro = true;
      }});
    }
     $scope.loadCargandoTabla = true;
        if (verificarParametro) {
          $scope.loadCargandoTabla = false;
          ctrl.nombreValorTabla = "";
          ctrl.descripcionTabla = "";
          ctrl.tipo_detalle="";
          ctrl.abreviacionTabla="";
          ctrl.nombreEnunciadoTabla="";
          $scope.loadTablas = false; 
          swal(
            $translate.instant("MENSAJE_ERROR"),
            $translate.instant("AREAS.AREA_EXISTENTE"),
            'warning'
          );
        } else {  
          if(ctrl.tablaSeleccionada.name=="pregunta"){
            var dataArea = {                 
              Activo: true,   
              CodigoAbreviacion: ctrl.abreviacionTabla,
              Descripcion: ctrl.descripcionTabla,
              Id:0,
              Enunciado: ctrl.nombreEnunciadoTabla
            }
          }
          if(ctrl.tablaSeleccionada.name=="modalidad"){           
            dataArea = {                 
              Activa: true,   
              CodigoAbreviacion: ctrl.abreviacionTabla,
              Descripcion: ctrl.descripcionTabla,
              Id: 0,
              Nombre: ctrl.nombreValorTabla
            }
          }else{
            dataArea = {                 
              Activo: true,   
              CodigoAbreviacion: ctrl.abreviacionTabla,
              Descripcion: ctrl.descripcionTabla,
              Id:0,
              Nombre: ctrl.nombreValorTabla
            }
          }
         poluxRequest.post(ctrl.tablaSeleccionada.name, dataArea)
            .then(function() {
              $('#modalAgregarestadoasignatura').modal('hide');
              $('#modalAgregarestadoacademico').modal('hide');
              $('#modalAgregarestadoestudiante').modal('hide');
              $('#modalAgregarestadorevision').modal('hide');
              $('#modalAgregarestadosolicitud').modal('hide');
              $('#modalAgregarestadotrabajogrado').modal('hide');
              $('#modalAgregarmodalidad').modal('hide');
              $('#modalAgregarpregunta').modal('hide');
              $('#modalAgregarrespuesta').modal('hide');
              $('#modalAgregarroltrabajogrado').modal('hide');
              $('#modalAgregartipodetalle').modal('hide');
              $('#modalAgregartipopregunta').modal('hide');
              $('#modalAgregartiposolicitud').modal('hide');            
              $scope.loadCargandoTabla = false;  
              swal(
                $translate.instant("REGISTRO_EXITOSO"),
                $translate.instant("TABLAS.PARAMETRO_REGISTRADO"),
                'success'
              );   
              ctrl.cargarTabla(ctrl.tablaSeleccionada);    
              ctrl.nombreValorTabla = "";
              ctrl.descripcionTabla = "";
              ctrl.tipo_detalle="";
              ctrl.abreviacionTabla="";
              ctrl.nombreEnunciadoTabla="";    
              $scope.loadTablas = false;     
            })
            .catch(function(error) {
              $scope.loadCargandoTabla = true;
              $scope.loadTablas = false; 
              swal(
                $translate.instant("MENSAJE_ERROR"),
                $translate.instant("TABLAS.ERROR_REGISTRAR_PARAMETRO"),
                'warning'
              );
            });

        }
      
    }

        /**
       * @ngdoc method
       * @name cambiarEstadoParametro
       * @methodOf poluxClienteApp.controller:AdministrarTablasCTRL
       * @description
       * Función que cambia el estado de un parametro en la tabla parametrica
       * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para operar sobre la base de datos del proyecto.
       * @param {Object} tabla 
       * @returns {undefined} No hace retorno de resultados
       */
         ctrl.cambiarEstadoParametro = function(tabla) {
          //Se cambia el estado del parametro
          $scope.loadTablas = true;
          tabla.Activo = !tabla.Activo;
          poluxRequest.put(ctrl.nombretabla, tabla.Id, tabla)
            .then(function() {
              $scope.loadTablas = false;
              swal(
                $translate.instant("REGISTRO_EXITOSO"),
                $translate.instant("TABLAS.PARAMETRO_EDITADO"),
                'success'
              );
            })
            .catch(function(error) {
              tabla.Activo = !tabla.Activo;
              $scope.loadTablas = false;
              swal(
                $translate.instant("MENSAJE_ERROR"),
                $translate.instant("TABLAS.ERROR_EDITAR_PARAMETRO"),
                'warning'
              );
            });
          }
        
        
  
      /**
       * @ngdoc method
       * @name loadrow
       * @methodOf poluxClienteApp.controller:SolicitudesListarSolicitudesCtrl
       * @description 
       * Ejecuta las funciones específicas de los botones seleccionados en el ui-grid
       * @param {Object} row Fila seleccionada en el uigrid que contiene los detalles de la solicitud que se quiere consultar
       * @param {String} operacion Operación que se debe ejecutar cuando se selecciona el botón
       * @returns {undefined} No retorna ningún valor
       */
      $scope.loadrow = function(row, operacion) {

        switch (operacion) {
          case "activar":
            swal({
              title: $translate.instant("TABLAS.ACTIVAR_PARAMETRO"),
              text: $translate.instant("TABLAS.CONFIRMACION_ACTIVAR"),
              type: "warning",
              confirmButtonText: $translate.instant("ACEPTAR"),
              cancelButtonText: $translate.instant("CANCELAR"),
              showCancelButton: true
            }).then(function(responseSwal) {
              if (responseSwal) {
                ctrl.cambiarEstadoParametro(row.entity);
              }
            });
            break;
          case "desactivar":
            swal({
              title: $translate.instant("TABLAS.DESACTIVAR_PARAMETRO"),
              text: $translate.instant("TABLAS.CONFIRMACION_DESACTIVAR"),
              type: "warning",
              confirmButtonText: $translate.instant("ACEPTAR"),
              cancelButtonText: $translate.instant("CANCELAR"),
              showCancelButton: true
            }).then(function(responseSwal) {
              if (responseSwal) {
                ctrl.cambiarEstadoParametro(row.entity);
              }
            });
            break;
          default:
            break;
        }
      };
    });