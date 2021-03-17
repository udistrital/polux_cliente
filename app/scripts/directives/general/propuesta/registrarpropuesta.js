'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:registrarPropuesta
 * @description
 * # registrarPropuesta
 * Directiva que permite registrar la propuesta de trabajo de grado de un estudiante.
 * Actualmente no se utiliza.
 * Controlador: {@link poluxClienteApp.directive:registrarPropuesta.controller:registrarPropuestaCtrl registrarPropuestaCtrl}
 * @param {object} areaconsultada Area que se selecciono para el trabajo de grado.
 * @param {array} estparam Arreglo de estudiantes asociados a la propuesta.
 * @param {array} docparam Arreglo de docentes disponibles para dirigir el trabajo de grado.
 * @param {array} areasparam Arreglo de áreas de conocimiento.
 * @param {number} idareaparam Id del área del trabajo de grado.
 * @param {object} dialparent Padre de la directiva.
 */
angular.module('poluxClienteApp')
    .directive('registrarPropuesta', function (poluxMidRequest, academicaRequest, poluxRequest) {
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
            /**
             * @ngdoc controller
             * @name poluxClienteApp.directive:registrarPropuesta.controller:registrarPropuestaCtrl
             * @description
             * # registrarPropuestaCtrl
             * # Controller of the poluxClienteApp.directive:registrarPropuesta
             * Controlador de la directiva {@link poluxClienteApp.directive:registrarPropuesta registrarPropuesta}.
             * @requires services/poluxService.service:poluxRequest
             * @requires services/poluxMidService.service:poluxMidRequest
             * @requires services/academicaService.service:academicaRequest
             * @requires decorators/poluxClienteApp.decorator:TextTranslate
             * @requires $location
             * @requires $scope
             * @requires $q
             * @requires $http
             * @requires constantes
             * @requires services/poluxClienteApp.service:nuxeoService
             * @requires services/poluxClienteApp.service:tokenService
             * @property {array} estudiantes Arreglo de estudiantes que registran la propuesta.
             * @property {object} estudianteSeleccionado Estudiante seleccionado de la lisa para registrar propuesta.
             * @property {object} modalidad Modalidad en la cual se registra la propuesta.
             * @property {boolean} validar Permite identificar si el estudiante seleccionado cumple con los requisitos para cursar una modalidad.
             * @property {array} areas_TG Areas del trabajo de grado.
             * @property {object} docTGregistrado Documento del trabajo de grado que se registra como propuesta.
             * @property {object} estudiante_TG Data del estudiante asociado al trabajo de grado.
             * @property {object} docregistrado Data que se usa para registrar el documento escrito del trabajo de grado.
             * @property {object} registro_TG Data para el registro del trabajo de grado.
             * @property {number} modalidad Modalidad en la que se registra el trabajo de grado.
             */
            controller: function ($scope, $location, $http, token_service, nuxeo, $q, constantes) {
                var self = this;
                self.validar = false;
                var parametros = {
                    'carrera': 20
                };
                academicaRequest.obtenerEstudiantes(parametros).then(function (response) {
                    self.estudiantes = response;
                });
                self.estudianteSeleccionado = token_service.all_perfil.datos_basicos.codigo;
                self.modSeleccionada = "";
                self.buttonDirective = "Aceptar";
                poluxRequest.get("modalidad", "").then(function (response) {
                    self.modalidad = response.data;
                });
                self.estado = false;
                self.doclimpio = {};
                self.docregistrado = [];
                self.registro_TG = [];
                self.areasTG = [];
                self.dial = function (doc) {
                    console.log("funciona llamado de directiva hija a directiva padre");
                    console.log(" " + doc.enlace);
                };

                /**
                 * @ngdoc method
                 * @name asignarEstudiante
                 * @methodOf poluxClienteApp.directive:registrarPropuesta.controller:registrarPropuestaCtrl
                 * @param {undefined} undefined No recibe parametros.
                 * @returns {undefined} No retorna ningún parametro.
                 * @description 
                 * Permite asignar a un estudiante un trabajo de grado.
                 */
                self.asignarEstudiante = function (codEstudiante) {
                    console.log(codEstudiante);
                    codEstudiante = parseInt(codEstudiante);
                    self.parametros = $.param({
                        query: "Estudiante:" + codEstudiante
                    });
                };

                /**
                 * @ngdoc method
                 * @name asignarModalidad
                 * @methodOf poluxClienteApp.directive:registrarPropuesta.controller:registrarPropuestaCtrl
                 * @param {number} codigo Codigo de la modalidad seleccionada.
                 * @returns {undefined} No retorna ningún parametro.
                 * @description 
                 * Permite asignar una modalidad a un trabajo de grado.
                 */
                self.asignarModalidad = function (codigo) {
                    try {
                        console.log("Codigo Estudiante: " + self.estudianteSeleccionado);
                        //self.estudianteSeleccionado = parseInt(self.estudianteSeleccionado);
                        codigo = parseInt(codigo);
                        console.log("Modalidad seleccionada: " + codigo);
                        if (isNaN(codigo)) {
                            console.log("Error.");
                        } else {
                            self.verificarRequisitos(parseInt(self.estudianteSeleccionado), codigo);
                        }
                    } catch (Error) {
                        poluxRequest.get("modalidad", "").then(function (response) {
                            self.modalidad = response.data;
                        });

                    }

                };

                /**
                 * @ngdoc method
                 * @name verificarRequisitos
                 * @methodOf poluxClienteApp.directive:registrarPropuesta.controller:registrarPropuestaCtrl
                 * @param {number} codigo Código del estudiante que se consulta.
                 * @param {number} codigoModalidad Código de la modalidad a la que se aplica.
                 * @returns {undefined} No retorna ningún parametro.
                 * @description 
                 * Permite verificar si un estudiante cumple con los requisitos, se traen los datos del estudiante
                 * del servicio {@link services/academicaService.service:academicaRequest academicaRequest} y se verifica que: el estudiante cumpla con los requisitos para
                 * cursar la modalidad y realizar la solicitud con el servicio de {@link services/poluxMidService.service:poluxMidRequest poluxMidRequest}, se verifica que el estudiante 
                 * no tenga registrado un trabajo de grado en {@link services/poluxService.service:poluxRequest poluxRequest}, se verifica la cantidad de estudiantes máximos para la solicitud
                 * en {@link services/poluxMidService.service:poluxMidRequest poluxMidRequest} y por ultimo se te verifica que no tenga solicitudes activas 
                 * en {@link services/poluxService.service:poluxRequest poluxRequest}.
                 */
                self.verificarRequisitos = function (codigo, codigoModalidad) {
                    codigo = "" + codigo;
                    academicaRequest.periodoAnterior().then(function (periodoAnterior) {

                        var parametros = {
                            "codigo": codigo,
                            "ano": periodoAnterior[0].APE_ANO,
                            "periodo": periodoAnterior[0].APE_PER
                        };
                        console.log(parametros);
                        academicaRequest.promedioEstudiante(parametros).then(function (respuestaPromedio) {
                            console.log("Entro a Promedio");
                            console.log(respuestaPromedio);
                            if (respuestaPromedio) {
                                //porcentaje cursado
                                academicaRequest.porcentajeCursado(parametros).then(function (respuestaPorcentaje) {

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
                                    poluxMidRequest.post("verificarRequisitos/Registrar", self.estudiante).then(function (response) {
                                        console.log("response mid api: " + response.data);
                                        self.validar = response.data;
                                    });
                                });
                            }
                        });
                    });
                };

                /**
                 * @ngdoc method
                 * @name estadoboton
                 * @methodOf poluxClienteApp.directive:registrarPropuesta.controller:registrarPropuestaCtrl
                 * @param {string} estadoboton Indica el estado en que se encuentra el botón.
                 * @returns {boolean} Indica el estado escogido.
                 * @description 
                 * Permite cambiar el mensaje del boton de la directiva.
                 */
                self.estadoboton = function (estadoboton) {
                    self.menucreacion = !self.menucreacion;
                    if (estadoboton === "Aceptar") {
                        self.buttonDirective = "Volver al Formulario";
                        return false;
                    } else {
                        self.buttonDirective = "Aceptar";
                        return true;
                    }
                };

                /**
                 * @ngdoc method
                 * @name guardar
                 * @methodOf poluxClienteApp.directive:registrarPropuesta.controller:registrarPropuestaCtrl
                 * @param {object} doc Doumento subido.
                 * @param {number} estudiante Estudiante que registra la propuesta.
                 * @param {number} idModalidad Id de la modalidad escogida.
                 * @returns {undefined} No retorna ningún parametro.
                 * @description 
                 * Permite guardar la propuesta.
                 */
                self.guardar = function (doc, estudiante, idModalidad) {
                    var objModalidad;
                    poluxRequest.get("modalidad", $.param({
                        query: "Id:" + idModalidad
                    })).then(function (response) {
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
                        }).then(function () {
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
                            $scope.$apply(function () { $location.path("/general/cons_prop"); });
                            swal(
                                'Registro Existoso',
                                'El registro del documento "' + doc.titulo + '" fue creado exitosamente',
                                'success'
                            );

                        });
                    });

                };

                /**
                 * @ngdoc method
                 * @name preguardarTG
                 * @methodOf poluxClienteApp.directive:registrarPropuesta.controller:registrarPropuestaCtrl
                 * @param {string} title Titulo del trabajo de grado.
                 * @param {number} mod Modalidad del trabajo de grado.
                 * @returns {undefined} No retorna ningún parametro.
                 * @description 
                 * Permite crear la data del trabajo de grado.
                 */                
                self.preguardarTG = function (title, mod) {
                    self.registro_TG.push({
                        "Distincion": "ninguno", //modificar base de datos para agregar check de "ninguno"
                        "Etapa": "solicitud tg",
                        "IdModalidad": {
                            "Id": mod
                        },
                        "Titulo": title
                    });
                };

                /**
                 * @ngdoc method
                 * @name guardarTG
                 * @methodOf poluxClienteApp.directive:registrarPropuesta.controller:registrarPropuestaCtrl
                 * @param {object} data Data del registro del trabajo de grado.
                 * @param {object} estudiante Estudiante que registra la propuesta.
                 * @param {object} doc Documento que se registra del trabajo de grado.
                 * @returns {undefined} No retorna ningún parametro.
                 * @description 
                 * Permite guardar el trabajo de grado en {@link services/poluxClienteApp.service:poluxRequest poluxRequest}.
                 */
                self.guardarTG = function (data, estudiante, doc) {
                    // var idEstudianteTG; ***Aún no se utiliza esta variable
                    self.TGregistrado = [];
                    poluxRequest.post("trabajo_grado", data[0]).then(function (responseTG) {
                        console.log("respuesta del post del trabajo de grado" + responseTG.data.Id);
                        self.estudiante_TG = self.preguardarEstudianteTG(responseTG.data.Id, estudiante);
                        // idEstudianteTG = self.guardarestudianteTG(self.estudiante_TG[0]); ***Aún no se utiliza esta variable
                        console.log("respuesta del post del trabajo de grado" + responseTG.data);
                        self.areas_TG = self.preguardarAreasTG(responseTG.data.Id);
                        self.asignarAreasTG(self.areas_TG);
                        self.docregistrado = self.preguardarDocumento(doc.titulo, doc.resumen, doc.enlace);
                        console.log("doc: " + self.docregistrado[0]);
                        poluxRequest.post("documento", self.docregistrado[0]).then(function (responseDoc) {
                            console.log("data.Id: " + responseDoc.data.Id);
                            self.guardarDocumentoTG(responseDoc.data.Id, responseTG.data.Id);
                            poluxRequest.get("documento", $.param({
                                query: "Id:" + responseDoc.data.Id
                            })).then(function (response) {
                                self.registroDocumento = response.data;
                            });
                        });
                    });
                };

                /**
                 * @ngdoc method
                 * @name preguardarDocumento
                 * @methodOf poluxClienteApp.directive:registrarPropuesta.controller:registrarPropuestaCtrl
                 * @param {string} titulo Titulo del trabajo de grado.
                 * @param {string} resumen Resumen del documento del trabajo de grado.
                 * @param {string} enlace Enlace del documento en nuxeo.
                 * @returns {array} Data para el registro del documento.
                 * @description 
                 * Permite crear la data del documento propuesta del trabajo de grado.
                 */     
                self.preguardarDocumento = function (titulo, resumen, enlace) {
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

                /**
                 * @ngdoc method
                 * @name preguardarAreasTG
                 * @methodOf poluxClienteApp.directive:registrarPropuesta.controller:registrarPropuestaCtrl
                 * @param {number} dataIdTG Identificador del trabajo de grado.
                 * @returns {array} Arreglo con la data de las áreas asociadas al trabajo de grado.
                 * @description 
                 * Permite crear la data de las áreas de conocimiento asociadas al trabajo de grado.
                 */     
                self.preguardarAreasTG = function (dataIdTG) {
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

                /**
                 * @ngdoc method
                 * @name preguardarEstudianteTG
                 * @methodOf poluxClienteApp.directive:registrarPropuesta.controller:registrarPropuestaCtrl
                 * @param {number} idTG Identificador del trabajo de grado.
                 * @param {number} estudiante Código del estudiante que se va a asociar al trabajo de grado.
                 * @returns {array} Arreglo con la data de las áreas asociadas al trabajo de grado.
                 * @description 
                 * Permite crear la data de los estudiantes asociados al trabajo de grado.
                 */     
                self.preguardarEstudianteTG = function (idTG, estudiante) {
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

                /**
                 * @ngdoc method
                 * @name guardarestudianteTG
                 * @methodOf poluxClienteApp.directive:registrarPropuesta.controller:registrarPropuestaCtrl
                 * @param {object} data Data del registro del estudiante trabajo de grado.
                 * @returns {number} Identificador de la relación registrada.
                 * @description 
                 * Permite guardar el estudiante asociado a un trabajo de trabajo de grado en {@link services/poluxClienteApp.service:poluxRequest poluxRequest}.
                 */
                self.guardarestudianteTG = function (data) {
                    poluxRequest.post("estudiante_tg", data).then(function (response) {
                        console.log("respuesta del post estudiante_tg: " + response.data.Id);
                        return response.data.Id;
                    });
                };

                /**
                 * @ngdoc method
                 * @name guardarDocumentoTG
                 * @methodOf poluxClienteApp.directive:registrarPropuesta.controller:registrarPropuestaCtrl
                 * @param {number} idDocumento Identificador del documento registrado.
                 * @param {number} idTrabajoGrado Identificador del trabajo de grado registrado.
                 * @returns {undefined} No retorna ningún parametro.
                 * @description 
                 * Permite guardar el documento trabajo de grado en {@link services/poluxClienteApp.service:poluxRequest poluxRequest}.
                 */
                self.guardarDocumentoTG = function (idDocumento, IdTrabajoGrado) {
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
                    poluxRequest.post("documento_tg", self.docTG[0]).then(function (response) {
                        poluxRequest.get("documento_tg", $.param({
                            query: "Id:" + response.data.Id
                        })).then(function (response) {
                            self.docTGregistrado = response.data;
                        });
                    });
                };

                /**
                 * @ngdoc method
                 * @name asignarAreasTG
                 * @methodOf poluxClienteApp.directive:registrarPropuesta.controller:registrarPropuestaCtrl
                 * @param {object} parametro Data de las áreas de trabajo de grado que se van a registrar.
                 * @returns {undefined} No retorna ningún parametro.
                 * @description 
                 * Permite guardar las áreas de conocimiento asociados al trabajo de grado en {@link services/poluxClienteApp.service:poluxRequest poluxRequest}.
                 */
                self.asignarAreasTG = function (parametro) {
                    angular.forEach(parametro, function (valor) {
                        poluxRequest.post("areas_trabajo_grado", valor).then(function (response) {
                            poluxRequest.get("areas_trabajo_grado", $.param({
                                query: "IdTrabajoGrado:" + response.data.IdTrabajoGrado
                            })).then(function (response) {
                                self.areasTG = response.data;
                            });
                        });
                    });
                };


            },
            controllerAs: 'd_regProp'
        };
    });
