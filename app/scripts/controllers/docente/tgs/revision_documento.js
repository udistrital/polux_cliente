'use strict';

/**
* @ngdoc function
* @name poluxApp.controller:DocenteTgsRevisionDocumentoCtrl
* @description
* # DocenteTgsRevisionDocumentoCtrl
* Controller of the poluxApp
*/
angular.module('poluxApp')
.controller('DocenteTgsRevisionDocumentoCtrl', function (revisionRequest) {
  var self = this;
  self.doctgId=1;
  self.vncdocId=1;
  revisionRequest.getRevisionByVinculacionDocumentoTg(self.vncdocId,self.doctgId).success(function(data){
    self.revisionesd=data;
  });
});
