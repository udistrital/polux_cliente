'use strict';

/**
 * @ngdoc controller
 * @name poluxClienteApp.controller:GeneralConsultarTrabajoGradoCtrl
 * @description
 * # GeneralConsultarTrabajoGradoCtrl
 * Controller of the poluxClienteApp
 * Controlador para consultar un trabajo de grado
 * @requires services/poluxClienteApp.service:tokenService
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires services/poluxService.service:poluxRequest
 * @requires services/academicaService.service:academicaRequest
 * @requires $q
 * @property {number} userId Documento del usuario que ingresa al módulo.
 * @property {number} codigoEstudiante Documento del estudiante que se va a consultar
 * @property {object} userRole Listado de roles que tiene el usuairo que ingresa al módulo
 * @property {object} trabajoGrado Contiene toda la información del trabajo de grado
 * @property {object} estudiante Contiene la información del estudiante
 */
angular.module('poluxClienteApp')
  .controller('GeneralConsultarTrabajoGradoCtrl', function (token_service,$translate,poluxRequest,academicaRequest,$q) {
    var ctrl = this;

    //token_service.token.documento = "79647592";
    //token_service.token.role.push("COORDINADOR_PREGRADO");
    token_service.token.documento = "20141020036";
    token_service.token.role.push("ESTUDIANTE");
    ctrl.userRole = token_service.token.role;
    ctrl.userId  = token_service.token.documento;

    ctrl.mensajeCargandoTrabajoGrado = $translate.instant('LOADING.CARGANDO_DATOS_TRABAJO_GRADO');
    ctrl.trabajoCargado = false;

    ctrl.gridOptionsAsignaturas = [];
    ctrl.gridOptionsAsignaturas.columnDefs = [{
      name: 'CodigoAsignatura',
      displayName: $translate.instant('ASIGNATURA'),
      width:'20%',
    },
    {name: 'Anio',
      displayName: $translate.instant('ANIO'),
      width:'20%',
    },
    {
      name: 'Periodo',
      displayName: $translate.instant('PERIODO'),
      width:'20%',
    },
    {
      name: 'Calificacion',
      displayName: $translate.instant('NOTA'),
      width:'20%',
    },
    {
      name: 'EstadoAsignaturaTrabajoGrado.Nombre',
      displayName: $translate.instant('Estado'),
      width:'20%',
    }];

    ctrl.cargarEstudiante = function(estudiante){
      var defer = $q.defer();
      //consultar datos básicos del estudiante
      academicaRequest.get("datos_basicos_estudiante",[estudiante.codigo])
      .then(function(responseDatosBasicos){
        if (!angular.isUndefined(responseDatosBasicos.data.datosEstudianteCollection.datosBasicosEstudiante)) {
          estudiante.datos = responseDatosBasicos.data.datosEstudianteCollection.datosBasicosEstudiante[0];
          //consultar nombre carrera
          academicaRequest.get("carrera",[estudiante.datos.carrera])
          .then(function(responseCarrera){
            estudiante.datos.proyecto = estudiante.datos.carrera + " - " + responseCarrera.data.carrerasCollection.carrera[0].nombre;
            defer.resolve();
          })
          .catch(function(error){
            ctrl.mensajeError = $translate.instant('ERROR.CARGANDO_CARRERA_ESTUDIANTE');
            defer.reject(error);
          });
        }else{
          ctrl.mensajeError = $translate.instant('ERROR.ESTUDIANTE_NO_ENCONTRADO');
          defer.reject(error);
        }
      })
      .catch(function(error){
        ctrl.mensajeError = $translate.instant('ERROR.CARGANDO_DATOS_ESTUDIANTE');
        defer.reject(error);
      });
      return defer.promise;
    }

    ctrl.cargarAsignaturasTrabajoGrado = function(){
      var defer = $q.defer();
      var parametrosAsignaturasTrabajoGrado = $.param({
        query:"TrabajoGrado:"+ctrl.trabajoGrado.Id,
        limit:2,
      });
      poluxRequest.get("asignatura_trabajo_grado",parametrosAsignaturasTrabajoGrado)
      .then(function(responseAsignaturaTrabajoGrado){
        if(responseAsignaturaTrabajoGrado.data != null){
          ctrl.trabajoGrado.asignaturas = responseAsignaturaTrabajoGrado.data;
          angular.forEach(ctrl.trabajoGrado.asignaturas,function(asignatura){
            asignatura.Estado = asignatura.EstadoAsignaturaTrabajoGrado.Nombre;
          });
          defer.resolve();
        }else{
          ctrl.mensajeError = $translate.instant("ERROR.NO_ASIGNATURAS_TRABAJO_GRADO");
          defer.reject(error);
        }
      })
      .catch(function(error){
        ctrl.mensajeError = $translate.instant("ERROR.CARGANDO_ASIGNATURAS_TRABAJO_GRADO");
        defer.reject(error);
      });
      return defer.promise;
    }

    ctrl.getEspaciosAcademicosInscritos = function(){
      var defer = $q.defer();
      var parametrosEspaciosAcademicosInscritos = $.param({
        query:"EstadoEspacioAcademicoInscrito.Id:1,TrabajoGrado:"+ctrl.trabajoGrado.Id,
        limit:0,
      });
      poluxRequest.get("espacio_academico_inscrito",parametrosEspaciosAcademicosInscritos)
      .then(function(responseEspacios){
        if(responseEspacios.data != null){
          ctrl.trabajoGrado.espacios = responseEspacios.data;
          defer.resolve();
        }else{
          ctrl.mensajeError = $translate.instant("ERROR.NO_ESPACIOS_ACADEMICOS_INSCRITOS");
          defer.reject(error);
        }
      })
      .catch(function(error){
        ctrl.mensajeError = $translate.instant("ERROR.CARGANDO_ESPACIOS_ACADEMICOS_INSCRITOS");
        defer.reject(error);
      });
      return defer.promise;
    }

    ctrl.consultarTrabajoGrado = function(){
      ctrl.errorCargandoTrabajoGrado = false;
      //Verifica que lo ingresado sea un codigo
      if(/^\d+$/.test(ctrl.codigoEstudiante)){
        //consultar trabajo de grado del estudiante
        ctrl.loadTrabajoGrado = true;
        var parametrosTrabajoGrago = $.param({
          query:"EstadoEstudianteTrabajoGrado.Id:1,Estudiante:"+ctrl.codigoEstudiante,
          limit:1,
        });
        poluxRequest.get('estudiante_trabajo_grado',parametrosTrabajoGrago)
        .then(function(response_trabajoGrado){
          if(response_trabajoGrado.data != null){
            ctrl.trabajoGrado = response_trabajoGrado.data[0].TrabajoGrado;
            var promises = [];
            ctrl.trabajoGrado.estudiante = {
              "codigo": ctrl.codigoEstudiante
            }
            promises.push(ctrl.cargarEstudiante(ctrl.trabajoGrado.estudiante));
            promises.push(ctrl.cargarAsignaturasTrabajoGrado());

            //si la modalidad es 2 trae los espacios academicos
            if(ctrl.trabajoGrado.Modalidad.Id === 2){
              promises.push(ctrl.getEspaciosAcademicosInscritos());
            }

            $q.all(promises)
            .then(function(){
              console.log(ctrl.trabajoGrado);
              console.log(ctrl.trabajoGrado.estudiante);
              ctrl.gridOptionsAsignaturas.data = ctrl.trabajoGrado.asignaturas;
              ctrl.trabajoCargado = true;
              ctrl.loadTrabajoGrado = false;
            })
            .catch(function(error){
              console.log(error);
              ctrl.errorCargandoTrabajoGrado = true;
              ctrl.loadTrabajoGrado = false;
            });
          }else{
            ctrl.mensajeError = $translate.instant('ERROR.ESTUDIANTE_SIN_TRABAJO');
            ctrl.errorCargandoTrabajoGrado = true;
            ctrl.loadTrabajoGrado = false;
          }
        })
        .catch(function(error){
          console.log(error);
          ctrl.mensajeError = $translate.instant('ERROR.CARGANDO_TRABAJO');
          ctrl.errorCargandoTrabajoGrado = true;
          ctrl.loadTrabajoGrado = false;
        });
      }else{
        ctrl.mensajeError = $translate.instant('CODIGO_NO_VALIDO');
        ctrl.errorCargandoTrabajoGrado = true;
      }
    }

    if(ctrl.userRole.includes("ESTUDIANTE")){
      ctrl.codigoEstudiante = ctrl.userId;
      ctrl.consultarTrabajoGrado();
    }




  });
