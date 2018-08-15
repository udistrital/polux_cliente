'use strict';

/**
 * @ngdoc service
 * @name poluxClienteApp.cadenaService
 * @description
 * # cadenaService
 * Actualmente no se utiliza.
 * Factory in the poluxClienteApp.
 */
angular.module('cadenaService', [])
  .factory('cadenaRequest', function() {
    /*
    Permite transformar los strings a formatos de tipo titulo o Capitalize
    */
    String.prototype.toProperCase = function() {
      var i, j, str, lowers;
      str = this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });

      //Palabras que deben ir en formato tipo lowercase
      lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At',
        'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'De', 'La'
      ];
      for (i = 0, j = lowers.length; i < j; i++) {
        str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'),
          function(txt) {
            return txt.toLowerCase();
          });
      }
      return str;
    };
    /* Se llama al servicio de cadena
    y sus respectivas funciones*/
    var servicio = {
      cambiarTipoTitulo: function(str) {
        if (str) {
          return str.toProperCase();
        } else {
          return;
        }
      }
    };
    return servicio;



  });
