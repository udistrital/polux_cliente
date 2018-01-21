'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:PerfilDocenteAreasDocenteCtrl
 * @description
 * # PerfilDocenteAreasDocenteCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
    .controller('AreasDocenteCtrl', function(academicaRequest, poluxRequest) {
        var self = this;
        self.buttonDirective = "Agregar Área";
        self.removable = false;
        self.menucreacion = false;
        self.idAreas = [];
        self.ardocente = [];
        /**/
        self.estadoboton = function(estadoboton) {
            console.log("Estadoboton: " + estadoboton + " menucreacion: " + self.menucreacion);
            self.menucreacion = !self.menucreacion;
            if (estadoboton == "Agregar Área") {
                self.buttonDirective = "Cancelar";
                return false;
            } else { self.buttonDirective = "Agregar Área"; return true; }
        };
        academicaRequest.get("docentes_tg").then(function(docentes){
          if (!angular.isUndefined(docentes.data.docentesTg.docente)) {
              self.docentes=docentes.data.docentesTg.docente;
          }
        });
        //necesario para cargar las peticiones de áreas en el primer intento
        poluxRequest.get("area_conocimiento", "").then(function(response) {
            self.areas = response.data;
        });

    });
