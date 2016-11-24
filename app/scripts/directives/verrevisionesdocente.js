'use strict';

/**
 * @ngdoc directive
 * @name poluxApp.directive:listarDocumentosTg
 * @description
 * # listarDocumentosTg
 */
angular.module('poluxApp')
  .directive('verRevisionesDocente', function (NgTableParams,revisionRequest) {
    return {
      restrict: "E",
    /*  scope: {
        parametro: '='
      },*/
      templateUrl: "views/directives/ver-revisiones-docente.html",
      controller: function() {
      var self = this;
      self.revisiones



      var simpleList=datos;
      self.libro ={};
      self.agregar= function(libro){
        simpleList.push(libro);
        this.libro={};
      };
      self.tableParams = new NgTableParams({count: 5}, {
        counts: [5, 10, 20,40],
        dataset: simpleList
      });
      },
      controllerAs: "ldocumentostg"
    };
  });
  var datos=[{"id_documento":1,"titulo":"SQL sentencias basicas","descripcion":"sentencias select, insert, update, delete ","url":"documentos\/trysql-slides.pdf"},{"id_documento":2,"titulo":"SQL intermedio","descripcion":"sentencias de creacion, filtros y ordenamiento","url":"documentos\/CodeSchool-TheSequelToSQL-1-2.pdf"},{"id_documento":3,"titulo":"titulo prueba 1","descripcion":"descripcion prueba del sistema","url":"documentos\/CodeSchool-TheSequelToSQL-1-2.pdf"},{"id_documento":4,"titulo":"titulo prueba 2","descripcion":"descripcion prueba de la base de datos","url":"documentos\/CodeSchool-TheSequelToSQL-1-2.pdf"},{"id_documento":5,"titulo":"titulo prueba 3","descripcion":"descripcion prueba del bpmn","url":"documentos\/CodeSchool-TheSequelToSQL-1-2.pdf"},{"id_documento":6,"titulo":"titulo prueba 4","descripcion":"descripcion prueba del sistema 2","url":"documentos\/CodeSchool-TheSequelToSQL-1-2.pdf"},{"id_documento":7,"titulo":"titulo prueba 1","descripcion":"descripcion scsa","url":"documentos\/CodeSchool-TheSequelToSQL-1-2.pdf"},{"id_documento":8,"titulo":"titulo prueba 1s","descripcion":"descripcion nanannana","url":"documentos\/CodeSchool-TheSequelToSQL-1-2.pdf"},{"id_documento":9,"titulo":"titulo prueba 1saf","descripcion":"hola mundo?","url":"documentos\/CodeSchool-TheSequelToSQL-1-2.pdf"},{"id_documento":10,"titulo":"titulo prueba 1as","descripcion":"observaci\u00f3n de t\u00edldes ","url":"documentos\/CodeSchool-TheSequelToSQL-1-2.pdf"},{"id_documento":11,"titulo":"title","descripcion":"oihoihio","url":"documentos\/CodeSchool-TheSequelToSQL-1-2.pdf"}];
