'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:registrarPropuesta
 * @description
 * # registrarPropuesta
 */
angular.module('poluxClienteApp')
  .directive('registrarPropuesta', function (academicaRequest,poluxRequest) {
    return {
      restrict: 'E',
      scope: {
          areaconsultada:'=',
          estparam: '=',
          docparam:'=',
          areasparam: '=',
          idareaparam:'=',
          dialparent: '&'
        },
      templateUrl: 'views/directives/general/propuesta/registrar-propuesta.html',
      controller:function($scope){
        var self = this;
        self.estado= false;
        self.doclimpio={};
        self.docregistrado=[];
        self.areasTG = [];
        /**/
        self.dial = function(doc){
          console.log("funciona llamado de directiva hija a directiva padre");
          console.log(" " + doc.enlace );
        }

        self.asignarEstudiante=function(codEstudiante){
          self.modalidad={};
          console.log(codEstudiante);
          codEstudiante=parseInt(codEstudiante);
          self.parametros=$.param({
            query:"CodigoEstudiante:"+codEstudiante
          });
          poluxRequest.get("estudiante_TG",self.parametros).then(function(response){

            poluxRequest.get("trabajo_grado",$.param({
              query:"Id:"+response.data[0].IdTrabajoGrado.Id
            })).then(function(response){
              self.documento={
                titulo: response.data[0].Titulo,
                enlace: self.documento.enlace
              }
              poluxRequest.get("modalidad",$.param({
                query:"Id:"+response.data[0].IdModalidad.Id
              })).then(function(response){
                self.modalidad=response.data[0];
              });
            });
          });
        };
        /*
       asignarDocente:
        Muestra el codigo del coddocente por consola,
        se guarda el docenteSeleccionado por el ng-chance del ng-model
        dependiendo de la selección del docente

        */
        self.asignarDocente = function(docenteSeleccionado){
          console.log(docenteSeleccionado);
        };
        /**/
        self.establecerFiltroDocentes= function(){
          if(self.filtro)
          return $scope.docparam;
          else
          return self.docentesArea;
        };
        /**/
        self.unificarDocentes=function(data){
          var filtro=[];
          angular.forEach(data,function(datosAreas){
            angular.forEach($scope.docparam,function(datosDocentes){
              if (datosAreas.IdentificacionDocente==datosDocentes.DOC_NRO_IDEN) {
                filtro.push(
                  datosDocentes
                );
              }
            });
          });
          return filtro;
        };
        /*
        Función que muestra los docentes relacionados a un área
        areaSeleccionada toma como valor value:"p.Id":
        recibe  la información del codigo del Area
        */
        self.mostrarDocentesArea= function(areaSeleccionada){

          poluxRequest.get("areas_docente",$.param({
            query: "IdAreaConocimiento:"+areaSeleccionada
          })).then(function(response){
            if (response.data==null)
              self.docentesArea=[];
            else
              self.docentesArea=self.unificarDocentes(response.data);
          });
        };
        /*self.guardar:
        guarda temporalmente los registros necesarios para el registro de la propuesta*/
        self.guardar=function(doc,docenteSeleccionado,estudiante){
          var codEstudiante;
          codEstudiante=parseInt(estudiante);
          self.estado= true;
          self.docregistrado=[];
          self.TGregistrado=[];
          self.areas_TG=[];
          self.vinculaciondocente=[];
          self.estudiante_TG=[];
          self.docTG=[];
          console.log(doc.enlace);
          poluxRequest.get("estudiante_TG",$.param({
            query:"CodigoEstudiante:"+codEstudiante
          })).then(function(response){
            console.log("respuesta: "+response.data[0].IdTrabajoGrado.Id);
            self.TGregistrado.push(
              {
                "Id": response.data[0].IdTrabajoGrado.Id
              }
            );
            self.areas_TG=self.preguardarAreasTG(self.TGregistrado);
            self.vinculaciondocente=self.preguardarVinculacion(self.TGregistrado,docenteSeleccionado);
            self.estudiante_TG=self.preguardarEstudianteTG(self.TGregistrado,estudiante);
          });
          self.docregistrado=self.preguardarDocumento(doc.titulo,doc.resumen,doc.enlace);
          //self.file.$submit();
          $scope.dialparent();

        };

        /**/
        self.preguardarDocumento=function(titulo,resumen,enlace){
          self.docregistrado.push(
            {
              "Titulo":titulo,
              "Resumen":resumen,
              "Enlace":enlace,
              "IdTipoDocumento": {
                "Id": 1,
                "IdCategoria": { //puede ser nulo
                  "Id": 1
                }
              }
            }
          );
          return self.docregistrado;
        };
        /**/
        self.preguardarAreasTG= function(dataIdTG){
          for (var i = 0; i < self.nuevaArea.length; i++) {
            self.areas_TG.push(
              {
                "IdAreaConocimiento": {
                  "Id": self.nuevaArea[i].Id,
                  "Nombre": self.nuevaArea[i].Nombre
                },
                "IdTrabajoGrado": dataIdTG[0]
              }
            );
          }
          return self.areas_TG;

        };
        /**/
        self.preguardarVinculacion= function(dataIdTG,docenteSeleccionado){
          docenteSeleccionado=parseFloat(docenteSeleccionado);
            var fechaInicio=new Date();
            self.vinculaciondocente.push(
              { "Activo": true,
                "FechaInicio": fechaInicio ,
                "IdTipoVinculacion": {
                  "Id": 1
                },
                "IdTrabajoGrado": dataIdTG[0],
                "IdentificacionDocente":docenteSeleccionado
              }
            );
          return self.vinculaciondocente;

        };
        /**/
        self.preguardarEstudianteTG=function(dataIdTG,estudiante){
          estudiante=parseFloat(estudiante);
          self.estudiante_TG.push(
            {
                "CodigoEstudiante": estudiante,
                "Estado": "activo",
                "IdTrabajoGrado": dataIdTG[0]
          });
          return self.estudiante_TG;
        };
        /**/
        self.guardarDocumentoTG=function(idDocumento,IdTrabajoGrado){
          self.docTG.push(
            {
              "IdDocumento": {
                "Id": idDocumento
              },
              "IdEstadoDocumento": {
                "Id": 1
              },
              "IdTrabajoGrado":  IdTrabajoGrado
            }
          );
          self.docTGregistrado={};
          poluxRequest.post("documento_tg",self.docTG[0]).then(function(response){
            poluxRequest.get("documento_tg", $.param({
              query: "Id:" + response.data.Id
            })).then(function(response){
              self.docTGregistrado=response.data;
            });
          });
        };
        /**/
        self.asignarAreasTG = function(parametro) {
          angular.forEach(parametro,function(valor){
            poluxRequest.post("areas_trabajo_grado", valor).then(function(response){
              poluxRequest.get("areas_trabajo_grado", $.param({
                query: "IdTrabajoGrado:" + response.data.IdTrabajoGrado
              })).then(function(response){
                self.areasTG = response.data;
              });
            });
          });
        };
        /**/
        self.guardarRegistro=function(){
          self.registroDocumento = [];

          poluxRequest.post("documento", self.docregistrado[0]).then(function(response){
            console.log("data.Id: " + response.data.Id);
            self.guardarDocumentoTG(response.data.Id, self.TGregistrado[0]);
            poluxRequest.get("documento", $.param({
              query: "Id:" + response.data.Id
            })).then(function(response){
              self.registroDocumento = response.data;
            });
          });

          self.asignarAreasTG(self.areas_TG);
          //self.vinculaciondocente= ; PENDIENTE(TO_DO) Como se controlaría?
        };
        /**/
        self.limpiar=function(){
          self.documento=angular.copy(self.doclimpio);
          self.nuevaArea=[];
        };

      },
      controllerAs:'d_regProp'
    };
  });
