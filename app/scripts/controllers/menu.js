'use strict';
/**
 * @ngdoc function
 * @name poluxClienteApp.controller:menuCtrl
 * @description
 * # menuCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
    .controller('menuCtrl', function(configuracionRequest,$location, $http, $scope, token_service, notificacion, $translate, $route, $mdSidenav) {
        var paths = [];
        $scope.language = {
            es: "btn btn-primary btn-circle btn-outline active",
            en: "btn btn-primary btn-circle btn-outline"
        };
        $scope.token_service = token_service;
       
        $scope.notificacion = notificacion;
        $scope.actual = "";
        $scope.token_service = token_service;
        $scope.breadcrumb = [];
        $scope.menu_service = [];

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

        if(token_service.live_token()){
            token_service.token.role.pop();
            var roles = token_service.token.role.toString();
            //para agregar menus 
            roles = roles+',ADMIN_POLUX';
            roles = roles.replace(',Internal/everyone','');
            //sobrescribir documento
            //console.log(token_service.token.documento);
             configuracionRequest.get('menu_opcion_padre/ArbolMenus/' + roles + '/Polux', '')
            .then(function(response) {
                $scope.menu_service = response.data;
                if($scope.menu_service != null){
                    recorrerArbol($scope.menu_service, "");
                }
                update_url();
            });
        }

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


        $scope.havePermission = function(viewPath,menu){
            var currentPath = viewPath.replace(".html","").split("views/").pop();
            var head = menu;
            var permission = 0;
            if (currentPath !== "main"){
                permission=$scope.menuWalkThrough(head,currentPath);
            }else{
                permission =1;
             }
            return permission;
            
        };

        $scope.menuWalkThrough = function(head,url){
            var acum = 0;
            if(!angular.isUndefined(head)){
                angular.forEach(head,function(node){
                    if (node.Opciones === null && node.Url === url){
                        acum = acum + 1;
                    }else if (node.Opciones !== null){
                        acum = acum  + $scope.menuWalkThrough(node.Opciones,url);
                    }else{
                        acum = acum + 0;
                    }
                });
                return acum;
            }else{
                return acum;
            }       
    };

    $scope.$on('$routeChangeStart', function(scope,next, current) {
        //Si tiene un Token
        if(token_service.live_token()){
            //Se consultan los menus disponibles para el rol
            token_service.token.role.pop();
            var roles = token_service.token.role.toString();    
            //para agregar menus 
            roles = roles+',ADMIN_POLUX';
            //eliminar rol Internal/everyone por error que causa en url
            roles = roles.replace(',Internal/everyone','');
            //sobrescribir documento
            //console.log(token_service.token.documento);
            configuracionRequest.get('menu_opcion_padre/ArbolMenus/' + roles + '/Polux', '')
            .then(function(response) {
                $scope.menu_service = response.data; 
                //Si no tiene permiso para ingresar al menu es redirigido               
                if (!$scope.havePermission(next.templateUrl,$scope.menu_service)){
                    $location.path("/no_permission");
                } 
            });
        }else{
            //Si no tiene token se dirige a la página de inicios
            $location.path("/");
        }
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
