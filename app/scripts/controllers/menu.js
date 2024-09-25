'use strict';
/**
 * @ngdoc function
 * @name poluxClienteApp.controller:menuCtrl
 * @description
 * # menuCtrl
 * Controller of the poluxClienteApp
 * Controlador del menu de Pólux.
 * @requires services/configuracionService.service:configuracionRequest
 * @requires $location
 * @requires $http
 * @requires $scope
 * @requires services/poluxClienteApp.service:tokenService
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires $mdSidenav
 * @requires $route
 * @property {Object} language Clase de los botones.
 * @property {array} menu_app Menú de las aplicaciones asociadas a la universidad que se muestra en la parte lateral.
 */
angular.module('poluxClienteApp')
    .controller('menuCtrl', function($location, $http, $window, $q, $scope, $rootScope, token_service, configuracionRequest, notificacionRequest, $translate, $route, $mdSidenav) {
        $scope.language = {
            es: "btn btn-primary btn-circle btn-outline active",
            en: "btn btn-primary btn-circle btn-outline"
        };
        $scope.menu_app = [{
            id: "kronos",
            title: "KRONOS",
            url: "http://10.20.0.254/kronos"
        }, {
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
        }];
        $scope.notificacion=notificacionRequest;
        $scope.actual = "";
        $scope.token_service = token_service;
        $scope.breadcrumb = [];
        $scope.menu_service = [];
        $scope.logout = function() {
            token_service.logout();
        };
        if (token_service.live_token()) {
            token_service.getLoginData()
                .then(function() {
                    $scope.token = token_service.getAppPayload();
                    if (!angular.isUndefined($scope.token.appUserRole)) {
                        var roles = "";
                        if (typeof $scope.token.appUserRole === "object") {
                            var rl = [];
                            $scope.token.appUserRole = $scope.token.appUserRole.concat( $scope.token.role);
                            for (var index = 0; index < $scope.token.appUserRole.length; index++) {
                                if($scope.token.appUserRole[index]!= undefined){
                                if ($scope.token.appUserRole[index].indexOf("/") < 0) {
                                    rl.push($scope.token.appUserRole[index]);
                                }
                            }
                            }
                            // Confirmar la subcripcion de notificaciones
                 notificacionRequest.verificarSuscripcion().then(function(respuestasub)
                {
                    if(respuestasub.data.Data!=false){
                    }
                    else
                    {
                        notificacionRequest.suscripcion().then(function(respuestasubs)
                        {
                            if(respuestasubs.data.Data!=false)
                            {
                                console.log(respuestasubs.data.Data+" Se ha registrado el usuario en notificaciones");
                            }
                        }).catch(
                                function (error) {
                                    console.log(error)
                                }
                            );
                    }
                  }
                );
                            roles = rl.toString();
                        } else {
                            roles = $scope.token.appUserRole;
                        }
                        roles = roles.replace(/,/g, '%2C');
                        configuracionRequest.get('menu_opcion_padre/ArbolMenus/' + roles + '/Polux', '').then(function(response) {
                                $rootScope.my_menu = response.data;
                            })
                            .catch(
                                function(response) {
                                    $rootScope.my_menu = response.data;

                                });
                    }
                });
        }

        var update_url = function() {
        };

        $scope.$on('$routeChangeStart', function(scope, next, current) {
            update_url();
        });

        $scope.havePermission = function (viewPath, menu) {
            if (viewPath !== undefined && viewPath !== null) {
                var currentPath = viewPath.replace(".html", "").split("views/").pop();
                var head = menu;
                var permission = 0;
                if (currentPath !== "main") {
                    permission = $scope.menuWalkThrough(head, currentPath);
                } else {
                    permission = 1;
                }
                return permission;
            }
            return 1;

        };

        $scope.menuWalkThrough = function (head, url) {
            var acum = 0;
            if (!angular.isUndefined(head)) {
                angular.forEach(head, function (node) {
                    if (node.Opciones === null && node.Url === url) {
                        acum = acum + 1;
                    } else if (node.Opciones !== null) {
                        acum = acum + $scope.menuWalkThrough(node.Opciones, url);
                    } else {
                        acum = acum + 0;
                    }
                });
                return acum;
            } else {
                return acum;
            }
        };

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