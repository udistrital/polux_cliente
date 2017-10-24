'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:SolicitudesListarSolicitudesCtrl
 * @description
 * # SolicitudesListarSolicitudesCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
.controller('SolicitudesListarSolicitudesCtrl', function ($location, $q, $sce,$window,nuxeo,$translate, academicaRequest,poluxRequest,$scope) {
  var ctrl = this;
  $scope.msgCargandoSolicitudes = $translate.instant('LOADING.CARGANDO_SOLICITUDES');
  ctrl.solicitudes = [];
  ctrl.carrerasCoordinador = [];
  $scope.userId = "80093200";
  ctrl.userRole = "coordinador";
  //$scope.userId = "20131020002";
  //ctrl.userRole = "estudiante";
  ctrl.userId = $scope.userId;

  $scope.$watch("userId",function() {
      ctrl.conSolicitudes = false;
      ctrl.actualizarSolicitudes($scope.userId, ctrl.userRole);
      $scope.load = true;
    });



  ctrl.actualizarSolicitudes = function (identificador, rol){
    var promiseArr = [];

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
              angular.forEach(responseSolicitudes.data, function(solicitud){
                var defered = $q.defer();
                var promise = defered.promise;
                promiseArr.push(promise);
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
                      defered.resolve(solicitud.data);
                 });
              });
              $q.all(promiseArr).then(function(){
                  if(responseSolicitudes.data !== null){
                    ctrl.conSolicitudes = true;
                  }
                  ctrl.gridOptions.data = ctrl.solicitudes;
                  $scope.load = false;
              }).catch(function(error){
                  console.log(error);
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
              ctrl.carrerasCoordinador = [];
              var carreras  = [];
              if(responseCoordinador!=="null"){
              ctrl.carrerasCoordinador = responseCoordinador;
              angular.forEach(responseCoordinador, function(carrera){
                  carreras.push(carrera.CODIGO_CARRERA);
              });

              poluxRequest.get(tablaConsulta, parametrosSolicitudes).then(function(responseSolicitudes){
                angular.forEach(responseSolicitudes.data, function(solicitud){
                  var defered = $q.defer();
                  var promise = defered.promise;
                  promiseArr.push(promise);
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
                          defered.resolve(solicitud.data);
                          ctrl.gridOptions.data = ctrl.solicitudes;
                        }else{
                          defered.resolve(carreraEstudiante);
                        }
                      });
                    });
                  });
                  $q.all(promiseArr).then(function(){
                      if(ctrl.solicitudes.length != 0){
                        ctrl.conSolicitudes = true;
                      }
                      ctrl.gridOptions.data = ctrl.solicitudes;
                      $scope.load = false;
                  }).catch(function(error){
                      console.log(error);
                  });
                });
              }else{
                $scope.load = false;
              }
        });
    }
  }

  ctrl.getDocumento = function(docid){
      nuxeo.header('X-NXDocumentProperties', '*');

      ctrl.obtenerDoc = function () {
        var defered = $q.defer();

        nuxeo.request('/id/'+docid)
            .get()
            .then(function(response) {
              ctrl.doc=response;
              var aux=response.get('file:content');
              ctrl.document=response;
              defered.resolve(response);
            })
            .catch(function(error){
                defered.reject(error)
            });
        return defered.promise;
      };

      ctrl.obtenerFetch = function (doc) {
        var defered = $q.defer();

        doc.fetchBlob()
          .then(function(res) {
            defered.resolve(res.blob());

          })
          .catch(function(error){
                defered.reject(error)
            });
        return defered.promise;
      };

        ctrl.obtenerDoc().then(function(){

           ctrl.obtenerFetch(ctrl.document).then(function(r){
               ctrl.blob=r;
               var fileURL = URL.createObjectURL(ctrl.blob);
               console.log(fileURL);
               ctrl.content = $sce.trustAsResourceUrl(fileURL);
               $window.open(fileURL);
            });
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
              angular.forEach(ctrl.detallesSolicitud,function(detalle){
                    detalle.filas = [];
                    if(detalle.Descripcion.includes("JSON-")){
                        var datosMaterias = detalle.Descripcion.split("-");
                        detalle.carrera = JSON.parse(datosMaterias[1]);
                        console.log(detalle.carrera);
                        datosMaterias.splice(0, 2);
                        angular.forEach(datosMaterias, function(materia){
                            detalle.filas.push(JSON.parse(materia));
                                                    console.log(materia);
                        });

                        detalle.gridOptions = [];
                        detalle.gridOptions.columnDefs = [{
                          name: 'CodigoAsignatura',
                          displayName: $translate.instant('CODIGO_MATERIA'),
                          width:'30%',
                        },{
                          name: 'Nombre',
                          displayName: $translate.instant('NOMBRE'),
                          width: '50%',
                        }, {
                          name: 'Creditos',
                          displayName: $translate.instant('CREDITOS'),
                          width: '20%',
                        }];
                        detalle.gridOptions.data = detalle.filas;
                    }
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
                    //$('#modalEvaluarSolicitud').modal('show');
                    $location.path("solicitudes/aprobar_solicitud/"+row.entity.Id);
                    break;
                default:
            }
        };



});
