'use strict';

/**
* @ngdoc directive
* @name poluxApp.directive:crearArea
* @description
* # crearArea
*/
angular.module('poluxApp')
.directive('crearArea', function (areasRequest,cadenaRequest) {
  return {
    templateUrl: 'views/directives/crear-area.html',
    scope: {
      newarea:'='
    },
    restrict: 'E',
    controller: function($scope) {
      var ctrl=this;
      ctrl.fabrica=areasRequest;
      //ásignar areas temporalmente
      ctrl.nuevaArea = [];

      ctrl.asignarArea = function() {
        ctrl.Nombre=cadenaRequest.cambiarTipoTitulo(ctrl.Nombre);
        //verifica que el Nombre sea el mismo y asigna el Id(necesario para tablas con llave compuesta)
        for (var i = 0; i < ctrl.fabrica.areas.length; i++) {
          if (ctrl.fabrica.areas[i].Nombre==ctrl.Nombre) {
            ctrl.Id=ctrl.fabrica.areas[i].Id;
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
    /* Llama a la funcion de asignar areas pasando como parametro el JSON temporal de nuevaArea*/
    ctrl.asignarAreasDocente= function(area){
      ctrl.fabrica.mostrar=[];
      ctrl.fabrica.asignarAreas(area)

      ctrl.nuevaArea = [];

    };

    /* registrarAreas:Permite registrar nuevas areas mediante un alert
    Recibe como parametro: la área no encontrada
    */
    ctrl.registrarAreas=function(parametroArea){
      console.log(parametroArea);
      ctrl.areaCreada=[];
      ctrl.busqAreas=areasRequest.obtenerAreas();
      parametroArea=cadenaRequest.cambiarTipoTitulo(parametroArea);
      console.log(parametroArea);
      var existe=false;
      swal({
        title: 'Ingrese el nombre del área',
        input: 'text',
        inputValue: parametroArea,
        showCancelButton: true,
        confirmButtonText: 'Crear nueva área',
        showLoaderOnConfirm: true,
        preConfirm: function(parametroArea) {
          parametroArea=cadenaRequest.cambiarTipoTitulo(parametroArea);
          return new Promise(function(resolve, reject) {
            setTimeout(function() {
              if (ctrl.busqAreas==null) {
                existe=false;
              }
              else {
                for (var i = 0; i < ctrl.busqAreas.length ; i++) {
                  if (parametroArea === ctrl.busqAreas[i].Nombre) {
                    i=ctrl.busqAreas.length;
                    existe=true;
                    reject('Esta area ya existe')
                  }
                  else {
                    existe=false;
                  }
                }
              }

              if (existe==false) {
                ctrl.areaCreada.push(
                  {
                    "Nombre":parametroArea
                  });
                  ctrl.fabrica.crearArea(ctrl.areaCreada);
                  resolve()
                }

              }, 2000)
            })
          },
          allowOutsideClick: false
        }).then(function(areans) {
          swal({
            type: 'success',
            title: 'Registro Finalizado',
            html: 'Area agregada: ' + areans
          })
        })


      };

      /* verificarAreas: funcion que verifica el nombre del area exista
      parametros: nombreArea:compara con el arreglo actual de áreas
      */

      ctrl.verificarAreas=function(nombreArea){
        //console.log(nombreArea);
        nombreArea=cadenaRequest.cambiarTipoTitulo(nombreArea);
        if (ctrl.fabrica.areas==null) {
          return true;
        }
        else {
          for (var i = 0; i < ctrl.fabrica.areas.length; i++) {

            if (ctrl.fabrica.areas[i].Nombre==nombreArea) {
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
    controllerAs: "crearArea"
  };
});
