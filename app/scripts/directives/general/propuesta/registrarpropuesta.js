'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:registrarPropuesta
 * @description
 * # registrarPropuesta
 */
angular.module('poluxClienteApp')
  .directive('registrarPropuesta', function (academicaRequest, poluxRequest) {
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
      controller: function ($scope) {
        var self = this;
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
        /**/
        self.dial = function (doc) {
          console.log("funciona llamado de directiva hija a directiva padre");
          console.log(" " + doc.enlace);
        }

        self.asignarEstudiante = function (codEstudiante) {
          console.log(codEstudiante);
          codEstudiante = parseInt(codEstudiante);
          self.parametros = $.param({
            query: "CodigoEstudiante:" + codEstudiante
          });

        };

        self.estadoboton = function (estadoboton) {
          self.menucreacion = !self.menucreacion;
          if (estadoboton == "Aceptar") {
            self.buttonDirective = "Volver al Formulario";
            return false;
          }
          else { self.buttonDirective = "Aceptar"; return true; }
        }

        /*self.guardar:
        guarda temporalmente los registros necesarios para el registro de la propuesta*/
        self.guardar = function (doc, estudiante, idModalidad) {
          var codEstudiante, idTrabajoGrado;
          codEstudiante = parseInt(estudiante);
          console.log("titulo: " + doc.titulo + " , modalidad: " + idModalidad);
          self.registro_TG = [];
          self.estudiante_TG = [];
          self.preguardarTG(doc.titulo, parseInt(idModalidad));
          console.log("self.registro_TG" + self.registro_TG);
          idTrabajoGrado = self.guardarTG(self.registro_TG, estudiante, doc);
          console.log("idTrabajoGrado: " + idTrabajoGrado);
          // self.estudiante_TG = self.preguardarEstudianteTG(idTrabajoGrado, estudiante);
          // idEstudianteTG = self.guardarestudianteTG(self.estudiante_TG[0]);
          console.log(idTrabajoGrado);
          /*
                    self.estudiante_TG = self.preguardarEstudianteTG(self.registro_TG, estudiante);
                    self.docregistrado = [];
                    self.TGregistrado = [];
                    self.areas_TG = [];
                    self.docTG = [];
                    console.log(doc.enlace);
                    poluxRequest.get("estudiante_TG", $.param({
                      query: "CodigoEstudiante:" + codEstudiante
                    })).then(function (response) {
                      console.log("respuesta: " + response.data[0].IdTrabajoGrado.Id);
                      self.TGregistrado.push(
                        {
                          "Id": response.data[0].IdTrabajoGrado.Id
                        }
                      );
                      self.areas_TG = self.preguardarAreasTG(self.TGregistrado);
                    });
                    self.docregistrado = self.preguardarDocumento(doc.titulo, doc.resumen, doc.enlace);
                    //self.file.$submit();
                    $scope.dialparent();*/

        };

        /**/

        self.preguardarTG = function (title, mod) {
          self.registro_TG.push(
            {
              "Distincion": "ninguno", //modificar base de datos para agregar check de "ninguno"
              "Etapa": "solicitud tg",
              "IdModalidad": { "Id": mod },
              "Titulo": title
            }
          );




        };


        /**/

        self.guardarTG = function (data, estudiante, doc) {
          poluxRequest.post("trabajo_grado", data[0]).then(function (response) {
            console.log("respuesta del post del trabajo de grado" + response.data.Id);
            self.estudiante_TG = self.preguardarEstudianteTG(response.data.Id, estudiante);
            idEstudianteTG = self.guardarestudianteTG(self.estudiante_TG[0]);
            self.docregistrado = self.preguardarDocumento(doc.titulo, doc.resumen, doc.enlace);
            poluxRequest.post("documento", self.docregistrado[0]).then(function (response) {
              console.log("data.Id: " + response.data.Id);
              self.guardarDocumentoTG(response.data.Id, self.TGregistrado[0]);
              poluxRequest.get("documento", $.param({
                query: "Id:" + response.data.Id
              })).then(function (response) {
                self.registroDocumento = response.data;
              });
            });
          });
        };

        /**/
        self.guardarRegistro = function () {
          self.registroDocumento = [];

          poluxRequest.post("documento", self.docregistrado[0]).then(function (response) {
            console.log("data.Id: " + response.data.Id);
            self.guardarDocumentoTG(response.data.Id, self.TGregistrado[0]);
            poluxRequest.get("documento", $.param({
              query: "Id:" + response.data.Id
            })).then(function (response) {
              self.registroDocumento = response.data;
            });
          });

          self.asignarAreasTG(self.areas_TG);
          //self.vinculaciondocente= ; PENDIENTE(TO_DO) Como se controlaría?
        };

        /**/
        self.preguardarDocumento = function (titulo, resumen, enlace) {
          self.docregistrado.push(
            {
              "Titulo": titulo,
              "Resumen": resumen,
              "Enlace": enlace,
              "IdTipoDocumento": {
                "Id": 1,
                "IdCategoria": { //puede ser nulo
                  "Id": 1
                }
              }
            }
          );
          return self.docregistrado;
        };
        /**/
        self.preguardarAreasTG = function (dataIdTG) {
          for (var i = 0; i < self.nuevaArea.length; i++) {
            self.areas_TG.push(
              {
                "IdAreaConocimiento": {
                  "Id": self.nuevaArea[i].Id,
                  "Nombre": self.nuevaArea[i].Nombre
                },
                "IdTrabajoGrado": dataIdTG[0]
              }
            );
          }
          return self.areas_TG;

        };
        /**/
        self.preguardarVinculacion = function (dataIdTG, docenteSeleccionado) {
          docenteSeleccionado = parseFloat(docenteSeleccionado);
          var fechaInicio = new Date();
          self.vinculaciondocente.push(
            {
              "Activo": true,
              "FechaInicio": fechaInicio,
              "IdTipoVinculacion": {
                "Id": 1
              },
              "IdTrabajoGrado": dataIdTG[0],
              "IdentificacionDocente": docenteSeleccionado
            }
          );
          return self.vinculaciondocente;

        };
        /**/
        self.preguardarEstudianteTG = function (idTG, estudiante) {
          estudiante = parseInt(estudiante);
          self.estudiante_TG.push(
            {
              "CodigoEstudiante": estudiante,
              "Estado": "activo",
              "IdTrabajoGrado": { "Id": idTG }
            });
          console.log(self.estudiante_TG);
          return self.estudiante_TG;
        };

        /**/
        self.guardarestudianteTG = function (data) {
          poluxRequest.post("estudiante_tg", data).then(function (response) {
            console.log("respuesta del post estudiante_tg: " + response.data.Id);
            return response.data.Id;
          });
        }
        /**/
        self.guardarDocumentoTG = function (idDocumento, IdTrabajoGrado) {
          self.docTG.push(
            {
              "IdDocumento": {
                "Id": idDocumento
              },
              "IdEstadoDocumento": {
                "Id": 1
              },
              "IdTrabajoGrado": IdTrabajoGrado
            }
          );
          self.docTGregistrado = {};
          poluxRequest.post("documento_tg", self.docTG[0]).then(function (response) {
            poluxRequest.get("documento_tg", $.param({
              query: "Id:" + response.data.Id
            })).then(function (response) {
              self.docTGregistrado = response.data;
            });
          });
        };
        /**/
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

        /**/
        self.limpiar = function () {
          self.documento = angular.copy(self.doclimpio);
          self.nuevaArea = [];
        };

      },
      controllerAs: 'd_regProp'
    };
  });
