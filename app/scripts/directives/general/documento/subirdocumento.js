'use strict';

/**
 * @ngdoc directive
 * @name poluxApp.directive:subirDocumento
 * @description
 * # subirDocumento
 */
var isOnGitHub = true,
url = 'http://localhost:9073/files';
angular.module('poluxApp')
.config([
    '$httpProvider', 'fileUploadProvider',
    function ($httpProvider, fileUploadProvider) {
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        fileUploadProvider.defaults.redirect = window.location.href.replace(
            /\/[^\/]*$/,
            '/cors/result.html?%s'
        );
        if (isOnGitHub) {
            // Demo settings:
            angular.extend(fileUploadProvider.defaults, {
                // Enable image resizing, except for Android and Opera,
                // which actually support image resizing, but fail to
                // send Blob objects via XHR requests:
                disableImageResize: /Android(?!.*Chrome)|Opera/
                    .test(window.navigator.userAgent),
                maxFileSize: 999000,
                acceptFileTypes: /(\.|\/)(gif|jpe?g|png|pdf)$/i
            });

        }
    }
])
  .directive('subirDocumento', function () {
    return {
      restrict: 'E',
      scope: {
          enlaceurl: '=',
          newdial:'&'
      },
      templateUrl: 'views/directives/general/documento/subir-documento.html',
      controller:function($scope, $http, $filter, $window){
        var ctrl = this;
        var file = $scope.file;
        var state;
        $scope.options = {
          url: url
        };


        $scope.enlaceurl= url;
        // if (!isOnGitHub) {
        //   $scope.loadingFiles = true;
        //   $http.get(url)
        //   .then(
        //     function (response) {
        //       $scope.loadingFiles = false;
        //       $scope.queue = response.data.files || [];
        //       console.log($scope.queue);
        //     },
        //     function () {
        //       $scope.loadingFiles = false;
        //     }
        //   );
        // }
        //
        // if (file) {
        //   file.$state = function () {
        //     return state;
        //   };
        //   file.$destroy = function () {
        //     state = 'pending';
        //     return $http({
        //       url: file.deleteUrl,
        //       method: file.deleteType
        //     }).then(
        //       function () {
        //         state = 'resolved';
        //         $scope.clear(file);
        //       },
        //       function () {
        //         state = 'rejected';
        //       }
        //     );
        //   };
        // }
        // ctrl.cargarArchivo = function(url){
        //
        // }
        // ctrl.cargarArchivo($scope.options.url);

      },
      controllerAs:'d_subirDocumento'
    };
  });
