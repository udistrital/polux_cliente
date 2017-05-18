'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:subirDocumento
 * @description
 * # subirDocumento
 */




/*var isOnGitHub = true,
  url = 'http://localhost:9073/files';*/
angular.module('poluxClienteApp')
  .directive('subirDocumento', function () {
    return {
      restrict: 'E',
      // scope: {
      //   enlaceurl: '=',
      //   newdial: '&'
      // },
      templateUrl: 'views/directives/general/documento/subir-documento.html',
      controller: function () {

        $("#fileupload2").fileinput({
          language: 'es',
          uploadUrl: 'http://localhost:9073/files',
          uploadAsync: true,
          maxFileCount: 5,
          showBrowse: true,
          browseOnZoneClick: true,
          showAjaxErrorDetails: true,
          elErrorContainer: '#errorBlock'
        });


        $('#fileupload2').on('fileuploaderror', function(event, data, previewId, index) {
        var form = data.form, files = data.files, extra = data.extra,
            response = data.response, reader = data.reader;
        });

        $('#fileupload2').on('fileuploaded', function(event, data, previewId, index) {
          console.log(data);
        });
      },
      controllerAs: 'd_subirDocumento'
    };
  });
