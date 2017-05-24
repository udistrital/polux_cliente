'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('AboutCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

        $("#fileupload").fileinput({
          language: 'es',
          uploadUrl: 'http://localhost:9073/files',
          uploadAsync: true,
          maxFileCount: 5,
          showBrowse: true,
          browseOnZoneClick: true,
          showAjaxErrorDetails: true,
          elErrorContainer: '#errorBlock'
        });


        $('#fileupload').on('fileuploaderror', function (event, data, previewId, index) {
          var form = data.form, files = data.files, extra = data.extra,
            response = data.response, reader = data.reader;
        });

        $('#fileupload').on('fileuploaded', function (event, data, previewId, index) {
          console.log(data);
        });

  });
