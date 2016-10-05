'use strict';

/**
 * @ngdoc service
 * @name poluxApp.documentoService
 * @description
 * # documentoService
 * Factory in the poluxApp.
 */
angular.module('documentoService',[])
  .factory('documentoRequest', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
