angular.module('poluxClienteApp')
.directive('fileinput', function($timeout) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      $timeout(function() {
        // Configuración base
        const options = scope.$eval(attrs.fileinput) || {};
        $(element).fileinput(Object.assign({
          showUpload: false,
          showCaption: true,
          browseClass: "btn btn-primary",
          theme: 'explorer-fa',
          language: 'es'
        }, options));
      });
    }
  };
});
