'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:registrarPropuesta
 * @description
 * # registrarPropuesta
 */
angular.module('poluxClienteApp')
    .directive('registrarPropuesta', function(poluxMidRequest, academicaRequest, poluxRequest) {
        return {
            restrict: 'E',
            scope: {
                areaconsultada: '=',
                estparam: '=',
                docparam: '=',
                areasparam: '=',
                idareaparam: '=',
                dialparent: '&'
            },
            templateUrl: 'views/directives/general/propuesta/registrar-propuesta.html',
            controller: function($scope, $location, $http, token_service, nuxeo, $q, constantes) {
                var self = this;
                self.validar = false;
                var parametros = {
                    'carrera': 20
                };
                academicaRequest.obtenerEstudiantes(parametros).then(function(response) {
                    self.estudiantes = response;
                });
                self.estudianteSeleccionado = token_service.all_perfil.datos_basicos.codigo;
                self.modSeleccionada = "";
                self.buttonDirective = "Aceptar";
                poluxRequest.get("modalidad", "").then(function(response) {
                    self.modalidad = response.data;
                });
                self.estado = false;
                self.doclimpio = {};
                self.docregistrado = [];
                self.registro_TG = [];
                self.areasTG = [];
                /**/
                self.dial = function(doc) {
                    console.log("funciona llamado de directiva hija a directiva padre");
                    console.log(" " + doc.enlace);
                };

                self.asignarEstudiante = function(codEstudiante) {
                    console.log(codEstudiante);
                    codEstudiante = parseInt(codEstudiante);
                    self.parametros = $.param({
                        query: "Estudiante:" + codEstudiante
                    });
                };

                self.asignarModalidad = function(codigo) {
                    try {
                        console.log("Codigo Estudiante: " + self.estudianteSeleccionado);
                        //self.estudianteSeleccionado = parseInt(self.estudianteSeleccionado);
                        codigo = parseInt(codigo);
                        console.log("Modalidad seleccionada: " + codigo);
                        if (isNaN(codigo)) {
                            console.log("error");
                        } else {
                            self.verificarRequisitos(parseInt(self.estudianteSeleccionado), codigo);
                        }
                    } catch (Error) {
                        poluxRequest.get("modalidad", "").then(function(response) {
                            self.modalidad = response.data;
                        });

                    }

                };

                self.verificarRequisitos = function(codigo, codigoModalidad) {
                    codigo = "" + codigo;
                    academicaRequest.periodoAnterior().then(function(periodoAnterior) {

                        var parametros = {
                            "codigo": codigo,
                            "ano": periodoAnterior[0].APE_ANO,
                            "periodo": periodoAnterior[0].APE_PER
                        };
                        console.log(parametros);
                        academicaRequest.promedioEstudiante(parametros).then(function(respuestaPromedio) {
                            console.log("Entro a Promedio");
                            console.log(respuestaPromedio);
                            if (respuestaPromedio) {
                                //porcentaje cursado
                                academicaRequest.porcentajeCursado(parametros).then(function(respuestaPorcentaje) {

                                    self.estudiante = {
                                        "Codigo": parametros.codigo,
                                        "Nombre": respuestaPromedio[0].NOMBRE,
                                        "Modalidad": codigoModalidad,
                                        "Tipo": "POSGRADO",
                                        "PorcentajeCursado": respuestaPorcentaje,
                                        "Promedio": respuestaPromedio[0].PROMEDIO,
                                        "Rendimiento": "0" + respuestaPromedio[0].REG_RENDIMIENTO_AC,
                                        "Estado": respuestaPromedio[0].EST_ESTADO_EST,
                                        "Nivel": respuestaPromedio[0].TRA_NIVEL,
                                        "TipoCarrera": respuestaPromedio[0].TRA_NOMBRE

                                    };

                                    console.log(self.estudiante);
                                    self.modalidad = "MATERIAS POSGRADO";
                                    poluxMidRequest.post("verificarRequisitos/Registrar", self.estudiante).then(function(response) {
                                        console.log("response mid api: " + response.data);
                                        self.validar = response.data;
                                    });
                                });
                            }
                        });
                    });
                };

                self.estadoboton = function(estadoboton) {
                    self.menucreacion = !self.menucreacion;
                    if (estadoboton === "Aceptar") {
                        self.buttonDirective = "Volver al Formulario";
                        return false;
                    } else {
                        self.buttonDirective = "Aceptar";
                        return true;
                    }
                };

                self.guardar = function(doc, estudiante, idModalidad) {
                    var objModalidad;
                    poluxRequest.get("modalidad", $.param({
                        query: "Id:" + idModalidad
                    })).then(function(response) {
                        objModalidad = response.data;
                        console.log(objModalidad[0].Nombre);

                        swal({
                            title: 'Confirma el registro del documento:',
                            text: '' + '\n' + '"' + doc.titulo + '" en la modalidad: ' + objModalidad[0].Nombre,
                            type: 'question',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Confirmar'
                        }).then(function() {
                            var idTrabajoGrado;
                            // codEstudiante = parseInt(estudiante);
                            console.log("titulo: " + doc.titulo + " , modalidad: " + idModalidad);
                            self.registro_TG = [];
                            self.estudiante_TG = [];
                            self.docregistrado = [];
                            self.TGregistrado = [];
                            self.areas_TG = [];
                            self.docTG = [];
                            self.preguardarTG(doc.titulo, parseInt(idModalidad));
                            // console.log("self.registro_TG" + self.registro_TG);
                            self.guardarTG(self.registro_TG, estudiante, doc);

                            // console.log("idTrabajoGrado: " + idTrabajoGrado);
                            // self.estudiante_TG = self.preguardarEstudianteTG(idTrabajoGrado, estudiante);
                            // idEstudianteTG = self.guardarestudianteTG(self.estudiante_TG[0]);
                            console.log(idTrabajoGrado);
                            $scope.$apply(function() { $location.path("/general/cons_prop"); });
                            swal(
                                'Registro Existoso',
                                'El registro del documento "' + doc.titulo + '" fue creado exitosamente',
                                'success'
                            );

                        });
                    });

                };

                self.preguardarTG = function(title, mod) {
                    self.registro_TG.push({
                        "Distincion": "ninguno", //modificar base de datos para agregar check de "ninguno"
                        "Etapa": "solicitud tg",
                        "IdModalidad": {
                            "Id": mod
                        },
                        "Titulo": title
                    });
                };

                self.guardarTG = function(data, estudiante, doc) {
                    var idEstudianteTG;
                    self.TGregistrado = [];
                    poluxRequest.post("trabajo_grado", data[0]).then(function(responseTG) {
                        console.log("respuesta del post del trabajo de grado" + responseTG.data.Id);
                        self.estudiante_TG = self.preguardarEstudianteTG(responseTG.data.Id, estudiante);
                        idEstudianteTG = self.guardarestudianteTG(self.estudiante_TG[0]);
                        console.log("respuesta del post del trabajo de grado" + responseTG.data);
                        self.areas_TG = self.preguardarAreasTG(responseTG.data.Id);
                        self.asignarAreasTG(self.areas_TG);
                        self.docregistrado = self.preguardarDocumento(doc.titulo, doc.resumen, doc.enlace);
                        console.log("doc: " + self.docregistrado[0]);
                        poluxRequest.post("documento", self.docregistrado[0]).then(function(responseDoc) {
                            console.log("data.Id: " + responseDoc.data.Id);
                            self.guardarDocumentoTG(responseDoc.data.Id, responseTG.data.Id);
                            poluxRequest.get("documento", $.param({
                                query: "Id:" + responseDoc.data.Id
                            })).then(function(response) {
                                self.registroDocumento = response.data;
                            });
                        });
                    });
                };

                self.preguardarDocumento = function(titulo, resumen, enlace) {
                    self.docregistrado.push({
                        "Titulo": titulo,
                        "Resumen": resumen,
                        "Enlace": enlace,
                        "IdTipoDocumento": {
                            "Id": 1,
                            "IdCategoria": { //puede ser nulo
                                "Id": 1
                            }
                        }
                    });
                    return self.docregistrado;
                };

                self.preguardarAreasTG = function(dataIdTG) {

                    console.log("Nueva area de conocimiento" + self.nuevaArea);
                    for (var i = 0; i < self.nuevaArea.length; i++) {
                        self.areas_TG.push({
                            "IdAreaConocimiento": {
                                "Id": self.nuevaArea[i].Id,
                                "Nombre": self.nuevaArea[i].Nombre
                            },
                            "IdTrabajoGrado": {
                                "Id": dataIdTG
                            }
                        });
                    }
                    return self.areas_TG;

                };

                self.preguardarEstudianteTG = function(idTG, estudiante) {
                    estudiante = parseInt(estudiante);
                    self.estudiante_TG.push({
                        "CodigoEstudiante": estudiante,
                        "Estado": "activo",
                        "IdTrabajoGrado": {
                            "Id": idTG
                        }
                    });
                    console.log(self.estudiante_TG);
                    return self.estudiante_TG;
                };

                self.guardarestudianteTG = function(data) {
                    poluxRequest.post("estudiante_tg", data).then(function(response) {
                        console.log("respuesta del post estudiante_tg: " + response.data.Id);
                        return response.data.Id;
                    });
                };

                self.guardarDocumentoTG = function(idDocumento, IdTrabajoGrado) {
                    self.docTG.push({
                        "IdDocumento": {
                            "Id": idDocumento
                        },
                        "IdEstadoDocumento": {
                            "Id": 1
                        },
                        "IdTrabajoGrado": {
                            "Id": IdTrabajoGrado
                        }
                    });
                    self.docTGregistrado = {};
                    poluxRequest.post("documento_tg", self.docTG[0]).then(function(response) {
                        poluxRequest.get("documento_tg", $.param({
                            query: "Id:" + response.data.Id
                        })).then(function(response) {
                            self.docTGregistrado = response.data;
                        });
                    });
                };
                
                self.asignarAreasTG = function(parametro) {
                    angular.forEach(parametro, function(valor) {
                        poluxRequest.post("areas_trabajo_grado", valor).then(function(response) {
                            poluxRequest.get("areas_trabajo_grado", $.param({
                                query: "IdTrabajoGrado:" + response.data.IdTrabajoGrado
                            })).then(function(response) {
                                self.areasTG = response.data;
                            });
                        });
                    });
                };


            },
            controllerAs: 'd_regProp'
        };
    });
