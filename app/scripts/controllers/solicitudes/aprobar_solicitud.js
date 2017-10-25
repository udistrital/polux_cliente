'use strict';

/**
 * @ngdoc function

 * @name poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
 * @description
 * # SolicitudesAprobarSolicitudCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('SolicitudesAprobarSolicitudCtrl', function (academicaRequest,$window,$sce,$q,nuxeo,poluxRequest,$routeParams,$translate,$scope) {
    var ctrl = this;

    ctrl.solicitud = $routeParams.idSolicitud;

    $scope.msgCargandoSolicitud = $translate.instant("LOADING.CARGANDO_DETALLES_SOLICITUD");
    $scope.loadSolicitud = true;

    ctrl.isInicial = false;
    ctrl.isPasantia = false;
    ctrl.hasRevisor = false;

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
                    //SI es el docente, detalle 9
                    console.log(detalle.DetalleTipoSolicitud.Detalle.Id===9);
                    if(detalle.DetalleTipoSolicitud.Detalle.Id===9){
                        ctrl.docente = {
                          "NOMBRE":detalle.Descripcion.split("-")[1],
                          "DIR_NRO_IDEN":detalle.Descripcion.split("-")[0],
                        };
                        console.log(ctrl.docente);
                    }
              });
              ctrl.detallesSolicitud.solicitantes = solicitantes.substring(2)+".";
              $scope.loadSolicitud = false;
          });
      });

      //Si es una solicitud inicial
      ctrl.dataSolicitud.TipoSolicitud = ctrl.dataSolicitud.ModalidadTipoSolicitud.TipoSolicitud.Id;
      ctrl.dataSolicitud.modalidad = ctrl.dataSolicitud.ModalidadTipoSolicitud.Modalidad.Id;
      if(ctrl.dataSolicitud.ModalidadTipoSolicitud.TipoSolicitud.Id === 2){
            ctrl.isInicial = true;
            if(ctrl.dataSolicitud.modalidad !== 2 && ctrl.dataSolicitud.modalidad !== 3){
                //Si no es de materias de posgrado y profundización trae los docentes
                academicaRequest.obtenerDocentesTG().then(function(docentes){
                  ctrl.docentes=docentes;
                });
                if(ctrl.dataSolicitud.modalidad === 1){
                  ctrl.isPasantia = true;
                }
                if(ctrl.dataSolicitud.modalidad !== 1 && ctrl.dataSolicitud.modalidad !== 8){
                  ctrl.hasRevisor = true;
                }
            }

      }

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
