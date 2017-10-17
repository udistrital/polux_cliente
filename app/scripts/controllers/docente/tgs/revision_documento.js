'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:DocenteTgsRevisionDocumentoCtrl
 * @description
 * # DocenteTgsRevisionDocumentoCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
    .controller('DocenteTgsRevisionDocumentoCtrl', function($http, poluxRequest, academicaRequest) {

        var ctrl = this;
        ctrl.docente=80093200;
        ctrl.tgId = 1;
        ctrl.doctgId = 2; //viene por la sesión
        ctrl.doc = 2;
        ctrl.vncdocId = 1;
        ctrl.pagina = 1;
        ctrl.documento = false;

        ctrl.ver_seleccion = function(item, model) {
            console.log(item);
            ctrl.tgId = item.TrabajoGrado.Id;
            ctrl.doctgId = item.DocumentoTrabajoGrado.Id;
            ctrl.doc = item.DocumentoTrabajoGrado.Id;
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
                    vd.DocumentoTrabajoGrado = response.data[0].DocumentoEscrito;
                });
                $http.get("http://10.20.0.127/polux/index.php?data=sj7574MlJOsg4LjjeAOJP5CBi1dRh84M-gX_Z-i_0OmWhton7vEvfcvwRdSGHCTl2WlcEunFl-15PLUWhzSwdnO0c9_4iv7A6ODAQz8nzk3-L-wp9KXARJdYvqggsPUb&identificacion=" + vd.Usuario)
                    .then(function(response) {
                        vd.Docente = response.data[0];
                    });
            });
        });
        ctrl.refrescar = function() {
            poluxRequest.get("revision_trabajo_grado", $.param({
                limit: -1,
                query: "DocumentoTrabajoGrado:" + ctrl.doctgId + ",VinculacionTrabajoGrado:" + ctrl.vncdocId,
                sortby: "Id",
                order: "asc"
            })).then(function(response) {
                ctrl.revisionesd = response.data;
            });
        };
        ctrl.refrescar();

    });
