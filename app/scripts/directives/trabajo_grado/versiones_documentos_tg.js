'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:versionesDocumentosTg
 * @description
 * # trabajoGrado/versionesDocumentosTg
 * Directiva que permite ver los documentos asociados a un trabajo de grado y sus versiones
 * Controller: {@link poluxClienteApp.directive:versionesDocumentosTg.controller:versionesDocumentosTgCtrl versionesDocumentosTgCtrl}
 * @param {object} trabajoGrado Trabajo de grado del que se consultaran los documentos
 * @param {Boolean} veranteproyecto Booleano para indicar si se consultan los anteproyectos
 * @param {Boolean} verproyecto Booleano para indicar si se consultan los proyectos
 * @param {Boolean} verproyectorevision Booleano para indicar si se consultan los proyectos listos para revisión
 */
angular.module('poluxClienteApp')
  .directive('versionesDocumentosTg', function () {
    return {
      restrict: 'E',
      scope: {
        tg: '=',
        veranteproyecto: '=',
        verproyecto: '=',
        verproyectorevision: '='
      },
      templateUrl: 'views/directives/trabajo_grado/versiones_documentos_tg.html',
      /**
       * @ngdoc controller
       * @name poluxClienteApp.directive:versionesDocumentosTg.controller:versionesDocumentosTgCtrl
       * @description
       * # poluxClienteApp.directive:versionesDocumentosTg.controller:versionesDocumentosTgCtrl
       * Controller poluxClienteApp.directive:versionesDocumentosTg
       * Controlador de la directiva asignarEstudiante que permite ver las versiones de todos los documentos asociados al trabajo de grado
       * @requires decorators/poluxClienteApp.decorator:TextTranslate
       * @requires services/poluxService.service:poluxRequest
       * @requires $scope
       * @requires services/poluxService.service:nuxeoClient
       * @property {Object} trabajoGrado Trabajo de grado del qeu se consultarán los documentos
       * @property {Boolean} showVersiones Booleano para mostrar la directiva
       * @property {object} treeOptions Opciones para el arbol
       * @property {Array} dataForTree data para el arbol
       * @property {Boolean} loadingVersion Booleano para indicar que se estan consultando las versiones de los documentos
       * @property {Boolean} errorCargando Booleano para indicar que hubo un error cargando los parametros
       * @property {String} mensajeError Mensaje que se muestra cuando ocurre un error cargando
       */
      controller: function ($scope, nuxeoClient, $q, poluxRequest, $translate) {
        var ctrl = this;
        ctrl.mensajeCargandoDocumentos = $translate.instant('LOADING.CARGANDO_TRABAJOS_DE_GRADO_ASOCIADOS');
        $scope.showVersiones = true;

        $scope.$watch('trabajoGradoVersiones', function () {
          if ($scope.tg) {
            ctrl.consultarDocumentos($scope.tg);
          }
        });

        ctrl.treeOptions = {
          nodeChildren: "children",
          dirSelectable: true,
          injectClasses: {
            ul: "a1",
            li: "a2",
            liSelected: "a7",
            iExpanded: "a3",
            iCollapsed: "a4",
            iLeaf: "a5",
            label: "a6",
            labelSelected: "a8"
          }
        }

        ctrl.getDocumentos = function (trabajoGrado, tipoDocumento) {
          var defer = $q.defer();
          var parametrosDocumento = $.param({
            query: "TrabajoGrado.Id:" + trabajoGrado.Id
              + ",DocumentoEscrito.TipoDocumentoEscrito:" + tipoDocumento,
            limi: 1
          });
          poluxRequest.get("documento_trabajo_grado", parametrosDocumento)
            .then(function (responseDocumento) {
              if (Object.keys(responseDocumento.data[0]).length > 0) {
                ctrl.getVersiones(responseDocumento.data[0].DocumentoEscrito.Enlace)
                  .then(function (versiones) {
                    var nombreNodo = "";
                    var nombreHijo = "";
                    switch (tipoDocumento) {
                      case 3:
                        nombreNodo = $translate.instant('ANTEPROYECTO');
                        nombreHijo = $translate.instant('DOCUMENTOS_ASOCIADOS.ANTEPROYECTO');
                        break;
                      case 4:
                        nombreNodo = $translate.instant('TRABAJO_GRADO');
                        nombreHijo = $translate.instant('DOCUMENTOS_ASOCIADOS.TRABAJO_GRADO_NUMERO');
                        break;
                      case 5:
                        nombreNodo = $translate.instant('TRABAJO_GRADO_REVISION');
                        nombreHijo = $translate.instant('DOCUMENTOS_ASOCIADOS.VERSION_REVISION')
                        break;
                    }
                    angular.forEach(versiones, function (version) {
                      version.name = nombreHijo + version.get('uid:major_version')
                    });
                    ctrl.dataForTree.push({
                      name: nombreNodo,
                      children: versiones,
                    });
                    defer.resolve();
                  })
                  .catch(function (error) {
                    defer.reject(error);
                  });
              } else {
                defer.resolve();
              }
            })
            .catch(function (error) {
              defer.reject(error);
            });
          return defer.promise;
        }

        /**
         * @ngdoc method
         * @name consultarTg
         * @methodOf poluxClienteApp.directive:versionesDocumentosTg.controller:versionesDocumentosTgCtrl
         * @description 
         * Permite ver las versiones asociadas a un documento
         * @param {Object} trabajoGrado trabajo de grado del que se consultan los documentos
         * @returns {undefined} no retorna ningún valor
         */
        ctrl.consultarDocumentos = function (trabajoGrado) {
          ctrl.dataForTree = [];
          ctrl.loadingVersion = true;
          var promesasDocumentos = [];
          if ($scope.veranteproyecto) {
            //Tipo de documento 3
            promesasDocumentos.push(ctrl.getDocumentos(trabajoGrado, 3));
          }
          if ($scope.verproyecto) {
            //Tipo de documento 4
            promesasDocumentos.push(ctrl.getDocumentos(trabajoGrado, 4));
          }
          if ($scope.verproyectorevision) {
            //Tipo de documento 5
            promesasDocumentos.push(ctrl.getDocumentos(trabajoGrado, 5));
          }
          $q.all(promesasDocumentos)
            .then(function () {
              console.log("tree", ctrl.dataForTree);
              if (ctrl.dataForTree.length == 0) {
                ctrl.mensajeError = $translate.instant("NO_HAY_DOCUMENTOS");
                ctrl.errorCargando = true;
              }
              ctrl.loadingVersion = false;
            })
            .catch(function (error) {
              console.log(error);
              ctrl.mensajeError = $translate.instant("ERROR.CARGAR_DOCUMENTO");
              ctrl.errorCargando = true;
              ctrl.loadingVersion = false;
            });

        }
        /**
         * @ngdoc method
         * @name getVersiones
         * @methodOf poluxClienteApp.directive:versionesDocumentosTg.controller:versionesDocumentosTgCtrl
         * @description 
         * Permite ver las versiones asociadas a un documento
         * @param {Object} uid Uid del documento que se consultara
         * @returns {Promise} Objeto de tipo Promise que se resuelve con las versioens del documento
         */
        ctrl.getVersiones = function (uid) {
          var defer = $q.defer();
          //Cargar las versiones previas del documento
          nuxeoClient.getVersions(uid)
            .then(function (responseVersiones) {
              defer.resolve(responseVersiones);
            })
            .catch(function (error) {
              defer.reject(error);
            });
          return defer.promise;
        }

        /**
         * @ngdoc method
         * @name verDocumento
         * @methodOf poluxClienteApp.directive:versionesDocumentosTg.controller:versionesDocumentosTgCtrl
         * @description 
         * Permite ver un documento que sea versión de un trabajo de grado
         * @param {Object} doc Documento que se va a descargar
         * @returns {undefined} No hace retorno de resultados
         */
        ctrl.verDocumento = function (doc) {
          if (doc.uid) {
            ctrl.loadingVersion = true;
            nuxeoClient.getDocument(doc.uid)
              .then(function (documento) {
                ctrl.loadingVersion = false;
                window.open(documento.url);
              })
              .catch(function (error) {
                console.log("Error ->", error);
                ctrl.loadingVersion = false;
                swal(
                  $translate.instant("MENSAJE_ERROR"),
                  $translate.instant("ERROR.CARGAR_DOCUMENTO"),
                  'warning'
                );
              });
          }
        }

      },
      controllerAs: 'd_versionesDocumentosTg'
    };
  });
