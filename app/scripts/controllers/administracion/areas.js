'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:AdministracionAreasCtrl
 * @description
 * # AdministracionAreasCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('AdministracionAreasCtrl', function ($scope,coreService, poluxRequest,$translate) {
    $scope.msgCargandoAreas = $translate.instant('LOADING.CARGANDO_AREAS');
    $scope.loadAreas = true;

    var ctrl = this;
    ctrl.areasSnies = [];
    ctrl.areasConocimiento = [];
 
    ctrl.gridOptions = {
      paginationPageSizes: [5,10,15, 20, 25],
      paginationPageSize: 10,
      enableFiltering: true,
      enableSorting: true,
      enableSelectAll: false,
      useExternalPagination: false,
    };

    ctrl.gridOptions.columnDefs = [{
      name: 'Nombre',
      displayName: $translate.instant('NOMBRE'),
      width:'40%',
    },{
      name: 'Descripcion',
      displayName: $translate.instant('DESCRIPCION'),
      width:'60%',
    }];
    
    var parametrosAreas = $.param({
      query:"Estado:ACTIVO",
      limit:0,
    });
    coreService.get("snies_area",parametrosAreas).then(function(responseAreas){
      ctrl.areasSnies = responseAreas.data;
      if(ctrl.areasSnies !== null && ctrl.areasSnies.length !== 0){
        $scope.loadAreas = false;
        ctrl.areasError = false;
      }else{
        $scope.loadAreas = false;
        ctrl.areasError = true;
      }
    }).catch(function(error){
      $scope.loadAreas = false;
      ctrl.areasError = true;
    });


    ctrl.cargarAreasConocimiento = function(area){
      ctrl.areasConocimiento = [];
      $scope.loadAreasConocimiento = true;
      ctrl.areaSnies = area.Id;
      var parametrosAreasConocimiento = $.param({
        query:"Activo:true,SniesArea:"+area.Id,
        limit:0,
      });
      poluxRequest.get("area_conocimiento",parametrosAreasConocimiento)
      .then(function(responseAreas){
        if(responseAreas.data!==null){
          ctrl.areasConocimiento = responseAreas.data;
          ctrl.gridOptions.data = ctrl.areasConocimiento;
        }
        $scope.loadAreasConocimiento = false;
        console.log(responseAreas.data);
      })
      .catch(function(){
        ctrl.areasConocimientoError = true;
        $scope.loadAreasConocimiento = false;
      });

    }

    ctrl.mostrarArea = function(){
      $('#modalAgregarArea').modal('show');
    }

    ctrl.verificarArea = function(){
      var error = false;

      var quitarAcentos = function(text) {
        var r=text.toLowerCase();
          r = r.replace(new RegExp(/\s/g),"");
          r = r.replace(new RegExp(/[àáâãäå]/g),"a");
          r = r.replace(new RegExp(/[èéêë]/g),"e");
          r = r.replace(new RegExp(/[ìíîï]/g),"i");
          r = r.replace(new RegExp(/ñ/g),"n");                
          r = r.replace(new RegExp(/[òóôõö]/g),"o");
          r = r.replace(new RegExp(/[ùúûü]/g),"u");              
        return r;
      }

      var cambiarFormato = function(texto){
        return quitarAcentos(ctrl.nombreArea).toUpperCase().replace(" ","");
      }

      var areaNueva = cambiarFormato(ctrl.nombreArea);
      angular.forEach(ctrl.areasConocimiento,function(area){
        if(areaNueva === cambiarFormato(area)){
          error = true;
        }
      });

      return error;
    }

    ctrl.cargarArea = function(){
      if(ctrl.verificarArea()){
        swal(
          $translate.instant("ERROR"),
          $translate.instant("AREAS.AREA_EXISTENTE"),
          'warning'
        );
      }else{
        var dataArea = {
          Activo: true,
          Descripcion: ctrl.descripcionArea,
  
          Nombre:ctrl.nombreArea,
          SniesArea:ctrl.areaSnies,
        }
        poluxRequest.post("area_conocimiento",dataArea)
        .then(function(){
          swal(
            $translate.instant("REGISTRO_EXITOSO"),
            $translate.instant("AREAS.AREA_REGISTRADA"),
            'success'
          );
          ctrl.areasConocimiento.push(dataArea);
          $('#modalAgregarArea').modal('hide');
          ctrl.nombreArea = "";
          ctrl.descripcionArea = "";
        })
        .catch(function(){
          swal(
            $translate.instant("ERROR"),
            $translate.instant("AREAS.ERROR_REGISTRAR_AREA"),
            'warning'
          );
        });
      }
    }
  });
