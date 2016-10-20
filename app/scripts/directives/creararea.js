'use strict';

/**
 * @ngdoc directive
 * @name poluxApp.directive:crearArea
 * @description
 * # crearArea
 */
angular.module('poluxApp')
  .directive('crearArea', function (areasRequest) {
    return {
      templateUrl: 'views/directives/crear-area.html',
      scope: {
          newarea:'='
      },
      restrict: 'E',
      controller: function() {
        var ctrl=this;
        ctrl.fabrica=areasRequest;
        ctrl.areas=areasRequest.obtenerAreas();
       console.log(ctrl.areas);
        //ásignar areas temporalmente
        ctrl.nuevaArea = [];

        ctrl.asignarArea = function() {
          //verifica que el Nombre sea el mismo y asigna el Id
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
              ctrl.Id='',
              ctrl.Nombre='';
              ctrl.Descripcion='';
        };

        ctrl.asignarAreasDocente= function(area){
          ctrl.fabrica.mostrar=[];
          ctrl.fabrica.asignarAreas(area);
          ctrl.nuevaArea = [];
        };
        ctrl.compararAreas=function(){
          ctrl.areaCreada=[];
          var existe=false;
          swal({
          title: 'Ingrese el nombre del área',
          input: 'text',
          showCancelButton: true,
          confirmButtonText: 'Crear nueva área',
          showLoaderOnConfirm: true,
          preConfirm: function(arean) {
            return new Promise(function(resolve, reject) {
              setTimeout(function() {
                for (var i = 0; i < ctrl.areas.length ; i++) {
                if (arean === ctrl.areas[i].Nombre) {
                  i=ctrl.areas.length;
                  existe=true;
                  reject('Esta area ya existe')
                }
                else {
                  existe=false;
                }
              }
                if (existe==false) {
                  ctrl.areaCreada.push(
                    {
                      "Nombre":arean
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
            title: 'Ajax request finished!',
            html: 'Area agregada: ' + areans
          })
        })


        };


      },
      controllerAs: "crearArea"
    };
  });
