'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:SolicitudesListarSolicitudesCtrl
 * @description
 * # SolicitudesListarSolicitudesCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
.controller('SolicitudesListarSolicitudesCtrl', function ($location,poluxMidRequest,academicaRequest,poluxRequest,$scope) {
  var ctrl = this;
  ctrl.solicitudes = [];

  $scope.codigo = "20092020048";

  $scope.$watch("codigo",function() {
    ctrl.validado=false;
    ctrl.conSolicitudes = false;

    academicaRequest.periodoAnterior().then(function(periodoAnterior){

      var parametros = {
        "codigo": $scope.codigo,
        //periodo anterior
        'ano' : periodoAnterior[0].APE_ANO,
        'periodo' :periodoAnterior[0].APE_PER
      };

      academicaRequest.promedioEstudiante(parametros).then(function(response2){

        if(response2){
          //porcentaje cursado
          var parametros2 = {
            "codigo": parametros.codigo
          };

          academicaRequest.porcentajeCursado(parametros).then(function(response3){


            ctrl.estudiante={
              "Codigo": parametros.codigo,
              "Nombre": response2[0].NOMBRE,
              "Modalidad": 6,
              "Tipo": "POSGRADO",
              "PorcentajeCursado": response3,
              "Promedio": response2[0].PROMEDIO,
              "Rendimiento": "0"+response2[0].REG_RENDIMIENTO_AC,
              "Estado": response2[0].EST_ESTADO_EST,
              "Nivel": response2[0].TRA_NIVEL,
              "TipoCarrera": response2[0].TRA_NOMBRE

            };

            ctrl.modalidad="MATERIAS POSGRADO";

            poluxMidRequest.post("verificarRequisitos/Registrar", ctrl.estudiante).then(function(response){
                if(response.data === "true"){
                    ctrl.actualizarSolicitudes(ctrl.estudiante.Codigo);
                    ctrl.validado=true;
                }
            });
          });
        }

      });

    });

    });



  ctrl.actualizarSolicitudes = function (codigo){
      ctrl.solicitudes = [];
      ctrl.gridOptions = {};
      var parametrosSolicitudes=$.param({
        query:"usuario:"+codigo,
        limit:0
      });
      poluxRequest.get("usuario_solicitud",parametrosSolicitudes).then(function(responseSolicitudes){
        angular.forEach(responseSolicitudes.data, function(solicitud){
          solicitud.respuesta=[];
          var parametrosRespuesta=$.param({
            query:"SolicitudTrabajoGrado:"+solicitud.SolicitudTrabajoGrado.Id,
          });
          poluxRequest.get("respuesta_solicitud",parametrosRespuesta).then(function(responseRespuesta){
              solicitud.respuesta = responseRespuesta.data[0];
              //console.log(responseRespuesta.data);
          });
          solicitud.data = {
            "Id":solicitud.SolicitudTrabajoGrado.Id,
            "ModalidadTipoSolicitud":solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud.Nombre,
            "Estado":"Radicada",
            "Fecha":solicitud.SolicitudTrabajoGrado.Fecha,
          }
          ctrl.solicitudes.push(solicitud.data);
        });
      //console.log(ctrl.solicitudes.respuesta);
        ctrl.gridOptions = {
          data: ctrl.solicitudes,
          rowTemplate: '<div></div>'
        };
        ctrl.gridOptions.columnDefs = [{
          name: 'Id',
          displayName: 'Número radicado',
          width: 200
        },{
          name: 'ModalidadTipoSolicitud',
          displayName: 'Tipo solicitud',
        },{
          name: 'Estado',
          displayName: 'Estado',
          width: 200
        }, {
          name: 'Fecha',
          displayName: 'Fecha',
          width: 300
        }, {
          name: 'Detalle',
          displayName: 'Detalle',
          width: 150,
          type: 'boolean',
          cellTemplate: '<a class="ver pull-center" href="/index.html"> <i class="fa fa-eye fa-lg" tittle="Ver Detalle">  </i> </a>'
        }];
        if(ctrl.solicitudes.length>0){
          ctrl.conSolicitudes = true;
        };
      });

  };

  ctrl.go = function (){
    ctrl.path = "/solicitudes/crear_solicitud/";
    //Consultar si el estudiante actualmente cursa una modalidad
    var parametrosTG = $.param({
        query:"CodigoEstudiante:"+ctrl.estudiante.Codigo+",EstadoEstudianteTrabajoGrado:1"
    });
    //se consulta si el estudiante tiene un trabajo de grado activo
    poluxRequest.get("estudiante_trabajo_grado",parametrosTG).then(function(responseTG){
        if(responseTG.data == null){
          $location.path(ctrl.path);
        }else{
            //Se redirecciona con el trabajo de grado
              $location.path(ctrl.path+responseTG.data[0].Id);
        }
    });

  };

});
