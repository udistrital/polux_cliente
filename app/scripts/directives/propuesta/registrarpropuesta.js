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
      /*
      Función que muestra los docentes relacionados a un área
      areaSeleccionada toma como valor value:"p.Id":
      recibe  la información del codigo del Area

      */
      ctrl.mostrarDocentesArea= function(areaSeleccionada){
        ctrl.fabrica.listarDocentesArea(areaSeleccionada);
      };

      ctrl.asignarDocente = function(docenteSeleccionado){
        console.log(docenteSeleccionado);
      };
      ctrl.guardar=function(doc,areaTG){
        doc.titulo=cadenaRequest.cambiarTipoTitulo(doc.titulo);
        ctrl.docregistrado=[];
        ctrl.TGregistrado=[];
        ctrl.areas_TG=[];
        ctrl.docregistrado.push(
          {
          "Titulo":doc.titulo,
          "Resumen":doc.resumen,
          "Enlace":"",
          "IdTipoDocumento":
          {
              "Id": 1,
              "Nombre": "Propuesta",
              "IdCategoria": {
                "Id": 1,
                "Nombre": "Documento"
              },
              "Descripcion": ""
            }
          }
        );
        ctrl.TGregistrado.push(
          {
            "Distincion": "",
            "Etapa": "propuesta",
            "Id": 1,
            "IdModalidad": {
              "Activa": true,
              "Descripcion": "",
              "Id": 1,
              "Nombre": "pasantia"
            },
            "Titulo": doc.titulo
          }
        );
        ctrl.areas_TG.push(
          {
            "Id": 1,
            "IdAreaConocimiento": {
              "Descripcion": "",
              "Id": areaTG.areaSeleccionada,
              "Nombre": areaTG.areaSeleccionada.Nombre
            },
            "IdTrabajoGrado": ctrl.TGregistrado
          }
        );
      };
      ctrl.limpiar=function(){
          ctrl.documento=angular.copy(ctrl.doclimpio);
      };


      ctrl.asignarArea = function() {

        ctrl.Nombre=cadenaRequest.cambiarTipoTitulo(ctrl.Nombre);
        //verifica que el Nombre sea el mismo y asigna el Id(necesario para tablas con llave compuesta)
        for (var i = 0; i < ctrl.fabricaAreas.areas.length; i++) {
          if (ctrl.fabricaAreas.areas[i].Nombre==ctrl.Nombre) {
            ctrl.Id=ctrl.fabricaAreas.areas[i].Id;
            console.log(ctrl.fabricaAreas.areas[i].Nombre);
          }
        }

        console.log(ctrl.Id);
        //genera el JSON temporal en el cliente
        ctrl.nuevaArea.push(
          { "Id":ctrl.Id,
          "Nombre": ctrl.Nombre

        }
      );
      document.getElementById("formAsignar").reset();

    };



    },
    controllerAs: "regProp"
  };
});
