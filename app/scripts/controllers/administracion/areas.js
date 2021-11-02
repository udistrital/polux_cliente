'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:AdministracionAreasCtrl
 * @description
 * # AdministracionAreasCtrl
 * Controller of the poluxClienteApp.
 * Controlador que regula las operaciones de administración sobre las áreas de conocimiento para los trabajos de grado.
 * Se realiza una consulta de área de SNIES registrada para consultar y editar el contenido registrado.
 * @requires $scope
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires services/poluxClienteApp.service:coreAmazonCrudService
 * @requires services/poluxService.service:poluxRequest
 * @property {Array} areasSnies Colección de áreas de SNIES registradas para seleccionarse desde la vista y añadir áreas de conocimiento asociadas
 * @property {Array} areasConocimiento Colección de áreas de conocimiento asociadas a un área de SNIES registrada
 * @property {Object} gridOptions Objeto que maneja las opciones de la cuadrícula que muestra las áreas de conocimiento
 * @property {Boolean} areasError Indicador que maneja la aparición de error durante la consulta de las áreas de SNIES registradas
 * @property {Boolean} areasConocimientoError Indicador que maneja la aparición de error durante la consulta de las áreas de conocimiento
 * @property {String} nombreArea Texto que manipula el área de conocimiento para el registro
 * @property {String} descripcionArea Texto que manipula la descripción del área de conocimiento para el registro
 * @property {Number} areaSnies Valor que carga el identificador del área de SNIES consultada
 * @property {String} msgCargandoAreas Mensaje que aparece durante la carga de áreas consultadas
 * @property {String} msgRegistrandoArea Mensaje que aparece durante el registro del área ingresada
 * @property {Boolean} loadAreas Indicador que maneja la carga de las áreas de SNIES
 * @property {Boolean} loadCargandoArea Indicador que maneja el periodo de consulta de las áreas de conocimiento
 * @property {Boolean} loadAreasConocimiento Indicador que maneja la carga de las áreas de conocimiento
 */
angular.module('poluxClienteApp')
  .controller('AdministracionAreasCtrl',
    function($scope, $translate, coreAmazonCrudService, poluxRequest) {
      var ctrl = this;

      $scope.msgCargandoAreas = $translate.instant('LOADING.CARGANDO_AREAS');
      $scope.msgRegistrandoArea = $translate.instant('LOADING.VINCULANDO_SUBAREA');
      $scope.loadAreas = true;
      $scope.loadCargandoArea = false;

      ctrl.areasSnies = [];
      ctrl.areasConocimiento = [];

      $scope.botonesActivo = [{
        clase_color: "ver",
        clase_css: "fa fa-edit fa-lg  faa-shake animated-hover",
        titulo: $translate.instant('BTN.EDITAR'),
        operacion: 'editar',
        estado: true
      }, {
        clase_color: "ver",
        clase_css: "fa fa-ban fa-lg  faa-shake animated-hover",
        titulo: $translate.instant('BTN.DESACTIVAR'),
        operacion: 'desactivar',
        estado: true
      }, ];

      $scope.botonesNoActivo = [{
        clase_color: "ver",
        clase_css: "fa fa-edit fa-lg  faa-shake animated-hover",
        titulo: $translate.instant('BTN.EDITAR'),
        operacion: 'editar',
        estado: true
      }, {
        clase_color: "ver",
        clase_css: "fa fa-check-square-o fa-lg  faa-shake animated-hover",
        titulo: $translate.instant('BTN.ACTIVAR'),
        operacion: 'activar',
        estado: true
      }];

      ctrl.gridOptions = {
        paginationPageSizes: [5, 10, 15, 20, 25],
        paginationPageSize: 10,
        enableFiltering: true,
        enableSorting: true,
        enableSelectAll: false,
        useExternalPagination: false,
      };

      ctrl.gridOptions.columnDefs = [{
        name: 'Nombre',
        displayName: $translate.instant('NOMBRE'),
        width: '30%',
      }, {
        name: 'Descripcion',
        displayName: $translate.instant('DESCRIPCION'),
        width: '40%',
      }, {
        name: 'Activo',
        displayName: $translate.instant('ESTADO'),
        width: '15%',
        cellTemplate: '<div ng-if="row.entity.Activo">Activo</div><div ng-if="!row.entity.Activo">No activo</div>'
      }, {
        name: 'Acciones',
        displayName: $translate.instant('ACCIONES'),
        width: '15%',
        type: 'boolean',
        cellTemplate: '<div ng-if="row.entity.Activo"><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botonesActivo" fila="row"></btn-registro></div>' +
          '<div ng-if="!row.entity.Activo"><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botonesNoActivo" fila="row"></btn-registro></div>'
      }];

      var parametrosAreas = $.param({
        query: "Estado:ACTIVO",
        limit: 0,
      });


      ctrl.areasSnies = [
        {Id:1,estado:true,Nombre:'AGRONOMIA VETERINARIA Y AFINES'},
        {Id:2,estado:true,Nombre:'BELLAS ARTES'},
        {Id:3,estado:true,Nombre:'CIENCIAS DE LA EDUCACION'},
        {Id:4,estado:true,Nombre:'CIENCIAS DE LA SALUD'},
        {Id:5,estado:true,Nombre:'CIENCIAS SOCIALES Y HUMANAS'},
        {Id:6,estado:true,Nombre:'ECONOMIA, ADMINISTRACION, CONTADURIA Y AFINES'},
        {Id:7,estado:true,Nombre:'INGENIERIA, ARQUITECTURA, URBANISMO Y AFINES'},
        {Id:8,estado:true,Nombre:'MATEMATICAS Y CIENCIAS NATURALES'},      
        {Id:9,estado:true,Nombre:'SIN CLASIFICAR'}
        ];
        $scope.loadAreas = false;
        ctrl.areasError = false;
      /**
      coreAmazonCrudService.get("snies_area", parametrosAreas)
        .then(function(responseAreas) {
          ctrl.areasSnies = responseAreas.data;
          if (Object.keys(ctrl.areasSnies[0]).length > 0) {
            $scope.loadAreas = false;
            ctrl.areasError = false;
          } else {
            $scope.loadAreas = false;
            ctrl.areasError = true;
          }
        }).catch(function(error) {
          $scope.loadAreas = false;
          ctrl.areasError = true;
        });

      /**
       * @ngdoc method
       * @name cargarAreasConocimiento
       * @methodOf poluxClienteApp.controller:AdministracionAreasCtrl
       * @description
       * Función que carga las áreas de conocimiento según el área de SNIES seleccionada.
       * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para operar sobre la base de datos del proyecto.
       * @param {Object} area El área de SNIES registrada y seleccionada desde la vista
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.cargarAreasConocimiento = function(area) {
        ctrl.areasConocimiento = [];
        ctrl.gridOptions.data = ctrl.areasConocimiento;
        $scope.loadAreasConocimiento = true;
        ctrl.areaSnies = area.Id;
        var parametrosAreasConocimiento = $.param({
          query: "SniesArea:" + area.Id,
          limit: 0,
        });
        poluxRequest.get("area_conocimiento", parametrosAreasConocimiento)
          .then(function(responseAreas) {
            if (Object.keys(responseAreas.data[0]).length > 0) {
              ctrl.areasConocimiento = responseAreas.data;
              ctrl.gridOptions.data = ctrl.areasConocimiento;
            }
            $scope.loadAreasConocimiento = false;
          })
          .catch(function(error) {
            ctrl.areasConocimientoError = true;
            $scope.loadAreasConocimiento = false;
          });
      }

      /**
       * @ngdoc method
       * @name mostrarArea
       * @methodOf poluxClienteApp.controller:AdministracionAreasCtrl
       * @description
       * Función que muestra la ventaja emergente para la opción de agregar el área de conocimiento.
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.mostrarArea = function() {
        $('#modalAgregarArea').modal('show');
      }

      /**
       * @ngdoc method
       * @name verificarArea
       * @methodOf poluxClienteApp.controller:AdministracionAreasCtrl
       * @description
       * Función que retorna un error en caso de ser inconsistente la información de las áreas de conocimiento.
       * @param {string} nombreArea Nombre del área que se va a agregar
       * @returns {Boolean} El indicador que carga si hay error en la colección de los datos
       */
      ctrl.verificarArea = function(nombreArea) {
        var error = false;

        var quitarAcentos = function(text) {
          var r = text.toLowerCase();
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

        var areaNueva = cambiarFormato(nombreArea);
        angular.forEach(ctrl.areasConocimiento, function(area) {
          if (areaNueva === cambiarFormato(area.Nombre)) {
            error = true;
          }
        });

        return error;
      }

      /**
       * @ngdoc method
       * @name cargarArea
       * @methodOf poluxClienteApp.controller:AdministracionAreasCtrl
       * @description
       * Función que verifica la información existente de las áreas de conocimiento y registra el área ingresada desde la vista.
       * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para operar sobre la base de datos del proyecto.
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.cargarArea = function() {
        $scope.loadCargandoArea = true;
        if (ctrl.verificarArea(ctrl.nombreArea)) {
          $scope.loadCargandoArea = false;
          ctrl.nombreArea = "";
          ctrl.descripcionArea = "";
          swal(
            $translate.instant("MENSAJE_ERROR"),
            $translate.instant("AREAS.AREA_EXISTENTE"),
            'warning'
          );
        } else {
          var dataArea = {
            Activo: true,
            Descripcion: ctrl.descripcionArea,
            Nombre: ctrl.nombreArea,
            SniesArea: ctrl.areaSnies,
          }
          poluxRequest.post("area_conocimiento", dataArea)
            .then(function() {
              $('#modalAgregarArea').modal('hide');
              $scope.loadCargandoArea = false;
              swal(
                $translate.instant("REGISTRO_EXITOSO"),
                $translate.instant("AREAS.AREA_REGISTRADA"),
                'success'
              );
              ctrl.cargarAreasConocimiento(ctrl.sniesSeleccionada);
              ctrl.nombreArea = "";
              ctrl.descripcionArea = "";
            })
            .catch(function(error) {
              $scope.loadCargandoArea = false;
              swal(
                $translate.instant("MENSAJE_ERROR"),
                $translate.instant("AREAS.ERROR_REGISTRAR_AREA"),
                'warning'
              );
            });
        }
      }

      /**
       * @ngdoc method
       * @name editarArea
       * @methodOf poluxClienteApp.controller:AdministracionAreasCtrl
       * @description
       * Función que verifica la información existente de las áreas de conocimiento y edita el área ingresada desde la vista.
       * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para operar sobre la base de datos del proyecto.
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.editarArea = function() {
        $scope.loadEditandoArea = true;
        var errorNombre = false;
        if (ctrl.areaSeleccionadaTemp.Nombre != ctrl.areaSeleccionada.Nombre) {
          errorNombre = ctrl.verificarArea(ctrl.areaSeleccionadaTemp.Nombre)
        }
        if (errorNombre) {
          $scope.loadEditandoArea = false;
          ctrl.areaSeleccionadaTemp = JSON.parse(JSON.stringify(ctrl.areaSeleccionada));
          swal(
            $translate.instant("MENSAJE_ERROR"),
            $translate.instant("AREAS.AREA_EXISTENTE"),
            'warning'
          );
        } else {
          poluxRequest.put("area_conocimiento", ctrl.areaSeleccionadaTemp.Id, ctrl.areaSeleccionadaTemp)
            .then(function() {
              $('#modalEditarArea').modal('hide');
              $scope.loadEditandoArea = false;
              swal(
                $translate.instant("REGISTRO_EXITOSO"),
                $translate.instant("AREAS.AREA_EDITADA"),
                'success'
              );
              ctrl.areasConocimiento.push(ctrl.areaSeleccionadaTemp);
              ctrl.areasConocimiento.splice(ctrl.areasConocimiento.indexOf(ctrl.areaSeleccionada), 1);
              ctrl.areaSeleccionada = undefined;
              ctrl.areaSeleccionadaTemp = undefined;
            })
            .catch(function(error) {
              $scope.loadEditandoArea = false;
              swal(
                $translate.instant("MENSAJE_ERROR"),
                $translate.instant("AREAS.ERROR_EDITAR_AREA"),
                'warning'
              );
            });
        }
      }

      /**
       * @ngdoc method
       * @name cambiarEstadoArea
       * @methodOf poluxClienteApp.controller:AdministracionAreasCtrl
       * @description
       * Función que cambia el estado de un área de conocimiento
       * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para operar sobre la base de datos del proyecto.
       * @param {Object} area Área de conocimiento a la que se le cambia el estado
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.cambiarEstadoArea = function(area) {
        //Se cambia el estado del área
        $scope.loadAreas = true;
        area.Activo = !area.Activo;
        poluxRequest.put("area_conocimiento", area.Id, area)
          .then(function() {
            $scope.loadAreas = false;
            swal(
              $translate.instant("REGISTRO_EXITOSO"),
              $translate.instant("AREAS.AREA_EDITADA"),
              'success'
            );
          })
          .catch(function(error) {
            area.Activo = !area.Activo;
            $scope.loadAreas = false;
            swal(
              $translate.instant("MENSAJE_ERROR"),
              $translate.instant("AREAS.ERROR_EDITAR_AREA"),
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
          case "editar":
            ctrl.areaSeleccionada = row.entity;
            ctrl.areaSeleccionadaTemp = JSON.parse(JSON.stringify(row.entity));
            $('#modalEditarArea').modal('show');
            break;
          case "activar":
            swal({
              title: $translate.instant("AREAS.ACTIVAR_AREA"),
              text: $translate.instant("AREAS.CONFIRMACION_ACTIVAR"),
              type: "warning",
              confirmButtonText: $translate.instant("ACEPTAR"),
              cancelButtonText: $translate.instant("CANCELAR"),
              showCancelButton: true
            }).then(function(responseSwal) {
              if (responseSwal) {
                ctrl.cambiarEstadoArea(row.entity);
              }
            });
            break;
          case "desactivar":
            swal({
              title: $translate.instant("AREAS.DESACTIVAR_AREA"),
              text: $translate.instant("AREAS.CONFIRMACION_DESACTIVAR"),
              type: "warning",
              confirmButtonText: $translate.instant("ACEPTAR"),
              cancelButtonText: $translate.instant("CANCELAR"),
              showCancelButton: true
            }).then(function(responseSwal) {
              if (responseSwal) {
                ctrl.cambiarEstadoArea(row.entity);
              }
            });
            break;
          default:
            break;
        }
      };
    });