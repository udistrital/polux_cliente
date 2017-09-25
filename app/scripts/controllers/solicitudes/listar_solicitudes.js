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

      ctrl.cell = '<a class="configuracion"  data-toggle="modal" data-target="#modalVerSolicitud">' +
                        '<i data-toggle="tooltip" title="{{\'BTN.VER_DETALLES\' | translate }}"  ng-click="grid.appScope.listarSolicitudes.cargarDetalles(row)" class="fa fa-eye faa-spin animated-hover" aria-hidden="true"></i></a> ' ;
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
        ctrl.cell = ctrl.cell + '<a class="configuracion" ng-click="grid.appScope.consultaPropuesta.load_row(row,\'config\');" data-toggle="modal" data-target="#modalEvaluarSolicitud">' +
                        '<i data-toggle="tooltip" title="{{\'BTN.RESPONDER_SOLICITUD\' | translate }}" class="fa fa-cog fa-lg faa-spin animated-hover" aria-hidden="true"></i></a> ' ;
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
        width: 200
      },{
        name: 'ModalidadTipoSolicitud',
        displayName: $translate.instant('TIPO_SOLICITUD'),
      },{
        name: 'Estado',
        displayName: $translate.instant('ESTADO_SOLICITUD'),
        width: 200
      }, {
        name: 'Fecha',
        displayName: $translate.instant('FECHA'),
        width: 300
      }, {
        name: 'Detalle',
        displayName: $translate.instant('DETALLE'),
        width: 150,
        type: 'boolean',
        cellTemplate: ctrl.cell
      }];

      poluxRequest.get(tablaConsulta, parametrosSolicitudes).then(function(responseSolicitudes){
        if(responseSolicitudes.data !== null){
          ctrl.conSolicitudes = true;
        }
        angular.forEach(responseSolicitudes.data, function(solicitud){
          solicitud.data = {
          'Id':solicitud.SolicitudTrabajoGrado.Id,
          'ModalidadTipoSolicitud':solicitud.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud.Nombre,
          'Fecha':solicitud.SolicitudTrabajoGrado.Fecha,
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
      //console.log(ctrl.solicitudes.respuesta);

      });

  };

  ctrl.cargarDetalles = function(fila){
      var solicitud = fila.entity.Id;
      var parametrosSolicitud = $.param({
          query:"SolicitudTrabajoGrado.Id:"+solicitud,
          limit:0
      });
      poluxRequest.get("detalle_solicitud",parametrosSolicitud).then(function(responseDetalles){
          ctrl.detallesSolicitud = responseDetalles.data;
          console.log(responseDetalles.data);
      });
  }

});
