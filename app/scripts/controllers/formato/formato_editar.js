'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:FormatoEditarCtrl
 * @description
 * # FormatoEditarCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('FormatoEditarCtrl', function(poluxRequest, $scope, uiGridTreeViewConstants) {

    var ctrl = this;
    ctrl.request = poluxRequest;
    ctrl.formatos = [];
    //cargar todos los formatos de la base de datos
    ctrl.get_all_format = function() {
      poluxRequest.get("formato", "").then(function(response) {
        ctrl.formatos = response.data;
        console.log(ctrl.formatos);
      })
    };
    ctrl.get_all_format();

    $scope.refresh_format_view = function(id) {
      $scope.respuestas_vista = [];
      poluxRequest.get("formato", $.param({
        query: "Id: " + id
      })).then(function(response) {
        $scope.formato_vista = response.data[0];
        console.log("formato: ");
        console.log($scope.formato_vista);
      });
      poluxRequest.get("pregunta_formato", $.param({
        query: "IdFormato:" + id,
        fields: "IdPregunta,Tipo,Valoracion,Orden",
        sortby: "Orden",
        order: "asc"
      })).then(function(response) {
        $scope.preguntas_vista = response.data;
        console.log("preguntas: ");
        console.log($scope.preguntas_vista);
        $scope.respuestas_vista = [];
        for (var i = 0; i < $scope.preguntas_vista.length; i++) {
          if ($scope.preguntas_vista[i].Tipo.substring(0, 7) === "cerrado"){
            $scope.respuesta_temp = [];
            poluxRequest.get("respuesta_formato",
              $.param({
                query: "IdPreguntaFormato.IdPregunta.Id:" +
                        $scope.preguntas_vista[i].IdPregunta.Id,
                sortby: "Orden",
                order: "asc"
              })).then(function(response) {
                $scope.respuesta_temp = response.data;
                $scope.respuestas_vista.push($scope.respuesta_temp);
            });
            console.log($scope.respuestas_vista);
          }
        }
      });

    };




    //Gestion de ui-grid
    $scope.evaluacion = {};
    $scope.id_formato = 0;
    $scope.mostrar_preguntas = false;
    $scope.message = 'Formulario para la creación de ';
    $scope.gridOptions = {
      enableFiltering: false,
      enableSorting: false,
      treeRowHeaderAlwaysVisible: false,
      showTreeExpandNoChildren: false,
      enableRowSelection: true,
      enableSelectAll: true,
      selectionRowHeaderWidth: 30,
      rowHeight: 30,
      showGridFooter: true,
      columnDefs: [{
        field: 'Orden',
        width: '12%',
        enableCellEdit: false,
        cellClass: 'aligncenter',
        displayName: 'ORDEN'
      }, {
        field: 'Enunciado',
        width: '50%',
        enableCellEdit: true,
        enableSorting: false,
        cellClass: 'alignleft',
        displayName: 'ENUNCIADO'
      }, {
        field: 'Peso',
        width: '12%',
        enableCellEdit: true,
        type: 'number',
        displayName: 'PESO'
      }, {
        field: 'Tipo',
        width: '20%',
        enableCellEdit: true,
        editableCellTemplate: 'ui-grid/dropdownEditor',
        cellClass: 'aligncenter',
        editDropdownValueLabel: 'tipo',
        resizable: false,
        displayName: 'TIPO',
        editDropdownOptionsArray: [{
          id: 'cerrado_unico',
          tipo: 'Cerrada Unica'
        }, {
          id: 'cerrado_multiple',
          tipo: 'Cerrada Multiple'
        }, {
          id: 'abierta',
          tipo: 'Abierta'
        }, {
          id: 'numerica',
          tipo: 'Numérica'
        }]
      }],
      isRowSelectable: function(row) {
        if (row.treeLevel === 0) {
          return true;
        } else {
          return false;
        };
      },


      onRegisterApi: function(gridApi) {
        $scope.gridApi = gridApi;
      }
    };
    $scope.gridOptions.multiSelect = false;

    $scope.ajustar_id = function() {
      var p = 0;
      var h = 0;
      for (var j = 0; j < $scope.gridOptions.data.length; j++) {
        if ($scope.gridOptions.data[j].$$treeLevel === 0) {
          p++;
          $scope.gridOptions.data[j].Orden = p;
        } else {
          h++;
          $scope.gridOptions.data[j].Orden = h;
        }
      }
    }

    $scope.nueva_opcion = function() {
      var seleccion = $scope.gridApi.selection.getSelectedRows();
      var pos = 0;
      if ($scope.gridOptions.data.length > 0 && seleccion.length > 0) {
        var objeto = null;
        for (var i = 0; i < $scope.gridOptions.data.length; i++) {
          if ($scope.gridOptions.data[i].$$hashKey == seleccion[0].$$hashKey &&
            ($scope.gridOptions.data[i].Tipo.substring(0, 7) === 'cerrado')) {
            pos = i + 1;
            objeto = {
              Orden: pos,
              Enunciado: "Ingrese Opcion ...",
              Peso: "0",
              $$treeLevel: 1,
              padre: seleccion[0].$$hashKey
            };
            $scope.gridOptions.data[i].opciones.unshift(objeto);
            $scope.gridOptions.data.splice(pos, 0, objeto);
            console.log(objeto);
            console.log($scope.gridOptions.data[i]);

          }
        }
      } else {

      }
      $scope.ajustar_id();
    }

    $scope.nueva_pregunta = function() {

      var pos = 0;
      var seleccion = $scope.gridApi.selection.getSelectedRows();
      if ($scope.gridOptions.data.length > 0 && seleccion.length > 0) {
        var objeto = null;
        for (var i = 0; i < $scope.gridOptions.data.length; i++) {
          if ($scope.gridOptions.data[i].$$hashKey == seleccion[0].$$hashKey) {
            pos = i;
            objeto = {
              Orden: i,
              Enunciado: "Ingrese el enunciado ...",
              Peso: "0",
              Tipo: "Seleccione ...",
              opcion: '',
              $$treeLevel: 0,
              opciones: []
            };
          }
        }
        $scope.gridOptions.data.splice(pos, 0, objeto);
      } else {
        $scope.gridOptions.data.push({
          Orden: 1,
          Enunciado: "Ingrese el enunciado ...",
          Peso: "0",
          Tipo: "Seleccione ...",
          opcion: '',
          $$treeLevel: 0,
          opciones: []
        });
      }
      $scope.ajustar_id();
    };

    $scope.borrar = function() {
      var pos = 0;
      var seleccion = $scope.gridApi.selection.getSelectedRows();
      if (seleccion.length > 0) {
        for (var i = 0; i < $scope.gridOptions.data.length; i++) {

          if ($scope.gridOptions.data[i].$$hashKey == seleccion[0].$$hashKey) {
            var pos = i;
            for (var j = i + 1; j < $scope.gridOptions.data.length; j++) {
              if ($scope.gridOptions.data[j].padre === seleccion[0].$$hashKey) {
                $scope.gridOptions.data.splice(j, 1);
                j--;
                console.log("borrado " + j);
              }
            }

          }
        }
        $scope.gridOptions.data.splice(pos, 1);
      }
      $scope.ajustar_id();
    };

    $scope.guardar = function() {
      $scope.mostrar_preguntas = true;
      var formato_post = {};
      formato_post.Introduccion = $scope.introduccion_formato;
      formato_post.Nombre = $scope.nombre_formato;

      console.log(formato_post);
      //poluxRequest.post('formato', formato_post).then(function(response) {
        //$scope.evaluacion = response.data;
        //$scope.id_formato = $scope.evaluacion.Id;
      //});
    };

    //    $scope.gridOptions.data = evaluacion.preguntas;

  });
