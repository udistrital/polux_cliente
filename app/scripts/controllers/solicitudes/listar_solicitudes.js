'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:SolicitudesListarSolicitudesCtrl
 * @description
 * # SolicitudesListarSolicitudesCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
.controller('SolicitudesListarSolicitudesCtrl', function ($window,nuxeo,$translate, academicaRequest,poluxRequest,$scope) {
  var ctrl = this;
  ctrl.solicitudes = [];
  ctrl.carrerasCoordinador = [];
  //$scope.userId = "60261576";
  //ctrl.userRole = "coordinador";
  $scope.userId = "20131020002";
  ctrl.userRole = "estudiante";
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

      ctrl.gridOptions = {
          paginationPageSizes: [5,10,15, 20, 25],
          paginationPageSize: 10,
          enableFiltering: true,
          enableSorting: true,
          enableSelectAll: false,
          useExternalPagination: false,
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

      if(rol === "estudiante"){
        tablaConsulta = "usuario_solicitud";
        parametrosSolicitudes = $.param({
            query:"usuario:"+identificador,
            limit:0
        });
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
                var parametrosRespuesta=$.param({
                  query:"SolicitudTrabajoGrado:"+solicitud.SolicitudTrabajoGrado.Id,
                });
                  poluxRequest.get("respuesta_solicitud",parametrosRespuesta).then(function(responseRespuesta){
                      solicitud.data.Estado = responseRespuesta.data[0].EstadoSolicitud.Nombre;
                      ctrl.solicitudes.push(solicitud.data);
                      ctrl.gridOptions.data = ctrl.solicitudes;
                 });
              });
        });
      }
      if(rol === "coordinador"){
        $scope.botones.push({ clase_color: "ver", clase_css: "fa fa-cog fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.RESPONDER_SOLICITUD'), operacion: 'responder', estado: true });

        var parametrosCoordinador = {
          "identificacion":$scope.userId,
        };

        tablaConsulta = "respuesta_solicitud";

        parametrosSolicitudes = $.param({
            //query:"usuario:"+identificador+",ESTADOSOLICITUD.ID:1",
            query:"ESTADOSOLICITUD.ID:1",
            limit:0
        });

      academicaRequest.obtenerCoordinador(parametrosCoordinador).then(function(responseCoordinador){
              ctrl.carrerasCoordinador = responseCoordinador;
              var carreras  = [];
              angular.forEach(responseCoordinador, function(carrera){
                  carreras.push(carrera.CODIGO_CARRERA);
              });

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

                  if(responseSolicitudes.data !== null){
                    ctrl.conSolicitudes = true;
                  }
                    var parametrosUsuario=$.param({
                      query:"SolicitudTrabajoGrado:"+solicitud.SolicitudTrabajoGrado.Id,
                      sortby:"Usuario",
                      order:"asc",
                      limit:1,
                    });
                    poluxRequest.get("usuario_solicitud",parametrosUsuario).then(function(usuario){
                        var parametrosEstudiante = {
                          "codigo":usuario.data[0].Usuario,
                        };
                        academicaRequest.obtenerEstudiantes(parametrosEstudiante).then(function(responseEstudiante){
                        var carreraEstudiante = responseEstudiante[0].CARRERA;
                        if(carreras.includes(carreraEstudiante)){
                          solicitud.data.Estado = solicitud.EstadoSolicitud.Nombre;
                          solicitud.data.Carrera = carreraEstudiante;
                          ctrl.solicitudes.push(solicitud.data);
                          ctrl.gridOptions.data = ctrl.solicitudes;
                        }
                      });
                    });
                  });
                });
        });
    }
  }

  ctrl.getDocumento = function(docid){
    nuxeo.connect().then(function(client) {
    // OK, the returned client is connected
    // 'https://athento.udistritaloas.edu.co/nuxeo/nxfile/default/ce5791c7-fd9f-41a5-90c6-fb9c882772bb/blobholder:0/dibujo.pdf';
     //nuxeo.request('/path/default-domain/workspaces/Proyectos de Grado POLUX/Solicitudes/Propuesta :20131020002')
    // nuxeo.request('/path/default-domain/workspaces/Proyectos de Grado POLUX/Solicitudes/Propuesta :20131020002')
      nuxeo.request('id/ce5791c7-fd9f-41a5-90c6-fb9c882772bb//@blob/blobholder:0')
        .get()
        .then(function(doc) {
           console.log(doc);
           $scope.enlace = doc.uid + ".pdf";
           $scope.titulo = doc.title
           $scope.descripcion = doc.get('dc:description');
           swal(
               'Registro Existoso',
               'El registro del documento "' + $scope.titulo + '" fue subido exitosamente' + '\n' + 'continue por favor con la asignación de areas de conocimiento',
               'success'
           );
      });
    /*  nuxeo.repository().fetch('ce5791c7-fd9f-41a5-90c6-fb9c882772bb', { schemas: ['dublincore', 'file'] }).then(function(doc) {
                                    console.log(doc);
                                    $scope.enlace = doc.uid + ".pdf";
                                    $scope.titulo = doc.get('dc:title');
                                    $scope.descripcion = doc.get('dc:description');
                                    $scope.file = doc.get('file:content');
                                    console.log($scope.file);
                                    swal(
                                        'Registro Existoso',
                                        'El registro del documento "' + $scope.titulo + '" fue subido exitosamente' + '\n' + 'continue por favor con la asignación de areas de conocimiento',
                                        'success'
                                    );
                                });*/
        console.log('Client is connected: ' + client.connected);
    }, function(err) {
    // cannot connect
        console.log('Client is not connected: ' + err);
    });

  }


  ctrl.filtrarSolicitudes = function(carrera_seleccionada){
      var solicitudesTemporales = [];
      angular.forEach(ctrl.solicitudes, function(solicitud){
            if(solicitud.Carrera===carrera_seleccionada){
                solicitudesTemporales.push(solicitud);
            }
      });
      ctrl.gridOptions.data = solicitudesTemporales;
  }

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
              $('#modalVerSolicitud').modal('show');
          });
      });
  }

  $scope.loadrow = function(row, operacion) {
            switch (operacion) {
                case "ver":
                    ctrl.cargarDetalles(row)
                    //$('#modalVerSolicitud').modal('show');
                    break;
                case "responder":
                    $('#modalEvaluarSolicitud').modal('show');
                    break;
                default:
            }
        };



});
