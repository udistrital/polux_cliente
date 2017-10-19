'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:DocenteTgsRevisionDocumentoCtrl
 * @description
 * # DocenteTgsRevisionDocumentoCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
    .controller('DocenteTgsRevisionDocumentoCtrl', function($http, poluxRequest, academicaRequest, $routeParams) {
        var ctrl = this;

        ctrl.docente=$routeParams.idDocente;

        ctrl.ver_seleccion = function(item, model) {
            console.log(item);
            ctrl.tgId = item.TrabajoGrado.Id;
            ctrl.doctgId = item.DocumentoTrabajoGrado[0].Id;
            ctrl.doc = item.DocumentoTrabajoGrado[0].Id;
            ctrl.documento = true;
            ctrl.vncdocId = item.Id;
            ctrl.refrescar();
        };

        poluxRequest.get("vinculacion_trabajo_grado", $.param({
            query: "Usuario:" + ctrl.docente,
            limit: -1,
            sortby: "Id",
            order: "asc"
        })).then(function(response) {
            ctrl.vinculacion_docente = response.data;
            angular.forEach(ctrl.vinculacion_docente, function(vd) {
                poluxRequest.get("documento_trabajo_grado", $.param({
                    query: "TrabajoGrado:" + vd.TrabajoGrado.Id,
                    limit: -1,
                    sortby: "Id",
                    order: "asc"
                })).then(function(response) {
                    vd.DocumentoTrabajoGrado = response.data;
                });
                $http.get("http://10.20.0.127/polux/index.php?data=sj7574MlJOsg4LjjeAOJP5CBi1dRh84M-gX_Z-i_0OmWhton7vEvfcvwRdSGHCTl2WlcEunFl-15PLUWhzSwdnO0c9_4iv7A6ODAQz8nzk3-L-wp9KXARJdYvqggsPUb&identificacion=" + vd.Usuario)
                    .then(function(response) {
                        vd.Docente = response.data[0];
                    });
            });
        });
        ctrl.refrescar = function() {
            poluxRequest.get("revision_trabajo_grado", $.param({
                query: "DocumentoTrabajoGrado:" + ctrl.doctgId + ",VinculacionTrabajoGrado:" + ctrl.vncdocId,
                sortby: "Id",
                order: "asc",
                limit: 0
            })).then(function(response) {
              console.log(response);
                ctrl.revisionesd = response.data;
                if (ctrl.revisionesd != null) {
                    ctrl.numRevisiones = ctrl.revisionesd.length;
                }
                poluxRequest.get("vinculacion_trabajo_grado", $.param({
                    query: "Id:" + ctrl.vncdocId
                })).then(function(response) {
                  console.log(ctrl.vncdocId);
                  console.log(response.data[0]);
                    ctrl.vinculacion_info = response.data[0];
                });
            });
        };


    });
