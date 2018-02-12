'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:PasantiaSolicitarCartaCtrl
 * @description
 * # PasantiaSolicitarCartaCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('PasantiaSolicitarCartaCtrl', function ($scope,$translate,academicaRequest,poluxRequest,poluxMidRequest) {
    var ctrl = this;

    ctrl.validarRequisitosEstudiante = function(){
      ctrl.codigo = "20141020036";
      academicaRequest.get("periodo_academico","P").then(function(periodoAnterior){
        academicaRequest.get("datos_estudiante",[ ctrl.codigo, periodoAnterior.data.periodoAcademicoCollection.periodoAcademico[0].anio,periodoAnterior.data.periodoAcademicoCollection.periodoAcademico[0].periodo ]).then(function(response2){
          if (!angular.isUndefined(response2.data.estudianteCollection.datosEstudiante)) {
              ctrl.estudiante={
                "Codigo": ctrl.codigo,
                "Nombre": response2.data.estudianteCollection.datosEstudiante[0].nombre,
                "Modalidad": 1, //id modalidad de pasantia
                "Tipo": "POSGRADO",
                "PorcentajeCursado": response2.data.estudianteCollection.datosEstudiante[0].creditosCollection.datosCreditos[0].porcentaje.porcentaje_cursado[0].porcentaje_cursado,
                "Promedio": response2.data.estudianteCollection.datosEstudiante[0].promedio,
                "Rendimiento": response2.data.estudianteCollection.datosEstudiante[0].rendimiento,
                "Estado": response2.data.estudianteCollection.datosEstudiante[0].estado,
                "Nivel": response2.data.estudianteCollection.datosEstudiante[0].nivel,
                "TipoCarrera": response2.data.estudianteCollection.datosEstudiante[0].nombre_tipo_carrera,
                "Carrera":response2.data.estudianteCollection.datosEstudiante[0].carrera
              };
              if(ctrl.estudiante.Nombre !==  undefined){
                poluxMidRequest.post("verificarRequisitos/Registrar", ctrl.estudiante).then(function(verificacion){
                  if(verificacion.data==='true'){
                    ctrl.conEstudiante=false;
                    ctrl.siPuede=false;
                    $scope.loadEstudiante = false;
                  }else{
                    ctrl.conEstudiante=false;
                    ctrl.siPuede=true;
                    $scope.loadEstudiante = false;
                  }
                });
              }else{
                ctrl.conEstudiante=true;
                $scope.loadEstudiante = false;
              }
            }else{
              //No se pudo cargar el estudiante
              ctrl.conEstudiante=true;
              $scope.loadEstudiante = false;
            }
        });
      });
    }

    $scope.loadEstudiante = true;
    ctrl.validarRequisitosEstudiante();

    ctrl.enviarSolicitud = function(){
      //alert(ctrl.nombreEmpresa);

      console.log($translate.instant("PASANTIA.SEGURO_INFORMACION_CARTA",{nombre:ctrl.nombreReceptor,cargo:ctrl.cargoReceptor,empresa:ctrl.nombreEmpresa}));
      swal({
               title: $translate.instant("INFORMACION_SOLICITUD"),
               text: $translate.instant("PASANTIA.SEGURO_INFORMACION_CARTA",{nombre:ctrl.nombreReceptor,cargo:ctrl.cargoReceptor,empresa:ctrl.nombreEmpresa}),
               type: "warning",
               confirmButtonText: $translate.instant("ACEPTAR"),
               cancelButtonText: $translate.instant("CANCELAR"),
               showCancelButton: true
      }).then(function(){
        swal({
          title: $translate.instant("INFORMACION_SOLICITUD"),
          text: $translate.instant("PASANTIA.RECLAMAR_CARTA"),
          type: "warning",
          confirmButtonText: $translate.instant("ACEPTAR"),
          cancelButtonText: $translate.instant("CANCELAR"),
          showCancelButton: true
        });
      });
    }

  });
