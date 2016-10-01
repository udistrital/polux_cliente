'use strict';

/**
 * @ngdoc function
 * @name poluxApp.controller:PublicarasignaturasCtrl
 * @description
 * # PublicarasignaturasCtrl
 * Controller of the poluxApp
 */
angular.module('poluxApp')
  .controller('PublicarasignaturasCtrl', function ($http, NgTableParams, materiasService) {
	  var habilitar = true;
	  var habilitar2 = false;
	  var ctrl = this;
	  ctrl.habilitar = true;
	  ctrl.fabrica = materiasService;
	  ctrl.fabrica.obtenerPeriodo();
	  ctrl.fabrica.obtenerCarreras();

	  ctrl.myFunc = function(carreraSeleccionada) {
		  ctrl.fabrica.mostrar=[];
		  ctrl.carrera=carreraSeleccionada;
		  ctrl.fabrica.obtenerPensums(carreraSeleccionada);
	  };

	  ctrl.myFunc2 = function(pensumSeleccionado) {
		  ctrl.pensum=pensumSeleccionado;
		  ctrl.fabrica.listarAsignaturas(ctrl.carrera, ctrl.pensum);
		  ctrl.fabrica.habilitar=false;
		  ctrl.fabrica.habilitar2=true;
	  };

	  this.selected = [];
	  ctrl.creditos=0;
	  ctrl.fabrica.totalCreditos=0;

	  this.toggle = function (item, list) {
		  var idx = list.indexOf(item);
		  if (idx > -1) {
			  list.splice(idx, 1);
			  var c= parseInt(item.creditos, 10);
		  }
		  else {
			  list.push(item);
			  var c= parseInt(item.creditos, 10);
		  }
		  if(item.check===true){
			  ctrl.fabrica.totalCreditos=ctrl.fabrica.totalCreditos-c;
		  }else{
			  ctrl.fabrica.totalCreditos=ctrl.fabrica.totalCreditos+c;
		  }
	  };

	  this.add = function(){
		  ctrl.fabrica.cambiar();
		  //guardar las asignaturas seleccionadas
		  angular.forEach(this.selected, function(value, key) {
			  //asignatura
			  var n= parseInt(value.asignatura, 10);
			  //creditos
			  var c= parseInt(value.creditos, 10);
			  var carrera= parseInt(ctrl.carrera, 10);
			  var pen= parseInt(value.pensum, 10);
			  var periodo=parseInt(materiasService.periodo, 10);
			  var anio=parseInt(materiasService.anio, 10);

			  var data = {
					  "Anio": anio,
					  "CodigoAsignatura": n,
					  "CodigoCarrera": carrera,
					  "CodigoPensum": pen,
					  "Periodo": periodo,
					  "Activo": true
			  };
			  if(ctrl.fabrica.totalCreditos>=8){

				  //antes de guardar la asignatura, se debe verificar que no esté registrada
				  //si no está registrada, guardarla
				  //si está registrada, actualizar el estado
				  var result=ctrl.fabrica.buscarAsignaturaElegible(ctrl.carrera, value.pensum, n);
				  result.then(function(asignatura) {

					  if(asignatura.data==null){
						  $http({
							  method: 'POST',
							  url: 'http://localhost:8080/v1/asignaturas_elegibles',
							  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
							  data: data
						  }).then(function successCallback(response) {
							  ctrl.fabrica.habilitar=true;
							  ctrl.fabrica.habilitar2=false;
							  ctrl.tempObject = response
							  console.log("Status:", ctrl.tempObject);
							  console.log("Status respuesta ", ctrl.tempObject.status);
							  console.log("Status respuesta ", ctrl.tempObject.data);
						  }, function errorCallback(response) {
						  });
					  }else{
						  //si está registrada, actualizar el estado
						  var id = asignatura.data[0].Id;
						  var estado = asignatura.data[0].Activo;
						  if(estado===false){
							  estado=true;
						  }else{
							  estado=false;
						  }

						  var dataModificado = {
								  "Anio": anio,
								  "CodigoAsignatura": n,
								  "CodigoCarrera": carrera,
								  "CodigoPensum": pen,
								  "Periodo": periodo,
								  "Activo": estado
						  };
						  $http({
							  method: 'PUT',
							  url: 'http://localhost:8080/v1/asignaturas_elegibles/'+id,
							  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
							  data: dataModificado
						  }).then(function successCallback(response) {
							  ctrl.tempObject = response
							  console.log("Status:", ctrl.tempObject);
							  console.log("Status respuesta ", ctrl.tempObject.status);
							  console.log("Status respuesta ", ctrl.tempObject.data);
						  }, function errorCallback(response) {
						  });
					  }

				  });
			  }

			  else{
				  alert("Seleccione más de 8 créditos");
				  ctrl.fabrica.habilitar=false;
				  ctrl.fabrica.habilitar2=true;
			  }

		  });

	  };

	  
  });
