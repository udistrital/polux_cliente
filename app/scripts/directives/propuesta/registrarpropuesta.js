'use strict';

/**
* @ngdoc directive
* @name poluxApp.directive:propuesta/registrarPropuesta
* @description
* # propuesta/registrarPropuesta
*/
angular.module('poluxApp')
.directive('registrarPropuesta', function (areasRequest,docentesRequest,documentoRequest,cadenaRequest) {
  return {
    restrict: "E",
    scope: {
      areaConsultada:'='
    },
    templateUrl: "views/directives/propuesta/registrar-propuesta.html",
    controller: function($scope) {
      var ctrl=this;
      ctrl.fabrica=docentesRequest;
      ctrl.fabricaAreas=areasRequest;
      ctrl.areas=ctrl.fabricaAreas.obtenerAreas(); //necesario para cargar las peticiones en el primer intento
      ctrl.string="registrarPropuesta";
      ctrl.nuevaArea = [];
      ctrl.propuesta=
      {"modalidad":"pasantia"};
      ctrl.estudiante=
      {
        "codigo": "20101020109",
        "nombre": "David Morales"
      };
      ctrl.doclimpio={};
      ctrl.docregistrado=[];
      ctrl.filtro=false;
      ctrl.establecerFiltroDocentes= function(){
        if(ctrl.filtro)
          return ctrl.fabrica.docentes;
        else
          return ctrl.fabrica.docentesArea;
      };
      /*
      Función que muestra los docentes relacionados a un área
      areaSeleccionada toma como valor value:"p.Id":
      recibe  la información del codigo del Area

      */
      ctrl.mostrarDocentesArea= function(areaSeleccionada){
        ctrl.fabrica.listarDocentesArea(areaSeleccionada);
      };

      /*
      ctrl.asignarDocente:
       Muestra el codigo del coddocente por consola,
       se guarda el docenteSeleccionado por el ng-chance del ng-model
       dependiendo de la selección del docente

      */
      ctrl.asignarDocente = function(docenteSeleccionado){
        console.log(docenteSeleccionado);
      };



      /*ctrl.guardar:
       guarda temporalmente los registros necesarios para el registro de la propuesta*/
      ctrl.guardar=function(doc,docenteSeleccionado){
        doc.titulo=cadenaRequest.cambiarTipoTitulo(doc.titulo);
        ctrl.docregistrado=[];
        ctrl.TGregistrado=[];
        ctrl.areas_TG=[];
        ctrl.vinculaciondocente=[];
        doc.enlace="/server/files/"
        ctrl.TGregistrado.push(
          {
            "Id": 1
          }
        );
        ctrl.docregistrado=ctrl.preguardarDocumento(doc.titulo,doc.resumen,doc.enlace);
        ctrl.areas_TG=ctrl.preguardarAreasTG();
        ctrl.vinculaciondocente=ctrl.preguardarVinculacion(docenteSeleccionado);

      };

      ctrl.preguardarDocumento=function(titulo,resumen,enlace){
        ctrl.docregistrado.push(
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
        return ctrl.docregistrado;
      };

      ctrl.preguardarAreasTG= function(){

        for (var i = 0; i < ctrl.nuevaArea.length; i++) {
          ctrl.areas_TG.push(
            {
              "IdAreaConocimiento": {
                "Id": ctrl.nuevaArea[i].Id,
                "Nombre": ctrl.nuevaArea[i].Nombre
              },
              "IdTrabajoGrado": ctrl.TGregistrado[0]
            }
          );
        }
        return ctrl.areas_TG;

      };

      ctrl.preguardarVinculacion= function(docenteSeleccionado){
        docenteSeleccionado=parseFloat(docenteSeleccionado);
          var fechaInicio=new Date();
          ctrl.vinculaciondocente.push(
            { "Activo": true,
              "FechaInicio": fechaInicio ,
              "IdTipoVinculacion": {
                "Id": 1
              },
              "IdTrabajoGrado": ctrl.TGregistrado[0],
              "IdentificacionDocente":docenteSeleccionado
            }
          );
        return ctrl.vinculaciondocente;

      };

      ctrl.guardarRegistro=function(){
        ctrl.registroDocumento=[];
        documentoRequest.postDocumento(ctrl.docregistrado[0]).success(function(data){
          documentoRequest.getDocumento(data.Id).success(function(data){
            ctrl.registroDocumento=data;
          });
        });
        ctrl.fabricaAreas.asignarAreasTG(ctrl.areas_TG);
        //ctrl.vinculaciondocente= ; PENDIENTE(TO_DO) Como se controlaría?
      };

      ctrl.limpiar=function(){
          ctrl.documento=angular.copy(ctrl.doclimpio);
          ctrl.nuevaArea=[];
      };


      ctrl.asignarArea = function() {
        ctrl.nombreArea=cadenaRequest.cambiarTipoTitulo(ctrl.nombreArea);
        //verifica que el Nombre sea el mismo y asigna el Id(necesario para tablas con llave compuesta)
        for (var i = 0; i < ctrl.fabricaAreas.areas.length; i++) {
          if (ctrl.fabricaAreas.areas[i].Nombre==ctrl.nombreArea) {
            ctrl.IdArea=ctrl.fabricaAreas.areas[i].Id;
            console.log(ctrl.fabricaAreas.areas[i].Nombre);
          }
        }
        console.log(ctrl.IdArea);
        //genera el JSON temporal en el cliente
        ctrl.nuevaArea.push(
          { "Id":ctrl.IdArea,
          "Nombre": ctrl.nombreArea
        }
      );
      document.getElementById("formAsignar").reset();
    };

    /* verificarAreas: funcion que verifica el nombre del area exista
    parametros: nombreArea:compara con el arreglo actual de áreas
    */

    ctrl.verificarAreas=function(nombreArea){
      //console.log(nombreArea);
      nombreArea=cadenaRequest.cambiarTipoTitulo(nombreArea);
      if (ctrl.fabricaAreas.areas==null) {
        return true;
      }
      else {
        for (var i = 0; i < ctrl.fabricaAreas.areas.length; i++) {
          if (ctrl.fabricaAreas.areas[i].Nombre==nombreArea) {
            return false;
          }
        }
      }
      if (nombreArea==null ) {
        return false;
      }
      else {
        return true;
      }
    };


    },
    controllerAs: "regProp"
  };
});
