'use strict';

/**
* @ngdoc function
* @name poluxApp.controller:DocenteTgsRevisionDocumentoCtrl
* @description
* # DocenteTgsRevisionDocumentoCtrl
* Controller of the poluxApp
*/
angular.module('poluxApp')
.controller('DocenteTgsRevisionDocumentoCtrl', function (revisionRequest,$scope) {
  var self = this;
  self.doctgId=2;//viene por la sesión
  self.vncdocId=1;
  $scope.$watch('actualizarev', function() {
    console.log("pasoooooo");
    revisionRequest.getRevisionByVinculacionDocumentoTg(self.vncdocId,self.doctgId).success(function(data){
      self.revisionesd=data;
    });
  });

  revisionRequest.getRevisionByVinculacionDocumentoTg(self.vncdocId,self.doctgId).success(function(data){
    self.revisionesd=data;
  });
});
