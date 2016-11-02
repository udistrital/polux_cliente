'use strict';

/**
* @ngdoc service
* @name poluxApp.areasService
* @description
* # areasService
* Factory in the poluxApp.
*/
angular.module('areasService',[])
.factory('areasRequest', function ($http, $q) {
  // Service logic
  // Public API here

  var servicio = {
    areas:[],
    areasDocente:[],
    idareas:[],
    coddocente:0,

    //listado de areas disponibles para el docente
    obtenerAreas:function(){
      $http.get("http://localhost:8080/v1/area_conocimiento/?limit=0")
      .success(function(data){
        servicio.areas=data;
        //console.log(servicio.areas[1].Nombre);

      });

      return servicio.areas;

    },
    actualizarAreas:function(){
      $http.get("http://localhost:8080/v1/area_conocimiento/?limit=0")
      .success(function(data){
        servicio.areas=data;
        //console.log("nuevasareas");
        //console.log(servicio.areas);
      });
    },

    /*listar las areas del Docente,
    parametro del query: recibe el codigo del docente(IdentificacionDocente)
    */
    listarAreasDocente:function(codigoDocente){
      $http.get("http://localhost:8080/v1/areas_docente/?query=IdentificacionDocente%3A"+codigoDocente)
      .success(function(data){
        servicio.idareas=[];
        servicio.areasDocente=data;
        for (var i = 0; i < servicio.areasDocente.length; i++) {
          servicio.idareas.push(servicio.areasDocente[i].IdAreaConocimiento.Id);
        }
        console.log(servicio.idareas);
        //console.log(servicio.areasDocente);
      });

      servicio.coddocente=codigoDocente;

    },
    actualizarAreasDocente:function(){
      var codigodocente=parseFloat(servicio.coddocente);
      console.log("codigodocente:");
      console.log(codigodocente);
      $http.get("http://localhost:8080/v1/areas_docente/?query=IdentificacionDocente%3A"+codigodocente)
      .success(function(data){
        servicio.areasDocente=data;
        console.log(data);
      });

    },

    /* Asigna areas a un docente dependiendo del codigo del docente
    y de las nuevas areas

    */
    asignarAreas:function(nuevasAreas){

      //1 area
      var codigodocente=parseFloat(servicio.coddocente);
      for (var i = 0; i < nuevasAreas.length; i++) {
        console.log(nuevasAreas[i].Nombre);
        console.log(nuevasAreas[i].Id);
        if (nuevasAreas[i].Id==null) {
          console.log("areasnulas: "+nuevasAreas[i].Id);
          return;
        }

        if (nuevasAreas[i].Nombre==null) {
          console.log("nombre de area nulo");
          return;

        }
        var data = {
          IdAreaConocimiento:{
            Id:nuevasAreas[i].Id,
            Nombre:nuevasAreas[i].Nombre},
            IdentificacionDocente: codigodocente
          };
          $http.post('http://localhost:8080/v1/areas_docente',data).then(function(response){
            servicio.listarAreasDocente(response.data.IdentificacionDocente);
          });

        }

        console.log(codigodocente);
        //servicio.listarAreasDocente(codigodocente);
        return true;
      },

      crearArea: function(areaCreada){
      console.log(areaCreada[0].Nombre);
        var data = {
            Nombre: areaCreada[0].Nombre
          };

          $http.post('http://localhost:8080/v1/area_conocimiento',data).success(function(data){
            servicio.actualizarAreas();
          });
          //$http.get("http://localhost:8080/v1/area_conocimiento/");
      },

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
          },
          {
            "Id": 19,
            "Nombre": "Redes",
            "Descripcion": "string"
          },
          {
            "Id": 20,
            "Nombre": "Multimedia",
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
    return servicio;

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
