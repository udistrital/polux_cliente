'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:SolicitudesCrearSolicitudCtrl
 * @descriptioni
 * # SolicitudesCrearSolicitudCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('SolicitudesCrearSolicitudCtrl', function (coreService,$window,$sce,$scope, nuxeo, $q,$translate, poluxMidRequest,poluxRequest,$routeParams,academicaRequest,cidcRequest, $location) {
      $scope.cargandoEstudiante = $translate.instant('LOADING.CARGANDO_ESTUDIANTE');
      $scope.enviandoFormulario = $translate.instant('LOADING.ENVIANDO_FORLMULARIO');
      $scope.cargandoDetalles = $translate.instant('LOADING.CARGANDO_DETALLES');

      //opciones infinite scroll
      $scope.infiniteScroll = {};
      $scope.infiniteScroll.numToAdd = 20;
      $scope.infiniteScroll.currentItems = 20;
      $scope.reloadScroll = function(){
         $scope.infiniteScrollcurrentItems = $scope.infiniteScroll.numToAdd;
      };
      $scope.addMoreItems = function(){
         $scope.infiniteScroll.currentItems += $scope.infiniteScroll.numToAdd;
      };

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
      //estudiantes que estan en el tg
      ctrl.estudiantesTg=[];
      //estudiantes que se agregan a la solicitud inicial
      ctrl.estudiantes = [];
      ctrl.detallesConDocumento = [];
      $scope.loadEstudiante = true;
      ctrl.siPuede=false;
      ctrl.tieneProrrogas = false;
      ctrl.codigo = $routeParams.idEstudiante;

      //buscar prorrogas anteriores
      ctrl.getProrroga = function(){
        var defered = $q.defer();

        var parametrosTrabajoGrado = $.param({
          query:"TrabajoGrado.EstadoTrabajoGrado.Id:1,Estudiante:"+ctrl.codigo,
          limit: 1,
        });
        //se consulta el trabajo de grado actual
        poluxRequest.get("estudiante_trabajo_grado",parametrosTrabajoGrado).then(function(responseTrabajoGrado){
          if(responseTrabajoGrado.data!==null){
            //se consulta si el trabajo tiene solicitudes de proroga aprobadas
            var parametrosProrroga = $.param({
              query:"EstadoSolicitud:6,activo:TRUE,SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud.Id:7,SolicitudTrabajoGrado.TrabajoGrado.Id:"+responseTrabajoGrado.data[0].Id,
              limit: 1,
            });
            poluxRequest.get("respuesta_solicitud",parametrosProrroga).then(function(responseProrroga){
                if(responseProrroga.data!=null){
                  ctrl.tieneProrrogas = true;
                }
                defered.resolve(ctrl.tieneProrrogas);
            });
          }else{
            defered.resolve(ctrl.tieneProrrogas);
          }
        });
        return defered.promise;
      }

      //modalidad restringida ninguna
      ctrl.restringirModalidades = false;


            ctrl.verificarSolicitudes = function(){
              var defered = $q.defer();
              var parametrosUser = $.param({
                query:"usuario:"+ctrl.codigo,
                limit:0,
              });
              var actuales = [];

              var requestRespuesta = function(solActuales, id ){
                  var defered = $q.defer();

                  var parametrosSolicitudesActuales = $.param({
                    query:"EstadoSolicitud.in:1|2,activo:TRUE,SolicitudTrabajoGrado:"+id,
                    limit: 1,
                  });
                  poluxRequest.get("respuesta_solicitud",parametrosSolicitudesActuales).then(function(responseSolicitudesActuales){
                      if(responseSolicitudesActuales.data!=null){
                        defered.resolve(responseSolicitudesActuales.data);
                        solActuales.push(responseSolicitudesActuales.data[0]);
                      }else{
                        defered.resolve(responseSolicitudesActuales.data);
                      }
                  });

                  return defered.promise;
              }

              poluxRequest.get("usuario_solicitud",parametrosUser).then(function(responseUser){
                  var solicitudesUsuario = responseUser.data;
                  var promesas = [];
                  //solicitud de prorogga
                  promesas.push(ctrl.getProrroga());
                  //otras solicitudes
                  angular.forEach(solicitudesUsuario, function(solicitud){
                     //console.log(solicitud.SolicitudTrabajoGrado.Id);
                      promesas.push(requestRespuesta(actuales, solicitud.SolicitudTrabajoGrado.Id));
                  });
                  $q.all(promesas).then(function(){
                    console.log("actuales",actuales);
                    if(actuales.length==0){
                        console.log("si se puede");
                        defered.resolve(true);
                    }else if(actuales.length == 1 && actuales[0].SolicitudTrabajoGrado.ModalidadTipoSolicitud.Id === 13 ){
                      console.log(actuales);
                        console.log("es inicial y se deben restringir las demás");
                        ctrl.restringirModalidades = true;
                        defered.resolve(true);
                    }else{
                        console.log("No puedes");
                        defered.resolve(false);
                    }
                  });
              });

              return defered.promise;
            }

        ctrl.verificarSolicitudes().then(function(puede){
            ctrl.puedeSolicitudAnterior = puede;
            ctrl.estudiantes.push(ctrl.codigo);
            var parametrosTrabajoEstudiante = $.param({
                query:"Estudiante:"+ctrl.codigo+",EstadoEstudianteTrabajoGrado:1",
                limit:1
            });
            poluxRequest.get("estudiante_trabajo_grado",parametrosTrabajoEstudiante).then(function(responseTrabajoEstudiante){

                    if(responseTrabajoEstudiante.data != null){

                      //buscar # de autores del tg
                      var parametros = $.param({
                      query:"EstadoEstudianteTrabajoGrado.Id:1,TrabajoGrado:"+ responseTrabajoEstudiante.data[0].TrabajoGrado.Id,
                          limit: 0,
                      });
                      poluxRequest.get("estudiante_trabajo_grado",parametros).then(function(autoresTg){
                          angular.forEach(autoresTg.data, function(estudiante){
                              if(estudiante.Estudiante!==ctrl.codigo){
                                ctrl.estudiantesTg.push(estudiante.Estudiante);
                              }
                          });
                      });

                      ctrl.Trabajo = responseTrabajoEstudiante.data[0];
                      ctrl.modalidad = responseTrabajoEstudiante.data[0].TrabajoGrado.Modalidad.Id;
                      ctrl.trabajo_grado_completo = responseTrabajoEstudiante.data[0].TrabajoGrado;
                      ctrl.trabajo_grado = responseTrabajoEstudiante.data[0].TrabajoGrado.Id;
                      ctrl.siModalidad = true;
                      ctrl.modalidad_select = true;
                      ctrl.cargarTipoSolicitud(ctrl.modalidad);
                      var parametrosVinculacion = $.param({
                          query:"TrabajoGrado:"+ctrl.trabajo_grado+",Activo:true",
                          limit:0
                      });
                      poluxRequest.get("vinculacion_trabajo_grado",parametrosVinculacion).then(function(responseVinculacion){
                          ctrl.Trabajo.evaluadores = [];
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
                          console.log("directorInterno",ctrl.Trabajo.directorInterno);
                          console.log("directorExterno",ctrl.Trabajo.directorExterno);
                          console.log("evaluadores",ctrl.Trabajo.evaluadores);
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
                          ctrl.modalidades=[];
                          if(ctrl.restringirModalidades){
                            angular.forEach(responseModalidad.data, function(modalidad){
                                if(modalidad.Id==2){
                                  ctrl.modalidades.push(modalidad);
                                }
                            });
                          }else{
                            ctrl.modalidades =responseModalidad.data;
                          }
                      });
                      //obtener solicitudes iniciales anteriores hechas por el usuario modalidad de posgrado
                      var parametrosSolicitudes = $.param({
                          query:"Usuario:"+ctrl.codigo+",SolicitudTrabajoGrado.ModalidadTipoSolicitud.Id:13",
                          limit:1,
                      });
                      poluxRequest.get("usuario_solicitud",parametrosSolicitudes).then(function (responseSolicitudes){
                          if(responseSolicitudes.data !== null){
                            //si ha hecho una solicitud se obtienen las materias por el detalle
                            var idSolicitud = responseSolicitudes.data[0].SolicitudTrabajoGrado.Id;
                            var parametrosSolicitud = $.param({
                                query:"SolicitudTrabajoGrado:"+idSolicitud+",DetalleTipoSolicitud:37",
                                limit:1,
                            });
                            poluxRequest.get("detalle_solicitud",parametrosSolicitud).then(function (responseSolicitud){
                                //se obtiene guarda la carrera que ya eligio
                                ctrl.carreraElegida = JSON.parse(responseSolicitud.data[0].Descripcion.split("-")[1]);
                            });
                          }
                      });
                    }
                    ctrl.obtenerDatosEstudiante();
                    ctrl.obtenerAreas();
          });
        });


        ctrl.obtenerAreas = function (){
          var parametrosAreas = $.param({
            query:"Activo:TRUE",
            limit:0,
          });
            poluxRequest.get("area_conocimiento",parametrosAreas).then(function(responseAreas){
                ctrl.areas = responseAreas.data;
                coreService.get("snies_area").then(function(responseAreas){
                  var areasSnies = responseAreas.data;
                  angular.forEach(ctrl.areas, function(area){
                    angular.forEach(areasSnies, function(areaSnies){
                      if(area.SniesArea === areaSnies.Id){
                        area.Snies = areaSnies.Nombre;
                      }
                    });
                  });
                });
            });
        }



      ctrl.cargarTipoSolicitud= function (modalidad) {
        ctrl.solicitudes = [];
        var parametrosTiposSolicitudes = $.param({
          query:"Modalidad:"+modalidad+",TipoSolicitud.Activo:TRUE",
          limit:0,
        });
        poluxRequest.get("modalidad_tipo_solicitud",parametrosTiposSolicitudes).then(function(responseTiposSolicitudes){
            //ctrl.solicitudes = responseTiposSolicitudes.data;
            if(ctrl.tieneProrrogas){
              angular.forEach(responseTiposSolicitudes.data, function(solicitud){
                //si la solicitud es diferente de una de prorroga
                if(solicitud.TipoSolicitud.Id!==7){
                  ctrl.solicitudes.push(solicitud);
                }
              });
            }else{
              ctrl.solicitudes = responseTiposSolicitudes.data;
            }
        });
      };

      ctrl.cargarDetalles= function (tipoSolicitudSeleccionada, modalidad_seleccionada) {
        $scope.loadDetalles = true;
        ctrl.siPuede=false;
        ctrl.detallesCargados = false;
        ctrl.espaciosElegidos = [];
        ctrl.estudiantes = [];
        ctrl.TipoSolicitud = tipoSolicitudSeleccionada;
        var tipoSolicitud = tipoSolicitudSeleccionada.Id;
        ctrl.ModalidadTipoSolicitud = tipoSolicitud;
        console.log(tipoSolicitudSeleccionada);
        if(modalidad_seleccionada!==undefined){
            ctrl.estudiante.Modalidad = modalidad_seleccionada;
            ctrl.modalidad = modalidad_seleccionada;
        }
        console.log(ctrl.estudiante);
        poluxMidRequest.post("verificarRequisitos/Registrar", ctrl.estudiante).then(function(puede){

          if(puede.data==="true"){
              if(ctrl.puedeSolicitudAnterior){
                  console.log("no hay solicitudes pendietnes");
                  console.log(ctrl.estudiante);
                  ctrl.soliciudConDetalles = true;
                  ctrl.detalles = [];
                  var parametrosDetalles;
                  if(modalidad_seleccionada===undefined){
                    parametrosDetalles = $.param({
                      query:"Activo:TRUE,ModalidadTipoSolicitud:"+tipoSolicitud,
                      limit:0,
                      sortby: "NumeroOrden",
                      order: "asc"
                    });
                  }else{
                      parametrosDetalles = $.param({
                        query:"Activo:TRUE,ModalidadTipoSolicitud.TipoSolicitud.Id:2,ModalidadTipoSolicitud.Modalidad.Id:"+modalidad_seleccionada,
                        limit:0,
                        sortby: "NumeroOrden",
                        order: "asc"
                      });
                      var parametrosModalidadTipoSolicitud = $.param({
                        query:"TipoSolicitud.Activo:TRUE,TipoSolicitud.Id:2,Modalidad.Id:"+modalidad_seleccionada,
                        limit:1,

                      });
                      poluxRequest.get("modalidad_tipo_solicitud", parametrosModalidadTipoSolicitud).then(function(responseModalidadTipoSolicitud){
                          ctrl.ModalidadTipoSolicitud = responseModalidadTipoSolicitud.data[0].Id;
                      });
                  }
                  poluxRequest.get("detalle_tipo_solicitud",parametrosDetalles).then(function(responseDetalles){
                      $scope.loadDetalles = false;
                      ctrl.detalles = responseDetalles.data;
                      console.log(ctrl.detalles);
                      //Se cargan opciones de los detalles
                      angular.forEach(ctrl.detalles, function(detalle){
                        //Se internacionalizan variables y se crean labels de los detalles
                        detalle.label = $translate.instant(detalle.Detalle.Enunciado);
                        detalle.respuesta= "";
                        detalle.fileModel = null;
                        detalle.opciones = [];
                        //Se evalua si el detalle necesita cargar datos
                        if(!detalle.Detalle.Descripcion.includes('no_service') && detalle.Detalle.TipoDetalle.Id!==8){
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
                                          if(parametro == "activo"){
                                            parametro = parametro;
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
                                console.log(detalle.parametros);
                                poluxRequest.get(parametrosServicio[1], detalle.parametros).then(function(responseOpciones){
                                    if (detalle.Detalle.Nombre.includes("Nombre actual de la propuesta")) {
                                        detalle.opciones.push({
                                          "NOMBRE":responseOpciones.data[0].DocumentoEscrito.Titulo,
                                          "bd":responseOpciones.data[0].DocumentoEscrito.Titulo,
                                        });
                                    }else if(detalle.Detalle.Nombre.includes("Actual resumen de la propuesta")){
                                      detalle.opciones.push({
                                        "NOMBRE":responseOpciones.data[0].DocumentoEscrito.Resumen,
                                        "bd":responseOpciones.data[0].DocumentoEscrito.Resumen
                                      });
                                    }else if(detalle.Detalle.Nombre.includes("Propuesta actual")){
                                      detalle.respuesta = responseOpciones.data[0].DocumentoEscrito.Enlace;

                                      console.log("Documento",detalle.respuesta);
                                    }else if(detalle.Detalle.Nombre.includes("Areas de conocimiento actuales")){
                                      console.log("Opciones",responseOpciones);
                                      var areasString = "";
                                      angular.forEach(responseOpciones.data,function(area){
                                          areasString = areasString +", " + area.AreaConocimiento.Nombre;
                                      });
                                      detalle.opciones.push({
                                        "NOMBRE":areasString.substring(2),
                                        "bd":areasString.substring(2)
                                      });
                                    }else if(detalle.Detalle.Nombre.includes("Nombre Empresa")){
                                      angular.forEach(responseOpciones.data,function(empresa){
                                        detalle.opciones.push({
                                          "NOMBRE":empresa.Identificacion+"",
                                          "bd":empresa.Identificacion+"",
                                        });
                                      });
                                    }else if(detalle.Detalle.Nombre.includes("Espacio Academico Anterior")){
                                      angular.forEach(responseOpciones.data,function(espacio){
                                        detalle.opciones.push({
                                          "NOMBRE":espacio.EspaciosAcademicosElegibles.CodigoAsignatura,
                                          "bd":espacio.EspaciosAcademicosElegibles.CodigoAsignatura,
                                        });
                                      });
                                    }
                                    else if(detalle.Detalle.Nombre.includes("Evaluador Actual")){
                                      console.log(responseOpciones.data);
                                      angular.forEach(responseOpciones.data,function(evaluador){
                                        var parametrosDocentesUD = {
                                          "identificacion":evaluador.Usuario
                                        };
                                        academicaRequest.obtenerDocentes(parametrosDocentesUD).then(function(docente){
                                          detalle.opciones.push({
                                            "NOMBRE":docente[0].NOMBRE,
                                            "bd":  docente.bd = docente[0].DOC_NRO_IDEN
                                          });
                                          console.log(detalle.opciones);
                                        });
                                      });
                                    }
                                    else if (detalle.Detalle.Nombre.includes("Director Actual")) {
                                          var parametrosDocentesUD = {
                                            "identificacion":ctrl.Trabajo.directorInterno.Usuario
                                          };
                                          console.log("parametrosDocentesUD", parametrosDocentesUD);
                                        academicaRequest.obtenerDocentes(parametrosDocentesUD).then(function(docente){
                                          console.log("Respuesta docente", docente);
                                          detalle.opciones.push({
                                            "NOMBRE":docente[0].NOMBRE,
                                            //"bd":  docente.bd = docente[0].DIR_NRO_IDEN+"-"+docente[0].NOMBRE,
                                            "bd":  docente.bd = docente[0].DOC_NRO_IDEN
                                          });
                                          console.log(detalle.opciones);
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
                                            "NOMBRE":espacio.CodigoAsignatura,
                                            "bd":espacio.CodigoAsignatura
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
                                      academicaRequest.get("docentes_tg").then(function(response){
                                          if (!angular.isUndefined(response.data.docentesTg.docente)) {
                                              var vinculados = [];
                                              angular.forEach(response.data.docentesTg.docente, function(docente){
                                                  //docente.bd = docente.DIR_NRO_IDEN+"-"+docente.NOMBRE;
                                                  if(ctrl.docenteVinculado(docente.id)){
                                                    vinculados.push(docente);
                                                  }else{
                                                    docente.bd = docente.id;
                                                  }
                                              });
                                              angular.forEach(vinculados, function(docente){
                                                  var index = docentes.indexOf(docente);
                                                  docentes.splice(index, 1);
                                              });
                                              detalle.opciones=docentes;
                                          }
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
                                    "NOMBRE":opcion,
                                    "bd":opcion
                                  });
                                });
                            }
                            if(parametrosServicio[0]==="mensaje"){
                              detalle.opciones.push({
                                "NOMBRE":$translate.instant(parametrosServicio[1]),
                                "bd":$translate.instant(parametrosServicio[1])
                              });
                            }
                        };
                      });
                      ctrl.detallesCargados = true;
                      if(ctrl.detalles == null){
                          ctrl.soliciudConDetalles = false;
                      }
                  });
              }else{
                  console.log("hay solicitudes pendientes");
                  ctrl.siPuedeAnteriores = true;
                  $scope.loadDetalles = false;
                  ctrl.detalles = [];
              }

          }else{
              $scope.loadDetalles = false;
              ctrl.siPuede=true;
              ctrl.detalles = [];
          }
      });

      };

      ctrl.docenteVinculado = function(docente){
        if(ctrl.Trabajo!=undefined){
          if(ctrl.Trabajo.directorInterno !== undefined){
            if(ctrl.Trabajo.directorInterno.Usuario==docente){
              return true;
            }
          }
          if(ctrl.Trabajo.directorExterno !== undefined){
            if(ctrl.Trabajo.directorInterno.Usuario==docente){
              return true;
            }
          }
          if(ctrl.Trabajo.evaluadores!=undefined){
            var esta = false;
            angular.forEach(ctrl.Trabajo.evaluadores, function(evaluador){
              if(evaluador.Usuario==docente){
                esta = true;
              }
            });
            if(esta){
              return true;
            }
          }
        }
        //console.log("directorInterno",ctrl.Trabajo.directorInterno);
        //console.log("directorExterno",ctrl.Trabajo.directorExterno);
        //console.log("evaluadores",ctrl.Trabajo.evaluadores);
        return false;
      }

      ctrl.obtenerDatosEstudiante = function(){
        academicaRequest.get("periodo_academico","P").then(function(periodoAnterior){

          var parametros = {
            "codigo": ctrl.codigo,
            //periodo anterior
            'ano' : periodoAnterior.data.periodoAcademicoCollection.periodoAcademico[0].anio,
            //'periodo' :periodoAnterior.data.periodoAcademicoCollection.periodoAcademico[0].periodo,
            'periodo' :1
          };

          academicaRequest.promedioEstudiante(parametros).then(function(response2){
            if(response2){
              console.log(response2);
              //porcentaje cursado
              var parametros2 = {
                "codigo": parametros.codigo
              };

                ctrl.estudiante={
                  "Codigo": parametros.codigo,
                  "Nombre": response2[0].NOMBRE,
                  "Modalidad": ctrl.modalidad,
                  "Tipo": "POSGRADO",
                  "PorcentajeCursado": response2[0].PORCENTAJE,
                  "Promedio": response2[0].PROMEDIO,
                  "Rendimiento": "0"+response2[0].REG_RENDIMIENTO_AC,
                  "Estado": response2[0].EST_ESTADO_EST,
                  "Nivel": response2[0].TRA_NIVEL,
                  "TipoCarrera": response2[0].TRA_NOMBRE,
                  "Carrera":response2[0].EST_CRA_COD

                };
                if(ctrl.estudiante.Nombre === undefined){
                  ctrl.conEstudiante=false;
                  $scope.loadEstudiante = false;
                }else{
                  ctrl.conEstudiante=true;
                  $scope.loadEstudiante = false;
                }
                ctrl.estudiante.asignaturas_elegidas = [];
                ctrl.estudiante.areas_elegidas= [];
                ctrl.estudiante.minimoCreditos = false;

            }
          });
        });
      }

      ctrl.imprimir = function (valor){
        console.log(valor);
      };


      ctrl.validarFormularioSolicitud = function(){
        console.log("detalles");

        ctrl.detallesConDocumento = [];

        angular.forEach(ctrl.detalles, function(detalle){
            if(detalle.Detalle.TipoDetalle.Nombre==='Label'){
                detalle.respuesta = detalle.opciones[0].bd;
            }
            if(detalle.Detalle.TipoDetalle.Nombre==='Documento'){
                detalle.respuesta = "urlDocumento";
                ctrl.detallesConDocumento.push(detalle);
            }
            if(detalle.Detalle.TipoDetalle.Nombre==='Directiva'){
                if(detalle.Detalle.Descripcion=='solicitar-asignaturas'){
                  detalle.respuesta = "JSON";
                  angular.forEach(ctrl.estudiante.asignaturas_elegidas, function(asignatura){
                     asignatura.$$hashKey = undefined;
                     detalle.respuesta = detalle.respuesta +"-" + JSON.stringify(asignatura);
                  });
                  //detalle.respuesta = detalle.respuesta.substring(1);
                }
                if(detalle.Detalle.Descripcion=='asignar-estudiantes'){
                   detalle.respuesta = (ctrl.estudiantes.length===0)? ctrl.codigo  :ctrl.codigo+","+ctrl.estudiantes.toString();
                }
                if(detalle.Detalle.Descripcion=='asignar-area'){
                  detalle.respuesta = "JSON";
                  angular.forEach(ctrl.estudiante.areas_elegidas, function(area){
                     area.$$hashKey = undefined;
                     detalle.respuesta = detalle.respuesta +"-" + JSON.stringify(area);
                     //detalle.respuesta = detalle.respuesta +"," + (area.Id+"-"+area.Nombre);
                  });
                  //detalle.respuesta = detalle.respuesta.substring(1);
                }
            }
            if(detalle.Detalle.TipoDetalle.Nombre==='Checkbox' || detalle.Detalle.TipoDetalle.Nombre==='Radio'){

                if(detalle.bool === undefined){
                    detalle.bool = false;
                }
                if(detalle.bool){
                    detalle.respuesta = "SI";
                }else{
                    detalle.respuesta = "NO";
                }

                //detalle.respuesta = detalle.bool.toString();
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
              if(ctrl.estudiante.areas_elegidas.length===0 && detalle.Detalle.Descripcion=='asignar-area' ){
                swal(
                  'Validación del formulario',
                  "Debe ingresar al menos un área de conocimiento.",
                  'warning'
                );
                //console.log("Debe ingresar al menos un area.");
                ctrl.erroresFormulario = true;
              }
              if(detalle.Detalle.Descripcion=='solicitar-asignaturas' && !ctrl.estudiante.minimoCreditos ){
                swal(
                  'Validación del formulario',
                  "Debe cumplir con el minimo de creditos.",
                  'warning'
                );
                ctrl.erroresFormulario = true;
              }
              if(detalle.Detalle.TipoDetalle.Nombre === "Selector" || detalle.Detalle.TipoDetalle.Nombre === "Lista"){
                    var contiene = false;
                    angular.forEach(detalle.opciones, function(opcion){
                        if(opcion.bd === detalle.respuesta){
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
              if(detalle.Detalle.TipoDetalle.Nombre==='Documento'){
                  if(detalle.fileModel==null){
                    swal(
                      'Validación del formulario',
                      "Error ingrese una opcion valida. (Documento)",
                      'warning'
                    );
                    console.log("Error con el documento")
                    ctrl.erroresFormulario = true;
                  }
              }
        });
        if(!ctrl.erroresFormulario){
          //ctrl.cargarSolicitudes();

          ctrl.cargarDocumentos();
        }
      }

      ctrl.cargarDocumento = function(nombre, descripcion, documento ,callback){
              var defered = $q.defer();
              var promise = defered.promise;
              nuxeo.operation('Document.Create')
                .params({
                  type: 'File',
                  name: nombre,
                  properties: 'dc:title=' + nombre + ' \ndc:description=' + descripcion
                })
                .input('/default-domain/workspaces/Proyectos de Grado POLUX/Solicitudes')
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
                      defered.reject(error)
                    });
                })
                .catch(function(error) {
                    throw error;
                    defered.reject(error)
                });

                return promise;
      }

      ctrl.cargarDocumentos = function(callFunction){
            nuxeo.connect().then(function(client) {
            // OK, the returned client is connected
                var fileTypeError = false;
                angular.forEach(ctrl.detallesConDocumento, function (detalle) {
                  var documento = detalle.fileModel;
                  var tam=parseInt(detalle.Detalle.Descripcion.split(";")[1]+"000");
                  if(documento.type !== "application/pdf" || documento.size>tam){
                      fileTypeError = true;
                  }
                });
                $scope.loadFormulario = true;
                if(!fileTypeError){
                  var promiseArr = [];
                  angular.forEach(ctrl.detallesConDocumento, function (detalle) {
                      var anHttpPromise = ctrl.cargarDocumento(detalle.Detalle.Nombre+":"+ctrl.codigo, detalle.Detalle.Nombre+":"+ctrl.codigo, detalle.fileModel, function(url){
                        detalle.respuesta = url;
                      });
                      promiseArr.push(anHttpPromise);
                  });
                  $q.all(promiseArr).then(function(){
                      ctrl.cargarSolicitudes();
                  }).catch(function(error){
                      swal(
                        $translate.instant("ERROR.CARGA_SOLICITUDES"),
                        $translate.instant("ERROR.ENVIO_SOLICITUD"),
                        'warning'
                      );
                      $scope.loadFormulario = false;
                  });
                }else{
                  swal(
                    $translate.instant("ERROR.SUBIR_DOCUMENTO"),
                    $translate.instant("VERIFICAR_DOCUMENTO"),
                    'warning'
                  );
                  $scope.loadFormulario = false;
                }
            }, function(err) {
            // cannot connect
              swal(
                $translate.instant("ERROR.SUBIR_DOCUMENTO"),
                $translate.instant("VERIFICAR_DOCUMENTO"),
                'warning'
              );
              $scope.loadFormulario = false;
            });

      };


      ctrl.cargarSolicitudes = function(){
        //var data_solicitud = [];
        var data_solicitud={};
        var data_detalles = [];
        var data_usuarios = [];
        var data_respuesta = {};
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
        //estudiantes que ya pertenecian al tg
        //si es diferente a una solicitud de cancelación
        if(ctrl.TipoSolicitud.TipoSolicitud!== undefined){
          if(ctrl.TipoSolicitud.TipoSolicitud.Id!==3){
            angular.forEach(ctrl.estudiantesTg, function(estudiante){
              data_usuarios.push({
                "Usuario":estudiante,
                "SolicitudTrabajoGrado": {
                  "Id": 0
                }
              });
            });
          }
        }
        //estudiantes agregados en la solicitud inicial
        angular.forEach(ctrl.estudiantes, function(estudiante){
          data_usuarios.push({
            "Usuario":estudiante,
            "SolicitudTrabajoGrado": {
              "Id": 0
            }
          });
        });

        //Respuesta de la solicitud
         data_respuesta={
           "Fecha": fecha,
           "Justificacion": "Su solicitud fue radicada",
           "EnteResponsable":0,
           "Usuario": 0,
           "EstadoSolicitud": {
             "Id": 1
           },
           "SolicitudTrabajoGrado": {
             "Id": 0
           },
           "Activo": true
         }

         //se crea objeto con las solicitudes
         ctrl.solicitud={
           Solicitud: data_solicitud,
           Respuesta: data_respuesta,
           DetallesSolicitud: data_detalles,
           UsuariosSolicitud: data_usuarios
         }

         console.log(ctrl.solicitud);

         poluxRequest.post("tr_solicitud", ctrl.solicitud).then(function(response) {
            console.log(response.data);
             if(response.data[0]==="Success"){
               swal(
                 $translate.instant("FORMULARIO_SOLICITUD"),
                 $translate.instant("SOLICITUD_REGISTRADA"),
                 'success'
               );
               $location.path("/solicitudes/listar_solicitudes");
             }else{
               swal(
                 $translate.instant("FORMULARIO_SOLICITUD"),
                 $translate.instant(response.data[1]),
                 'warning'
               );
             }
             $scope.loadFormulario = false;
           });

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

  });
