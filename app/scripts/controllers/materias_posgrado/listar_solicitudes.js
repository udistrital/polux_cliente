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
  ctrl.otro=[];

  //uigrid
  ctrl.gridOptions = {};
  ctrl.gridOptions.columnDefs = [
    { name: 'solicitud', displayName: 'Solicitud', width: "8%"  },
    { name: 'fecha', displayName: 'Fecha', type: 'date', cellFilter: 'date:\'yyyy-MM-dd\'', width: "8%"  },
    { name: 'estudiante', displayName: 'Código', width: "12%"  },
    { name: 'nombre', displayName: 'Nombre', width: "27%"  },
    { name: 'promedio', displayName: 'Promedio', width: "10%"  },
    { name: 'rendimiento', displayName: 'Rendimiento Académico', width: "17%"  },
    { name: 'estado.Nombre', displayName: 'Estado', width: "18%"  }
  ];

  poluxMidRequest.get("fechas/ObtenerFechas").then(function(response){
    console.log(response);
    $scope.fechaActual = new Date();
    $scope.fecha_inicio= new Date(response.data['inicio_proceso'].replace(/'/g, ""));
    $scope.fecha_fin= new Date(response.data['fecha_fin'].replace(/'/g, ""));
    $scope.segunda_fecha= new Date(response.data['segunda_fecha'].replace(/'/g, ""));
  }).catch(function(rta) {
    console.log(rta);
  });

  academicaRequest.obtenerPeriodo().then(function(response){
    ctrl.periodo=response[0];
  });

  var parametros = {
    'tipo': 'POSGRADO'
  };
  academicaRequest.obtenerCarreras(parametros).then(function(response){
    ctrl.carreras=response;
  });

//solicitudes iniciales de la modalidad de materias de posgrado
  ctrl.buscarSolicitudes = function(carrera){
    ctrl.carrera=carrera;
    $scope.carrera=carrera;
    if(carrera){
      $scope.sols=[];

          var parametros=$.param({
            query:"SolicitudTrabajoGrado.in:",
            limit:0
          });
          poluxRequest.get("respuesta_solicitud/Solicitudes",parametros).then(function(respuestaSolicitud){

            angular.forEach(respuestaSolicitud.data, function(value) {
            console.log(value);
            if(value!=null){
                //buscar detalle_tipo_solicitud=37->detalle de Espacios academicos
                var parametros=$.param({
                  query:"DetalleTipoSolicitud:37"+",SolicitudTrabajoGrado:"+value.SolicitudTrabajoGrado.Id
                });
                poluxRequest.get("detalle_solicitud",parametros).then(function(detalleSolicitud){
                  if(detalleSolicitud.data!=null){
                  var res = detalleSolicitud.data[0].Descripcion.split(",");
                  //buscar 1 de las asignaturas solicitadas, para buscar con el código la carrera solicitada
                  var parametros = {
                   'codigo': res[0]
                  };

                  academicaRequest.buscarAsignaturas(parametros).then(function(resp){
                if(ctrl.carrera==resp[0].PEN_CRA_COD){
                  var parametros=$.param({
                    query:"SolicitudTrabajoGrado:"+value.SolicitudTrabajoGrado.Id
                  });
                  poluxRequest.get("usuario_solicitud",parametros).then(function(usuarioSolicitud){

                    academicaRequest.periodoAnterior().then(function(periodoAnterior){
                        var parametros = {
                          'codigo' : usuarioSolicitud.data[0].Usuario,
                          'ano' : periodoAnterior[0].APE_ANO,
                          'periodo' :periodoAnterior[0].APE_PER
                        };
                        academicaRequest.promedioEstudiante(parametros).then(function(response2){
                          var solicitud = {
                            "solicitud": value.Id,
                            "fecha": value.Fecha,
                            "estudiante": usuarioSolicitud.data[0].Usuario,
                            "nombre": response2[0].NOMBRE,
                            "promedio": response2[0].PROMEDIO,
                            "rendimiento": "0"+response2[0].REG_RENDIMIENTO_AC,
                            "estado": value.EstadoSolicitud,
                            "respuesta": ""+value.Id
                          };
                          $scope.sols.push(solicitud);
                        });

                    });

                  });
                }
              });
            }
                });
            }
          });
          });

        /*angular.forEach(response.data, function(value) {
          ctrl.buscarEstudianteTg(value);
        });*/

      ctrl.gridOptions.data = $scope.sols;
    }
  }

  ctrl.seleccionAdmitidos = function(sols, rta){
    //Enviar las solicitudes y # Admitidos
    $scope.rta3 ={
      'NumAdmitidos' : rta,
      'Solicitudes' : sols
    };
    console.log($scope.rta3);

    poluxMidRequest.post("seleccion/Seleccionar", $scope.rta3).then(function(response){
      swal(
        'Solicitudes aprobadas',
        'Las solicitudes en la modalidad de espacios académicos de posgrado han sido aprobadas',
        'success'
      )
      //recargar datos
      ctrl.buscarSolicitudes($scope.carrera);
    });

  }

  ctrl.buscarEstudianteTg = function(tg){
    var parametros=$.param({
      query:"IdTrabajoGrado:"+tg.IdTrabajoGrado.Id,
      fields: "CodigoEstudiante"
    });
    //buscar la solicitudes

    academicaRequest.periodoAnterior().then(function(periodoAnterior){
      poluxRequest.get("estudiante_tg",parametros).then(function(response){
        var parametros = {
          'codigo' : response.data[0].CodigoEstudiante,
          'ano' : periodoAnterior[0].APE_ANO,
          'periodo' :periodoAnterior[0].APE_PER
        };
        academicaRequest.promedioEstudiante(parametros).then(function(response2){
          var solicitud = {
            "solicitud": tg.Id,
            "fecha": tg.Fecha,
            "estudiante": response.data[0].CodigoEstudiante.toString(),
            "nombre": response2[0].NOMBRE,
            "promedio": response2[0].PROMEDIO,
            "rendimiento": "0"+response2[0].REG_RENDIMIENTO_AC,
            "estado": tg.Estado,
            "formalizacion": tg.Formalizacion
          };
          $scope.sols.push(solicitud);
        });

      });
    });

  }

  ctrl.buscarEstudianteTgOpcionados = function(tg){
    var parametros=$.param({
      query:"IdTrabajoGrado:"+tg.IdTrabajoGrado.Id,
      fields: "CodigoEstudiante"
    });
    //buscar la solicitud
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
        $scope.solsOpcionados.push(solicitud);
      });

    });
  }

  ctrl.gridOptions.onRegisterApi = function (gridApi) {
    ctrl.gridApi= gridApi
  };

  ctrl.solicitudes2 = function(){

    if($scope.carrera){
      $scope.aprobadas=[];
      $scope.aprobadas2=[];
      ctrl.aprobadasPago=[];
      ctrl.solsBase=[];

      /*Solicitudes aprobadas y con formalizacion pendiente (7) quedan en estado rechazado (5)
        Se deben cancelar las Solicitudes aprobadas con formalizacion:pendiente*/
      /*var parametros=$.param({
        query:"EstadoSolicitud.Id:7",
        limit:0
      });
      poluxRequest.get("respuesta_solicitud",parametros).then(function(respuestaSolicitud){
          angular.forEach(respuestaSolicitud.data, function(value) {
            //verificar carrera solicitada por el estudiante corresponda con carrera del coordinador
            if(value!=null){
                var parametros=$.param({
                  query:"DetalleTipoSolicitud:37"+",SolicitudTrabajoGrado:"+value.SolicitudTrabajoGrado.Id
                });
                poluxRequest.get("detalle_solicitud",parametros).then(function(detalleSolicitud){
                    if(detalleSolicitud.data!=null){
                        var res = detalleSolicitud.data[0].Descripcion.split(",");
                        //buscar 1 de las asignaturas solicitadas, para buscar con el código la carrera solicitada
                        var parametros = {
                            'codigo': res[0]
                        };
                        academicaRequest.buscarAsignaturas(parametros).then(function(resp){
                            if($scope.carrera==resp[0].PEN_CRA_COD){
                              value.EstadoSolicitud.Id=5;
                              poluxRequest.put("respuesta_solicitud",value.Id, value).then(function(response){
                                console.log("response.data confirmado: " + response.data);
                              });
                            }
                        });
                    }
                });
            }
          });
      });*/

      /* Se deben cancelar las Solicitudes aprobadas con pago y que tengan formalizacion:pendiente */
      /*var parametros=$.param({
        query:"EstadoSolicitud.Id:8",
        limit:0
      });
      poluxRequest.get("respuesta_solicitud",parametros).then(function(respuestaSolicitud){
          angular.forEach(respuestaSolicitud.data, function(value) {
            //verificar carrera solicitada por el estudiante corresponda con carrera del coordinador
            if(value!=null){
                var parametros=$.param({
                  query:"DetalleTipoSolicitud:37"+",SolicitudTrabajoGrado:"+value.SolicitudTrabajoGrado.Id
                });
                poluxRequest.get("detalle_solicitud",parametros).then(function(detalleSolicitud){
                    if(detalleSolicitud.data!=null){
                        var res = detalleSolicitud.data[0].Descripcion.split(",");
                        //buscar 1 de las asignaturas solicitadas, para buscar con el código la carrera solicitada
                        var parametros = {
                            'codigo': res[0]
                        };
                        academicaRequest.buscarAsignaturas(parametros).then(function(resp){
                            if($scope.carrera==resp[0].PEN_CRA_COD){
                              value.EstadoSolicitud.Id=5;
                              poluxRequest.put("respuesta_solicitud",value.Id, value).then(function(response){
                                console.log("response.data confirmado: " + response.data);
                              });
                            }
                        });
                    }
                });
            }
          });
      });*/

      //obtener # de cupos
      var parametros=$.param({
        query:"CodigoCarrera:"+ctrl.carrera+",Anio:"+ctrl.periodo.APE_ANO+",Periodo:"+ctrl.periodo.APE_PER
      });

      poluxRequest.get("carrera_elegible",parametros).then(function(response){

        if(response.data[0].CuposExcelencia>0 && response.data[0].CuposAdicionales>0){
          $scope.cupos_excelencia_ingresado=response.data[0].CuposExcelencia;
          $scope.cupos_adicionales_ingresado=response.data[0].CuposAdicionales;

          //sols aprobadas y con formalizacion:confirmado
          ctrl.totalSols=0;

          var parametros=$.param({
            query:"EstadoSolicitud.Id:9",
            limit:0
          });


            poluxRequest.get("respuesta_solicitud", parametros).then(function(response){
            if(response.data!=null){
                angular.forEach(response.data, function(value) {
                    //verificar carrera solicitada por el estudiante corresponda con carrera del coordinador
                    if(value!=null){
                        var parametros=$.param({
                          query:"DetalleTipoSolicitud:37"+",SolicitudTrabajoGrado:"+value.SolicitudTrabajoGrado.Id
                        });
                        poluxRequest.get("detalle_solicitud",parametros).then(function(detalleSolicitud){
                            if(detalleSolicitud.data!=null){
                                var res = detalleSolicitud.data[0].Descripcion.split(",");
                                //buscar 1 de las asignaturas solicitadas, para buscar con el código la carrera solicitada
                                var parametros = {
                                    'codigo': res[0]
                                };
                                academicaRequest.buscarAsignaturas(parametros).then(function(resp){
                                    if($scope.carrera==resp[0].PEN_CRA_COD){
                                      $scope.aprobadas.push(value);
                                    }
                                    console.log($scope.aprobadas);

                                });
                            }
                        });
                      }
                  });
            }

            if($scope.aprobadas!=null){
              ctrl.totalSols=$scope.aprobadas.length;
              console.log(ctrl.totalSols);
            }

            console.log(ctrl.totalSols);
            var cuposDisponibles=0;
            if($scope.cupos_excelencia_ingresado!= ctrl.totalSols){
              cuposDisponibles=$scope.cupos_excelencia_ingresado-ctrl.totalSols;
              console.log("HAY más cupos, Total:" + cuposDisponibles);
            }else{
              console.log("No hay más cupos");
            }

            //sols aprobadas con pago y con formalizacion:confirmado
            var totalSolsPago=0;
            var parametros=$.param({
                query:"EstadoSolicitud.Id:10",
                limit:0
            });
            poluxRequest.get("respuesta_solicitud", parametros).then(function(response){

               angular.forEach(response.data, function(value) {
                    //verificar carrera solicitada por el estudiante corresponda con carrera del coordinador
                    if(value!=null){
                        var parametros=$.param({
                          query:"DetalleTipoSolicitud:37"+",SolicitudTrabajoGrado:"+value.SolicitudTrabajoGrado.Id
                        });
                        poluxRequest.get("detalle_solicitud",parametros).then(function(detalleSolicitud){
                            if(detalleSolicitud.data!=null){
                                var res = detalleSolicitud.data[0].Descripcion.split(",");
                                //buscar 1 de las asignaturas solicitadas, para buscar con el código la carrera solicitada
                                var parametros = {
                                    'codigo': res[0]
                                };
                                academicaRequest.buscarAsignaturas(parametros).then(function(resp){
                                    if($scope.carrera==resp[0].PEN_CRA_COD){
                                      ctrl.aprobadasPago.push(value.SolicitudTrabajoGrado);
                                    }
                                });
                            }
                        });
                    }
                });

              if(ctrl.aprobadasPago!=null){
                totalSolsPago=ctrl.aprobadasPago.length;
              }

              var cuposDisponiblesPago=0;
              if($scope.cupos_adicionales_ingresado!= totalSolsPago){
                cuposDisponiblesPago=$scope.cupos_adicionales_ingresado-totalSolsPago;
                console.log("HAY más cupos, Total:" + cuposDisponiblesPago);
              }else{
                console.log("No hay más cupos");
              }

              //buscar las solicitudes con estado:opcionado
              if($scope.carrera){

                var parametros=$.param({
                    query:"EstadoSolicitud.Id:6",
                    limit:0
                });
                //buscar las solicitudes
                $scope.solsOpcionados=[];
                poluxRequest.get("respuesta_solicitud",parametros).then(function(responseSolicitudes){

                    angular.forEach(responseSolicitudes.data, function(value) {
                        console.log(value);
                        if(value!=null){
                            //buscar detalle_tipo_solicitud=37->detalle de Espacios academicos
                            var parametros=$.param({
                              query:"DetalleTipoSolicitud:37"+",SolicitudTrabajoGrado:"+value.SolicitudTrabajoGrado.Id
                            });
                            poluxRequest.get("detalle_solicitud",parametros).then(function(detalleSolicitud){
                              if(detalleSolicitud.data!=null){
                                  var res = detalleSolicitud.data[0].Descripcion.split(",");
                                  //buscar 1 de las asignaturas solicitadas, para buscar con el código la carrera solicitada
                                  var parametros = {
                                   'codigo': res[0]
                                  };

                                  academicaRequest.buscarAsignaturas(parametros).then(function(resp){
                                    if(ctrl.carrera==resp[0].PEN_CRA_COD){
                                      var parametros=$.param({
                                        query:"SolicitudTrabajoGrado:"+value.SolicitudTrabajoGrado.Id
                                      });
                                      poluxRequest.get("usuario_solicitud",parametros).then(function(usuarioSolicitud){

                                        academicaRequest.periodoAnterior().then(function(periodoAnterior){
                                            var parametros = {
                                              'codigo' : usuarioSolicitud.data[0].Usuario,
                                              'ano' : periodoAnterior[0].APE_ANO,
                                              'periodo' :periodoAnterior[0].APE_PER
                                            };
                                            academicaRequest.promedioEstudiante(parametros).then(function(response2){
                                              var solicitud = {
                                                "solicitud": value.Id,
                                                "fecha": value.Fecha,
                                                "estudiante": usuarioSolicitud.data[0].Usuario,
                                                "nombre": response2[0].NOMBRE,
                                                "promedio": response2[0].PROMEDIO,
                                                "rendimiento": "0"+response2[0].REG_RENDIMIENTO_AC,
                                                "estado": value.EstadoSolicitud,
                                                "respuesta": ""+value.Id
                                              };
                                              console.log(solicitud);
                                              ctrl.agregar($scope.solsOpcionados, solicitud);
                                                if($scope.solsOpcionados.length==responseSolicitudes.data.length){
                                                  ctrl.rta ={
                                                    'cupos_excelencia' : cuposDisponibles,
                                                    'cupos_adicionales' : cuposDisponiblesPago
                                                  };
                                                  //ctrl.seleccionAdmitidos($scope.solsOpcionados, ctrl.rta);
                                                }
                                            });

                                        });

                                      });
                                    }
                                });
                              }
                            });
                        }
                      });


                });

              }

            });
          });
        }
      });

    }

  }

  ctrl.agregar = function(arreglo, solicitud){
    arreglo.push(solicitud);
    console.log(arreglo);
  }

  ctrl.solicitudes3 = function(){
    console.log("Selección de admitidos 3");
    //Solicitudes aprobadas y con formalizacion pendiente quedan en estado rechazado
    //Se deben cancelar las Solicitudes aprobadas con formalizacion:pendiente

    var parametros=$.param({
      query:"CodigoCarrera:"+ctrl.carrera+",Anio:"+ctrl.periodo.APE_ANO+",Periodo:"+ctrl.periodo.APE_PER+",Estado:aprobado,Formalizacion:pendiente"
    });

    poluxRequest.get("solicitud_materias", parametros).then(function(response){
      angular.forEach(response.data, function(value) {
        value.Estado='rechazado'
        value.Formalizacion='rechazado';
        poluxRequest.put("solicitud_materias",value.Id, value).then(function(response){
          console.log("response.data confirmado: " + response.data);
        });
      });
    });

    /* Se deben cancelar las Solicitudes aprobadas con pago y que tengan formalizacion:pendiente */

    var parametros=$.param({
      query:"CodigoCarrera:"+ctrl.carrera+",Anio:"+ctrl.periodo.APE_ANO+",Periodo:"+ctrl.periodo.APE_PER+",Estado:aprobado con pago,Formalizacion:pendiente"
    });

    poluxRequest.get("solicitud_materias", parametros).then(function(response){
      angular.forEach(response.data, function(value) {
        value.Estado='rechazado'
        value.Formalizacion='rechazado';
        poluxRequest.put("solicitud_materias",value.Id, value).then(function(response){
          console.log("response.data confirmado: " + response.data);
          swal(
            'Solicitudes aprobadas',
            'Las solicitudes en la modalidad de espacios académicos de posgrado han sido aprobadas',
            'success'
          )
          //recargar datos
          ctrl.buscarSolicitudes($scope.carrera);
        });
      });
    });

    alert("Se cancelan las solicitudes aprobadas/aprobadas con pago que no estén formalizadas");
    //recargar datos
    ctrl.buscarSolicitudes($scope.carrera);

  }

  ctrl.allsQ = [];
  ctrl.rendimiento = 0;
  ctrl.economicas = 0;

  ctrl.openDialog = function($event) {
    $mdDialog.show({
      controller: function ($timeout, $q, $scope, $mdDialog) {
        $scope.cupos_excelencia_ingresado = null;
        $scope.cupos_adicionales_ingresado = null;
        //Consultar cupos
        poluxMidRequest.get("cupos/Obtener").then(function(response){
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
      console.log($scope.sols);

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
      poluxMidRequest.post("seleccion/Seleccionar", ctrl.rta2).then(function(response){
        swal(
          'Solicitudes aprobadas',
          'Las solicitudes en la modalidad de espacios académicos de posgrado han sido aprobadas',
          'success'
        )
        console.log(response);
        //recargar datos
        ctrl.buscarSolicitudes($scope.carrera);
      });
    }, function() {
         ctrl.status = 'You cancelled the dialog.';
       }
    );
  };

});
