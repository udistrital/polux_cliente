'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:SolicitudesListarSolicitudesCtrl
 * @description
 * # SolicitudesListarSolicitudesCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
.controller('SolicitudesListarSolicitudesCtrl', function ($translate, academicaRequest,poluxRequest,$scope) {
  var ctrl = this;
  ctrl.solicitudes = [];

  $scope.userId = "60261576";
  ctrl.userRole = "coordinador";
  //$scope.userId = "20141020036";
  //ctrl.userRole = "estudiante";
  ctrl.userId = $scope.userId;

  $scope.$watch("userId",function() {
      ctrl.conSolicitudes = false;
      ctrl.actualizarSolicitudes($scope.userId, ctrl.userRole);
    });


  ctrl.actualizarSolicitudes = function (identificador, rol){
      ctrl.solicitudes = [];
      var parametrosSolicitudes;
      var tablaConsulta ;

      $scope.botones = [
              { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER_DETALLES'), operacion: 'ver', estado: true },
      ];

      if(rol === "estudiante"){
        tablaConsulta = "usuario_solicitud";
        parametrosSolicitudes = $.param({
            query:"usuario:"+identificador,
            limit:0
        });

      }
      if(rol === "coordinador"){
        tablaConsulta = "respuesta_solicitud";
        parametrosSolicitudes = $.param({
            query:"usuario:"+identificador+",ESTADOSOLICITUD.ID:1",
            limit:0
        });
        $scope.botones.push({ clase_color: "ver", clase_css: "fa fa-cog fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.RESPONDER_SOLICITUD'), operacion: 'responder', estado: true });

      }

      ctrl.gridOptions = {
          paginationPageSizes: [10,15, 20, 25],
          paginationPageSize: 10,
          enableFiltering: true,
          enableSorting: true,
      };

      ctrl.gridOptions.columnDefs = [{
        name: 'Id',
        displayName: $translate.instant('NUMERO_RADICADO'),
        width:'15%',
      },{
        name: 'ModalidadTipoSolicitud',
        displayName: $translate.instant('TIPO_SOLICITUD'),
        width:'40%',
      },{
        name: 'Estado',
        displayName: $translate.instant('ESTADO_SOLICITUD'),
        width: '15%',
      }, {
        name: 'Fecha',
        displayName: $translate.instant('FECHA'),
        width: '15%',
      }, {
        name: 'Detalle',
        displayName: $translate.instant('DETALLE'),
        width:'15%',
        type: 'boolean',
        cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>'
      }];

      poluxRequest.get(tablaConsulta, parametrosSolicitudes).then(function(responseSolicitudes){
        if(responseSolicitudes.data !== null){
          ctrl.conSolicitudes = true;
        }

        angular.forEach(responseSolicitudes.data, function(solicitud){
          solicitud.data = {
          'Id':solicitud.SolicitudTrabajoGrado.Id,
          'ModalidadTipoSolicitud':solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud.Nombre,
          'Fecha': solicitud.SolicitudTrabajoGrado.Fecha.toString().substring(0, 10),
          }
          if(rol=== "estudiante"){
            var parametrosRespuesta=$.param({
              query:"SolicitudTrabajoGrado:"+solicitud.SolicitudTrabajoGrado.Id,
            });
              poluxRequest.get("respuesta_solicitud",parametrosRespuesta).then(function(responseRespuesta){
                  solicitud.data.Estado = responseRespuesta.data[0].EstadoSolicitud.Nombre;
                  ctrl.solicitudes.push(solicitud.data);
                  ctrl.gridOptions.data = ctrl.solicitudes;
              });
          }
          if(rol === "coordinador"){
            solicitud.data.Estado = solicitud.EstadoSolicitud.Nombre;
            ctrl.solicitudes.push(solicitud.data);
            ctrl.gridOptions.data = ctrl.solicitudes;
          }
        });

      });

  };

  ctrl.cargarDetalles = function(fila){
      var solicitud = fila.entity.Id;
      var parametrosSolicitud = $.param({
          query:"SolicitudTrabajoGrado.Id:"+solicitud,
          limit:0
      });
      poluxRequest.get("detalle_solicitud",parametrosSolicitud).then(function(responseDetalles){
          poluxRequest.get("usuario_solicitud",parametrosSolicitud).then(function(responseEstudiantes){
              ctrl.detallesSolicitud = responseDetalles.data;
              var solicitantes = "";
              ctrl.detallesSolicitud.id = fila.entity.Id;
              ctrl.detallesSolicitud.tipoSolicitud = fila.entity.ModalidadTipoSolicitud;
              ctrl.detallesSolicitud.fechaSolicitud = fila.entity.Fecha;
              angular.forEach(responseEstudiantes.data,function(estudiante){
                  solicitantes += (", "+estudiante.Usuario) ;
              });
              ctrl.detallesSolicitud.solicitantes = solicitantes.substring(2)+".";
          });
      });
  }

  $scope.loadrow = function(row, operacion) {
            switch (operacion) {
                case "ver":
                    ctrl.cargarDetalles(row)
                    $('#modalVerSolicitud').modal('show');
                    break;
                case "responder":
                    $('#modalEvaluarSolicitud').modal('show');
                    break;
                default:
            }
        };

});
