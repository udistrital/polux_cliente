'use strict';

angular.module('poluxApp')
  .controller('menuCtrl', function($location, $http, $scope, token_service) {
      //Notificaciones
      $scope.log = [];
      $scope.message = "";
      if (!window["WebSocket"]) {
        $scope.log.push("Your browser does not support WebSockets.");
        return;
      }
      var conn = new WebSocket("ws://localhost:8080/ws?id=2&profile=admin");
      conn.onclose = function(e) {
        $scope.$apply(function() {
          console.log("Connection closed.");
        });
      };
      conn.onmessage = function(e) {
        $scope.$apply(function() {
          var data = JSON.parse(e.data);
          $scope.log.unshift(data);
          console.log(data);
        })
      };
      conn.onopen = function(e) {
        console.log("Connected");
        $scope.$apply(function() {
          console.log("Welcome to the chat!");
        })
      };

      $scope.send = function() {
        if (!conn) {
          return;
        }
        if (!$scope.message) {
          return;
        }
        conn.send(nick + ": " + $scope.message);
        $scope.message = "";
      }
      $scope.no_vistos = function() {
        var j = 0;
        angular.forEach($scope.log, function(notificiacion) {
          if (!notificiacion.visto) j += 1;
        });
        return j;
      }
      // fin notificaciones
      var ctrl = this;
      $scope.actual = "";
      $scope.token_service = token_service;
      $scope.breadcrumb = [];
      $scope.menu_service = [{ //aqui va el servicio de el app de configuracion
          "Id": 1,
          "Nombre": "FORMATO",
          "Url": "",
          "Opciones": [{
            "Id": 2,
            "Nombre": "VER FORMATO",
            "Url": "formato_ver",
            "Opciones": null
          }, {
            "Id": 3,
            "Nombre": "NUEVO FORMATO",
            "Url": "formato_nuevo",
            "Opciones": null
          }, {
            "Id": 4,
            "Nombre": "EDITAR FORMATO",
            "Url": "formato_editar",
            "Opciones": null
          }]
        }, {
          "Id": 2,
          "Nombre": "GENERAL",
          "Url": "",
          "Opciones": [{
            "Id": 2,
            "Nombre": "PROPUESTA",
            "Url": "",
            "Opciones": [{
              "Id": 2,
              "Nombre": "REGISTRAR PROPUESTA",
              "Url": "general/propuesta",
              "Opciones": null
            }, {
              "Id": 3,
              "Nombre": "CONSULTAR PROPUESTA",
              "Url": "general/cons_prop",
              "Opciones": null
            }]
          }, {
            "Id": 3,
            "Nombre": "TRABAJO DE GRADO",
            "Url": "",
            "Opciones": [{
              "Id": 2,
              "Nombre": "REGISTRAR",
              "Url": "general/reg_TG",
              "Opciones": null
            }]
          }]
        },
        {
          "Id": 2,
          "Nombre": "POSTGRADO",
          "Url": "",
          "Opciones": [{
            "Id": 2,
            "Nombre": "PROPUESTA",
            "Url": "",
            "Opciones": null
          }]
        }
      ];

    var recorrerArbol = function(item, padre) {
      var padres = "";
      for (var i = 0; i < item.length; i++) {
        if (item[i].Opciones === null) {
          padres = padre + " , " + item[i].Nombre;
          paths.push({
            'path': item[i].Url,
            'padre': padres.split(",")
          });
        } else {
          recorrerArbol(item[i].Opciones, padre + "," + item[i].Nombre);
        }
      }
      return padres;
    };

    var paths = [];

    var update_url = function() {
      $scope.breadcrumb = [''];
      for (var i = 0; i < paths.length; i++) {
        if ($scope.actual === "/" + paths[i].path) {
          $scope.breadcrumb = paths[i].padre;
        } else if ('/' === $scope.actual) {
          $scope.breadcrumb = [''];
        }
      }
    }
    recorrerArbol($scope.menu_service, "");

    $scope.$on('$routeChangeStart', function(next, current) {
      $scope.actual = $location.path();
      update_url();
    });


    //Pendiente por definir json del menu
    (function($) {
      $(document).ready(function() {
        $('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
          event.preventDefault();
          event.stopPropagation();
          $(this).parent().siblings().removeClass('open');
          $(this).parent().toggleClass('open');
        });
      });
    })(jQuery);
  });
