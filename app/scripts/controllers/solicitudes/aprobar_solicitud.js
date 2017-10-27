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
    $scope.msgEnviandFormulario = $translate.instant('LOADING.ENVIANDO_FORLMULARIO');
    $scope.loadSolicitud = true;
    $scope.loadFormulario = false;

    ctrl.isInicial = false;
    ctrl.isPasantia = false;
    ctrl.hasRevisor = false;

    //datos para infinite SolicitudesAprobarSolicitudCtrl//Infinite Scroll Magic
    $scope.infiniteScroll = {};
    $scope.infiniteScroll.numToAdd = 20;
    $scope.infiniteScroll.currentItems = 20;
    $scope.reloadScroll = function(){
       $scope.infiniteScrollcurrentItems = $scope.infiniteScroll.numToAdd;
    };
    $scope.addMoreItems = function(){
       $scope.infiniteScroll.currentItems += $scope.infiniteScroll.numToAdd;
    };

    ctrl.getDetallesSolicitud = function(parametrosDetallesSolicitud){
      var defered = $q.defer();
      var promise = defered.promise;
      poluxRequest.get("detalle_solicitud",parametrosDetallesSolicitud).then(function(responseDetalles){

          poluxRequest.get("usuario_solicitud",parametrosDetallesSolicitud).then(function(responseEstudiantes){
              ctrl.detallesSolicitud = [];
              if(responseDetalles.data !== null){
                ctrl.detallesSolicitud = responseDetalles.data;
              }

              var solicitantes = "";
              ctrl.detallesSolicitud.id = ctrl.solicitud;
              ctrl.detallesSolicitud.tipoSolicitud = ctrl.dataSolicitud.ModalidadTipoSolicitud;
              ctrl.detallesSolicitud.fechaSolicitud = ctrl.dataSolicitud.Fecha.toString().substring(0, 10);
              angular.forEach(responseEstudiantes.data,function(estudiante){
                  solicitantes += (", "+estudiante.Usuario) ;
              });
              angular.forEach(ctrl.detallesSolicitud,function(detalle){
                    detalle.filas = [];
                    var id = detalle.DetalleTipoSolicitud.Detalle.Id
                    if(id === 9 || id===14 || id===15){
                      var parametrosDocentesUD = {
                        "identificacion":detalle.Descripcion
                      };
                      academicaRequest.obtenerDocentes(parametrosDocentesUD).then(function(docente){
                        detalle.Descripcion = docente[0].DOC_NRO_IDEN+" "+docente[0].NOMBRE;
                      });

                    }else if(detalle.Descripcion.includes("JSON-")){
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
                        ctrl.docenteDirector = {
                          "NOMBRE":detalle.Descripcion.split("-")[1],
                          "DIR_NRO_IDEN":detalle.Descripcion.split("-")[0],
                        };
                        console.log(ctrl.docenteDirector);
                    }
              });
              ctrl.detallesSolicitud.solicitantes = solicitantes.substring(2)+".";
              defered.resolve(ctrl.detallesSolicitud);
          });
      });
      return promise;
    };

    ctrl.evaluarSolicitud = function(){
      var defered = $q.defer();
      var promise = defered.promise;
      ctrl.dataSolicitud.TipoSolicitud = ctrl.dataSolicitud.ModalidadTipoSolicitud.TipoSolicitud.Id;
      ctrl.dataSolicitud.NombreTipoSolicitud = ctrl.dataSolicitud.ModalidadTipoSolicitud.TipoSolicitud.Nombre;
      ctrl.dataSolicitud.modalidad = ctrl.dataSolicitud.ModalidadTipoSolicitud.Modalidad.Id;
      if(ctrl.dataSolicitud.ModalidadTipoSolicitud.TipoSolicitud.Id === 2){

            if(ctrl.dataSolicitud.modalidad !== 2 && ctrl.dataSolicitud.modalidad !== 3){
                ctrl.isInicial = true;
                //Si no es de materias de posgrado y profundización trae los docentes
                academicaRequest.obtenerDocentesTG().then(function(docentes){
                  ctrl.docentes=docentes;
                  console.log(ctrl.docentes);
                  defered.resolve(ctrl.docentes);
                });
                if(ctrl.dataSolicitud.modalidad === 1){
                  ctrl.isPasantia = true;
                }
                if(ctrl.dataSolicitud.modalidad !== 1 && ctrl.dataSolicitud.modalidad !== 8){
                  ctrl.hasRevisor = true;
                }
            }else{
              defered.resolve(ctrl.dataSolicitud.modalidad);
            }
      }else{
        defered.resolve(ctrl.dataSolicitud.modalidad);
      }
      return promise;
    };

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

      var promesaDetalles = ctrl.getDetallesSolicitud(parametrosDetallesSolicitud);
      var promesaEvaluar = ctrl.evaluarSolicitud();

      //Esperar a que se cumplan las promesas
      $q.all([promesaDetalles, promesaEvaluar]).then(function(){
        $scope.loadSolicitud = false;
      });

    });

    ctrl.cargarDocumento = function(nombre, descripcion, documento ,callback){
            var defered = $q.defer();
            var promise = defered.promise;
            nuxeo.operation('Document.Create')
              .params({
                type: 'File',
                name: nombre,
                properties: 'dc:title=' + nombre + ' \ndc:description=' + descripcion
              })
              .input('/default-domain/workspaces/Proyectos de Grado POLUX/Actas')
              .execute()
              .then(function(doc) {
                  var nuxeoBlob = new Nuxeo.Blob({ content: documento });
                  nuxeo.batchUpload()
                  .upload(nuxeoBlob)
                  .then(function(res) {
                    return nuxeo.operation('Blob.AttachOnDocument')
                        .param('document', doc.uid)
                        .input(res.blob)
                        .execute();
                  })
                  .then(function() {
                    return nuxeo.repository().fetch(doc.uid, { schemas: ['dublincore', 'file'] });
                  })
                  .then(function(doc) {
                    var url = doc.uid;
                    callback(url);
                    defered.resolve(url);
                  })
                  .catch(function(error) {
                    throw error;
                    ctrl.swalError();
                    $scope.loadFormulario = false;
                    defered.reject(error);
                  });
              })
              .catch(function(error) {
                  throw error;
                  ctrl.swalError();
                  $scope.loadFormulario = false;
                  defered.reject(error);
              });

              return promise;
    };

    ctrl.cargarJustificacion = function(callFunction){
          nuxeo.connect().then(function(client) {
          // OK, the returned client is connected
              console.log("CONECTADO");
              var tam=2000;
              $scope.loadFormulario = true;
              var documento = ctrl.acta;
              if(documento.type !== "application/pdf" || documento.size>tam){
                ctrl.cargarDocumento("ActaSolicitud"+ctrl.solicitud, "Acta de evaluación de la solicitud "+ctrl.solicitud,documento, function(url){
                  ctrl.urlActa = url;
                })
                .then(function(){
                    ctrl.cargarRespuesta();
                }).catch(function(error){
                    ctrl.swalError();
                    $scope.loadFormulario = false;
                });
              }else{
                ctrl.swalError();
                $scope.loadFormulario = false;
              }
          }, function(err) {
          // cannot connect
            ctrl.swalError();
          });

    };

    ctrl.swalError = function(){
      swal(
        $translate.instant("ERROR.SUBIR_DOCUMENTO"),
        $translate.instant("VERIFICAR_DOCUMENTO"),
        'warning'
      );
      $scope.loadFormulario = false;
    };

    ctrl.cargarRespuesta= function(){

      swal(
        $translate.instant("ERROR.SUBIR_DOCUMENTO"),
        $translate.instant("VERIFICAR_DOCUMENTO"),
        'success'
      );
      $scope.loadFormulario = false;
    };

    ctrl.validarFormularioAprobacion = function(){
        if(!ctrl.isInicial){
          ctrl.cargarJustificacion();
        }

    };

  });
