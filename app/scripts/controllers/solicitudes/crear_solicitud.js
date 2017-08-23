'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
 * @descriptioni
 * # SolicitudesCrearSolicitudCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('SolicitudesCrearSolicitudCtrl', function ($translate, poluxMidRequest,poluxRequest,$routeParams,academicaRequest,cidcRequest) {
      var ctrl = this;
      ctrl.modalidades = [];
      ctrl.solicitudes = [];
      ctrl.detalles = [];
      ctrl.areas = [];
      ctrl.espaciosElegidos = [];
      ctrl.siModalidad = false;
      ctrl.modalidad_select = false;
      ctrl.detallesCargados = false;
      ctrl.soliciudConDetalles = true;
      ctrl.conEstudiante = false;
      ctrl.estudiantes = [];
      ctrl.siPuede=false;
      ctrl.codigo = $routeParams.idEstudiante;
            ctrl.estudiantes.push(ctrl.codigo);
            var parametrosTrabajoEstudiante = $.param({
                query:"CodigoEstudiante:"+ctrl.codigo,
            });
            poluxRequest.get("estudiante_trabajo_grado",parametrosTrabajoEstudiante).then(function(responseTrabajoEstudiante){
                    ctrl.Trabajo = responseTrabajoEstudiante.data;
                    if(responseTrabajoEstudiante.data != null){
                      ctrl.codigo = responseTrabajoEstudiante.data[0].CodigoEstudiante;
                      ctrl.modalidad = responseTrabajoEstudiante.data[0].TrabajoGrado.Modalidad.Id;
                      ctrl.trabajo_grado = responseTrabajoEstudiante.data[0].TrabajoGrado.Id;
                      console.log(ctrl.trabajo_grado);
                      ctrl.siModalidad = true;
                      ctrl.modalidad_select = true;
                      ctrl.cargarTipoSolicitud(ctrl.modalidad);
                      var parametrosVinculacion = $.param({
                          query:"TrabajoGrado:"+ctrl.trabajo_grado,
                          limit:0
                      });
                      poluxRequest.get("vinculacion_trabajo_grado",parametrosVinculacion).then(function(responseVinculacion){
                            ctrl.Trabajo.evaluadores = [];
                            console.log(responseVinculacion.data);
                          angular.forEach(responseVinculacion.data, function(vinculado){
                              if(vinculado.RolTrabajoGrado.Id==1){
                                  ctrl.Trabajo.directorInterno = vinculado;
                              }
                              if(vinculado.RolTrabajoGrado.Id==2){
                                  ctrl.Trabajo.directorExterno = vinculado;
                              }
                              if(vinculado.RolTrabajoGrado.Id==3){
                                  ctrl.Trabajo.evaluadores.push(vinculado);
                              }
                          });
                          console.log(ctrl.Trabajo.directorInterno);
                          console.log(ctrl.Trabajo.directorExterno);
                          console.log(ctrl.Trabajo.evaluadores);
                      });
                      if(ctrl.modalidad == 2 || ctrl.modalidad==3){
                        var parametrosEspacios = $.param({
                          query:"trabajo_grado:"+ctrl.trabajo_grado,
                          limit:0
                        });
                        poluxRequest.get("espacio_academico_inscrito",parametrosEspacios).then(function (responseEspacios){
                            angular.forEach(responseEspacios.data, function(espacio){
                                ctrl.espaciosElegidos.push(espacio.EspaciosAcademicosElegibles);
                            });
                            ctrl.carreraElegida = responseEspacios.data[0].EspaciosAcademicosElegibles.CarreraElegible.Id;
                        });
                      }
                    }else{
                      poluxRequest.get("modalidad").then(function (responseModalidad){
                          ctrl.modalidades=responseModalidad.data;
                      });
                    }
                    ctrl.obtenerDatosEstudiante();
                    ctrl.obtenerAreas();
                    //ctrl.conEstudiante= true;
          });


        ctrl.obtenerAreas = function (){
            poluxRequest.get("area_conocimiento").then(function(responseAreas){
                ctrl.areas = responseAreas.data;

            });

          }



      ctrl.cargarTipoSolicitud= function (modalidad) {
        ctrl.solicitudes = [];
        var parametrosTiposSolicitudes = $.param({
          query:"Modalidad:"+modalidad,
          limit:0
        });
        poluxRequest.get("modalidad_tipo_solicitud",parametrosTiposSolicitudes).then(function(responseTiposSolicitudes){
            ctrl.solicitudes = responseTiposSolicitudes.data;
        });
      };


      ctrl.cargarDetalles= function (tipoSolicitud, modalidad_seleccionada) {
        ctrl.siPuede=false;
        ctrl.detallesCargados = false;
        ctrl.espaciosElegidos = [];
        ctrl.estudiantes = [];
        ctrl.ModalidadTipoSolicitud = tipoSolicitud;
        if(modalidad_seleccionada!==undefined){
            ctrl.estudiante.Modalidad = modalidad_seleccionada;
            ctrl.modalidad = modalidad_seleccionada;
        }
        console.log(ctrl.estudiante);
    //    poluxMidRequest.post("verificarRequisitos/Registrar", ctrl.estudiante).then(function(puede){

      //      puede.data = "true"
      //    if(puede.data==="true"){
            console.log(ctrl.estudiante);
            ctrl.soliciudConDetalles = true;
            ctrl.detalles = [];
            var parametrosDetalles;
            if(modalidad_seleccionada===undefined){
              parametrosDetalles = $.param({
                query:"ModalidadTipoSolicitud:"+tipoSolicitud,
                limit:0
              });
          }else{
              parametrosDetalles = $.param({
                query:"ModalidadTipoSolicitud.TipoSolicitud.Id:2,ModalidadTipoSolicitud.Modalidad.Id:"+modalidad_seleccionada,
                limit:0
              });
          }
            poluxRequest.get("detalle_tipo_solicitud",parametrosDetalles).then(function(responseDetalles){
                ctrl.detalles = responseDetalles.data;
                console.log(ctrl.detalles);
                angular.forEach(ctrl.detalles, function(detalle){
                  detalle.respuesta= "";
                  detalle.opciones = [];
                  //SE evalua si el detalle necesita cargar datos
                  if(detalle.Detalle.Descripcion!=='no_service' && detalle.Detalle.TipoDetalle.Id!==8){
                      //Se separa el strig
                      var parametrosServicio = detalle.Detalle.Descripcion.split(";");
                      var sql  = "";
                      var parametrosConsulta = [];
                      //servicio de academiaca
                      if(parametrosServicio[0]==="polux"){
                          var parametros= $.param({
                            limit:0
                          });
                          if(parametrosServicio[2]!==undefined){
                              parametrosConsulta = parametrosServicio[2].split(",");
                              angular.forEach(parametrosConsulta, function(parametro){
                                  if(!parametro.includes(":")){
                                    if(parametro == "trabajo_grado"){
                                      parametro = parametro+":"+ctrl.trabajo_grado;
                                    }
                                    if(parametro == "carrera_elegible"){
                                      parametro = parametro+":"+ctrl.carreraElegida;
                                    }
                                  }
                                  if(sql === ""){
                                      sql=parametro;
                                  }else{
                                      sql=sql+","+parametro;
                                  }
                              });
                              detalle.parametros= $.param({
                                query:sql,
                                limit:0
                              });
                          }
                          poluxRequest.get(parametrosServicio[1], detalle.parametros).then(function(responseOpciones){
                              if (detalle.Detalle.Nombre.includes("Nombre anterior de la propuesta")) {
                                  detalle.opciones.push({
                                    "NOMBRE":responseOpciones.data[0].Documento.Titulo
                                  });
                              }else if(detalle.Detalle.Nombre.includes("Anterior resumen de la propuesta")){
                                detalle.opciones.push({
                                  "NOMBRE":responseOpciones.data[0].Documento.Resumen
                                });
                              }else if(detalle.Detalle.Nombre.includes("Anteriores areas de conocimiento")){
                                var areasString = "";
                                angular.forEach(responseOpciones.data,function(area){
                                    areasString = areasString +", " + area.AreaConocimiento.Nombre;
                                });
                                detalle.opciones.push({
                                  "NOMBRE":areasString.substring(2)
                                });
                              }else if(detalle.Detalle.Nombre.includes("Nombre Empresa")){
                                angular.forEach(responseOpciones.data,function(empresa){
                                  detalle.opciones.push({
                                    "NOMBRE":empresa.Identificacion+"",
                                  });
                                });
                              }else if(detalle.Detalle.Nombre.includes("Espacio Academico Anterior")){
                                angular.forEach(responseOpciones.data,function(espacio){
                                  detalle.opciones.push({
                                    "NOMBRE":espacio.EspaciosAcademicosElegibles.CodigoAsignatura
                                  });
                                });
                              }else if(detalle.Detalle.Nombre.includes("Espacio Academico Nuevo")){
                                angular.forEach(responseOpciones.data,function(espacio){
                                  var esta = false;
                                  angular.forEach(ctrl.espaciosElegidos, function(asignatura){
                                      if(espacio.CodigoAsignatura==asignatura.CodigoAsignatura){
                                          esta = true;
                                      }
                                  });
                                  if(!esta){
                                    detalle.opciones.push({
                                      "NOMBRE":espacio.CodigoAsignatura
                                    });
                                  }
                                });
                              }else{
                                  detalle.opciones = responseOpciones.data;
                              }
                          });
                      }
                      if(parametrosServicio[0]==="academica"){
                          if(parametrosServicio[1]==="docente"){
                                //detalle.opciones=academicaRequest.obtenerDocentesJson();
                                academicaRequest.obtenerDocentes().then(function(docentes){
                                  detalle.opciones=docentes;
                                  console.log(docentes);
                                });
                          }
                      }
                      if(parametrosServicio[0]==="cidc"){
                          if(parametrosServicio[1]==="estructura_investigacion"){
                                detalle.opciones = cidcRequest.obtenerEntidades();
                          }
                          if(parametrosServicio[1]==="docentes"){
                                detalle.opciones = cidcRequest.obtenerDoncentes();
                          }
                      }
                      if(parametrosServicio[0]==="estatico"){
                          parametrosConsulta = parametrosServicio[2].split(",");
                          angular.forEach(parametrosConsulta, function(opcion){
                            detalle.opciones.push({
                              "NOMBRE":opcion
                            });
                          });
                      }



                  };
                });
                ctrl.detallesCargados = true;
                if(ctrl.detalles == null){
                    ctrl.soliciudConDetalles = false;
                }
            });
        //  }else{
    //          ctrl.siPuede=true;
    //          ctrl.detalles = [];
        //  }
    //  });

      };

      ctrl.obtenerDatosEstudiante = function(){
        academicaRequest.periodoAnterior().then(function(periodoAnterior){

          var parametros = {
            "codigo": ctrl.codigo,
            //periodo anterior
            'ano' : periodoAnterior[0].APE_ANO,
            'periodo' :periodoAnterior[0].APE_PER
          };

          academicaRequest.promedioEstudiante(parametros).then(function(response2){
            console.log(parametros);
            console.log(response2);
            if(response2){
              //porcentaje cursado
              var parametros2 = {
                "codigo": parametros.codigo
              };

              academicaRequest.porcentajeCursado(parametros).then(function(response3){


                ctrl.estudiante={
                  "Codigo": parametros.codigo,
                  "Nombre": response2[0].NOMBRE,
                  "Modalidad": ctrl.modalidad,
                  "Tipo": "POSGRADO",
                  "PorcentajeCursado": response3,
                  "Promedio": response2[0].PROMEDIO,
                  "Rendimiento": "0"+response2[0].REG_RENDIMIENTO_AC,
                  "Estado": response2[0].EST_ESTADO_EST,
                  "Nivel": response2[0].TRA_NIVEL,
                  "TipoCarrera": response2[0].TRA_NOMBRE

                };
                console.log(ctrl.estudiante);
                ctrl.conEstudiante=true;
                ctrl.estudiante.asignaturas_elegidas = [];
                ctrl.estudiante.areas_elegidas= [];
                ctrl.estudiante.minimoCreditos = false;
              });
            }
          });
        });
      }

      ctrl.imprimir = function (valor){
        console.log(valor);
      };


      ctrl.validarFormularioSolicitud = function(){
        console.log("detalles");
        angular.forEach(ctrl.detalles, function(detalle){
            if(detalle.Detalle.TipoDetalle.Nombre==='Label'){
                detalle.respuesta = detalle.opciones[0].Nombre;
            }
            if(detalle.Detalle.TipoDetalle.Nombre==='Documento'){
                detalle.respuesta = "urlDocumento";
            }
            if(detalle.Detalle.TipoDetalle.Nombre==='Directiva'){
                if(detalle.Detalle.Descripcion=='solicitar-asignaturas'){
                  detalle.respuesta = "";
                  angular.forEach(ctrl.estudiante.asignaturas_elegidas, function(asignatura){
                     detalle.respuesta = detalle.respuesta +"," + asignatura.CodigoAsignatura;
                  });
                  detalle.respuesta = detalle.respuesta.substring(1);
                }
                if(detalle.Detalle.Descripcion=='asignar-estudiantes'){
                   detalle.respuesta = (ctrl.estudiantes.length===0)? ctrl.codigo  :ctrl.codigo+","+ctrl.estudiantes.toString();
                }
                if(detalle.Detalle.Descripcion=='asignar-area'){
                  detalle.respuesta = "";
                  angular.forEach(ctrl.estudiante.areas_elegidas, function(area){
                     detalle.respuesta = detalle.respuesta +"," + area.Nombre;
                  });
                  detalle.respuesta = detalle.respuesta.substring(1);
                }
            }
            if(detalle.Detalle.TipoDetalle.Nombre==='Checkbox' || detalle.Detalle.TipoDetalle.Nombre==='Radio'){
                if(detalle.bool === undefined){
                    detalle.bool = false;
                }
                detalle.respuesta = detalle.bool.toString();
            }
        });
        //Realizar validaciones
        ctrl.erroresFormulario = false;
        angular.forEach(ctrl.detalles, function(detalle){
              if(typeof (detalle.respuesta)!=="string"){
                  swal(
                    'Validación del formulario',
                    "Diligencie correctamente el formulario por favor.",
                    'warning'
                  );
                  //console.log("Diligencie correctamente el formulario por favor.");
                  ctrl.erroresFormulario = true;
              }
              if(detalle.respuesta === "" && detalle.Detalle.TipoDetalle.Nombre !== "Directiva" ){
                swal(
                  'Validación del formulario',
                  "Debe completar todos los campos del formulario.",
                  'warning'
                );
                //console.log("Debe completar todos los campos del formulario.");
                ctrl.erroresFormulario = true;
              }
              if(detalle.respuesta === "" && detalle.Detalle.Descripcion=='asignar-area' ){
                swal(
                  'Validación del formulario',
                  "Debe ingresar al menos un area.",
                  'warning'
                );
                //console.log("Debe ingresar al menos un area.");
                ctrl.erroresFormulario = true;
              }
              if(detalle.Detalle.Descripcion=='solicitar-asignaturas' && !ctrl.estudiante.minimoCreditos ){
                console.log("Debe cumplir con el minimo de creditos.");
                ctrl.erroresFormulario = true;
              }
              if(detalle.Detalle.TipoDetalle.Nombre === "Selector" || detalle.Detalle.TipoDetalle.Nombre === "Lista"){
                    var contiene = false;
                    angular.forEach(detalle.opciones, function(opcion){
                        if(opcion.NOMBRE.includes(detalle.respuesta)){
                            contiene = true;
                        };
                    });
                    if(!contiene){
                      swal(
                        'Validación del formulario',
                        "Error ingrese una opcion valida.",
                        'warning'
                      );
                      console.log("Error ingrese una opcion valida")
                      ctrl.erroresFormulario = true;
                    }
              }
        });
        if(!ctrl.erroresFormulario){
            //var data_solicitud = [];
            var data_solicitud={};
            var data_detalles = [];
            var data_usuarios = [];
            var fecha = new Date();

            if(ctrl.trabajo_grado !== undefined){
                data_solicitud={
                  "Fecha": fecha,
                  "ModalidadTipoSolicitud": {
                    "Id": ctrl.ModalidadTipoSolicitud
                  },
                  "TrabajoGrado": {
                    "Id": ctrl.trabajo_grado
                  }
                };
            }else{
              data_solicitud={
                "Fecha": fecha,
                "ModalidadTipoSolicitud": {
                  "Id": ctrl.ModalidadTipoSolicitud
                }
              };
            }
            angular.forEach(ctrl.detalles, function(detalle){
              data_detalles.push({
                 "Descripcion": detalle.respuesta,
                 "SolicitudTrabajoGrado": {
                   "Id": 0
                 },
                 "DetalleTipoSolicitud": {
                   "Id": detalle.Id
                 }
              });

            });
            //Se agrega solicitud al estudiante
            data_usuarios.push({
              "Usuario":ctrl.codigo,
              "SolicitudTrabajoGrado": {
                "Id": 0
              }
            });

            angular.forEach(ctrl.estudiantes, function(estudiante){
              data_usuarios.push({
                "Usuario":estudiante,
                "SolicitudTrabajoGrado": {
                  "Id": 0
                }
              });
            });

            //se crea objeto con las solicitudes
            ctrl.solicitud={
              Solicitud: data_solicitud,
              DetallesSolicitud: data_detalles,
              UsuariosSolicitud: data_usuarios
            }

            poluxRequest.post("tr_solicitud", ctrl.solicitud).then(function(response) {
              if(response.data[0]==="Success"){
                swal(
                  'Registro del formulario',
                  "El formulario se registro correctamente",
                  'success'
                );
              }else{
                swal(
                  'Registro del formulario',
                  response.data[1],
                  'warning'
                );
              }
            });
        }
      }

  });
