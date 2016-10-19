'use strict';

/**
 * @ngdoc service
 * @name poluxApp.materiasService
 * @description
 * # materiasService
 * Factory in the poluxApp.
 */
angular.module('materiasService',[])
.factory('materiasService', function ($http, $q) {

	  var servicio = {
			  asignaturaSeleccionada:0,
			  rutaBase:"http://localhost:8080/v1/",
			  periodoActual:0,
			  anio:0,
			  carreras:[],
			  pensums:[],
			  mostrar:[],
			  asignatura:null,
			  habilitar:false,
			  habilitar2:true,
			  totalCreditos:0,

			  cambiar:function(){
				  if(servicio.habilitar==true){
					  servicio.habilitar=false;
					  servicio.habilitar2=true;
				  }else {
					  servicio.habilitar=true;
					  servicio.habilitar2=false;
				  }
			  },

			  //periodo académico (año, periodo) inmediatamente siguiente
			  obtenerPeriodo:function(){
				  $http.get("http://10.20.0.149/polux/index.php?data=7ahS8WfGX337Xx3zJ1YUEAx6tfsY383P5LIzGYffecvVEk4D-_XRw2AMdwmVL0z3jL_h8ICqptQmbGbmka1siWypXuJCD3kPEhE-4YJTOXR-nf3m2xfG7TTOR1itS2t-")
				  .success(function(data) {
					  var jsonPeriodo = data.substring(data.indexOf("["),data.lastIndexOf('}<json>'));
					  var jsonObjPeriodo = JSON.parse(jsonPeriodo);
					  var periodoActual=jsonObjPeriodo;
					  servicio.anio=periodoActual[0].APE_ANO;
					  servicio.periodo=periodoActual[0].APE_PER;
				  });
			  },

			  //listado de carreras
			  obtenerCarreras:function(){
				  $http.get("http://10.20.0.149/polux/index.php?data=G_Rq1d3UMbgUy219X8sw57GNOCZacwFTByxJII75OkUfObyHk9IXkOUTsLTNiLsvkXVtvCjHILN-kmWa1ohBtUoNxHjJKH7xLfR2TPLaXV67rC-LqT7opfO5NBVugnqa")
				  .success(function(data) {
					  var json2 = data.substring(data.indexOf("["),data.lastIndexOf('}<json>'));
					  var jsonObj2 = JSON.parse(json2);
					  servicio.carreras = jsonObj2;
				  });
			  },

			  //listado de pensums activos de una carrera
			  obtenerPensums:function(carrera){
				  $http.get("http://10.20.0.149/polux/index.php?data=yPZPqjKYrGUY8Mu6T-zpVd5SM75h9Z5tnpaI1JIW3VO56tvo2KVBdJzDWpaZY7ZWV43TxgDl8DMSjk2VGodb13O0c9_4iv7A6ODAQz8nzk3-L-wp9KXARJdYvqggsPUb&parametro="+"&parametro="+carrera)
				  .success(function(data) {
					  var jsonPensums = data.substring(data.indexOf("["),data.lastIndexOf('}<json>'));
					  var jsonObjPensums = JSON.parse(jsonPensums);
					  servicio.pensums = jsonObjPensums;
				  });
			  },

			  //datos de una asignatura:
			  buscarAsignatura:function(codAsignatura){
				  //  var defer = $q.defer();
				  return $http.get("http://10.20.0.149/polux/index.php?data=bxIXpAqUtjqCaO7dbk-Ki37B5qT3w2CTOrkYVgklJaDLDHeI2VTm_lSlJv10OAAZ7EYostevDgQZTnkMUWasX_ofvYoMP9ZqsYhBZ2ebH0QE4RBvA0M1XoKvwZVhsEoU&parametro="+codAsignatura)
				  /*  .then(function(response) {
		            var data=response.data;
		            var json = data.substring(data.indexOf("["),data.lastIndexOf('}<json>'));
		            defer.resolve(json);
		          });
		          return defer.promise;*/
			  },

			  //modalidades de TG:
			  buscarModalidades:function(){
				  var defer = $q.defer();
				  $http.get("http://localhost:8080/v1/modalidad/")
				  .then(function(response) {
					  defer.resolve(response.data);
				  });
				  return defer.promise;
			  },

			  //listado de las asignaturas
			  listarAsignaturas:function(carrera, pensum){
				  servicio.mostrar=[];
				  $http.get("http://10.20.0.149/polux/index.php?data=fTHeXA0lGV1VA-TV_APDGCDTpUb5BW-4IdZtlOSjJELLDHeI2VTm_lSlJv10OAAZ7EYostevDgQZTnkMUWasX-SPuOks1TcNAguWQw4OJARfihBhdU3KgsGhzBuZqcbu"+"&carrera="+carrera+"&pensum="+pensum)
				  .success(function(data) {
					  var json = data.substring(data.indexOf("["),data.lastIndexOf('}<json>'));
					  var jsonObj = JSON.parse(json);

					  angular.forEach(jsonObj, function(value, key) {
						  servicio.totalCreditos=0;
						  var asig=value.ASI_COD;
						  var result= servicio.buscarAsignatura(asig);
						  result.then(function(asignatura) {
							  servicio.buscarAsignaturasElegibles(carrera, pensum, asignatura);
						  });
					  });
					  //store.tableParams = new NgTableParams({ count: 5}, { counts: [5, 10, 25], dataset: store.mostrar});
				  });
			  },

			  //buscar si hay registros en asignaturas_elegibles
			  buscarAsignaturasElegibles:function(carrera, pensum, asignatura){
				  var json = asignatura.data.substring(asignatura.data.indexOf("["),asignatura.data.lastIndexOf('}<json>'));
				  var jsonObj = JSON.parse(json);

				  $http.get("http://localhost:8080/v1/asignaturas_elegibles/?query=CodigoCarrera%3A"+carrera+"%2CAnio%3A"+servicio.anio+"%2CPeriodo%3A"+servicio.periodo+"%2CCodigoPensum%3A"+pensum+"%2CCodigoAsignatura%3A"+jsonObj[0].ASI_COD)
				  .success(function(data) {

					  if(data!=null){
						  servicio.habilitar=true;
						  servicio.habilitar2=false;

						  var nuevo = {carrera: carrera,
								  año: servicio.anio,
								  periodo: servicio.periodo,
								  pensum: pensum,
								  asignatura: jsonObj[0].ASI_COD,
								  nombre:jsonObj[0].ASI_NOMBRE,
								  creditos:jsonObj[0].PEN_CRE,
								  check: data[0].Activo
						  };

						  if(data[0].Activo){
							  var c = parseInt(jsonObj[0].PEN_CRE, 10);
							  servicio.totalCreditos=servicio.totalCreditos+c;
						  }
						  servicio.mostrar.push(nuevo);
					  }else{
						  var nuevo = {carrera: carrera,
								  año: servicio.anio,
								  periodo: servicio.periodo,
								  pensum: pensum,
								  asignatura: jsonObj[0].ASI_COD,
								  nombre:jsonObj[0].ASI_NOMBRE,
								  creditos:jsonObj[0].PEN_CRE,
								  check: false
						  };
						  servicio.mostrar.push(nuevo);
					  }
				  });
			  },

			  //buscar asignatura en la tabla de asignaturas_elegibles
			  buscarAsignaturaElegible:function(carrera, pensum, asignatura){
				  return $http.get("http://localhost:8080/v1/asignaturas_elegibles/?query=CodigoCarrera%3A"+carrera+"%2CAnio%3A"+servicio.anio+"%2CPeriodo%3A"+servicio.periodo+"%2CCodigoPensum%3A"+pensum+"%2CCodigoAsignatura%3A"+asignatura)
			  },

			//buscar nombre carrera
			  buscarNombreCarrera:function(codCarrera){
		      //  var defer = $q.defer();
		          return $http.get("http://10.20.0.149/polux/index.php?data=s-hIgfMSsEEZLG-q2qQJDhLR8GcxN4QvfQ8FCrLXTGMfObyHk9IXkOUTsLTNiLsvkXVtvCjHILN-kmWa1ohBtV1UsPxDokDAP93YXtFSq_LCBeizHsab-l4f9p_9BolU&parametro="+codCarrera)
		        /*  .then(function(response) {
		            var data=response.data;
		            var json = data.substring(data.indexOf("["),data.lastIndexOf('}<json>'));
		            defer.resolve(json);
		          });
		          return defer.promise;*/
		        },


	  };
	  return servicio;

  });
