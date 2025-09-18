'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:ManualesCtrl
 * @description
 * # ManualesCtrl
 * Controller of the poluxClienteApp.
 * Controlador de manuales. 
 */
angular.module('poluxClienteApp')
  .controller('ManualesCtrl', function ($scope, $translate) {

    $scope.recursos = [
    {
        grupo: $translate.instant("MANUALES.ROL_GENERAL"),
        items: [
          { tipo: $translate.instant("MANUALES.ITEMS_GENERAL.TIPO_UNO"), titulo: $translate.instant("MANUALES.ITEMS_GENERAL.TITULO_UNO"), url: $translate.instant("MANUALES.ITEMS_GENERAL.URL_UNO"), }
        ]
      },
      {
        grupo: $translate.instant("MANUALES.ROL_ESTUDIANTE"),
        items: [
          { tipo: $translate.instant("MANUALES.ITEMS_ESTUDIANTE.TIPO_UNO"), titulo: $translate.instant("MANUALES.ITEMS_ESTUDIANTE.TITULO_UNO"), url: $translate.instant("MANUALES.ITEMS_ESTUDIANTE.URL_UNO") },
          { tipo: $translate.instant("MANUALES.ITEMS_ESTUDIANTE.TIPO_DOS"), titulo: $translate.instant("MANUALES.ITEMS_ESTUDIANTE.TITULO_DOS"), url: $translate.instant("MANUALES.ITEMS_ESTUDIANTE.URL_DOS") }
        ]
      },
      {
        grupo: $translate.instant("MANUALES.ROL_DIRECTOR"),
        items: [
          { tipo: $translate.instant("MANUALES.ITEMS_DIRECTOR.TIPO_UNO"), titulo: $translate.instant("MANUALES.ITEMS_DIRECTOR.TITULO_UNO"), url: $translate.instant("MANUALES.ITEMS_DIRECTOR.URL_UNO") },
          { tipo: $translate.instant("MANUALES.ITEMS_DIRECTOR.TIPO_DOS"), titulo: $translate.instant("MANUALES.ITEMS_DIRECTOR.TITULO_DOS"), url: $translate.instant("MANUALES.ITEMS_DIRECTOR.URL_DOS") }
        ]
      },
      {
        grupo: $translate.instant("MANUALES.ROL_COORDINADOR"),
        items: [
          { tipo: $translate.instant("MANUALES.ITEMS_COORDINADOR.TIPO_UNO"), titulo: $translate.instant("MANUALES.ITEMS_COORDINADOR.TITULO_UNO"), url: $translate.instant("MANUALES.ITEMS_COORDINADOR.URL_UNO") },
          { tipo: $translate.instant("MANUALES.ITEMS_COORDINADOR.TIPO_DOS"), titulo: $translate.instant("MANUALES.ITEMS_COORDINADOR.TITULO_DOS"), url: $translate.instant("MANUALES.ITEMS_COORDINADOR.URL_DOS") }
        ]
      },
      {
        grupo: $translate.instant("MANUALES.ROL_OFICINA_EXTENSION"),
        items: [
          { tipo: $translate.instant("MANUALES.ITEMS_OFICINA_EXTENSION.TIPO_UNO"), titulo: $translate.instant("MANUALES.ITEMS_OFICINA_EXTENSION.TITULO_UNO"), url: $translate.instant("MANUALES.ITEMS_OFICINA_EXTENSION.URL_UNO") }
        ]
      }
    ];

    // Búsqueda
    $scope.buscar = function (item) {
      if (!$scope.searchText) return true;
      return item.titulo.toLowerCase().indexOf($scope.searchText.toLowerCase()) > -1;
    };

    // Filtro inicial
    $scope.filtro = 'all';
  });