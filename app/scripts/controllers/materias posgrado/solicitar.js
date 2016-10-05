'use strict';

/**
 * @ngdoc function
 * @name poluxApp.controller:SolicitarCtrl
 * @description
 * # SolicitarCtrl
 * Controller of the poluxApp
 */
angular.module('poluxApp')
  .controller('SolicitarCtrl', function ($http, materiasService) {
    
	  var ctrl = this;
	  ctrl.fabrica = materiasService;
	  
	  ctrl.boton=true;
	  ctrl.m=false;
	  ctrl.asig=[];
	  ctrl.asignaturas=[];
	  ctrl.solicitud=[];
	  ctrl.solicitudes=[];
	  ctrl.asign=[];
	  ctrl.estudiante={
	    "Codigo": "20102020009",
	    "Nombre": "María Fernanda Avendaño"
	  };
	  ctrl.fabrica.obtenerCarreras();
	  ctrl.fabrica.obtenerPeriodo();
	  
	  //periodo académico (año, periodo) inmediatamente siguiente
	  ctrl.obtenerPeriodo = function(){
		  return $http.get("http://10.20.0.149/polux/index.php?data=7ahS8WfGX337Xx3zJ1YUEAx6tfsY383P5LIzGYffecvVEk4D-_XRw2AMdwmVL0z3jL_h8ICqptQmbGbmka1siWypXuJCD3kPEhE-4YJTOXR-nf3m2xfG7TTOR1itS2t-")
	  };
	  
	  this.consultarAsignaturas = function(solicitud){
		  var resultado=[];
	      //buscar asignaturas asociadas a la solicitud
	      $http.get("http://localhost:8080/v1/asignatura_solicitada/?query=IdSolicitudMaterias%3A"+solicitud)
	      .success(function(data) {
	        //recorrer data y buscar datos de las asignaturas
	        angular.forEach(data, function(value, key) {
	            var result= ctrl.fabrica.buscarAsignatura(value.IdAsignaturasElegibles);
	            result.then(function(asignatura) {
	              var json = asignatura.data.substring(asignatura.data.indexOf("["),asignatura.data.lastIndexOf('}<json>'));
	              var jsonObj = JSON.parse(json);
	              resultado.push(jsonObj[0]);
	            });
	        });
	      });
	      return resultado;
	   };
	   
	   //buscar si hay TG para el estudiante: estudiante_TG
	   this.consultarTg = function(estudiante, anio, periodo){
	      $http.get("http://localhost:8080/v1/estudiante_TG/?query=CodigoEstudiante%3A%20"+estudiante)
	      .success(function(data) {
	        ctrl.hola=0;
	        ////////////////por cada TG
	        angular.forEach(data, function(value, key) {
	          ctrl.hola=ctrl.hola+1;
	          if(ctrl.hola>=2){
	        	ctrl.m=true;
	        	ctrl.boton=false;
	          }

	          if(value.IdTrabajoGrado.Id!=null){
	            var id = value.IdTrabajoGrado.Id;

	            //buscar la solicitud asociada al TG
	            $http.get("http://localhost:8080/v1/solicitud_materias/?query=IdTrabajoGrado%3A"+id+"%2CAnio%3A%20"+anio+"%2CPeriodo%3A"+periodo)
	            .success(function(data) {
	                var resultado=[];
	                //buscar nombre de la carrera
	                console.log(data[0].CodigoCarrera);

	                var result=ctrl.fabrica.buscarNombreCarrera(data[0].CodigoCarrera);
	                console.log(result);
	                result.then(function(asignatura) {
	                  var json = asignatura.data.substring(asignatura.data.indexOf("["),asignatura.data.lastIndexOf('}<json>'));
	                  console.log(json);
	                  var jsonObj = JSON.parse(json);
	                  console.log(jsonObj);
	                  resultado.push(jsonObj[0]);
	                });

	                var sol = {
	                  "Id": data[0].Id,
	                  "Fecha": data[0].Fecha,
	                  "Estado": data[0].Estado,
	                  "Formalizacion": data[0].Formalizacion,
	                  "Carrera": resultado
	                };

	                var re=ctrl.consultarAsignaturas(sol.Id);
	                var data = {
	                  "Solicitud": sol,
	                  "Asignaturas": re
	                };
	                ctrl.asignaturas.push(data);

	            });

	          };

	        });
	      });
	    };
	  
	    ctrl.buscarSolicitudes = function(codigoEst) {
	        var result= ctrl.obtenerPeriodo();
	        result.then(function(periodo) {
	          var json = periodo.data.substring(periodo.data.indexOf("["),periodo.data.lastIndexOf('}<json>'));
	          var jsonObj = JSON.parse(json);
	          var anio = jsonObj[0].APE_ANO;
	          var periodo = jsonObj[0].APE_PER;
	          ctrl.consultarTg(codigoEst, anio, periodo);
	        });
	    };
	    
	    ctrl.buscarSolicitudes(ctrl.estudiante.Codigo);

	      ctrl.myFunc = function(carreraSeleccionada) {
	        ctrl.asignaturas2=[];
	        console.log(carreraSeleccionada);
	        ctrl.carrera=carreraSeleccionada;

	        //asignaturas elegibles para ser vistas en la modalidad de espacios académicos de posgrado
	        $http.get("http://localhost:8080/v1/asignaturas_elegibles/?query=CodigoCarrera%3A"+ctrl.carrera+"%2CActivo%3Atrue")
	        .success(function(data) {

	          //recorrer data y buscar datos de las asignaturas
	          angular.forEach(data, function(value, key) {
	            //buscar asignaturas
	            var result= ctrl.fabrica.buscarAsignatura(value.CodigoAsignatura);
	            result.then(function(asignatura) {
	              var json = asignatura.data.substring(asignatura.data.indexOf("["),asignatura.data.lastIndexOf('}<json>'));
	              var jsonObj = JSON.parse(json);
	              ctrl.asignaturas2.push(jsonObj[0]);
	            });

	          });

	        });
	      };

	      this.selected = [];

	      this.toggle = function (item, list) {
	          var idx = list.indexOf(item);
	          if (idx > -1) {
	            list.splice(idx, 1);
	            var c= parseInt(item.PEN_CRE, 10);
	            ctrl.creditos=ctrl.creditos-c;
	          }
	          else {
	            list.push(item);
	            var c= parseInt(item.PEN_CRE, 10);
	            ctrl.creditos=ctrl.creditos+c;
	          }
	        };

	        ctrl.creditos=0;

	        this.add = function(){
	  ////////////////////////////////////////////////////////////////////////
	          //buscar modalidades
	          var result= ctrl.fabrica.buscarModalidades();
	            result.then(function(modalidades) {
	              ctrl.modalidad=(modalidades[0]);
	              console.log(ctrl.modalidad);

	              var data2 = {
	                "Etapa": "propuesta",
	                "IdModalidad": ctrl.modalidad,
	                "Titulo": "TG",
	                "Distincion":""
	              };

	              //registrar TG
	                    $http({
	                        method: 'POST',
	                        url: 'http://localhost:8080/v1/trabajo_grado/',
	                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	                        data: data2
	                    }).then(function successCallback(response) {

	                        ctrl.tempObject = response
	                        console.log("Status:", ctrl.tempObject);
	                        console.log("Status respuesta ", ctrl.tempObject.status);
	                        console.log("Status respuesta ", ctrl.tempObject.data);
	                        //Id del TG registrado
	                        console.log(ctrl.tempObject.data.Id);

	                        //registrar en estudiante_TG
	                        var tg_est = {
	                          "IdTrabajoGrado": ctrl.tempObject.data.Id,
	                          "CodigoEstudiante": cod,
	                          "Estado": "Activo"
	                        };
	                        /////registrar est_tg
	                            $http({
	                                method: 'POST',
	                                url: 'http://localhost:8080/v1/estudiante_TG/',
	                                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	                                data: tg_est
	                            }).then(function successCallback(response) {
	                                ctrl.tempObject = response
	                                console.log("Status:", ctrl.tempObject);
	                                console.log("Status respuesta ", ctrl.tempObject.status);
	                                console.log("Status respuesta ", ctrl.tempObject.data);
	                            }, function errorCallback(response) {
	                            });

	                        var fecha = new Date();
	                        console.log(fecha);

	                        var car = parseInt(ctrl.carrera, 10);
	                        var a = parseInt(fabrica.anio, 10);

	                          var data3 = {
	                            "CodigoCarrera": car,
	                            "Estado": "opcionado",
	                            "Formalizacion": "pendiente",
	                            "Periodo": fabrica.periodo,
	                            "IdTrabajoGrado": ctrl.tempObject.data,
	                            "Fecha": fecha,
	                            "Anio": a
	                          };

	                          /////registrar solicitud
	                          $http({
	                              method: 'POST',
	                              url: 'http://localhost:8080/v1/solicitud_materias/',
	                              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	                              data: data3
	                          }).then(function successCallback(response) {
	                              ctrl.tempObject = response
	                              console.log("Status:", ctrl.tempObject);
	                              console.log("Status respuesta ", ctrl.tempObject.status);
	                              console.log("Status respuesta ", ctrl.tempObject.data);
	                              //Id de la solicitud
	                              console.log(ctrl.tempObject.data.Id);

	                              console.log("Asignaturas seleccionadas");
	                              console.log(ctrl.selected);
	                                /////registrar asignaturas de la solicitud
	                                  angular.forEach(ctrl.selected, function(value, key) {
	                                    console.log(value);
	                                    //asignatura
	                                    var n= parseInt(value.ASI_COD, 10);
	                                    //creditos
	                                    var c= parseInt(value.PEN_CRE, 10);

	                                    var data3 = {
	                                      "IdAsignaturasElegibles": n,
	                                      "IdSolicitudMaterias": ctrl.tempObject.data.Id
	                                    };
	                                    console.log(data3);
	                                    console.log(ctrl.creditos);
	                                    if(ctrl.creditos>=8){

	                                    //registrar asignaturas de la solicitud
	                                      $http({
	                                          method: 'POST',
	                                          url: 'http://localhost:8080/v1/asignatura_solicitada/',
	                                          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	                                          data: data3
	                                      }).then(function successCallback(response) {

	                                        ctrl.tempObject = response
	                                        console.log("Status:", ctrl.tempObject);
	                                        console.log("Status respuesta ", ctrl.tempObject.status);
	                                        console.log("Status respuesta ", ctrl.tempObject.data);

	                                      }, function errorCallback(response) {
	                                        });

	                                    }else{
	                                      alert("Seleccione más de 8 créditos");
	                                    }

	                                  });


	                          }, function errorCallback(response) {
	                            });

	                    }, function errorCallback(response) {
	                    });

	          });
	  //////////////////////////////////////////////////////////////////////////////////

	      };

	      ctrl.myFunc2 = function(carreraSeleccionada) {
	        ctrl.asignaturas3=[];
	        console.log(carreraSeleccionada);
	        ctrl.carrera=carreraSeleccionada;

	        //asignaturas elegibles para ser vistas en la modalidad de espacios académicos de posgrado
	        $http.get("http://localhost:8080/v1/asignaturas_elegibles/?query=CodigoCarrera%3A"+ctrl.carrera+"%2CActivo%3Atrue")
	        .success(function(data) {

	          //recorrer data y buscar datos de las asignaturas
	          angular.forEach(data, function(value, key) {
	            var asig=value.CodigoAsignatura;

	            //datos de la asignatura
	            $http.get("http://10.20.0.149/polux/index.php?data=bxIXpAqUtjqCaO7dbk-Ki37B5qT3w2CTOrkYVgklJaDLDHeI2VTm_lSlJv10OAAZ7EYostevDgQZTnkMUWasX_ofvYoMP9ZqsYhBZ2ebH0QE4RBvA0M1XoKvwZVhsEoU&parametro="+asig)
	            .success(function(data) {
	              var json = data.substring(data.indexOf("["),data.lastIndexOf('}<json>'));
	              var jsonObj = JSON.parse(json);
	              ctrl.asignaturas3.push(jsonObj);
	            });

	          });

	        });
	      };


	    
  });
