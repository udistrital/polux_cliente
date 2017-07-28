'use strict';
/**
 * @ngdoc function
 * @name poluxClienteApp.controller:menuCtrl
 * @description
 * # menuCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
    .controller('menuCtrl', function($location, $http, $scope, token_service, notificacion, $translate, $route, $mdSidenav) {
        var paths = [];
        $scope.language = {
            es: "btn btn-primary btn-circle btn-outline active",
            en: "btn btn-primary btn-circle btn-outline"
        };
        $scope.notificacion = notificacion;
        $scope.actual = "";
        $scope.token_service = token_service;
        $scope.breadcrumb = [];
        $scope.menu_service = [];


        /*{ //aqui va el servicio de el app de configuracion
>>>>>>> 7d91be8ef4e798a52a74dbe919d957e162ab3750
            "Id": 1,
            "Nombre": "Formato",
            "Url": "",
            "Opciones": [{
              "Id": 2,
              "Nombre": "Ver formato",
              "Url": "formato_ver",
              "Opciones": null
            }, {
              "Id": 3,
              "Nombre": "Nuevo formato",
              "Url": "formato_nuevo",
              "Opciones": null
            }, {
              "Id": 4,
              "Nombre": "Editar formato",
              "Url": "formato/formato_edicion",
              "Opciones": null
            }]
          }, {
            "Id": 2,
            "Nombre": "General",
            "Url": "",
            "Opciones": [{
              "Id": 2,
              "Nombre": "Propuesta",
              "Url": "",
              "Opciones": [{
                "Id": 2,
                "Nombre": "Registrar propuesta",
                "Url": "general/propuesta",
                "Opciones": null
              }, {
                "Id": 3,
                "Nombre": "Consultar propuesta",
                "Url": "general/cons_prop",
                "Opciones": null
              }]
            }, {
              "Id": 3,
              "Nombre": "Trabajo de Grado",
              "Url": "",
              "Opciones": [{
                "Id": 2,
                "Nombre": "Registrar",
                "Url": "general/reg_TG",
                "Opciones": null
              }]
            }]
          },
          {
            "Id": 2,
            "Nombre": "Posgrado",
            "Url": "",
            "Opciones": [{
              "Id": 2,
              "Nombre": "Publicación de Espacios Académicos",
              "Url": "materias_posgrado/publicar_asignaturas",
              "Opciones": null
            },
            {
              "Id": 3,
              "Nombre": "Solicitar inscripción",
              "Url": "materias_posgrado/solicitar_asignaturas",
              "Opciones": null
            },
            {
              "Id": 4,
              "Nombre": "Listar inscritos",
              "Url": "materias_posgrado/listar_solicitudes",
              "Opciones": null
            }
            */

        //Variable que contiene el arreglo de los JSON, con los menus respectivos

        $scope.menu_app = [{
                id: "kronos",
                title: "KRONOS",
                url: "http://10.20.0.254/kronos"
            },
            {
                id: "agora",
                title: "AGORA",
                url: "https://pruebasfuncionarios.intranetoas.udistrital.edu.co/agora"
            }, {
                id: "argo",
                title: "ARGO",
                url: "https://pruebasfuncionarios.intranetoas.udistrital.edu.co/argo"
            }, {
                id: "arka",
                title: "ARKA",
                url: "https://pruebasfuncionarios.intranetoas.udistrital.edu.co/arka"
            }, {
                id: "temis",
                title: "TEMIS",
                url: "https://pruebasfuncionarios.intranetoas.udistrital.edu.co/gefad"
            }, {
                id: "polux",
                title: "POLUX",
                url: "http://10.20.0.254/polux"
            }, {
                id: "jano",
                title: "JANO",
                url: "http://10.20.0.254/kronos"
            }, {
                id: "kyron",
                title: "KYRON",
                url: "http://10.20.0.254/kronos"
            }, {
                id: "sga",
                title: "SGA",
                url: "http://10.20.0.254/kronos"
            }
        ];


        $http.get('http://10.20.0.254/configuracion_api/v1/menu_opcion_padre/ArbolMenus/Admin Polux')
            .then(function(response) {
                $scope.menu_service = response.data;
                recorrerArbol($scope.menu_service, "");
                update_url();
            });

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



        var update_url = function() {
            $scope.breadcrumb = [''];
            for (var i = 0; i < paths.length; i++) {
                if ($scope.actual === "/" + paths[i].path) {
                    $scope.breadcrumb = paths[i].padre;
                } else if ('/' === $scope.actual) {
                    $scope.breadcrumb = [''];
                }
            }
        };
        recorrerArbol($scope.menu_service, "");
        paths.push({ padre: ["", "Notificaciones", "Ver Notificaciones"], path: "notificaciones" });

        $scope.$on('$routeChangeStart', function(next, current) {
            $scope.actual = $location.path();
            update_url();
            console.log(next + current);
        });

        $scope.changeLanguage = function(key) {
            $translate.use(key);
            switch (key) {
                case 'es':
                    $scope.language.es = "btn btn-primary btn-circle btn-outline active";
                    $scope.language.en = "btn btn-primary btn-circle btn-outline";
                    break;
                case 'en':
                    $scope.language.en = "btn btn-primary btn-circle btn-outline active";
                    $scope.language.es = "btn btn-primary btn-circle btn-outline";
                    break;
                default:
            }
            $route.reload();
        };

        function buildToggler(componentId) {
            return function() {
                $mdSidenav(componentId).toggle();
            };
        }
        $scope.toggleLeft = buildToggler('left');
        $scope.toggleRight = buildToggler('right');


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