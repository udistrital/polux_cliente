'use strict';

/**
 * @ngdoc function

 * @name poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
 * @description
 * # SolicitudesAprobarSolicitudCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('SolicitudesAprobarSolicitudCtrl', function ($window,$sce,$q,nuxeo,poluxRequest,$routeParams,$translate,$scope) {
    var ctrl = this;

    ctrl.solicitud = $routeParams.idSolicitud;

    $scope.msgCargandoSolicitud = $translate.instant("LOADING.CARGANDO_DETALLES_SOLICITUD");
    $scope.loadSolicitud = true;


    var parametrosSolicitud = $.param({
        query:"Id:"+ctrl.solicitud,
        limit:1
    });
    poluxRequest.get("solicitud_trabajo_grado",parametrosSolicitud).then(function(responseSolicitud){
      var parametrosDetallesSolicitud = $.param({
          query:"SolicitudTrabajoGrado.Id:"+ctrl.solicitud,
          limit:0
      });
      ctrl.dataSolicitud = responseSolicitud.data[0];
      console.log("solicitud");
      console.log(ctrl.dataSolicitud);
      poluxRequest.get("detalle_solicitud",parametrosDetallesSolicitud).then(function(responseDetalles){

          poluxRequest.get("usuario_solicitud",parametrosDetallesSolicitud).then(function(responseEstudiantes){
              ctrl.detallesSolicitud = responseDetalles.data;
              var solicitantes = "";
              ctrl.detallesSolicitud.id = ctrl.solicitud;
              ctrl.detallesSolicitud.tipoSolicitud = ctrl.dataSolicitud.ModalidadTipoSolicitud;
              ctrl.detallesSolicitud.fechaSolicitud = ctrl.dataSolicitud.Fecha.toString().substring(0, 10);
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
              $scope.loadSolicitud = false;
          });
      });

    });

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

  });
