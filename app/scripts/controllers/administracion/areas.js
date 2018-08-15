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
 * @requires services/poluxClienteApp.service:coreService
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
    function($scope, $translate, coreService, poluxRequest) {
      var ctrl = this;

      $scope.msgCargandoAreas = $translate.instant('LOADING.CARGANDO_AREAS');
      $scope.msgRegistrandoArea = $translate.instant('LOADING.REGISTRANDO_AREA');
      $scope.loadAreas = true;
      $scope.loadCargandoArea = false;

      ctrl.areasSnies = [];
      ctrl.areasConocimiento = [];

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
        width: '40%',
      }, {
        name: 'Descripcion',
        displayName: $translate.instant('DESCRIPCION'),
        width: '60%',
      }];

      var parametrosAreas = $.param({
        query: "Estado:ACTIVO",
        limit: 0,
      });
      coreService.get("snies_area", parametrosAreas)
        .then(function(responseAreas) {
          ctrl.areasSnies = responseAreas.data;
          if (ctrl.areasSnies !== null && ctrl.areasSnies.length !== 0) {
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
          query: "Activo:true,SniesArea:" + area.Id,
          limit: 0,
        });
        poluxRequest.get("area_conocimiento", parametrosAreasConocimiento)
          .then(function(responseAreas) {
            if (responseAreas.data !== null) {
              ctrl.areasConocimiento = responseAreas.data;
              ctrl.gridOptions.data = ctrl.areasConocimiento;
            }
            $scope.loadAreasConocimiento = false;
            console.log(responseAreas.data);
          })
          .catch(function() {
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
       * @param {undefined} undefined No requiere parámetros
       * @returns {Boolean} El indicador que carga si hay error en la colección de los datos
       */
      ctrl.verificarArea = function() {
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

        var areaNueva = cambiarFormato(ctrl.nombreArea);
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
        if (ctrl.verificarArea()) {
          $scope.loadCargandoArea = false;
          ctrl.nombreArea = "";
          ctrl.descripcionArea = "";
          swal(
            $translate.instant("ERROR"),
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
              ctrl.areasConocimiento.push(dataArea);
              ctrl.nombreArea = "";
              ctrl.descripcionArea = "";
            })
            .catch(function() {
              $scope.loadCargandoArea = false;
              swal(
                $translate.instant("ERROR"),
                $translate.instant("AREAS.ERROR_REGISTRAR_AREA"),
                'warning'
              );
            });
        }
      }

    });