'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:cargarDocumento
 * @description
 * # cargarDocumento
 * Directiva que permite cargar un documento al gestor documental.
 * Controlador: {@link poluxClienteApp.directive:cargarDocumento.controller:cargarDocumentoCtrl cargarDocumentoCtrl}
 * @param {string} name nombre del documento que se va a subir
 * @param {object} carreras carreras asociadas al coordinador que va a subir el documento
 * @param {number} acta Número del acta que se va a cargar
 * @param {object} modalidad Modalidad a la que pertenece el trabajo de grado
 * @param {object} tipodocumento Arreglo de tipos de documentos
 */
angular.module('poluxClienteApp')
  .directive('cargarDocumento', function () {
    return {
      restrict: 'E',
      scope: {
        name: '@',
        carreras: '=',
        acta: '=',
        modalidad: '=',
        tipodocumento: '='
      },
      templateUrl: 'views/directives/cargar_documento.html',
      /**
       * @ngdoc controller
       * @name poluxClienteApp.directive:cargarDocumento.controller:cargarDocumentoCtrl
       * @description
       * # cargarDocumentoCtrl
       * # Controller of the poluxClienteApp.directive:cargarDocumento
       * Controlador de la directiva {@link poluxClienteApp.directive:cargarDocumento cargarDocumento}.
       * @requires services/poluxService.service:poluxRequest
       * @requires decorators/poluxClienteApp.decorator:TextTranslate
       * @requires $filter
       * @requires $scope
       * @requires $q
       * @property {object} documento Documento que se va a cargar
       */
      controller: function (poluxRequest, $translate, $filter, $scope,utils,gestorDocumentalMidRequest,token_service) {
        var ctrl = this;
        var url;
        ctrl.documento = [];
        ctrl.userRole = token_service.getAppPayload().appUserRole;

        $scope.msgCargandoDocumento = $translate.instant("LOADING.CARGANDO_DOCUMENTO");
        if ($scope.carreras.length > 0) {
          if ($scope.carreras.length === 1) {
            $scope.carrera = $scope.carreras[0];
          }
        }

        /**
         * @ngdoc method
         * @name cargarDocumento
         * @methodOf poluxClienteApp.directive:cargarDocumento.controller:cargarDocumentoCtrl
         * @param {undefined} undefined No recibe parametros
         * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplio la petición y se resuleve con el documento.
         * @description 
         * Permite cargar un documento a {@link services/poluxService.service:gestorDocumentalMidService gestorDocumentalMidRequest}
         */
        ctrl.cargarDocumento = function(){
          var fileBase64;
          var data = [];
          var URL = "";
          let tipoDocumento = $scope.tipodocumento.find(tipoDoc => {
            return tipoDoc.CodigoAbreviacion == "ACT_PLX"
          })
          utils.getBase64(ctrl.documento.fileModel).then(
            function (base64) {
              fileBase64 = base64;
              data = [{
                IdTipoDocumento: tipoDocumento.Id, //id tipo documento de documentos_crud
                nombre: "ActaSolicitud" + ctrl.solicitud,// nombre formado por el acta de solicitud y la solicitud
                metadatos: {
                  NombreArchivo: "ActaSolicitud" + ctrl.solicitud,
                  Tipo: "Archivo",
                  Observaciones: "actas"
                },
                descripcion: "Acta de respuesta de la solicitud " + ctrl.solicitud,
                file: fileBase64,
              }]
              gestorDocumentalMidRequest.post('/document/upload', data).then(function (response) {
                URL = response.data.res.Enlace;
                url = URL;
                ctrl.enviarDocumento();
              })

            })
            .catch(function (error) {
              ctrl.swalError();
              $scope.loadFormulario = false;
            });
            return url;
        }

        /**
         * @ngdoc method
         * @name enviarDocumento
         * @methodOf poluxClienteApp.directive:cargarDocumento.controller:cargarDocumentoCtrl
         * @param {undefined} undefined No recibe parametros.
         * @returns {undefined} No retorna ningún valor.
         * @description 
         * Crea la data del documento, llama a la funcion para cargar el documento al gestor documental y luego de cargarlo
         * lo registra en {@link services/poluxService.service:poluxRequest poluxRequest}
         */
        ctrl.enviarDocumento = function () {
          /*if ($scope.carreras.length === 1) {
            ctrl.carrera = $scope.carreras[0].CODIGO_CARRERA;
          }*/
          if (ctrl.carrera !== undefined) {
            $scope.loadDocumento = true;
            //var date = $filter('date')(new Date(), 'dd-MM-yyyy');
            //Ahora la fecha se ingresa desde la vista
            var date = moment(new Date(ctrl.fechaReunion)).format("DD-MM-YYYY");
            if(ctrl.userRole.includes("CONTRATISTA")){
              ctrl.documento.nombre = $scope.name + " " + ctrl.consecutivo + " Codigo de carrera: " + ctrl.carrera.proyecto + " Fecha: " + date;
            }
            else{
              ctrl.documento.nombre = $scope.name + " " + ctrl.consecutivo + " Codigo de carrera: " + ctrl.carrera.codigo_proyecto_curricular + " Fecha: " + date;
            }
            //Se comienza a usar la subida de actas al gestor 
            // ctrl.cargarDocumento();
            let tipoDocumento = $scope.tipodocumento.find(tipoDoc => {
              return tipoDoc.CodigoAbreviacion == "ACT_PLX"
            });
            var documento = {
              "Titulo": ctrl.documento.nombre,
              "Enlace": url ,
              //"Resumen":ctrl.documento.resumen,
              "Resumen": "Acta de consejo de carrera del proyecto curricular",
              "TipoDocumentoEscrito": tipoDocumento.Id,
            };
            if ($scope.modalidad.CodigoAbreviacion == "EAPOS") {
              documento.TipoDocumentoEscrito = tipoDocumento.Id
              documento.Resumen = "Certificado de cumplimiento"
            }
            $scope.acta = [];
            $scope.acta.nombre = ctrl.documento.nombre;
            //$scope.acta.url = ctrl.documento.url;

            poluxRequest.post("documento_escrito", documento)
              .then(function (resultado) {
                $scope.acta.id = resultado.data.Data.Id;
                $('#modalSeleccionarDocumento').modal('hide');
                swal(
                  $translate.instant("CONSEJO_CARRERA.ACTA"),
                  $translate.instant("CONSEJO_CARRERA.ACTA_CARGADA"),
                  'success'
                );
                ctrl.fechaReunion = null;
                ctrl.consecutivo = null;
              })
              .catch(function (error) {
                $scope.loadDocumento = false;
                swal(
                  $translate.instant("MENSAJE_ERROR"),
                  $translate.instant("ERROR.CARGAR_DOCUMENTO"),
                  'warning'
                );
              });
            ctrl.documento = [];
            $scope.loadDocumento = true;
            /*})
            .catch(function(error){
              
              $scope.loadDocumento = false;
              swal(
                $translate.instant("MENSAJE_ERROR"),
                $translate.instant("ERROR.SUBIR_DOCUMENTO"),
                'warning'
              );*/
            
          
          } else {
            swal(
              $translate.instant("MENSAJE_ERROR"),
              $translate.instant("SELECT.SIN_CARRERA"),
              'warning'
            );
          }
        };
      },
      controllerAs: 'd_cargarDocumento'
    };
  })
  .config(function ($mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = function (date) {
      return date ? moment(date).format('DD-MM-YYYY') : '';
    };

    $mdDateLocaleProvider.parseDate = function (dateString) {
      var m = moment(dateString, 'DD-MM-YYYY', true);
      return m.isValid() ? m.toDate() : new Date(NaN);
    };
  });