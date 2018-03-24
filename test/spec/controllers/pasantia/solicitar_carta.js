'use strict';

describe('Controller: PasantiaSolicitarCartaCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxClienteApp'));

  var PasantiaSolicitarCartaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PasantiaSolicitarCartaCtrl = $controller('PasantiaSolicitarCartaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PasantiaSolicitarCartaCtrl.awesomeThings.length).toBe(3);
  });
});
