'use strict';

/**
 * @ngdoc function
 * @name poluxApp.controller:DocenteTgsRevisionDocumentoCtrl
 * @description
 * # DocenteTgsRevisionDocumentoCtrl
 * Controller of the poluxApp
 */
angular.module('poluxApp')
  .controller('DocenteTgsRevisionDocumentoCtrl', function (poluxRequest) {
    var self = this;
    self.doctgId=2;//viene por la sesión
    self.doc=1;
    self.vncdocId=1;
    self.pagina=2;
    poluxRequest.get("revision",$.param({
      query:"IdDocumentoTg:"+self.doctgId+",IdVinculacionDocente:"+self.vncdocId,
      sortby:"Id",
      order:"asc"
    })).then(function(response){
      self.revisionesd=response.data;
    });
  });
