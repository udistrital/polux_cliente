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
    .controller('menuCtrl', function (configuracionRequest, $location, $http, $scope, token_service, notificacion, $translate, $route, $mdSidenav) {
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

        if (token_service.live_token()) {
            token_service.token.role.pop();
            var roles = token_service.token.role.toString();
            //para agregar menus 
            roles = roles + ',ADMIN_POLUX';
            roles = roles.replace('/', '-');
            //sobrescribir documento
            //console.log(token_service.token.documento);
            configuracionRequest.get('menu_opcion_padre/ArbolMenus/' + roles + '/Polux', '')
                .then(function (response) {
                    $scope.menu_service = response.data;
                    if ($scope.menu_service != null) {
                        recorrerArbol($scope.menu_service, "");
                    }
                    update_url();
                });
        }

        /**
         * @ngdoc method
         * @name recorrerArbol
         * @methodOf poluxClienteApp.controller:menuCtrl
         * @description 
         * Recorre el árbol que recibe como parametro y busca los paths asociados.
         * @param {object} item Item que se busca
         * @param {object} padre Padre del objeto que se busca. 
         * @returns {Array} Array de padres del arbol de menús.
         */
        var recorrerArbol = function (item, padre) {
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

        /**
         * @ngdoc method
         * @name update_url
         * @methodOf poluxClienteApp.controller:menuCtrl
         * @description 
         * Actualiza la url actual.
         * @param {undefined} undefined no requiere parametros
         * @returns {undefined} No retorna ningún valor.
         */
        var update_url = function () {
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

        /**
         * @ngdoc method
         * @name havePermission
         * @methodOf poluxClienteApp.controller:menuCtrl
         * @description 
         * Verifica si un usuario tiene permiso para acceder o no.
         * @param {string} viewPath Menú al que el usuario quiere acceder.
         * @param {object} menu Menú de aplicaciones a las que tiene acceso el usuario.
         * @returns {number} Valor que indica si el usuario tiene permiso o no.
         */
        $scope.havePermission = function (viewPath, menu) {
            var currentPath = viewPath.replace(".html", "").split("views/").pop();
            var head = menu;
            var permission = 0;
            if (currentPath !== "main") {
                permission = $scope.menuWalkThrough(head, currentPath);
            } else {
                permission = 1;
            }
            return permission;

        };

        /**
         * @ngdoc method
         * @name menuWalkThrough
         * @methodOf poluxClienteApp.controller:menuCtrl
         * @description 
         * Recorre un árbol buscando una url especifica.
         * @param {object} head Objeto de tipo nodo donde se busca la url.
         * @param {url} url Url que se busca en el árbol.
         * @returns {number} Valor que indica si la url se encuetra o no en el árbol.
         */
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

        /**
         * @ngdoc method
         * @name routeChange
         * @methodOf poluxClienteApp.controller:menuCtrl
         * @description 
         * Escucha los cambios de la ruta y verifica si el usuario tiene permisos para acceder
         * o no  a la ruta.
         * @param {object} next Objeto que se captura del evento e identifica la página donde el usuario trata de acceder.  
         * @returns {undefined} No retorna ningún valor.
         */
        $scope.$on('$routeChangeStart', function (scope, next, current) {
            //Si tiene un Token
            if (token_service.live_token()) {
                //Se consultan los menus disponibles para el rol
                token_service.token.role.pop();
                var roles = token_service.token.role.toString();
                //para agregar menus 
                roles = roles + ',ADMIN_POLUX';
                //eliminar rol Internal/everyone por error que causa en url
                roles = roles.replace('/', '-');
                //sobrescribir documento
                //console.log(token_service.token.documento);
                configuracionRequest.get('menu_opcion_padre/ArbolMenus/' + roles + '/Polux', '')
                    .then(function (response) {
                        $scope.menu_service = response.data;
                        //Si no tiene permiso para ingresar al menu es redirigido               
                        if (!$scope.havePermission(next.templateUrl, $scope.menu_service)) {
                            $location.path("/no_permission");
                        }
                    });
            } else {
                //Si no tiene token se dirige a la página de inicios
                $location.path("/");
            }
        });


        $scope.changeLanguage = function (key) {
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
            return function () {
                $mdSidenav(componentId).toggle();
            };
        }
        $scope.toggleLeft = buildToggler('left');
        $scope.toggleRight = buildToggler('right');


        //Pendiente por definir json del menu
        (function ($) {
            $(document).ready(function () {
                $('ul.dropdown-menu [data-toggle=dropdown]').on('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $(this).parent().siblings().removeClass('open');
                    $(this).parent().toggleClass('open');
                });
            });
        })(jQuery);
    });
