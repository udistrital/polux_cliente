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
    { name: 'fecha', displayName: 'Fecha', type: 'date', cellFilter: 'date:\'yyyy-MM-dd\'', width: "15%"  },
    { name: 'estudiante', displayName: 'Código', width: "15%"  },
    { name: 'nombre', displayName: 'Nombre', width: "20%"  },
    { name: 'promedio', displayName: 'Promedio', width: "15%"  },
    { name: 'rendimiento', displayName: 'Rendimiento Académico', width: "15%"  },
    { name: 'estado', displayName: 'Estado', width: "10%"  },
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

        //Consultar cupos
        poluxMidRequest.post("cupos/Obtener?tdominio=2").then(function(response){
          console.log(response.data);
          $scope.cupos_excelemcia=response.data.Cupos_excelencia;
          $scope.cupos_adicionales=response.data.Cupos_adicionales;
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
      controllerAs: 'questList',
      templateUrl: 'dialog.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose:true,
      locals: {parent: $scope},

    })
    .then(function(answer) {
      ctrl.status = answer;
      ctrl.allsQ.push({
        rendimiento: answer.rendimiento ,
        economicas: answer.economicas
      });
      ctrl.rendimiento = answer.rendimiento;
      ctrl.economicas = answer.economicas;

      ctrl.rta ={
        'cupos_excelencia' : ctrl.rendimiento,
        'cupos_adicionales' : ctrl.economicas
      };

      ctrl.rta2 ={
        'NumAdmitidos' : ctrl.rta,
        'Solicitudes' : $scope.sols
      };

      //Enviar las solicitudes y # Admitidos
      poluxMidRequest.post("seleccion/Seleccionar?tdominio=2", ctrl.rta2).then(function(response){
        alert("Solicitudes aprobadas");
        //recargar datos
        ctrl.buscarSolicitudes($scope.carrera);
      });
    }, function() {
         ctrl.status = 'You cancelled the dialog.';
       }
    );
  };



});
