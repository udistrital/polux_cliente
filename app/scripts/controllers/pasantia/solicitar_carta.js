'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:PasantiaSolicitarCartaCtrl
 * @description
 * # PasantiaSolicitarCartaCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('PasantiaSolicitarCartaCtrl', function ($location,$q,$scope,$translate,academicaRequest,poluxRequest,poluxMidRequest) {
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

    ctrl.postSolicitud = function(){
      var defer = $q.defer();

      var data_detalles = [];
      var data_solicitante = [];
      var data_respuesta = {};
      var fecha = new Date();

      //datos de la solicitud
      var data_solicitud={
        "Fecha": fecha,
        "ModalidadTipoSolicitud": {
          //id solicitud de carta en modalidad_tipo_solicitud
          "Id": 1
        }
      };

      //detalles de la solicitud, nombre empresa, nombre encargado y cargo
      data_detalles.push({
         "Descripcion": ctrl.nombreEmpresa,
         "SolicitudTrabajoGrado": {
           "Id": 0
         },
         "DetalleTipoSolicitud": {
           "Id": 1
         }
      });
      data_detalles.push({
         "Descripcion": ctrl.nombreReceptor,
         "SolicitudTrabajoGrado": {
           "Id": 0
         },
         "DetalleTipoSolicitud": {
           "Id": 2
         }
      });
      data_detalles.push({
         "Descripcion": ctrl.cargoReceptor,
         "SolicitudTrabajoGrado": {
           "Id": 0
         },
         "DetalleTipoSolicitud": {
           "Id": 3
         }
      });

      //informacion del solicitante
      data_solicitante.push({
        "Usuario":ctrl.codigo,
        "SolicitudTrabajoGrado": {
          "Id": 0
        }
      });

      //Respuesta de la solicitud
       data_respuesta={
         "Fecha": fecha,
         "Justificacion": "La solicitud fue radicada",
         "EnteResponsable":0,
         "Usuario": 0,
         "EstadoSolicitud": {
           "Id": 1
         },
         "SolicitudTrabajoGrado": {
           "Id": 0
         },
         "Activo": true
       }

       //se crea objeto con las solicitudes
       ctrl.postSolicitud={
         Solicitud: data_solicitud,
         Respuesta: data_respuesta,
         DetallesSolicitud: data_detalles,
         UsuariosSolicitud: data_solicitante
       }

       poluxRequest.post("tr_solicitud", ctrl.postSolicitud)
       .then(function(response) {
          defer.resolve(response);
       })
       .catch(function(error){
          defer.reject(error);
       });

      return defer.promise;
    }

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
          $scope.loadFormulario = false;
          ctrl.postSolicitud()
          .then(function(response){
            console.log(response.data);
             if(response.data[0]==="Success"){
               swal(
                 $translate.instant("FORMULARIO_SOLICITUD"),
                 $translate.instant("SOLICITUD_REGISTRADA"),
                 'success'
               );
               $location.path("/solicitudes/listar_solicitudes");
             }else{
               swal(
                 $translate.instant("FORMULARIO_SOLICITUD"),
                 $translate.instant(response.data[1]),
                 'warning'
               );
             }
             $scope.loadFormulario = false;
          })
          .catch(function(error){
            swal(
              $translate.instant("FORMULARIO_SOLICITUD"),
              $translate.instant("ERROR_CARGAR_SOLICITUDES"),
              'warning'
            );
          })

      });
    }

  });
