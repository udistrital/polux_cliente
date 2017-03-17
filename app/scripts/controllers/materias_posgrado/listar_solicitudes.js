'use strict';

/**
* @ngdoc function
* @name poluxClienteApp.controller:MateriasPosgradoListarSolicitudesCtrl
* @description
* # MateriasPosgradoListarSolicitudesCtrl
* Controller of the poluxClienteApp
*/
angular.module('poluxClienteApp')
.controller('MateriasPosgradoListarSolicitudesCtrl', function (poluxMidRequest, poluxRequest, academicaRequest, $scope, $mdDialog, $timeout, $window) {
  var ctrl = this;
  ctrl.periodo=[];
  ctrl.carreras=[];

  //uigrid
  ctrl.gridOptions = {};
  ctrl.gridOptions.columnDefs = [
    { name: 'solicitud', displayName: 'Solicitud', width: "10%"  },
    { name: 'fecha', displayName: 'Fecha', type: 'date', cellFilter: 'date:\'yyyy-MM-dd\'', width: "10%"  },
    { name: 'estudiante', displayName: 'Código', width: "10%"  },
    { name: 'nombre', displayName: 'Nombre', width: "25%"  },
    { name: 'promedio', displayName: 'Promedio', width: "15%"  },
    { name: 'rendimiento', displayName: 'Rendimiento Académico', width: "15%"  },
    { name: 'estado', displayName: 'Estado', width: "15%"  },
  ];


  academicaRequest.obtenerPeriodo().then(function(response){
    ctrl.periodo=response[0];
  });

  var parametros = {
    'tipo': 'POSGRADO'
  };
  academicaRequest.obtenerCarreras(parametros).then(function(response){
    ctrl.carreras=response;
  });

  ctrl.buscarSolicitudes = function(carrera){
    ctrl.carrera=carrera;
    $scope.carrera=carrera;
    if(carrera){
      $scope.sols=[];
      var parametros=$.param({
        query:"Anio:"+ctrl.periodo.APE_ANO+",Periodo:"+ctrl.periodo.APE_PER+",CodigoCarrera:"+carrera
      });
      //buscar la solicitudes
      poluxRequest.get("solicitud_materias",parametros).then(function(response){
        angular.forEach(response.data, function(value) {
          ctrl.buscarEstudianteTg(value);
        });
      });
      ctrl.gridOptions.data = $scope.sols;

    }
  };

  ctrl.buscarEstudianteTg = function(tg){
    var parametros=$.param({
      query:"IdTrabajoGrado:"+tg.IdTrabajoGrado.Id,
      fields: "CodigoEstudiante"
    });
    //buscar la solicitudes
    poluxRequest.get("estudiante_tg",parametros).then(function(response){
      var parametros = {
        'codigo' : response.data[0].CodigoEstudiante,
        'ano' : 2014,
        'periodo' :1
      };
      academicaRequest.promedioEstudiante(parametros).then(function(response2){
        var solicitud = {
          "solicitud": tg.Id,
          "fecha": tg.Fecha,
          "estudiante": response.data[0].CodigoEstudiante.toString(),
          "nombre": response2[0].NOMBRE,
          "promedio": response2[0].PROMEDIO,
          "rendimiento": "0"+response2[0].REG_RENDIMIENTO_AC,
          "estado": tg.Estado
        };
        $scope.sols.push(solicitud);
      });

    });
  }

  ctrl.gridOptions.onRegisterApi = function (gridApi) {
    ctrl.gridApi= gridApi
  };

  ctrl.allsQ = [];
  ctrl.rendimiento = 0;
  ctrl.economicas = 0;

  ctrl.openDialog = function($event) {
    $mdDialog.show({
      controller: function ($timeout, $q, $scope, $mdDialog) {
        $scope.cupos_excelencia_ingresado = null;
        $scope.cupos_adicionales_ingresado = null;
        //Consultar cupos
        poluxMidRequest.post("cupos/Obtener?tdominio=2").then(function(response){
          console.log(response.data);
          $scope.cupos_excelencia=response.data.Cupos_excelencia;
          $scope.cupos_adicionales=response.data.Cupos_adicionales;
        });

        var parametros=$.param({
          query:"CodigoCarrera:"+ctrl.carrera+",Anio:"+ctrl.periodo.APE_ANO+",Periodo:"+ctrl.periodo.APE_PER
        });
        poluxRequest.get("carrera_elegible",parametros).then(function(response){
          console.log(response.data);
          if(response.data[0].CuposExcelencia>0 && response.data[0].CuposAdicionales>0){
            $scope.cupos_excelencia_ingresado=response.data[0].CuposExcelencia;
            $scope.cupos_adicionales_ingresado=response.data[0].CuposAdicionales;

          }

        });

        var questList =this;
        $scope.cancel = function($event) {
          $mdDialog.cancel();
        };
        $scope.finish = function($event) {
          $mdDialog.hide();
        };
        $scope.answer = function(answer) {
          $mdDialog.hide(answer);
        };
      },

      controllerAs: 'self',
      templateUrl: 'dialog.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose:true,
      locals: {parent: $scope},
      //bindToController: true,


      scope: $scope,
      preserveScope: true,

    })
    .then(function(answer) {
      ctrl.status = answer;
      ctrl.rendimiento = $scope.cupos_excelencia_ingresado;
      ctrl.economicas = $scope.cupos_adicionales_ingresado;

      ctrl.rta ={
        'cupos_excelencia' : ctrl.rendimiento,
        'cupos_adicionales' : ctrl.economicas
      };

      ctrl.rta2 ={
        'NumAdmitidos' : ctrl.rta,
        'Solicitudes' : $scope.sols
      };

      //Guardar el # de cupos ingresados
      /* buscar carrera en carrera_elegible*/
      var parametros=$.param({
        query:"CodigoCarrera:"+$scope.carrera+",Anio:"+ctrl.periodo.APE_ANO+",Periodo:"+ctrl.periodo.APE_PER
      });
      poluxRequest.get("carrera_elegible",parametros).then(function(response){

        if(response.data[0].CuposExcelencia==0 && response.data[0].CuposAdicionales==0){
          response.data[0].CuposExcelencia=ctrl.rendimiento;
          response.data[0].CuposAdicionales=ctrl.economicas;

          poluxRequest.put("carrera_elegible", response.data[0].Id, response.data[0]).then(function(response){
            console.log(response.data);
          });
        }

      });

      //Enviar las solicitudes y # Admitidos
      poluxMidRequest.post("seleccion/Seleccionar?tdominio=2", ctrl.rta2).then(function(response){

        alert("Solicitudes aprobadas");
        console.log(response);
        //recargar datos
      //  ctrl.buscarSolicitudes($scope.carrera);
      });
    }, function() {
         ctrl.status = 'You cancelled the dialog.';
       }
    );
  };



});
