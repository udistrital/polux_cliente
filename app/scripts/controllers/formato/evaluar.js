'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:FormatoEvaluarCtrl
 * @description
 * # FormatoEvaluarCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('FormatoEvaluarCtrl', function ($translate, $q, $scope,poluxRequest) {
    var ctrl = this;
    ctrl.distinciones = [];
    ctrl.trabajosEvaluador = [];
    ctrl.solicitudDistincion = [];
    ctrl.evaluador = 80093200;
    $scope.loadForm = true;
    ctrl.distincionEnabled = true;
    ctrl.cargarTrabajos = function(){
          var defered = $q.defer();
          var parametrosTrabajosEvaluador = $.param({
              query:"Activo:TRUE,RolTrabajoGrado:3,TrabajoGrado.EstadoTrabajoGrado.Id:1,Usuario:"+ctrl.evaluador,
              limit:0
          });
          poluxRequest.get("vinculacion_trabajo_grado",parametrosTrabajosEvaluador).then(function(responseTrabajosGrado){
              console.log("trabajos", responseTrabajosGrado.data);
              ctrl.trabajosEvaluador = responseTrabajosGrado.data;
              defered.resolve(ctrl.trabajosEvaluador);
          });
          return defered.promise;
    };

    ctrl.cargarDistinciones = function(){
          var defered = $q.defer();
          var parametrosDistinciones = $.param({
              query:"Activo:TRUE",
              limit:0
          });
          poluxRequest.get("distincion_trabajo_grado",parametrosDistinciones).then(function(responseDistinciones){
              console.log("distinciones",responseDistinciones.data);
              ctrl.distinciones = responseDistinciones.data;
              defered.resolve(ctrl.distinciones);
          });
          return defered.promise;
    };

    $q.all([ctrl.cargarTrabajos(),ctrl.cargarDistinciones()]).then(function(){
        $scope.loadForm = false;
    })

    ctrl.enviarEvaluacion = function(){
          //enviarEvaluacion
          if(ctrl.distincionEnabled){
                //enviarDistincion
                ctrl.enviarDatosDistincion();

          }
    }

    ctrl.enviarDatosDistincion = function(){

                      var data_solicitud={};
                      var data_detalles = [];
                      var data_usuarios = [];
                      var data_respuesta = {};
                      var fecha = new Date();

                      console.log(ctrl.solicitudDistincion.trabajoGrado);

                      var getModalidadTipoSolicitud = function(){
                            var defered = $q.defer();
                            var parametrosModalidadTipoSolicitud = $.param({
                                query:"TipoSolicitud:11,Modalidad:"+ctrl.solicitudDistincion.trabajoGrado.Modalidad.Id,
                                limit:0
                            });
                            poluxRequest.get("modalidad_tipo_solicitud", parametrosModalidadTipoSolicitud).then(function(responseModalidadTipoSolicitud){
                                var modalidadTipoSolicitud = responseModalidadTipoSolicitud.data[0].Id;

                                data_solicitud={
                                  "Fecha": fecha,
                                  "ModalidadTipoSolicitud": {
                                    "Id": modalidadTipoSolicitud,
                                  },
                                  "TrabajoGrado": {
                                    "Id": ctrl.solicitudDistincion.trabajoGrado.Id,
                                  }
                                };

                                defered.resolve(modalidadTipoSolicitud);

                            });
                            return defered.promise;
                      }

                      var getDetalles = function(modalidadTipoSolicitud){
                          var defered = $q.defer();
                          var parametrosDetalles = $.param({
                              query:"Activo:TRUE,ModalidadTipoSolicitud:"+modalidadTipoSolicitud,
                              limit:0
                          });
                          poluxRequest.get("detalle_tipo_solicitud", parametrosDetalles).then(function(responseDetalles){
                              angular.forEach(responseDetalles.data, function(detalle){
                                  var desc = "";
                                  if(detalle.Detalle.Id===13){
                                    desc = ctrl.solicitudDistincion.justificacion;
                                  }else if(detalle.Detalle.Id===48){
                                    desc = ctrl.evaluador;
                                  }else if(detalle.Detalle.Id===49){
                                    desc = ctrl.solicitudDistincion.tipoDistincion.Id;
                                  }

                                  data_detalles.push({
                                     "Descripcion": desc+"",
                                     "SolicitudTrabajoGrado": {
                                       "Id": 0
                                     },
                                     "DetalleTipoSolicitud": {
                                       "Id": detalle.Id,
                                     }
                                  });
                              });
                              defered.resolve(data_detalles);
                          });
                          return defered.promise;
                      }

                      var getUsuarios = function(){
                           var defered = $q.defer();
                           var parametrosEstudiantes = $.param({
                               query:"trabajoGrado:"+ctrl.solicitudDistincion.trabajoGrado.Id,
                               limit:0
                           });
                           poluxRequest.get("estudiante_trabajo_grado",parametrosEstudiantes).then(function(estudiantes){
                                angular.forEach(estudiantes.data, function(estudiante){
                                  data_usuarios.push({
                                  //  "Usuario":ctrl.evaluado,
                                    "Usuario":estudiante.Estudiante,
                                    "SolicitudTrabajoGrado": {
                                      "Id": 0
                                    }
                                  });
                                });
                                defered.resolve(data_usuarios);
                           });
                           return defered.promise;
                      }

                      getModalidadTipoSolicitud().then(function(modalidadTipoSolicitud){
                          getDetalles(modalidadTipoSolicitud).then(function(){
                              getUsuarios().then(function(){
                                // se agrega el usuario a la solicitud


                                //Respuesta de la solicitud
                                 data_respuesta={
                                   "Fecha": fecha,
                                   "Justificacion": "Su solicitud fue radicada",
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
                                 var solicitud={
                                   Solicitud: data_solicitud,
                                   Respuesta: data_respuesta,
                                   DetallesSolicitud: data_detalles,
                                   UsuariosSolicitud: data_usuarios
                                 }

                                 console.log("data solicitud", solicitud);

                                 poluxRequest.post("tr_solicitud", solicitud).then(function(response) {
                                    console.log(response.data);
                                     if(response.data[0]==="Success"){
                                       swal(
                                         $translate.instant("FORMULARIO_SOLICITUD"),
                                         $translate.instant("SOLICITUD_REGISTRADA"),
                                         'success'
                                       );
                                      // $location.path("/solicitudes/listar_solicitudes");
                                     }else{
                                       swal(
                                         $translate.instant("FORMULARIO_SOLICITUD"),
                                         $translate.instant(response.data[1]),
                                         'warning'
                                       );
                                     }
                                     $scope.loadFormulario = false;
                                   });
                              });
                          });
                      });

    }

  });
