'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:DocenteTgsRevisionDocumentoCtrl
 * @description
 * # DocenteTgsRevisionDocumentoCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('DocenteTgsRevisionDocumentoCtrl', function(poluxRequest) {
    var self = this;
    self.tgId = 1;
    self.doctgId = 2; //viene por la sesión
    self.doc = 1;
    self.vncdocId = 1;
    self.pagina = 2;
    poluxRequest.get("revision", $.param({
      query: "IdDocumentoTg:" + self.doctgId + ",IdVinculacionDocente:" + self.vncdocId,
      sortby: "Id",
      order: "asc",
      limit: 0
    })).then(function(response) {
      self.revisionesd = response.data;
    });



  });
