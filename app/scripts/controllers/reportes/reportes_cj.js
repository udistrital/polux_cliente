'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:ReportesCtCtrl
 * @description
 * # reportegeneral
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
    .controller('ReportesCtCtrl', function($location, $q, $routeParams, $sce, $scope, $translate, $window, academicaRequest, cidcRequest, coreAmazonCrudService, poluxMidRequest, poluxRequest, sesionesRequest,uiGridExporterConstants, oikosRequest, token_service,$window) 
    {
       var self = this;
       self.nombreReporte=null;
});