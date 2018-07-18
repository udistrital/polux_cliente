'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:cargarDocumento
 * @description
 * # cargarDocumento
 * Directiva que permite cargar un documento a nuxeo.
 * Controlador: {@link poluxClienteApp.directive:cargarDocumento.controller:cargarDocumentoCtrl cargarDocumentoCtrl}
 * @param {string} name nombre del documento que se va a subir
 * @param {object} carreras carreras asociadas al coordinador que va a subir el documento
 * @param {number} acta Número del acta que se va a cargar
 */
angular.module('poluxClienteApp')
  .directive('cargarDocumento', function () {
    return {
      restrict: 'E',
      scope:{
          name: '@',
          carreras: '=',
          acta: '=',
      },
      templateUrl: 'views/directives/cargar_documento.html',
      /**
       * @ngdoc controller
       * @name poluxClienteApp.directive:cargarDocumento.controller:cargarDocumentoCtrl
       * @description
       * # MateriasPosgradoFormalizarSolicitudCtrl
       * Controller of the poluxClienteApp.directive:cargarDocumento
       * Controlador de la directiva cargar documento.
       * @requires services/poluxService.service:poluxRequest
       * @requires decorators/poluxClienteApp.decorator:TextTranslate
       * @requires $filter
       * @requires $scope
       * @requires $q
       * @requires services/poluxClienteApp.service:nuxeoService
       * @property {object} documento Documento que se va a cargar
       */
      controller:function(poluxRequest,$translate,$filter,$scope,$q,nuxeo){
        var ctrl = this;
        ctrl.documento = [];
        $scope.msgCargandoDocumento = $translate.instant("LOADING.CARGANDO_DOCUMENTO");

        if($scope.carreras !== []){
            console.log($scope.carreras);
            if($scope.carreras.length===1){
                $scope.carrera = $scope.carreras[0];
            }
        }

        /**
         * @ngdoc method
         * @name cargarDocumento
         * @methodOf poluxClienteApp.directive:cargarDocumento.controller:cargarDocumentoCtrl
         * @param {undefined} undefined No recibe parametros
         * @returns {Promise} bjeto de tipo promesa que indica si ya se cumplio la petición y se resuleve con el documento.
         * @description 
         * Permite cargar un documento a {@link services/poluxClienteApp.service:nuxeoService nuxeo}
         */
        /*
        Se deja de utilizar la función que carga el documento a nuxeo, pues se atiende a que ahora no se suben las actas
        ctrl.cargarDocumento = function(){
          var defered = $q.defer();
          var promise = defered.promise;
          nuxeo.operation('Document.Create')
            .params({
              type: 'File',
              name: ctrl.documento.nombre,
              properties: 'dc:title=' + ctrl.documento.nombre + ' \ndc:description=' + ctrl.documento.descripcion
            })
            .input('/default-domain/workspaces/Proyectos de Grado POLUX/Actas')
            .execute()
            .then(function(doc) {
                ctrl.documento.resumen = ctrl.documento.fileModel.name;
                ctrl.documento.url = doc.uid;
                var nuxeoBlob = new Nuxeo.Blob({ content: ctrl.documento.fileModel });
                nuxeo.batchUpload()
                .upload(nuxeoBlob)
                .then(function(res) {
                  return nuxeo.operation('Blob.AttachOnDocument')
                      .param('document', doc.uid)
                      .input(res.blob)
                      .execute();
                })
                .then(function() {
                  return nuxeo.repository().fetch(doc.uid, { schemas: ['dublincore', 'file'] });
                })
                .then(function(doc) {
                  defered.resolve(doc);
                })
                .catch(function(error) {
                  defered.reject(error)
                });
            })
            .catch(function(error) {
                defered.reject(error)
            });
            return promise;
        }
        */

        /**
         * @ngdoc method
         * @name enviarDocumento
         * @methodOf poluxClienteApp.directive:cargarDocumento.controller:cargarDocumentoCtrl
         * @param {undefined} undefined No recibe parametros.
         * @returns {undefined} No retorna ningún valor.
         * @description 
         * Crea la data del documento, llama a la funcion ara cargar el documento a nuxeo y luego de cargarlo
         * lo registra en {@link services/poluxService.service:poluxRequest poluxRequest}
         */  
        ctrl.enviarDocumento = function(){
          console.log("consecutivo",ctrl.consecutivo);
          if($scope.carreras.length===1){
            ctrl.carrera = $scope.carreras[0].CODIGO_CARRERA;
          }
          if(ctrl.carrera!==undefined){
            $scope.loadDocumento = true;
            //var date = $filter('date')(new Date(), 'dd-MM-yyyy');
            //Ahora la fecha se ingresa desde la vista
            var date = moment(new Date(ctrl.fechaReunion)).format("DD-MM-YYYY");
            console.log(date);
            ctrl.documento.nombre = $scope.name+" "+ctrl.consecutivo+" Codigo de carrera:"+ctrl.carrera+" Fecha:"+date;
            //Se deja de utilizar la función de cargar el documento
            //ctrl.cargarDocumento().then(function(){
              var documento = {
                "Titulo":ctrl.documento.nombre,
                //"Enlace":ctrl.documento.url,
                //"Resumen":ctrl.documento.resumen,
                "Resumen": "Acta de consejo de carrera del proyecto curricular",
                "TipoDocumentoEscrito":1,
              }
              $scope.acta = [];
              $scope.acta.nombre = ctrl.documento.nombre;
              //$scope.acta.url = ctrl.documento.url;

              poluxRequest.post("documento_escrito",documento)
                .then(function(resultado) {
                  $scope.acta.id = resultado.data.Id;
                  $('#modalSeleccionarDocumento').modal('hide');
                  swal(
                    $translate.instant("CONSEJO_CARRERA.ACTA"),
                    $translate.instant("CONSEJO_CARRERA.ACTA_CARGADA"),
                    'success'
                  );
                })
                .catch(function(error){
                  console.log("error",error);
                  $scope.loadDocumento = false;
                  swal(
                    $translate.instant("ERROR"),
                    $translate.instant("ERROR.CARGAR_DOCUMENTO"),
                    'warning'
                  );
                });

              ctrl.documento = [];
              $scope.loadDocumento = false;
            /*})
            .catch(function(error){
              console.log("error",error);
              $scope.loadDocumento = false;
              swal(
                $translate.instant("ERROR"),
                $translate.instant("ERROR.SUBIR_DOCUMENTO"),
                'warning'
              );
            });*/
          }else{
            swal(
              $translate.instant("ERROR"),
              $translate.instant("SELECT.SIN_CARRERA"),
              'warning'
            );
          }


        }

      },
      controllerAs:'d_cargarDocumento'
    };
  });
