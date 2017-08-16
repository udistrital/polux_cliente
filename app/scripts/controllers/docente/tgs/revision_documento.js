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
        ctrl.tgId = 1;
        ctrl.doctgId = 2; //viene por la sesión
        ctrl.doc = 32;
        ctrl.vncdocId = 2;
        ctrl.pagina = 1;
        ctrl.documento = false;

        ctrl.ver_seleccion = function(item, model) {
            console.log(item);
            ctrl.tgId = item.IdTrabajoGrado.Id;
            ctrl.doctgId = item.DocumentoTrabajoGrado[0].Id;
            ctrl.doc = item.DocumentoTrabajoGrado[0].IdDocumento.Id;
            ctrl.documento = true;
            ctrl.vncdocId = item.Id;
            ctrl.refrescar();
        };

        poluxRequest.get("vinculacion_docente", $.param({
            limit: -1,
            sortby: "Id",
            order: "asc"
        })).then(function(response) {
            ctrl.vinculacion_docente = response.data;
            angular.forEach(ctrl.vinculacion_docente, function(vd) {
                poluxRequest.get("documento_tg", $.param({
                    limit: -1,
                    sortby: "Id",
                    order: "asc",
                    query: "IdTrabajoGrado:" + vd.IdTrabajoGrado.Id
                })).then(function(response) {
                    vd.DocumentoTrabajoGrado = response.data;
                });
                $http.get("http://10.20.0.127/polux/index.php?data=sj7574MlJOsg4LjjeAOJP5CBi1dRh84M-gX_Z-i_0OmWhton7vEvfcvwRdSGHCTl2WlcEunFl-15PLUWhzSwdnO0c9_4iv7A6ODAQz8nzk3-L-wp9KXARJdYvqggsPUb&identificacion=" + vd.IdentificacionDocente)
                    .then(function(response) {
                        var json = response.data.split("<json>");
                        var jsonObj = JSON.parse(json[1]);
                        vd.Docente = jsonObj[0];
                    });
            });
        });
        ctrl.refrescar = function() {
            poluxRequest.get("revision", $.param({
                limit: -1,
                query: "IdDocumentoTg:" + ctrl.doctgId + ",IdVinculacionDocente:" + ctrl.vncdocId,
                sortby: "Id",
                order: "asc"
            })).then(function(response) {
                ctrl.revisionesd = response.data;
            });
        };
        ctrl.refrescar();

    });