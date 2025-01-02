'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:solicitarAsignaturas
 * @description
 * # materias/solicitarAsignaturas
 * Directiva que permite solicitar asignaturas para cursar la modalidad de espacios academicos de posgrado o de profundizacion
 * Controlador: {@link poluxClienteApp.directive:solicitarAsignaturas.controller:solicitarAsignaturasCtrl solicitarAsignaturasCtrl}
 * @param {object} estudiante Estudiante que esta realizando la solicitud
 * @param {number} modalidad Identificador de la modalidad que cursará el estudiante
 * @param {object} carrerasElegidas Contiene las carreras que el estudiante escogio si ha realizado solicitudes inicales de materias de posgrado antes para el mismo periodo.
 * @param {object} modalidades Arreglo de modalidades
 */
angular.module('poluxClienteApp')
    .directive('solicitarAsignaturas', function ($q, poluxRequest, academicaRequest, $route, poluxMidRequest) {
        return {
            restrict: 'E',
            scope: {
                estudiante: '=',
                modalidad: '=',
                modalidades: '=',
                e: '=?',
            },
            templateUrl: 'views/directives/materias/solicitar_asignaturas.html',
            /**
             * @ngdoc controller
             * @name poluxClienteApp.directive:solicitarAsignaturas.controller:solicitarAsignaturasCtrl
             * @description
             * # poluxClienteApp.directive:solicitarAsignaturas.controller:solicitarAsignaturasCtrl
             * Controller of the poluxClienteApp.directive:solicitarAsignaturas
             * Controlador de la directiva {@link poluxClienteApp.directive:solicitarAsignaturas solicitarAsignaturas} que permite a un estudiante solicitar asignaturas en las modalidades
             * de materias de posgrado y profundización
             * @requires $q
             * @requires $route
             * @requires services/academicaService.service:academicaRequest
             * @requires services/poluxMidService.service:poluxMidRequest
             * @requires services/poluxService.service:poluxRequest
             * @property {object} carreras Listado de carreras elegibles para el estudiante
             */
            controller: function ($scope, $route, $translate, $rootScope) {
                var ctrl = this;
                ctrl.dobleSolicitud = true;
                $scope.selectsDeshabilitados = false;
                ctrl.cargando = $translate.instant("LOADING.CARGANDO_ASIGNATURAS");
                ctrl.loading = true;
                ctrl.carreras = []; //Se agregan todas las carreras traídas por el endpoint de JBPM
                ctrl.selected = [];
                ctrl.selected2 = [];

                ctrl.estudiante = $scope.estudiante;
                if ($scope.estudiante.Modalidad == "EAPRO_PLX") {
                    $scope.estudiante.Tipo = "PREGRADO";
                }
                ctrl.tipo = $scope.estudiante.Tipo;
                $scope.sols = [];
                if ($scope.e === undefined) {
                    $scope.e = [];
                }
                
                /**
                 * @ngdoc method
                 * @name cargarDatos
                 * @methodOf poluxClienteApp.directive:solicitarAsignaturas.controller:solicitarAsignaturasCtrl
                 * @param {undefined} undefined No recibe parametros
                 * @returns {undefined} No retorna ningún valor
                 * @description
                 * Permite obtener los datos de las carreras y las asignaturas, primero busa el periodo academeco actual del servicio 
                 * {@link services/academicaService.service:academicaRequest academicaRequest}, consulta en {@link services/poluxMidService.service:poluxMidRequest poluxMidRequest} la cantidad de ccreditos que debe cursarse en la modalidad,
                 *  con esto busca las carreras elegibles  del servicio {@link services/poluxService.service:poluxRequest poluxRequest} y los nombres de {@link services/academicaService.service:academicaRequest academicaRequest}.
                 */
                academicaRequest.get("periodo_academico", "A").then(function (response) { //Aquí debe ir "A" - Periodo Actual, pero considero que debería ir la "X" - Periodo Futuro, para dado el caso traer todos los proyectos de pregrado o posgrado que se dictarán el siguiente semestre al actual
                    if (!angular.isUndefined(response.data.periodoAcademicoCollection.periodoAcademico)) {
                        ctrl.periodo = response.data.periodoAcademicoCollection.periodoAcademico[0];
                        console.log("ctrl.periodo", ctrl.periodo);
                    }
                    //buscar las carreras q tengan asignaturas en asignaturas_elegibles para el año y el periodo
                    var nivelAsignaturas = '';
                    let mod = $scope.modalidades.find(modalidad => {
                        return modalidad.CodigoAbreviacion == $scope.modalidad
                      });
                    console.log("mod", mod);

                    if (mod.CodigoAbreviacion == "EAPOS_PLX") {
                        nivelAsignaturas = 'POSGRADO';
                    } else {
                        nivelAsignaturas = 'PREGRADO';
                    }

                    academicaRequest.get("carreras/" + nivelAsignaturas).then(function (response) { //https://autenticacion.portaloas.udistrital.edu.co/apioas/academica_jbpm/v2/carreras/{nivel}
                        angular.forEach(response.data.carrerasCollection.carrera, function (value) {
                            var carrera = {
                                "Codigo": value.codigo,
                                "Nombre": value.nombre,
                                "Pensum": 1 //value.CodigoPensum - Dejaré 1 por el momento pero puede que se necesite crear un endpont en el que además de Código y Nombre de la Carrera, traiga también el Pensum
                            };

                            ctrl.carreras.push(carrera);
                        })

                        ctrl.loading = false;
                        
                    }).catch(function (error) {
                        console.log("error 4", error);
                        ctrl.errorCargando = true;
                        ctrl.loading = false;
                    });
                }).catch(function (error) {
                    console.log("error 5", error);
                    ctrl.errorCargando = true;
                    ctrl.loading = false;
                });

                /**
                 * @ngdoc method
                 * @name cargarMaterias
                 * @methodOf poluxClienteApp.directive:solicitarAsignaturas.controller:solicitarAsignaturasCtrl
                 * @param {number} carreraSeleccionada Identificador de la carrera seleccionada.
                 * @param {number} numeroMateria Identificador para numero de carrera seleccionada
                 * @returns {undefined} No retorna ningún valor
                 * @description
                 * Carga las materias publicadas con la carrera elegible del servicio de {@link services/poluxService.service:poluxRequest poluxRequest} y los datos de la misma (nombre y créditos) de 
                 * {@link services/academicaService.service:academicaRequest academicaRequest}.
                 */
                ctrl.cargarMaterias = function (carreraSeleccionada, numeroCarrera) {
                    if (numeroCarrera == 1) {
                        ctrl.selected[0] = carreraSeleccionada;
                        $scope.estudiante.asignaturas_elegidas = ctrl.selected;
                    } else if (numeroCarrera == 2) {
                        ctrl.selected2[0] = carreraSeleccionada;
                        $scope.estudiante.asignaturas_elegidas2 = ctrl.selected2;
                    }
                };

                // Método para confirmar la selección y deshabilitar los selects
                $scope.confirmarSeleccion = function () {                    
                    if (!$scope.estudiante.asignaturas_elegidas || $scope.estudiante.asignaturas_elegidas.length === 0) {
                        // Notificación de error si no hay asignaturas elegidas
                        swal(
                            $translate.instant("ERROR.CONFIRMAR_ASIGNATURAS_SELECCIONADAS_POSGRADO"),
                            $translate.instant("VERIFICAR_SELECCION_ASIGNATURAS_POSGRADO"),
                            'warning'
                        );
                        return;
                    }
                    if ($scope.d_solicitarAsignaturas.dobleSolicitud == false) {
                        ctrl.selected2 = [];
                        $scope.estudiante.asignaturas_elegidas2 = [];
                    }
                    console.log("scope.estudiante.asignaturas_elegidas", $scope.estudiante.asignaturas_elegidas);
                    console.log("scope.estudiante.asignaturas_elegidas2", $scope.estudiante.asignaturas_elegidas2);
                    
                    $scope.selectsDeshabilitados = true;
                    swal(
                        $translate.instant("CONFIRMAR_ASIGNATURAS_SELECCIONADAS_POSGRADO"),
                        $translate.instant("SOLICITUD_APROBADA"),
                        'success'
                      );
                };

                console.log("ctrl.carreras", ctrl.carreras);
            },
            controllerAs: 'd_solicitarAsignaturas'
        };
});
