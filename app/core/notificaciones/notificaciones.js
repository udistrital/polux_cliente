'use strict';
/**
 * @ngdoc function
 * @name core.controller:notificacionesCtrl
 * @description
 * # menuaplicacionesCtrl
 * Controller of the core
 */
angular.module('core')
    .controller('notificacionesCtrl',
        function (notificacionRequest, $scope, behaviorTheme) {
            var self = this;
            $scope.notificacion = notificacionRequest;

            $scope.claseContainer = behaviorTheme.notificacion;
            $scope.redirect_url = function (notify) {
                // console.log(notify);
                var path_sub = window.location.origin;
                notificacionRequest.changeStateToView(notify.Id, notify.Estado);
                if (notify.Content.Message.Link.indexOf(path_sub)) {
                    window.open(notify.Content.Message.Link, "_blank");
                } else {
                    $location.path(notify.Content.Message.Link);
                }
            };

        });
