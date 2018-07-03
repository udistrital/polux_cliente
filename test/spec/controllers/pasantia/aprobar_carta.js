'use strict';

describe('Controller: PasantiaAprobarCartaCtrl', function () {

  // load the controller's module
  beforeEach(module('poluxClienteApp'));

  var PasantiaAprobarCartaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PasantiaAprobarCartaCtrl = $controller('PasantiaAprobarCartaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PasantiaAprobarCartaCtrl.awesomeThings.length).toBe(3);
  });
});
