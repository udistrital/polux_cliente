'use strict';

/**
* @ngdoc directive
* @name poluxApp.directive:formEvalucion
* @description
* # formEvalucion
*/
angular.module('poluxApp')

.directive('poFormEvalucion', function (evaluacion) {
  return {
    restrict: 'E',
    templateUrl: "views/directives/formato/form_evaluacion.html",
    controller: function ($scope, $http, uiGridTreeViewConstants) {
      $scope.evaluacion = evaluacion;
      $scope.message = 'Formulario para la creación de ';
      $scope.gridOptions = {
        enableFiltering : false,
        enableSorting : false,
        treeRowHeaderAlwaysVisible : false,
        showTreeExpandNoChildren: false,
        enableRowSelection: true,
        enableSelectAll: true,
        selectionRowHeaderWidth: 30,
        rowHeight: 30,
        showGridFooter:true,
        columnDefs : [
          {field: 'id', width: '7%',enableCellEdit: false, cellClass:'aligncenter', displayName: '#'},
          {field: 'enunciado',width: '50%', enableCellEdit:true,   enableSorting : false,     cellClass:'alignleft',  displayName: 'ENUNCIADO'},
          {field: 'peso', width: '8%', enableCellEdit:true, type:'number' ,displayName: 'PESO'},
          {field: 'tipo',width: '10%', enableCellEdit: true, editableCellTemplate: 'ui-grid/dropdownEditor', cellClass:'aligncenter', editDropdownValueLabel: 'tipo', resizable : false, displayName: 'TIPO' , editDropdownOptionsArray: [
            { id: 'C', tipo: 'Cerrada' },
            { id: 'A', tipo: 'Abierta' },
            { id: 'N', tipo: 'Numerica' }
          ]},
          {field: 'opcion',width: '12%', enableCellEdit: true, editableCellTemplate: 'ui-grid/dropdownEditor', cellClass:'aligncenter', editDropdownValueLabel: 'opcion', resizable : false, displayName: 'OPCIÓN' , editDropdownOptionsArray: [
            { id: 'checkbox', opcion: 'checkbox' },
            { id: 'radio', opcion: 'radio' }
          ]}
        ],
        isRowSelectable : function(row){
          if(row.treeLevel === 0){

            return true;
          }else {

            return false;
          };
        },


        onRegisterApi: function( gridApi ) {
          $scope.gridApi = gridApi;
          }
        };
      $scope.gridOptions.multiSelect = false;

      $scope.ajustar_id = function(){
        var p = 0;
        var h = 0;
        for (var j = 0; j < $scope.gridOptions.data.length; j++) {
          if($scope.gridOptions.data[j].$$treeLevel === 0 ){
            p ++;
            $scope.gridOptions.data[j].id = p;
          }else{
            h++;
            $scope.gridOptions.data[j].id = h;
          }
        }
      }

      $scope.nueva_opcion = function(){
        var seleccion = $scope.gridApi.selection.getSelectedRows();
        var pos= 0;
        if($scope.gridOptions.data.length > 0 && seleccion.length > 0){
          var objeto = null;
          for (var i = 0; i < $scope.gridOptions.data.length; i++) {
              if ($scope.gridOptions.data[i].$$hashKey == seleccion[0].$$hashKey && $scope.gridOptions.data[i].tipo=='C' && $scope.gridOptions.data[i].opcion!==''){
                pos = i+1;
                objeto = {  id:pos,
                            enunciado:"Ingrese Opcion ...",
                            peso: "0",
                            $$treeLevel : 1,
                            padre:seleccion[0].$$hashKey
                          };
                $scope.gridOptions.data[i].opciones.push(objeto);
                $scope.gridOptions.data.splice(pos, 0, objeto);
                console.log(objeto);
                console.log($scope.gridOptions.data[i]);

              }
            }
          }else{

          }
          $scope.ajustar_id();
        }

      $scope.nueva_pregunta = function(){

        var pos = 0;
        var seleccion = $scope.gridApi.selection.getSelectedRows();
        if($scope.gridOptions.data.length > 0 && seleccion.length > 0){
          var objeto = null;
          for (var i = 0; i < $scope.gridOptions.data.length; i++) {
              if ($scope.gridOptions.data[i].$$hashKey == seleccion[0].$$hashKey){
                pos = i;
                objeto = {  id:i,
                            enunciado:"Ingrese el enunciado ...",
                            peso: "0",
                            tipo:"Seleccione ...",
                            opcion:'',
                            $$treeLevel : 0,
                            opciones:[]
                          };
              }
            }
            $scope.gridOptions.data.splice(pos, 0, objeto);
        }else{
        $scope.gridOptions.data.push(
          {
            id:1,
            enunciado:"Ingrese el enunciado ...",
            peso: "0",
            tipo:"Seleccione ...",
            opcion:'',
            $$treeLevel : 0,
            opciones:[]
          });
        }
        $scope.ajustar_id();
      };

      $scope.borrar = function(){
          var pos = 0;
          var seleccion = $scope.gridApi.selection.getSelectedRows();
          if(seleccion.length > 0){
            for (var i = 0; i < $scope.gridOptions.data.length; i++) {

                if ($scope.gridOptions.data[i].$$hashKey == seleccion[0].$$hashKey){
                  var pos = i;
                  for (var j = i + 1; j < $scope.gridOptions.data.length; j++) {
                    if ($scope.gridOptions.data[j].padre === seleccion[0].$$hashKey){
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
      }

        $scope.calcular_peso = function(){
        evaluacion.peso_total();
      }

      $scope.gridOptions.data = evaluacion.preguntas;

      $scope.ingresar_en_
    },
    controllerAs: "FormEvaluacionCtrl"
  };
});
