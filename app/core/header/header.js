

'use strict';
/**
 * @ngdoc function
 * @name core.controller:headerCtrl
 * @description
 * # headerCtrl
 * Controller of the core
 */

angular.module('core')
    .controller('headerCtrl',
        function (token_service, CONF, behaviorTheme, $scope) {

            $scope.token_service = token_service;

            $scope.app = (CONF.APP.toLowerCase()).trim() + "-isotipo";
            $scope.app_large = (CONF.APP.toLowerCase()).trim() + "-header";

            token_service.getPayload2()
            .then(function(response){
                $scope.token = response;
            })
            if (token_service.logginned) {
                $scope.isLogin = true;

            } else {
                $scope.isLogin = false;
            }
            $scope.logout = function () {
                token_service.logout();
            }
            $scope.sidebarClases = behaviorTheme.sidebar;

            $scope.toogleCerrarSesion = function () {
                var buttonCerrarSesion = document.getElementById('header-button-cerrarsesion-container');
                if (buttonCerrarSesion.style.display === "none" || buttonCerrarSesion.style.display === "") {
                    buttonCerrarSesion.style.display = "block";
                } else {
                    buttonCerrarSesion.style.display = "none";
                }
            }
            $scope.toogleAplicaciones = function () {
                behaviorTheme.toogleAplicacion();
            }

            $scope.sidebarEvent = function () {
                behaviorTheme.toogleSidebar();
            }
            var mediaquery = window.matchMedia("(max-width: 855px)");
            if (mediaquery.matches) {
                behaviorTheme.toogleSidebar();
                behaviorTheme.toogleSidebar();
            }
        });


