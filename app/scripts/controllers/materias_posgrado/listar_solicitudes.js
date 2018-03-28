'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:MateriasPosgradoListarSolicitudesCtrl
 * @description
 * # MateriasPosgradoListarSolicitudesCtrl
 * Controller of the poluxClienteApp
 */
 angular.module('poluxClienteApp')
 .controller('MateriasPosgradoListarSolicitudesCtrl', function (sesionesRequest, $translate, $q, uiGridConstants, poluxMidRequest, poluxRequest, academicaRequest, $scope, $mdDialog, $timeout, $window) {
  $scope.$ = $;

  $scope.loadParametros = true;
  $scope.cargandoParametros = $translate.instant("LOADING.CARGANDO_PARAMETROS");
  $scope.cargandoSolicitudes = $translate.instant("LOADING.CARGANDO_SOLICITUDES");
  $scope.cargandoRespuestas = $translate.instant('LOADING.REGISTRANDO_RESPUESTAS');

  var ctrl = this;


  ctrl.periodo = [];
  ctrl.carreras = [];
  ctrl.otro = [];
    //cedula coordinador
    $scope.userId = "12237136";
    //uigrid
    ctrl.gridOptionsAdmitidos = {
      enableSorting: false,
    }

    ctrl.gridOptionsAdmitidos.columnDefs = [
    {
      name: 'estudiante',
      displayName: 'Código',
      width: "20%"
    },
    {
      name: 'nombre',
      displayName: 'Nombre',
      width: "40%"
    },
    {
      name: 'promedio',
      displayName: 'Promedio',
      width: "15%",
      sort: {
        direction: uiGridConstants.DESC,
        priority: 0
      }
    },
    {
      name: 'rendimiento',
      displayName: 'Rendimiento Académico',
      width: "25%",
      sort: {
        direction: uiGridConstants.DESC,
        priority: 1
      }
    },
    ];

    ctrl.gridOptionsOpcionados = JSON.parse(JSON.stringify(ctrl.gridOptionsAdmitidos));
    ctrl.gridOptionsNoAdmitidos = JSON.parse(JSON.stringify(ctrl.gridOptionsAdmitidos));

    ctrl.gridOptions = {
      enableSorting: false,
    };

    ctrl.gridOptions.columnDefs = [{
      name: 'solicitud',
      displayName: 'Solicitud',
      width: "8%"
    },
    {
      name: 'fecha',
      displayName: 'Fecha',
      type: 'date',
      cellFilter: 'date:\'yyyy-MM-dd\'',
      width: "8%"
    },
    {
      name: 'estudiante',
      displayName: 'Código',
      width: "10%"
    },
    {
      name: 'nombre',
      displayName: 'Nombre',
      width: "23%"
    },
    {
      name: 'promedio',
      displayName: 'Promedio',
      width: "10%",
      sort: {
        direction: uiGridConstants.DESC,
        priority: 0
      }
    },
    {
      name: 'rendimiento',
      displayName: 'Rendimiento Académico',
      width: "15%",
      sort: {
        direction: uiGridConstants.DESC,
        priority: 1
      }
    },
    {
      name: 'estado.Nombre',
      displayName: 'Estado',
      width: "16%"
    },
    {
      name: 'aprobar',
      displayName: 'Admitir',
      width: "10%",
      cellTemplate: '<center><md-checkbox class="blue" ng-model="row.entity.aprobado" aria-label="checkbox" ng-if="row.entity.permitirAprobar" > </md-checkbox> <div ng-if="!row.entity.permitirAprobar">{{"SOLICITUD_NO_PUEDE_APROBARSE"| translate}}</div><center>',
    }
    ];

    ctrl.getPeriodo  = function(){
      var defer =  $q.defer()
      academicaRequest.get("periodo_academico", "X")
      .then(function (responsePeriodo) {
        if (!angular.isUndefined(responsePeriodo.data.periodoAcademicoCollection.periodoAcademico)) {
          ctrl.periodo = responsePeriodo.data.periodoAcademicoCollection.periodoAcademico[0];
          defer.resolve(ctrl.periodo);
        }else{
          ctrl.mensajeError = $translate.instant("ERROR.SIN_PERIODO");
          defer.reject("sin periodo");
        }        
      })
      .catch(function(){
        ctrl.mensajeError = $translate.instant("ERROR.CARGAR_PERIODO");
        defer.reject("no se pudo cargar periodo");
      }); 
      return defer.promise;
    }
    
    ctrl.getCarrerasCoordinador = function(){
      var defer =  $q.defer()
      academicaRequest.get("coordinador_carrera", [$scope.userId, "POSGRADO"])
      .then(function (responseCarreras) {
        console.log(responseCarreras);
        if (!angular.isUndefined(responseCarreras.data.coordinadorCollection.coordinador)) {
          ctrl.carreras = responseCarreras.data.coordinadorCollection.coordinador;
          defer.resolve(ctrl.carreras);
        }else{
          ctrl.mensajeError = $translate.instant("ERROR.SIN_CARRERAS_POSGRADO");
          defer.reject("no hay carreras");
        }
      })
      .catch(function(){
        ctrl.mensajeError = $translate.instant("ERROR.CARGAR_CARRERAS");
        defer.reject("no se pudo cargar carreras")
      });
      return defer.promise
    }


    ctrl.getFechas = function(periodo){
      var defer =  $q.defer()
      var momentDate = null;
      $scope.fechaActual = moment(new Date()).format("YYYY-MM-DD HH:mm");
      //traer fechas
      var parametrosSesiones = $.param({
        query:"SesionPadre.periodo:"+periodo.anio+periodo.periodo,
        limit:0
      });
      sesionesRequest.get("relacion_sesiones",parametrosSesiones).then(function(responseFechas){
        if(responseFechas.data !== null){
          ctrl.fechas = responseFechas.data;
          angular.forEach(ctrl.fechas, function(fecha){
            //console.log(fecha.SesionHijo);
            var fechaInicio = new Date(fecha.SesionHijo.FechaInicio);
            fechaInicio.setTime( fechaInicio.getTime() + fechaInicio.getTimezoneOffset()*60*1000 );;
            var fechaFin = new Date(fecha.SesionHijo.FechaFin);
            fechaFin.setTime( fechaFin.getTime() + fechaFin.getTimezoneOffset()*60*1000 );
            fecha.inicio = moment(fechaInicio).format("YYYY-MM-DD HH:mm");
            fecha.fin = moment(fechaFin).format("YYYY-MM-DD HH:mm");
            //fecha.inicio = moment(new Date(fecha.SesionHijo.FechaInicio)).format("YYYY-MM-DD HH:MM");
            //fecha.fin = moment(new Date(fecha.SesionHijo.FechaFin)).format("YYYY-MM-DD HH:MM");           
            if(fecha.SesionHijo.TipoSesion.Id===4){
              //primera fecha de selección de admitidos
              ctrl.primeraFecha = fecha;
              //console.log(fecha.inicio, ctrl.primeraFecha.inicio<=$scope.fechaActual && ctrl.primeraFecha.fin>=$scope.fechaActual);
            } else if(fecha.SesionHijo.TipoSesion.Id===6){
              //segunda fecha de selección de admitidos
              ctrl.segundaFecha = fecha;
            }
          });
          defer.resolve(ctrl.fechas);
        }else{
          ctrl.mensajeError = $translate.instant("ERROR.SIN_FECHAS_MODALIDAD_POSGRADO");
          defer.reject("no hay fechas registradas");
        }
      })
      .catch(function(){
        ctrl.mensajeError = $translate.instant("ERROR.CARGAR_FECHAS_MODALIDAD_POSGRADO");
        defer.reject("no se pudo cargar fechas")
      });
      return defer.promise
    }
    
    ctrl.cargarParametros = function(){
      ctrl.getPeriodo()
      .then(function(periodo){
        console.log(periodo)
        if(!angular.isUndefined(periodo)){
          $q.all([ctrl.getFechas(periodo),ctrl.getCarrerasCoordinador()])
          .then(function(){
            console.log(periodo)
            console.log(ctrl.fechas);
            console.log(ctrl.carreras);
            console.log("success");
            $scope.loadParametros = false;
          })
          .catch(function(error){
            console.log(ctrl.mensajeError);
            ctrl.errorCargarParametros = true;
            $scope.loadParametros = false;
          });
        }else{
          console.log(ctrl.mensajeError);
          ctrl.errorCargarParametros = true;
          $scope.loadParametros = false;
        }
      })
      .catch(function(error){
        console.log(ctrl.mensajeError);
        ctrl.errorCargarParametros = true;
        $scope.loadParametros = false;
      });
    }

    ctrl.cargarParametros();

    ctrl.cargarParametrosSolicitud = function(value){
      var defer = $q.defer();
      //buscar detalle_tipo_solicitud=37->detalle de Espacios academicos
      var parametros = $.param({
        query: "DetalleTipoSolicitud:37" + ",SolicitudTrabajoGrado:" + value.SolicitudTrabajoGrado.Id
      });
      poluxRequest.get("detalle_solicitud", parametros).then(function (detalleSolicitud) {
        if (detalleSolicitud.data !== null) {
          var carreraSolicitud = JSON.parse(detalleSolicitud.data[0].Descripcion.split("-")[1]);

          if (ctrl.carrera == carreraSolicitud.Codigo) {
            var parametros = $.param({
              query: "SolicitudTrabajoGrado:" + value.SolicitudTrabajoGrado.Id
            });
            poluxRequest.get("usuario_solicitud", parametros).then(function (usuarioSolicitud) {

              academicaRequest.get("periodo_academico", "P").then(function (periodoAnterior) {

                academicaRequest.get("datos_estudiante", [usuarioSolicitud.data[0].Usuario, periodoAnterior.data.periodoAcademicoCollection.periodoAcademico[0].anio, periodoAnterior.data.periodoAcademicoCollection.periodoAcademico[0].periodo]).then(function (response2) {
                  if (!angular.isUndefined(response2.data.estudianteCollection.datosEstudiante)) {
                    var solicitud = {
                      "solicitud": value.SolicitudTrabajoGrado.Id,
                      "fecha": value.Fecha,
                      "estudiante": usuarioSolicitud.data[0].Usuario,
                      "nombre": response2.data.estudianteCollection.datosEstudiante[0].nombre,
                      "promedio": response2.data.estudianteCollection.datosEstudiante[0].promedio,
                      "rendimiento": response2.data.estudianteCollection.datosEstudiante[0].rendimiento,
                      "estado": value.EstadoSolicitud,
                      //"respuesta": ""+value.Id,
                      "respuestaSolicitud": value
                    };
                    console.log(solicitud.estado);
                    if(solicitud.estado.Id==7 || solicitud.estado.Id==8){
                      solicitud.aprobado = true;
                    }else{
                      solicitud.aprobado = false;
                    }
                    if(solicitud.estado.Id==3 || solicitud.estado.Id==5){
                      solicitud.permitirAprobar = true;
                    }else{
                      solicitud.permitirAprobar = false;
                    }
                    $scope.sols.push(solicitud);        
                  }
                  defer.resolve();
                });
              });

            });
          }else{
            defer.resolve();
          }
        }else{
          defer.resolve();
        }
      });
      return defer.promise;
    }

    //solicitudes iniciales de la modalidad de materias de posgrado
    ctrl.buscarSolicitudes = function (carrera) {

      $scope.loadSolicitudes = true;
      ctrl.carrera = carrera;
      $scope.carrera = carrera;
      if (carrera) {
        $scope.sols = [];

        var parametros = $.param({
          query: "Activo:true,EstadoSolicitud.Id.in:3|5|7|8,SolicitudTrabajoGrado.ModalidadTipoSolicitud.Id:13",
          limit: 0
        });
        poluxRequest.get("respuesta_solicitud", parametros).then(function (respuestaSolicitud) {
          var promises = [];
          angular.forEach(respuestaSolicitud.data, function (value) {
            if (value != null) {
              promises.push(ctrl.cargarParametrosSolicitud(value));
            }
          });
          $q.all(promises).then(function(){
            $scope.loadSolicitudes = false;
          })
        });

        ctrl.gridOptions.data = $scope.sols;

      }
    }


    ctrl.admitirPrimeraFecha = function(){
      ctrl.opcionados = [];
      ctrl.admitidos = [];
      ctrl.noAdmitidos = [];
      angular.forEach($scope.sols, function(solicitud){
        if(solicitud.aprobado===true){
          ctrl.admitidos.push(solicitud);
        }else{
          ctrl.opcionados.push(solicitud);
        }
      });
      ctrl.fecha = 1;
      ctrl.gridOptionsAdmitidos.data = ctrl.admitidos;
      ctrl.gridOptionsOpcionados.data = ctrl.opcionados;
      console.log(ctrl.admitidos, ctrl.opcionados);
      $('#modalAdmitir').modal('show')
    }

    ctrl.admitirSegundaFecha = function(){
      ctrl.opcionados = [];
      ctrl.admitidos = [];
      ctrl.noAdmitidos = [];
      angular.forEach($scope.sols, function(solicitud){
        if(solicitud.aprobado===true){
          ctrl.admitidos.push(solicitud);
        }else{
          ctrl.noAdmitidos.push(solicitud);
        }
      });
      ctrl.fecha = 2;
      ctrl.gridOptionsAdmitidos.data = ctrl.admitidos;
      ctrl.gridOptionsNoAdmitidos.data = ctrl.noAdmitidos;
      console.log(ctrl.admitidos, ctrl.noAdmitidos);
      $('#modalAdmitir').modal('show')
    }

    ctrl.admitir = function(){
      var dataAdmitidos = {
        "FechaSeleccion":ctrl.fecha,
        "Solicitudes": $scope.sols,
      }
      $scope.loadRespuestas = true;
      $('#modalAdmitir').modal('hide')
      poluxMidRequest.post("seleccion/Seleccionar", dataAdmitidos).then(function (response) {
        $scope.loadRespuestas = false;
        swal(
          $translate.instant('MATERIAS_POSGRADO.PROCESO_ADMISION_COMPLETO'),
          $translate.instant('MATERIAS_POSGRADO.RESPUESTAS_SOLICITUD'),
          'success'
          )
        //recargar datos
        ctrl.buscarSolicitudes($scope.carrera);
      })
      .catch(function(error){
        $scope.loadRespuestas = false;
        swal(
          $translate.instant('ERROR'),
          $translate.instant('ERROR_CARGAR_SOLICITUDES'),
          'warning'
          )
      });
    }

    ctrl.gridOptions.onRegisterApi = function (gridApi) {
      ctrl.gridApi = gridApi
    };


    ctrl.agregar = function (arreglo, solicitud) {
      arreglo.push(solicitud);
      console.log(arreglo);
    }


  });

