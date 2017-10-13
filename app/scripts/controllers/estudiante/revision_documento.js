'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
 * @description
 * # EstudianteRevisionDocumentoCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
    .controller('EstudianteRevisionDocumentoCtrl', function(poluxRequest, $route, $http) {
        var ctrl = this;
        ctrl.tgId = 1;
        ctrl.doctgId = 2; //viene por la sesión
        ctrl.doc = 1;
        ctrl.vncdocId = 1;
        ctrl.pagina = 2;
        ctrl.documento = false;

        ctrl.ver_seleccion = function(item, model) {
            console.log(item);
            ctrl.tgId = item.TrabajoGrado.Id;
            ctrl.doctgId = item.DocumentoTrabajoGrado[0].Id;
            ctrl.doc = item.DocumentoTrabajoGrado[0].DocumentoEscrito.Id;
            ctrl.documento = true;
            ctrl.vncdocId = item.Id;
            ctrl.refrescar();
        };

        poluxRequest.get("vinculacion_trabajo_grado", $.param({
            limit: -1,
            sortby: "Id",
            order: "asc"
        })).then(function(response) {
            console.log(response);
            ctrl.vinculacion_docente = response.data;
            angular.forEach(ctrl.vinculacion_docente, function(vd) {
                console.log(vd);
                poluxRequest.get("documento_trabajo_grado", $.param({
                    limit: -1,
                    sortby: "Id",
                    order: "asc",
                    query: "TrabajoGrado:" + vd.TrabajoGrado.Id
                })).then(function(response) {
                  console.log(response);
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
                query: "documento_trabajo_grado:" + ctrl.doctgId + ",vinculacion_trabajo_grado:" + ctrl.vncdocId,
                sortby: "Id",
                order: "asc",
                limit: 0
            })).then(function(response) {
                ctrl.revisionesd = response.data;
                if (ctrl.revisionesd != null) {
                    ctrl.numRevisiones = ctrl.revisionesd.length;
                }

            });

            poluxRequest.get("vinculacion_trabajo_grado", $.param({
                query: "Id:" + ctrl.vncdocId
            })).then(function(response) {
              console.log(ctrl.vncdocId);
              console.log(response.data[0]);
                ctrl.vinculacion_info = response.data[0];
            });
        };
        ctrl.refrescar();

        ctrl.solicitar_revision = function() {
            var docente = {};
            $http.get("http://10.20.0.127/polux/index.php?data=sj7574MlJOsg4LjjeAOJP5CBi1dRh84M-gX_Z-i_0OmWhton7vEvfcvwRdSGHCTl2WlcEunFl-15PLUWhzSwdnO0c9_4iv7A6ODAQz8nzk3-L-wp9KXARJdYvqggsPUb&identificacion=" + ctrl.vinculacion_info.IdentificacionDocente)
                .then(function(response) {
                    var json = response.data.split("<json>");
                    var jsonObj = JSON.parse(json[1]);
                    docente = jsonObj[0];
                    swal({
                        title: 'Solicitud de Revisión?',
                        text: "Desea realizar la solicitud de revision para " + ctrl.vinculacion_info.IdTrabajoGrado.Titulo + "al docente " + docente.DOC_NOMBRE + " " + docente.DOC_APELLIDO,
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Confirmar'
                    }).then(function() {
                        var numero_revision = 0;
                        if (ctrl.revisionesd == null) {
                            numero_revision = 1;
                        } else {
                            numero_revision = ctrl.revisionesd[ctrl.numRevisiones - 1].NumeroRevision + 1;
                        }
                        var revision = {
                            IdDocumentoTg: {
                                Id: ctrl.doctgId
                            },
                            IdVinculacionDocente: {
                                Id: ctrl.vncdocId
                            },
                            NumeroRevision: numero_revision,
                            Estado: "pendiente",
                            FechaRecepcion: new Date()
                        };

                        ctrl.solicitarev = true;
                        if (ctrl.revisionesd != null) {
                            for (var i = 0; i < ctrl.revisionesd.length; i++) {
                                if (ctrl.revisionesd[i].Estado === "pendiente" || ctrl.revisionesd[i].Estado === "borrador") {
                                    ctrl.solicitarev = false;
                                    break;
                                }
                            }
                        }
                        if (ctrl.solicitarev) {
                            poluxRequest.post("revision", revision).then(function(response) {
                                console.log(response.data);
                                swal(
                                    'Revisión Solicitada',
                                    'La revisión No ' + response.data.NumeroRevision + " fue solicitada exitosamente",
                                    'success'
                                );
                                $route.reload();
                            });
                        } else {
                            swal(
                                'Revisión No Solicitada',
                                'la revision ya se encuentra solicitada',
                                'warning'
                            );
                        }

                    });
                });
        };

    });
