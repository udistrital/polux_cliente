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

    ctrl.respuestaSolicitud="";
    ctrl.justificacion="";
    ctrl.solicitud = $routeParams.idSolicitud;

    $scope.msgCargandoSolicitud = $translate.instant("LOADING.CARGANDO_DETALLES_SOLICITUD");
    $scope.msgEnviandFormulario = $translate.instant('LOADING.ENVIANDO_FORLMULARIO');
    $scope.loadSolicitud = true;
    $scope.loadFormulario = false;

    ctrl.isInicial = false;
    ctrl.isPasantia = false;
    ctrl.hasRevisor = false;

    //datos para el acta
    ctrl.acta = [];
    ctrl.acta.nombre = $translate.instant('DOCUMENTO.SIN_DOCUMENTO');
    ctrl.acta.url = "";

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

    //carreras del coordinador
    var parametrosCoordinador = {
      "identificacion":19451396,
    };
    ctrl.carrerasCoordinador = [];
    academicaRequest.obtenerCoordinador(parametrosCoordinador).then(function(responseCoordinador){
      if(responseCoordinador!=="null"){
        ctrl.carrerasCoordinador = responseCoordinador;
      }
    });

    ctrl.getDetallesSolicitud = function(parametrosDetallesSolicitud){
      var defered = $q.defer();
      var promise = defered.promise;
      poluxRequest.get("detalle_solicitud",parametrosDetallesSolicitud).then(function(responseDetalles){

          poluxRequest.get("usuario_solicitud",parametrosDetallesSolicitud).then(function(responseEstudiantes){
              if(responseDetalles.data===null){
                ctrl.detallesSolicitud = [];
              }else{
                ctrl.detallesSolicitud = responseDetalles.data;
              }

              var solicitantes = "";
              ctrl.detallesSolicitud.id = ctrl.solicitud;
              ctrl.detallesSolicitud.tipoSolicitud = ctrl.dataSolicitud.ModalidadTipoSolicitud;
              ctrl.detallesSolicitud.fechaSolicitud = ctrl.dataSolicitud.Fecha.toString().substring(0, 10);
              angular.forEach(responseEstudiantes.data,function(estudiante){
                  solicitantes += (", "+estudiante.Usuario) ;
              });
              ctrl.todoDetalles=[];
              angular.forEach(ctrl.detallesSolicitud,function(detalle){
                    ctrl.todoDetalles.push(detalle);
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
                    //console.log(detalle.DetalleTipoSolicitud.Detalle.Id===9);
                    if(detalle.DetalleTipoSolicitud.Detalle.Id===9){
                        ctrl.docenteDirector = {
                          "NOMBRE":detalle.Descripcion.split("-")[1],
                          "DIR_NRO_IDEN":detalle.Descripcion.split("-")[0],
                        };
                        console.log(ctrl.docenteDirector);
                    }
              });
              console.log(ctrl.todoDetalles);
              ctrl.detallesSolicitud.solicitantes = solicitantes.substring(2);
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
                //Si no es de materias de posgrado y profundizaciÃ³n trae los docentes
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


    ctrl.responder=function(){

      var parametros = $.param({
          query:"SolicitudTrabajoGrado.Id:"+ctrl.solicitud + ",Activo:TRUE",
          limit:0
      });
      poluxRequest.get("respuesta_solicitud",parametros).then(function(responseRta){
        console.log(responseRta);
        var data_documento = {};
        ctrl.vinculaciones=[];
        var objRtaAnterior=responseRta.data[0];
        var objRtaNueva = angular.copy(objRtaAnterior);

        objRtaAnterior.Activo=false;

        objRtaNueva.Id=null;
        objRtaNueva.EstadoSolicitud={
          "Id": Number(ctrl.respuestaSolicitud)
        }
        objRtaNueva.Justificacion=ctrl.justificacion;
        objRtaNueva.Fecha=new Date();

        var parametros = $.param({
            query:"Id:"+ctrl.acta.id,
            limit:0
        });

        //Cuando el acta ya está en NUXEO...
        poluxRequest.get("documento_escrito",parametros).then(function(responseDoc){

          console.log(responseDoc.data[0]);
          data_documento.DocumentoEscrito=responseDoc.data[0];
          data_documento.SolicitudTrabajoGrado= {
            "Id": Number(ctrl.solicitud)
          }


          if(ctrl.todoDetalles.length>0){

            angular.forEach(ctrl.todoDetalles,function(detalle){
              console.log(detalle);

              if(detalle.DetalleTipoSolicitud.Detalle.Nombre=="Director Actual" || detalle.DetalleTipoSolicitud.Detalle.Nombre=="Director Nuevo"||detalle.DetalleTipoSolicitud.Detalle.Nombre=="Evaluador Actual"||detalle.DetalleTipoSolicitud.Detalle.Nombre=="Evaluador Nuevo"){

                if(detalle.DetalleTipoSolicitud.Detalle.Nombre=="Director Actual"){
                  var aux=detalle.Descripcion.split(" ");
                  ctrl.directorActual=aux[0];
                }else if (detalle.DetalleTipoSolicitud.Detalle.Nombre=="Director Nuevo"){
                  var aux=detalle.Descripcion.split(" ");
                  ctrl.directorNuevo=Number(aux[0]);
                }else if (detalle.DetalleTipoSolicitud.Detalle.Nombre=="Evaluador Actual"){
                  var aux=detalle.Descripcion.split(" ");
                  ctrl.evaluadorActual=aux[0];
                }else if (detalle.DetalleTipoSolicitud.Detalle.Nombre=="Evaluador Nuevo"){
                  var aux=detalle.Descripcion.split(" ");
                  ctrl.evaluadorNuevo=Number(aux[0]);
                }
              }
            });

              //cambio de director interno o evaluadores
              if(ctrl.dataSolicitud.TipoSolicitud==4 || ctrl.dataSolicitud.TipoSolicitud==10){
                if(ctrl.respuestaSolicitud==5){//solicitud:rechazada
                  ctrl.rtaSol={
                    RespuestaAnterior:objRtaAnterior,
                    RespuestaNueva:objRtaNueva,
                    DocumentoSolicitud:data_documento,
                    TipoSolicitud: responseRta.data[0].SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud,
                    Vinculaciones: null,
                    EstudianteTrabajoGrado: null
                  };
                  console.log(ctrl.rtaSol);
                  poluxRequest.post("tr_respuesta_solicitud", ctrl.rtaSol).then(function(response) {
                    console.log(response);
                  });
                }else{//solicitud aprobada
                  //buscar vinculación
                  if(ctrl.dataSolicitud.TipoSolicitud==4){
                    var query="Usuario:"+ctrl.directorActual+",TrabajoGrado.Id:"+responseRta.data[0].SolicitudTrabajoGrado.TrabajoGrado.Id+",RolTrabajoGrado.Activo:true";
                  }else if (ctrl.dataSolicitud.TipoSolicitud==10){
                    var query="Usuario:"+ctrl.evaluadorActual+",TrabajoGrado.Id:"+responseRta.data[0].SolicitudTrabajoGrado.TrabajoGrado.Id+",RolTrabajoGrado.Activo:true";
                  }
                  var parametros = $.param({
                      query:query,
                      limit:0
                  });

                  var promesaVinculacion = ctrl.obtenerVinculaciones(parametros);
                  //Esperar a que se cumplan las promesas
                  promesaVinculacion.then(function(){
                    console.log(ctrl.vinculaciones);
                    ctrl.rtaSol={
                      RespuestaAnterior:objRtaAnterior,
                      RespuestaNueva:objRtaNueva,
                      DocumentoSolicitud:data_documento,
                      TipoSolicitud: responseRta.data[0].SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud,
                      Vinculaciones:ctrl.vinculaciones,
                      EstudianteTrabajoGrado: null
                    };
                    console.log(ctrl.rtaSol);
                    poluxRequest.post("tr_respuesta_solicitud", ctrl.rtaSol).then(function(response) {
                      console.log(response);
                    });
                  });
                }
              }else if(ctrl.dataSolicitud.TipoSolicitud==3){ //solicitud de cancelación de modalidad
                if(ctrl.respuestaSolicitud==5){//solicitud:rechazada
                  ctrl.rtaSol={
                    RespuestaAnterior:objRtaAnterior,
                    RespuestaNueva:objRtaNueva,
                    DocumentoSolicitud:data_documento,
                    TipoSolicitud: responseRta.data[0].SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud,
                    Vinculaciones: null,
                    EstudianteTrabajoGrado: null
                  };
                  console.log(ctrl.rtaSol);
                  poluxRequest.post("tr_respuesta_solicitud", ctrl.rtaSol).then(function(response) {
                    console.log(response);
                  });
                }
                else{//solicitud aprobada
                  console.log(ctrl.detallesSolicitud.solicitantes);
                  var parametros = $.param({
                      query:"Estudiante:"+ctrl.detallesSolicitud.solicitantes+",TrabajoGrado.Id:"+responseRta.data[0].SolicitudTrabajoGrado.TrabajoGrado.Id+",EstadoEstudianteTrabajoGrado.Id:1",
                      limit:0
                  });
                  poluxRequest.get("estudiante_trabajo_grado",parametros).then(function(responseTg){
                    console.log(responseTg);
                    var objEstudianteTG=responseTg.data[0];
                    objEstudianteTG.EstadoEstudianteTrabajoGrado.Id=2;
                    ctrl.rtaSol={
                      RespuestaAnterior:objRtaAnterior,
                      RespuestaNueva:objRtaNueva,
                      DocumentoSolicitud:data_documento,
                      TipoSolicitud: responseRta.data[0].SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud,
                      Vinculaciones: null,
                      EstudianteTrabajoGrado: objEstudianteTG
                    };
                    console.log(ctrl.rtaSol);
                    poluxRequest.post("tr_respuesta_solicitud", ctrl.rtaSol).then(function(response) {
                      console.log(response);
                    });
                  });
                }
              }else if(ctrl.dataSolicitud.TipoSolicitud==8){//solicitud de modificación de datos del trabajo de grado
                if(ctrl.respuestaSolicitud==5){//solicitud:rechazada
                  ctrl.rtaSol={
                    RespuestaAnterior:objRtaAnterior,
                    RespuestaNueva:objRtaNueva,
                    DocumentoSolicitud:data_documento,
                    TipoSolicitud: responseRta.data[0].SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud,
                    Vinculaciones: null,
                    EstudianteTrabajoGrado: null
                  };
                  console.log(ctrl.rtaSol);
                  poluxRequest.post("tr_respuesta_solicitud", ctrl.rtaSol).then(function(response) {
                    console.log(response);
                  });
                }else{

                  angular.forEach(ctrl.todoDetalles,function(detalle){
                    console.log(detalle);
                    if(detalle.DetalleTipoSolicitud.Detalle.Enunciado=="ESCRIBA_NOMBRE_NUEVO_PROPUESTA"){
                      ctrl.tgNuevoTitulo=detalle.Descripcion;
                    }else if(detalle.DetalleTipoSolicitud.Detalle.Enunciado=="SELECCIONE_NUEVAS_AREAS_CONOCIMIENTO"){
                      ctrl.tgNuevasAreas=detalle.Descripcion.split(',');
                    }
                  });

                }
              }else if(ctrl.dataSolicitud.TipoSolicitud==2){ //solicitud inicial
                //solicitud rechazada
                if(ctrl.respuestaSolicitud==5){
                  ctrl.rtaSol={
                    RespuestaAnterior:objRtaAnterior,
                    RespuestaNueva:objRtaNueva,
                    DocumentoSolicitud:data_documento,
                    TipoSolicitud: responseRta.data[0].SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud,
                    Vinculaciones: null,
                    EstudianteTrabajoGrado: null,
                    ModalidadTipoSolicitud: ctrl.detallesSolicitud.tipoSolicitud
                  };
                  console.log(ctrl.rtaSol);
                  poluxRequest.post("tr_respuesta_solicitud", ctrl.rtaSol).then(function(response) {
                    console.log(response);
                  });
                }
                //solicitud espacios académicos de posgrado o solicitud espacios académicos de profundización
                else if(ctrl.dataSolicitud.ModalidadTipoSolicitud.Id==13 || ctrl.dataSolicitud.ModalidadTipoSolicitud.Id==16){

                  var data_trabajo_grado={};
                  var data_estudiantes = [];
                  var otro={};
                  var estudiante={};

                  console.log(ctrl.detallesSolicitud);
                  angular.forEach(ctrl.detallesSolicitud, function(detalle){
                    if(detalle.DetalleTipoSolicitud.Detalle.Nombre=="Estudiantes"){
                      otro.Estudiantes=detalle.Descripcion;
                    }
                  });

                  console.log(otro.Estudiantes);

                  data_trabajo_grado={
                     "Titulo": ctrl.detallesSolicitud.tipoSolicitud.Modalidad.Nombre,
                     "Modalidad": {
                       "Id": ctrl.detallesSolicitud.tipoSolicitud.Modalidad.Id
                     },
                     "EstadoTrabajoGrado": {
                       "Id": 1
                     },
                     "DistincionTrabajoGrado": null
                   }


                   estudiante={
                      "Estudiante": otro.Estudiantes,
                      "TrabajoGrado": {
                        "Id": 0
                      },
                      "EstadoEstudianteTrabajoGrado": {
                        "Id": 1
                      }
                    }
                    console.log(estudiante);
                    data_estudiantes.push(estudiante);
                    console.log(data_estudiantes);

                     ctrl.trabajo_grado={
                        TrabajoGrado: data_trabajo_grado,
                        EstudianteTrabajoGrado: data_estudiantes,
                        DocumentoEscrito: null,
                        DocumentoTrabajoGrado: null,
                        AreasTrabajoGrado: null,
                        VinculacionTrabajoGrado: null
                     }
                     console.log(ctrl.trabajo_grado);

                     ctrl.rtaSol={
                       RespuestaAnterior:objRtaAnterior,
                       RespuestaNueva:objRtaNueva,
                       DocumentoSolicitud:data_documento,
                       TipoSolicitud: responseRta.data[0].SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud,
                       Vinculaciones: null,
                       EstudianteTrabajoGrado: null,
                       TrTrabajoGrado: ctrl.trabajo_grado,
                       ModalidadTipoSolicitud: ctrl.detallesSolicitud.tipoSolicitud
                     };


                  console.log(ctrl.rtaSol);
                  poluxRequest.post("tr_respuesta_solicitud", ctrl.rtaSol).then(function(response) {
                    console.log(response);
                  });
                }
                //Monografia, Proyecto de emprendimento, Creación e Interpretación, Producción académica
                else if(ctrl.dataSolicitud.ModalidadTipoSolicitud.Id==20 || ctrl.dataSolicitud.ModalidadTipoSolicitud.Id==46 || ctrl.dataSolicitud.ModalidadTipoSolicitud.Id==38 || ctrl.dataSolicitud.ModalidadTipoSolicitud.Id==55){
                  console.log(ctrl.detallesSolicitud);

                  var data_trabajo_grado={};
                  var data_estudiantes = [];
                  var data_documento2 = {};
                  var data_doc_tg = {};
                  var data_areas = [];
                  var data_vinculacion = [];

                  var otro={};
                  var estudiante={};
                  var vinculacion={};

                  angular.forEach(ctrl.detallesSolicitud, function(detalle){
                    if(detalle.DetalleTipoSolicitud.Detalle.Nombre=="Nombre propuesta"){
                      otro.Titulo=detalle.Descripcion;
                    }else if(detalle.DetalleTipoSolicitud.Detalle.Nombre=="Estudiantes"){
                      otro.Estudiantes=detalle.Descripcion.split(',');
                      console.log(otro.Estudiantes);
                    }else if(detalle.DetalleTipoSolicitud.Detalle.Nombre=="Propuesta"){
                      otro.Enlace=detalle.Descripcion;
                    }else if(detalle.DetalleTipoSolicitud.Detalle.Nombre=="Resumen propuesta"){
                      otro.Resumen=detalle.Descripcion;
                    }else if(detalle.DetalleTipoSolicitud.Detalle.Nombre=="Áreas de conocimiento"){
                      otro.Areas=detalle.Descripcion.split(',');
                    }
                  });

                    data_trabajo_grado={
                       "Titulo": otro.Titulo,
                       "Modalidad": {
                         "Id": ctrl.detallesSolicitud.tipoSolicitud.Modalidad.Id
                       },
                       "EstadoTrabajoGrado": {
                         "Id": 1
                       },
                       "DistincionTrabajoGrado": null
                     }

                    angular.forEach(otro.Estudiantes, function(est){
                      console.log(est);
                      estudiante={
                         "Estudiante": est,
                         "TrabajoGrado": {
                           "Id": 0
                         },
                         "EstadoEstudianteTrabajoGrado": {
                           "Id": 1
                         }
                       }
                       data_estudiantes.push(estudiante);
                    });

                    data_documento2={
                      "Titulo": otro.Titulo,
                      "Enlace": otro.Enlace,
                      "Resumen": otro.Resumen,
                      "TipoDocumentoEscrito": 1
                    }

                    data_doc_tg={
                      "TrabajoGrado": {
                        "Id": 0
                      },
                      "DocumentoEscrito": {
                        "Id": 0
                      }
                    }

                    angular.forEach(otro.Areas, function(area){
                      area={
                        "AreaConocimiento": {
                          "Id": Number(area)
                        },
                        "TrabajoGrado": {
                          "Id": 0
                        }
                      }
                      data_areas.push(area);
                    });

                      vinculacion={
                        "Usuario": Number(ctrl.docenteDirector.DIR_NRO_IDEN),
                        "Activo": true,
                        "FechaInicio": new Date(),
                        "FechaFin": null,
                        "RolTrabajoGrado": {
                          "Id": 1
                        },
                        "TrabajoGrado": {
                          "Id": 0
                        }
                      }
                      data_vinculacion.push(vinculacion);

                      vinculacion={
                        "Usuario": Number(ctrl.docenteRevisor.DIR_NRO_IDEN),
                        "Activo": true,
                        "FechaInicio": new Date(),
                        "FechaFin": null,
                        "RolTrabajoGrado": {
                          "Id": 3
                        },
                        "TrabajoGrado": {
                          "Id": 0
                        }
                      }
                      data_vinculacion.push(vinculacion);

                       ctrl.trabajo_grado={
                          TrabajoGrado: data_trabajo_grado,
                        	EstudianteTrabajoGrado: data_estudiantes,
                        	DocumentoEscrito: data_documento2,
                        	DocumentoTrabajoGrado: data_doc_tg,
                        	AreasTrabajoGrado: data_areas,
                        	VinculacionTrabajoGrado: data_vinculacion
                       }
                       console.log(ctrl.trabajo_grado);

                       ctrl.rtaSol={
                         RespuestaAnterior:objRtaAnterior,
                         RespuestaNueva:objRtaNueva,
                         DocumentoSolicitud:data_documento,
                         TipoSolicitud: responseRta.data[0].SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud,
                         Vinculaciones: null,
                         EstudianteTrabajoGrado: null,
                         TrTrabajoGrado: ctrl.trabajo_grado,
                         ModalidadTipoSolicitud: ctrl.detallesSolicitud.tipoSolicitud
                       };
                       console.log(ctrl.rtaSol);
                       poluxRequest.post("tr_respuesta_solicitud", ctrl.rtaSol).then(function(response) {
                         console.log(response);
                       });
                }
              }

        }else{ //solictud de: prórroga y de socialización
          ctrl.rtaSol={
            RespuestaAnterior:objRtaAnterior,
            RespuestaNueva:objRtaNueva,
            DocumentoSolicitud:data_documento,
            TipoSolicitud: responseRta.data[0].SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud,
            Vinculaciones: null,
            EstudianteTrabajoGrado: null
          };
          console.log(ctrl.rtaSol);
          poluxRequest.post("tr_respuesta_solicitud", ctrl.rtaSol).then(function(response) {
            console.log(response);
          });
        }



        });


      });


    }

    ctrl.obtenerVinculaciones = function(parametros){
      var defered = $q.defer();
      var promise = defered.promise;

      poluxRequest.get("vinculacion_trabajo_grado",parametros).then(function(responseVinculacion){
        console.log(responseVinculacion);
        ctrl.vinculacionActual=responseVinculacion.data[0];
        var nuevaVinculacion = angular.copy(ctrl.vinculacionActual);
        //actualizar vinculacion actual
        ctrl.vinculacionActual.Activo=false;
        ctrl.vinculacionActual.FechaFin=new Date();

        nuevaVinculacion.Id=null;
        //nuevaVinculacion.Usuario=ctrl.directorNuevo;
        nuevaVinculacion.Usuario=ctrl.evaluadorNuevo;
        nuevaVinculacion.FechaInicio=new Date();
        nuevaVinculacion.FechaFin=null;
        ctrl.vinculaciones.push(ctrl.vinculacionActual);
        ctrl.vinculaciones.push(nuevaVinculacion);
        defered.resolve(ctrl.vinculaciones);

      });
      return promise;
    };


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
                ctrl.cargarDocumento("ActaSolicitud"+ctrl.solicitud, "Acta de evaluaciÃ³n de la solicitud "+ctrl.solicitud,documento, function(url){
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

    ctrl.obtenerDoc = function (docid) {
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

    ctrl.getDocumento = function(docid){
        if(docid!== undefined){
          $scope.loadDocumento = true;
        nuxeo.header('X-NXDocumentProperties', '*');



          ctrl.obtenerDoc(docid).then(function(){
             ctrl.obtenerFetch(ctrl.document).then(function(r){
                 ctrl.blob=r;
                 var fileURL = URL.createObjectURL(ctrl.blob);
                 console.log(fileURL);
                 ctrl.content = $sce.trustAsResourceUrl(fileURL);
                 $window.open(fileURL);
                 $scope.loadDocumento = false;
              });
          });
        }else{
          swal(
            $translate.instant("DOCUMENTO.SIN_DOCUMENTO"),
            ' ',
            'warning'
          );
        }
    }


    ctrl.getDocumentos = function(){
      // codigo para ejecutar consulta en nuxeo

      /*
      nuxeo.header('X-NXDocumentProperties', '*');
      nuxeo.operation('Document.Query')
          .params({
            query:"SELECT * FROM Document WHERE dc:title like 'ActasSolicitudes-20-%'",
          })
          .execute()
          .then(function(doc) {
              angular.forEach(doc.entries, function(documento){
                  ctrl.obtenerDoc(documento.uid).then(function(doc){
                      var tempDoc = {
                        "nombre":doc.get("file:content").name,
                        "url": doc.uid,
                        "documento":doc,
                      }
                      ctrl.documentos.push(tempDoc);
                  });
              });
          });
        */
        var sql = "";
        angular.forEach(ctrl.carrerasCoordinador, function(carrera){
            sql = sql+",Titulo.contains:Codigo de carrera:"+carrera.CODIGO_CARRERA;

            var parametrosDocumentos = $.param({
              query:"TipoDocumentoEscrito:1"+sql,
              //query:"TipoDocumentoEscrito:1,Titulo.contains:Acta 12,Titulo.contains:Acta undefined",
              limit:0
            });
            $scope.loadDocumento = true;
            poluxRequest.get("documento_escrito",parametrosDocumentos).then(function(responseDocumentos){

              console.log(responseDocumentos);

                  angular.forEach(responseDocumentos.data, function(documento){
                    console.log("documentos", documento);
                      var tempDoc = {
                        "id": documento.Id,
                        "nombre":documento.Titulo,
                        "url": documento.Enlace,
                      }
                      ctrl.documentos.push(tempDoc);
                    });
                  $scope.loadDocumento = false;
            });
        });

    }



    ctrl.seleccionarDocumento = function(){
      if(ctrl.acta.url!==undefined){
        $('#modalSeleccionarDocumento').modal('hide');
      }else{
        swal(
          $translate.instant("DOCUMENTO.SIN_DOCUMENTO"),
          ' ',
          'warning'
        );
      }
    }

    ctrl.modalDocumento = function(){
      ctrl.documentos = [];
      ctrl.getDocumentos();
      $('#modalSeleccionarDocumento').modal('show');
    }


  });
