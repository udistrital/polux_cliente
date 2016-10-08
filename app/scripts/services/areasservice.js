'use strict';

/**
* @ngdoc service
* @name poluxApp.areasService
* @description
* # areasService
* Factory in the poluxApp.
*/
angular.module('areasService',[])
.factory('areasService', function () {
  // Service logic
  // ...

  var meaningOfLife = 42;

  // Public API here
  return {
    getAll: function () {
      var areas = [
        {
          "Id": 1,
          "Nombre": "Auditoría",
          "Descripcion": "string"
        },
        {
          "Id": 2,
          "Nombre":"Factores humanos",
          "Descripcion": "string"
        },
        {
          "Id": 3,
          "Nombre": "Geomatica",
          "Descripcion": "string"
        },
        {
          "Id": 4,
          "Nombre": "Gestión de proyectos",
          "Descripcion": "string"
        },
        {
          "Id": 5,
          "Nombre": "Ingeniería de Software",
          "Descripcion": "string"
        },
        {
          "Id": 6,
          "Nombre": "Inteligencia Artificial",
          "Descripcion": "string"
        }
      ];
      return areas;
    },
    getNew: function(){
      var areas = [
        {
          "Id": 7,
          "Nombre": "Gestión empresarial",
          "Descripcion": "string"
        },
        {
          "Id":8,
          "Nombre":"Gestión e innovación tecnológica",
          "Descripcion": "string"
        },
        {
          "Id": 9,
          "Nombre": "Modelos de procesos en sistemas productivos",
          "Descripcion": "string"
        },
        {
          "Id": 10,
          "Nombre": "Planeación Estratégica",
          "Descripcion": "string"
        },
        {
          "Id": 11,
          "Nombre": "Seguridad Informática",
          "Descripcion": "string"
        },
        {
          "Id": 12,
          "Nombre": "Sistemas Complejos",
          "Descripcion": "string"
        },
        {
          "Id": 13,
          "Nombre": "Ciencias de la computacion",
          "Descripcion": "string"
        },
        {
          "Id": 14,
          "Nombre": "Sistemas distribuidos y Redes",
          "Descripcion": "string"
        }
      ];
      return areas;
    }

  };
});
/*Base de datos
Software
"Nombre":Factores humanos,
"Nombre":Geomatica,
"Nombre":Gestión de proyectos,
"Nombre":Gestión del conocimiento,
"Nombre":Gestión e innovación tecnológica,
"Nombre":Gestión empresarial,
"Nombre":Ingeniería de Software,
"Nombre":Inteligencia Artificial,
"Nombre":Inteligencia Organizacional,
"Nombre":Modelos de procesos en sistemas productivos,
"Nombre":Modelos matemáticos,
"Nombre":Optimización de procesos,
"Nombre":Planeación Estratégica,
"Nombre":Seguridad, Higiene y Ergonomía,
"Nombre":Seguridad Informática,
"Nombre":Sistemas Complejos,
"Nombre":Sistemas de control,
"Nombre":Sistemas distribuidos y Redes,
"Nombre":Ciencias de la computacion,
"Nombre":Ingeniería de software,*/
